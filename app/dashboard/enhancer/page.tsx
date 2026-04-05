'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Download, X, AlertCircle, ChevronDown, Wand2, Upload as UploadIcon, Settings2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const models = [
  { id: 'krea-enhance', name: 'NextFlow Enhance', icon: '✨', desc: 'Excellent AI enhancement, great overall details.', speed: 5, quality: 4, credits: 10, features: ['Upscale', 'Details'] },
  { id: 'magnific', name: 'Magnific', icon: '🔍', desc: 'Premium highly detailed enhancement.', speed: 3, quality: 5, credits: 40, features: ['Upscale', 'Extreme Details'] },
  { id: 'topaz-gen', name: 'Topaz Generative', icon: '🎯', desc: 'Generative AI upscaling by Topaz.', speed: 4, quality: 5, credits: 30, features: ['Upscale', 'Texture'] },
  { id: 'topaz-bloom', name: 'Topaz Bloom', icon: '🌸', desc: 'Smooth AI upscaling by Topaz.', speed: 4, quality: 4, credits: 20, features: ['Upscale'] },
  { id: 'magnific-precise', name: 'Magnific Precise', icon: '📐', desc: 'High fidelity realistic upscaling.', speed: 3, quality: 5, credits: 40, features: ['Upscale', 'Realism'] },
  { id: 'krea-legacy', name: 'NextFlow Legacy', icon: '🔄', desc: 'Previous generation NextFlow enhancer.', speed: 5, quality: 3, credits: 5, features: ['Upscale'] },
  { id: 'starlight', name: 'Starlight', icon: '⭐', desc: 'Balanced detail and lighting enhancement.', speed: 4, quality: 4, credits: 15, features: ['Upscale', 'Lighting'] },
  { id: 'astra', name: 'Astra', icon: '🌌', desc: 'Fast upscaling for subtle improvements.', speed: 5, quality: 3, credits: 10, features: ['Upscale'] }
];

const upscaleFactors = ['2x', '4x', '8x', '16x'];

export default function EnhancerPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Workflow settings
  const [factor, setFactor] = useState('4x');
  const [creativity, setCreativity] = useState(30);
  const [hdr, setHdr] = useState(false);
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleEnhance = async () => {
    if (!image) return;
    setGenerating(true);
    setError(null);
    try {
      // Simulate API call for enhancement with the settings
      await new Promise(r => setTimeout(r, 2500));
      // In a real application, you'd send: image, factor, creativity, hdr, faceEnhance, prompt, selectedModel.id
      setResult(image); // Simulating successful generation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enhancement failed');
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

  const renderRating = (score: number, max = 5) => {
    return Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < score ? 'bg-zinc-300' : 'bg-zinc-700'}`} />
    ));
  };

  const ModelSelectorContent = ({ onClose }: { onClose: () => void }) => (
    <div className="flex flex-col h-[400px] w-[340px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
         <p className="text-[13px] font-medium text-white">Select Enhancer Model</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 [&::-webkit-scrollbar]:hidden">
        {models.map(m => {
          const isSelected = selectedModel.id === m.id;
          return (
            <div 
              key={m.id} 
              onClick={() => { setSelectedModel(m); onClose(); }}
              className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                isSelected ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="mt-0.5 w-4 flex-shrink-0 flex items-center justify-center">
                {isSelected ? (
                  <div className="w-3.5 h-3.5 rounded-full border-[3px] border-white bg-transparent" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 bg-transparent opacity-50 flex items-center justify-center text-[10px]">{m.icon}</div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className={`text-[14px] font-medium tracking-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{m.name}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {m.desc}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[10px] text-zinc-500 mr-1">Speed</span>
                    {renderRating(m.speed, 5)}
                  </div>
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[10px] text-zinc-500 mr-1">Quality</span>
                    {renderRating(m.quality, 5)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div 
      className="flex w-full h-full text-white bg-black relative overflow-hidden font-sans"
      onDragOver={e => e.preventDefault()}
      onDrop={handleImageDrop}
    >
      
      {/* TOP LEFT MODEL SWITCHER */}
      <div className="absolute top-4 left-6 z-50">
        <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-transparent border-none">
              <span className="text-[14px] font-medium">Model <span className="text-white">{selectedModel.name}</span></span>
              <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="p-0 border-none bg-transparent shadow-none" sideOffset={8}>
            <ModelSelectorContent onClose={() => setModelsOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {!image && !generating && !result ? (
        /* --- EMPTY STATE --- */
        <motion.div 
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex-1 flex flex-col items-center justify-center pointer-events-auto z-10 w-full mt-12"
        >
          <div className="w-64 h-40 mb-10 relative flex items-center justify-center opacity-80 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-600 rounded-3xl blur-2xl opacity-20" />
             <div className="absolute inset-0 flex rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="w-1/2 bg-[#1a1a1a] flex items-center justify-center border-r border-white/20">
                  <ImageIcon className="w-8 h-8 text-zinc-600 blur-[2px]" />
                </div>
                <div className="w-1/2 bg-gradient-to-tr from-indigo-900/40 to-purple-900/40 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
             </div>
             {/* Split Line */}
             <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -translate-x-1/2 flex items-center justify-center">
                <div className="w-3 h-8 bg-white rounded-full flex items-center justify-center -translate-x-[5px]">
                   <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                </div>
             </div>
          </div>

          <h1 className="text-[36px] font-semibold tracking-tight text-white mb-4">Enhancer</h1>
          <p className="text-[15px] text-zinc-400 text-center max-w-sm leading-relaxed mb-8">
            Upscale images up to 22K or videos up to 8K resolution, and add new details.
          </p>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileRef.current?.click()}
              className="px-6 py-3 bg-[#3f51b5] hover:bg-[#4f61c5] text-white rounded-full font-medium text-[14px] shadow-lg transition-all flex items-center gap-2"
            >
              Upload <UploadIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => fileRef.current?.click()}
              className="px-6 py-3 bg-[#222222] hover:bg-[#333333] text-white rounded-full font-medium text-[14px] border border-white/5 transition-all flex items-center gap-2"
            >
              Select asset
            </button>
          </div>

          <p className="text-[12px] text-zinc-600 mt-6 font-medium">Max 75MB / 15 seconds</p>
        </motion.div>
      ) : (
        /* --- WORKSPACE STATE --- */
        <div className="flex-1 flex w-full h-full relative z-10 pt-16">
          
          {/* Main Canvas Area */}
          <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden p-6">
            {error && (
              <div className="absolute top-6 z-30 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl w-full max-w-lg shadow-2xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[13px]">{error}</p>
                <button type="button" onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className={`w-full h-full max-w-4xl bg-[#141414] rounded-2xl border ${result ? 'border-[#3f51b5]/30' : 'border-white/10'} shadow-2xl overflow-hidden relative flex items-center justify-center transition-colors`}>
               {generating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
                   <div className="w-10 h-10 border-[3px] border-[#3f51b5]/30 border-t-[#3f51b5] rounded-full animate-spin mb-4" />
                   <p className="text-[15px] font-medium text-white tracking-wide">Enhancing with {selectedModel.name}...</p>
                 </div>
               )}

               {image && (
                 <div className="w-full h-full p-4 relative group flex flex-col">
                   {/* Top Actions overlay */}
                   <div className="absolute top-4 inset-x-4 z-10 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-[12px] font-medium shadow-lg">
                        {result ? <span className="text-[#3f51b5] font-semibold">{selectedModel.name} Output</span> : 'Original Input'}
                      </div>
                      <div className="flex gap-2">
                        {result && (
                           <a href={result} download="nextflow-enhanced.jpg" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors border border-white/5">
                             <Download className="w-4 h-4 text-white" />
                           </a>
                        )}
                        <button onClick={cancelEnhance} className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/80 backdrop-blur-md hover:bg-red-500/80 transition-colors border border-white/10">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                   </div>

                   <div className="flex-1 relative rounded-xl overflow-hidden mt-10 mb-2">
                     {result ? (
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 h-full border-r border-white/20 overflow-hidden relative">
                             <img src={image} alt="Original" className="absolute inset-0 w-[200%] h-full max-w-none object-contain origin-top-left" style={{ objectPosition: 'left center' }} />
                             <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 text-white text-[10px] rounded backdrop-blur-sm uppercase tracking-wider font-bold">Original</div>
                          </div>
                          <div className="w-1/2 h-full overflow-hidden relative bg-black">
                             <img src={result} alt="Enhanced" className="absolute inset-0 w-[200%] h-full max-w-none object-contain origin-top-right transform -translate-x-1/2" style={{ objectPosition: 'right center' }} />
                             <div className="absolute bottom-4 right-4 px-2 py-1 bg-[#3f51b5]/80 text-white text-[10px] rounded backdrop-blur-sm uppercase tracking-wider font-bold">Enhanced</div>
                          </div>
                        </div>
                     ) : (
                        <img src={image} alt="Preview" className="w-full h-full object-contain" />
                     )}
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Right Sidebar: Settings & Workflow */}
          <div className="w-[320px] bg-[#09090b] border-l border-white/[0.04] flex flex-col shadow-2xl relative z-10">
            <div className="h-14 flex items-center px-6 border-b border-white/[0.05] gap-2">
              <Settings2 className="w-4 h-4 text-zinc-400" />
              <span className="text-[14px] font-semibold tracking-wide">Enhance Settings</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden">
              
              {/* Added Prompt */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold flex items-center justify-between">
                  Prompt <span className="opacity-50 font-normal lowercase tracking-normal">Optional</span>
                </label>
                <textarea 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe added details..."
                  className="w-full h-24 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white resize-none outline-none focus:border-[#3f51b5]/50 transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Upscale Factor */}
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">Upscale Factor</label>
                <div className="grid grid-cols-4 gap-2">
                  {upscaleFactors.map(f => (
                    <button
                      key={f}
                      onClick={() => setFactor(f)}
                      className={`py-2 rounded-xl text-[12px] font-medium transition-all ${
                        factor === f ? 'bg-white text-black shadow-md' : 'bg-[#1a1a1a] text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creativity Strength */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold">AI Strength</label>
                  <span className="text-[12px] font-medium bg-white/10 px-2 py-0.5 rounded-md text-white">{creativity}%</span>
                </div>
                <input
                  type="range" min={0} max={100} value={creativity}
                  onChange={e => setCreativity(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                  style={{ background: `linear-gradient(to right, #3f51b5 0%, #3f51b5 ${creativity}%, #27272a ${creativity}%, #27272a 100%)` }}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                {[
                  { label: 'HDR Enhancement', sub: 'Boost dynamic range and contrast', val: hdr, set: setHdr },
                  { label: 'Face Enhancement', sub: 'Restore facial details', val: faceEnhance, set: setFaceEnhance },
                ].map(({ label, sub, val, set }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-white/5">
                    <div>
                      <p className="text-[13px] text-zinc-200 font-medium">{label}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
                    </div>
                    <button
                      onClick={() => set(!val)}
                      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${val ? 'bg-[#3f51b5]' : 'bg-zinc-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? 'left-[22px]' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bottom */}
            <div className="p-6 border-t border-white/[0.05] bg-[#111] rounded-bl-3xl">
              <button
                onClick={handleEnhance}
                disabled={generating || result !== null}
                className={`w-full py-3.5 rounded-xl font-semibold text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg ${
                  generating || result !== null
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.02]'
                }`}
              >
                {generating ? (
                  <><div className="w-4 h-4 border-[2px] border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />Enhancing...</>
                ) : result !== null ? (
                  <>Enhanced</>
                ) : (
                  <><Wand2 className="w-4 h-4" /> Enhance Image</>
                )}
              </button>
              <div className="text-center mt-3 text-[11px] text-zinc-500 font-medium">Cost: <span className="text-zinc-300">~{selectedModel.credits} credits</span></div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
