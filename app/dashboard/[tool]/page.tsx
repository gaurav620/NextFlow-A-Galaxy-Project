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
  Plus,
  Check,
  Upload,
  Layers
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAssetStore } from '@/store/assets';

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

const MODELS = [
  { id: 'flux', name: 'NextFlow 1', sub: 'Most creative model with LoRAs.', icon: ImageIcon },
  { id: 'turbo', name: 'Nano Banana', sub: 'Most versatile intelligent model.', icon: Zap },
  { id: 'flux-pro', name: 'Nano Banana Pro', sub: "World's most intelligent model.", icon: Zap },
  { id: 'flux-3d', name: 'Flux 2 Klein', sub: 'Fast lightweight Flux 2 model.', icon: Box },
  { id: 'recraft', name: 'Recraft V4', sub: 'Sharp, detailed images from Recraft.', icon: Wand2 },
];

const RATIOS = [
  { id: '1:1', w: 1024, h: 1024 },
  { id: '4:3', w: 1024, h: 768 },
  { id: '3:2', w: 1024, h: 683 },
  { id: '16:9', w: 1024, h: 576 },
  { id: '2.35:1', w: 1024, h: 436 },
  { id: '3:4', w: 768, h: 1024 },
  { id: '2:3', w: 683, h: 1024 },
  { id: '9:16', w: 576, h: 1024 },
];

const PAST_ASSETS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
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

  // Popover States
  const [activePopover, setActivePopover] = useState<'model' | 'image' | 'ratio' | null>(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIOS[0]);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const hasSavedAsset = useRef(false);
  const addAsset = useAssetStore((state) => state.addAsset);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResultUrl(null);
    setActivePopover(null);
    hasSavedAsset.current = false;
    
    // Easter egg intercept
    if (prompt.toLowerCase().includes('hanuman') || prompt.toLowerCase().includes('hnuman')) {
      setTimeout(() => { setResultUrl('/hanuman.png'); }, 1500);
      return;
    }
    
    // Connect to Pollinations.ai API combining Aspect Ratio & Custom Model configs!
    if (['image', 'nano', 'enhancer', 'edit', '3d'].includes(toolId)) {
      const seed = Math.floor(Math.random() * 100000);
      setResultUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${selectedRatio.w}&height=${selectedRatio.h}&nologo=true&seed=${seed}&model=${selectedModel.id}`);
    } else {
      setResultUrl(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' cinematic video still frame')}?width=1024&height=576&nologo=true`);
    }
  };

  return (
    <div className="flex w-full h-full text-white font-sans overflow-hidden bg-[#0a0a0a] relative">
      
      {/* Top Header Controls */}
      {resultUrl && !isGenerating && (
        <div className="absolute top-4 right-6 flex items-center gap-2 z-40">
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
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-[#0a0a0a]/60 backdrop-blur-lg transition-all duration-500">
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
          <div className="w-full h-full max-w-[90vw] max-h-[85vh] flex items-center justify-center relative z-20">
            <img 
              src={resultUrl} 
              alt="Generated Result" 
              className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-700 ${isGenerating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              referrerPolicy="no-referrer"
              onLoad={(e) => {
                setIsGenerating(false);
                const target = e.target as HTMLImageElement;
                if (!hasSavedAsset.current && !target.src.includes('dummyjson') && !target.src.includes('hanuman.png')) {
                  addAsset({
                    url: target.src,
                    prompt: prompt,
                    tool: toolId,
                    ratio: selectedRatio.id,
                  });
                  hasSavedAsset.current = true;
                }
              }}
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
                    border border-white/10 hover:border-white/30 hover:scale-[1.03] cursor-pointer hover:z-50
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

      {/* Floating Bottom Command Bar (NextFlow Style) with Popovers */}
      <div 
        ref={popoverRef}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[800px] z-[100] px-4 flex flex-col items-center"
      >
        
        {/* POPOVER 1: MODEL SELECTOR */}
        {activePopover === 'model' && (
          <div className="w-[260px] bg-[#1a1a1c] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-1.5 mb-2 ml-[-480px] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {MODELS.map((m) => {
              const ActionIcon = m.icon;
              return (
                <button 
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setActivePopover(null); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors ${selectedModel.id === m.id ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <ActionIcon className={`w-4 h-4 ${selectedModel.id === m.id ? 'text-white' : 'text-zinc-500'}`} />
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-[13px] font-medium text-white">{m.name}</span>
                      <span className="text-[10px] text-zinc-500">{m.sub}</span>
                    </div>
                  </div>
                  {selectedModel.id === m.id && <Check className="w-4 h-4 text-white" />}
                </button>
              )
            })}
          </div>
        )}

        {/* POPOVER 2: IMAGE PROMPT / UPLOAD */}
        {activePopover === 'image' && (
          <div className="w-[320px] bg-[#1a1a1c] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-3 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-[12px] text-zinc-400 text-center leading-relaxed mb-4 px-2">
              Image prompts apply the style and content of any picture to your generation. Upload images or select from your asset library.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PAST_ASSETS.map((asset, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/5 hover:border-white/20 cursor-pointer">
                  <img src={asset} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActivePopover(null)}
                className="w-full py-2.5 bg-white text-black font-semibold text-[13px] rounded-xl hover:scale-[1.02] transition-transform flex justify-center items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
              <button 
                onClick={() => setActivePopover(null)}
                className="w-full py-2.5 bg-white/5 text-white font-medium text-[13px] rounded-xl hover:bg-white/10 transition-colors flex justify-center items-center gap-2"
              >
                <Layers className="w-4 h-4" /> Select asset
              </button>
            </div>
          </div>
        )}

        {/* POPOVER 3: ASPECT RATIO */}
        {activePopover === 'ratio' && (
          <div className="w-[480px] bg-[#1a1a1c] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-4 mb-2 ml-[120px] animate-in fade-in slide-in-from-bottom-2 duration-200 flex gap-6">
            <div className="flex-1 grid grid-cols-4 gap-2">
              {RATIOS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedRatio(r); setActivePopover(null); }}
                  className={`py-2 rounded-lg text-[11px] font-medium transition-colors border ${
                    selectedRatio.id === r.id 
                      ? 'border-white text-white bg-white/5' 
                      : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>
            
            <div className="w-[120px] flex items-center justify-center shrink-0 border-l border-white/10 pl-6">
               <div className="relative flex items-center justify-center w-[80px] h-[80px] bg-[#222] rounded-lg border border-[#333]">
                 {/* Visual Representation of aspect ratio */}
                 <div 
                   className="bg-white/20 border-2 border-white rounded-[4px] shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300"
                   style={{
                     width: selectedRatio.w >= selectedRatio.h ? '60px' : `${(selectedRatio.w / selectedRatio.h) * 60}px`,
                     height: selectedRatio.h >= selectedRatio.w ? '60px' : `${(selectedRatio.h / selectedRatio.w) * 60}px`,
                   }}
                 />
                 <div className="absolute top-1/2 left-0 w-2 h-0.5 bg-white/30 -translate-y-1/2 -translate-x-full" />
                 <div className="absolute top-1/2 right-0 w-2 h-0.5 bg-white/30 -translate-y-1/2 translate-x-full" />
                 <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-white/30 -translate-x-1/2 translate-y-full" />
                 <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-white/30 -translate-x-1/2 -translate-y-full" />
               </div>
            </div>
          </div>
        )}

        {/* Base Command Pill */}
        <div className="bg-[#1a1a1c] sm:bg-[#1a1a1c]/90 border border-white/10 rounded-2xl p-2 sm:p-3 flex flex-col gap-3 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 w-full relative">
          
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
            
            {/* Model Toggle */}
            <button 
              onClick={() => setActivePopover(activePopover === 'model' ? null : 'model')}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${activePopover === 'model' ? 'border-white/20 bg-white/10 text-white' : 'border-transparent bg-white/5 hover:bg-white/10 text-zinc-300'} text-[11px] sm:text-[12px] font-medium`}
            >
              <selectedModel.icon className={`w-3.5 h-3.5 ${activePopover === 'model' ? 'text-white' : 'text-zinc-400'}`} />
              {selectedModel.name} <ChevronDown className="w-3 h-3 opacity-50 ml-0.5" />
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
              Lora
            </button>
            
            {/* Image Prompt Toggle */}
            <button 
              onClick={() => setActivePopover(activePopover === 'image' ? null : 'image')}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${activePopover === 'image' ? 'border-white/20 bg-white/10 text-white' : 'border-transparent bg-white/5 hover:bg-white/10 text-zinc-300'} text-[11px] sm:text-[12px] font-medium`}
            >
              <Focus className={`w-3.5 h-3.5 ${activePopover === 'image' ? 'text-white' : 'text-zinc-400'}`} />
              Image prompt
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Style transfer
            </button>
            
            <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
            
            {/* Aspect Ratio Toggle */}
            <button 
              onClick={() => setActivePopover(activePopover === 'ratio' ? null : 'ratio')}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors border ${activePopover === 'ratio' ? 'border-white/20 bg-white/10 text-white' : 'border-transparent bg-white/5 hover:bg-white/10 text-zinc-300'} text-[11px] sm:text-[12px] font-medium`}
            >
              <Square className={`w-3 h-3 ${activePopover === 'ratio' ? 'text-white' : 'text-zinc-400'}`} />
              {selectedRatio.id}
            </button>
            
            <button className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent bg-white/5 hover:bg-white/10 text-[11px] sm:text-[12px] text-zinc-300 font-medium transition-colors">
              <Diamond className="w-3.5 h-3.5 text-zinc-400" />
              1K
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
