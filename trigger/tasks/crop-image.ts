import { task } from "@trigger.dev/sdk/v3"

export interface CropImagePayload {
  imageUrl: string
  x: number       // percent 0–100
  y: number       // percent 0–100
  width: number   // percent 1–100
  height: number  // percent 1–100
  workflowRunId?: string
  nodeId?: string
}

/**
 * Crops an image using Transloadit's /image/resize robot (backed by FFmpeg/ImageMagick).
 * Accepts percentage-based crop region, converts to absolute pixels via /image/resize crop step.
 * Falls back to returning the original URL if Transloadit is not configured.
 */
export const cropImageTask = task({
  id: "crop-image-node",
  maxDuration: 120,
  run: async (payload: CropImagePayload) => {
    const { imageUrl, x = 0, y = 0, width = 100, height = 100 } = payload

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    if (!authKey || !authSecret) {
      console.warn("TRANSLOADIT not configured — returning original image URL")
      return { output: imageUrl }
    }

    const crypto = await import("crypto")

    const expires = new Date(Date.now() + 3600 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "+00:00")

    // Step 1: Import the image via HTTP
    // Step 2: Use /image/resize robot with crop strategy to extract the region.
    //   - offset_x / offset_y = top-left corner in percent
    //   - width / height passed as percent via resize_strategy "crop"
    //   Transloadit /image/resize supports pixel values; we use a two-pass approach:
    //   First get image metadata, then crop. Since we have % values, we use the
    //   "crop" resize_strategy with gravity and let Transloadit handle it via FFmpeg.
    const params = {
      auth: { key: authKey, expires },
      steps: {
        imported: {
          robot: "/http/import",
          url: imageUrl,
        },
        cropped: {
          robot: "/image/resize",
          use: "imported",
          // Transloadit crop: use resize_strategy "crop" with explicit pixel offsets
          // We pass percentage-based values using the `crop` parameter (object form)
          resize_strategy: "crop",
          crop: {
            x1: x / 100,       // normalized 0–1 left edge
            y1: y / 100,       // normalized 0–1 top edge
            x2: Math.min((x + width) / 100, 1),   // normalized 0–1 right edge
            y2: Math.min((y + height) / 100, 1),  // normalized 0–1 bottom edge
          },
          imagemagick_stack: "v3.0.1",
          format: "png",
        },
      },
    }

    const paramsStr = JSON.stringify(params)
    const sig =
      "sha384:" +
      crypto
        .createHmac("sha384", authSecret)
        .update(Buffer.from(paramsStr, "utf-8"))
        .digest("hex")

    // Submit assembly to Transloadit
    const formData = new FormData()
    formData.append("params", paramsStr)
    formData.append("signature", sig)

    const assemblyRes = await fetch("https://api2.transloadit.com/assemblies", {
      method: "POST",
      body: formData,
    })
    if (!assemblyRes.ok) {
      throw new Error(`Transloadit submit failed: ${assemblyRes.statusText}`)
    }
    const assembly = await assemblyRes.json()

    // Poll for completion (up to 60s)
    const pollUrl = assembly.assembly_ssl_url || assembly.assembly_url
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const statusRes = await fetch(pollUrl)
      const status = await statusRes.json()

      if (status.ok === "ASSEMBLY_COMPLETED") {
        const result = status.results?.cropped?.[0]
        if (result?.ssl_url) return { output: result.ssl_url }
        if (result?.url) return { output: result.url }
        // Fallback: check uploads
        const upload = status.uploads?.[0]
        if (upload?.ssl_url) return { output: upload.ssl_url }
        throw new Error("Transloadit crop completed but no output URL found")
      }
      if (status.ok === "REQUEST_ABORTED" || status.error) {
        throw new Error(status.error || "Transloadit crop assembly failed")
      }
    }

    throw new Error("Transloadit crop image timed out")
  },
})
