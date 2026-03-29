import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { file, filename, type } = await req.json()
    const mimeType = type === 'image' ? 'image/jpeg' : 'video/mp4'
    const url = file.startsWith('data:') ? file : `data:${mimeType};base64,${file}`
    return NextResponse.json({ success: true, url, filename })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
