import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, input, isMeshOnly } = body;

    // Validate the input based on mode
    if (mode === 'text' && !input?.trim()) {
      return NextResponse.json({ error: 'Text prompt is required.' }, { status: 400 });
    }
    if (mode === 'image' && !input) {
      return NextResponse.json({ error: 'Image is required.' }, { status: 400 });
    }

    // Simulate backend processing time for AI generative 3D model
    // Using a shorter time if "Mesh only" is selected, just to simulate typical API variations
    const processingDelay = isMeshOnly ? 2500 : 4500;
    await new Promise((resolve) => setTimeout(resolve, processingDelay));

    // Return a mocked success response representing the generated .glb URL
    return NextResponse.json({
      success: true,
      modelUrl: 'https://cdn.example.com/models/mock_output.glb',
      meshStyle: isMeshOnly ? 'Mesh' : 'Textured',
      format: 'GLB',
      message: '3D Generation complete',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
