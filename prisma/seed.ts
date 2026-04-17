import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seed: "Product Marketing Kit Generator"
 *
 * Demonstrates all 6 node types + parallel execution + convergence.
 *
 * Branch A (Image Processing):
 *   Upload Image → Crop Image → (feeds into LLM #1)
 *   Text #1 (system prompt) → LLM #1
 *   Text #2 (product details) → LLM #1
 *
 * Branch B (Video Processing):
 *   Upload Video → Extract Frame
 *
 * Convergence:
 *   Text #3 (social media prompt) → LLM #2
 *   LLM #1 output → LLM #2 user_message
 *   Crop Image output + Extract Frame output → LLM #2 images
 */
async function main() {
  console.log('🌱 Seeding Product Marketing Kit Generator...')

  const SEED_USER_ID = 'seed_demo_user'

  const sampleWorkflow = {
    nodes: [
      // ── Branch A: Image Processing ──
      {
        id: 'upload-img-1',
        type: 'imageUploadNode',
        position: { x: 50, y: 80 },
        data: { label: 'Product Photo', uploadProvider: 'demo' },
      },
      {
        id: 'crop-img-2',
        type: 'cropImageNode',
        position: { x: 350, y: 60 },
        data: { label: 'Center Crop', x: 10, y: 10, width: 80, height: 80 },
      },
      {
        id: 'text-sys-3',
        type: 'textNode',
        position: { x: 50, y: 300 },
        data: {
          content:
            'You are a professional marketing copywriter. Generate a compelling one-paragraph product description based on the product image and details provided.',
          label: 'System Prompt',
        },
      },
      {
        id: 'text-details-4',
        type: 'textNode',
        position: { x: 50, y: 500 },
        data: {
          content:
            'Product: Wireless Bluetooth Headphones. Features: Active noise cancellation, 30‑hour battery, foldable design, premium memory‑foam ear cushions, Bluetooth 5.3, multipoint connection.',
          label: 'Product Details',
        },
      },
      {
        id: 'llm-copy-5',
        type: 'llmNode',
        position: { x: 500, y: 280 },
        data: {
          model: 'gemini-2.0-flash',
          systemPrompt: '',
          userMessage: '',
          label: 'Marketing Copy Generator',
        },
      },

      // ── Branch B: Video Processing ──
      {
        id: 'upload-vid-6',
        type: 'videoUploadNode',
        position: { x: 50, y: 720 },
        data: { label: 'Product Demo Video', uploadProvider: 'demo' },
      },
      {
        id: 'extract-frame-7',
        type: 'extractFrameNode',
        position: { x: 350, y: 720 },
        data: { label: 'Key Frame', timestamp: 5 },
      },

      // ── Convergence ──
      {
        id: 'text-social-8',
        type: 'textNode',
        position: { x: 500, y: 620 },
        data: {
          content:
            'You are a social media manager. Create a tweet‑length marketing post (max 280 chars) based on the product description and the product image and video frame.',
          label: 'Social Media Prompt',
        },
      },
      {
        id: 'llm-social-9',
        type: 'llmNode',
        position: { x: 850, y: 500 },
        data: {
          model: 'gemini-2.0-flash',
          systemPrompt: '',
          userMessage: '',
          label: 'Social Media Post Generator',
        },
      },
    ],

    edges: [
      // Branch A
      {
        id: 'e1-upload-crop',
        source: 'upload-img-1',
        target: 'crop-img-2',
        sourceHandle: 'output',
        targetHandle: 'image_url',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e2-sys-llm1',
        source: 'text-sys-3',
        target: 'llm-copy-5',
        sourceHandle: 'output',
        targetHandle: 'system_prompt',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e3-details-llm1',
        source: 'text-details-4',
        target: 'llm-copy-5',
        sourceHandle: 'output',
        targetHandle: 'user_message',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e4-crop-llm1-img',
        source: 'crop-img-2',
        target: 'llm-copy-5',
        sourceHandle: 'output',
        targetHandle: 'images',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },

      // Branch B
      {
        id: 'e5-vid-frame',
        source: 'upload-vid-6',
        target: 'extract-frame-7',
        sourceHandle: 'output',
        targetHandle: 'video_url',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },

      // Convergence → LLM #2
      {
        id: 'e6-social-llm2-sys',
        source: 'text-social-8',
        target: 'llm-social-9',
        sourceHandle: 'output',
        targetHandle: 'system_prompt',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e7-llm1-llm2-user',
        source: 'llm-copy-5',
        target: 'llm-social-9',
        sourceHandle: 'output',
        targetHandle: 'user_message',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e8-crop-llm2-img',
        source: 'crop-img-2',
        target: 'llm-social-9',
        sourceHandle: 'output',
        targetHandle: 'images',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
      {
        id: 'e9-frame-llm2-img',
        source: 'extract-frame-7',
        target: 'llm-social-9',
        sourceHandle: 'output',
        targetHandle: 'images',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
      },
    ],
  }

  const existing = await prisma.workflow.findFirst({
    where: { name: 'Product Marketing Kit Generator' },
  })

  if (existing) {
    console.log('  ↳ Workflow already exists, updating...')
    await prisma.workflow.update({
      where: { id: existing.id },
      data: { data: sampleWorkflow },
    })
  } else {
    console.log('  ↳ Creating new workflow...')
    await prisma.workflow.create({
      data: {
        userId: SEED_USER_ID,
        name: 'Product Marketing Kit Generator',
        data: sampleWorkflow,
      },
    })
  }

  console.log('✅ Seed complete! (9 nodes, 9 edges — two parallel branches + convergence)')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
