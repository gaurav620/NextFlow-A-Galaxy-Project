import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const run = await prisma.workflowRun.findFirst({
      where: { id: runId, userId },
      include: {
        nodeRuns: { orderBy: { startedAt: 'asc' } },
        workflow: { select: { id: true, name: true } },
      },
    })

    if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 })

    return NextResponse.json({ success: true, run })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
