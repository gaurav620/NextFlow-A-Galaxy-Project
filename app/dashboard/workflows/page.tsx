'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Play, Users, Link as LinkIcon, Blocks } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch('/api/workflow');
        const data = await res.json();
        if (data.success) {
          setWorkflows(data.workflows);
        }
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflows();
  }, []);

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'apps', label: 'Apps' },
    { id: 'examples', label: 'Examples' },
    { id: 'templates', label: 'Templates' },
  ];

  // Mock data for the other tabs to match Krea's rich ecosystem
  const MOCK_APPS = [
    { id: 1, name: 'B&W Fashion Portrait', desc: 'Convert an ordinary selfie into an extremely fashionable black and white photo.', author: 'Krea Team', emoji: '🖤' },
    { id: 2, name: 'Studio Product Shot', desc: 'Place your product in a professional studio lighting setup.', author: 'Krea Team', emoji: '📸' },
    { id: 3, name: 'Anime Character', desc: 'Turn anyone into a high-quality anime character with dynamic lighting.', author: 'Community', emoji: '✨' },
    { id: 4, name: 'Claymation Style', desc: 'Transform images into a cute, tactile claymation style 3D render.', author: 'Community', emoji: '🌟' }
  ];

  const MOCK_EXAMPLES = [
    { id: 1, title: 'Multi-LoRA Chaining', nodes: '8 Nodes', complexity: 'Advanced' },
    { id: 2, title: 'ControlNet Edge Detection', nodes: '5 Nodes', complexity: 'Intermediate' },
    { id: 3, title: 'Basic Text to Image', nodes: '3 Nodes', complexity: 'Beginner' },
    { id: 4, title: 'Video Interpolation Flow', nodes: '12 Nodes', complexity: 'Advanced' },
    { id: 5, title: 'Face Swap Pipeline', nodes: '6 Nodes', complexity: 'Intermediate' },
    { id: 6, title: 'Background Replacement', nodes: '4 Nodes', complexity: 'Beginner' }
  ];

  const MOCK_TEMPLATES = [
    { id: 1, title: 'Cinematic Movie Poster', uses: '45.2k' },
    { id: 2, title: 'Youtube Thumbnail Gen', uses: '12.8k' },
    { id: 3, title: 'Consistent Character Sheet', uses: '89.1k' },
    { id: 4, title: 'Architecture Pre-viz', uses: '3.4k' }
  ];

  const handleCreateWorkflow = async (name: string = 'Untitled Workflow') => {
    if (isCreating) return;
    setIsCreating(true);

    let initialNodes: any[] = [];
    let initialEdges: any[] = [];

    // Utility to generate compact valid IDs
    const n1 = "node_" + Math.random().toString(36).substring(2, 9);
    const n2 = "node_" + Math.random().toString(36).substring(2, 9);
    const n3 = "node_" + Math.random().toString(36).substring(2, 9);

    if (name === 'Studio Product Shot' || name === 'B&W Fashion Portrait') {
       initialNodes = [
         { id: n1, type: 'imageUploadNode', position: { x: 100, y: 200 }, data: { label: 'Source Image' } },
         { id: n2, type: 'llmNode', position: { x: 450, y: 200 }, data: { label: 'Prompt Generator', systemPrompt: name === 'Studio Product Shot' ? 'Describe a brilliant professional studio lighting setup for the provided object.' : 'Describe a moody, highly fashionable black and white portrait setup.' } },
         { id: n3, type: 'imageGenNode', position: { x: 850, y: 200 }, data: { label: 'Final Output' } }
       ];
       initialEdges = [
         { id: `edge_${n1}_${n2}`, source: n1, target: n2, sourceHandle: 'output', targetHandle: 'images', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
         { id: `edge_${n2}_${n3}`, source: n2, target: n3, sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } }
       ];
    } else if (name === 'Multi-LoRA Chaining' || name === 'Anime Character') {
       initialNodes = [
         { id: n1, type: 'textNode', position: { x: 100, y: 200 }, data: { label: 'Subject Prompt', content: 'A brave adventurer looking into the distance' } },
         { id: n2, type: 'textNode', position: { x: 100, y: 350 }, data: { label: 'Style Prompt', content: '1990s anime style, studio ghibli, high quality' } },
         { id: n3, type: 'llmNode', position: { x: 400, y: 250 }, data: { label: 'Prompt Merger', systemPrompt: 'Combine the subject and style into a single high quality image generation prompt without adding unnecessary words.' } },
         { id: "node_gen", type: 'imageGenNode', position: { x: 750, y: 250 }, data: { label: 'Anime Output' } }
       ];
       initialEdges = [
         { id: `edge_${n1}_${n3}`, source: n1, target: n3, sourceHandle: 'output', targetHandle: 'user_message', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
         { id: `edge_${n2}_${n3}`, source: n2, target: n3, sourceHandle: 'output', targetHandle: 'system_prompt', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
         { id: `edge_${n3}_node_gen`, source: n3, target: "node_gen", sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } }
       ];
    } else if (name === 'Video Interpolation Flow' || name === 'Extract') {
       initialNodes = [
         { id: n1, type: 'videoUploadNode', position: { x: 100, y: 150 }, data: { label: 'Source Video' } },
         { id: n2, type: 'extractFrameNode', position: { x: 450, y: 150 }, data: { label: 'Frame Extractor', timestamp: 0 } },
       ];
       initialEdges = [
         { id: `edge_${n1}_${n2}`, source: n1, target: n2, sourceHandle: 'output', targetHandle: 'video_url', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
       ];
    } else if (name !== 'Untitled Workflow') { // Fallback generic text to image for templates
       initialNodes = [
         { id: n1, type: 'textNode', position: { x: 200, y: 250 }, data: { content: `${name} aesthetic design` } },
         { id: n2, type: 'imageGenNode', position: { x: 600, y: 250 }, data: { label: 'Generation' } }
       ];
       initialEdges = [
         { id: `edge_${n1}_${n2}`, source: n1, target: n2, sourceHandle: 'output', targetHandle: 'prompt', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } }
       ];
    }

    try {
      const res = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          data: { nodes: initialNodes, edges: initialEdges }
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/workflows/${data.workflow.id}`);
      } else {
        alert('Failed to create workflow');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow');
      setIsCreating(false);
    }
  };

  const NodeIcon = ({ className = "" }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" fill="white" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" fill="white" />
      <path d="M7 10v1c0 2.21 1.79 4 4 4h2c2.21 0 4 1.79 4 4v1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-blue-500/30">
      {/* HERO SECTION */}
      <div className="w-full h-[400px] relative overflow-hidden bg-[#161616]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Fake Node Editor Background Collage */}
        <div className="absolute inset-0 right-0 left-[40%] pointer-events-none opacity-80 z-0 hidden md:block">
          {/* Card 1 */}
          <div className="absolute top-10 right-20 w-80 h-96 bg-[#1a1a1a] rounded-xl border border-white/5 shadow-2xl transform rotate-[15deg] p-4 flex flex-col gap-3">
             <div className="w-full h-48 bg-gray-500/20 rounded-lg overflow-hidden flex items-center justify-center grayscale text-4xl">🖤</div>
             <div className="flex gap-2 items-center">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               <div className="w-1/3 h-2 bg-white/20 rounded-full"></div>
             </div>
             <div className="w-full h-1.5 bg-white/10 rounded-full mt-1"></div>
             <div className="w-3/4 h-1.5 bg-white/10 rounded-full"></div>
          </div>
          
          {/* Card 2 */}
          <div className="absolute -top-10 left-20 w-72 h-64 bg-[#1a1a1a] rounded-xl border border-white/5 shadow-2xl transform -rotate-[5deg] p-5 flex flex-col gap-3 z-10">
             <div className="flex gap-2 mb-2 items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-1/4 h-2 bg-white/30 rounded-full"></div>
             </div>
             <div className="text-xs text-white/50 mb-2">
                Your task is to convert the user-provided selfie and turn it into a dramatic and extremely fashionable black and white photo...
             </div>
             <div className="w-full h-1.5 bg-white/20 rounded-full mb-1"></div>
             <div className="w-5/6 h-1.5 bg-white/20 rounded-full mb-1"></div>
             <div className="w-2/3 h-1.5 bg-white/20 rounded-full"></div>
          </div>

           {/* Card 3 (Bottom) */}
           <div className="absolute bottom-[-100px] left-60 w-80 h-72 bg-[#1a1a1a] rounded-xl border border-white/5 shadow-2xl transform rotate-[5deg] p-4 flex flex-col gap-3">
             <div className="w-full h-40 bg-gray-600/20 rounded-lg overflow-hidden flex items-center justify-center grayscale text-4xl">👩</div>
             <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-1/4 h-2 bg-white/20 rounded-full"></div>
                </div>
                <div className="w-1/4 h-2 bg-white/10 rounded-full"></div>
             </div>
             <div className="w-full h-1.5 bg-white/10 rounded-full mt-2"></div>
             <div className="w-4/5 h-1.5 bg-white/10 rounded-full"></div>
          </div>

          {/* SVG Splines connecting cards */}
          <svg className="absolute w-full h-full top-0 left-0 overflow-visible" style={{ zIndex: 5 }}>
            {/* Connection 1 (Yellow to Blue) */}
            <path d="M 120 120 C 200 120, 200 220, 320 220" stroke="#EAB308" strokeWidth="2" fill="none" className="opacity-80" />
            <circle cx="120" cy="120" r="4" fill="#EAB308" />
            <circle cx="320" cy="220" r="4" fill="#EAB308" />
            
            {/* Connection 2 (Blue to Green) */}
            <path d="M 80 180 C 80 280, 180 280, 200 350" stroke="#3b82f6" strokeWidth="2" fill="none" className="opacity-80" />
            <circle cx="80" cy="180" r="4" fill="#3b82f6" />
            <circle cx="200" cy="350" r="4" fill="#3b82f6" />
          </svg>
        </div>

        {/* Gradient Overlay to fade the left side smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-16 pt-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-11 h-11 rounded-[10px] bg-blue-500 text-white flex items-center justify-center">
              <NodeIcon />
            </div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Node Editor</h1>
          </div>

          <p className="text-[15px] text-gray-300 mt-1 max-w-[380px] leading-[1.6]">
            Nodes is the most powerful way to operate NextFlow. Connect every
            tool and model into complex automated pipelines.
          </p>

          <button
            onClick={() => handleCreateWorkflow('Untitled Workflow')}
            disabled={isCreating}
            className="mt-8 bg-white hover:bg-gray-100 text-black font-semibold text-[14px] rounded-full px-5 py-2.5 flex items-center gap-2 w-fit transition-all disabled:opacity-50"
          >
             {isCreating ? 'Creating...' : 'New Workflow'}
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="px-8 md:px-16 py-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 text-[14px] font-medium rounded-[8px] transition-all capitalize tracking-wide ${
              activeTab === tab.id
                ? 'bg-[#222] text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="w-full h-px bg-white/5"></div>

      {/* CONTENT AREA */}
      <div className="min-h-[calc(100vh-500px)]">
        {activeTab === 'projects' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center mt-32">
                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-32 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-6">
                  <NodeIcon className="w-6 h-6" />
                </div>
                <h2 className="text-[17px] font-semibold text-white mb-2">
                  No Workflows Yet
                </h2>
                <div className="text-[14px] text-gray-400 max-w-sm mb-7 leading-relaxed">
                  You haven&apos;t created any workflows yet.<br/>
                  Get started by creating your first one.
                </div>
                <button
                  onClick={() => handleCreateWorkflow('Untitled Workflow')}
                  disabled={isCreating}
                  className="bg-white hover:bg-gray-100 text-black font-medium text-[14px] rounded-full px-6 py-2.5 transition-all disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'New Workflow'}
                </button>
                <button className="mt-8 text-[13px] text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 group font-medium">
                  Learn More <span className="text-[10px] opacity-70 mb-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">↗</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 md:px-16 py-12">
                {workflows.map((workflow) => (
                  <Link key={workflow.id} href={`/dashboard/workflows/${workflow.id}`}>
                    <div className="flex flex-col gap-3 group cursor-pointer">
                      <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5 transition-colors group-hover:border-white/10 group-hover:bg-[#222]">
                        <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                          <NodeIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-medium text-white/90 truncate group-hover:text-white transition-colors">
                          {workflow.name}
                        </h3>
                        <p className="text-[13px] text-gray-500 mt-1">
                          {new Date(workflow.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* APPS TAB */}
        {activeTab === 'apps' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 md:px-16 py-12">
            {MOCK_APPS.map((app) => (
              <div 
                key={app.id} 
                onClick={() => handleCreateWorkflow(app.name)}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded-xl relative flex flex-col p-6 overflow-hidden border border-white/5 transition-colors group-hover:border-white/10 group-hover:bg-[#222]">
                  <div className="text-4xl mb-auto">{app.emoji}</div>
                  <div className="flex items-center gap-2 mt-4 text-xs text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-full border border-green-400/20">
                    <Play className="w-3 h-3 fill-current" /> App
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-white/90 truncate group-hover:text-white transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {app.desc}
                  </p>
                  <p className="text-[12px] text-gray-600 mt-2 font-medium">By {app.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXAMPLES TAB */}
        {activeTab === 'examples' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 md:px-16 py-12">
            {MOCK_EXAMPLES.map((ex) => (
              <div 
                key={ex.id} 
                onClick={() => handleCreateWorkflow(ex.title)}
                className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 transition-colors hover:border-white/10 hover:bg-[#222] cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <Blocks className="w-7 h-7 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">
                    {ex.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[12px] text-gray-500 flex items-center gap-1 border border-white/10 px-2 py-0.5 rounded-md bg-[#111]">
                      <NodeIcon className="w-3 h-3" /> {ex.nodes}
                    </span>
                    <span className="text-[12px] text-gray-500 hover:text-white transition-colors">
                      {ex.complexity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 md:px-16 py-12">
            {MOCK_TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id} 
                onClick={() => handleCreateWorkflow(tmpl.title)}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="w-full aspect-video bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5 transition-colors group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
                  <div className="absolute inset-0 opacity-20">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M 0 50 Q 25 25 50 50 T 100 50" fill="none" stroke="white" strokeWidth="0.5" />
                       <path d="M 0 70 Q 25 45 50 70 T 100 70" fill="none" stroke="white" strokeWidth="0.5" />
                     </svg>
                  </div>
                  <LinkIcon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors z-10" />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors mt-0.5">
                    {tmpl.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[12px] text-gray-500 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap border border-white/5">
                    <Users className="w-3 h-3" />
                    {tmpl.uses}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

