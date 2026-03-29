'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  ReactFlowInstance,
  Node,
  Edge,
  Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  ChevronLeft,
  Share2,
  Settings,
  Search,
  Workflow,
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

export default function WorkflowEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [searchQuery, setSearchQuery] = useState('')
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
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

      const newNode: Node = {
        id: crypto.randomUUID(),
        data: { label: nodeType },
        position,
        type: nodeType,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        id: `${connection.source}-${connection.target}`,
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
      }, eds))
    },
    [setEdges]
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
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-white text-sm font-medium border-0 outline-none flex-1 max-w-xs"
            placeholder="Untitled Workflow"
          />
        </div>

        {/* Center: Run Controls */}
        <div className="flex items-center gap-2">
          <button className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors">
            Run selected
          </button>
          <button className="bg-white text-black text-xs font-semibold rounded-full px-4 py-1.5 hover:bg-gray-100 transition-colors">
            Run All
          </button>
        </div>

        {/* Right: Save & Settings */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors">
            Save
          </button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Left Mini Panel - Node Picker */}
      <div className="absolute left-3 top-16 z-40 rounded-2xl p-2 w-[180px]" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Search Input */}
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

        {/* Quick Access Label */}
        <div className="text-[10px] text-gray-600 uppercase px-2 py-1 font-medium tracking-wide">
          Quick Access
        </div>

        {/* Node Buttons */}
        <div className="space-y-0.5">
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => handleDragStart(e, node.type)}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-grab active:cursor-grabbing text-xs text-gray-400 hover:text-white transition-all"
            >
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ background: node.color }}
              />
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div ref={reactFlowWrapper} className="h-full w-full pt-12">
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
          <Background
            variant={BackgroundVariant.Dots}
            color="#1a2332"
            gap={24}
            size={1.5}
          />
          <Controls
            className="[&]:!bg-[#1c1c1c] [&]:!border-white/5 [&>button]:!bg-[#1c1c1c] [&>button]:!border-white/5 [&>button]:!text-gray-500 [&>button:hover]:!bg-white/5 [&>button:hover]:!text-white"
            showInteractive={false}
          />
          <MiniMap
            style={{
              background: '#1c1c1c',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            nodeColor="#a855f7"
            maskColor="rgba(0,0,0,0.85)"
            position="bottom-right"
          />
        </ReactFlow>
      </div>

      {/* Empty Canvas State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 pt-12 flex flex-col items-center justify-center pointer-events-none">
          <Workflow className="w-16 h-16 text-gray-800" />
          <p className="text-gray-700 text-sm mt-2">
            Drop nodes here to start building
          </p>
        </div>
      )}
    </div>
  )
}
