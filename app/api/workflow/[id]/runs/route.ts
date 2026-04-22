import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const createRunSchema = z.object({
  scope: z.enum(['full', 'partial', 'single']).default('full'),
})

const updateRunSchema = z.object({
  runId: z.string().min(1),
  status: z.enum(['running', 'success', 'failed', 'partial']),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!workflow) return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })

    const runs = await prisma.workflowRun.findMany({
      where: { workflowId: id, userId },
      include: { nodeRuns: { orderBy: { startedAt: 'asc' } } },
      orderBy: { startedAt: 'desc' },
      take: 20,
    })
    return NextResponse.json({ success: true, runs })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!workflow) return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })

    const { scope } = createRunSchema.parse(await req.json())

    const run = await prisma.workflowRun.create({
      data: { workflowId: id, userId, status: 'running', scope },
    })
    return NextResponse.json({ success: true, run })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid run payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { runId, status } = updateRunSchema.parse(await req.json())

    const updateResult = await prisma.workflowRun.updateMany({
      where: { id: runId, workflowId: id, userId },
      data: { status, endedAt: new Date() },
    })

    if (updateResult.count === 0) {
      return NextResponse.json({ success: false, error: 'Run not found' }, { status: 404 })
    }

    const run = await prisma.workflowRun.findUnique({ where: { id: runId } })
    return NextResponse.json({ success: true, run })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid run update payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
