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

// ── FREE FALLBACK: Pollinations AI text generation (no API key needed) ──
async function pollinationsFallback(systemPrompt: string, userMessage: string, model: string): Promise<string> {
  const messages: any[] = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: userMessage })

  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages,
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    // Try direct text endpoint as last resort
    const directRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(
      (systemPrompt ? `System: ${systemPrompt}\n\n` : '') + userMessage
    )}`)
    if (!directRes.ok) throw new Error('All LLM providers failed')
    return await directRes.text()
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'No response generated'
}

// ── GEMINI with retry ──
async function geminiGenerate(apiKey: string, model: string, systemPrompt: string | undefined, userMessage: string, images?: string[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({ model })

  const parts: any[] = []
  if (systemPrompt) parts.push({ text: `System: ${systemPrompt}\n\n` })
  parts.push({ text: userMessage })

  if (images?.length) {
    for (const imgUrl of images) {
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

  const result = await geminiModel.generateContent(parts)
  return result.response.text()
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = schema.parse(await req.json())
    const apiKey = process.env.GEMINI_API_KEY

    let output: string
    let usedFallback = false

    // Strategy: Try Gemini first, fall back to Pollinations if quota exceeded
    if (apiKey) {
      try {
        output = await geminiGenerate(apiKey, body.model, body.systemPrompt, body.userMessage, body.images)
      } catch (geminiErr: any) {
        const isQuotaError = geminiErr.message?.includes('429') || geminiErr.message?.includes('quota') || geminiErr.message?.includes('Too Many Requests')
        
        if (isQuotaError) {
          console.warn('Gemini quota exceeded, trying retry after delay...')
          
          // Try once more after a short delay
          try {
            await new Promise(r => setTimeout(r, 3000))
            output = await geminiGenerate(apiKey, body.model, body.systemPrompt, body.userMessage, body.images)
          } catch (retryErr: any) {
            const stillQuota = retryErr.message?.includes('429') || retryErr.message?.includes('quota')
            if (stillQuota) {
              // Fall back to free Pollinations AI
              console.warn('Gemini still rate-limited, falling back to Pollinations AI')
              output = await pollinationsFallback(body.systemPrompt || '', body.userMessage, body.model)
              usedFallback = true
            } else {
              throw retryErr
            }
          }
        } else {
          throw geminiErr
        }
      }
    } else {
      // No Gemini key at all — use Pollinations
      output = await pollinationsFallback(body.systemPrompt || '', body.userMessage, body.model)
      usedFallback = true
    }

    // Save to DB if applicable
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

    return NextResponse.json({ 
      success: true, 
      output,
      ...(usedFallback ? { note: 'Used free fallback (Pollinations AI) — Gemini quota exceeded' } : {})
    })
  } catch (error: any) {
    console.error('LLM Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
