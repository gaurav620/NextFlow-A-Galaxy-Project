import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const aspectMap: Record<string, string> = {
  '1:1': '1:1',
  '16:9': '16:9',
  '9:16': '9:16',
  '4:3': '4:3',
  '3:2': '4:3',
};

const schema = z.object({
  prompt: z.string().min(1),
  aspectRatio: z.string().default('1:1'),
  count: z.number().min(1).max(8).default(4),
  speed: z.enum(['Turbo', 'Standard', 'Quality']).default('Turbo'),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = schema.parse(await req.json());
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    // Nano uses faster, lower-count batches
    const batchCount = Math.min(body.count, 4);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-fast-generate-002:predict?key=${apiKey}`;

    const payload = {
      instances: [{ prompt: body.prompt }],
      parameters: {
        sampleCount: batchCount,
        aspectRatio: aspectMap[body.aspectRatio] ?? '1:1',
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Fallback to standard Imagen if fast model unavailable
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!fallbackRes.ok) {
        const err = await fallbackRes.text();
        return NextResponse.json({ error: 'Generation failed', detail: err }, { status: fallbackRes.status });
      }
      const fallbackData = await fallbackRes.json();
      const images: string[] = (fallbackData.predictions ?? []).map((p: any) =>
        `data:${p.mimeType ?? 'image/png'};base64,${p.bytesBase64Encoded}`
      );
      return NextResponse.json({ success: true, images });
    }

    const data = await response.json();
    const images: string[] = (data.predictions ?? []).map((p: any) =>
      `data:${p.mimeType ?? 'image/png'};base64,${p.bytesBase64Encoded}`
    );

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Nano generate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
