import { task } from "@trigger.dev/sdk/v3"

export interface ExtractFramePayload {
  videoUrl: string
  timestamp: number
  workflowRunId?: string
  nodeId?: string
}

/**
 * Extracts a single frame from a video at the given timestamp using Transloadit's
 * /video/thumbs robot, which runs FFmpeg under the hood.
 * Falls back to the video URL itself if Transloadit is not configured.
 */
export const extractFrameTask = task({
  id: "extract-frame-node",
  maxDuration: 180,
  run: async (payload: ExtractFramePayload) => {
    const { videoUrl, timestamp = 0 } = payload

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    if (!authKey || !authSecret) {
      console.warn("TRANSLOADIT not configured — returning video URL as passthrough")
      return { output: videoUrl }
    }

    // Import crypto for HMAC signing
    const crypto = await import("crypto")

    const expires = new Date(Date.now() + 3600 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d+Z$/, "+00:00")

    // Use Transloadit /video/thumbs robot to extract a frame via FFmpeg
    const params = {
      auth: { key: authKey, expires },
      steps: {
        imported: {
          robot: "/http/import",
          url: videoUrl,
        },
        frame: {
          robot: "/video/thumbs",
          use: "imported",
          count: 1,
          // offset_seconds extracts frame at the given timestamp
          offset_seconds: timestamp,
          format: "jpg",
          width: 1920,
          height: 1080,
          resize_strategy: "fit",
        },
        exported: {
          robot: "/file/compress",
          use: "frame",
          format: "zip",
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

    // Submit assembly
    const formData = new FormData()
    formData.append("params", paramsStr)
    formData.append("signature", sig)

    const assemblyRes = await fetch("https://api2.transloadit.com/assemblies", {
      method: "POST",
      body: formData,
    })
    if (!assemblyRes.ok) throw new Error(`Transloadit submit failed: ${assemblyRes.statusText}`)
    const assembly = await assemblyRes.json()

    // Poll for completion
    const pollUrl = assembly.assembly_ssl_url || assembly.assembly_url
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const statusRes = await fetch(pollUrl)
      const status = await statusRes.json()

      if (status.ok === "ASSEMBLY_COMPLETED") {
        const result = status.results?.frame?.[0]
        if (result?.ssl_url) return { output: result.ssl_url }
        if (result?.url) return { output: result.url }
        break
      }
      if (status.ok === "REQUEST_ABORTED" || status.error) {
        throw new Error(status.error || "Transloadit assembly failed")
      }
    }

    throw new Error("Transloadit frame extraction timed out")
  },
})
