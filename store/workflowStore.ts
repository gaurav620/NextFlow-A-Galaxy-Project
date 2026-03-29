import { create } from 'zustand'
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from '@/types/workflow'

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  nodeOutputs: Record<string, any>
  executingNodeIds: string[]
  isRunning: boolean
  currentWorkflowId: string | null
  workflowName: string
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  setWorkflowName: (name: string) => void
  setNodeOutput: (nodeId: string, output: any) => void
  addExecutingNode: (nodeId: string) => void
  removeExecutingNode: (nodeId: string) => void
  setIsRunning: (val: boolean) => void
  resetOutputs: () => void
  setCurrentWorkflowId: (id: string | null) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  nodeOutputs: {},
  executingNodeIds: [],
  isRunning: false,
  currentWorkflowId: null,
  workflowName: 'Untitled Workflow',
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setWorkflowName: (workflowName) => set({ workflowName }),
  setNodeOutput: (nodeId, output) =>
    set((state) => ({ nodeOutputs: { ...state.nodeOutputs, [nodeId]: output } })),
  addExecutingNode: (nodeId) =>
    set((state) => ({
      executingNodeIds: [...state.executingNodeIds.filter(id => id !== nodeId), nodeId]
    })),
  removeExecutingNode: (nodeId) =>
    set((state) => ({
      executingNodeIds: state.executingNodeIds.filter(id => id !== nodeId)
    })),
  setIsRunning: (isRunning) => set({ isRunning }),
  resetOutputs: () => set({ nodeOutputs: {}, executingNodeIds: [] }),
  setCurrentWorkflowId: (currentWorkflowId) => set({ currentWorkflowId }),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),
}))
