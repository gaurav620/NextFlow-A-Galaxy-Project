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
import HistorySidebar from '@/components/history-sidebar'
import { useWorkflowStore } from '@/store/workflowStore'
import { executeWorkflow } from '@/lib/workflowExecutor'
import { useAssetStore } from '@/store/assets'
import { useTheme } from 'next-themes'

import {
  Undo2, Redo2, Search, Plus, MousePointer2, Hand, Scissors, Link2,
  Wand2, Share, Moon, Sun, ChevronDown, ChevronUp, X, Keyboard, Play, BoxSelect,
  Image as ImageIcon, Video, Sparkles, Type, Film, Crop, Bot, Maximize,
  ArrowLeft, Download, Upload, Users, PanelRightOpen, PanelRightClose,
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
      { label: 'Generate Image', type: 'imageGenNode', desc: 'Text to Image' },
      { label: 'Enhance Image', type: 'cropImageNode', desc: 'Upscale & enhance' },
      { label: 'Edit Image', type: 'cropImageNode', desc: 'Crop & transform' },
      { label: 'Image Utility', type: 'imageUploadNode', desc: 'Upload an image' },
    ]
  },
  {
    label: 'Video',
    icon: <Video className="w-3.5 h-3.5" />,
    items: [
      { label: 'Generate Video', type: 'videoUploadNode', desc: 'Text to Video' },
      { label: 'Enhance Video', type: 'extractFrameNode', desc: 'Upscale video' },
      { label: 'Motion Transfer', type: 'extractFrameNode', desc: 'Transfer motion' },
      { label: 'Lipsync', type: 'videoUploadNode', desc: 'Sync audio to video' },
      { label: 'Video Utility', type: 'videoUploadNode', desc: 'Upload a video' },
    ]
  },
  {
    label: 'LLM',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    items: [
      { label: 'LLM Node', type: 'llmNode', desc: 'Run Gemini / GPT' },
      { label: 'Text / Prompt', type: 'textNode', desc: 'Enter text' },
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
  const [showDropdown, setShowDropdown] = useState(false)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const safeNodes = useMemo(() => Array.isArray(nodes) ? nodes : [], [nodes]) as Node[]
  const safeEdges = useMemo(() => Array.isArray(edges) ? edges : [], [edges]) as Edge[]
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const dark = theme === 'dark'

  // ── AUTO-SAVE (1s debounce) ──
  useEffect(() => {
    if (!safeNodes.length || !currentWorkflowId) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await fetch('/api/workflow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: workflowName || 'Untitled', data: { nodes: safeNodes, edges: safeEdges }, workflowId: currentWorkflowId }),
        })
      } catch {}
    }, 1000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [safeNodes, safeEdges, currentWorkflowId, workflowName])

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
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); addNodeAtCenter('textNode') }
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

  // ── Type-safe connection validation ──
  const isValidConnection = useCallback((connection: Edge | Connection) => {
    const src = 'source' in connection ? connection.source : undefined
    const tgt = 'target' in connection ? connection.target : undefined
    if (!src || !tgt) return false
    if (src === tgt) return false
    // Prevent cycles
    if (hasCycle(src, tgt, safeEdges)) return false

    // Handle-type compatibility rules
    const sourceNode = safeNodes.find(n => n.id === src)
    const targetHandle = ('targetHandle' in connection ? connection.targetHandle : '') || ''

    // Video handles should only accept video sources
    if (targetHandle === 'video_url' && sourceNode?.type !== 'videoUploadNode') return false
    // Image handles should only accept image-producing sources
    if (targetHandle === 'image_url' && sourceNode?.type === 'videoUploadNode') return false

    return true
  }, [safeNodes, safeEdges])

  const addNode = (type: string, extraData?: Record<string, any>) => {
    if (!reactFlowInstance) return
    // Use menu position or fallback to center of screen
    const screenX = nodeMenuPos.x || window.innerWidth / 2
    const screenY = nodeMenuPos.y || window.innerHeight / 2
    const position = reactFlowInstance.screenToFlowPosition({ x: screenX, y: screenY })
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position: { x: position.x + (Math.random() - 0.5) * 40, y: position.y + (Math.random() - 0.5) * 40 },
      data: { label: type, ...extraData }
    }
    setNodes([...safeNodes, newNode])
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
    setIsRunning(true)
    resetOutputs()
    
    // Clear previous errors/outputs from all nodes
    safeNodes.forEach(n => updateNodeData(n.id, { error: undefined, isExecuting: false }))
    
    let workflowRunId = 'local-' + Date.now()
    if (currentWorkflowId) {
      try {
        const res = await fetch(`/api/workflow/${currentWorkflowId}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope: 'full' }) })
        const data = await res.json()
        if (data.success) workflowRunId = data.run.id
      } catch (e) {
        console.warn('Could not create workflow run record, using local ID')
      }
    }
    
    let hasError = false
    await executeWorkflow(safeNodes as any, safeEdges as any, workflowRunId, {
      onNodeStart: (nodeId) => {
        addExecutingNode(nodeId)
        updateNodeData(nodeId, { isExecuting: true, error: undefined })
      },
      onNodeComplete: (nodeId, output) => {
        removeExecutingNode(nodeId)
        setNodeOutput(nodeId, output)
        updateNodeData(nodeId, { output: String(output || ''), error: undefined, isExecuting: false })
      },
      onNodeError: (nodeId, error) => {
        hasError = true
        removeExecutingNode(nodeId)
        updateNodeData(nodeId, { error, isExecuting: false })
      }
    })

    // ── Update WorkflowRun status ──
    if (currentWorkflowId && !workflowRunId.startsWith('local-')) {
      try {
        await fetch(`/api/workflow/${currentWorkflowId}/runs`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ runId: workflowRunId, status: hasError ? 'failed' : 'success' }),
        })
      } catch {}
    }

    setIsRunning(false)
  }

  // ── Run Selected nodes via server-side engine ──
  async function handleRunSelected() {
    const selectedIds = safeNodes.filter(n => n.selected).map(n => n.id)
    if (!selectedIds.length || !currentWorkflowId) return

    // Save first so server has latest data
    await handleSave()

    setIsRunning(true)
    selectedIds.forEach(id => updateNodeData(id, { isExecuting: true, error: undefined }))

    try {
      const res = await fetch(`/api/workflow/${currentWorkflowId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedNodeIds: selectedIds }),
      })
      const data = await res.json()

      if (data.results) {
        Object.entries(data.results).forEach(([nodeId, output]) => {
          setNodeOutput(nodeId, output as any)
          updateNodeData(nodeId, { output: String(output || ''), isExecuting: false })
        })
      }
      if (data.errors) {
        Object.entries(data.errors).forEach(([nodeId, error]) => {
          updateNodeData(nodeId, { error: error as string, isExecuting: false })
        })
      }
    } catch (err: any) {
      selectedIds.forEach(id => updateNodeData(id, { error: err.message, isExecuting: false }))
    }

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

  // Drag and drop media files onto canvas
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!reactFlowInstance) return
    const files = Array.from(e.dataTransfer.files)
    const position = reactFlowInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY })
    
    files.forEach((file, idx) => {
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      if (!isVideo && !isImage) return
      
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setNodes([...safeNodes, {
          id: crypto.randomUUID(),
          type: isVideo ? 'videoUploadNode' : 'imageUploadNode',
          position: { x: position.x + idx * 30, y: position.y + idx * 30 },
          data: { label: file.name, uploadedUrl: dataUrl }
        } as Node])
      }
      reader.readAsDataURL(file)
    })
  }, [reactFlowInstance, safeNodes, setNodes])

  return (
    <ReactFlowProvider>
      <div className={`relative h-full w-full overflow-hidden font-sans ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}`}>



        {/* ── TOP BAR ── */}
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto relative">
            {/* Logo + Name + Dropdown Trigger */}
            <button onClick={() => setShowDropdown(!showDropdown)} className={`flex items-center gap-2 px-3 h-9 rounded-full border cursor-pointer transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] hover:border-white/20' : 'bg-white border-black/[0.08] hover:border-black/20'} shadow-sm`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>N</div>
              {showDropdown ? <ChevronUp className={`w-3 h-3 ${dark ? 'text-[#888]' : 'text-gray-500'}`} /> : <ChevronDown className={`w-3 h-3 ${dark ? 'text-[#555]' : 'text-gray-400'}`} />}
              <span className={`text-[13px] font-medium max-w-[140px] truncate ${dark ? 'text-[#e0e0e0]' : 'text-gray-800'}`}>{workflowName}</span>
            </button>

            {/* ── TOP BAR DROPDOWN MENU ── */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setShowDropdown(false)} />
                <div className={`absolute top-12 left-0 z-[70] w-[260px] rounded-xl border shadow-2xl overflow-hidden ${dark ? 'bg-[#1A1A1A] border-white/[0.08]' : 'bg-white border-black/[0.08]'}`}>
                  {/* Editable Name */}
                  <div className={`px-4 pt-3 pb-2 border-b ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>N</div>
                      <input
                        type="text" value={workflowName}
                        onChange={e => setWorkflowName(e.target.value)}
                        className={`flex-1 bg-transparent text-[14px] font-medium outline-none border rounded-lg px-2 py-1 transition-colors ${dark ? 'text-white border-white/10 focus:border-white/30' : 'text-black border-black/10 focus:border-black/30'}`}
                      />
                    </div>
                  </div>
                  {/* Menu Items */}
                  <div className="py-1.5">
                    <button onClick={() => { setShowDropdown(false); router.push('/dashboard/workflows') }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${dark ? 'text-white hover:bg-white/[0.06]' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => { setShowDropdown(false); handleSave() }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${dark ? 'text-white hover:bg-white/[0.06]' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <Wand2 className="w-4 h-4" /> Turn into App
                    </button>
                    <button onClick={() => { setShowDropdown(false); document.getElementById('import-workflow-input')?.click() }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${dark ? 'text-white hover:bg-white/[0.06]' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <Upload className="w-4 h-4" /> Import
                    </button>
                    <button onClick={() => {
                      setShowDropdown(false)
                      const data = JSON.stringify({ name: workflowName, nodes: safeNodes, edges: safeEdges }, null, 2)
                      const blob = new Blob([data], { type: 'application/json' })
                      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${workflowName || 'workflow'}.json`; a.click()
                    }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${dark ? 'text-white hover:bg-white/[0.06]' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <Download className="w-4 h-4" /> Export
                    </button>
                    <div className={`mx-3 my-1 border-t ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`} />
                    <button className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium transition-colors ${dark ? 'text-white hover:bg-white/[0.06]' : 'text-gray-800 hover:bg-gray-50'}`}>
                      <span className="flex items-center gap-3"><Users className="w-4 h-4" /> Workspaces</span>
                      <ChevronDown className="w-3 h-3 -rotate-90" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Import hidden input */}
            <input id="import-workflow-input" type="file" accept=".json" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]; if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                try {
                  const data = JSON.parse(reader.result as string)
                  if (data.nodes) { setNodes(data.nodes); setShowPresets(false) }
                  if (data.edges) setEdges(data.edges)
                  if (data.name) setWorkflowName(data.name)
                  setTimeout(() => reactFlowInstance?.fitView({ padding: 0.3, duration: 400 }), 200)
                } catch { console.error('Invalid workflow file') }
              }
              reader.readAsText(file)
              e.target.value = ''
            }} />

            {/* Node count badge */}
            {safeNodes.length > 0 && (
              <div className={`h-7 px-2.5 flex items-center gap-1.5 rounded-full text-[11px] font-medium ${dark ? 'bg-white/[0.05] text-gray-500' : 'bg-black/[0.03] text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                {safeNodes.length} node{safeNodes.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Run All */}
            <button onClick={handleRun} disabled={isRunning || safeNodes.length === 0}
              className={`h-9 px-3.5 flex items-center gap-2 rounded-full border text-[12px] font-semibold transition-all disabled:opacity-30 ${
                isRunning ? (dark ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-green-500/10 border-green-500/30 text-green-600')
                  : (dark ? 'bg-[#161616] border-white/[0.08] text-white hover:bg-[#1E1E1E] hover:border-white/20' : 'bg-white border-black/[0.08] text-black hover:bg-gray-50')
              }`}
            >
              {isRunning ? <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> Running...</> : <><Play className="w-3.5 h-3.5" /> Run All</>}
            </button>

            {/* Run Selected */}
            {safeNodes.some(n => n.selected) && currentWorkflowId && (
              <button onClick={handleRunSelected} disabled={isRunning}
                className={`h-9 px-3 flex items-center gap-1.5 rounded-full border text-[12px] font-medium transition-all disabled:opacity-30 ${dark ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20' : 'bg-purple-500/5 border-purple-500/30 text-purple-600 hover:bg-purple-500/10'}`}
              >
                <BoxSelect className="w-3.5 h-3.5" /> Run Selected
              </button>
            )}

            <button onClick={() => setTheme(dark ? 'light' : 'dark')} title={dark ? 'Light mode' : 'Dark mode'} className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-700 hover:bg-gray-100'}`}>
              {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button className={`h-9 px-3 flex items-center gap-1.5 rounded-full border text-[12px] font-medium transition-colors ${dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-500 hover:text-black hover:bg-gray-50'}`}>
              <Share className="w-3.5 h-3.5" /> Share
            </button>

            <button onClick={() => setShowHistory(!showHistory)} className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${showHistory ? (dark ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-600') : (dark ? 'bg-[#161616] border-white/[0.08] text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-700 hover:bg-gray-100')}`} title="Toggle History">
              {showHistory ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>

            <button onClick={handleSave} disabled={safeNodes.length === 0} className={`h-9 px-3 flex items-center gap-1.5 rounded-full border text-[12px] font-medium transition-colors disabled:opacity-40 ${
              saveStatus === 'saved' ? (dark ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-green-500/10 border-green-500/30 text-green-600')
                : (dark ? 'bg-[#161616] border-white/[0.08] text-[#a0a0a0] hover:text-white hover:bg-[#1E1E1E]' : 'bg-white border-black/[0.08] text-gray-500 hover:text-black hover:bg-gray-50')
            }`}>
              <Wand2 className="w-3.5 h-3.5" /> {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Turn workflow into app'}
            </button>

            <div className={`w-9 h-9 rounded-full overflow-hidden border cursor-pointer ${dark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
              {user?.imageUrl ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />}
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEFT: Undo/Redo + Shortcuts (Krea-exact) ── */}
        <div className="absolute bottom-4 left-4 z-40 flex items-center gap-1 pointer-events-auto">
          <div className={`flex items-center rounded-xl border overflow-hidden ${dark ? 'bg-[#1A1A1A] border-white/[0.08]' : 'bg-white border-black/[0.06]'}`}>
            <div className="relative" onMouseEnter={() => setHoveredTool('undo')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={undo} disabled={past.length === 0} className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 ${dark ? 'text-[#a0a0a0] hover:text-white hover:bg-white/[0.06]' : 'text-gray-500 hover:text-black hover:bg-black/[0.03]'}`}>
                <Undo2 className="w-4 h-4" />
              </button>
              {hoveredTool === 'undo' && <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Undo <span className={`ml-1 text-[10px] font-mono rounded px-1 py-0.5 ${dark ? 'bg-white/10' : 'bg-black/5'}`}>⌘Z</span></div>}
            </div>
            <div className="relative" onMouseEnter={() => setHoveredTool('redo')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={redo} disabled={future.length === 0} className={`w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-30 ${dark ? 'text-[#a0a0a0] hover:text-white hover:bg-white/[0.06]' : 'text-gray-500 hover:text-black hover:bg-black/[0.03]'}`}>
                <Redo2 className="w-4 h-4" />
              </button>
              {hoveredTool === 'redo' && <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Redo <span className={`ml-1 text-[10px] font-mono rounded px-1 py-0.5 ${dark ? 'bg-white/10' : 'bg-black/5'}`}>⌘⇧Z</span></div>}
            </div>
          </div>
          <button onClick={() => setShowShortcuts(true)} className={`h-9 px-3 flex items-center gap-1.5 rounded-xl border text-[12px] font-medium transition-colors ${dark ? 'bg-[#1A1A1A] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Keyboard className="w-3.5 h-3.5" /> Keyboard shortcuts
          </button>
        </div>

        {/* ── BOTTOM CENTER: Floating Toolbar (Krea-exact with tooltips) ── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <div className={`flex items-center p-1.5 rounded-2xl border shadow-2xl gap-0.5 ${dark ? 'bg-[#1A1A1A] border-white/[0.08]' : 'bg-white border-black/[0.06]'}`}>
            {/* + New Node */}
            <div className="relative" onMouseEnter={() => setHoveredTool('newnode')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={() => openNodeMenu()} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${dark ? 'bg-[#2A2A2A] hover:bg-[#333] text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                <Plus className="w-5 h-5" />
              </button>
              {hoveredTool === 'newnode' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>New Node <span className={`ml-1 text-[10px] font-mono rounded px-1 py-0.5 ${dark ? 'bg-white/10' : 'bg-black/5'}`}>N</span></div>}
            </div>
            {/* Drag Selection */}
            <div className="relative" onMouseEnter={() => setHoveredTool('select')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={() => setSelectedTool('select')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'select' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
                <MousePointer2 className="w-[18px] h-[18px]" />
              </button>
              {hoveredTool === 'select' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Drag Selection</div>}
            </div>
            {/* Pan */}
            <div className="relative" onMouseEnter={() => setHoveredTool('pan')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={() => setSelectedTool('pan')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'pan' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
                <Hand className="w-[18px] h-[18px]" />
              </button>
              {hoveredTool === 'pan' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Pan</div>}
            </div>
            {/* Cut Connections */}
            <div className="relative" onMouseEnter={() => setHoveredTool('cut')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={() => setSelectedTool('cut')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'cut' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
                <Scissors className="w-[18px] h-[18px]" />
              </button>
              {hoveredTool === 'cut' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Cut Connections</div>}
            </div>
            {/* Group */}
            <div className="relative" onMouseEnter={() => setHoveredTool('group')} onMouseLeave={() => setHoveredTool(null)}>
              <button onClick={() => setSelectedTool('group')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${selectedTool === 'group' ? (dark ? 'bg-white/10 text-white' : 'bg-black/10 text-black') : (dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5')}`}>
                <BoxSelect className="w-[18px] h-[18px]" />
              </button>
              {hoveredTool === 'group' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Group</div>}
            </div>
            {/* Link */}
            <div className="relative" onMouseEnter={() => setHoveredTool('link')} onMouseLeave={() => setHoveredTool(null)}>
              <button className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${dark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-black hover:bg-black/5'}`}>
                <Link2 className="w-[18px] h-[18px]" />
              </button>
              {hoveredTool === 'link' && <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg border ${dark ? 'bg-[#2A2A2A] text-white border-white/10' : 'bg-white text-black border-black/10'}`}>Link</div>}
            </div>
          </div>
        </div>

        {/* ── BOTTOM RIGHT: Minimap Toggle ── */}
        <div className="absolute bottom-4 right-4 z-40 pointer-events-auto">
          <button onClick={() => reactFlowInstance?.fitView({ padding: 0.2, duration: 400 })} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${dark ? 'bg-[#1A1A1A] border-white/[0.08] text-[#a0a0a0] hover:text-white' : 'bg-white border-black/[0.06] text-gray-500 hover:text-black'}`}>
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* ── NODE MENU (Floating searchable) ── */}
        {showNodeMenu && (
          <>
            <div className="absolute inset-0 z-40" onClick={() => setShowNodeMenu(false)} />
            <div className={`absolute z-50 w-[280px] border rounded-xl shadow-2xl overflow-hidden flex flex-col ${dark ? 'bg-[#161616] border-white/[0.08]' : 'bg-white border-black/[0.08]'}`}
              style={{ left: Math.min(Math.max(nodeMenuPos.x - 140, 50), window.innerWidth - 320), top: Math.min(Math.max(nodeMenuPos.y - 200, 60), window.innerHeight - 400) }}
            >
              <div className={`p-3 border-b ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                <div className="flex items-center gap-2">
                  <Search className={`w-4 h-4 ml-1 ${dark ? 'text-[#666]' : 'text-gray-400'}`} />
                  <input autoFocus type="text" value={nodeSearch} onChange={(e) => setNodeSearch(e.target.value)} placeholder="Search nodes..."
                    className={`bg-transparent text-[13px] outline-none w-full ${dark ? 'text-white placeholder:text-[#555]' : 'text-black placeholder:text-gray-400'}`}
                  />
                </div>
              </div>
              <div className="p-1.5 max-h-[380px] overflow-y-auto scrollbar-none">
                {nodeMenuCategories.map(cat => {
                  const items = cat.items.filter(i => i.label.toLowerCase().includes(nodeSearch.toLowerCase()) || (i.desc && i.desc.toLowerCase().includes(nodeSearch.toLowerCase())))
                  if (!items.length) return null
                  return (
                    <div key={cat.label} className="mb-1">
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase px-2.5 py-1.5 ${dark ? 'text-[#555]' : 'text-gray-400'}`}>
                        {cat.icon} {cat.label}
                      </div>
                      {items.map(item => (
                        <button key={item.label}
                          onClick={() => addNode(item.type)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-[13px] rounded-lg transition-colors ${dark ? 'text-[#e0e0e0] hover:bg-[#2A2A2A] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
                        >
                          <div>
                            <div className="font-medium">{item.label}</div>
                            {item.desc && <div className={`text-[10px] mt-0.5 ${dark ? 'text-[#555]' : 'text-gray-400'}`}>{item.desc}</div>}
                          </div>
                          <Plus className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${dark ? 'text-[#555]' : 'text-gray-400'}`} />
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── REACT FLOW CANVAS ── */}
        <div
          ref={reactFlowWrapper}
          className="absolute inset-0 z-0"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDoubleClick={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = reactFlowWrapper.current?.getBoundingClientRect()
            if (rect) { setNodeMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); setShowNodeMenu(true) }
          }}
        >
          <ReactFlow
            nodes={safeNodes} edges={safeEdges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            nodeTypes={nodeTypes as any} onInit={setReactFlowInstance}
            panOnScroll selectionOnDrag={selectedTool === 'select'}
            panOnDrag={selectedTool === 'pan' ? [0, 1, 2] : [1, 2]}
            deleteKeyCode="Backspace" proOptions={{ hideAttribution: true }}
            isValidConnection={isValidConnection as any}
            className={dark ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'}
            onPaneContextMenu={(e) => {
              e.preventDefault()
              const evt = e as React.MouseEvent<Element>
              const rect = reactFlowWrapper.current?.getBoundingClientRect()
              if (rect) { setNodeMenuPos({ x: evt.clientX - rect.left, y: evt.clientY - rect.top }); setShowNodeMenu(true) }
            }}
          >
            <Background variant={BackgroundVariant.Dots} color={dark ? '#222' : '#ccc'} gap={20} size={1} />
            <MiniMap
              nodeColor={(n) => {
                if (n.type === 'llmNode') return '#a855f7'
                if (n.type === 'imageGenNode') return '#3b82f6'
                if (n.type === 'cropImageNode') return '#ec4899'
                if (n.type === 'extractFrameNode') return '#eab308'
                if (n.type === 'imageUploadNode') return '#22c55e'
                if (n.type === 'videoUploadNode') return '#f97316'
                return '#666'
              }}
              maskColor={dark ? 'rgba(0,0,0,0.7)' : 'rgba(200,200,200,0.7)'}
              style={{ background: dark ? '#111' : '#e5e5e5', borderRadius: 12, border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
              pannable zoomable
            />
          </ReactFlow>
        </div>

        {/* ── EMPTY STATE WITH PRESET TEMPLATES (Krea-exact) ── */}
        {safeNodes.length === 0 && !showNodeMenu && !showShortcuts && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
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

        {/* ── HISTORY SIDEBAR ── */}
        {showHistory && (
          <div className="absolute top-0 right-0 bottom-0 z-30 w-[300px] shadow-2xl">
            <HistorySidebar className="h-full" />
          </div>
        )}

        {/* ── MODALS ── */}
        {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
      </div>
    </ReactFlowProvider>
  )
}
