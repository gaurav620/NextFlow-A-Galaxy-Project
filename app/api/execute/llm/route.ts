import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const schema = z.object({
  model: z.string().default('gemini-2.0-flash'),
  systemPrompt: z.string().optional(),
  userMessage: z.string(),
  images: z.array(z.string()).optional(),
  workflowRunId: z.string().optional(),
  nodeId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = schema.parse(await req.json())

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model: body.model })

    const parts: any[] = []
    if (body.systemPrompt) parts.push({ text: `System: ${body.systemPrompt}\n\n` })
    parts.push({ text: body.userMessage })

    if (body.images?.length) {
      for (const imgUrl of body.images) {
        try {
          if (imgUrl.startsWith('data:')) {
            const [header, base64Data] = imgUrl.split(',')
            const mimeType = header.split(':')[1].split(';')[0]
            parts.push({ inlineData: { data: base64Data, mimeType } })
          } else {
            const res = await fetch(imgUrl)
            const buffer = await res.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            const mimeType = res.headers.get('content-type') || 'image/jpeg'
            parts.push({ inlineData: { data: base64, mimeType } })
          }
        } catch (err) {
          console.error('Failed to parse image for LLM:', err)
        }
      }
    }

    const geminiResult = await geminiModel.generateContent(parts)
    const output = geminiResult.response.text()

    if (body.workflowRunId && body.nodeId && !body.workflowRunId.startsWith('local-')) {
      try {
        await prisma.nodeRun.create({
          data: {
            workflowRunId: body.workflowRunId,
            nodeId: body.nodeId,
            nodeType: 'llmNode',
            status: 'success',
            inputs: { model: body.model, userMessage: body.userMessage },
            outputs: { text: output },
            endedAt: new Date(),
          },
        })
      } catch (dbErr) {
        console.warn('Could not save nodeRun record:', dbErr)
      }
    }

    return NextResponse.json({ success: true, output })
  } catch (error: any) {
    console.error('LLM Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
