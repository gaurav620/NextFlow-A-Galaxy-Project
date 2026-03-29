export type NodeType =
  | 'textNode'
  | 'imageUploadNode'
  | 'videoUploadNode'
  | 'llmNode'
  | 'cropImageNode'
  | 'extractFrameNode'

export interface WorkflowNodeData {
  label?: string
  value?: string
  model?: string
  systemPrompt?: string
  userMessage?: string
  x?: number
  y?: number
  width?: number
  height?: number
  timestamp?: number
  imageUrl?: string
  videoUrl?: string
  output?: string
  error?: string
  isExecuting?: boolean
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: WorkflowNodeData
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
