'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Play, Download, X, AlertCircle, RotateCcw, Pause, CheckCircle2, Circle, Settings2, Plus, Zap, Activity, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const models = [
  { id: 'kling26', name: 'Kling 2.6', icon: '🎬', desc: 'Flagship video model with advanced physics and motion.', features: ['Start', 'End', 'References'], speed: 3, quality: 3, credits: 300 },
  { id: 'ltx2', name: 'LTX-2', icon: '🚀', desc: 'Cheapest medium-quality open-source model.', features: ['Start'], speed: 5, quality: 2, credits: 150 },
  { id: 'kling30', name: 'Kling 3.0', icon: '💎', desc: 'Next-generation video with native 1080p resolution.', features: ['Start', 'End'], speed: 4, quality: 4, credits: 800 },
  { id: 'klingo3', name: 'Kling o3', icon: '✨', desc: 'Cinematic generation model with fluid motions.', features: ['Start', 'End', 'Audio'], speed: 3, quality: 5, credits: 1000 },
];

const durations = ['5s', '10s', '15s'];
const aspectRatios = ['16:9', '9:16', '1:1', '4:3'];

interface VideoResult {
  url: string;
  prompt: string;
  enhancedPrompt: string;
  model: string;
  duration: string;
  aspectRatio: string;
}

export default function VideoPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [duration, setDuration] = useState('5s');
  const [aspect, setAspect] = useState('16:9');
  const [motion, setMotion] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [imageRefBase64, setImageRefBase64] = useState<string | null>(null);
  const [imageRefMime, setImageRefMime] = useState<string>('image/jpeg');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState('');
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) loadImageRef(file);
  };

  const loadImageRef = (file: File) => {
    setImageRef(URL.createObjectURL(file));
    setImageRefMime(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageRefBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      setStep('Analyzing prompt...');
      await new Promise(r => setTimeout(r, 800));
      setStep('Queueing generation...');
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel.id,
          duration,
          aspectRatio: aspect,
          motionScore: motion,
          imageRefBase64: imageRefBase64 ?? undefined,
          imageRefMimeType: imageRefBase64 ? imageRefMime : undefined,
        }),
      });
      setStep('Rendering frames...');
      await new Promise(r => setTimeout(r, 1200));
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Generation failed');
      setResults(prev => [{
        url: data.videoUrl,
        prompt: prompt.trim(),
        enhancedPrompt: data.enhancedPrompt,
        model: selectedModel.name,
        duration,
        aspectRatio: aspect,
      }, ...prev]);
      setPrompt('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setStep('');
    }
  };

  const togglePlay = (url: string) => {
    const vid = videoRefs.current[url];
    if (!vid) return;
    if (playing === url) {
      vid.pause();
      setPlaying(null);
    } else {
      Object.values(videoRefs.current).forEach(v => v?.pause());
      vid.play();
      setPlaying(url);
    }
  };

  // Renders the speed and quality lightning bolts
  const renderRating = (score: number, max = 5) => {
    return Array.from({ length: max }).map((_, i) => (
      <Zap key={i} className={`w-3 h-3 ${i < score ? 'text-zinc-300' : 'text-zinc-700'} fill-current`} />
    ));
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#0a0a0a]">
      {/* LEFT PANEL: KREA STYLE MODELS LIST */}
      <div className="w-[300px] border-r border-white/5 bg-[#0a0a0a] flex flex-col flex-shrink-0 relative overflow-hidden z-20">
        <div className="px-5 py-6">
          <p className="text-[13px] font-medium text-white mb-4">Click to view all models</p>
          
          <div className="space-y-4 overflow-y-auto pb-32 [&::-webkit-scrollbar]:hidden h-full">
            {models.map(m => {
              const isSelected = selectedModel.id === m.id;
              return (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedModel(m)}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected ? 'bg-[#18181A] border-white/10' : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio Button */}
                    <div className="mt-1 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full border-[4px] border-white bg-transparent flex items-center justify-center">
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-600 bg-transparent flex items-center justify-center" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <h3 className={`text-[15px] font-medium tracking-tight ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{m.name}</h3>
                        {isSelected && <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3 inline mr-1" />Selected</span>}
                      </div>
                      
                      <p className="text-[12px] text-zinc-500 leading-relaxed max-w-[95%]">
                        {m.desc}
                      </p>

                      {/* Feature Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.features.map(f => (
                          <span key={f} className="text-[10px] bg-[#222] border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            {f === 'Start' && <ImageIcon className="w-3 h-3" />}
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Stats & Credit footer */}
                      <div className="flex items-center justify-between mt-3 pt-2 opacity-70">
                        <div className="flex items-center gap-1">
                          {renderRating(m.speed)}
                        </div>
                        <span className="text-[11px] text-zinc-400">~{m.credits} ⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN KREA CANVAS AREA */}
      <div className="flex-1 relative flex flex-col bg-[#111111] overflow-hidden">
        {/* Results / Empty View */}
        <div className="flex-1 overflow-y-auto w-full p-6 pt-12 pb-48 flex flex-col items-center">
          
          <AnimatePresence mode="wait">
            {results.length === 0 && !generating ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-32 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="flex items-center justify-center gap-4 text-white">
                  <span className="bg-yellow-500 rounded text-black font-bold px-2 py-1 flex items-center justify-center">{selectedModel.icon}</span>
                  <h1 className="text-4xl font-semibold tracking-tight">{selectedModel.name}</h1>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Render Output Area Above the prompt */}
          <div className="w-full max-w-5xl mx-auto space-y-6 mt-8">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mx-auto max-w-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-[13px]">{error}</p>
                <button type="button" onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {generating && results.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-4 h-64">
                <div className="w-64 aspect-video rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                <p className="text-[13px] text-zinc-400 font-medium tracking-wide flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {step}
                </p>
              </motion.div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {generating && (
                  <div className="aspect-video rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
                     <p className="text-[12px] text-zinc-500 tracking-wide">{step}</p>
                  </div>
                )}
                {results.map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="group relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 hover:border-white/20 transition-all shadow-2xl"
                  >
                    <video
                      ref={el => { videoRefs.current[r.url] = el; }}
                      src={r.url}
                      className="w-full aspect-video object-cover"
                      loop
                      playsInline
                      onEnded={() => setPlaying(null)}
                      onClick={() => togglePlay(r.url)}
                    />
                    
                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all shadow-xl pointer-events-auto cursor-pointer ${playing === r.url ? 'opacity-0 scale-95 group-hover:opacity-100' : 'opacity-100 scale-100'}`} onClick={() => togglePlay(r.url)}>
                        {playing === r.url
                          ? <Pause className="w-6 h-6 text-white" />
                          : <Play className="w-6 h-6 text-white ml-1" />}
                      </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-12 translate-y-[2px]">
                      <p className="text-[13px] text-white font-medium truncate mb-2 drop-shadow-md">{r.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2.5 text-[11px] font-medium text-white/50 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                          <span className="text-white/80">{r.model}</span>
                          <span>•</span>
                          <span>{r.duration}</span>
                          <span>•</span>
                          <span>{r.aspectRatio}</span>
                        </div>
                        <a
                          href={r.url}
                          download={`video-${i + 1}.mp4`}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
                          onClick={e => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FLOATING PROMPT INPUT (BOTTOM CENTER) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
          <div 
            className="w-full bg-[#18181A] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl transition-all hover:border-white/20 flex flex-col"
            onDragOver={e => e.preventDefault()}
            onDrop={handleImageDrop}
          >
            
            {/* Top row: Textarea and utility buttons */}
            <div className="relative flex min-h-[64px]">
              <textarea
                 value={prompt}
                 onChange={e => setPrompt(e.target.value)}
                 onKeyDown={e => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleGenerate();
                   }
                 }}
                 placeholder="Describe a video and click generate..."
                 className="flex-1 bg-transparent text-[15px] text-white placeholder-zinc-500 resize-none outline-none py-5 px-6 leading-relaxed"
                 rows={1}
                 style={{ minHeight: '64px' }}
              />

              {/* Utility action icons inside the prompt area */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#18181A] pl-2">
                <button 
                  title="Enhance Prompt"
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <label 
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  title="Upload Image Reference"
                >
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f) loadImageRef(f) }} className="hidden" />
                  <ImageIcon className="w-4 h-4" />
                </label>
              </div>
            </div>

            {/* Render Image Reference if uploaded */}
            {imageRef && (
              <div className="px-6 pb-2">
                <div className="relative inline-block border border-white/10 rounded-xl overflow-hidden group">
                  <img src={imageRef} alt="Reference" className="h-16 w-16 object-cover" />
                  <button 
                    onClick={() => { setImageRef(null); setImageRefBase64(null); }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom row: Setting Pills and Submit Button */}
            <div className="px-3 pb-3 pt-1 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              
              {/* Selected Model Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[12px] font-medium text-zinc-300">
                <span className="bg-yellow-500 rounded-sm px-1 py-0.5 text-black text-[10px] leading-tight flex items-center">{selectedModel.icon}</span>
                {selectedModel.name}
              </div>

              {/* Duration Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] font-medium text-zinc-300 transition-colors">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {duration}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-[200px] p-2 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-xl">
                   <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-2 mb-2">Duration</p>
                   <div className="grid grid-cols-3 gap-1">
                     {durations.map(d => (
                       <button
                         key={d}
                         onClick={() => setDuration(d)}
                         className={`py-1.5 rounded-xl text-[12px] font-medium transition-all ${duration === d ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}
                       >
                         {d}
                       </button>
                     ))}
                   </div>
                </PopoverContent>
              </Popover>

              {/* Aspect Ratio Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] font-medium text-zinc-300 transition-colors">
                    <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
                    {aspect === '16:9' ? '1080p' : aspect === '9:16' ? 'Portrait' : aspect}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-[220px] p-2 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-xl">
                   <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-2 mb-2">Aspect Ratio & Quality</p>
                   <div className="grid grid-cols-2 gap-1 mb-3">
                     {aspectRatios.map(r => (
                       <button
                         key={r}
                         onClick={() => setAspect(r)}
                         className={`py-2 rounded-xl text-[12px] font-medium transition-all ${aspect === r ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}
                       >
                         {r}
                       </button>
                     ))}
                   </div>
                   <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-2 mb-2">Motion Intensity</p>
                   <div className="px-2 pb-2 flex items-center justify-between gap-3">
                     <span className="text-[10px] text-zinc-500">Static</span>
                     <input
                        type="range" min={1} max={5} value={motion}
                        onChange={e => setMotion(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                     />
                     <span className="text-[10px] text-zinc-500">Fluid</span>
                   </div>
                </PopoverContent>
              </Popover>

              <div className="flex-1" />

              {/* Submit Button inside prompt */}
              <button 
                onClick={handleGenerate}
                disabled={(!prompt.trim() && !imageRef) || generating}
                className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                   (!prompt.trim() && !imageRef) || generating 
                     ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                     : 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                }`}
              >
                {generating ? <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" /> : <Plus className="w-5 h-5 ml-px" />}
              </button>

            </div>
          </div>
          <p className="text-center text-[11px] text-zinc-600 mt-3 flex items-center justify-center gap-1.5 opacity-70">
            <span className="text-orange-400 font-medium">⚡ Generating this video costs ~{selectedModel.credits} credits</span>
          </p>
        </div>
      </div>
    </div>
  );
}
