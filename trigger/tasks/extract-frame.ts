import { task } from "@trigger.dev/sdk/v3"

export interface ExtractFramePayload {
  videoUrl: string
  timestamp: number
  workflowRunId?: string
  nodeId?: string
}

export const extractFrameTask = task({
  id: "extract-frame-node",
  maxDuration: 120,
  run: async (payload: ExtractFramePayload) => {
    const { videoUrl, timestamp = 0 } = payload

    // NOTE: Full FFmpeg frame extraction requires a worker with ffmpeg binary.
    // Current implementation returns the video URL as a passthrough.
    // Wire up Transloadit or a custom FFmpeg Trigger.dev worker here when ready.
    console.log(`extract-frame-node: videoUrl=${videoUrl}, timestamp=${timestamp}`)

    return { output: videoUrl }
  },
})
