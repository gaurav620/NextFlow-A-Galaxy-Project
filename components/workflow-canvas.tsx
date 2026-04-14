'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useClerk } from '@clerk/nextjs'

import TextNode from '@/components/nodes/text-node'
import ImageUploadNode from '@/components/nodes/image-upload-node'
import VideoUploadNode from '@/components/nodes/video-upload-node'
import LLMNode from '@/components/nodes/llm-node'
import CropImageNode from '@/components/nodes/crop-image-node'
import ExtractFrameNode from '@/components/nodes/extract-frame-node'
import ImageGenNode from '@/components/nodes/image-gen-node'
import { useWorkflowStore } from '@/store/workflowStore'
import { executeWorkflow } from '@/lib/workflowExecutor'
import { useAssetStore } from '@/store/assets'

import {
  Undo2,
  Redo2,
  Search,
  Plus,
  MousePointer2,
  Hand,
  Scissors,
  Link2,
  Wand2,
  Share,
  Moon,
  ChevronRight,
  Workflow,
  X,
  Keyboard,
  Play,
  BoxSelect,
} from 'lucide-react'

// --- NODE TYPES ---
const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
  imageGenNode: ImageGenNode,
}

// --- NODE MENU STRUCTURE (Krea Style) ---
const nodeMenuCategories = [
  {
    label: 'Image',
    items: [
      { label: 'Generate Image', type: 'imageGenNode' },
      { label: 'Image Upload', type: 'imageUploadNode' },
      { label: 'Crop Image', type: 'cropImageNode' },
    ]
  },
  {
    label: 'Video',
    items: [
      { label: 'Video Upload', type: 'videoUploadNode' },
      { label: 'Extract Frame', type: 'extractFrameNode' },
    ]
  },
  {
    label: 'Utility',
    items: [
      { label: 'Text/Prompt', type: 'textNode' },
      { label: 'Run LLM', type: 'llmNode' },
    ]
  }
]

// --- DAG CYCLE CHECK ---
function hasCycle(source: string, target: string, edges: Edge[]): boolean {
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

// --- KEYBOARD SHORTCUTS MODAL ---
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { label: 'Undo', keys: ['⌘', 'Z'] },
        { label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
        { label: 'Save', keys: ['⌘', 'S'] },
        { label: 'Select all', keys: ['⌘', 'A'] },
        { label: 'Deselect all', keys: ['Esc'] },
        { label: 'Multi-select', keys: ['Drag', 'or', 'Shift', 'Click'] },
        { label: 'Pan canvas', keys: ['Space', 'Drag'] },
        { label: 'Cut edges (Scissor)', keys: ['X', 'Drag'] },
      ]
    },
    {
      category: 'Node Creation',
      items: [
        { label: 'New node menu', keys: ['N', 'or', 'Double Click'] },
      ]
    },
    {
      category: 'Execution',
      items: [
        { label: 'Run workflow', keys: ['⌘', 'Enter'] },
      ]
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#111111] border border-white/10 rounded-2xl w-[400px] max-h-[80vh] overflow-y-auto shadow-2xl relative scrollbar-none"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition bg-white/5 rounded-full p-1 border border-white/10">
          <X className="w-4 h-4" />
        </button>
        
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold mb-1">Keyboard Shortcuts</h2>
          <p className="text-gray-400 text-xs mb-6">Quickly navigate and create with these shortcuts.</p>

          <div className="space-y-6">
            {shortcuts.map(section => (
              <div key={section.category}>
                <h3 className="text-white text-[13px] font-semibold mb-3">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[#a0a0a0] text-[13px]">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((k, j) => (
                          <span key={j} className={k === 'or' ? "text-[#666] text-[11px] px-1" : "bg-white/10 border border-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] leading-none"}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN CANVAS COMPONENT ---
export default function WorkflowCanvas({ id, router }: { id: string, router: any }) {
  const { user } = useClerk()
  const {
    nodes, edges, setNodes, setEdges,
    workflowName, setWorkflowName,
    currentWorkflowId, setCurrentWorkflowId,
    isRunning, setIsRunning,
    resetOutputs, addExecutingNode,
    removeExecutingNode, setNodeOutput, updateNodeData,
    undo, redo, past, future,
  } = useWorkflowStore()

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  
  // UI States
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showNodeMenu, setShowNodeMenu] = useState(false)
  const [nodeMenuPos, setNodeMenuPos] = useState({ x: 0, y: 0 })
  const [nodeSearch, setNodeSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | 'cut' | 'group'>('select')

  const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes]) as Node[]
  const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges]) as Edge[]
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Load workflow from DB
  useEffect(() => {
    if (!id || id === 'new') return
    fetch(`/api/workflow/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.workflow) {
          setCurrentWorkflowId(data.workflow.id)
          setWorkflowName(data.workflow.name || 'Untitled Workflow')
          if (Array.isArray(data.workflow.data?.nodes)) setNodes(data.workflow.data.nodes)
          if (Array.isArray(data.workflow.data?.edges)) setEdges(data.workflow.data.edges)
        }
      })
      .catch(err => console.error('Failed to load workflow:', err))
  }, [id, setCurrentWorkflowId, setWorkflowName, setNodes, setEdges])

  // Keybindings
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        const rect = reactFlowWrapper.current?.getBoundingClientRect()
        setNodeMenuPos({ x: (rect?.width || window.innerWidth) / 2, y: (rect?.height || window.innerHeight) / 2 })
        setShowNodeMenu(true)
      }
      if (e.key === 'Escape') {
        setShowNodeMenu(false)
        setShowShortcuts(false)
      }
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo() }
        if (e.key === 'Enter') { e.preventDefault(); handleRun() }
        if (e.key === 's') { e.preventDefault(); handleSave() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, reactFlowInstance, safeNodes, safeEdges]) // Added deps

  // Handlers
  const onNodesChange = useCallback((changes: any) => setNodes(applyNodeChanges(changes, safeNodes)), [safeNodes, setNodes])
  const onEdgesChange = useCallback((changes: any) => setEdges(applyEdgeChanges(changes, safeEdges)), [safeEdges, setEdges])
  
  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && hasCycle(connection.source, connection.target, safeEdges)) {
      alert("Circular connection blocked!") // Simple alert instead of toast for now
      return
    }
    setEdges(addEdge({
      ...connection,
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
    }, safeEdges))
  }, [setEdges, safeEdges])

  const handlePaneDoubleClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as Element).classList.contains('react-flow__pane')) {
      const rect = reactFlowWrapper.current?.getBoundingClientRect()
      if (rect) {
        setNodeMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        setShowNodeMenu(true)
      }
    }
  }

  const addNode = (type: string) => {
    if (!reactFlowInstance) return
    const position = reactFlowInstance.screenToFlowPosition({ x: nodeMenuPos.x, y: nodeMenuPos.y })
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position,
      data: { label: type }
    }
    setNodes([...safeNodes, newNode])
    setShowNodeMenu(false)
  }

  async function handleRun() {
    if (!safeNodes.length) return
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

  async function handleSave() {
    if (!safeNodes.length) return
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
      } else {
        setSaveStatus('idle')
      }
    } catch {
      setSaveStatus('idle')
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] font-sans selection:bg-white/20">
      
      {/* --- TOP BAR (Krea Style) --- */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-4 pointer-events-none">
        
        {/* Left: Logo & Name */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Logo Button */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center w-10 h-10 bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-xl border border-white/[0.08] shadow-sm"
          >
            <div className="w-5 h-5 grid grid-cols-2 gap-[2px]">
              <div className="bg-white rounded-tl-[4px]" />
              <div className="bg-white/50 rounded-tr-[4px]" />
              <div className="bg-white/50 rounded-bl-[4px]" />
              <div className="bg-white/20 rounded-br-[4px]" />
            </div>
          </button>

          {/* Workflow Name Dropdown */}
          <div className="flex items-center px-4 h-10 bg-[#161616] rounded-full border border-white/[0.08] shadow-sm group">
            <span className="text-[#a0a0a0] text-[13px] font-medium mr-2 max-w-[120px] truncate outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => setWorkflowName(e.currentTarget.textContent || 'Untitled')}>{workflowName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#555] group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button className="w-10 h-10 flex items-center justify-center bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-full border border-white/[0.08] text-white tooltip-trigger">
            <Moon className="w-[18px] h-[18px]" />
          </button>
          
          <button className="h-10 px-4 flex items-center gap-2 bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-full border border-white/[0.08] text-[#a0a0a0] hover:text-white font-medium text-[13px] shadow-sm">
            <Share className="w-3.5 h-3.5" /> Share
          </button>

          <button onClick={handleSave} className="h-10 px-4 flex items-center gap-2 bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-full border border-white/[0.08] text-[#a0a0a0] hover:text-white font-medium text-[13px] shadow-sm">
            <Wand2 className="w-3.5 h-3.5" /> 
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save app'}
          </button>

          <div className="w-10 h-10 ml-1 rounded-full cursor-pointer border border-white/[0.08] overflow-hidden flex items-center justify-center bg-[#161616]">
            {user?.imageUrl ? (
               <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-6 left-6 z-40 flex items-center gap-3 pointer-events-auto">
        {/* Undo / Redo */}
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={past.length === 0} className="w-10 h-10 flex items-center justify-center bg-[#161616] hover:bg-[#1E1E1E] disabled:opacity-50 disabled:hover:bg-[#161616] transition-colors rounded-xl border border-white/[0.08] text-[#a0a0a0] hover:text-white shadow-sm">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={future.length === 0} className="w-10 h-10 flex items-center justify-center bg-[#161616] hover:bg-[#1E1E1E] disabled:opacity-50 disabled:hover:bg-[#161616] transition-colors rounded-xl border border-white/[0.08] text-[#a0a0a0] hover:text-white shadow-sm">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Shortcuts Toggle */}
        <button onClick={() => setShowShortcuts(true)} className="h-10 px-4 flex items-center gap-2 bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-xl border border-white/[0.08] text-[#a0a0a0] hover:text-white font-medium text-[13px] shadow-sm">
          <Keyboard className="w-4 h-4" /> Keyboard shortcuts
        </button>
      </div>

      {/* FLOATING ACTION BAR (Center Bottom) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="flex items-center p-1.5 bg-[#1A1A1A] rounded-2xl border border-white/[0.08] shadow-2xl gap-1">
          <button 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setNodeMenuPos({ x: rect.left, y: rect.top - 300 })
              setShowNodeMenu(!showNodeMenu)
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A2A2A] hover:bg-[#333] text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <button onClick={() => handleRun()} disabled={isRunning} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50">
            {isRunning ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5 relative left-[1px]" />}
          </button>

          <button onClick={() => setSelectedTool('pan')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'pan' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'}`}>
            <Hand className="w-[18px] h-[18px]" />
          </button>
          
          <button onClick={() => setSelectedTool('cut')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'cut' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'}`}>
            <Scissors className="w-[18px] h-[18px]" />
          </button>

          <button onClick={() => setSelectedTool('group')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'group' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'}`}>
            <BoxSelect className="w-[18px] h-[18px]" />
          </button>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            <Link2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* --- NODE INSERTION MENU (Krea Style Floating) --- */}
      {showNodeMenu && (
        <>
          <div className="absolute inset-0 z-40" onClick={() => setShowNodeMenu(false)} />
          <div 
            className="absolute z-50 w-[240px] bg-[#161616] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ 
              left: Math.min(Math.max(nodeMenuPos.x, 20), window.innerWidth - 260), 
              top: Math.min(Math.max(nodeMenuPos.y - 100, 20), window.innerHeight - 300) 
            }}
          >
            <div className="p-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-[#a0a0a0]">
                <Search className="w-4 h-4 ml-1" />
                <input 
                  autoFocus
                  type="text" 
                  value={nodeSearch}
                  onChange={(e) => setNodeSearch(e.target.value)}
                  placeholder="Search nodes or models..." 
                  className="bg-transparent text-white text-[13px] outline-none w-full placeholder:text-[#666]"
                />
              </div>
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto scrollbar-none">
              {nodeMenuCategories.map(cat => {
                const items = cat.items.filter(i => i.label.toLowerCase().includes(nodeSearch.toLowerCase()))
                if (!items.length) return null
                return (
                  <div key={cat.label} className="mb-2">
                    <div className="text-[11px] font-semibold text-[#666] uppercase px-3 py-1.5">{cat.label}</div>
                    {items.map(item => (
                      <button 
                        key={item.type}
                        onClick={() => addNode(item.type)}
                        className="w-full text-left flex justify-between items-center px-3 py-2 text-[13px] text-[#e0e0e0] hover:bg-[#2A2A2A] hover:text-white rounded-lg transition-colors"
                      >
                        {item.label}
                        <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* --- REACT FLOW CANVAS --- */}
      <div ref={reactFlowWrapper} className="absolute inset-0 z-0">
        <ReactFlow
          nodes={safeNodes}
          edges={safeEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes as any}
          onInit={setReactFlowInstance}
          panOnScroll
          selectionOnDrag={selectedTool === 'select'}
          panOnDrag={selectedTool === 'pan' ? [0, 1, 2] : [1, 2]} // Middle/Right click pan, or left if tool is Pan
          deleteKeyCode="Backspace"
          proOptions={{ hideAttribution: true }}
          className="bg-[#0A0A0A]"
          onPaneDoubleClick={handlePaneDoubleClick}
          onPaneContextMenu={(e) => {
            e.preventDefault()
            const rect = reactFlowWrapper.current?.getBoundingClientRect()
            if (rect) {
              setNodeMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
              setShowNodeMenu(true)
            }
          }}
        >
          <Background variant={BackgroundVariant.Dots} color="#333" gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* --- EMPTY STATE TEXT --- */}
      {safeNodes.length === 0 && !showNodeMenu && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center font-medium">
            <p className="text-[#888] text-[15px] mb-1">Add a node</p>
            <div className="flex items-center justify-center gap-1.5 text-[#555] text-[13px]">
              Double click, right click, or press <span className="bg-white/[0.08] text-white border border-white/10 rounded px-1.5 py-0.5 text-[11px] leading-none uppercase font-mono">N</span>
            </div>
          </div>
        </div>
      )}

      {/* MINIMAP (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-40 pointer-events-auto">
        <button 
          onClick={() => {
            const el = document.querySelector('.react-flow__minimap') as HTMLElement
            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none'
          }}
          className="w-10 h-10 flex items-center justify-center bg-[#161616] hover:bg-[#1E1E1E] transition-colors rounded-xl border border-white/[0.08] text-[#a0a0a0] hover:text-white shadow-sm"
        >
          <div className="grid grid-cols-2 gap-1 w-4 h-4">
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current opacity-30 rounded-[2px]" />
          </div>
        </button>
      </div>
      
      {/* Hidden default minimap (toggled by button above) */}
      <div className="absolute bottom-20 right-6 z-40 pointer-events-none opacity-80 backdrop-blur-3xl">
        <MiniMap 
          style={{ width: 160, height: 120, background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
          nodeColor="#333"
          maskColor="rgba(0,0,0,0.5)"
          className="!m-0 !relative !bottom-0 !right-0 !shadow-2xl react-flow__minimap block"
        />
      </div>

      {/* --- MODALS --- */}
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
      
    </div>
  )
}
