import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { tasks } from '@trigger.dev/sdk/v3'
import type { extractFrameTask } from '@/trigger/tasks/extract-frame'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { videoUrl, timestamp = 0, nodeId, workflowRunId } = await req.json()

    let output: string

    if (process.env.TRIGGER_SECRET_KEY) {
      const result = await tasks.triggerAndWait<typeof extractFrameTask>('extract-frame-node', {
        videoUrl, timestamp, nodeId, workflowRunId,
      })

      if (!result.ok) throw new Error('Extract frame task failed')
      output = result.output.output
    } else {
      // Direct fallback — passthrough until FFmpeg worker is wired
      output = videoUrl
    }

    if (workflowRunId && nodeId && !workflowRunId.startsWith('local-')) {
      try {
        await prisma.nodeRun.create({
          data: {
            workflowRunId,
            nodeId,
            nodeType: 'extractFrameNode',
            status: 'success',
            inputs: { videoUrl, timestamp },
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
