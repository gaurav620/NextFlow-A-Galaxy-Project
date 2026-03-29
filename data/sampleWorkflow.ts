export const sampleWorkflow = {
  nodes: [
    {
      id: 'text-brand-voice',
      type: 'textNode',
      position: { x: 50, y: 80 },
      data: { label: 'Brand Voice', value: 'You are a creative brand voice expert. Write punchy, modern, compelling copy.' }
    },
    {
      id: 'text-product-desc',
      type: 'textNode',
      position: { x: 50, y: 260 },
      data: { label: 'Product Description', value: 'Product: NextFlow - Visual AI Workflow Builder. Features: Drag-drop nodes, Gemini AI, parallel execution, workflow history.' }
    },
    {
      id: 'llm-branch-a',
      type: 'llmNode',
      position: { x: 400, y: 160 },
      data: { label: 'Generate Copy', model: 'gemini-2.0-flash' }
    },
    {
      id: 'text-audience',
      type: 'textNode',
      position: { x: 50, y: 460 },
      data: { label: 'Target Audience', value: 'Target: SaaS founders and developers aged 25-40 who love productivity and AI tools.' }
    },
    {
      id: 'text-style',
      type: 'textNode',
      position: { x: 50, y: 640 },
      data: { label: 'Style Guide', value: 'Tone: Professional but approachable. Use action verbs. Keep concise and impactful.' }
    },
    {
      id: 'llm-branch-b',
      type: 'llmNode',
      position: { x: 400, y: 540 },
      data: { label: 'Generate Strategy', model: 'gemini-2.0-flash' }
    },
    {
      id: 'text-merge-system',
      type: 'textNode',
      position: { x: 700, y: 300 },
      data: { label: 'Merge System', value: 'Combine the brand copy and audience strategy into a complete product marketing kit. Include: tagline, 3 key benefits, CTA text, elevator pitch.' }
    },
    {
      id: 'llm-merge',
      type: 'llmNode',
      position: { x: 980, y: 380 },
      data: { label: 'Final Kit', model: 'gemini-1.5-pro' }
    },
  ],
  edges: [
    { id: 'e1', source: 'text-brand-voice', target: 'llm-branch-a', targetHandle: 'system_prompt', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e2', source: 'text-product-desc', target: 'llm-branch-a', targetHandle: 'user_message', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e3', source: 'text-style', target: 'llm-branch-b', targetHandle: 'system_prompt', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e4', source: 'text-audience', target: 'llm-branch-b', targetHandle: 'user_message', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e5', source: 'text-merge-system', target: 'llm-merge', targetHandle: 'system_prompt', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e6', source: 'llm-branch-a', target: 'llm-merge', targetHandle: 'user_message', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e7', source: 'llm-branch-b', target: 'llm-merge', targetHandle: 'images', animated: true, style: { stroke: '#8b5cf6' } },
  ]
}
