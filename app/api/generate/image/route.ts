import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const aspectMap: Record<string, string> = {
  '1:1': '1:1',
  '16:9': '16:9',
  '9:16': '9:16',
  '4:3': '4:3',
  '3:4': '3:4',
  '21:9': '16:9', // fallback
};

const schema = z.object({
  prompt: z.string().min(1),
  negPrompt: z.string().optional(),
  aspectRatio: z.string().default('1:1'),
  style: z.string().optional(),
  count: z.number().min(1).max(4).default(4),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = schema.parse(await req.json());
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const fullPrompt = body.style && body.style !== 'None'
      ? `${body.prompt}, ${body.style} style`
      : body.prompt;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const payload: any = {
      instances: [{ prompt: fullPrompt }],
      parameters: {
        sampleCount: body.count,
        aspectRatio: aspectMap[body.aspectRatio] ?? '1:1',
      },
    };
    if (body.negPrompt?.trim()) {
      payload.parameters.negativePrompt = body.negPrompt.trim();
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Imagen API error:', err);
      return NextResponse.json({ error: 'Image generation failed', detail: err }, { status: response.status });
    }

    const data = await response.json();
    const images: string[] = (data.predictions ?? []).map((p: any) =>
      `data:${p.mimeType ?? 'image/png'};base64,${p.bytesBase64Encoded}`
    );

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error('Generate image error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
