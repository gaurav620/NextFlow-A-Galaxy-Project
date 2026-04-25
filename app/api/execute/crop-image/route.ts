import { NextRequest, NextResponse } from 'next/server'
import { tasks, runs } from '@trigger.dev/sdk/v3'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import type { cropImageTask } from '@/trigger/tasks/crop-image'

const schema = z.object({
  imageUrl: z.string(),
  x: z.number().min(0).max(100).default(0),
  y: z.number().min(0).max(100).default(0),
  width: z.number().min(1).max(100).default(100),
  height: z.number().min(1).max(100).default(100),
  nodeId: z.string().optional(),
  workflowRunId: z.string().optional(),
})

// ── DIRECT SHARP FALLBACK (when Trigger.dev is not available) ──
async function cropDirect(imageUrl: string, x: number, y: number, width: number, height: number): Promise<string> {
  const sharp = (await import('sharp')).default

  let buffer: Buffer
  if (imageUrl.startsWith('data:')) {
    const base64Data = imageUrl.split(',')[1]
    buffer = Buffer.from(base64Data, 'base64')
  } else {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  }

  const metadata = await sharp(buffer).metadata()
  const imgWidth = metadata.width || 800
  const imgHeight = metadata.height || 600
  const left = Math.floor((x / 100) * imgWidth)
  const top = Math.floor((y / 100) * imgHeight)
  const cropWidth = Math.max(1, Math.floor((width / 100) * imgWidth))
  const cropHeight = Math.max(1, Math.floor((height / 100) * imgHeight))

  const croppedBuffer = await sharp(buffer)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toBuffer()

  return `data:image/png;base64,${croppedBuffer.toString('base64')}`
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())
    const triggerKey = process.env.TRIGGER_SECRET_KEY

    let output: string
    let executionMethod = 'trigger.dev'

    if (triggerKey) {
      // ── PRIMARY: Execute via Trigger.dev task ──
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
        const run = await runs.poll(handle.id, { pollIntervalMs: 1000 })

        if (run.status === 'COMPLETED' && run.output) {
          output = (run.output as any).output
        } else {
          throw new Error(run.status === 'FAILED' ? 'Trigger.dev crop task failed' : 'Trigger.dev crop task timed out')
        }
      } catch (triggerErr: any) {
        console.warn('Trigger.dev crop failed, falling back to direct:', triggerErr.message)
        executionMethod = 'direct-fallback'
        output = await cropDirect(body.imageUrl, body.x, body.y, body.width, body.height)
      }
    } else {
      // ── FALLBACK: Direct Sharp (no Trigger.dev) ──
      executionMethod = 'direct-sharp'
      output = await cropDirect(body.imageUrl, body.x, body.y, body.width, body.height)
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

    return NextResponse.json({ success: true, output })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
