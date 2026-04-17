import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const importSchema = z.object({
  name: z.string().default('Imported Workflow'),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = importSchema.parse(await req.json())

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name: body.name,
        data: { nodes: body.nodes, edges: body.edges },
      },
    })

    return NextResponse.json({ success: true, workflow })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
