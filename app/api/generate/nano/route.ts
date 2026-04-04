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

    // Try Imagen 4 Fast (paid) first
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt: body.prompt }],
      parameters: { sampleCount: batchCount, aspectRatio: aspectMap[body.aspectRatio] ?? '1:1' },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      const images: string[] = (data.predictions ?? []).map((p: any) =>
        `data:${p.mimeType ?? 'image/png'};base64,${p.bytesBase64Encoded}`
      );
      if (images.length > 0) return NextResponse.json({ success: true, images });
    }

    // Free fallback: Pollinations AI (Flux Turbo)
    const dimMap: Record<string, { w: number; h: number }> = {
      '1:1': { w: 512, h: 512 }, '16:9': { w: 768, h: 432 },
      '9:16': { w: 432, h: 768 }, '4:3': { w: 640, h: 480 }, '3:2': { w: 640, h: 427 },
    };
    const { w, h } = dimMap[body.aspectRatio] ?? { w: 512, h: 512 };
    const params = new URLSearchParams({ width: w.toString(), height: h.toString(), nologo: 'true', model: 'turbo', enhance: 'true' });
    const images = Array.from({ length: batchCount }).map(() => {
      const seed = Math.floor(Math.random() * 1000000);
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(body.prompt)}?${params}&seed=${seed}`;
    });

    return NextResponse.json({ success: true, images, fallback: true });
  } catch (error: any) {
    console.error('Nano generate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
