import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const expires = new Date(Date.now() + 3600 * 1000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '+00:00')

    const params = {
      auth: {
        key: process.env.TRANSLOADIT_AUTH_KEY!,
        expires,
      },
      // No processing steps — just accept the upload
      steps: {},
    }

    const paramsStr = JSON.stringify(params)
    const sig = crypto
      .createHmac('sha384', process.env.TRANSLOADIT_AUTH_SECRET!)
      .update(Buffer.from(paramsStr, 'utf-8'))
      .digest('hex')

    return NextResponse.json({ params: paramsStr, signature: `sha384:${sig}` })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
