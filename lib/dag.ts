/**
 * lib/dag.ts — Topological sort utility for workflow DAG execution.
 * Used by both client-side executor and server-side /api/workflows/[id]/run route.
 */

export interface DAGNode {
  id: string
  type?: string
  data?: Record<string, any>
}

export interface DAGEdge {
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

/**
 * Returns nodes grouped by execution level (BFS topological sort).
 * Level 0 = source nodes (no incoming edges), Level 1 = their dependents, etc.
 * Nodes within the same level can be executed in parallel.
 */
export function topologicalSort<T extends DAGNode>(nodes: T[], edges: DAGEdge[]): T[][] {
  const nodeMap = new Map<string, T>()
  const inDegree = new Map<string, number>()
  const adjList = new Map<string, string[]>()

  nodes.forEach(n => {
    nodeMap.set(n.id, n)
    inDegree.set(n.id, 0)
    adjList.set(n.id, [])
  })

  edges.forEach(e => {
    if (nodeMap.has(e.source) && nodeMap.has(e.target)) {
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1)
      adjList.get(e.source)?.push(e.target)
    }
  })

  const levels: T[][] = []
  let currentIds = [...inDegree.entries()]
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id)

  while (currentIds.length > 0) {
    const currentLevel = currentIds.map(id => nodeMap.get(id)!).filter(Boolean)
    levels.push(currentLevel)

    const nextIds: string[] = []
    currentIds.forEach(nodeId => {
      adjList.get(nodeId)?.forEach(targetId => {
        inDegree.set(targetId, (inDegree.get(targetId) || 0) - 1)
        if (inDegree.get(targetId) === 0) {
          nextIds.push(targetId)
        }
      })
    })
    currentIds = nextIds
  }

  return levels
}

/**
 * Finds the source node connected to a specific target handle.
 */
export function getConnectedSource(nodeId: string, targetHandle: string, edges: DAGEdge[]): string | undefined {
  return edges.find(e => e.target === nodeId && e.targetHandle === targetHandle)?.source
}

/**
 * Finds all source nodes connected to a specific target handle.
 */
export function getConnectedSources(nodeId: string, targetHandle: string, edges: DAGEdge[]): string[] {
  return edges
    .filter(e => e.target === nodeId && e.targetHandle === targetHandle)
    .map(e => e.source)
}

/**
 * Filters nodes/edges to only include the subgraph reachable from selectedNodeIds.
 * Walks backward to include all ancestors.
 */
export function getSubgraph<T extends DAGNode>(
  allNodes: T[],
  allEdges: DAGEdge[],
  selectedNodeIds: string[]
): { nodes: T[]; edges: DAGEdge[] } {
  const needed = new Set<string>(selectedNodeIds)
  let frontier = [...selectedNodeIds]

  while (frontier.length > 0) {
    const next: string[] = []
    frontier.forEach(id => {
      allEdges.forEach(e => {
        if (e.target === id && !needed.has(e.source)) {
          needed.add(e.source)
          next.push(e.source)
        }
      })
    })
    frontier = next
  }

  const nodes = allNodes.filter(n => needed.has(n.id))
  const edges = allEdges.filter(e => needed.has(e.source) && needed.has(e.target))
  return { nodes, edges }
}
