import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { workflowTemplateCatalog } from '@/data/workflowTemplates'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({
      success: true,
      templates: workflowTemplateCatalog,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
