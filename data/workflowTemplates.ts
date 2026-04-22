import type { WorkflowTemplateCatalog } from '@/types/workflow'

const edgeStyle = { stroke: '#a855f7', strokeWidth: 2 }
const altEdgeStyle = { stroke: '#0ea5e9', strokeWidth: 2 }

export const workflowTemplateCatalog: WorkflowTemplateCatalog = {
  apps: [
    {
      id: 'app-bw-fashion-portrait',
      name: 'B&W Fashion Portrait',
      description: 'Convert an ordinary selfie into an extremely fashionable black and white photo.',
      author: 'NextFlow Team',
      emoji: '🖤',
      workflow: {
        nodes: [
          { id: 'bw-image', type: 'imageUploadNode', position: { x: 90, y: 190 }, data: { label: 'Source Image' } },
          {
            id: 'bw-llm',
            type: 'llmNode',
            position: { x: 430, y: 190 },
            data: {
              label: 'Prompt Generator',
              systemPrompt:
                'Describe a moody, highly fashionable black and white portrait setup with cinematic lighting and rich contrast.',
            },
          },
          { id: 'bw-gen', type: 'imageGenNode', position: { x: 790, y: 190 }, data: { label: 'Final Output' } },
        ],
        edges: [
          {
            id: 'bw-edge-1',
            source: 'bw-image',
            target: 'bw-llm',
            sourceHandle: 'image_url',
            targetHandle: 'images',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'bw-edge-2',
            source: 'bw-llm',
            target: 'bw-gen',
            sourceHandle: 'output',
            targetHandle: 'prompt',
            animated: true,
            style: altEdgeStyle,
          },
        ],
      },
    },
    {
      id: 'app-studio-product-shot',
      name: 'Studio Product Shot',
      description: 'Place your product in a professional studio lighting setup.',
      author: 'NextFlow Team',
      emoji: '📸',
      workflow: {
        nodes: [
          { id: 'studio-image', type: 'imageUploadNode', position: { x: 90, y: 190 }, data: { label: 'Source Product' } },
          {
            id: 'studio-llm',
            type: 'llmNode',
            position: { x: 430, y: 190 },
            data: {
              label: 'Prompt Generator',
              systemPrompt:
                'Create a premium studio product-shot prompt with controlled highlights, soft key light, and detailed material realism.',
            },
          },
          { id: 'studio-gen', type: 'imageGenNode', position: { x: 790, y: 190 }, data: { label: 'Final Output' } },
        ],
        edges: [
          {
            id: 'studio-edge-1',
            source: 'studio-image',
            target: 'studio-llm',
            sourceHandle: 'image_url',
            targetHandle: 'images',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'studio-edge-2',
            source: 'studio-llm',
            target: 'studio-gen',
            sourceHandle: 'output',
            targetHandle: 'prompt',
            animated: true,
            style: altEdgeStyle,
          },
        ],
      },
    },
    {
      id: 'app-anime-character',
      name: 'Anime Character',
      description: 'Turn anyone into a high-quality anime character with dynamic lighting.',
      author: 'Community',
      emoji: '✨',
      workflow: {
        nodes: [
          {
            id: 'anime-subject',
            type: 'textNode',
            position: { x: 80, y: 140 },
            data: { label: 'Subject Prompt', content: 'A brave adventurer looking into the distance' },
          },
          {
            id: 'anime-style',
            type: 'textNode',
            position: { x: 80, y: 300 },
            data: { label: 'Style Prompt', content: '1990s anime style, hand-painted shading, dramatic rim light' },
          },
          {
            id: 'anime-merge',
            type: 'llmNode',
            position: { x: 420, y: 210 },
            data: {
              label: 'Prompt Merger',
              systemPrompt: 'Merge subject and style into one concise image prompt. Keep visual details, avoid filler.',
            },
          },
          { id: 'anime-gen', type: 'imageGenNode', position: { x: 780, y: 210 }, data: { label: 'Anime Output' } },
        ],
        edges: [
          {
            id: 'anime-edge-1',
            source: 'anime-subject',
            target: 'anime-merge',
            sourceHandle: 'output',
            targetHandle: 'user_message',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'anime-edge-2',
            source: 'anime-style',
            target: 'anime-merge',
            sourceHandle: 'output',
            targetHandle: 'system_prompt',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'anime-edge-3',
            source: 'anime-merge',
            target: 'anime-gen',
            sourceHandle: 'output',
            targetHandle: 'prompt',
            animated: true,
            style: altEdgeStyle,
          },
        ],
      },
    },
    {
      id: 'app-claymation-style',
      name: 'Claymation Style',
      description: 'Transform images into a cute, tactile claymation style 3D render.',
      author: 'Community',
      emoji: '🌟',
      workflow: {
        nodes: [
          { id: 'clay-image', type: 'imageUploadNode', position: { x: 90, y: 190 }, data: { label: 'Source Image' } },
          {
            id: 'clay-instruction',
            type: 'textNode',
            position: { x: 90, y: 350 },
            data: {
              label: 'Style Instruction',
              content: 'Convert this subject into soft handmade clay with tiny imperfections and warm studio lighting.',
            },
          },
          {
            id: 'clay-llm',
            type: 'llmNode',
            position: { x: 430, y: 250 },
            data: { label: 'Prompt Builder', systemPrompt: 'Generate one polished claymation image prompt for a text-to-image model.' },
          },
          { id: 'clay-gen', type: 'imageGenNode', position: { x: 790, y: 250 }, data: { label: 'Clay Output' } },
        ],
        edges: [
          {
            id: 'clay-edge-1',
            source: 'clay-image',
            target: 'clay-llm',
            sourceHandle: 'image_url',
            targetHandle: 'images',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'clay-edge-2',
            source: 'clay-instruction',
            target: 'clay-llm',
            sourceHandle: 'output',
            targetHandle: 'user_message',
            animated: true,
            style: edgeStyle,
          },
          {
            id: 'clay-edge-3',
            source: 'clay-llm',
            target: 'clay-gen',
            sourceHandle: 'output',
            targetHandle: 'prompt',
            animated: true,
            style: altEdgeStyle,
          },
        ],
      },
    },
  ],

  examples: [
    {
      id: 'ex-multi-lora-chaining',
      name: 'Multi-LoRA Chaining',
      description: 'Chain style and subject signals through an LLM merge before image generation.',
      nodeCount: 4,
      complexity: 'Advanced',
      workflow: {
        nodes: [
          { id: 'ex1-subject', type: 'textNode', position: { x: 80, y: 130 }, data: { content: 'Futuristic athlete portrait' } },
          { id: 'ex1-style', type: 'textNode', position: { x: 80, y: 280 }, data: { content: 'Neon cyberpunk editorial style' } },
          {
            id: 'ex1-merge',
            type: 'llmNode',
            position: { x: 430, y: 200 },
            data: { systemPrompt: 'Merge style + subject into one cinematic generation prompt.' },
          },
          { id: 'ex1-gen', type: 'imageGenNode', position: { x: 790, y: 200 }, data: {} },
        ],
        edges: [
          { id: 'ex1-e1', source: 'ex1-subject', target: 'ex1-merge', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 'ex1-e2', source: 'ex1-style', target: 'ex1-merge', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: edgeStyle },
          { id: 'ex1-e3', source: 'ex1-merge', target: 'ex1-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'ex-controlnet-edge-detection',
      name: 'ControlNet Edge Detection',
      description: 'Use image structure guidance and a control-focused prompt synthesis step.',
      nodeCount: 4,
      complexity: 'Intermediate',
      workflow: {
        nodes: [
          { id: 'ex2-img', type: 'imageUploadNode', position: { x: 90, y: 170 }, data: { label: 'Reference Image' } },
          { id: 'ex2-txt', type: 'textNode', position: { x: 90, y: 330 }, data: { content: 'Preserve shape and silhouette, stylize textures only.' } },
          { id: 'ex2-llm', type: 'llmNode', position: { x: 430, y: 250 }, data: { systemPrompt: 'Produce a control-aware generation prompt.' } },
          { id: 'ex2-gen', type: 'imageGenNode', position: { x: 790, y: 250 }, data: {} },
        ],
        edges: [
          { id: 'ex2-e1', source: 'ex2-img', target: 'ex2-llm', sourceHandle: 'image_url', targetHandle: 'images', animated: true, style: edgeStyle },
          { id: 'ex2-e2', source: 'ex2-txt', target: 'ex2-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 'ex2-e3', source: 'ex2-llm', target: 'ex2-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'ex-basic-text-to-image',
      name: 'Basic Text to Image',
      description: 'A minimal starting flow with one prompt node and one generator node.',
      nodeCount: 2,
      complexity: 'Beginner',
      workflow: {
        nodes: [
          { id: 'ex3-text', type: 'textNode', position: { x: 180, y: 240 }, data: { content: 'A cinematic shot of a neon city in the rain' } },
          { id: 'ex3-gen', type: 'imageGenNode', position: { x: 590, y: 220 }, data: {} },
        ],
        edges: [
          { id: 'ex3-e1', source: 'ex3-text', target: 'ex3-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'ex-video-interpolation-flow',
      name: 'Video Interpolation Flow',
      description: 'Extract key frames from source footage and branch for post-processing.',
      nodeCount: 3,
      complexity: 'Advanced',
      workflow: {
        nodes: [
          { id: 'ex4-vid', type: 'videoUploadNode', position: { x: 90, y: 190 }, data: { label: 'Source Video' } },
          { id: 'ex4-frame', type: 'extractFrameNode', position: { x: 430, y: 190 }, data: { timestamp: 3.5 } },
          { id: 'ex4-gen', type: 'imageGenNode', position: { x: 790, y: 190 }, data: { prompt: 'Use extracted frame as style reference for enhancement.' } },
        ],
        edges: [
          { id: 'ex4-e1', source: 'ex4-vid', target: 'ex4-frame', sourceHandle: 'video_url', targetHandle: 'video_url', animated: true, style: edgeStyle },
          { id: 'ex4-e2', source: 'ex4-frame', target: 'ex4-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'ex-face-swap-pipeline',
      name: 'Face Swap Pipeline',
      description: 'Compose identity and target context prompts before final generation.',
      nodeCount: 5,
      complexity: 'Intermediate',
      workflow: {
        nodes: [
          { id: 'ex5-src', type: 'imageUploadNode', position: { x: 60, y: 110 }, data: { label: 'Source Face' } },
          { id: 'ex5-tgt', type: 'imageUploadNode', position: { x: 60, y: 300 }, data: { label: 'Target Scene' } },
          { id: 'ex5-text', type: 'textNode', position: { x: 60, y: 470 }, data: { content: 'Keep lighting and camera perspective from target scene.' } },
          { id: 'ex5-llm', type: 'llmNode', position: { x: 420, y: 260 }, data: { systemPrompt: 'Create a face-swap-safe generation prompt with identity preservation.' } },
          { id: 'ex5-gen', type: 'imageGenNode', position: { x: 780, y: 260 }, data: {} },
        ],
        edges: [
          { id: 'ex5-e1', source: 'ex5-src', target: 'ex5-llm', sourceHandle: 'image_url', targetHandle: 'images', animated: true, style: edgeStyle },
          { id: 'ex5-e2', source: 'ex5-tgt', target: 'ex5-llm', sourceHandle: 'image_url', targetHandle: 'images', animated: true, style: edgeStyle },
          { id: 'ex5-e3', source: 'ex5-text', target: 'ex5-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 'ex5-e4', source: 'ex5-llm', target: 'ex5-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'ex-background-replacement',
      name: 'Background Replacement',
      description: 'Rewrite environment context while preserving the subject.',
      nodeCount: 4,
      complexity: 'Beginner',
      workflow: {
        nodes: [
          { id: 'ex6-img', type: 'imageUploadNode', position: { x: 90, y: 180 }, data: { label: 'Subject Image' } },
          { id: 'ex6-txt', type: 'textNode', position: { x: 90, y: 360 }, data: { content: 'Replace background with a futuristic city at night.' } },
          { id: 'ex6-llm', type: 'llmNode', position: { x: 430, y: 260 }, data: { systemPrompt: 'Generate one concise background replacement prompt.' } },
          { id: 'ex6-gen', type: 'imageGenNode', position: { x: 790, y: 260 }, data: {} },
        ],
        edges: [
          { id: 'ex6-e1', source: 'ex6-img', target: 'ex6-llm', sourceHandle: 'image_url', targetHandle: 'images', animated: true, style: edgeStyle },
          { id: 'ex6-e2', source: 'ex6-txt', target: 'ex6-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 'ex6-e3', source: 'ex6-llm', target: 'ex6-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
  ],

  templates: [
    {
      id: 'tmpl-cinematic-movie-poster',
      name: 'Cinematic Movie Poster',
      description: 'Generate dramatic key art with character, setting, and typography direction.',
      uses: '45.2k',
      workflow: {
        nodes: [
          { id: 't1-concept', type: 'textNode', position: { x: 80, y: 180 }, data: { content: 'A lone pilot standing before a burning city skyline' } },
          { id: 't1-style', type: 'textNode', position: { x: 80, y: 340 }, data: { content: 'Epic cinematic poster, rich contrast, volumetric lighting' } },
          { id: 't1-llm', type: 'llmNode', position: { x: 430, y: 260 }, data: { systemPrompt: 'Create one polished movie poster generation prompt.' } },
          { id: 't1-gen', type: 'imageGenNode', position: { x: 790, y: 260 }, data: {} },
        ],
        edges: [
          { id: 't1-e1', source: 't1-concept', target: 't1-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 't1-e2', source: 't1-style', target: 't1-llm', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: edgeStyle },
          { id: 't1-e3', source: 't1-llm', target: 't1-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'tmpl-youtube-thumbnail-gen',
      name: 'Youtube Thumbnail Gen',
      description: 'Compose high-contrast thumbnail prompts optimized for mobile readability.',
      uses: '12.8k',
      workflow: {
        nodes: [
          { id: 't2-topic', type: 'textNode', position: { x: 100, y: 200 }, data: { content: 'How I built an AI app in 7 days' } },
          { id: 't2-style', type: 'textNode', position: { x: 100, y: 360 }, data: { content: 'Bold thumbnail composition, punchy colors, expressive face' } },
          { id: 't2-llm', type: 'llmNode', position: { x: 440, y: 280 }, data: { systemPrompt: 'Create a short thumbnail-focused image prompt.' } },
          { id: 't2-gen', type: 'imageGenNode', position: { x: 800, y: 280 }, data: { aspectRatio: '16:9' } },
        ],
        edges: [
          { id: 't2-e1', source: 't2-topic', target: 't2-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 't2-e2', source: 't2-style', target: 't2-llm', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: edgeStyle },
          { id: 't2-e3', source: 't2-llm', target: 't2-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'tmpl-consistent-character-sheet',
      name: 'Consistent Character Sheet',
      description: 'Generate consistent character variations for design and storytelling.',
      uses: '89.1k',
      workflow: {
        nodes: [
          { id: 't3-char', type: 'textNode', position: { x: 80, y: 150 }, data: { content: 'Young cyberpunk detective with silver jacket and amber visor' } },
          { id: 't3-style', type: 'textNode', position: { x: 80, y: 310 }, data: { content: 'Character turnaround sheet, front side back, clean background' } },
          { id: 't3-llm', type: 'llmNode', position: { x: 430, y: 230 }, data: { systemPrompt: 'Compose a consistency-focused character sheet prompt.' } },
          { id: 't3-gen', type: 'imageGenNode', position: { x: 790, y: 230 }, data: { aspectRatio: '3:4' } },
        ],
        edges: [
          { id: 't3-e1', source: 't3-char', target: 't3-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 't3-e2', source: 't3-style', target: 't3-llm', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: edgeStyle },
          { id: 't3-e3', source: 't3-llm', target: 't3-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
    {
      id: 'tmpl-architecture-pre-viz',
      name: 'Architecture Pre-viz',
      description: 'Draft architectural mood and composition from short textual briefs.',
      uses: '3.4k',
      workflow: {
        nodes: [
          { id: 't4-brief', type: 'textNode', position: { x: 90, y: 190 }, data: { content: 'Minimalist concrete villa on a coastal cliff at sunset' } },
          { id: 't4-constraints', type: 'textNode', position: { x: 90, y: 360 }, data: { content: 'Wide angle, realistic materials, cinematic sky, high detail' } },
          { id: 't4-llm', type: 'llmNode', position: { x: 430, y: 270 }, data: { systemPrompt: 'Build an architecture pre-viz prompt with camera and material details.' } },
          { id: 't4-gen', type: 'imageGenNode', position: { x: 790, y: 270 }, data: { aspectRatio: '16:9' } },
        ],
        edges: [
          { id: 't4-e1', source: 't4-brief', target: 't4-llm', sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: edgeStyle },
          { id: 't4-e2', source: 't4-constraints', target: 't4-llm', sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: edgeStyle },
          { id: 't4-e3', source: 't4-llm', target: 't4-gen', sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: altEdgeStyle },
        ],
      },
    },
  ],
}
