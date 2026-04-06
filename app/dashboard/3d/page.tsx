'use client';

import { useState, useRef } from 'react';
import { Upload, Box, Image as ImageIcon, Sparkles, ArrowRight, X, Type, FileImage, Download, RotateCcw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ThreeDPage() {
  const [mode, setMode] = useState<'image' | 'text'>('image');
  const [isMeshOnly, setIsMeshOnly] = useState(false);
  
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string; format: string; style: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(URL.createObjectURL(file));
      setResult(null); // Reset result on new input
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
  };

  const handleGenerate = async () => {
    if (mode === 'image' && !imageFile) return;
    if (mode === 'text' && !prompt.trim()) return;

    setGenerating(true);
    
    try {
      const response = await fetch('/api/3d/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          input: mode === 'image' ? 'blob-url' : prompt,
          isMeshOnly
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult({ url: data.modelUrl, format: data.format, style: data.meshStyle });
        toast.success('3D object generated');
      } else {
        toast.error("Generation failed: " + data.error);
      }
    } catch(err) {
      console.error(err);
      toast.error("Error occurred during generation");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImageFile(null);
    setPrompt('');
  };

  return (
    <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-black to-black pointer-events-none" />

      {/* Header section */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Model</span>
          <span className="text-white bg-white/5 px-2 py-1 rounded-md border border-white/10 shadow-sm pointer-events-auto cursor-pointer hover:bg-white/10 transition">
            NextFlow-3D-2.1
          </span>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 p-6">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md">
            <Box className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">NextFlow 3D Objects</h1>
        </motion.div>

        {/* Krea-style unified workspace card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111113]/80 backdrop-blur-2xl border border-white/[0.05] p-3 md:p-5 rounded-[2rem] shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col"
        >
          
          <AnimatePresence mode="wait">
            {!result ? (
               <motion.div 
                 key="inputs"
                 initial={{ opacity: 0, filter: "blur(10px)" }}
                 animate={{ opacity: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                 className="flex flex-col gap-6"
               >
                  {/* Tutorial/Hero Callout (Visible mainly when no input yet) */}
                  {mode === 'image' && !imageFile && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="w-full bg-[#18181b]/50 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center text-center gap-6"
                    >
                      <div className="flex items-center gap-6 saturate-0 opacity-50">
                        <div className="w-24 h-24 bg-white/10 rounded-2xl transform -rotate-6 border border-white/20 flex items-center justify-center shadow-lg">
                           <ImageIcon className="w-8 h-8 text-zinc-400" />
                        </div>
                        <ArrowRight className="w-6 h-6 text-zinc-500" />
                        <div className="w-24 h-24 bg-white/20 rounded-2xl transform rotate-6 border border-white/20 flex items-center justify-center shadow-lg">
                           <Box className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-300 text-sm max-w-xs mx-auto">Upload an image, photo, or generated asset and convert it into 3D.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition shadow text-sm">
                           <Upload className="w-4 h-4" /> Upload image
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition text-sm">
                           <ImageIcon className="w-4 h-4" /> Select asset
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Input Block + Result Block Array */}
                  <div className="flex flex-col md:flex-row items-center gap-4 justify-center w-full min-h-[220px]">
                     
                     {/* Dynamic Input Zone */}
                     <div className="relative w-full max-w-[340px] h-[220px] bg-[#18181b]/80 border border-dashed border-white/20 hover:border-white/30 transition-colors rounded-3xl overflow-hidden group">
                       {mode === 'image' ? (
                          <>
                             <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                             {imageFile ? (
                                <div className="absolute inset-0">
                                   <img src={imageFile} alt="Target" className="w-full h-full object-cover" />
                                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                      <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition">Change</button>
                                      <button onClick={clearImage} className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                                          <X className="w-4 h-4" />
                                      </button>
                                   </div>
                                </div>
                             ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center gap-3 group-hover:bg-white/5 transition">
                                   <ImageIcon className="w-8 h-8 text-blue-500/80 group-hover:scale-110 transition-transform" />
                                   <span className="text-zinc-400 text-sm font-medium">Add image</span>
                                </button>
                             )}
                          </>
                       ) : (
                          <div className="w-full h-full p-4 flex flex-col bg-transparent">
                             <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your 3D idea..."
                                className="w-full h-full bg-transparent resize-none outline-none text-sm text-zinc-200 placeholder:text-zinc-600"
                             />
                          </div>
                       )}
                     </div>

                     <ArrowRight className="w-5 h-5 text-zinc-600 flex-shrink-0 rotate-90 md:rotate-0 my-2 md:my-0" />

                     {/* Result Preview Box (Disabled state until generated) */}
                     <div className="relative w-full max-w-[340px] h-[220px] bg-[#18181b]/50 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 text-zinc-600">
                         <Box className="w-8 h-8" />
                         <span className="text-sm font-medium">3D</span>
                         {mode === 'image' && imageFile && !generating && <span className="absolute bottom-4 text-xs text-green-400/80 tracking-wide font-medium">Ready</span>}
                         {mode === 'text' && prompt && !generating && <span className="absolute bottom-4 text-xs text-green-400/80 tracking-wide font-medium">Ready</span>}
                         {generating && <Loader2 className="absolute bottom-4 w-5 h-5 text-sky-400 animate-spin" />}
                     </div>

                  </div>

               </motion.div>
            ) : (
               <motion.div 
                 key="resultViewer"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center justify-center w-full min-h-[400px] p-4 group"
               >
                   <div className="relative w-full max-w-[800px] aspect-video bg-[#0d0d0f] rounded-3xl border border-sky-500/20 flex flex-col items-center justify-center gap-6 overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                     <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                        <Box className="w-10 h-10 text-sky-400" />
                     </div>
                     <div className="text-center z-10">
                       <h2 className="text-xl font-bold text-white mb-2 py-1">NextFlow 3D Mesh Generated</h2>
                       <div className="flex gap-3 justify-center text-xs text-zinc-400">
                         <span className="px-2.5 py-1 bg-white/5 rounded-md border border-white/10">{result.format} format</span>
                         <span className="px-2.5 py-1 bg-white/5 rounded-md border border-white/10">{result.style} Model</span>
                       </div>
                     </div>
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button onClick={handleReset} className="bg-black/60 hover:bg-black text-zinc-300 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-medium transition">
                           <RotateCcw className="w-3.5 h-3.5" /> Create New
                        </button>
                        <button className="bg-white text-black hover:bg-zinc-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold transition shadow-lg">
                           <Download className="w-3.5 h-3.5" /> Download
                        </button>
                     </div>
                   </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Toolbar */}
          {!result && (
             <div className="w-full flex items-center justify-between bg-[#0d0d0f]/60 mt-6 p-2 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1 bg-[#18181b]/80 p-1 rounded-xl">
                   <button 
                     onClick={() => setMode('image')} 
                     className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${mode === 'image' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                      <ImageIcon className="w-3.5 h-3.5" /> Image to 3D
                   </button>
                   <button 
                     onClick={() => setMode('text')} 
                     className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${mode === 'text' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                      <Type className="w-3.5 h-3.5" /> Text to 3D
                   </button>
                   <div className="w-px h-4 bg-white/10 mx-1" />
                   <button 
                     onClick={() => setIsMeshOnly(!isMeshOnly)} 
                     className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${isMeshOnly ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                      <Box className="w-3.5 h-3.5" /> Mesh only
                   </button>
                </div>
                
                <button 
                  onClick={handleGenerate}
                  disabled={generating || (mode === 'image' ? !imageFile : !prompt.trim())}
                  className="bg-zinc-100 text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-zinc-100 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
             </div>
          )}

        </motion.div>

      </div>
    </div>
  );
}
