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

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: any) => {
    setSelectedNodeIds(selectedNodes?.map((n: any) => n.id) || [])
  }, [])

  const filteredNodes = nodeDefinitions.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 z-40 flex items-center justify-between px-2 sm:px-4 gap-1 sm:gap-0" style={{ background: 'rgba(15, 15, 15, 0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Mobile hamburger */}
        <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden text-gray-500 hover:text-white transition-colors p-1">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Left: Back & Workflow Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors hidden sm:block">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-white text-xs sm:text-sm font-medium border-0 outline-none flex-1 max-w-[120px] sm:max-w-xs"
            placeholder="Untitled Workflow"
          />
          <div className="hidden sm:flex items-center gap-1">
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
        </div>

        {/* Center: Run Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={handleLoadSample} className="text-[10px] sm:text-xs text-gray-400 border border-white/10 rounded-full px-2 sm:px-3 py-1 hover:bg-white/5 transition-colors hidden md:block">
            Load Sample
          </button>
          {selectedNodeIds.length > 0 && (
            <button type="button" onClick={handleRunSelected} disabled={isRunning} className="text-[10px] sm:text-xs text-purple-300 border border-purple-500/30 rounded-full px-2 sm:px-3 py-1 hover:bg-purple-500/10 transition-colors disabled:opacity-50">
              Run Selected ({selectedNodeIds.length})
            </button>
          )}
          <button type="button" onClick={handleRun} disabled={isRunning} className="bg-white text-black text-[10px] sm:text-xs font-semibold rounded-full px-3 sm:px-4 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-1 sm:gap-2">
            {isRunning && <Loader2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin" />}
            {isRunning ? 'Running...' : 'Run All'}
          </button>
        </div>

        {/* Right: Import / Export / Save / Settings / History toggle */}
        <div className="flex items-center gap-1 sm:gap-3 ml-auto">
          <button type="button" onClick={handleSave} className="text-[10px] sm:text-xs text-gray-400 border border-white/10 rounded-full px-2 sm:px-3 py-1 hover:bg-white/5 transition-colors">
            Save
          </button>
          <div className="hidden sm:flex items-center gap-3">
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
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={() => setHistoryOpen(!historyOpen)} className={`text-gray-500 hover:text-white transition-colors ${historyOpen ? 'text-purple-400' : ''}`}>
                  <Clock className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{historyOpen ? 'Hide' : 'Show'} History</TooltipContent>
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

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-12 bottom-0 z-50 w-[220px] sm:hidden overflow-y-auto" style={{ background: '#1c1c1c', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="p-3 space-y-3">
            <div className="flex flex-col gap-1.5">
              <button type="button" onClick={() => { router.back(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" onClick={() => { handleLoadSample(); setMobileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <Workflow className="w-4 h-4" /> Load Sample
              </button>
              <button type="button" onClick={undo} disabled={past.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                <Undo2 className="w-4 h-4" /> Undo
              </button>
              <button type="button" onClick={redo} disabled={future.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                <Redo2 className="w-4 h-4" /> Redo
              </button>
              <button type="button" onClick={() => importRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <Upload className="w-4 h-4" /> Import JSON
              </button>
              <button type="button" onClick={handleExport} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <Download className="w-4 h-4" /> Export JSON
              </button>
            </div>
            <div className="h-px bg-white/5" />
            <div className="text-[10px] text-gray-600 uppercase px-1 font-medium tracking-wide">Nodes</div>
            <div className="space-y-0.5">
              {filteredNodes.map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(e) => { handleDragStart(e, node.type); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-grab active:cursor-grabbing text-xs text-gray-400 hover:text-white transition-all"
                >
                  <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: node.color }} />
                  <span>{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Left Mini Panel - Node Picker (desktop, collapsible) */}
      <div
        className="absolute left-3 top-16 z-40 rounded-2xl p-2 hidden sm:block transition-all duration-300 ease-in-out"
        style={{
          background: '#1c1c1c',
          border: '1px solid rgba(255,255,255,0.05)',
          width: leftSidebarOpen ? 180 : 44,
          overflow: 'hidden',
        }}
      >
        <button
          type="button"
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="w-full flex items-center justify-center mb-2 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
          title={leftSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {leftSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
        </button>

        {leftSidebarOpen && (
          <>
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
          </>
        )}
        <div className="space-y-0.5">
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-grab active:cursor-grabbing text-xs text-gray-400 hover:text-white transition-all ${!leftSidebarOpen ? 'justify-center' : ''}`}
              title={!leftSidebarOpen ? node.label : undefined}
            >
              <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: node.color }} />
              {leftSidebarOpen && <span>{node.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* React Flow Canvas and Sidebar */}
      <div className="flex w-full h-full pt-12">
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
          <ReactFlow
            nodes={safeNodes}
            edges={safeEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onSelectionChange={onSelectionChange}
            fitView
            deleteKeyCode="Delete"
          >
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
        {historyOpen && (
          <div className="hidden md:block w-80 flex-shrink-0 h-full border-l border-white/5 bg-[#0a0a0a]">
            <HistorySidebar className="bg-transparent" />
          </div>
        )}
      </div>

      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Empty Canvas State */}
      {safeNodes.length === 0 && (
        <div className="absolute inset-0 pt-12 flex flex-col items-center justify-center pointer-events-none">
          <Workflow className="w-12 sm:w-16 h-12 sm:h-16 text-gray-800" />
          <p className="text-gray-700 text-xs sm:text-sm mt-2">Drop nodes here to start building</p>
        </div>
      )}
    </div>
  )
}
