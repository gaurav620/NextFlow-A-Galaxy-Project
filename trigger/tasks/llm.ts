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

export const llmTask = task({
  id: "llm-node",
  maxDuration: 120,
  run: async (payload: LLMPayload) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
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
    const output = result.response.text()

    return { output }
  },
})
