import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const workflowDataSchema = z.object({
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
})

const workflowUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    data: workflowDataSchema.optional(),
    nodes: z.array(z.any()).optional(),
    edges: z.array(z.any()).optional(),
  })
  .superRefine((value, ctx) => {
    const hasAnyField =
      value.name !== undefined ||
      value.data !== undefined ||
      value.nodes !== undefined ||
      value.edges !== undefined

    if (!hasAnyField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one update field is required',
      })
    }

    if (
      (value.nodes !== undefined && value.edges === undefined) ||
      (value.nodes === undefined && value.edges !== undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both nodes and edges must be provided together',
      })
    }
  })

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const workflow = await prisma.workflow.findFirst({
      where: { id, userId },
    })
    if (!workflow) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, workflow })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.workflow.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!existing) return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })

    const body = workflowUpdateSchema.parse(await req.json())

    const nextData =
      body.data !== undefined
        ? body.data
        : body.nodes !== undefined && body.edges !== undefined
          ? { nodes: body.nodes, edges: body.edges }
          : undefined

    const workflow = await prisma.workflow.update({
      where: { id: existing.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(nextData !== undefined ? { data: nextData } : {}),
        updatedAt: new Date(),
      },
    })
    return NextResponse.json({ success: true, workflow })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid update payload', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.workflow.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!existing) return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })

    await prisma.workflow.delete({ where: { id: existing.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
