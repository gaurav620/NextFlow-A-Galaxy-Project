'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
import { useAssetStore } from '@/store/assets'

import {
  ChevronLeft,
  Search,
  Workflow,
  Loader2,
  Download,
  Upload,
  Undo2,
  Redo2,
  X,
  Clock,
  Play,
  Type,
  ImageIcon,
  Video,
  Sparkles,
  Scissors,
  Film,
  Plus,
  MousePointer2,
  ChevronDown,
  Zap,
} from 'lucide-react'

const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
  imageGenNode: ImageGenNode,
}

const nodeCategories = [
  {
    label: 'Media',
    icon: <ImageIcon className="w-3 h-3" />,
    nodes: [
      { type: 'imageUploadNode', label: 'Upload Image', color: '#22c55e', icon: <ImageIcon className="w-3.5 h-3.5" /> },
      { type: 'videoUploadNode', label: 'Upload Video', color: '#f97316', icon: <Video className="w-3.5 h-3.5" /> },
    ],
  },
  {
    label: 'AI',
    icon: <Sparkles className="w-3 h-3" />,
    nodes: [
      { type: 'imageGenNode', label: 'Generate Image', color: '#0ea5e9', icon: <Zap className="w-3.5 h-3.5" /> },
      { type: 'llmNode', label: 'Run LLM', color: '#a855f7', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ],
  },
  {
    label: 'Utility',
    icon: <Scissors className="w-3 h-3" />,
    nodes: [
      { type: 'textNode', label: 'Text', color: '#3b82f6', icon: <Type className="w-3.5 h-3.5" /> },
      { type: 'cropImageNode', label: 'Crop Image', color: '#ec4899', icon: <Scissors className="w-3.5 h-3.5" /> },
      { type: 'extractFrameNode', label: 'Extract Frame', color: '#eab308', icon: <Film className="w-3.5 h-3.5" /> },
    ],
  },
]

const allNodes = nodeCategories.flatMap(c => c.nodes)

/** DFS cycle check */
function hasCycle(source: string, target: string, edges: { source: string; target: string }[]): boolean {
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
  const [historyOpen, setHistoryOpen] = useState(false)
  const [nodePanelOpen, setNodePanelOpen] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes])
  const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges])

  // Load workflow from DB
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

  // Keyboard shortcuts
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
    if (!safeNodes.length) { setDagError('Add some nodes first!'); setTimeout(() => setDagError(null), 3000); return }
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
        if (output && typeof output === 'string' && output.startsWith('http')) {
          const node = (safeNodes as any[]).find(n => n.id === nodeId)
          if (node && ['imageGenNode', 'extractFrameNode', 'cropImageNode'].includes(node.type)) {
            useAssetStore.getState().addAsset({
              url: output,
              prompt: node.data?.prompt || `Generated from ${node.label || node.type}`,
              tool: 'workflow',
              ratio: '1:1',
            })
          }
        }
      },
      onNodeError: (nodeId, error) => {
        removeExecutingNode(nodeId)
        updateNodeData(nodeId, { error })
      }
    })
    setIsRunning(false)
    // After run, refresh history
    setHistoryOpen(true)
  }

  async function handleSave() {
    if (!safeNodes.length) { setDagError('Nothing to save!'); setTimeout(() => setDagError(null), 3000); return }
    setSaveStatus('saving')
    try {
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
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('idle')
    }
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
        setDagError('Invalid workflow JSON file')
        setTimeout(() => setDagError(null), 3000)
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

  const handleAddNodeClick = useCallback(
    (nodeType: string) => {
      if (!reactFlowInstance) return
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const position = reactFlowInstance.screenToFlowPosition({ x: centerX, y: centerY })
      const newNode: any = {
        id: crypto.randomUUID(),
        data: { label: nodeType },
        position: { x: position.x + (Math.random() - 0.5) * 80, y: position.y + (Math.random() - 0.5) * 80 },
        type: nodeType,
      }
      setNodes((nds: any) => [...nds, newNode])
    },
    [reactFlowInstance, setNodes]
  )

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

  const filteredNodes = allNodes.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = searchQuery
    ? [{ label: 'Results', icon: <Search className="w-3 h-3" />, nodes: filteredNodes }]
    : nodeCategories

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ background: '#050505' }}>
      
      {/* ── ReactFlow Canvas ── */}
      <div ref={reactFlowWrapper} className="absolute inset-0 z-0">
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
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="rgba(255,255,255,0.06)"
            gap={28}
            size={1.2}
          />
          {/* Bottom-right MiniMap */}
          <MiniMap
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
            }}
            maskColor="rgba(0,0,0,0.6)"
            nodeColor={() => 'rgba(255,255,255,0.15)'}
            className="!bottom-[80px] !right-4"
          />
        </ReactFlow>
      </div>

      {/* ── Floating Error Toast ── */}
      {dagError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1a0a0a] border border-red-500/30 text-red-400 text-xs px-4 py-2 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {dagError}
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
        
        {/* Left: Back + Name */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111]/80 backdrop-blur-xl border border-white/[0.07] rounded-xl text-gray-400 hover:text-white transition-all text-xs shadow-xl hover:bg-white/[0.06]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Workflow name pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111]/80 backdrop-blur-xl border border-white/[0.07] rounded-xl shadow-xl">
            <div className="w-5 h-5 rounded-md bg-[#1a1a2e] border border-white/10 flex items-center justify-center flex-shrink-0">
              <Workflow className="w-3 h-3 text-purple-400" />
            </div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-transparent text-white text-[13px] font-medium border-0 outline-none w-[130px] placeholder-gray-600"
              placeholder="Untitled Workflow"
            />
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Undo / Redo */}
          <div className="flex items-center bg-[#111]/80 backdrop-blur-xl border border-white/[0.07] rounded-xl shadow-xl overflow-hidden">
            <button
              type="button"
              onClick={undo}
              disabled={past.length === 0}
              title="Undo (⌘Z)"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors disabled:opacity-25 hover:bg-white/[0.05]"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-white/[0.07]" />
            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (⌘⇧Z)"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors disabled:opacity-25 hover:bg-white/[0.05]"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Import/Export */}
          <div className="flex items-center bg-[#111]/80 backdrop-blur-xl border border-white/[0.07] rounded-xl shadow-xl overflow-hidden">
            <button
              type="button"
              onClick={handleExport}
              title="Export"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors hover:bg-white/[0.05]"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-white/[0.07]" />
            <button
              type="button"
              onClick={() => importRef.current?.click()}
              title="Import"
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition-colors hover:bg-white/[0.05]"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* History */}
          <button
            type="button"
            onClick={() => setHistoryOpen(!historyOpen)}
            title="Workflow History"
            className={`w-8 h-8 flex items-center justify-center rounded-xl border shadow-xl transition-all ${
              historyOpen
                ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                : 'bg-[#111]/80 backdrop-blur-xl border-white/[0.07] text-gray-500 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-3.5 flex items-center gap-1.5 text-xs font-medium bg-[#111]/80 backdrop-blur-xl border border-white/[0.07] rounded-xl text-gray-300 hover:text-white transition-all shadow-xl hover:bg-white/[0.05]"
          >
            {saveStatus === 'saving' ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
            ) : saveStatus === 'saved' ? (
              <><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Saved</>
            ) : (
              'Save'
            )}
          </button>

          {/* Run */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="h-8 px-4 flex items-center gap-2 text-[13px] font-semibold bg-white text-black rounded-xl hover:bg-gray-100 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running</>
            ) : (
              <><Play className="w-3.5 h-3.5 fill-current" /> Run</>
            )}
          </button>
        </div>
      </div>

      {/* ── LEFT NODE PANEL (krea.ai style) ── */}
      {nodePanelOpen && (
        <div className="absolute top-14 left-3 z-40 w-[220px] bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
          {/* Search */}
          <div className="p-2 border-b border-white/[0.05]">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors border border-white/[0.04]">
              <Search className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-xs text-white placeholder-gray-600 w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-600 hover:text-gray-400">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Node Categories */}
          <div className="flex-1 overflow-y-auto py-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {filteredCategories.map((category) => (
              <div key={category.label} className="mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                  {category.icon}
                  {category.label}
                </div>
                {category.nodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onClick={() => handleAddNodeClick(node.type)}
                    className="flex items-center gap-2.5 px-3 py-2 mx-1 rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/[0.06] transition-all group border border-transparent hover:border-white/[0.05]"
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        background: `${node.color}18`,
                        border: `1px solid ${node.color}30`,
                        color: node.color,
                      }}
                    >
                      {node.icon}
                    </div>
                    <span className="text-[12px] font-medium text-gray-300 group-hover:text-white transition-colors">{node.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOGGLE NODE PANEL BUTTON ── */}
      <button
        type="button"
        onClick={() => setNodePanelOpen(!nodePanelOpen)}
        title={nodePanelOpen ? 'Close node panel' : 'Open node panel'}
        className={`absolute top-14 z-40 w-7 h-7 flex items-center justify-center rounded-xl border shadow-xl transition-all ${
          nodePanelOpen
            ? 'left-[235px] bg-[#0e0e0e]/95 backdrop-blur-2xl border-white/[0.07] text-gray-400 hover:text-white'
            : 'left-3 bg-[#111]/80 backdrop-blur-xl border-white/[0.07] text-gray-500 hover:text-white hover:bg-white/[0.05]'
        }`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* ── BOTTOM CENTER TOOLBAR (krea.ai style) ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/[0.07] rounded-2xl px-2 py-2 shadow-2xl">
          {/* Undo / Redo mini */}
          <button
            type="button"
            onClick={undo}
            disabled={past.length === 0}
            title="Undo"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-25"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={future.length === 0}
            title="Redo"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-25"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-5 bg-white/[0.07] mx-1" />

          {/* Fit view */}
          <button
            type="button"
            onClick={() => reactFlowInstance?.fitView({ padding: 0.2, duration: 400 })}
            title="Fit view"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <MousePointer2 className="w-3.5 h-3.5" />
          </button>

          {/* Load sample */}
          <button
            type="button"
            onClick={() => {
              setNodes(sampleWorkflow.nodes as any)
              setEdges(sampleWorkflow.edges as any)
              setWorkflowName('Product Marketing Kit Generator')
            }}
            title="Load sample workflow"
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-xl text-[11px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Sample</span>
          </button>

          <div className="w-px h-5 bg-white/[0.07] mx-1" />

          {/* Run button in toolbar */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 h-8 rounded-xl text-[12px] font-semibold bg-white text-black hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isRunning ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running</>
            ) : (
              <><Play className="w-3.5 h-3.5 fill-current" /> Run</>
            )}
          </button>
        </div>
      </div>

      {/* ── HISTORY PANEL (Right slide-over) ── */}
      {historyOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 sm:hidden"
            onClick={() => setHistoryOpen(false)}
          />
          <div className="absolute top-14 right-3 bottom-[70px] w-[280px] bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/[0.07] rounded-2xl z-40 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[13px] font-semibold text-white">Run History</span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <HistorySidebar className="flex-1 overflow-y-auto bg-transparent" />
          </div>
        </>
      )}

      {/* ── EMPTY STATE ── */}
      {safeNodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center shadow-2xl">
              <Workflow className="w-7 h-7 text-gray-700" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-gray-500">Drag nodes from the panel</p>
              <p className="text-[12px] text-gray-700 mt-1">or click a node to add it to center</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden import input */}
      <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
    </div>
  )
}
