import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

/**
 * POST /api/workflow/[id]/runs/node
 *
 * Creates a single NodeRun entry linked to an existing WorkflowRun.
 * Used by the single-node ▶ button execution path to persist
 * node-level history that the DAG engine normally creates in bulk.
 */

const createNodeRunSchema = z.object({
  runId: z.string().min(1),
  nodeId: z.string().min(1),
  nodeType: z.string().min(1),
  status: z.enum(['success', 'failed', 'running']),
  startedAt: z.string(),
  endedAt: z.string().optional(),
  inputs: z.record(z.any()).nullable().optional(),
  outputs: z.record(z.any()).nullable().optional(),
  error: z.string().nullable().optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify the workflow belongs to this user
    const workflow = await prisma.workflow.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!workflow) return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })

    const body = createNodeRunSchema.parse(await req.json())

    // Verify the run belongs to this workflow
    const run = await prisma.workflowRun.findFirst({
      where: { id: body.runId, workflowId: id, userId },
      select: { id: true },
    })
    if (!run) return NextResponse.json({ success: false, error: 'Run not found' }, { status: 404 })

    const nodeRun = await prisma.nodeRun.create({
      data: {
        workflowRunId: body.runId,
        nodeId: body.nodeId,
        nodeType: body.nodeType,
        status: body.status,
        startedAt: new Date(body.startedAt),
        endedAt: body.endedAt ? new Date(body.endedAt) : undefined,
        inputs: body.inputs ?? undefined,
        outputs: body.outputs ?? undefined,
        error: body.error ?? undefined,
      },
    })

    return NextResponse.json({ success: true, nodeRun })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid node run payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
