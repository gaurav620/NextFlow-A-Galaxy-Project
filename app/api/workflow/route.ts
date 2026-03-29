import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { name, data, workflowId } = await req.json()
    let workflow
    if (workflowId) {
      workflow = await prisma.workflow.update({
        where: { id: workflowId },
        data: { name, data, updatedAt: new Date() },
      })
    } else {
      workflow = await prisma.workflow.create({
        data: { userId, name, data },
      })
    }
    return NextResponse.json({ success: true, workflow })
  } catch (error: any) {
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
