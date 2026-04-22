import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { topologicalSort, getConnectedSource, getConnectedSources, getSubgraph } from '@/lib/dag'

interface WFNode {
  id: string
  type?: string
  data?: Record<string, any>
}

interface WFEdge {
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

/**
 * POST /api/workflow/[id]/run
 * 
 * Server-side workflow execution engine.
 * - Reads the saved workflow from DB
 * - Performs topological sort
 * - Executes each level in parallel via internal /api/execute/* routes
 * - Records all node runs in DB
 * 
 * Body: { selectedNodeIds?: string[], scope?: 'full' | 'partial' | 'single' }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workflowId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const selectedNodeIds: string[] = body.selectedNodeIds || []
    const scope = selectedNodeIds.length > 0 ? (selectedNodeIds.length === 1 ? 'single' : 'partial') : 'full'

    // 1. Load workflow from DB
    const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } })
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    if (workflow.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const workflowData = workflow.data as any
    const allNodes: WFNode[] = workflowData.nodes || []
    const allEdges: WFEdge[] = workflowData.edges || []

    // 2. If partial run, extract subgraph
    const { nodes, edges } = selectedNodeIds.length > 0
      ? getSubgraph(allNodes, allEdges, selectedNodeIds)
      : { nodes: allNodes, edges: allEdges }

    // 3. Topological sort (throws for cyclic graphs)
    const levels = topologicalSort(nodes, edges)

    // 4. Create WorkflowRun record
    const workflowRun = await prisma.workflowRun.create({
      data: { workflowId, userId, scope, status: 'running' },
    })

    const results = new Map<string, any>()
    const errors = new Map<string, string>()
    const baseUrl = req.nextUrl.origin

    // 5. Execute level-by-level
    for (const level of levels) {
      await Promise.all(level.map(async (node) => {
        const nodeRun = await prisma.nodeRun.create({
          data: {
            workflowRunId: workflowRun.id,
            nodeId: node.id,
            nodeType: node.type || 'unknown',
            status: 'running',
            inputs: node.data || {},
          },
        })

        try {
          let output: any

          if (node.type === 'textNode') {
            output = node.data?.content || node.data?.value || ''
          } else if (node.type === 'imageUploadNode') {
            output = node.data?.imageUrl || node.data?.value || ''
          } else if (node.type === 'videoUploadNode') {
            output = node.data?.videoUrl || node.data?.value || ''
          } else if (node.type === 'llmNode') {
            const systemSrc = getConnectedSource(node.id, 'system_prompt', edges)
            const userSrc = getConnectedSource(node.id, 'user_message', edges)
            const imageSrcs = getConnectedSources(node.id, 'images', edges)

            const res = await fetch(`${baseUrl}/api/execute/llm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: node.data?.model || 'gemini-2.0-flash',
                systemPrompt: systemSrc ? String(results.get(systemSrc) || '') : node.data?.systemPrompt,
                userMessage: userSrc ? String(results.get(userSrc) || '') : (node.data?.userMessage || node.data?.value || 'Hello'),
                images: imageSrcs.map(id => results.get(id)).filter(Boolean),
                workflowRunId: workflowRun.id,
                nodeId: node.id,
              }),
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'LLM failed')
            output = data.output
          } else if (node.type === 'cropImageNode') {
            const imgSrc = getConnectedSource(node.id, 'image_url', edges)
            const xSrc = getConnectedSource(node.id, 'x_percent', edges)
            const ySrc = getConnectedSource(node.id, 'y_percent', edges)
            const wSrc = getConnectedSource(node.id, 'width_percent', edges)
            const hSrc = getConnectedSource(node.id, 'height_percent', edges)

            const res = await fetch(`${baseUrl}/api/execute/crop-image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageUrl: imgSrc ? results.get(imgSrc) : node.data?.imageUrl,
                x: xSrc ? Number(results.get(xSrc)) : (node.data?.x || 0),
                y: ySrc ? Number(results.get(ySrc)) : (node.data?.y || 0),
                width: wSrc ? Number(results.get(wSrc)) : (node.data?.width || 100),
                height: hSrc ? Number(results.get(hSrc)) : (node.data?.height || 100),
                workflowRunId: workflowRun.id,
                nodeId: node.id,
              }),
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Crop failed')
            output = data.output
          } else if (node.type === 'extractFrameNode') {
            const vidSrc = getConnectedSource(node.id, 'video_url', edges)
            const tsSrc = getConnectedSource(node.id, 'timestamp', edges)

            const res = await fetch(`${baseUrl}/api/execute/extract-frame`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                videoUrl: vidSrc ? results.get(vidSrc) : node.data?.videoUrl,
                timestamp: tsSrc ? Number(results.get(tsSrc)) : (node.data?.timestamp || 0),
                workflowRunId: workflowRun.id,
                nodeId: node.id,
              }),
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Extract failed')
            output = data.output
          } else if (node.type === 'imageGenNode') {
            const promptSrc = getConnectedSource(node.id, 'prompt', edges)
            const prompt = promptSrc ? String(results.get(promptSrc) || '') : node.data?.prompt

            const res = await fetch(`${baseUrl}/api/generate/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt,
                count: 1,
                modelId: node.data?.model || 'nextflow1',
                aspectRatio: node.data?.aspectRatio || '1:1',
                resolution: '1K',
              }),
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Image gen failed')
            output = data.images?.[0] || ''
          }

          results.set(node.id, output)

          await prisma.nodeRun.update({
            where: { id: nodeRun.id },
            data: { status: 'success', outputs: { result: output }, endedAt: new Date() },
          })
        } catch (err: any) {
          errors.set(node.id, err.message)
          await prisma.nodeRun.update({
            where: { id: nodeRun.id },
            data: { status: 'failed', error: err.message, endedAt: new Date() },
          })
        }
      }))
    }

    // 6. Update workflow run status
    await prisma.workflowRun.update({
      where: { id: workflowRun.id },
      data: {
        status: errors.size > 0 ? 'failed' : 'success',
        endedAt: new Date(),
      },
    })

    // 7. Return results
    const resultObj: Record<string, any> = {}
    results.forEach((v, k) => { resultObj[k] = v })
    const errorObj: Record<string, string> = {}
    errors.forEach((v, k) => { errorObj[k] = v })

    return NextResponse.json({
      success: errors.size === 0,
      runId: workflowRun.id,
      scope,
      nodesExecuted: nodes.length,
      results: resultObj,
      errors: Object.keys(errorObj).length > 0 ? errorObj : undefined,
    })
  } catch (error: any) {
    const message = error?.message || 'Unknown workflow run error'
    const statusCode = /cycle/i.test(message) ? 400 : 500
    console.error('Workflow run error:', error)
    return NextResponse.json({ success: false, error: message }, { status: statusCode })
  }
}
