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

export const cropImageTask = task({
  id: "crop-image-node",
  maxDuration: 60,
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
      .toBuffer()

    const base64 = croppedBuffer.toString("base64")
    const output = `data:image/png;base64,${base64}`

    return { output }
  },
})
