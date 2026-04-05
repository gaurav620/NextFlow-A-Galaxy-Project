import { create } from 'zustand'
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from '@/types/workflow'

interface HistoryEntry {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  nodeOutputs: Record<string, any>
  executingNodeIds: string[]
  isRunning: boolean
  currentWorkflowId: string | null
  workflowName: string
  // Undo/Redo
  past: HistoryEntry[]
  future: HistoryEntry[]
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  setNodesAndEdges: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void
  setWorkflowName: (name: string) => void
  setNodeOutput: (nodeId: string, output: any) => void
  addExecutingNode: (nodeId: string) => void
  removeExecutingNode: (nodeId: string) => void
  setIsRunning: (val: boolean) => void
  resetOutputs: () => void
  setCurrentWorkflowId: (id: string | null) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  undo: () => void
  redo: () => void
  snapshot: () => void
}

const MAX_HISTORY = 50

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  nodeOutputs: {},
  executingNodeIds: [],
  isRunning: false,
  currentWorkflowId: null,
  workflowName: 'Untitled Workflow',
  past: [],
  future: [],

  snapshot: () => {
    const { nodes, edges, past } = get()
    set({
      past: [...past.slice(-MAX_HISTORY + 1), { nodes, edges }],
      future: [],
    })
  },

  setNodes: (nodes) => {
    get().snapshot()
    set({ nodes })
  },
  setEdges: (edges) => {
    get().snapshot()
    set({ edges })
  },
  setNodesAndEdges: (nodes, edges) => {
    get().snapshot()
    set({ nodes, edges })
  },

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
      nodes: Array.isArray(state.nodes) ? state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ) : [],
    })),

  undo: () => {
    const { past, nodes, edges, future } = get()
    if (past.length === 0) return
    const prev = past[past.length - 1]
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future.slice(0, MAX_HISTORY - 1)],
    })
  },

  redo: () => {
    const { future, nodes, edges, past } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past.slice(-MAX_HISTORY + 1), { nodes, edges }],
      future: future.slice(1),
    })
  },
}))
