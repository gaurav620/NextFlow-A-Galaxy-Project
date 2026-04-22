import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const workflowDataSchema = z.object({
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
})

const upsertWorkflowSchema = z.object({
  name: z.string().trim().min(1).max(120).default('Untitled Workflow'),
  data: workflowDataSchema,
  workflowId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, data, workflowId } = upsertWorkflowSchema.parse(await req.json())

    let workflow
    if (workflowId) {
      const existing = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
        select: { id: true },
      })

      if (!existing) {
        return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })
      }

      workflow = await prisma.workflow.update({
        where: { id: existing.id },
        data: { name, data, updatedAt: new Date() },
      })
    } else {
      workflow = await prisma.workflow.create({
        data: { userId, name, data },
      })
    }
    return NextResponse.json({ success: true, workflow })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid workflow payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { runs: true } } },
    })
    return NextResponse.json({ success: true, workflows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
