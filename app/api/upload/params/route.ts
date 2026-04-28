import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

/**
 * GET /api/upload/params
 *
 * Returns Transloadit assembly params (and optional signature) for
 * client-side uploads. Signature is only included when the auth secret
 * is configured and valid.
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    if (!authKey) {
      return NextResponse.json({ error: 'TRANSLOADIT_AUTH_KEY not configured' }, { status: 500 })
    }

    const expires = new Date(Date.now() + 3600 * 1000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\\d+Z$/, '+00:00')

    const params = {
      auth: { key: authKey, expires },
      // No processing steps — just accept the upload
      steps: {},
    }

    const paramsStr = JSON.stringify(params)

    const response: any = { params: paramsStr }

    // Only include signature if secret is available
    if (authSecret) {
      const sig = crypto
        .createHmac('sha384', authSecret)
        .update(Buffer.from(paramsStr, 'utf-8'))
        .digest('hex')
      response.signature = `sha384:${sig}`
    }

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
