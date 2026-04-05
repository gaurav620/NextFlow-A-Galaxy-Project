'use client';

import { useState, useRef } from 'react';
import { Upload, Wand2, Sparkles, ArrowRight, Video, X, Link, Check, RotateCcw, Download, Search, Film, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PREDEFINED_STYLES = [
  { id: 'anime', name: 'Anime Aesthetic' },
  { id: '3d', name: '3D Render' },
  { id: 'oil', name: 'Oil Painting' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'claymation', name: 'Claymation' }
];

export default function VideoRestylePage() {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string, meta: any } | null>(null);
  
  const [activeModel, setActiveModel] = useState('Krea');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
        setVideoFile(URL.createObjectURL(file));
        setResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setVideoFile(URL.createObjectURL(file));
        setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!videoFile || !prompt.trim()) return;

    setGenerating(true);
    
    try {
      const response = await fetch('/api/video-restyle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: 'blob-url', 
          prompt,
          style: activeStyle
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult({ url: data.resultUrl, meta: data.meta });
      } else {
        alert("Generation failed: " + data.error);
      }
    } catch(err) {
      console.error(err);
      alert("Error occurred during generation");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setVideoFile(null);
    setPrompt('');
    setActiveStyle(null);
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#070707] flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#070707] to-transparent pointer-events-none" />

      {/* Header section (Model Dropdown) */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-40 pointer-events-none">
        <div className="relative flex items-center gap-2 text-[15px] text-zinc-400">
          <span>Model</span>
          <button 
             onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
             className="text-zinc-200 hover:text-white bg-transparent outline-none border-none py-1 pointer-events-auto cursor-pointer transition flex items-center gap-1 font-medium"
          >
            {activeModel} <ChevronDownIcon className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
             {isModelDropdownOpen && (
                <motion.div 
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -5 }}
                   className="absolute top-full left-10 mt-2 min-w-[200px] bg-[#1a1a1c] border border-white/5 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto z-50 flex flex-col p-1.5"
                >
                   {['Krea', 'Luma', 'Runway Aleph'].map((model) => (
                      <button 
                         key={model}
                         onClick={() => { setActiveModel(model); setIsModelDropdownOpen(false); }}
                         className={`w-full text-left px-3 py-2.5 text-[13px] font-medium rounded-[12px] transition-colors ${activeModel === model ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                      >
                         {model}
                      </button>
                   ))}
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-[900px] mx-auto flex flex-col items-center z-10 p-6 pt-20">
        
        {/* Title Badge Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#ff5555] flex items-center justify-center shadow-lg shadow-red-500/20">
            <Video className="w-6 h-6 text-white ml-0.5" />
          </div>
          <h1 className="text-[44px] font-bold tracking-tight text-white leading-none">Video Restyle</h1>
        </motion.div>

        {/* Central Workspace Card */}
        <AnimatePresence mode="wait">
        {!result ? (
            <motion.div 
                key="workspace"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                className="w-full flex flex-col items-center relative"
            >
                {/* Welcome Empty State Card */}
                {!videoFile && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#18181b] rounded-[32px] p-8 w-[460px] flex flex-col items-center justify-center relative shadow-2xl mb-12 border border-white/5"
                    >
                        {/* Fake Tilted Cards */}
                        <div className="flex items-center justify-center gap-4 mb-6 relative w-full h-[140px]">
                            <div className="w-[110px] h-[130px] bg-zinc-800 rounded-xl -rotate-12 border-[4px] border-white/10 overflow-hidden absolute left-14 shadow-2xl flex items-center justify-center">
                                {/* Simulated image input */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900"/>
                                <Video className="w-6 h-6 text-white/20"/>
                            </div>
                            
                            <ArrowRight className="w-5 h-5 text-zinc-500 z-10 absolute left-1/2 -translate-x-1/2" />
                            
                            <div className="w-[110px] h-[130px] bg-zinc-800 rounded-xl rotate-12 border-[4px] border-white/10 overflow-hidden absolute right-14 shadow-2xl flex items-center justify-center">
                                {/* Simulated output style */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-700/40 via-red-500/30 to-purple-600/20 mix-blend-overlay"/>
                                <Sparkles className="w-6 h-6 text-white/40"/>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-[15px] text-center max-w-[320px] mb-8 leading-snug">
                            Upload a video to change its style or extract pose, motion, or depth.
                        </p>

                        <div className="flex gap-3 w-full justify-center">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#0055ff] hover:bg-[#0044ee] text-white px-7 py-3 rounded-2xl text-[15px] font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" /> Upload video
                            </button>
                            <button 
                                className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-2xl text-[15px] font-medium flex items-center gap-2 transition-colors border border-white/5"
                            >
                                <Film className="w-4 h-4" /> Select asset
                            </button>
                        </div>
                        
                        <p className="text-zinc-600 text-[11px] mt-4 font-medium tracking-wide">
                            Video must be 512px or larger
                        </p>
                    </motion.div>
                )}

                <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileChange} className="hidden" />

                {/* The Floating Dock */}
                <div className={`flex items-center justify-center gap-4 w-full max-w-[800px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${videoFile ? '-mt-24' : ''}`}>
                    
                    {/* Left: Video Input Target (Dashed) */}
                    <div 
                        onClick={() => !videoFile && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`w-[180px] h-[160px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all group
                                 ${videoFile ? 'border-transparent bg-black/50 border-white/5' : isDragging ? 'border-[#0055ff] bg-[#0055ff]/10' : 'border-[#0055ff]/80 bg-[#0055ff]/[0.02] hover:bg-[#0055ff]/[0.05]'}`}
                    >
                        {!videoFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#0055ff] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                                    <Plus className="w-4 h-4 text-white stroke-[3]" />
                                </div>
                                <span className="text-[#0055ff] text-sm font-semibold">Add Video</span>
                            </div>
                        ) : (
                            <div className="w-full h-full relative group bg-black/60 pt-2 pb-2 pl-2 pr-2">
                                <div className="w-full h-full rounded-[24px] bg-zinc-900 relative overflow-hidden flex items-center justify-center border border-white/10">
                                    <Film className="w-10 h-10 text-zinc-700" />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <button onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} className="bg-red-500/90 text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded-full border border-white/10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                                        <span className="text-[10px] font-medium text-white">Ready</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle Dash -> */}
                    <div className="flex items-center justify-center opacity-50 px-1">
                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </div>

                    {/* Right Block Wrapper */}
                    <div className="flex-1 bg-[#18181b]/90 backdrop-blur-3xl rounded-[36px] p-2 pr-2 flex items-stretch gap-2 h-[160px] border border-white/5 shadow-2xl relative">
                        
                        {/* Textarea Area */}
                        <div className="flex-1 relative bg-transparent rounded-[28px] overflow-hidden ml-2">
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your video and the visual style you want to apply to it..."
                                className="w-full h-full bg-transparent resize-none outline-none text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 px-3 pt-5 pb-14"
                            />
                            
                            {/* Inner Style Pill */}
                            <div className="absolute bottom-4 left-3">
                                <button 
                                    onClick={() => setIsStyleModalOpen(true)}
                                    className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 px-4 py-2 rounded-full flex items-center gap-2 text-[13px] font-medium text-zinc-300 transition-all shadow-sm"
                                >
                                    <Link className="w-3.5 h-3.5 opacity-50" /> 
                                    {activeStyle ? PREDEFINED_STYLES.find(s => s.id === activeStyle)?.name : '+ Style'}
                                </button>
                            </div>
                        </div>

                        {/* Generate Button Area */}
                        <div className="w-[140px] p-1 flex items-center">
                            <button 
                                onClick={handleGenerate}
                                disabled={generating || !videoFile || !prompt.trim()}
                                className="w-full h-full bg-white/5 rounded-[28px] flex flex-col items-center justify-center gap-2 transition-all border border-transparent disabled:opacity-40 disabled:cursor-not-allowed
                                         data-[active=true]:bg-zinc-800 data-[active=true]:border-white/10 data-[active=true]:hover:bg-zinc-700 data-[active=true]:hover:text-white text-zinc-400 group"
                                data-active={videoFile && prompt.trim() && !generating}
                            >
                                {generating ? (
                                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                                      <Wand2 className="w-5 h-5 text-white" />
                                   </motion.div>
                                ) : (
                                   <Sparkles className="w-5 h-5 transition-colors group-data-[active=true]:text-white" />
                                )}
                                <span className={`text-[13px] font-semibold tracking-wide ${generating ? 'text-white animate-pulse' : 'group-data-[active=true]:text-white'}`}>
                                    {generating ? 'Processing' : 'Generate'}
                                </span>
                            </button>
                        </div>
                    </div>

                </div>

            </motion.div>
        ) : (
            <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center mt-4"
            >
                <div className="relative w-full max-w-[800px] aspect-video bg-[#0d0d0d] rounded-[32px] border border-white/10 flex flex-col items-center justify-center gap-6 overflow-hidden shadow-2xl shadow-indigo-900/10 group">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 to-transparent pointer-events-none" />
                    
                    <div className="w-20 h-20 rounded-[24px] bg-[#ff5555]/10 border border-[#ff5555]/20 flex items-center justify-center z-10 shadow-lg">
                        <Video className="w-10 h-10 text-[#ff5555]" />
                    </div>
                    
                    <div className="text-center z-10 px-8">
                        <h2 className="text-[28px] font-semibold text-white tracking-tight mb-3">Restyle Completed</h2>
                        <p className="text-[15px] text-zinc-400 mb-6 max-w-lg mx-auto leading-relaxed">"{result.meta.promptUsed}"</p>
                        <div className="flex justify-center flex-wrap gap-2">
                             <span className="text-[13px] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-zinc-300 font-medium tracking-wide">
                                Style: {result.meta.styleApplied}
                             </span>
                        </div>
                    </div>

                    {/* Result Controls (Top Right Hover) */}
                    <div className="absolute top-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button onClick={handleReset} className="bg-black/60 hover:bg-black/80 text-white px-5 py-2.5 rounded-[14px] text-[13px] font-medium border border-white/10 flex items-center gap-2 backdrop-blur-md transition shadow-lg">
                            <RotateCcw className="w-4 h-4" /> Start Over
                        </button>
                        <button className="bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-[14px] text-[13px] font-bold flex items-center gap-2 transition shadow-xl">
                            <Download className="w-4 h-4" /> Download
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Style Selection Modal */}
        <AnimatePresence>
            {isStyleModalOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsStyleModalOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.98 }} 
                        className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[420px] bg-[#18181b] border border-white/10 p-6 rounded-[32px] shadow-2xl flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[17px] font-semibold text-white tracking-tight">Select a Style</h3>
                            <button onClick={() => setIsStyleModalOpen(false)} className="text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="relative mb-2">
                             <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                             <input type="text" placeholder="Search styles..." className="w-full bg-[#070707] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-[14px] text-zinc-200 outline-none focus:border-white/20 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {PREDEFINED_STYLES.map(style => (
                                <button 
                                    key={style.id}
                                    onClick={() => {
                                        setActiveStyle(style.id === activeStyle ? null : style.id);
                                        setIsStyleModalOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-3.5 rounded-[20px] transition-all border ${
                                        activeStyle === style.id 
                                            ? 'bg-zinc-800 border-zinc-600' 
                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center border border-white/10 bg-black/20`}>
                                            <Sparkles className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <span className={`text-[14px] font-medium ${activeStyle === style.id ? 'text-white' : 'text-zinc-300'}`}>
                                            {style.name}
                                        </span>
                                    </div>
                                    {activeStyle === style.id && <Check className="w-5 h-5 text-white" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
