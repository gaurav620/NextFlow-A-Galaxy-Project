import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const runs = await prisma.workflowRun.findMany({
      where: { workflowId: params.id, userId },
      include: { nodeRuns: { orderBy: { startedAt: 'asc' } } },
      orderBy: { startedAt: 'desc' },
      take: 20,
    })
    return NextResponse.json({ success: true, runs })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { scope = 'full' } = await req.json()
    const run = await prisma.workflowRun.create({
      data: { workflowId: params.id, userId, status: 'running', scope },
    })
    return NextResponse.json({ success: true, run })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { status } = await req.json()
    const run = await prisma.workflowRun.update({
      where: { id: params.id },
      data: { status, endedAt: new Date() },
    })
    return NextResponse.json({ success: true, run })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
