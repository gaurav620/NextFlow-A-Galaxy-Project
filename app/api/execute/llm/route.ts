import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { tasks, runs } from '@trigger.dev/sdk/v3'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import type { llmTask } from '@/trigger/tasks/llm'

const schema = z.object({
  model: z.string().default('gemini-2.0-flash'),
  systemPrompt: z.string().optional(),
  userMessage: z.string(),
  images: z.array(z.string()).optional(),
  workflowRunId: z.string().optional(),
  nodeId: z.string().optional(),
})

// ── FREE FALLBACK: Pollinations AI text generation (no API key needed) ──
async function pollinationsFallback(systemPrompt: string, userMessage: string): Promise<string> {
  const messages: any[] = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: userMessage })

  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'openai', messages, max_tokens: 2048 }),
  })

  if (!res.ok) {
    const directRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(
      (systemPrompt ? `System: ${systemPrompt}\n\n` : '') + userMessage
    )}`)
    if (!directRes.ok) throw new Error('All LLM providers failed')
    return await directRes.text()
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'No response generated'
}

// ── DIRECT GEMINI (used as fallback when Trigger.dev is not available) ──
async function geminiDirect(apiKey: string, model: string, systemPrompt: string | undefined, userMessage: string, images?: string[]): Promise<string> {
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
    const triggerKey = process.env.TRIGGER_SECRET_KEY
    const apiKey = process.env.GEMINI_API_KEY

    let output: string
    let executionMethod = 'trigger.dev'

    // ═══════════════════════════════════════════════════════════════
    // STRATEGY: Trigger.dev → Direct Gemini → Pollinations fallback
    // ═══════════════════════════════════════════════════════════════

    if (triggerKey) {
      // ── PRIMARY: Execute via Trigger.dev task ──
      try {
        const handle = await tasks.trigger<typeof llmTask>('llm-node', {
          model: body.model,
          systemPrompt: body.systemPrompt,
          userMessage: body.userMessage,
          images: body.images,
          workflowRunId: body.workflowRunId,
          nodeId: body.nodeId,
        })
        const run = await runs.poll(handle.id, { pollIntervalMs: 1000 })

        if (run.status === 'COMPLETED' && run.output) {
          output = (run.output as any).output
        } else {
          throw new Error(run.status === 'FAILED' ? 'Trigger.dev task failed' : 'Trigger.dev task timed out')
        }
      } catch (triggerErr: any) {
        console.warn('Trigger.dev execution failed, falling back to direct:', triggerErr.message)
        executionMethod = 'direct-fallback'

        // Fall through to direct execution
        if (apiKey) {
          try {
            output = await geminiDirect(apiKey, body.model, body.systemPrompt, body.userMessage, body.images)
          } catch (geminiErr: any) {
            const isQuota = geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')
            if (isQuota) {
              output = await pollinationsFallback(body.systemPrompt || '', body.userMessage)
              executionMethod = 'pollinations-fallback'
            } else {
              throw geminiErr
            }
          }
        } else {
          output = await pollinationsFallback(body.systemPrompt || '', body.userMessage)
          executionMethod = 'pollinations-fallback'
        }
      }
    } else if (apiKey) {
      // ── FALLBACK: Direct Gemini (no Trigger.dev configured) ──
      executionMethod = 'direct-gemini'
      try {
        output = await geminiDirect(apiKey, body.model, body.systemPrompt, body.userMessage, body.images)
      } catch (geminiErr: any) {
        const isQuota = geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')
        if (isQuota) {
          await new Promise(r => setTimeout(r, 3000))
          try {
            output = await geminiDirect(apiKey, body.model, body.systemPrompt, body.userMessage, body.images)
          } catch {
            output = await pollinationsFallback(body.systemPrompt || '', body.userMessage)
            executionMethod = 'pollinations-fallback'
          }
        } else {
          throw geminiErr
        }
      }
    } else {
      // ── LAST RESORT: Pollinations free API ──
      executionMethod = 'pollinations-fallback'
      output = await pollinationsFallback(body.systemPrompt || '', body.userMessage)
    }

    // Save to DB if applicable (skip if Trigger.dev task already saved)
    if (executionMethod !== 'trigger.dev' && body.workflowRunId && body.nodeId && !body.workflowRunId.startsWith('local-')) {
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
      ...(executionMethod !== 'trigger.dev' ? { note: `Executed via ${executionMethod}` } : {}),
    })
  } catch (error: any) {
    console.error('LLM Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
