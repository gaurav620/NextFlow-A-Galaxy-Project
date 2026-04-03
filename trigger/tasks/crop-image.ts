import { task } from "@trigger.dev/sdk/v3"
import sharp from "sharp"

export interface CropImagePayload {
  imageUrl: string
  x: number
  y: number
  width: number
  height: number
  workflowRunId?: string
  nodeId?: string
}

async function uploadBufferToTransloadit(buffer: Buffer, filename: string): Promise<string | null> {
  const authKey = process.env.TRANSLOADIT_AUTH_KEY
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET
  if (!authKey || !authSecret) return null

  const crypto = await import("crypto")
  const expires = new Date(Date.now() + 3600 * 1000)
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "+00:00")

  const params = {
    auth: { key: authKey, expires },
    steps: {},
  }
  const paramsStr = JSON.stringify(params)
  const sig =
    "sha384:" +
    crypto.createHmac("sha384", authSecret).update(Buffer.from(paramsStr, "utf-8")).digest("hex")

  const formData = new FormData()
  formData.append("params", paramsStr)
  formData.append("signature", sig)
  formData.append("file", new Blob([buffer], { type: "image/png" }), filename)

  const assemblyRes = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  })
  if (!assemblyRes.ok) return null
  const assembly = await assemblyRes.json()

  const pollUrl = assembly.assembly_ssl_url || assembly.assembly_url
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const statusRes = await fetch(pollUrl)
    const status = await statusRes.json()
    if (status.ok === "ASSEMBLY_COMPLETED") {
      const upload = status.uploads?.[0]
      return upload?.ssl_url || upload?.url || null
    }
    if (status.ok === "REQUEST_ABORTED" || status.error) return null
  }
  return null
}

export const cropImageTask = task({
  id: "crop-image-node",
  maxDuration: 120,
  run: async (payload: CropImagePayload) => {
    const { imageUrl, x = 0, y = 0, width = 100, height = 100 } = payload

    let buffer: Buffer
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1]
      buffer = Buffer.from(base64Data, "base64")
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
      .png()
      .toBuffer()

    // Try to upload to Transloadit CDN; fall back to base64 if not configured
    const cdnUrl = await uploadBufferToTransloadit(croppedBuffer, `cropped-${Date.now()}.png`)
    const output = cdnUrl ?? `data:image/png;base64,${croppedBuffer.toString("base64")}`

    return { output }
  },
})
