'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
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
import { useTheme } from 'next-themes'

import {
  Undo2, Redo2, Search, Plus, MousePointer2, Hand, Scissors, Link2,
  Wand2, Share, Moon, Sun, ChevronDown, X, Keyboard, Play, BoxSelect,
  Image as ImageIcon, Video, Sparkles, Type, Film, Crop, Bot, Maximize,
  ChevronRight,
} from 'lucide-react'

// ── NODE TYPES ──
const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
  imageGenNode: ImageGenNode,
}

// ── NODE MENU (Krea-exact categories with sub-items + models) ──
const nodeMenuCategories = [
  {
    label: 'Image',
    icon: <ImageIcon className="w-3.5 h-3.5" />,
    items: [
      {
        label: 'Generate Image',
        type: 'imageGenNode',
        hasSubmenu: true,
        submenu: [
          { label: 'NextFlow 1', type: 'imageGenNode' },
          { label: 'Flux 2 Klein', type: 'imageGenNode' },
          { label: 'Nano Banana', type: 'imageGenNode' },
          { label: 'Nano Banana 2', type: 'imageGenNode', pro: true },
          { label: 'Flux', type: 'imageGenNode' },
        ]
      },
      {
        label: 'Enhance Image',
        type: 'cropImageNode',
        hasSubmenu: true,
        submenu: [
          { label: 'Upscale 2x', type: 'cropImageNode' },
          { label: 'Upscale 4x', type: 'cropImageNode' },
        ]
      },
      { label: 'Edit Image', type: 'cropImageNode' },
      { label: 'Image Utility', type: 'imageUploadNode' },
    ]
  },
  {
    label: 'Video',
    icon: <Video className="w-3.5 h-3.5" />,
    items: [
      { label: 'Generate Video', type: 'videoUploadNode' },
      { label: 'Enhance Video', type: 'extractFrameNode' },
      { label: 'Motion Transfer', type: 'extractFrameNode' },
      { label: 'Lipsync', type: 'videoUploadNode' },
      { label: 'Video Utility', type: 'videoUploadNode' },
    ]
  },
  {
    label: 'LLM',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    items: [
      { label: 'LLM Node', type: 'llmNode' },
      { label: 'Text / Prompt', type: 'textNode' },
    ]
  },
]

// ── PRESET TEMPLATES (Krea-exact) ──
const presetTemplates = [
  {
    id: 'empty',
    name: 'Empty Workflow',
    description: 'Start from scratch',
    icon: <Plus className="w-8 h-8 text-white" />,
    nodes: [],
    edges: [],
  },
  {
    id: 'image-gen',
    name: 'Image Generator',
    description: 'Simple text to Image Generation with NextFlow',
    thumbnail: '/placeholder-img-gen.jpg',
    nodes: [
      { id: 'text-1', type: 'textNode', position: { x: 100, y: 200 }, data: { content: 'A beautiful mountain landscape at sunset, ultra realistic, 8k' } },
      { id: 'img-1', type: 'imageGenNode', position: { x: 500, y: 150 }, data: { prompt: '' } },
    ],
    edges: [
      { id: 'e-text-img', source: 'text-1', sourceHandle: 'output', target: 'img-1', targetHandle: 'prompt', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    ],
  },
  {
    id: 'video-gen',
    name: 'Video Generator',
    description: 'Simple Video Generation with Wan 2.1',
    thumbnail: '/placeholder-vid-gen.jpg',
    nodes: [
      { id: 'text-v1', type: 'textNode', position: { x: 100, y: 200 }, data: { content: 'A cinematic drone shot over a tropical island' } },
      { id: 'vid-1', type: 'videoUploadNode', position: { x: 500, y: 150 }, data: {} },
    ],
    edges: [],
  },
  {
    id: 'upscale',
    name: '8K Upscaling & Enhancer',
    description: 'Upscaling a low resolution image to 8K',
    thumbnail: '/placeholder-upscale.jpg',
    nodes: [
      { id: 'img-up-1', type: 'imageUploadNode', position: { x: 100, y: 200 }, data: {} },
      { id: 'crop-1', type: 'cropImageNode', position: { x: 500, y: 150 }, data: {} },
    ],
    edges: [
      { id: 'e-up', source: 'img-up-1', sourceHandle: 'output', target: 'crop-1', targetHandle: 'image_url', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    ],
  },
  {
    id: 'llm-caption',
    name: 'LLM Image Captioning',
    description: 'Generate a prompt from an image with Gemini',
    thumbnail: '/placeholder-llm.jpg',
    nodes: [
      { id: 'img-c1', type: 'imageUploadNode', position: { x: 100, y: 200 }, data: {} },
      { id: 'llm-c1', type: 'llmNode', position: { x: 500, y: 150 }, data: { systemPrompt: 'You are an expert image captioning AI. Describe the uploaded image in vivid detail suitable for image generation prompts.' } },
    ],
    edges: [
      { id: 'e-cap', source: 'img-c1', sourceHandle: 'output', target: 'llm-c1', targetHandle: 'images', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    ],
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'Build a workflow with the Nodes Agent.',
    icon: <Bot className="w-8 h-8 text-white/60" />,
    nodes: [
      { id: 'llm-a1', type: 'llmNode', position: { x: 300, y: 200 }, data: { systemPrompt: 'You are an AI agent that helps users build workflows.' } },
    ],
    edges: [],
  },
]

// ── LEFT SIDEBAR ICONS (Krea-exact vertical strip) ──
const sidebarIcons = [
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />, label: 'Home', href: '/dashboard' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-red-500" />, label: 'Image', href: '/dashboard/image' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />, label: 'Video', href: '/dashboard/video' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-indigo-500" />, label: 'Enhancer', href: '/dashboard/enhancer' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-green-500" />, label: 'Nano Banana', href: '/dashboard/nano' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />, label: 'Realtime', href: '/dashboard/realtime' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-pink-500" />, label: 'Edit', href: '/dashboard/edit' },
  { icon: <div className="w-3.5 h-3.5 rounded-full bg-purple-500" />, label: 'Motion', href: '/dashboard/motion' },
]

// ── CYCLE CHECK ──
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

// ── KEYBOARD SHORTCUTS MODAL ──
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { category: 'General', items: [
      { label: 'Undo', keys: ['⌘', 'Z'] }, { label: 'Redo', keys: ['⌘', '⇧', 'Z'] },
      { label: 'Save', keys: ['⌘', 'S'] }, { label: 'Select all', keys: ['⌘', 'A'] },
      { label: 'Deselect all', keys: ['Esc'] },
      { label: 'Multi-select', keys: ['Drag', 'or', 'Shift', 'Click', 'or', '⌘', 'Drag'] },
      { label: 'Pan canvas', keys: ['Space', 'Drag'] },
      { label: 'Cut edges (Scissor)', keys: ['X', 'Drag', 'or', 'Y', 'Drag'] },
      { label: 'Canvas Agent', keys: ['^', '⌘', 'C'] },
    ]},
    { category: 'Node Creation', items: [
      { label: 'New node', keys: ['N'] },
      { label: 'Image node', keys: ['I'] },
      { label: 'Video node', keys: ['V'] },
      { label: 'LLM node', keys: ['L'] },
      { label: 'Enhance node', keys: ['E'] },
    ]},
    { category: 'Node Operations', items: [
      { label: 'Copy', keys: ['⌘', 'C'] }, { label: 'Paste', keys: ['⌘', 'V'] },
      { label: 'Duplicate', keys: ['⌘', 'D'] }, { label: 'Group nodes', keys: ['⌘', 'G'] },
      { label: 'Ungroup nodes', keys: ['⌘', '⇧', 'G'] },
    ]},
    { category: 'Execution', items: [
      { label: 'Run workflow/node', keys: ['⌘', 'Enter'] },
    ]},
    { category: 'View', items: [
      { label: 'Zoom in', keys: ['+', 'or', '='] },
      { label: 'Zoom out', keys: ['-'] },
    ]},
  ]
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111] border border-white/10 rounded-2xl w-[420px] max-h-[80vh] overflow-y-auto shadow-2xl relative scrollbar-none" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition bg-white/5 rounded-full p-1 border border-white/10"><X className="w-4 h-4" /></button>
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold mb-1">Keyboard Shortcuts</h2>
          <p className="text-gray-400 text-xs mb-6">Quickly navigate and create with these shortcuts.</p>
          <div className="space-y-5">
            {shortcuts.map(s => (
              <div key={s.category}>
                <h3 className="text-white text-[13px] font-semibold mb-2.5">{s.category}</h3>
                <div className="space-y-2">
                  {s.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[#a0a0a0] text-[13px]">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((k, j) => (
                          <span key={j} className={k === 'or' ? "text-[#555] text-[10px] px-1" : "bg-white/10 border border-white/10 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] leading-none min-w-[20px] text-center"}>{k}</span>
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

// ══════════════════════════════════════════
// ── MAIN CANVAS COMPONENT ──
// ══════════════════════════════════════════
export default function WorkflowCanvas({ id, router }: { id: string, router: any }) {
  const { user } = useClerk()
  const { theme, setTheme } = useTheme()
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
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showNodeMenu, setShowNodeMenu] = useState(false)
  const [nodeMenuPos, setNodeMenuPos] = useState({ x: 0, y: 0 })
  const [nodeSearch, setNodeSearch] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [selectedTool, setSelectedTool] = useState<'select' | 'pan' | 'cut' | 'group'>('select')
  const [showPresets, setShowPresets] = useState(true)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes]) as Node[]
  const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges]) as Edge[]
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const dark = theme === 'dark'

  // Load workflow from DB
  useEffect(() => {
    if (!id || id === 'new') return
    fetch(`/api/workflow/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.workflow) {
          setCurrentWorkflowId(data.workflow.id)
          setWorkflowName(data.workflow.name || 'Untitled')
          if (Array.isArray(data.workflow.data?.nodes)) { setNodes(data.workflow.data.nodes); setShowPresets(false) }
          if (Array.isArray(data.workflow.data?.edges)) setEdges(data.workflow.data.edges)
        }
      })
      .catch(err => console.error('Failed to load workflow:', err))
  }, [id, setCurrentWorkflowId, setWorkflowName, setNodes, setEdges])

  // Keybindings
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || (document.activeElement as any)?.contentEditable === 'true') return
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openNodeMenu() }
      if (e.key === 'i' || e.key === 'I') { e.preventDefault(); addNodeAtCenter('imageGenNode') }
      if (e.key === 'v' || e.key === 'V') { e.preventDefault(); addNodeAtCenter('videoUploadNode') }
      if (e.key === 'l' || e.key === 'L') { e.preventDefault(); addNodeAtCenter('llmNode') }
      if (e.key === 'e' || e.key === 'E') { e.preventDefault(); addNodeAtCenter('cropImageNode') }
      if (e.key === 'Escape') { setShowNodeMenu(false); setShowShortcuts(false) }
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo() }
        if (e.key === 'Enter') { e.preventDefault(); handleRun() }
        if (e.key === 's') { e.preventDefault(); handleSave() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, safeNodes, safeEdges])

  function openNodeMenu() {
    const rect = reactFlowWrapper.current?.getBoundingClientRect()
    setNodeMenuPos({ x: (rect?.width || window.innerWidth) / 2, y: (rect?.height || window.innerHeight) / 2 })
    setShowNodeMenu(true)
    setNodeSearch('')
    setActiveSubmenu(null)
  }

  function addNodeAtCenter(type: string) {
    if (!reactFlowInstance) return
    const position = reactFlowInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const newNode: Node = { id: crypto.randomUUID(), type, position: { x: position.x + (Math.random() - 0.5) * 60, y: position.y + (Math.random() - 0.5) * 60 }, data: { label: type } }
    setNodes([...safeNodes, newNode])
    setShowPresets(false)
  }

  const onNodesChange = useCallback((changes: any) => setNodes(applyNodeChanges(changes, safeNodes)), [safeNodes, setNodes])
  const onEdgesChange = useCallback((changes: any) => {
    changes.forEach((change: any) => {
      if (change.type === 'remove') {
        const edge = safeEdges.find((e: any) => e.id === change.id)
        if (edge && edge.targetHandle === 'prompt') updateNodeData(edge.target, { promptConnected: false })
      }
    })
    setEdges(applyEdgeChanges(changes, safeEdges))
  }, [safeEdges, setEdges, updateNodeData])

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && hasCycle(connection.source, connection.target, safeEdges)) return
    if (connection.targetHandle === 'prompt') updateNodeData(connection.target, { promptConnected: true })
    setEdges(addEdge({ ...connection, animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } }, safeEdges))
  }, [setEdges, safeEdges, updateNodeData])

  const addNode = (type: string) => {
    if (!reactFlowInstance) return
    const position = reactFlowInstance.screenToFlowPosition({ x: nodeMenuPos.x, y: nodeMenuPos.y })
    setNodes([...safeNodes, { id: crypto.randomUUID(), type, position, data: { label: type } } as Node])
    setShowNodeMenu(false)
    setShowPresets(false)
  }

  function loadPreset(preset: typeof presetTemplates[0]) {
    setNodes(preset.nodes as any)
    setEdges(preset.edges as any)
    setShowPresets(false)
    if (preset.name !== 'Empty Workflow') setWorkflowName(preset.name)
    setTimeout(() => reactFlowInstance?.fitView({ padding: 0.3, duration: 400 }), 100)
  }

  async function handleRun() {
    if (!safeNodes.length) return
    setIsRunning(true); resetOutputs()
    let workflowRunId = 'local-' + Date.now()
    if (currentWorkflowId) {
      try { const res = await fetch(`/api/workflow/${currentWorkflowId}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope: 'full' }) }); const data = await res.json(); if (data.success) workflowRunId = data.run.id } catch {}
    }
    await executeWorkflow(safeNodes as any, safeEdges as any, workflowRunId, {
      onNodeStart: (nodeId) => addExecutingNode(nodeId),
      onNodeComplete: (nodeId, output) => { removeExecutingNode(nodeId); setNodeOutput(nodeId, output); updateNodeData(nodeId, { output: String(output || ''), error: undefined }) },
      onNodeError: (nodeId, error) => { removeExecutingNode(nodeId); updateNodeData(nodeId, { error }) }
    })
    setIsRunning(false)
  }

  async function handleSave() {
    if (!safeNodes.length) return
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/workflow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: workflowName || 'Untitled', data: { nodes: safeNodes, edges: safeEdges }, workflowId: currentWorkflowId }) })
      const data = await res.json()
      if (data.success) { setCurrentWorkflowId(data.workflow.id); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000) }
      else setSaveStatus('idle')
    } catch { setSaveStatus('idle') }
  }

  return (
    <ReactFlowProvider>
      <div className={`relative h-screen w-full overflow-hidden font-sans ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}`}>

        {/* ── LEFT SIDEBAR (Krea vertical icon strip) ── */}
        <div className={`absolute top-0 left-0 bottom-0 w-[40px] z-50 flex flex-col items-center py-4 gap-3 ${dark ? 'bg-[#0e0e0e] border-r border-white/[0.06]' : 'bg-white border-r border-black/[0.06]'}`}>
          {/* NextFlow Logo */}
          <button onClick={() => router.push('/dashboard')} className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 font-bold text-sm ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            N
          </button>
          
          {sidebarIcons.map((item, i) => (
            <button key={i} onClick={() => router.push(item.href)} title={item.label} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              {item.icon}
            </button>
          ))}
          
          <div className="flex-1" />
          
          {/* User Avatar */}
          <div className={`w-7 h-7 rounded-full overflow-hidden border ${dark ? 'border-white/10' : 'border-black/10'}`}>
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />
            )}
          </div>
        </div>

        {/* ── TOP BAR ── */}
        <div className="absolute top-0 left-[40px] right-0 z-40 flex items-center justify-between px-4 py-3 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Logo + Name */}
            <div className={`flex items-center gap-2 px-3 h-9 rounded-full border ${dark ? 'bg-[#161616] border-white/[0.08]' : 'bg-white border-black/[0.08]'} shadow-sm`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>N</div>
              <span className={`text-[13px] font-medium outline-none max-w-[140px] truncate ${dark ? 'text-[#e0e0e0]' : 'text-gray-800'}`} contentEditable suppressContentEditableWarning onBlur={(e) => setWorkflowName(e.currentTarget.textContent || 'Untitled')}>{workflowName}</span>
              <ChevronDown className={`w-3 h-3 ${dark ? 'text-[#555]' : 'text-gray-400'}`} />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pointer-events-auto">
            <button onClick={() => setTheme(dark ? 'light' : 'dark')} className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-700 hover:bg-gray-100'}`}>
              {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button className={`h-9 px-3 flex items-center gap-1.5 rounded-full border text-[12px] font-medium transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-500 hover:text-black hover:bg-gray-50'}`}>
              <Share className="w-3.5 h-3.5" /> Share
            </button>

            <button onClick={handleSave} className={`h-9 px-3 flex items-center gap-1.5 rounded-full border text-[12px] font-medium transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-500 hover:text-black hover:bg-gray-50'}`}>
              <Wand2 className="w-3.5 h-3.5" /> {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Turn workflow into app'}
            </button>

            <div className={`w-9 h-9 rounded-full overflow-hidden border cursor-pointer ${dark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
              {user?.imageUrl ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />}
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEFT: Undo/Redo + Shortcuts ── */}
        <div className="absolute bottom-5 left-[52px] z-40 flex items-center gap-2 pointer-events-auto">
          <button onClick={undo} disabled={past.length === 0} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30 ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={future.length === 0} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30 ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Redo2 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowShortcuts(true)} className={`h-9 px-3 flex items-center gap-1.5 rounded-xl border text-[12px] font-medium transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Keyboard className="w-3.5 h-3.5" /> Keyboard shortcuts
          </button>
        </div>

        {/* ── BOTTOM CENTER: Floating Toolbar ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <div className={`flex items-center p-1.5 rounded-2xl border shadow-2xl gap-0.5 ${dark ? 'bg-[#1A1A1A] border-white/[0.08]' : 'bg-white border-black/[0.06]'}`}>
            <button onClick={() => { openNodeMenu() }} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${dark ? 'bg-[#2A2A2A] hover:bg-[#333] text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => setSelectedTool('select')} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'select' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
              <MousePointer2 className="w-[17px] h-[17px]" />
            </button>
            <button onClick={() => setSelectedTool('pan')} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'pan' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
              <Hand className="w-[17px] h-[17px]" />
            </button>
            <button onClick={() => setSelectedTool('cut')} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'cut' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
              <Scissors className="w-[17px] h-[17px]" />
            </button>
            <button onClick={() => setSelectedTool('group')} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'group' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
              <BoxSelect className="w-[17px] h-[17px]" />
            </button>
            <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5'}`}>
              <Link2 className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* ── BOTTOM RIGHT: Minimap Toggle ── */}
        <div className="absolute bottom-5 right-5 z-40 pointer-events-auto">
          <button onClick={() => reactFlowInstance?.fitView({ padding: 0.2, duration: 400 })} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* ── NODE MENU (Krea-exact floating with sub-menus) ── */}
        {showNodeMenu && (
          <>
            <div className="absolute inset-0 z-40" onClick={() => { setShowNodeMenu(false); setActiveSubmenu(null) }} />
            <div className={`absolute z-50 w-[260px] border rounded-xl shadow-2xl overflow-hidden flex flex-col ${dark ? 'bg-[#161616] border-white/[0.08]' : 'bg-white border-black/[0.08]'}`}
              style={{ left: Math.min(Math.max(nodeMenuPos.x - 130, 50), window.innerWidth - 300), top: Math.min(Math.max(nodeMenuPos.y - 200, 60), window.innerHeight - 400) }}
            >
              <div className={`p-3 border-b ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                <div className="flex items-center gap-2">
                  <Search className={`w-4 h-4 ml-1 ${dark ? 'text-[#666]' : 'text-gray-400'}`} />
                  <input autoFocus type="text" value={nodeSearch} onChange={(e) => setNodeSearch(e.target.value)} placeholder="Search nodes or models..."
                    className={`bg-transparent text-[13px] outline-none w-full ${dark ? 'text-white placeholder:text-[#555]' : 'text-black placeholder:text-gray-400'}`}
                  />
                </div>
              </div>
              <div className="p-1.5 max-h-[350px] overflow-y-auto scrollbar-none">
                {nodeMenuCategories.map(cat => {
                  const items = cat.items.filter(i => i.label.toLowerCase().includes(nodeSearch.toLowerCase()))
                  if (!items.length) return null
                  return (
                    <div key={cat.label} className="mb-1">
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1.5 ${dark ? 'text-[#555]' : 'text-gray-400'}`}>
                        {cat.icon} {cat.label}
                      </div>
                      {items.map(item => (
                        <div key={item.label} className="relative"
                          onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(item.label)}
                          onMouseLeave={() => item.hasSubmenu && setActiveSubmenu(null)}
                        >
                          <button onClick={() => !item.hasSubmenu && addNode(item.type)}
                            className={`w-full text-left flex justify-between items-center px-3 py-2 text-[13px] rounded-lg transition-colors ${dark ? 'text-[#e0e0e0] hover:bg-[#2A2A2A] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
                          >
                            {item.label}
                            {item.hasSubmenu && <ChevronRight className={`w-3.5 h-3.5 ${dark ? 'text-[#555]' : 'text-gray-400'}`} />}
                          </button>
                          {/* Sub-menu */}
                          {item.hasSubmenu && activeSubmenu === item.label && item.submenu && (
                            <div className={`absolute left-full top-0 ml-1 w-[200px] border rounded-xl shadow-2xl p-1.5 z-[60] ${dark ? 'bg-[#161616] border-white/[0.08]' : 'bg-white border-black/[0.08]'}`}>
                              <div className={`text-[10px] font-semibold uppercase px-2.5 py-1.5 ${dark ? 'text-[#555]' : 'text-gray-400'}`}>{item.label}</div>
                              {item.submenu.map(sub => (
                                <button key={sub.label} onClick={() => { addNode(sub.type); setActiveSubmenu(null) }}
                                  className={`w-full text-left flex items-center justify-between px-3 py-2 text-[13px] rounded-lg transition-colors ${dark ? 'text-[#e0e0e0] hover:bg-[#2A2A2A] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-white/20' : 'bg-black/20'}`} />
                                    {sub.label}
                                  </div>
                                  {(sub as any).pro && <span className="text-[9px] bg-orange-500/20 text-orange-400 rounded px-1 py-0.5 font-bold">PRO</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── REACT FLOW CANVAS ── */}
        <div ref={reactFlowWrapper} className="absolute top-0 left-[40px] right-0 bottom-0 z-0">
          <ReactFlow
            nodes={safeNodes} edges={safeEdges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            nodeTypes={nodeTypes as any} onInit={setReactFlowInstance}
            panOnScroll selectionOnDrag={selectedTool === 'select'}
            panOnDrag={selectedTool === 'pan' ? [0, 1, 2] : [1, 2]}
            deleteKeyCode="Backspace" proOptions={{ hideAttribution: true }}
            className={dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}
            onPaneDoubleClick={(e) => {
              const rect = reactFlowWrapper.current?.getBoundingClientRect()
              if (rect) { setNodeMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); setShowNodeMenu(true) }
            }}
            onPaneContextMenu={(e) => {
              e.preventDefault()
              const rect = reactFlowWrapper.current?.getBoundingClientRect()
              if (rect) { setNodeMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); setShowNodeMenu(true) }
            }}
          >
            <Background variant={BackgroundVariant.Dots} color={dark ? '#222' : '#ccc'} gap={20} size={1} />
          </ReactFlow>
        </div>

        {/* ── EMPTY STATE WITH PRESET TEMPLATES (Krea-exact) ── */}
        {safeNodes.length === 0 && !showNodeMenu && (
          <div className="absolute inset-0 left-[40px] flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="text-center pointer-events-auto">
              <p className={`text-[15px] font-medium mb-1 ${dark ? 'text-[#888]' : 'text-gray-500'}`}>
                Add a node <span className={`font-normal ${dark ? 'text-[#555]' : 'text-gray-400'}`}> or drag and drop media files, or select a preset</span>
              </p>

              {showPresets && (
                <>
                  <div className="flex items-center justify-center gap-4 mt-8 flex-wrap max-w-[900px]">
                    {presetTemplates.map(preset => (
                      <button key={preset.id} onClick={() => loadPreset(preset)}
                        className={`w-[140px] rounded-xl overflow-hidden border transition-all hover:scale-[1.03] hover:shadow-xl group text-left ${dark ? 'bg-[#161616] border-white/[0.08] hover:border-white/20' : 'bg-white border-black/[0.06] hover:border-black/20'}`}
                      >
                        <div className={`w-full aspect-[4/3] flex items-center justify-center overflow-hidden ${dark ? 'bg-[#111]' : 'bg-gray-100'}`}>
                          {preset.icon ? (
                            <div className={`flex items-center justify-center ${dark ? '' : 'text-black'}`}>{preset.icon}</div>
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-[10px] ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
                              <ImageIcon className="w-8 h-8 opacity-30" />
                            </div>
                          )}
                        </div>
                        <div className="px-2.5 py-2">
                          <div className={`text-[11px] font-semibold truncate ${dark ? 'text-white' : 'text-black'}`}>{preset.name}</div>
                          <div className={`text-[9px] mt-0.5 leading-tight ${dark ? 'text-[#666]' : 'text-gray-400'}`}>{preset.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button onClick={() => setShowPresets(false)} className={`mt-6 flex items-center gap-1.5 mx-auto text-[12px] font-medium transition-colors ${dark ? 'text-[#666] hover:text-white' : 'text-gray-400 hover:text-black'}`}>
                    <X className="w-3.5 h-3.5" /> Dismiss
                  </button>
                </>
              )}

              {!showPresets && (
                <div className={`flex items-center justify-center gap-1.5 mt-2 text-[13px] ${dark ? 'text-[#555]' : 'text-gray-400'}`}>
                  Double click, right click, or press <span className={`rounded px-1.5 py-0.5 text-[11px] font-mono border ${dark ? 'bg-white/[0.08] text-white border-white/10' : 'bg-black/[0.05] text-black border-black/10'}`}>N</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODALS ── */}
        {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
      </div>
    </ReactFlowProvider>
  )
}
