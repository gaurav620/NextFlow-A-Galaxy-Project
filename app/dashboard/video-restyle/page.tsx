'use client';

import { useState, useRef } from 'react';
import { Upload, Wand2, Sparkles, ArrowRight, Video, X, Link, Check, RotateCcw, Download, Search, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PREDEFINED_STYLES = [
  { id: 'anime', name: 'Anime Aesthetic', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: '3d', name: '3D Render', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'oil', name: 'Oil Painting', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' },
  { id: 'claymation', name: 'Claymation', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }
];

export default function VideoRestylePage() {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [prompt, setPrompt] = useState('');
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ url: string, meta: any } | null>(null);
  
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
    <div className="w-full h-full min-h-screen bg-[#070708] flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-x-0 bottom-0 top-32 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#070708] to-[#070708] pointer-events-none" />

      {/* Header section (Model Dropdown) */}
      <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Model</span>
          <span className="text-zinc-200 hover:text-white bg-transparent outline-none border-none py-1 pointer-events-auto cursor-pointer transition flex items-center gap-1 font-medium">
            NextFlow-Video-Gen <ChevronDownIcon className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 p-6">
        
        {/* Title Badge Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
            <Video className="w-4 h-4 text-red-400" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Video Restyle</h1>
        </motion.div>

        {/* Central Workspace Card */}
        <AnimatePresence mode="wait">
        {!result ? (
            <motion.div 
                key="workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                className="bg-[#18181b]/60 backdrop-blur-3xl border border-white/5 p-4 rounded-3xl shadow-2xl w-full max-w-4xl relative flex flex-col md:flex-row items-stretch gap-4"
            >
                {/* Step 1: Video Input */}
                <div 
                    className="flex-shrink-0 relative w-full md:w-[260px] h-[220px] rounded-[1.25rem] group transition-all"
                >
                    <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileChange} className="hidden" />
                    
                    {!videoFile ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`w-full h-full border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-500/40 hover:border-indigo-500/60 hover:bg-white/[0.02]'} rounded-[1.25rem] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors relative overflow-hidden`}
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-400 transition-colors">
                                <span className="text-xl leading-none text-white font-light">+</span>
                            </div>
                            <span className="text-indigo-400 text-sm font-medium">Add Video</span>
                            <div className="absolute -bottom-8 group-hover:bottom-2 transition-all bg-black/80 px-3 py-1 rounded-full border border-white/10">
                                <p className="text-[10px] text-zinc-400">Step 1: Add video</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full relative rounded-[1.25rem] overflow-hidden border border-white/10 group bg-black/50">
                            {/* Mock video displaying just the thumbnail icon for visual */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Film className="w-16 h-16 text-zinc-700/50" />
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <span className="bg-green-500 leading-none w-2 h-2 rounded-full animate-pulse" />
                                <span className="text-xs font-semibold">Video Ready</span>
                            </div>
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                <button onClick={() => fileInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur transition">Change</button>
                                <button onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} className="bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Arrow Connector */}
                <div className="hidden md:flex flex-col items-center justify-center text-zinc-600 px-1">
                    <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 2: Prompt & Style */}
                <div className="flex-grow bg-[#111113] rounded-[1.25rem] border border-transparent focus-within:border-white/10 transition-colors p-4 flex flex-col relative min-h-[220px]">
                    <textarea 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your video and the visual style you want to apply to it..."
                        className="w-full h-full bg-transparent resize-none outline-none text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 flex-grow pb-12"
                    />

                    {/* Style Button Bubble */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button 
                            onClick={() => setIsStyleModalOpen(true)}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-1.5 rounded-[1rem] flex items-center gap-2 text-xs font-medium text-zinc-300 transition-all backdrop-blur-sm"
                        >
                            <Link className="w-3.5 h-3.5 text-zinc-500" /> 
                            {activeStyle ? PREDEFINED_STYLES.find(s => s.id === activeStyle)?.name : 'Style'}
                        </button>
                    </div>
                </div>

                {/* Arrow Connector (Optional) */}
                <div className="hidden md:flex flex-col items-center justify-center text-zinc-600 px-1">
                    <ArrowRight className="w-5 h-5" />
                </div>

                {/* Step 3: Action */}
                <div className="flex-shrink-0 w-full md:w-[140px] flex md:flex-col items-center justify-center bg-[#111113] rounded-[1.25rem] p-4 relative overflow-hidden group border border-transparent transition-colors hover:border-white/5">
                    {/* Glowing effect inside button area */}
                    <div className={`absolute inset-0 bg-pink-500/10 opacity-0 transition-opacity ${videoFile && prompt ? 'group-hover:opacity-100' : ''}`} />
                    
                    <button 
                        onClick={handleGenerate}
                        disabled={generating || !videoFile || !prompt.trim()}
                        className="w-full bg-zinc-800 text-zinc-400 disabled:opacity-50 flex items-center justify-center gap-2 px-0 py-4 md:py-6 rounded-2xl text-sm font-semibold transition-all relative z-10 
                                 data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:shadow-[0_0_20px_rgba(255,255,255,0.3)] data-[active=true]:hover:bg-zinc-200"
                        data-active={videoFile && prompt.trim() && !generating}
                    >
                        {generating ? (
                           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                              <Wand2 className="w-4 h-4" />
                           </motion.div>
                        ) : (
                           <Sparkles className="w-4 h-4" />
                        )}
                        {generating ? 'Generating' : 'Generate'}
                    </button>
                    
                    {generating && (
                        <div className="absolute bottom-2 inset-x-0 mx-auto text-center">
                            <span className="text-[10px] text-zinc-500 animate-pulse">Processing video...</span>
                        </div>
                    )}
                </div>

            </motion.div>
        ) : (
            <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex justify-center"
            >
                <div className="relative w-full max-w-[800px] aspect-video bg-black rounded-[2rem] border border-white/10 flex flex-col items-center justify-center gap-4 overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-black pointer-events-none" />
                    
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2 z-10 shadow-lg shadow-indigo-500/20">
                        <Video className="w-8 h-8 text-indigo-400" />
                    </div>
                    
                    <div className="text-center z-10 px-6">
                        <h2 className="text-xl font-bold text-white mb-2">Restyle Completed</h2>
                        <p className="text-sm text-zinc-400 mb-4 max-w-sm mx-auto italic">"{result.meta.promptUsed}"</p>
                        <div className="flex justify-center flex-wrap gap-2">
                             <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300">Style: {result.meta.styleApplied}</span>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button onClick={handleReset} className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-2 backdrop-blur transition shadow-lg">
                            <RotateCcw className="w-3.5 h-3.5" /> Start Over
                        </button>
                        <button className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xl">
                            <Download className="w-3.5 h-3.5" /> Download output
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
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 20, scale: 0.95 }} 
                        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#18181b] border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Select a Style</h3>
                            <button onClick={() => setIsStyleModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative mb-2">
                             <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                             <input type="text" placeholder="Search styles..." className="w-full bg-[#0d0d0f] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-200 outline-none focus:border-white/20 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {PREDEFINED_STYLES.map(style => (
                                <button 
                                    key={style.id}
                                    onClick={() => {
                                        setActiveStyle(style.id === activeStyle ? null : style.id);
                                        setIsStyleModalOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        activeStyle === style.id 
                                            ? 'bg-zinc-800 border-zinc-600' 
                                            : 'bg-transparent border-transparent hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${style.color}`}>
                                            <Wand2 className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-medium ${activeStyle === style.id ? 'text-white' : 'text-zinc-300'}`}>
                                            {style.name}
                                        </span>
                                    </div>
                                    {activeStyle === style.id && <Check className="w-4 h-4 text-white" />}
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
