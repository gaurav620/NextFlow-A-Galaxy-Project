'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  ReactFlow,
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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import TextNode from '@/components/nodes/text-node'
import ImageUploadNode from '@/components/nodes/image-upload-node'
import VideoUploadNode from '@/components/nodes/video-upload-node'
import LLMNode from '@/components/nodes/llm-node'
import CropImageNode from '@/components/nodes/crop-image-node'
import ExtractFrameNode from '@/components/nodes/extract-frame-node'
import ImageGenNode from '@/components/nodes/image-gen-node'
import HistorySidebar from '@/components/history-sidebar'
import { useWorkflowStore } from '@/store/workflowStore'
import { executeWorkflow } from '@/lib/workflowExecutor'
import { sampleWorkflow } from '@/data/sampleWorkflow'

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
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Clock,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
  imageGenNode: ImageGenNode,
}

const nodeDefinitions = [
  { type: 'textNode', label: 'Text', color: '#3b82f6' },
  { type: 'imageUploadNode', label: 'Upload Image', color: '#22c55e' },
  { type: 'videoUploadNode', label: 'Upload Video', color: '#f97316' },
  { type: 'llmNode', label: 'Run LLM', color: '#a855f7' },
  { type: 'imageGenNode', label: 'Image Gen', color: '#0ea5e9' },
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

interface WorkflowCanvasProps {
  id: string
  router: any
}

export default function WorkflowCanvas({ id, router }: WorkflowCanvasProps) {
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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(true)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  // Ensure nodes/edges are always arrays
  const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes])
  const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges])

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
          if (Array.isArray(wf.data?.nodes)) setNodes(wf.data.nodes)
          if (Array.isArray(wf.data?.edges)) setEdges(wf.data.edges)
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
    (changes: any) => setNodes(applyNodeChanges(changes, safeNodes as any) as any),
    [safeNodes, setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: any) => setEdges(applyEdgeChanges(changes, safeEdges as any)),
    [safeEdges, setEdges]
  )

  async function handleRun() {
    if (!safeNodes.length) { alert('Add some nodes first!'); return }
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
    await executeWorkflow(safeNodes as any, safeEdges as any, workflowRunId, {
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
    const upstreamIds = new Set<string>(selectedNodeIds)
    let changed = true
    while (changed) {
      changed = false
      for (const edge of safeEdges as any[]) {
        if (upstreamIds.has(edge.target) && !upstreamIds.has(edge.source)) {
          upstreamIds.add(edge.source)
          changed = true
        }
      }
    }
    const subNodes = (safeNodes as any[]).filter(n => upstreamIds.has(n.id))
    const subEdges = (safeEdges as any[]).filter(e => upstreamIds.has(e.source) && upstreamIds.has(e.target))
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
    if (!safeNodes.length) { alert('Nothing to save!'); return }
    const res = await fetch('/api/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workflowName || 'Untitled Workflow',
        data: { nodes: safeNodes, edges: safeEdges },
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
      data: { nodes: safeNodes, edges: safeEdges },
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
      setNodes([...safeNodes, newNode])
    },
    [reactFlowInstance, setNodes, safeNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && hasCycle(connection.source, connection.target, safeEdges as any[])) {
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
      }, safeEdges as any[]) as any)
    },
    [setEdges, safeEdges]
  )

  const onSelectionChange = useCallback((params: any) => {
    const selectedNodes = params?.nodes || []
    setSelectedNodeIds(Array.isArray(selectedNodes) ? selectedNodes.map((n: any) => n.id) : [])
  }, [])

  const filteredNodes = nodeDefinitions.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] font-sans">
      {/* Top Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        
        {/* Left: Back & Name */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#111111]/90 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/[0.06] shadow-xl">
          <button type="button" onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-white text-sm font-medium border-0 outline-none w-[140px] px-2 focus:ring-0"
            placeholder="Untitled Node"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center bg-[#111111]/90 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-white/[0.06] shadow-xl">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={undo} disabled={past.length === 0} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 disabled:opacity-30">
                    <Undo2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="border-white/10 bg-[#111] text-xs">Undo (⌘Z)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={redo} disabled={future.length === 0} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 disabled:opacity-30">
                    <Redo2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="border-white/10 bg-[#111] text-xs">Redo (⌘⇧Z)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

             <div className="h-4 w-px bg-white/10 mx-1" />

            <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors">
              Save
            </button>
            <button type="button" onClick={handleExport} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Download className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => importRef.current?.click()} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
               <Upload className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setHistoryOpen(!historyOpen)} className={`w-8 h-8 flex items-center justify-center transition-colors rounded-full hover:bg-white/5 ${historyOpen ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
               <Clock className="w-4 h-4" />
            </button>
          </div>

          <button 
            type="button" 
            onClick={handleRun} 
            disabled={isRunning} 
            className="bg-white text-black text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-gray-200 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : 'Run Nodes'}
          </button>
        </div>
      </div>

      {/* Hidden Files & Errors */}
      <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      {dagError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
          {dagError}
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={safeNodes as any}
          edges={safeEdges as any}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes as any}
          onInit={setReactFlowInstance as any}
          onSelectionChange={onSelectionChange}
          fitView
          deleteKeyCode="Delete"
        >
          <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.08)" gap={24} size={1.5} />
        </ReactFlow>
      </div>

      {/* Center Floating Bottom Node Dock (Krea Style) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5 overflow-x-auto max-w-[90vw] hide-scrollbar">
          <div className="flex items-center px-3 gap-2 border-r border-white/10 mr-1 py-2">
             <Search className="w-4 h-4 text-gray-500" />
             <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-xs text-white placeholder-gray-600 w-[100px]"
             />
          </div>
          
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-white/5 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-white/[0.05]"
            >
              <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ background: node.color, boxShadow: `0 0 8px ${node.color}40` }} />
              <span className="text-xs font-medium text-gray-300 whitespace-nowrap">{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Mini Map (Bottom Right, Stylized) */}
      <div className="absolute bottom-6 left-6 z-40 pointer-events-auto overflow-hidden rounded-2xl border border-white/[0.06] shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl w-32 h-24 hidden md:block opacity-60 hover:opacity-100 transition-opacity">
        {reactFlowInstance && (
          <div className="w-full h-full relative -z-10 pointer-events-none">
             {/* We rely on ReactFlow Minimap standard if needed, but styling it manually via CSS in global might be cleaner. For now using built in with heavy overrides. */}
             <div className="absolute inset-0 bg-[#0a0a0a]" />
          </div>
        )}
      </div>

      {/* History Slide-over (Right side) */}
      {historyOpen && (
        <div className="absolute top-20 right-4 bottom-24 w-80 bg-[#111111]/95 backdrop-blur-2xl border border-white/[0.06] shadow-2xl rounded-3xl z-40 overflow-hidden shadow-black/50">
          <HistorySidebar className="bg-transparent h-full" />
        </div>
      )}

      {/* Empty State Overlay */}
      {safeNodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm shadow-2xl">
            <Workflow className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-500 font-medium tracking-tight">Drag nodes from the bottom dock to begin</p>
        </div>
      )}
    </div>
  )
}

