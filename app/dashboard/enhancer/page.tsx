'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Download, X, AlertCircle, ChevronDown, Wand2, Upload as UploadIcon, FileImage } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const models = [
  { id: 'krea-enhance', name: 'Krea Enhance', icon: '✨', desc: 'Excellent AI enhancement, great overall details.', speed: 5, quality: 4, credits: 10, features: ['Upscale', 'Details'] },
  { id: 'magnific', name: 'Magnific', icon: '🔍', desc: 'Premium highly detailed enhancement.', speed: 3, quality: 5, credits: 40, features: ['Upscale', 'Extreme Details'] },
  { id: 'topaz-gen', name: 'Topaz Generative', icon: '🎯', desc: 'Generative AI upscaling by Topaz.', speed: 4, quality: 5, credits: 30, features: ['Upscale', 'Texture'] },
  { id: 'topaz-bloom', name: 'Topaz Bloom', icon: '🌸', desc: 'Smooth AI upscaling by Topaz.', speed: 4, quality: 4, credits: 20, features: ['Upscale'] },
  { id: 'magnific-precise', name: 'Magnific Precise', icon: '📐', desc: 'High fidelity realistic upscaling.', speed: 3, quality: 5, credits: 40, features: ['Upscale', 'Realism'] },
  { id: 'krea-legacy', name: 'Krea Legacy', icon: '🔄', desc: 'Previous generation Krea enhancer.', speed: 5, quality: 3, credits: 5, features: ['Upscale'] },
  { id: 'starlight', name: 'Starlight', icon: '⭐', desc: 'Balanced detail and lighting enhancement.', speed: 4, quality: 4, credits: 15, features: ['Upscale', 'Lighting'] },
  { id: 'astra', name: 'Astra', icon: '🌌', desc: 'Fast upscaling for subtle improvements.', speed: 5, quality: 3, credits: 10, features: ['Upscale'] },
  { id: 'krea-video', name: 'Krea Video', icon: '🎥', desc: 'Specialized upscaling for video sequences.', speed: 2, quality: 4, credits: 50, features: ['Video', 'Upscale'] }
];

export default function EnhancerPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [image, setImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelsOpen, setModelsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      // Simulate API call for enhancement
      await new Promise(r => setTimeout(r, 3000));
      setResult(image); // In a real app, this would be the enhanced image URL returned from API
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
    <div className="flex flex-col h-[500px] w-[340px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
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
                  <div className="w-3.5 h-3.5 rounded-full border sm border-zinc-600 bg-transparent opacity-50 text-white flex items-center justify-center text-[10px]">{m.icon}</div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className={`text-[14px] font-medium tracking-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{m.name}</h3>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {m.desc}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400 font-medium">
                  {m.features.map((f, index) => (
                    <React.Fragment key={f}>
                      <span>{f}</span>
                      {index < m.features.length - 1 && <span className="opacity-40">•</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[10px] text-zinc-500 mr-1">Speed</span>
                    {renderRating(m.speed, 5)}
                  </div>
                  <div className="flex items-center gap-1 opacity-70">
                    <span className="text-[10px] text-zinc-500 mr-1">Quality</span>
                    {renderRating(m.quality, 5)}
                  </div>
                  <span className="text-[10px] text-zinc-400 ml-auto opacity-70">~{m.credits} ⚡</span>
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
      className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans"
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

      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {/* MAIN KREA CANVAS AREA */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!image && !generating && !result ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pointer-events-auto z-10 w-full max-w-lg mt-12"
            >
              {/* Graphic Representation of Enhancement */}
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
                  className="px-6 py-3 bg-[#222222] hover:bg-[#333333] text-white rounded-full font-medium text-[14px] border border-white/5 transition-all flex items-center gap-2"
                >
                  Select asset
                </button>
              </div>

              <p className="text-[12px] text-zinc-600 mt-6 font-medium">Max 75MB / 15 seconds</p>
            </motion.div>
          ) : (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center w-full max-w-4xl px-8 z-10 mt-12"
            >
              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-8 w-full">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-[13px]">{error}</p>
                  <button type="button" onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="w-full aspect-[4/3] max-h-[60vh] bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex items-center justify-center">
                 {generating ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                     <div className="w-8 h-8 border-[3px] border-white/20 border-t-white rounded-full animate-spin mb-4" />
                     <p className="text-[14px] font-medium text-white tracking-wide">Enhancing with {selectedModel.name}...</p>
                     <p className="text-[12px] text-zinc-400 mt-2">Adding details and upscaling resolution</p>
                   </div>
                 ) : null}

                 {image && (
                   <div className="w-full h-full relative group">
                     <img src={result || image} alt="Preview" className="w-full h-full object-contain" />
                     
                     {/* Top Bar for controls */}
                     <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[12px] font-medium">
                          {result ? `Enhanced Result • ${selectedModel.name}` : 'Original Input'}
                        </div>
                        <button 
                          onClick={cancelEnhance}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                     </div>

                     {/* Action Bar at bottom */}
                     {!result && !generating && (
                       <div className="absolute bottom-6 inset-x-0 flex justify-center">
                         <button 
                           onClick={handleEnhance}
                           className="px-6 py-3 bg-white text-black hover:scale-105 rounded-full font-semibold text-[14px] shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2"
                         >
                           <Wand2 className="w-4 h-4" /> Enhance Image
                         </button>
                       </div>
                     )}
                   </div>
                 )}
              </div>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex justify-end w-full">
                   <a 
                     href={result} 
                     download="krea-enhanced.jpg"
                     className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-[13px] backdrop-blur-md flex items-center gap-2 transition-colors border border-white/5"
                   >
                     <Download className="w-4 h-4" /> Download Result
                   </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
