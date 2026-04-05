import type { WorkflowNode, WorkflowEdge } from '@/types/workflow'

function getConnectedSourceNode(
  nodeId: string,
  targetHandle: string,
  edges: WorkflowEdge[]
): string | undefined {
  return edges.find(e => e.target === nodeId && e.targetHandle === targetHandle)?.source
}

function getConnectedSourceNodes(
  nodeId: string,
  targetHandle: string,
  edges: WorkflowEdge[]
): string[] {
  return edges
    .filter(e => e.target === nodeId && e.targetHandle === targetHandle)
    .map(e => e.source)
}

function topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[][] {
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>()

  nodes.forEach(n => { inDegree.set(n.id, 0); adjList.set(n.id, []) })
  edges.forEach(e => {
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1)
    adjList.get(e.source)?.push(e.target)
  })

  const levels: WorkflowNode[][] = []
  let currentLevel = nodes.filter(n => (inDegree.get(n.id) || 0) === 0)

  while (currentLevel.length > 0) {
    levels.push(currentLevel)
    const nextLevel: WorkflowNode[] = []
    currentLevel.forEach(node => {
      adjList.get(node.id)?.forEach(targetId => {
        inDegree.set(targetId, (inDegree.get(targetId) || 0) - 1)
        if (inDegree.get(targetId) === 0) {
          const targetNode = nodes.find(n => n.id === targetId)
          if (targetNode) nextLevel.push(targetNode)
        }
      })
    })
    currentLevel = nextLevel
  }
  return levels
}

export async function executeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  workflowRunId: string,
  callbacks: {
    onNodeStart: (nodeId: string) => void
    onNodeComplete: (nodeId: string, output: any) => void
    onNodeError: (nodeId: string, error: string) => void
  }
): Promise<{ success: boolean; results: Map<string, any>; errors: Map<string, string> }> {
  const results = new Map<string, any>()
  const errors = new Map<string, string>()
  const levels = topologicalSort(nodes, edges)

  for (const level of levels) {
    await Promise.all(
      level.map(async (node) => {
        callbacks.onNodeStart(node.id)
        try {
          let output: any

          if (node.type === 'textNode') {
            output = node.data.value || ''
          } else if (node.type === 'imageUploadNode') {
            output = node.data.imageUrl || node.data.value || ''
          } else if (node.type === 'videoUploadNode') {
            output = node.data.videoUrl || node.data.value || ''
          } else if (node.type === 'llmNode') {
            const systemSourceId = getConnectedSourceNode(node.id, 'system_prompt', edges)
            const userSourceId = getConnectedSourceNode(node.id, 'user_message', edges)
            const imageSourceIds = getConnectedSourceNodes(node.id, 'images', edges)

            const systemPrompt = systemSourceId ? String(results.get(systemSourceId) || '') : node.data.systemPrompt
            const userMessage = userSourceId ? String(results.get(userSourceId) || '') : (node.data.userMessage || node.data.value || 'Hello')
            const images = imageSourceIds.map(id => results.get(id)).filter(Boolean)

            const res = await fetch('/api/execute/llm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: node.data.model || 'gemini-2.0-flash',
                systemPrompt,
                userMessage,
                images: images.length ? images : undefined,
                workflowRunId,
                nodeId: node.id,
              }),
            })
            if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
            const data = await res.json().catch(() => null)
            if (!data) throw new Error('Invalid JSON response from LLM API')
            if (!data.success) throw new Error(data.error || 'LLM failed')
            output = data.output
          } else if (node.type === 'cropImageNode') {
            const imageSourceId = getConnectedSourceNode(node.id, 'image_url', edges)
            const xSourceId = getConnectedSourceNode(node.id, 'x_percent', edges)
            const ySourceId = getConnectedSourceNode(node.id, 'y_percent', edges)
            const wSourceId = getConnectedSourceNode(node.id, 'width_percent', edges)
            const hSourceId = getConnectedSourceNode(node.id, 'height_percent', edges)

            const res = await fetch('/api/execute/crop-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageUrl: imageSourceId ? results.get(imageSourceId) : node.data.imageUrl,
                x: xSourceId ? Number(results.get(xSourceId)) : (node.data.x || 0),
                y: ySourceId ? Number(results.get(ySourceId)) : (node.data.y || 0),
                width: wSourceId ? Number(results.get(wSourceId)) : (node.data.width || 100),
                height: hSourceId ? Number(results.get(hSourceId)) : (node.data.height || 100),
                workflowRunId,
                nodeId: node.id,
              }),
            })
            if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
            const data = await res.json().catch(() => null)
            if (!data) throw new Error('Invalid JSON response from Crop API')
            if (!data.success) throw new Error(data.error || 'Crop failed')
            output = data.output
          } else if (node.type === 'extractFrameNode') {
            const videoSourceId = getConnectedSourceNode(node.id, 'video_url', edges)
            const tsSourceId = getConnectedSourceNode(node.id, 'timestamp', edges)

            const res = await fetch('/api/execute/extract-frame', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                videoUrl: videoSourceId ? results.get(videoSourceId) : node.data.videoUrl,
                timestamp: tsSourceId ? Number(results.get(tsSourceId)) : (node.data.timestamp || 0),
                workflowRunId,
                nodeId: node.id,
              }),
            })
            if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
            const data = await res.json().catch(() => null)
            if (!data) throw new Error('Invalid JSON response from Extract API')
            if (!data.success) throw new Error(data.error || 'Extract failed')
            output = data.output
          } else if (node.type === 'imageGenNode') {
            const promptSourceId = getConnectedSourceNode(node.id, 'prompt', edges)
            const promptValue = promptSourceId ? String(results.get(promptSourceId) || '') : node.data.prompt
            
            if (!promptValue) throw new Error('Prompt is required for Image Generation')

            const res = await fetch('/api/generate/image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: promptValue,
                count: 1,
                modelId: "krea1",
                aspectRatio: "1:1",
                resolution: "1K"
              }),
            })
            if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
            const data = await res.json().catch(() => null)
            if (!data) throw new Error('Invalid JSON response from Generation API')
            if (!data.success) throw new Error(data.error || 'Image generation failed')
            output = data.images?.[0] || ''
          }

          results.set(node.id, output)
          callbacks.onNodeComplete(node.id, output)
        } catch (err: any) {
          errors.set(node.id, err.message)
          callbacks.onNodeError(node.id, err.message)
        }
      })
    )
  }

  return { success: errors.size === 0, results, errors }
}
