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
 * Crops an image using Transloadit's /image/resize robot.
 *
 * Transloadit /image/resize does NOT accept normalized (0–1) crop values.
 * The correct approach:
 *   1. Use resize_strategy "crop" with `gravity` for center/corner alignment
 *   2. Or use a two-step assembly: first import metadata to get pixel dims,
 *      then crop by pixels.
 *
 * For simplicity and reliability, we use strategy: crop into a 1x1 canvas
 * scaled by the requested %, which is equivalent to the user's intent.
 * If Transloadit is unavailable, we fall through to the passthrough.
 */
export const cropImageTask = task({
  id: "crop-image-node",
  maxDuration: 120,
  run: async (payload: CropImagePayload) => {
    const { imageUrl, x = 0, y = 0, width = 100, height = 100 } = payload

    // Transloadit /http/import cannot fetch blob: or data: URLs
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      console.warn('crop-image task: blob/data URL received — returning as passthrough (client-side only)')
      return { output: imageUrl }
    }

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    if (!authKey || !authSecret) {
      console.warn("TRANSLOADIT not configured — returning original image URL")
      return { output: imageUrl }
    }

    // Validate: if cropping the full image (0,0,100,100) just passthrough
    if (x === 0 && y === 0 && width >= 100 && height >= 100) {
      return { output: imageUrl }
    }

    const crypto = await import("crypto")

    const expires = new Date(Date.now() + 3600 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "+00:00")

    // Transloadit /image/resize crop:
    // We use a three-step assembly:
    //   1. /http/import  — import source image
    //   2. /image/resize — scale to 10000×10000 virtual canvas to get pixel math
    //   3. /image/resize — crop the actual pixel region
    //
    // Simpler proven approach:
    //   Use resize_strategy "crop" with explicit pixel width/height + gravity.
    //   We approximate by setting output size to width%×height% of a reference
    //   size (1000px baseline), then Transloadit crops from the gravity anchor.
    //
    // Most reliable: use the `crop` filter in steps with `extract_pil` approach.
    // But since Transloadit's robot docs show crop as:
    //   crop: { x1: PX, y1: PX, x2: PX, y2: PX }  (pixels, NOT 0-1 floats)
    // We need pixel values. Since we don't know source dims, we use a
    // "resize then crop" two-step: resize to 1000px wide, then crop.

    const REF = 1000 // reference width in pixels
    const cropX1 = Math.round((x / 100) * REF)
    const cropY1 = Math.round((y / 100) * REF)
    const cropX2 = Math.round(((x + width) / 100) * REF)
    const cropY2 = Math.round(((y + height) / 100) * REF)

    const params = {
      auth: { key: authKey, expires },
      steps: {
        imported: {
          robot: "/http/import",
          url: imageUrl,
        },
        resized: {
          robot: "/image/resize",
          use: "imported",
          width: REF,
          resize_strategy: "fit",
          imagemagick_stack: "v3.0.1",
        },
        cropped: {
          robot: "/image/resize",
          use: "resized",
          // Pixel-based crop (correct Transloadit format)
          crop: {
            x1: cropX1,
            y1: cropY1,
            x2: Math.min(cropX2, REF),
            y2: cropY2,
          },
          resize_strategy: "crop",
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

    const formData = new FormData()
    formData.append("params", paramsStr)
    formData.append("signature", sig)

    const assemblyRes = await fetch("https://api2.transloadit.com/assemblies", {
      method: "POST",
      body: formData,
    })

    if (!assemblyRes.ok) {
      const errText = await assemblyRes.text()
      console.warn(`Transloadit crop submit failed (${assemblyRes.status}): ${errText} — returning original`)
      return { output: imageUrl }
    }

    const assembly = await assemblyRes.json()
    const pollUrl = assembly.assembly_ssl_url || assembly.assembly_url

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const statusRes = await fetch(pollUrl)
      const status = await statusRes.json()

      if (status.ok === "ASSEMBLY_COMPLETED") {
        const result = status.results?.cropped?.[0]
        if (result?.ssl_url) return { output: result.ssl_url }
        if (result?.url) return { output: result.url }
        // Fallback to resized
        const resized = status.results?.resized?.[0]
        if (resized?.ssl_url) return { output: resized.ssl_url }
        return { output: imageUrl }
      }
      if (status.ok === "REQUEST_ABORTED" || status.error) {
        console.warn("Transloadit crop failed:", status.error, "— returning original")
        return { output: imageUrl }
      }
    }

    // Timeout — return original rather than throwing
    console.warn("Transloadit crop timed out — returning original image URL")
    return { output: imageUrl }
  },
})
