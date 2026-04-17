export type NodeType =
  | 'textNode'
  | 'imageUploadNode'
  | 'videoUploadNode'
  | 'llmNode'
  | 'cropImageNode'
  | 'extractFrameNode'
  | 'imageGenNode'

export interface WorkflowNodeData {
  label?: string
  value?: string
  content?: string
  model?: string
  systemPrompt?: string
  userMessage?: string
  prompt?: string
  aspectRatio?: string
  x?: number
  y?: number
  width?: number
  height?: number
  timestamp?: number
  imageUrl?: string
  videoUrl?: string
  filename?: string
  uploadProvider?: string
  output?: string
  error?: string
  isExecuting?: boolean
  promptConnected?: boolean
  [key: string]: any  // Allow additional dynamic properties
}

export interface WorkflowNode {
  id: string
  type?: string
  position: { x: number; y: number }
  data: WorkflowNodeData
  selected?: boolean
  [key: string]: any
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  animated?: boolean
  style?: object
}

export interface WorkflowData {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error'

export interface NodeRunResult {
  nodeId: string
  status: ExecutionStatus
  output?: any
  error?: string
  startedAt: Date
  endedAt?: Date
}
