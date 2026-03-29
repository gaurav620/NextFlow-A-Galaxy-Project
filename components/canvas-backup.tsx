'use client'

import React, { useState, useCallback, useRef } from 'react'
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
  Play,
  Save,
  FolderOpen,
  Zap,
  Undo2,
  Redo2,
  Workflow,
} from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
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

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [isRunning, setIsRunning] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

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
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
      }, eds))
    },
    [setEdges]
  )

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 2000)
  }

  return (
    <div className="relative h-screen w-full" style={{ backgroundColor: '#030712' }}>
      {/* Floating Toolbar - absolute positioned above canvas */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl">
        {/* Workflow Name Input */}
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="bg-transparent text-foreground text-sm font-medium border-0 outline-none min-w-[160px]"
          placeholder="Untitled Workflow"
        />

        {/* Divider */}
        <div className="w-px h-5 bg-gray-700" />

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-700 text-white rounded-xl px-4 py-1.5 text-sm flex items-center gap-2 transition-colors"
        >
          {isRunning ? (
            <>
              <Spinner className="w-4 h-4" />
              Running
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run
            </>
          )}
        </button>

        {/* Save Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-1.5 text-sm flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" />
          Save
        </button>

        {/* Load Button */}
        <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl px-3 py-1.5 text-sm transition-colors">
          <FolderOpen className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-700" />

        {/* Sample Button */}
        <button className="text-purple-400 hover:text-purple-300 text-sm px-2 flex items-center gap-2 transition-colors">
          <Zap className="w-4 h-4" />
          Sample
        </button>

        {/* Undo/Redo */}
        <Undo2 className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
        <Redo2 className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* React Flow Canvas */}
      <div ref={reactFlowWrapper} className="h-full w-full">
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
          style={{ backgroundColor: '#030712' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="#1a2332"
            gap={24}
            size={1.5}
          />
          <Controls
            className="!bg-gray-900 !border-gray-700 [&>button]:!bg-gray-900 [&>button]:!border-gray-700 [&>button]:!text-gray-400 [&>button:hover]:!bg-gray-800"
            showInteractive={false}
          />
          <MiniMap
            style={{
              background: '#0a0f18',
              border: '1px solid #1f2937',
            }}
            nodeColor="#6d28d9"
            maskColor="rgb(0,0,0,0.8)"
            position="bottom-right"
          />
        </ReactFlow>
      </div>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Workflow className="w-16 h-16 text-gray-800" />
          <p className="text-gray-700 text-sm mt-3">
            Drag nodes from the sidebar to get started
          </p>
        </div>
      )}
    </div>
  )
}
