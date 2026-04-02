import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import sharp from 'sharp'
import prisma from '@/lib/prisma'
import { tasks } from '@trigger.dev/sdk/v3'
import type { cropImageTask } from '@/trigger/tasks/crop-image'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { imageUrl, x = 0, y = 0, width = 100, height = 100, nodeId, workflowRunId } = await req.json()

    let output: string

    if (process.env.TRIGGER_SECRET_KEY) {
      const result = await tasks.triggerAndWait<typeof cropImageTask>('crop-image-node', {
        imageUrl, x, y, width, height, nodeId, workflowRunId,
      })

      if (!result.ok) throw new Error('Crop image task failed')
      output = result.output.output
    } else {
      // Direct fallback
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

      output = `data:image/png;base64,${croppedBuffer.toString('base64')}`
    }

    if (workflowRunId && nodeId) {
      await prisma.nodeRun.create({
        data: {
          workflowRunId,
          nodeId,
          nodeType: 'cropImageNode',
          status: 'success',
          inputs: { imageUrl, x, y, width, height },
          outputs: { imageUrl: output },
          endedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true, output })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
