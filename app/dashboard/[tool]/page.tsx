'use client';

import { useParams } from 'next/navigation';
import { 
  Sparkles, 
  Image as ImageIcon,
  Video,
  Wand2,
  Zap,
  Box,
  RotateCw,
  Camera,
  Play,
  Settings,
  Download,
  Share,
  ChevronDown,
  Link as LinkIcon,
  Focus,
  Square,
  Diamond,
  Plus
} from 'lucide-react';
import { useState } from 'react';

const toolConfig: Record<string, { label: string, icon: any, color: string, description: string }> = {
  'image': { label: 'Image', icon: ImageIcon, color: 'text-blue-400', description: 'Generate high quality images from text prompts.' },
  'video': { label: 'Video', icon: Video, color: 'text-orange-400', description: 'Create stunning AI videos with motion.' },
  'enhancer': { label: 'Enhancer', icon: Sparkles, color: 'text-zinc-400', description: 'Magically upscale and add incredible details.' },
  'nano': { label: 'Nano Banana', icon: Zap, color: 'text-yellow-400', description: 'Lightning fast generations with prompt adherence.' },
  'realtime': { label: 'Realtime', icon: Play, color: 'text-purple-400', description: 'Draw and see AI generate in real-time.' },
  'edit': { label: 'Edit', icon: Wand2, color: 'text-purple-400', description: 'Select regions and modify specific parts of images.' },
  'lipsync': { label: 'Video Lipsync', icon: Camera, color: 'text-cyan-400', description: 'Animate faces to match any audio.' },
  'motion': { label: 'Motion Transfer', icon: RotateCw, color: 'text-emerald-400', description: 'Transfer dances and movements across videos.' },
  '3d': { label: '3D Objects', icon: Box, color: 'text-zinc-400', description: 'Turn text or 2D images into 3D meshes.' },
};

const emptyStateCards = [
  { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80", title: "Different Piece...", rotation: "-rotate-12", translation: "-translate-x-32 translate-y-4", zIndex: "z-10" },
  { img: "https://images.unsplash.com/photo-1559235038-1b0faffaf99e?w=500&q=80", title: "A Close-Up Por...", rotation: "-rotate-6", translation: "-translate-x-12 translate-y-8", zIndex: "z-20", color: "bg-pink-500" },
  { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80", title: "A Young Woma...", rotation: "rotate-3", translation: "translate-x-16 hover:-translate-y-2", zIndex: "z-30" },
  { img: "https://images.unsplash.com/photo-1503376713291-19741e15b533?w=500&q=80", title: "Dark Underexp...", rotation: "rotate-12", translation: "translate-x-44 translate-y-6", zIndex: "z-20" },
];

export default function GenericToolPage() {
  const params = useParams();
  const toolId = params.tool as string;
  const config = toolConfig[toolId] || { 
    label: toolId ? toolId.charAt(0).toUpperCase() + toolId.slice(1) : 'Tool', 
    icon: Wand2, 
    color: 'text-white',
    description: 'Explore the limits of NextFlow AI.',
  };

  const Icon = config.icon;
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResultUrl(null);
    
    // Easter egg intercept
    if (prompt.toLowerCase().includes('hanuman') || prompt.toLowerCase().includes('hnuman')) {
      setTimeout(() => { setResultUrl('/hanuman.png'); }, 1500);
      return;
    }
    
    // Connect to Pollinations.ai API
    if (['image', 'nano', 'enhancer', 'edit', '3d'].includes(toolId)) {
      const seed = Math.floor(Math.random() * 100000);
      setResultUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`);
    } else {
      setResultUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' cinematic video still frame')}?width=1024&height=576&nologo=true`);
    }
  };

  return (
    <div className="flex w-full h-full text-white font-sans overflow-hidden bg-[#0a0a0a] relative">
      
      {/* Top Header Controls */}
      {resultUrl && !isGenerating && (
        <div className="absolute top-4 right-6 flex items-center gap-2 z-50">
          <button className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md">
            <Share className="w-4 h-4" />
          </button>
          <button className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Full-Screen Canvas Area */}
      <div className="flex-1 flex flex-col relative w-full h-full items-center justify-center p-6 md:p-12 pb-32">
        
        {/* State 1: Generating Spinner */}
        {isGenerating && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a]/60 backdrop-blur-lg transition-all duration-500">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl relative z-10">
                <Icon className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            <p className="text-zinc-300 text-[15px] font-medium tracking-wide animate-pulse">Designing your vision...</p>
          </div>
        )}

        {/* State 2: Result Image View */}
        {resultUrl && (
          <div className="w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center relative z-20">
            <img 
              src={resultUrl} 
              alt="Generated Result" 
              className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-700 ${isGenerating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              referrerPolicy="no-referrer"
              onLoad={() => setIsGenerating(false)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('pollinations')) {
                  const truncated = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
                  target.src = `https://dummyjson.com/image/1024x1024/18181b/ef4444?text=Free+API+Rate+Limited:%0A${encodeURIComponent(truncated)}`;
                } else {
                  setIsGenerating(false);
                }
              }}
            />
          </div>
        )}

        {/* State 3: Empty Screen with Floating Cards */}
        {!resultUrl && !isGenerating && (
          <div className="relative w-full h-full flex flex-col items-center justify-center -mt-16 sm:-mt-24 z-10">
            
            <div className="flex items-center justify-center gap-3 mb-10 sm:mb-16">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                {config.label}
              </h1>
            </div>

            <div className="relative h-[280px] w-full max-w-3xl flex justify-center items-center perspective-1000 group">
              {emptyStateCards.map((card, idx) => (
                <div 
                  key={idx}
                  className={`absolute w-[160px] sm:w-[200px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-out 
                    ${card.translation} ${card.rotation} ${card.zIndex}
                    border border-white/10 hover:border-white/30 hover:scale-105 cursor-pointer hover:z-50
                    group-hover:-translate-y-4`}
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent p-4 flex items-end">
                    <p className="text-white text-[13px] font-medium truncate">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        )}
      </div>

      {/* Floating Bottom Command Bar (Krea Style) */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[800px] z-50 px-4">
        <div className="bg-[#1a1a1c]/90 border border-white/10 rounded-2xl p-2 sm:p-3 flex flex-col gap-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-white/20">
          
          {/* Text Input Row */}
          <div className="flex items-center gap-3 px-3 pt-1">
            <input
              type="text"
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
              disabled={isGenerating}
              placeholder={`Describe an ${toolId === 'image' ? 'image' : 'idea'} and click generate...`}
              className="w-full bg-transparent text-[14px] sm:text-[15px] font-medium text-white placeholder:text-zinc-500 outline-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                prompt.trim() && !isGenerating 
                  ? 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white/30'
              }`}
            >
              {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Toolbar Switches Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden px-1 pb-1">
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              NextFlow 1 <ChevronDown className="w-3 h-3 opacity-50 ml-0.5" />
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
              Lora
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Focus className="w-3.5 h-3.5 text-zinc-400" />
              Image prompt
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Style transfer
            </button>
            
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Square className="w-3 h-3 text-zinc-400" />
              1:1
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Diamond className="w-3.5 h-3.5 text-zinc-400" />
              1K
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
