import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const schema = z.object({
  prompt: z.string().min(1),
  model: z.string().default('kling26'),
  duration: z.string().default('5s'),
  aspectRatio: z.string().default('16:9'),
  motionScore: z.number().min(1).max(5).default(3),
  imageRefBase64: z.string().optional(),
  imageRefMimeType: z.string().optional(),
});

// Sample public-domain video clips for demo
const DEMO_VIDEOS: Record<string, string> = {
  '16:9': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '9:16': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  '1:1': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '4:3': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = schema.parse(await req.json());
    const apiKey = process.env.GEMINI_API_KEY;

    // Use Gemini to build an enhanced video description
    let enhancedPrompt = body.prompt;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const parts: any[] = [];
        if (body.imageRefBase64 && body.imageRefMimeType) {
          parts.push({ inlineData: { data: body.imageRefBase64, mimeType: body.imageRefMimeType } });
        }
        parts.push({
          text: `You are a video generation prompt engineer. Enhance this prompt for a ${body.duration} ${body.aspectRatio} video with motion score ${body.motionScore}/5: "${body.prompt}". Return only the enhanced prompt, no explanation.`,
        });
        const result = await model.generateContent(parts);
        enhancedPrompt = result.response.text().trim();
      } catch {
        // continue with original prompt on error
      }
    }

    // Return demo video — swap this for real Kling/Replicate/Runway API call
    const videoUrl = DEMO_VIDEOS[body.aspectRatio] ?? DEMO_VIDEOS['16:9'];

    return NextResponse.json({
      success: true,
      videoUrl,
      enhancedPrompt,
      model: body.model,
      duration: body.duration,
      aspectRatio: body.aspectRatio,
      note: 'Demo video — connect Kling/Replicate API for production generation',
    });
  } catch (error: any) {
    console.error('Video generate error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
