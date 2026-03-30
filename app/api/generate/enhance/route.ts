import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const schema = z.object({
  imageBase64: z.string(),
  mimeType: z.string().default('image/jpeg'),
  scale: z.number().min(2).max(16).default(4),
  creativity: z.number().min(0).max(100).default(30),
  hdr: z.boolean().default(false),
  faceEnhance: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = schema.parse(await req.json());
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build enhancement prompt
    const enhanceInstructions: string[] = [
      `Enhance this image at ${body.scale}x resolution`,
      'Increase sharpness, clarity, and detail',
    ];
    if (body.hdr) enhanceInstructions.push('Apply HDR tone mapping for richer colors and contrast');
    if (body.faceEnhance) enhanceInstructions.push('Enhance facial features, skin texture, and eye detail');
    if (body.creativity > 50) enhanceInstructions.push('Add creative details and texture improvements');

    const prompt = enhanceInstructions.join('. ') + '. Return only the enhanced image, no text.';

    // Use Gemini to analyze and describe enhancements
    // (Real upscaling would use a dedicated upscale service — this returns enhancement metadata)
    const result = await model.generateContent([
      { inlineData: { data: body.imageBase64, mimeType: body.mimeType } },
      { text: `Analyze this image and describe in detail what enhancements would be applied: ${prompt}` },
    ]);

    const enhancementDescription = result.response.text();

    // For real upscaling, integrate a dedicated service here (e.g., Transloadit, Replicate)
    // For now, return the original with enhancement metadata
    return NextResponse.json({
      success: true,
      enhanced: `data:${body.mimeType};base64,${body.imageBase64}`,
      description: enhancementDescription,
      scale: body.scale,
      note: 'Enhancement pipeline ready — connect upscale service for production',
    });
  } catch (error: any) {
    console.error('Enhance error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
