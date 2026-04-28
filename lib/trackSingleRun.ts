/**
 * trackSingleRun — Creates a WorkflowRun + NodeRun history entry for single-node executions.
 *
 * This bridges the gap between individual node ▶ buttons (which bypass the server-side
 * DAG engine) and the history persistence requirement. The spec mandates that
 * "single/selected/full — each creates a history entry".
 *
 * @param workflowId - The active workflow's database ID
 * @param nodeId     - The ID of the node being executed
 * @param nodeType   - The React Flow node type (e.g. 'llmNode', 'cropImageNode')
 * @param inputs     - Sanitized input payload sent to the execution API
 * @param executeFn  - Async function that performs the actual node execution
 * @returns The result from executeFn (passed through)
 */
export async function trackSingleRun(
  workflowId: string,
  nodeId: string,
  nodeType: string,
  inputs: Record<string, any>,
  executeFn: () => Promise<{ success: boolean; output?: any; error?: string }>
): Promise<{ success: boolean; output?: any; error?: string }> {
  let runId: string | null = null
  const startedAt = new Date().toISOString()

  // 1. Create WorkflowRun with scope='single'
  try {
    const runRes = await fetch(`/api/workflow/${workflowId}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: 'single' }),
    })
    const runData = await runRes.json()
    runId = runData.run?.id || null
  } catch {
    // History creation failed — still execute the node
    console.warn('[trackSingleRun] Failed to create WorkflowRun, continuing without history')
  }

  // 2. Execute the node
  let result: { success: boolean; output?: any; error?: string }
  try {
    result = await executeFn()
  } catch (err: any) {
    result = { success: false, error: err.message || 'Execution failed' }
  }

  // 3. Persist NodeRun + update WorkflowRun status (fire-and-forget)
  if (runId) {
    const endedAt = new Date().toISOString()
    fetch(`/api/workflow/${workflowId}/runs/node`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId,
        nodeId,
        nodeType,
        status: result.success ? 'success' : 'failed',
        startedAt,
        endedAt,
        inputs: sanitizeInputs(inputs),
        outputs: result.output != null ? { result: result.output } : null,
        error: result.error || null,
      }),
    }).catch(() => {})

    fetch(`/api/workflow/${workflowId}/runs`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId,
        status: result.success ? 'success' : 'failed',
      }),
    }).catch(() => {})
  }

  return result
}

/**
 * Strips large binary data (data URLs, blob URLs) from inputs before persisting,
 * keeping the history payload lean. Replaces them with placeholder strings.
 */
function sanitizeInputs(inputs: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {}
  for (const [k, v] of Object.entries(inputs)) {
    const s = String(v ?? '')
    if (s.startsWith('data:') || s.startsWith('blob:')) {
      clean[k] = `[${s.split(';')[0] || 'binary'}]`
    } else if (s.length > 500) {
      clean[k] = s.slice(0, 500) + '…'
    } else {
      clean[k] = v
    }
  }
  return clean
}
