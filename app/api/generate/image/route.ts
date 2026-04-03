import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const aspectMap: Record<string, string> = {
  '1:1': '1:1',
  '16:9': '16:9',
  '9:16': '9:16',
  '4:3': '4:3',
  '3:4': '3:4',
  '21:9': '16:9',
};

// Pollinations dims
const polliDims: Record<string, { w: number; h: number }> = {
  '1:1': { w: 1024, h: 1024 },
  '16:9': { w: 1024, h: 576 },
  '9:16': { w: 576, h: 1024 },
  '4:3': { w: 1024, h: 768 },
  '3:4': { w: 768, h: 1024 },
  '21:9': { w: 1024, h: 438 },
};

const schema = z.object({
  prompt: z.string().min(1),
  negPrompt: z.string().optional(),
  aspectRatio: z.string().default('1:1'),
  style: z.string().optional(),
  resolution: z.string().optional(),
  count: z.number().min(1).max(4).default(4),
  modelId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = schema.parse(await req.json());
    const apiKey = process.env.GEMINI_API_KEY;

    let fullPrompt = body.style && body.style !== 'None'
      ? `${body.prompt}, ${body.style} style`
      : body.prompt;

    // 1. Attempt Gemini/Imagen 3 if key exists
    if (apiKey) {
      try {
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

        if (response.ok) {
          const data = await response.json();
          const images: string[] = (data.predictions ?? []).map((p: any) =>
            `data:${p.mimeType ?? 'image/png'};base64,${p.bytesBase64Encoded}`
          );
          if (images.length > 0) {
            return NextResponse.json({ success: true, images });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini generation failed, falling back to Pollinations', geminiError);
      }
    }

    // 2. Fast / Free Fallback: Pollinations AI (Flux)
    // We generate multiple unique images by appending a random seed to the URL
    console.log('Using Pollinations fallback for robust generation');
    const { w, h } = polliDims[body.aspectRatio] || { w: 1024, h: 1024 };
    
    // Determine the Pollinations model mapping based on our frontend 'modelId'
    let polliModel = 'flux'; // Default to Flux
    const modelId = (body.modelId || '').toLowerCase();
    if (modelId.includes('imagen3') || modelId.includes('krea1') || modelId.includes('nextflow')) polliModel = 'flux-pro';
    if (modelId.includes('nano')) polliModel = 'turbo';
    if (modelId.includes('recraft')) polliModel = 'flux';

    const resolutionScaleMap: Record<string, number> = {
      '1k': 1,
      '1.2k': 1.2,
      '1.5k': 1.5,
      '4k': 2,
    };
    const scale = resolutionScaleMap[(body.resolution || '').toLowerCase()] ?? 1;
    const scaledWidth = Math.round(w * scale);
    const scaledHeight = Math.round(h * scale);
    
    const encodeParams = new URLSearchParams({
      width: scaledWidth.toString(),
      height: scaledHeight.toString(),
      nologo: 'true',
      model: polliModel,
      enhance: 'true',
    });
    
    const uniqueImages = Array.from({ length: body.count }).map(() => {
      const seed = Math.floor(Math.random() * 1000000);
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${encodeParams.toString()}&seed=${seed}`;
    });

    return NextResponse.json({ success: true, images: uniqueImages, fallback: true });
    
  } catch (error: any) {
    console.error('Generate image error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
