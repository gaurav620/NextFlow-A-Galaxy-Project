import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

/**
 * POST /api/upload — Returns signed Transloadit assembly params.
 * When Transloadit keys are not configured, falls back to accepting
 * the file as base64 and returning it directly (ephemeral).
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { file, filename, type } = body

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    // ═══════════════════════════════════════════════════
    // PRIMARY: Transloadit signed upload
    // ═══════════════════════════════════════════════════
    if (authKey && authSecret) {
      const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19) + '+00:00'
      
      const templateId = type === 'video'
        ? (process.env.TRANSLOADIT_VIDEO_TEMPLATE_ID || '')
        : (process.env.TRANSLOADIT_IMAGE_TEMPLATE_ID || '')

      const params: any = {
        auth: { key: authKey, expires },
        steps: {},
      }

      // If template ID is configured, use it; otherwise accept upload with no processing
      if (templateId) {
        params.template_id = templateId
      } else {
        // No template: just accept the upload and serve via Transloadit CDN (24h temp URL)
        params.steps = {
          ':original': { robot: '/upload/handle' },
        }
      }

      const paramsJson = JSON.stringify(params)
      const signature = crypto.createHmac('sha384', authSecret).update(paramsJson).digest('hex')

      return NextResponse.json({
        success: true,
        provider: 'transloadit',
        assembly: {
          params: paramsJson,
          signature: `sha384:${signature}`,
          tusEndpoint: 'https://api2.transloadit.com/resumable/files/',
        },
      })
    }

    // ═══════════════════════════════════════════════════
    // FALLBACK: Direct base64 (ephemeral, dev-only)
    // ═══════════════════════════════════════════════════
    if (file) {
      const mimeType = type === 'video' ? 'video/mp4' : 'image/jpeg'
      const url = file.startsWith('data:') ? file : `data:${mimeType};base64,${file}`
      return NextResponse.json({ success: true, provider: 'local', url, filename })
    }

    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
