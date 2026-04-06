'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  X, 
  AlertCircle, 
  ChevronDown, 
  Wand2, 
  Upload as UploadIcon, 
  Settings2,
  Maximize,
  SlidersHorizontal,
  Diamond,
  Mountain,
  Eye,
  MenuSquare
} from 'lucide-react';
import { toast } from 'sonner';

const models = [
  { id: 'krea-enhance', name: 'Krea Enhance', icon: '✨', desc: 'Excellent AI enhancement, great overall details.', credits: 10 },
  { id: 'magnific', name: 'Luma', icon: '🔍', desc: 'Premium highly detailed enhancement.', credits: 40 },
  { id: 'topaz-gen', name: 'Runway Aleph', icon: '🎯', desc: 'Generative AI upscaling by Topaz.', credits: 30 }
];

const upscaleFactors = ['1x', '2x', '4x', '8x'];

export default function EnhancerPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // Workflow settings
  const [factor, setFactor] = useState('4x');
  const [aiStrength, setAiStrength] = useState(50);
  const [resemblance, setResemblance] = useState(70);
  const [clarity, setClarity] = useState(40);
  const [prompt, setPrompt] = useState("");
  
  // Custom states
  const [isDragging, setIsDragging] = useState(false);
  const [comparing, setComparing] = useState(50); // Split slider 0-100%

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleEnhance = async () => {
    if (!image) return;
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64 = await base64Promise;

      const apiResponse = await fetch('/api/generate/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: blob.type,
          scale: parseFloat(factor) || 4,
          creativity: aiStrength,
        })
      });
      
      const data = await apiResponse.json();
      if (!data.success) throw new Error(data.error || 'Enhancement failed');
      
      setResult(data.enhanced || image);
      toast.success('Image enhanced successfully');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Enhancement failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const cancelEnhance = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div 
      className="flex w-full h-full min-h-screen text-white bg-[#070707] relative overflow-hidden font-sans"
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#070707] to-transparent pointer-events-none z-0" />

      {/* TOP LEFT MODEL SWITCHER */}
      <div className="absolute top-4 left-6 z-50 flex items-center gap-4">
        <div className="relative">
          <button 
             onClick={() => setModelsOpen(!modelsOpen)}
             className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-transparent border-none outline-none py-1"
          >
            <span className="text-[14px]">Model <span className="text-white font-medium">{selectedModel.name}</span></span>
            <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
          </button>
          
          <AnimatePresence>
             {modelsOpen && (
                <motion.div 
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   className="absolute top-full left-0 mt-2 min-w-[200px] bg-[#1a1a1c] border border-white/5 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto z-50 flex flex-col p-1.5"
                >
                   {models.map((model) => (
                      <button 
                         key={model.id}
                         onClick={() => { setSelectedModel(model); setModelsOpen(false); }}
                         className={`w-full text-left px-3 py-2.5 text-[13px] font-medium rounded-[12px] transition-colors ${selectedModel.id === model.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                      >
                         {model.name}
                      </button>
                   ))}
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {!image && !generating && !result ? (
        /* --- EMPTY STATE (KREA DESIGN) --- */
        <motion.div 
          key="empty"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex-1 flex flex-col items-center justify-center relative z-10 w-full"
        >
            <div className={`w-[440px] bg-[#141414] rounded-[32px] overflow-hidden flex flex-col shadow-2xl border transition-all duration-300 ${isDragging ? 'border-[#0070f3] shadow-blue-500/20' : 'border-white/5'}`}>
                
                {/* Top Half: Mock Split Slider Image */}
                <div className="h-[240px] w-full relative bg-zinc-900 overflow-hidden">
                    {/* Simulated Left (Noisy/Blurry) */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=40')] bg-cover bg-center grayscale blur-[1px] opacity-60" />
                    {/* Simulated Right (Crisp/HD) */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=100')] bg-cover bg-center grayscale" style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 60% 100%)' }} />
                    {/* The Divider Line */}
                    <div className="absolute top-0 bottom-0 left-[60%] w-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    
                    {isDragging && (
                        <div className="absolute inset-0 bg-[#0070f3]/20 backdrop-blur-sm flex items-center justify-center z-10">
                            <p className="text-white font-bold text-xl">Drop Image Here</p>
                        </div>
                    )}
                </div>

                {/* Bottom Half: Call to Actions */}
                <div className="flex-1 bg-[#18181b] p-8 flex flex-col items-center justify-center text-center">
                    
                    {/* Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center shadow-inner">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-[44px] font-bold tracking-tight text-white leading-none">Enhancer</h1>
                    </div>

                    <p className="text-[15px] text-zinc-400 max-w-[320px] leading-relaxed mb-8">
                        Upscale images up to 22K or videos up to 8K resolution, and add new details.
                    </p>

                    <div className="flex items-center gap-3 w-full justify-center mb-5">
                        <button 
                            onClick={() => fileRef.current?.click()}
                            className="bg-[#0070f3] hover:bg-[#0060df] text-white px-7 py-3 rounded-[14px] font-medium text-[15px] flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <UploadIcon className="w-4 h-4 stroke-[3]" /> Upload
                        </button>
                        <button 
                            className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-[14px] font-medium text-[15px] transition-colors border border-white/5 flex items-center gap-2"
                        >
                            <ImageIcon className="w-4 h-4" /> Select asset
                        </button>
                    </div>

                    <p className="text-[11px] text-zinc-600 font-medium tracking-wide">Max 75MB / 15 seconds</p>
                </div>

            </div>
        </motion.div>
      ) : (
        /* --- ACTIVE WORKSPACE STATE --- */
        <div className="flex-1 flex w-full h-full relative z-10 pt-16">
          
          {/* Main Canvas Area */}
          <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-[#070707] p-8 pb-20">
            {/* Top Right Toggle for Sidebar */}
            <div className="absolute top-4 right-4 z-50">
               {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white backdrop-blur transition-all">
                     <MenuSquare className="w-5 h-5" />
                  </button>
               )}
            </div>

            {error && (
              <div className="absolute top-6 z-30 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl w-full max-w-lg shadow-2xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[13px]">{error}</p>
                <button type="button" onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className={`w-full max-w-5xl h-full bg-[#0a0a0a] rounded-2xl border ${result ? 'border-[#0070f3]/30' : 'border-white/5'} shadow-2xl overflow-hidden relative flex items-center justify-center transition-colors`}>
               {generating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}>
                       <div className="w-12 h-12 border-[3px] border-[#0070f3]/30 border-t-[#0070f3] rounded-full mb-4" />
                   </motion.div>
                   <p className="text-[15px] font-medium text-white tracking-wide">Enhancing with {selectedModel.name}...</p>
                 </div>
               )}

               {image && (
                 <div className="w-full h-full relative group flex flex-col items-center justify-center p-4">
                   {/* Top Actions overlay */}
                   <div className="absolute top-4 inset-x-4 z-40 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-[12px] font-medium shadow-lg">
                        {result ? <span className="text-[#0070f3] font-semibold">{selectedModel.name} output</span> : 'Original Input'}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={cancelEnhance} className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/80 backdrop-blur-md hover:bg-red-500/80 transition-colors border border-white/10 shadow-xl">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                   </div>

                   <div className="w-full h-full relative rounded-xl overflow-hidden flex items-center justify-center">
                     {result ? (
                        <div className="relative w-full h-full flex items-center justify-center select-none"
                             onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                setComparing((x / rect.width) * 100);
                             }}
                             onMouseLeave={() => setComparing(50)}
                        >
                          <img src={image} alt="Original" className="max-w-full max-h-full object-contain pointer-events-none" />
                          
                          <div 
                             className="absolute top-0 bottom-0 left-0 overflow-hidden"
                             style={{ width: `${comparing}%` }}
                          >
                             {/* The enhanced image logic requires trickery if object-contain. For visual purposes, we just stretch overlay exactly to parent bounds */}
                             <img src={result} alt="Enhanced" className="absolute top-1/2 left-0 -translate-y-1/2 max-w-none 
                                                                        [width:calc(100vw-360px)] object-contain opacity-50 contrast-125 saturate-150 pointer-events-none" />
                          </div>
                          
                          {/* Split Drag Line */}
                          <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-col-resize -ml-[1px]" style={{ left: `${comparing}%` }}>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                  <SlidersHorizontal className="w-4 h-4 text-black" />
                              </div>
                          </div>
                        </div>
                     ) : (
                        <img src={image} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-xl" />
                     )}
                   </div>
                 </div>
               )}
            </div>

            {/* Bottom Floating Canvas Actions */}
            <div className="absolute bottom-6 left-8 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-[14px] px-2 py-1 shadow-2xl">
                <div className="text-zinc-400 text-[13px] font-medium px-2">Fit</div>
                <div className="w-[1px] h-4 bg-white/10" />
                <button className="text-zinc-300 hover:text-white p-2 transition-colors">
                    <Maximize className="w-4 h-4" />
                </button>
            </div>
            
            {result && (
                <div className="absolute bottom-6 right-8">
                     <button className="bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-[12px] text-[13px] font-bold flex items-center gap-2 transition shadow-xl">
                        <Download className="w-4 h-4" /> Download
                     </button>
                </div>
            )}
          </div>

          {/* Right Sidebar: Krea Parameters */}
          <AnimatePresence>
              {sidebarOpen && (
              <motion.div 
                  initial={{ x: 340 }}
                  animate={{ x: 0 }}
                  exit={{ x: 340 }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                  className="w-[340px] bg-[#0c0c0e]/95 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl relative z-20 flex-shrink-0"
              >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-zinc-400" />
                      <span className="text-[14px] font-semibold tracking-wide text-white">Parameters</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-8 [&::-webkit-scrollbar]:hidden">
                  
                  {/* Upscale Factor Row */}
                  <div className="space-y-3">
                    <div className="flex grid grid-cols-4 bg-[#18181b] p-1 rounded-xl border border-white/5">
                      {upscaleFactors.map(f => (
                        <button
                          key={f}
                          onClick={() => setFactor(f)}
                          className={`py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                            factor === f 
                                ? 'bg-[#2a2a2f] text-white shadow-sm border border-white/10' 
                                : 'bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolutions */}
                  <div className="flex gap-4 items-center justify-center opacity-50 grayscale pointer-events-none">
                     <div className="flex flex-col gap-1 w-full">
                         <span className="text-[10px] text-zinc-500 font-medium">W</span>
                         <input type="text" value="3840" readOnly className="w-full bg-[#18181b] rounded-lg py-2 px-3 text-sm text-center text-zinc-400 outline-none" />
                     </div>
                     <span className="text-zinc-600 mt-4">×</span>
                     <div className="flex flex-col gap-1 w-full">
                         <span className="text-[10px] text-zinc-500 font-medium">H</span>
                         <input type="text" value="2160" readOnly className="w-full bg-[#18181b] rounded-lg py-2 px-3 text-sm text-center text-zinc-400 outline-none" />
                     </div>
                  </div>

                  <hr className="border-white/5" />

                  {/* Describe Text Box */}
                  <div className="space-y-2 relative">
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Prompt..."
                      className="w-full h-[120px] bg-[#18181b] border border-white/5 rounded-2xl p-4 pb-12 text-[14px] text-zinc-200 resize-none outline-none focus:border-[#0070f3]/50 transition-colors placeholder:text-zinc-600"
                    />
                    {/* Describe Button Inside Textarea */}
                    <button className="absolute bottom-3 left-3 bg-white hover:bg-zinc-200 text-black px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-colors">
                        <Sparkles className="w-3.5 h-3.5" /> Describe
                    </button>
                  </div>

                  <hr className="border-white/5" />

                  {/* Custom Sliders */}
                  <div className="space-y-6">
                      
                      {/* AI Strength */}
                      <div className="space-y-3 group text-zinc-400 focus-within:text-white hover:text-white transition-colors">
                         <div className="flex justify-between items-center text-[13px] font-medium">
                             <div className="flex items-center gap-2 relative">
                                 <Diamond className="w-4 h-4 fill-current opacity-80" /> AI Strength
                             </div>
                             <span>{aiStrength}%</span>
                         </div>
                         <input
                            type="range" min={0} max={100} value={aiStrength}
                            onChange={e => setAiStrength(Number(e.target.value))}
                            className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg cursor-grab active:cursor-grabbing"
                         />
                      </div>

                      {/* Resemblance */}
                      <div className="space-y-3 group text-zinc-400 focus-within:text-white hover:text-white transition-colors">
                         <div className="flex justify-between items-center text-[13px] font-medium">
                             <div className="flex items-center gap-2 relative">
                                 <Mountain className="w-4 h-4 fill-current opacity-80" /> Resemblance
                             </div>
                             <span>{resemblance}%</span>
                         </div>
                         <input
                            type="range" min={0} max={100} value={resemblance}
                            onChange={e => setResemblance(Number(e.target.value))}
                            className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg cursor-grab active:cursor-grabbing"
                         />
                      </div>

                      {/* Clarity */}
                      <div className="space-y-3 group text-zinc-400 focus-within:text-white hover:text-white transition-colors">
                         <div className="flex justify-between items-center text-[13px] font-medium">
                             <div className="flex items-center gap-2 relative">
                                 <Eye className="w-4 h-4 opacity-80" /> Clarity
                             </div>
                             <span>{clarity}%</span>
                         </div>
                         <input
                            type="range" min={0} max={100} value={clarity}
                            onChange={e => setClarity(Number(e.target.value))}
                            className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg cursor-grab active:cursor-grabbing"
                         />
                      </div>

                  </div>

                </div>

                {/* Massive Action Button Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e] to-transparent border-t border-transparent z-30">
                  <button
                    onClick={handleEnhance}
                    disabled={generating}
                    className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-2xl ${
                      generating
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-[#0070f3] hover:bg-[#0060df] text-white shadow-blue-500/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {generating ? (
                      <div className="w-5 h-5 border-[2.5px] border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                    ) : (
                      <><Sparkles className="w-5 h-5" /> Enhance</>
                    )}
                  </button>
                </div>
              </motion.div>
              )}
          </AnimatePresence>
          
        </div>
      )}
    </div>
  );
}
