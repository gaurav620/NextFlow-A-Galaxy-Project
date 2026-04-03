'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
  ReactFlowInstance,
  Connection,
  useOnSelectionChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  ChevronLeft,
  Share2,
  Settings,
  Search,
  Workflow,
  Loader2,
  Download,
  Upload,
  Undo2,
  Redo2,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import TextNode from '@/components/nodes/text-node'
import ImageUploadNode from '@/components/nodes/image-upload-node'
import VideoUploadNode from '@/components/nodes/video-upload-node'
import LLMNode from '@/components/nodes/llm-node'
import CropImageNode from '@/components/nodes/crop-image-node'
import ExtractFrameNode from '@/components/nodes/extract-frame-node'
import HistorySidebar from '@/components/history-sidebar'

import { useWorkflowStore } from '@/store/workflowStore'
import { executeWorkflow } from '@/lib/workflowExecutor'
import { sampleWorkflow } from '@/data/sampleWorkflow'

const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
}

const nodeDefinitions = [
  { type: 'textNode', label: 'Text', color: '#3b82f6' },
  { type: 'imageUploadNode', label: 'Upload Image', color: '#22c55e' },
  { type: 'videoUploadNode', label: 'Upload Video', color: '#f97316' },
  { type: 'llmNode', label: 'Run LLM', color: '#a855f7' },
  { type: 'cropImageNode', label: 'Crop Image', color: '#ec4899' },
  { type: 'extractFrameNode', label: 'Extract Frame', color: '#eab308' },
]

/** DFS cycle check: can we reach `target` starting from `source` in the current graph? */
function hasCycle(
  source: string,
  target: string,
  edges: { source: string; target: string }[]
): boolean {
  const visited = new Set<string>()
  const stack = [target]
  while (stack.length) {
    const node = stack.pop()!
    if (node === source) return true
    if (visited.has(node)) continue
    visited.add(node)
    edges.filter(e => e.source === node).forEach(e => stack.push(e.target))
  }
  return false
}

function SelectionTracker({
  onSelectionChange,
}: {
  onSelectionChange: (ids: string[]) => void
}) {
  useOnSelectionChange({
    onChange: ({ nodes }) => onSelectionChange(nodes.map(n => n.id)),
  })
  return null
}

export default function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = React.use(params)

  const {
    nodes, edges, setNodes, setEdges,
    workflowName, setWorkflowName,
    currentWorkflowId, setCurrentWorkflowId,
    isRunning, setIsRunning,
    resetOutputs, addExecutingNode,
    removeExecutingNode, setNodeOutput, updateNodeData,
    undo, redo, past, future,
  } = useWorkflowStore()

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dagError, setDagError] = useState<string | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  // Load workflow from DB when opening an existing workflow (id !== 'new')
  useEffect(() => {
    if (!id || id === 'new') return
    fetch(`/api/workflow/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.workflow) {
          const wf = data.workflow
          setCurrentWorkflowId(wf.id)
          setWorkflowName(wf.name || 'Untitled Workflow')
          if (wf.data?.nodes) setNodes(wf.data.nodes)
          if (wf.data?.edges) setEdges(wf.data.edges)
        }
      })
      .catch(err => console.error('Failed to load workflow:', err))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts: Cmd+Z / Cmd+Shift+Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  const onNodesChange = useCallback(
    (changes: any) => setNodes(applyNodeChanges(changes, nodes as any) as any),
    [nodes, setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: any) => setEdges(applyEdgeChanges(changes, edges as any)),
    [edges, setEdges]
  )

  async function handleRun() {
    if (!nodes.length) { alert('Add some nodes first!'); return }
    setIsRunning(true)
    resetOutputs()
    let workflowRunId = 'local-' + Date.now()
    if (currentWorkflowId) {
      try {
        const res = await fetch(`/api/workflow/${currentWorkflowId}/runs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scope: 'full' })
        })
        const data = await res.json()
        if (data.success) workflowRunId = data.run.id
      } catch {}
    }
    await executeWorkflow(nodes as any, edges as any, workflowRunId, {
      onNodeStart: (nodeId) => addExecutingNode(nodeId),
      onNodeComplete: (nodeId, output) => {
        removeExecutingNode(nodeId)
        setNodeOutput(nodeId, output)
        updateNodeData(nodeId, { output: String(output || ''), error: undefined })
      },
      onNodeError: (nodeId, error) => {
        removeExecutingNode(nodeId)
        updateNodeData(nodeId, { error })
      }
    })
    setIsRunning(false)
  }

  async function handleRunSelected() {
    if (!selectedNodeIds.length) return
    setIsRunning(true)
    resetOutputs()
    let workflowRunId = 'local-' + Date.now()
    if (currentWorkflowId) {
      try {
        const res = await fetch(`/api/workflow/${currentWorkflowId}/runs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scope: 'partial', nodeIds: selectedNodeIds })
        })
        const data = await res.json()
        if (data.success) workflowRunId = data.run.id
      } catch {}
    }
    // Collect selected nodes + all upstream dependencies
    const upstreamIds = new Set<string>(selectedNodeIds)
    let changed = true
    while (changed) {
      changed = false
      for (const edge of edges as any[]) {
        if (upstreamIds.has(edge.target) && !upstreamIds.has(edge.source)) {
          upstreamIds.add(edge.source)
          changed = true
        }
      }
    }
    const subNodes = (nodes as any[]).filter(n => upstreamIds.has(n.id))
    const subEdges = (edges as any[]).filter(e => upstreamIds.has(e.source) && upstreamIds.has(e.target))
    await executeWorkflow(subNodes, subEdges, workflowRunId, {
      onNodeStart: (nodeId) => addExecutingNode(nodeId),
      onNodeComplete: (nodeId, output) => {
        removeExecutingNode(nodeId)
        setNodeOutput(nodeId, output)
        updateNodeData(nodeId, { output: String(output || ''), error: undefined })
      },
      onNodeError: (nodeId, error) => {
        removeExecutingNode(nodeId)
        updateNodeData(nodeId, { error })
      }
    })
    setIsRunning(false)
  }

  async function handleSave() {
    if (!nodes.length) { alert('Nothing to save!'); return }
    const res = await fetch('/api/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workflowName || 'Untitled Workflow',
        data: { nodes, edges },
        workflowId: currentWorkflowId
      })
    })
    const data = await res.json()
    if (data.success) {
      setCurrentWorkflowId(data.workflow.id)
      alert('Workflow saved successfully!')
    }
  }

  function handleLoadSample() {
    setNodes(sampleWorkflow.nodes as any)
    setEdges(sampleWorkflow.edges as any)
    setWorkflowName('Product Marketing Kit Generator')
  }

  function handleExport() {
    const exportData = {
      name: workflowName || 'Untitled Workflow',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: { nodes, edges },
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(workflowName || 'workflow').replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        if (json.data?.nodes) setNodes(json.data.nodes)
        if (json.data?.edges) setEdges(json.data.edges)
        if (json.name) setWorkflowName(json.name)
      } catch {
        alert('Invalid workflow JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('nodeType', nodeType)
  }

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (!reactFlowWrapper.current || !reactFlowInstance) return
      const nodeType = event.dataTransfer.getData('nodeType')
      if (!nodeType) return
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const newNode: any = {
        id: crypto.randomUUID(),
        data: { label: nodeType },
        position,
        type: nodeType,
      }
      setNodes([...nodes, newNode])
    },
    [reactFlowInstance, setNodes, nodes]
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      // DAG validation: reject circular connections
      if (connection.source && connection.target && hasCycle(connection.source, connection.target, edges as any[])) {
        setDagError('Circular connection not allowed — this would create a loop.')
        setTimeout(() => setDagError(null), 3000)
        return
      }
      setEdges(addEdge({
        ...connection,
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
      }, edges as any[]) as any)
    },
    [setEdges, edges]
  )

  const filteredNodes = nodeDefinitions.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 z-40 flex items-center justify-between px-4" style={{ background: 'rgba(15, 15, 15, 0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Left: Back & Workflow Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-white text-sm font-medium border-0 outline-none flex-1 max-w-xs"
            placeholder="Untitled Workflow"
          />
          {/* Undo/Redo */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={undo} disabled={past.length === 0} className="text-gray-600 hover:text-white transition-colors disabled:opacity-30">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Undo (⌘Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={redo} disabled={future.length === 0} className="text-gray-600 hover:text-white transition-colors disabled:opacity-30">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Redo (⌘⇧Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Center: Run Controls */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleLoadSample} className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors">
            Load Sample
          </button>
          {selectedNodeIds.length > 0 && (
            <button type="button" onClick={handleRunSelected} disabled={isRunning} className="text-xs text-purple-300 border border-purple-500/30 rounded-full px-3 py-1 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
              Run Selected ({selectedNodeIds.length})
            </button>
          )}
          <button type="button" onClick={handleRun} disabled={isRunning} className="bg-white text-black text-xs font-semibold rounded-full px-4 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2">
            {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isRunning ? 'Running...' : 'Run All'}
          </button>
        </div>

        {/* Right: Import / Export / Save / Settings */}
        <div className="flex items-center gap-3 ml-auto">
          <button type="button" onClick={handleSave} className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors">
            Save
          </button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={() => importRef.current?.click()} className="text-gray-500 hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Import JSON</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={handleExport} className="text-gray-500 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Export JSON</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-gray-500 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-gray-500 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Hidden import input */}
      <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

      {/* DAG error toast */}
      {dagError && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white text-xs px-4 py-2 rounded-full shadow-lg">
          {dagError}
        </div>
      )}

      {/* Left Mini Panel - Node Picker */}
      <div className="absolute left-3 top-16 z-40 rounded-2xl p-2 w-[180px]" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl px-3 py-2 pl-8 text-xs text-gray-400 placeholder-gray-600 w-full focus:outline-none"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        </div>
        <div className="text-[10px] text-gray-600 uppercase px-2 py-1 font-medium tracking-wide">
          Quick Access
        </div>
        <div className="space-y-0.5">
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-grab active:cursor-grabbing text-xs text-gray-400 hover:text-white transition-all"
            >
              <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: node.color }} />
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* React Flow Canvas and Sidebar */}
      <div className="flex w-full h-full pt-12">
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            fitView
            deleteKeyCode="Delete"
          >
            <SelectionTracker onSelectionChange={setSelectedNodeIds} />
            <Background variant={BackgroundVariant.Dots} color="#1a2332" gap={24} size={1.5} />
            <Controls
              className="[&]:!bg-[#1c1c1c] [&]:!border-white/5 [&>button]:!bg-[#1c1c1c] [&>button]:!border-white/5 [&>button]:!text-gray-500 [&>button:hover]:!bg-white/5 [&>button:hover]:!text-white"
              showInteractive={false}
            />
            <MiniMap
              style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)' }}
              nodeColor="#a855f7"
              maskColor="rgba(0,0,0,0.85)"
              position="bottom-right"
            />
          </ReactFlow>
        </div>

        {/* History Sidebar */}
        <div className="w-80 flex-shrink-0 h-full border-l border-white/5 bg-[#0a0a0a]">
          <HistorySidebar className="bg-transparent" />
        </div>
      </div>

      {/* Empty Canvas State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 pt-12 flex flex-col items-center justify-center pointer-events-none">
          <Workflow className="w-16 h-16 text-gray-800" />
          <p className="text-gray-700 text-sm mt-2">Drop nodes here to start building</p>
        </div>
      )}
    </div>
  )
}
