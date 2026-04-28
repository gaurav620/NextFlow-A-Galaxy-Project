import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import crypto from 'crypto'

export const maxDuration = 60

/**
 * POST /api/upload
 *
 * Accepts a multipart form with a `file` field.
 * Uploads it to Transloadit server-side (avoids CORS / client timeout).
 * Falls back to returning base64 data URL if Transloadit is unavailable.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const contentType = req.headers.get('content-type') || ''

    // ── Handle multipart form (actual file upload) ──
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

      const authKey = process.env.TRANSLOADIT_AUTH_KEY
      const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

      if (authKey) {
        /**
         * uploadToTransloadit — Sends file to Transloadit with optional signature.
         * If the secret is stale/wrong, the assembly returns INVALID_SIGNATURE,
         * so we retry without a signature (works when account doesn't enforce it).
         */
        const uploadToTransloadit = async (withSignature: boolean) => {
          const expires = new Date(Date.now() + 3600 * 1000)
            .toISOString()
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '+00:00')

          const params = {
            auth: { key: authKey, expires },
            steps: { ':original': { robot: '/upload/handle' } },
          }

          const paramsStr = JSON.stringify(params)

          const tForm = new FormData()
          tForm.append('params', paramsStr)

          if (withSignature && authSecret) {
            const sig =
              'sha384:' +
              crypto.createHmac('sha384', authSecret).update(paramsStr).digest('hex')
            tForm.append('signature', sig)
          }

          tForm.append('file', file)

          const assemblyRes = await fetch('https://api2.transloadit.com/assemblies', {
            method: 'POST',
            body: tForm,
          })

          const assembly = await assemblyRes.json()

          // Check for signature error — caller will retry without
          if (assembly.error === 'INVALID_SIGNATURE') {
            return { signatureError: true }
          }

          if (!assemblyRes.ok || assembly.error) {
            return { error: assembly.error || assembly.message || 'Assembly creation failed' }
          }

          const pollUrl = assembly.assembly_ssl_url || assembly.assembly_url

          // Poll up to 25 times (50s)
          for (let i = 0; i < 25; i++) {
            await new Promise((r) => setTimeout(r, 2000))
            const statusRes = await fetch(pollUrl)
            const status = await statusRes.json()

            if (status.ok === 'ASSEMBLY_COMPLETED') {
              const result =
                status.results?.[':original']?.[0] ||
                status.results?.exported?.[0] ||
                status.uploads?.[0]
              const url = result?.ssl_url || result?.url
              if (url) return { url }
              break
            }
            if (status.ok === 'REQUEST_ABORTED' || status.error) {
              return { error: status.error || 'Assembly aborted' }
            }
          }
          return { error: 'Assembly timed out' }
        }

        try {
          // Try with signature first
          let result = authSecret ? await uploadToTransloadit(true) : await uploadToTransloadit(false)

          // If signature is invalid/stale, retry without it
          if ('signatureError' in result && result.signatureError) {
            console.warn('Transloadit: signature invalid, retrying without signature')
            result = await uploadToTransloadit(false)
          }

          if ('url' in result && result.url) {
            return NextResponse.json({ success: true, provider: 'transloadit', url: result.url })
          }

          if ('error' in result) {
            console.warn('Transloadit upload failed:', result.error)
          }
        } catch (tErr: any) {
          console.warn('Transloadit server-side upload failed:', tErr.message)
        }
      }

      // Fallback: base64 data URL
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`
      return NextResponse.json({ success: true, provider: 'local', url: dataUrl })
    }

    // ── Handle JSON body (legacy signed-params request) ──
    const body = await req.json().catch(() => ({}))
    const { filename, type } = body

    const authKey = process.env.TRANSLOADIT_AUTH_KEY
    const authSecret = process.env.TRANSLOADIT_AUTH_SECRET

    if (authKey) {
      const expires = new Date(Date.now() + 30 * 60 * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19) + '+00:00'

      const params: any = {
        auth: { key: authKey, expires },
        steps: { ':original': { robot: '/upload/handle' } },
      }

      const paramsJson = JSON.stringify(params)

      const assembly: any = { params: paramsJson }

      // Only include signature if we have a secret
      if (authSecret) {
        const signature = crypto.createHmac('sha384', authSecret).update(paramsJson).digest('hex')
        assembly.signature = `sha384:${signature}`
      }

      return NextResponse.json({
        success: true,
        provider: 'transloadit',
        assembly,
      })
    }

    return NextResponse.json({ error: 'No file provided and no Transloadit keys configured' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
