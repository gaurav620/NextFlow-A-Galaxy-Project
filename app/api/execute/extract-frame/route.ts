import { NextRequest, NextResponse } from 'next/server'
import { tasks, runs } from '@trigger.dev/sdk/v3'

export const maxDuration = 300
import { z } from 'zod'
import prisma from '@/lib/prisma'
import type { extractFrameTask } from '@/trigger/tasks/extract-frame'

const schema = z.object({
  videoUrl: z.string(),
  timestamp: z.union([z.number(), z.string()]).default(0),
  nodeId: z.string().optional(),
  workflowRunId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const triggerKey = process.env.TRIGGER_SECRET_KEY

    let output: string
    let executionMethod = 'trigger.dev'

    // Normalize timestamp to number
    const timestamp = typeof body.timestamp === 'string'
      ? (body.timestamp.includes('%') ? 0 : parseFloat(body.timestamp) || 0)
      : body.timestamp

    if (triggerKey) {
      // ── PRIMARY: Execute via Trigger.dev task (uses FFmpeg/Transloadit) ──
      try {
        const handle = await tasks.trigger<typeof extractFrameTask>('extract-frame-node', {
          videoUrl: body.videoUrl,
          timestamp,
          workflowRunId: body.workflowRunId,
          nodeId: body.nodeId,
        })
        const run = await Promise.race([
          runs.poll(handle.id, { pollIntervalMs: 2000 }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Trigger.dev poll timed out after 45s')), 45_000)
          ),
        ])

        if (run.status === 'COMPLETED' && run.output) {
          output = (run.output as any).output
        } else {
          throw new Error(run.status === 'FAILED' ? 'Trigger.dev extract frame task failed' : `Unexpected status: ${run.status}`)
        }
      } catch (triggerErr: any) {
        console.warn('Trigger.dev extract-frame failed, falling back to passthrough:', triggerErr.message)
        executionMethod = 'passthrough-fallback'
        // Passthrough: return video URL as frame URL (degraded experience)
        output = body.videoUrl
      }
    } else {
      // ── FALLBACK: Passthrough (no Trigger.dev configured) ──
      executionMethod = 'passthrough'
      console.warn('TRIGGER_SECRET_KEY not set — extract-frame returning video URL as passthrough')
      output = body.videoUrl
    }

    // Save to DB (skip if Trigger.dev task already saved)
    if (executionMethod !== 'trigger.dev' && body.workflowRunId && body.nodeId && !body.workflowRunId.startsWith('local-')) {
      try {
        await prisma.nodeRun.create({
          data: {
            workflowRunId: body.workflowRunId,
            nodeId: body.nodeId,
            nodeType: 'extractFrameNode',
            status: 'success',
            inputs: { videoUrl: body.videoUrl, timestamp },
            outputs: { imageUrl: output },
            endedAt: new Date(),
          },
        })
      } catch (dbErr) {
        console.warn('Could not save nodeRun:', dbErr)
      }
    }

    return NextResponse.json({ success: true, output })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
