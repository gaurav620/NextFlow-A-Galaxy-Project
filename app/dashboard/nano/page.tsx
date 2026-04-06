'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Download, Image as ImageIcon, ChevronDown, Check, Expand, Plus, Search, CircleDashed } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAssetStore } from '@/store/assets';
import { toast } from 'sonner';

const models = [
  { id: 'nano-pro', name: 'NextFlow Nano Pro', sub: 'Highest quality, ~10s' },
  { id: 'nano-2', name: 'NextFlow Nano 2', sub: 'Extremely fast, ~2s' }
];

const RATIOS = [
  { id: '1:1', w: 1024, h: 1024, icon: 'Square' },
  { id: '4:3', w: 1024, h: 768, icon: 'Landscape' },
  { id: '3:2', w: 1024, h: 683, icon: 'Landscape' },
  { id: '16:9', w: 1024, h: 576, icon: 'Wide' },
  { id: '2.35:1', w: 1024, h: 436, icon: 'Cinematic' },
  { id: '3:4', w: 768, h: 1024, icon: 'Portrait' },
  { id: '2:3', w: 683, h: 1024, icon: 'Portrait' },
  { id: '9:16', w: 576, h: 1024, icon: 'Tall' },
];

const RESOLUTIONS = [
  { id: '1K', desc: '~10s' },
  { id: '2K', desc: '~25s' },
  { id: '4K', desc: '~60s' }
];

export default function NanoPage() {
  const { addAsset } = useAssetStore();
  
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedRatio, setSelectedRatio] = useState(RATIOS[0]);
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTIONS[0]);

  // Popover controls
  const [activePopover, setActivePopover] = useState<'model' | 'ratio' | 'res' | 'elements' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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
    setGenerating(true);
    setError(null);
    setActivePopover(null);
    setResult(null);

    const seed = Math.floor(Math.random() * 1000000);
    // Polling simulation for Nano Banana speed
    try {
      const waitTime = selectedModel.id === 'nano-pro' ? 8000 : 2000;
      await new Promise(r => setTimeout(r, waitTime));
      
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${selectedRatio.w}&height=${selectedRatio.h}&nologo=true&seed=${seed}`;
      
      setResult(imgUrl);
      addAsset({
        url: imgUrl,
        prompt: prompt.trim(),
        tool: 'nano',
        ratio: selectedRatio.id
      });
      toast.success('Generated successfully');
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      toast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `nextflow-nano-${Date.now()}.jpg`;
    a.click();
    toast.success('Image downloaded successfully');
  };

  return (
    <div className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans">
      
      {/* HEADER / TOP RIGHT CONTROLS */}
      {result && !generating && (
        <div className="absolute top-6 right-8 flex items-center gap-3 z-50 animate-in fade-in">
           <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-[13px] font-medium backdrop-blur-md">
             <Download className="w-4 h-4" /> Download
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-[13px] font-medium backdrop-blur-md text-yellow-400">
             <Zap className="w-4 h-4" /> Edit
           </button>
        </div>
      )}

      {/* ERROR MESSAGE */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full text-[13px] font-medium shadow-2xl flex items-center gap-2">
            <CircleDashed className="w-4 h-4" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CANVAS */}
      <div className="flex-1 w-full h-full relative flex flex-col items-center justify-center p-8 pb-32">
        
        {/* State 1: Generating Spinner */}
        <AnimatePresence mode="wait">
          {generating && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#0f0f0f]/50 backdrop-blur-sm">
               <div className="relative">
                 <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center relative z-10">
                   <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
                 </div>
                 <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '2s' }} />
               </div>
               <motion.p 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                 className="mt-6 text-[15px] text-zinc-300 font-medium tracking-wide"
               >
                 Generating with {selectedModel.name}...
               </motion.p>
            </motion.div>
          )}

          {/* State 2: Result */}
          {!generating && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full flex items-center justify-center max-w-6xl z-30">
               <div className="relative group max-h-[80vh] w-auto inline-block rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                 <img src={result} alt="Generated" className="h-full w-auto object-contain max-h-[80vh] bg-black/50" />
               </div>
            </motion.div>
          )}

          {/* State 3: Empty Screen */}
          {!generating && !result && (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center text-center z-20 pointer-events-none -mt-20">
               <div className="text-[72px] mb-6 drop-shadow-2xl">🍌</div>
               <h1 className="text-[42px] sm:text-[56px] font-bold tracking-tight text-white mb-2 leading-none">
                 {selectedModel.name}
               </h1>
               <p className="text-zinc-500 text-[16px] max-w-md mx-auto mt-4 font-medium">
                 Lightning-fast generation with perfect prompt adherence.
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM FLOATING PROMPT BAR (Krea Style) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[800px] z-50 px-4" ref={popoverRef}>
        
        {/* Advanced Popovers */}
        <AnimatePresence>
          {activePopover === 'model' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute bottom-[calc(100%+12px)] left-4 w-[280px] bg-[#1a1a1c] border border-white/10 shadow-2xl rounded-2xl p-2 origin-bottom-left">
              {models.map(m => (
                <button key={m.id} onClick={() => { setSelectedModel(m); setActivePopover(null); }} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 transition-colors ${selectedModel.id === m.id ? 'bg-white/10' : ''}`}>
                  <div className="flex flex-col items-start gap-1">
                    <span className={`text-[13px] font-semibold ${selectedModel.id === m.id ? 'text-yellow-400' : 'text-zinc-200'}`}>{m.name}</span>
                    <span className="text-[11px] text-zinc-500">{m.sub}</span>
                  </div>
                  {selectedModel.id === m.id && <Check className="w-4 h-4 text-yellow-400" />}
                </button>
              ))}
            </motion.div>
          )}

          {activePopover === 'ratio' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[520px] bg-[#1a1a1c] border border-white/10 shadow-2xl rounded-2xl p-5 origin-bottom flex gap-6">
              <div className="flex-1 grid grid-cols-4 gap-2.5">
                {RATIOS.map((r) => (
                  <button key={r.id} onClick={() => { setSelectedRatio(r); setActivePopover(null); }} className={`py-2 rounded-xl text-[12px] font-medium transition-all ${selectedRatio.id === r.id ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10 scale-105' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-[#222]'}`}>
                    {r.id}
                  </button>
                ))}
              </div>
              <div className="w-[140px] flex items-center justify-center shrink-0 border-l border-white/10 pl-6">
                 <div className="relative flex items-center justify-center w-[100px] h-[100px] bg-[#000] rounded-xl border border-[#333] shadow-inner overflow-hidden">
                   <div className="bg-white/80 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300" style={{ width: selectedRatio.w >= selectedRatio.h ? '70px' : `${(selectedRatio.w / selectedRatio.h) * 70}px`, height: selectedRatio.h >= selectedRatio.w ? '70px' : `${(selectedRatio.h / selectedRatio.w) * 70}px` }} />
                 </div>
              </div>
            </motion.div>
          )}

          {activePopover === 'res' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute bottom-[calc(100%+12px)] left-[60%] -translate-x-1/2 w-[220px] bg-[#1a1a1c] border border-white/10 shadow-2xl rounded-2xl p-2 origin-bottom">
              {RESOLUTIONS.map((r) => (
                <button key={r.id} onClick={() => { setSelectedResolution(r); setActivePopover(null); }} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors ${selectedResolution.id === r.id ? 'bg-white/10 text-white' : 'text-zinc-400'}`}>
                  <span className="text-[13px] font-semibold tracking-wide">{r.id}</span>
                  <span className="text-[11px] opacity-60 bg-black/50 px-2 py-0.5 rounded">{r.desc}</span>
                </button>
              ))}
            </motion.div>
          )}

          {activePopover === 'elements' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute bottom-[calc(100%+12px)] right-4 w-[340px] bg-[#1a1a1c] border border-white/10 shadow-2xl rounded-2xl p-4 origin-bottom-right">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-white">Elements Collection</h3>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded uppercase font-bold">Pro</span>
              </div>
              <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">
                Upload characters, styles, or compositions. Use <strong className="text-white">@</strong> in your prompt to refer to them directly.
              </p>
              <button 
                onClick={() => setActivePopover(null)}
                className="w-full py-3 bg-[#2a2a2c] hover:bg-[#3a3a3c] text-white border border-white/10 border-dashed rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Create new Element
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Prompt Pill */}
        <div className="bg-[#1a1c23] border border-white/10 rounded-3xl p-2.5 flex flex-col gap-2 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
          
          {/* Main Input Row */}
          <div className="flex items-center px-4 pt-1">
            <input
              type="text"
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
              disabled={generating}
              placeholder="Ask NextFlow Nano to generate anything..."
              className="w-full bg-transparent text-[16px] text-white placeholder:text-zinc-500 outline-none font-medium"
            />
          </div>

          {/* Action Pills Row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              
              <button 
                onClick={() => setActivePopover(activePopover === 'model' ? null : 'model')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${activePopover === 'model' ? 'bg-yellow-400 text-black' : 'bg-[#2a2c35] text-zinc-300 hover:bg-[#3a3c45]'}`}
              >
                <Zap className={`w-3.5 h-3.5 ${activePopover === 'model' ? 'text-black' : 'text-yellow-400'}`} /> {selectedModel.name}
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a2c35] hover:bg-[#3a3c45] text-zinc-300 text-[12px] font-medium transition-colors">
                <ImageIcon className="w-3.5 h-3.5 opacity-70" /> Add Images
              </button>

              <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

              <button 
                onClick={() => setActivePopover(activePopover === 'ratio' ? null : 'ratio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${activePopover === 'ratio' ? 'bg-white/20 text-white' : 'bg-[#2a2c35] text-zinc-300 hover:bg-[#3a3c45]'}`}
              >
                <Expand className="w-3.5 h-3.5 opacity-70" /> {selectedRatio.id}
              </button>

              <button 
                onClick={() => setActivePopover(activePopover === 'res' ? null : 'res')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${activePopover === 'res' ? 'bg-white/20 text-white' : 'bg-[#2a2c35] text-zinc-300 hover:bg-[#3a3c45]'}`}
              >
                <Search className="w-3 h-3 opacity-70" /> {selectedResolution.id}
              </button>

              <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />

              <button 
                onClick={() => setActivePopover(activePopover === 'elements' ? null : 'elements')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${activePopover === 'elements' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-[#2a2c35] text-zinc-400 hover:text-white border border-transparent'}`}
              >
                <span className="font-bold">@</span> Elements
              </button>
            </div>

            {/* Generate Button Wrapper */}
            <div className="shrink-0 ml-4">
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  prompt.trim() && !generating 
                    ? 'bg-white text-black hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'bg-white/5 text-white/20'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
