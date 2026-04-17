import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId },
    })

    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })

    const exportData = {
      name: workflow.name,
      nodes: (workflow.data as any)?.nodes || [],
      edges: (workflow.data as any)?.edges || [],
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${workflow.name || 'workflow'}.json"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
