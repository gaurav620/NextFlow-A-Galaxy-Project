'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, Layers, Undo2, Redo2, Sparkles, Image as ImageIcon, 
  Crop, Sliders, Sun, Brush, Box, Palette, ChevronRight, ChevronDown, Check, MousePointer2
} from 'lucide-react';
import { useAssetStore } from '@/store/assets';

const MODELS = [
  { id: 'flux2', name: 'NextFlow 2 Klein', desc: 'Fast, high quality' },
  { id: 'flux1', name: 'NextFlow 1', desc: 'Standard model' }
];

const LIGHTING_PRESETS = [
  { name: 'Studio', bg: 'bg-zinc-800' },
  { name: 'Cinematic', bg: 'bg-blue-900' },
  { name: 'Neon', bg: 'bg-fuchsia-900' },
  { name: 'Natural', bg: 'bg-green-900' },
];

const ACCORDION_SECTIONS = [
  { id: 'change-region', label: 'Change Region', icon: Sparkles },
  { id: 'annotate', label: 'Annotate', icon: Layers },
  { id: 'crop-expand', label: 'Crop & Expand', icon: Crop },
  { id: 'adjustments', label: 'Image Adjustments', icon: Sliders },
  { id: 'lighting', label: 'Change Lighting', icon: Sun },
  { id: 'draw', label: 'Draw', icon: Brush },
  { id: 'camera', label: 'Change Camera Angle', icon: Box },
  { id: 'palette', label: 'Color Palette', icon: Palette },
];

export default function EditPage() {
  const { addAsset } = useAssetStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModels, setShowModels] = useState(false);
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Filter States
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0
  });

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setOriginalImage(url);
      setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0 });
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setGenerating(true);
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate API output using Pollinations
    const seed = Math.floor(Math.random() * 1000000);
    const finalPrompt = prompt.trim() || 'enhanced photograph, high resolution';
    const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    
    setImage(imgUrl);
    setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0 });
    
    addAsset({
      url: imgUrl,
      prompt: finalPrompt,
      tool: 'edit',
      ratio: '1:1'
    });
    
    setGenerating(false);
  };

  const handleDownload = async () => {
    if (!image) return;
    
    try {
      // Create a canvas to apply CSS filters to the actual downloaded image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`;
          ctx.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = `nextflow-edit-${Date.now()}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        }
      };
      img.src = image;
    } catch (err) {
      // Fallback
      const a = document.createElement('a');
      a.href = image;
      a.download = `nextflow-edit-${Date.now()}.jpg`;
      a.click();
    }
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hue}deg)`
  };

  return (
    <div className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans">
      
      {/* MAIN WORKSPACE CANVAS */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-gradient-to-br from-[#0c0f18] to-[#040508] p-4 lg:p-8">
        
        {/* Top Controls Overlay */}
        {image && (
          <div className="absolute top-6 left-6 right-6 flex justify-between z-40 items-start pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button 
                onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0 })}
                className="p-2 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5" 
                title="Reset Filters"
              >
                <Undo2 className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5 pointer-events-auto text-[13px] font-medium tracking-wide">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        )}

        <input 
          ref={fileRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={e => {
            const f = e.target.files?.[0]; 
            if (f) handleFile(f); 
          }} 
        />

        {/* State 1: Empty Screen */}
        {!image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1b1e] border border-white/5 shadow-2xl rounded-3xl p-8 max-w-[440px] w-full text-center">
             
             <div className="flex justify-center mb-6 relative">
                <div className="w-24 h-32 rounded-xl -rotate-12 bg-zinc-800 border-2 border-[#1a1b1e] shadow-xl overflow-hidden translate-x-4">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-24 h-32 rounded-xl rotate-0 bg-zinc-800 border-2 border-[#1a1b1e] shadow-xl overflow-hidden z-10 -mt-4">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-32 rounded-xl rotate-12 bg-zinc-800 border-2 border-[#1a1b1e] shadow-xl overflow-hidden -translate-x-4">
                  <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=300&fit=crop" className="w-full h-full object-cover opacity-80" />
                </div>
             </div>

             <div className="flex items-center justify-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                 <MousePointer2 className="w-4 h-4" />
               </div>
               <h1 className="text-3xl font-bold tracking-tight text-white">Edit <span className="bg-blue-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-2 align-middle top-[-4px] relative">New</span></h1>
             </div>

             <p className="text-zinc-400 text-[14px] leading-relaxed mb-8 max-w-[320px] mx-auto">
               Rearrange objects in your scene, blend objects from multiple images, place characters, or expand edges.
             </p>

             <div className="flex items-center gap-3 w-full">
               <button onClick={() => fileRef.current?.click()} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium rounded-xl flex items-center justify-center gap-2 text-[14px]">
                 <Upload className="w-4 h-4" /> Upload image
               </button>
               <button onClick={() => fileRef.current?.click()} className="flex-1 py-3 bg-[#2a2c35] hover:bg-[#32343e] transition-colors text-zinc-300 font-medium rounded-xl flex items-center justify-center gap-2 text-[14px]">
                 <ImageIcon className="w-4 h-4" /> Select asset
               </button>
             </div>
          </motion.div>
        )}

        {/* State 2: Active Image / Generation */}
        {image && (
          <div className="w-full h-full flex items-center justify-center relative">
            <AnimatePresence>
              {generating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/50 rounded-2xl">
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                     <span className="text-[13px] font-medium tracking-widest uppercase text-white/80 animate-pulse">Editing</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <img 
              src={image} 
              alt="Workspace" 
              style={filterStyle}
              className={`w-auto h-auto max-w-[85%] max-h-[85%] object-contain rounded-2xl shadow-2xl transition-all duration-300 ${generating ? 'scale-95 blur-md opacity-60' : 'scale-100'}`} 
            />

            {/* Original Asset Mini Preview (Bottom Left) */}
            {originalImage && (
              <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
                <div className="w-[80px] h-[80px] rounded-xl border-2 border-white bg-black overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform" title="Original Image">
                  <img src={originalImage} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT EDITING TOOLKIT SIDEBAR */}
      {image && (
        <motion.div 
          initial={{ x: 320 }} 
          animate={{ x: 0 }} 
          className="w-[320px] bg-[#111111] border-l border-white/[0.05] flex flex-col h-full flex-shrink-0 relative z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        >
           <div className="flex flex-col gap-1 p-3 pb-24">
             
             {/* AI EDIT OPEN BY DEFAULT */}
             <div className="bg-transparent rounded-xl overflow-hidden mt-2 mb-1">
               <div className="flex items-center gap-2 px-3 pb-3 text-white font-medium text-[13px]">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Edit
               </div>
               <div className="px-3 pb-4 flex flex-col gap-3">
                  <div className="bg-[#1a1c23] rounded-xl border border-white/5 p-3 flex flex-col gap-3">
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe what you want to change in your image..."
                      className="w-full bg-transparent text-[13px] text-zinc-300 placeholder:text-zinc-600 outline-none resize-none min-h-[80px]"
                    />
                    <div className="flex">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2c35] hover:bg-[#32343e] transition-colors rounded-full text-[11px] font-medium text-zinc-300">
                        <ImageIcon className="w-3.5 h-3.5" /> Image reference
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <button onClick={() => setShowModels(!showModels)} className="w-full flex items-center justify-between px-3 py-2.5 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5 text-[12px] font-medium text-zinc-300">
                       <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-sm" /> {selectedModel.name}</span>
                       <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                    
                    <AnimatePresence>
                      {showModels && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#2a2c35] rounded-xl border border-white/5 shadow-xl overflow-hidden z-20">
                           {MODELS.map(m => (
                             <button key={m.id} onClick={() => { setSelectedModel(m); setShowModels(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-[12px] hover:bg-white/5 transition-colors ${selectedModel.id === m.id ? 'bg-white/5 text-white' : 'text-zinc-400'}`}>
                               <div className="flex flex-col">
                                 <span className="font-medium">{m.name}</span>
                                 <span className="text-[10px] opacity-60">{m.desc}</span>
                               </div>
                               {selectedModel.id === m.id && <Check className="w-4 h-4 text-purple-400" />}
                             </button>
                           ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={generating} // removed !prompt.trim() so it always works
                    className="w-full py-2.5 bg-[#e5e5e5] text-black font-semibold rounded-xl text-[13px] hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1 shadow-lg shadow-white/5"
                  >
                    <Sparkles className="w-4 h-4" /> Generate
                  </button>
               </div>
             </div>

             <div className="h-px w-full bg-white/5 my-1" />

             {/* ACCORDION MENU LIST WITH WORKING SETTINGS */}
             {ACCORDION_SECTIONS.map((section) => (
               <div key={section.id} className="w-full flex flex-col">
                 <button 
                   onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                   className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                 >
                   <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                     <section.icon className="w-4 h-4" />
                     <span className="text-[13px] font-medium">{section.label}</span>
                   </div>
                   <ChevronRight className={`w-4 h-4 text-zinc-600 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} />
                 </button>
                 
                 <AnimatePresence>
                   {expandedSection === section.id && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }} 
                       animate={{ opacity: 1, height: 'auto' }} 
                       exit={{ opacity: 0, height: 0 }}
                       className="overflow-hidden"
                     >
                       {/* IMAGE ADJUSTMENTS CONTENT */}
                       {section.id === 'adjustments' && (
                         <div className="px-4 py-4 flex flex-col gap-4 bg-[#1a1c23]/50 rounded-xl mx-2 mb-2">
                           {[
                             { label: 'Brightness', state: filters.brightness, update: (v: number) => setFilters({...filters, brightness: v}), min: 0, max: 200, unit: '%' },
                             { label: 'Contrast', state: filters.contrast, update: (v: number) => setFilters({...filters, contrast: v}), min: 0, max: 200, unit: '%' },
                             { label: 'Saturation', state: filters.saturation, update: (v: number) => setFilters({...filters, saturation: v}), min: 0, max: 200, unit: '%' },
                             { label: 'Hue Rotate', state: filters.hue, update: (v: number) => setFilters({...filters, hue: v}), min: 0, max: 360, unit: '°' },
                             { label: 'Blur', state: filters.blur, update: (v: number) => setFilters({...filters, blur: v}), min: 0, max: 20, unit: 'px' },
                           ].map(slider => (
                             <div key={slider.label} className="w-full">
                               <div className="flex justify-between text-[11px] text-zinc-400 mb-1.5 font-medium">
                                 <span>{slider.label}</span>
                                 <span>{slider.state}{slider.unit}</span>
                               </div>
                               <input 
                                 type="range" 
                                 min={slider.min} 
                                 max={slider.max} 
                                 value={slider.state}
                                 onChange={e => slider.update(Number(e.target.value))}
                                 className="w-full h-1 bg-zinc-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                               />
                             </div>
                           ))}
                         </div>
                       )}

                       {/* CHANGE LIGHTING CONTENT */}
                       {section.id === 'lighting' && (
                         <div className="px-4 py-4 grid grid-cols-2 gap-2 bg-[#1a1c23]/50 rounded-xl mx-2 mb-2">
                            {LIGHTING_PRESETS.map((preset) => (
                              <button 
                                key={preset.name}
                                onClick={() => {
                                  setPrompt(`Relight the scene with gorgeous ${preset.name.toLowerCase()} lighting`);
                                  handleGenerate();
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors gap-2 text-zinc-400 hover:text-zinc-200"
                              >
                                <div className={`w-8 h-8 rounded-full ${preset.bg} border-2 border-white/10`} />
                                <span className="text-[11px] font-medium">{preset.name}</span>
                              </button>
                            ))}
                         </div>
                       )}

                       {/* FALLBACK FOR OTHERS */}
                       {section.id !== 'adjustments' && section.id !== 'lighting' && (
                         <div className="px-5 py-4 text-[12px] text-zinc-500 text-center italic bg-[#1a1c23]/50 rounded-xl mx-2 mb-2">
                           Settings for {section.label}
                         </div>
                       )}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}

          </div>
        </motion.div>
      )}

    </div>
  );
}
