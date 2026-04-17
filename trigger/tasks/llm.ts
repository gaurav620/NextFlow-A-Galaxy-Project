import { task } from "@trigger.dev/sdk/v3"
import { GoogleGenerativeAI } from "@google/generative-ai"

export interface LLMPayload {
  model: string
  systemPrompt?: string
  userMessage: string
  images?: string[]
  workflowRunId?: string
  nodeId?: string
}

// ── FREE FALLBACK: Pollinations AI (no API key needed) ──
async function pollinationsFallback(systemPrompt: string, userMessage: string): Promise<string> {
  const messages: any[] = []
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt })
  messages.push({ role: "user", content: userMessage })

  const res = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai", messages, max_tokens: 2048 }),
  })

  if (!res.ok) {
    const directRes = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(
        (systemPrompt ? `System: ${systemPrompt}\n\n` : "") + userMessage
      )}`
    )
    if (!directRes.ok) throw new Error("All LLM providers failed")
    return await directRes.text()
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "No response generated"
}

export const llmTask = task({
  id: "llm-node",
  maxDuration: 120,
  run: async (payload: LLMPayload) => {
    const apiKey = process.env.GEMINI_API_KEY

    let output: string

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const geminiModel = genAI.getGenerativeModel({ model: payload.model || "gemini-2.0-flash" })

        const parts: any[] = []
        if (payload.systemPrompt) {
          parts.push({ text: `System: ${payload.systemPrompt}\n\n` })
        }
        parts.push({ text: payload.userMessage })

        if (payload.images?.length) {
          for (const imgUrl of payload.images) {
            try {
              if (imgUrl.startsWith("data:")) {
                const [header, base64Data] = imgUrl.split(",")
                const mimeType = header.split(":")[1].split(";")[0]
                parts.push({ inlineData: { data: base64Data, mimeType } })
              } else {
                const res = await fetch(imgUrl)
                const buffer = await res.arrayBuffer()
                const base64 = Buffer.from(buffer).toString("base64")
                const mimeType = res.headers.get("content-type") || "image/jpeg"
                parts.push({ inlineData: { data: base64, mimeType } })
              }
            } catch (err) {
              console.error("Failed to parse image for LLM:", err)
            }
          }
        }

        const result = await geminiModel.generateContent(parts)
        output = result.response.text()
      } catch (geminiErr: any) {
        const isQuota = geminiErr.message?.includes("429") || geminiErr.message?.includes("quota")
        if (isQuota) {
          console.warn("Gemini quota exceeded in Trigger.dev task, falling back to Pollinations")
          output = await pollinationsFallback(payload.systemPrompt || "", payload.userMessage)
        } else {
          throw geminiErr
        }
      }
    } else {
      // No Gemini key — use free Pollinations
      output = await pollinationsFallback(payload.systemPrompt || "", payload.userMessage)
    }

    return { output }
  },
})
