'use client';

import { useState, useRef } from 'react';
import { Upload, Sparkles, X, Clapperboard, MonitorPlay, Film, ArrowRight, UserRound, ArrowDownToLine, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';

export default function MotionTransferPage() {
  const [sourceFile, setSourceFile] = useState<string | null>(null);
  const [refFile, setRefFile] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'image' | 'video' | null>(null);
  const [generating, setGenerating] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square'>('landscape');
  
  const srcInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleSourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) setSourceType('image');
      else if (file.type.startsWith('video/')) setSourceType('video');
      else return; // unhandled type

      setSourceFile(URL.createObjectURL(file));
      // Reset result on new input
      setResultVideo(null);
    }
  };

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setRefFile(URL.createObjectURL(file));
      setResultVideo(null);
    }
  };

  const handleGenerate = async () => {
    if (!sourceFile || !refFile) return;
    setGenerating(true);
    
    try {
      // We send a mock request to our Next.js API
      const response = await fetch('/api/motion/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceFile: 'blob-url-mock',
          refFile: 'blob-url-mock',
          fps: 24,
          tracking: true
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResultVideo(data.videoUrl);
        toast.success('Motion transfer complete');
      } else {
        toast.error('Generation failed');
      }
    } catch(err) {
      console.error(err);
      toast.error('Error occurred during generation');
    } finally {
      setGenerating(false);
    }
  };

  // Krea-inspired UI container class
  const cardBaseStyle = "relative overflow-hidden bg-[#18181b]/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] transition-all group flex flex-col items-center justify-center cursor-pointer";

  return (
    <div className="w-full h-full min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none" />

      {/* Header section */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Model</span>
          <span className="text-white bg-white/5 px-2 py-1 rounded-md border border-white/10 shadow-sm pointer-events-auto cursor-pointer hover:bg-white/10 transition">
            NextFlow Motion Control v1 
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
            <UserRound className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">NextFlow Transfer</h1>
        </motion.div>

        {/* Central Workspace Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111113]/80 backdrop-blur-2xl border border-white/[0.05] p-6 rounded-[2rem] flex flex-col lg:flex-row items-center gap-4 lg:gap-6 shadow-2xl relative"
        >
          {/* Main Content Area OR Result */}
          <AnimatePresence mode="wait">
            {!resultVideo ? (
               <motion.div 
                 key="inputs"
                 initial={{ opacity: 0, filter: "blur(10px)" }}
                 animate={{ opacity: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                 className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6"
               >
                 {/* Input 1: Character (Square) */}
                  <div className="flex flex-col gap-2">
                    <div 
                      className={`${cardBaseStyle} w-64 h-64 rounded-3xl`}
                    >
                      <input 
                        ref={srcInputRef} 
                        type="file" 
                        accept="image/*,video/*" 
                        className="hidden" 
                        onChange={handleSourceUpload} 
                      />
                      
                      {sourceFile ? (
                        <div className="absolute inset-0 group">
                           {sourceType === 'image' ? (
                             <img src={sourceFile} alt="Source" className="w-full h-full object-cover rounded-3xl" />
                           ) : (
                             <video src={sourceFile} autoPlay loop muted className="w-full h-full object-cover rounded-3xl" />
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                             <button onClick={() => srcInputRef.current?.click()} className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition shadow">Replace</button>
                             <button onClick={(e) => { e.stopPropagation(); setSourceFile(null); }} className="w-8 h-8 flex items-center justify-center bg-red-500/80 rounded-full hover:bg-red-500 transition shadow">
                               <X className="w-4 h-4 text-white" />
                             </button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center gap-4">
                          <UserRound className="w-8 h-8 text-zinc-500 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-zinc-400 font-medium text-sm">Add character</p>
                          <div className="flex flex-col w-full gap-2 mt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                             <button 
                               onClick={() => srcInputRef.current?.click()} 
                               className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 rounded-xl text-sm font-semibold transition"
                             >
                               Upload file
                             </button>
                             <button className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 py-2.5 rounded-xl text-sm font-semibold transition border border-white/5">
                               Select asset
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plus Separator */}
                  <div className="text-zinc-500 flex-shrink-0">
                    <span className="text-2xl font-light">+</span>
                  </div>

                  {/* Input 2: Expression & Motion (Rectangle) */}
                  <div className="flex flex-col gap-2">
                    <div 
                      className={`${cardBaseStyle} w-80 lg:w-[480px] h-64 rounded-3xl`}
                    >
                      <input 
                        ref={refInputRef} 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={handleRefUpload} 
                      />

                      {refFile ? (
                        <div className="absolute inset-0 group">
                           <video src={refFile} autoPlay loop muted className="w-full h-full object-cover rounded-3xl" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                             <button onClick={() => refInputRef.current?.click()} className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition shadow">Replace</button>
                             <button onClick={(e) => { e.stopPropagation(); setRefFile(null); }} className="w-8 h-8 flex items-center justify-center bg-red-500/80 rounded-full hover:bg-red-500 transition shadow">
                               <X className="w-4 h-4 text-white" />
                             </button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center gap-4">
                          <Film className="w-8 h-8 text-zinc-500 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-zinc-400 font-medium text-sm">Add expression & motion</p>
                          <div className="flex gap-2 mt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                             <button 
                               onClick={() => refInputRef.current?.click()} 
                               className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition border border-white/5 flex items-center gap-2"
                             >
                                <Upload className="w-4 h-4" /> Upload
                             </button>
                             <button className="bg-white/5 hover:bg-white/10 text-zinc-300 px-5 py-2.5 rounded-xl text-sm font-medium transition border border-white/5 flex items-center gap-2">
                                <MonitorPlay className="w-4 h-4" /> Record
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
               </motion.div>
            ) : (
                <motion.div 
                 key="result"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center w-full max-w-4xl pt-4 pb-0 px-2"
               >
                 <div className="relative w-full max-w-[800px] aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-6 group">
                   {/* We display the mocked video directly */}
                   <video 
                     src={resultVideo} 
                     autoPlay 
                     loop 
                     playsInline
                     controls
                     className="w-full h-full object-contain bg-[#0a0a0a]" 
                   />
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setResultVideo(null)} className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs font-semibold hover:bg-black/80 transition flex items-center gap-2 border border-white/20">
                         Create New
                      </button>
                   </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Right Action Stack */}
          {!resultVideo && (
            <div className="flex flex-row lg:flex-col gap-3 lg:ml-4 w-full lg:w-auto mt-4 lg:mt-0">
              <button 
                onClick={() => {
                   const opts: ('landscape' | 'portrait' | 'square')[] = ['landscape', 'portrait', 'square'];
                   setOrientation(opts[(opts.indexOf(orientation) + 1) % 3]);
                }}
                className="flex-1 lg:flex-none border border-white/10 bg-[#18181b]/80 hover:bg-[#27272a]/80 backdrop-blur-md text-zinc-300 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition"
              >
                <MonitorPlay className="w-4 h-4" />
                <span className="capitalize">{orientation}</span>
              </button>

              <button 
                onClick={handleGenerate}
                disabled={!sourceFile || !refFile || generating}
                className="flex-1 lg:flex-none bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-white/20 disabled:shadow-none"
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

        {/* Tip section pointing out step order */}
        {!resultVideo && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-6 text-zinc-500 text-sm font-medium flex items-center gap-2"
           >
             {!sourceFile ? "Step 1: Add a character to begin" : !refFile ? "Step 2: Add expression & motion reference" : "Ready: Click generate to animate"}
           </motion.div>
        )}

      </div>
      
    </div>
  );
}
