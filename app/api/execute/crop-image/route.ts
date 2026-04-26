import { NextRequest, NextResponse } from 'next/server'
import { tasks, runs } from '@trigger.dev/sdk/v3'

export const maxDuration = 300
import { z } from 'zod'
import prisma from '@/lib/prisma'
import type { cropImageTask } from '@/trigger/tasks/crop-image'

const schema = z.object({
  imageUrl: z.string().min(1, 'imageUrl is required'),
  // coerce handles string numbers like "100" or "0" from DAG executor
  x: z.coerce.number().min(0).max(100).default(0),
  y: z.coerce.number().min(0).max(100).default(0),
  width:  z.coerce.number().min(0).max(100).default(100),
  height: z.coerce.number().min(0).max(100).default(100),
  nodeId: z.string().optional(),
  workflowRunId: z.string().optional(),
})

/** Transloadit /http/import cannot fetch blob: or data: URLs — passthrough only */
function isUnfetchableUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:')
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const triggerKey = process.env.TRIGGER_SECRET_KEY

    let output: string
    let executionMethod = 'trigger.dev'

    // ── EARLY PASSTHROUGH: blob/data URLs cannot be fetched by Transloadit ──
    if (isUnfetchableUrl(body.imageUrl)) {
      console.warn('crop-image: imageUrl is a blob/data URL — cannot process server-side, returning as-is')
      return NextResponse.json({ success: true, output: body.imageUrl, method: 'blob-passthrough' })
    }

    if (triggerKey) {
      // ── PRIMARY: Execute via Trigger.dev task (uses Transloadit/FFmpeg) ──
      try {
        const handle = await tasks.trigger<typeof cropImageTask>('crop-image-node', {
          imageUrl: body.imageUrl,
          x: body.x,
          y: body.y,
          width: body.width,
          height: body.height,
          workflowRunId: body.workflowRunId,
          nodeId: body.nodeId,
        })
        const run = await Promise.race([
          runs.poll(handle.id, { pollIntervalMs: 1500 }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Trigger.dev poll timed out after 45s')), 45_000)
          ),
        ])

        if (run.status === 'COMPLETED' && run.output) {
          output = (run.output as any).output
        } else {
          throw new Error(run.status === 'FAILED' ? 'Trigger.dev crop task failed' : `Unexpected status: ${run.status}`)
        }
      } catch (triggerErr: any) {
        console.warn('Trigger.dev crop failed, returning original URL as passthrough:', triggerErr.message)
        // Without Transloadit/FFmpeg available, pass through the original image
        executionMethod = 'passthrough-fallback'
        output = body.imageUrl
      }
    } else {
      // ── FALLBACK: No Trigger.dev configured — passthrough ──
      executionMethod = 'passthrough'
      console.warn('TRIGGER_SECRET_KEY not set — crop-image returning original URL as passthrough')
      output = body.imageUrl
    }

    // Save to DB (skip if Trigger.dev task already saved)
    if (executionMethod !== 'trigger.dev' && body.workflowRunId && body.nodeId && !body.workflowRunId.startsWith('local-')) {
      try {
        await prisma.nodeRun.create({
          data: {
            workflowRunId: body.workflowRunId,
            nodeId: body.nodeId,
            nodeType: 'cropImageNode',
            status: 'success',
            inputs: { imageUrl: body.imageUrl, x: body.x, y: body.y, width: body.width, height: body.height },
            outputs: { imageUrl: output },
            endedAt: new Date(),
          },
        })
      } catch (dbErr) {
        console.warn('Could not save nodeRun:', dbErr)
      }
    }

    return NextResponse.json({ success: true, output, method: executionMethod })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
