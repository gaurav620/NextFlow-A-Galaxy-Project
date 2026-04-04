/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Play, Download, X, AlertCircle, Pause, Settings2, Plus, Zap, Clock, ChevronDown, Check, Wand2, Video } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const models = [
  { id: 'seedance2', name: 'Seedance 2.0', icon: '📊', desc: 'Flagship video model with native audio, references, and frame animation.', features: ['Start', 'End', 'References'], speed: 4, quality: 5, credits: 300 },
  { id: 'veo31', name: 'Veo 3.1 Lite', icon: '⚡', desc: 'Faster, affordable Veo 3.1.', features: ['Start'], speed: 5, quality: 4, credits: 200 },
  { id: 'hailuo23', name: 'Hailuo 2.3 Fast', icon: '🎥', desc: 'Cheapest medium-quality model.', features: ['Start'], speed: 4, quality: 3, credits: 150 },
  { id: 'wan21', name: 'Wan 2.1', icon: '🚀', desc: 'Fastest low-quality model with LoRA.', features: ['Start', 'End', 'Lora'], speed: 5, quality: 2, credits: 250 },
  { id: 'wan22', name: 'Wan 2.2', icon: '🌠', desc: 'Fast, lower-quality model from Alibaba.', features: ['Start'], speed: 4, quality: 2, credits: 300 },
  { id: 'grok', name: 'Grok Imagine', icon: '🧠', desc: 'Fast, high-quality video generation by xAI.', features: ['Start'], speed: 4, quality: 5, credits: 400 },
  { id: 'seedance15', name: 'Seedance 1.5 Pro', icon: '🎵', desc: 'Medium-quality model with audio.', features: ['Start', 'Audio'], speed: 3, quality: 4, credits: 280 },
  { id: 'klingo1', name: 'Kling o1', icon: '🤔', desc: 'Intelligent model that thinks before generating.', features: ['Start'], speed: 2, quality: 5, credits: 450 },
  { id: 'klingo3', name: 'Kling o3', icon: '✨', desc: 'Advanced reasoning model with references.', features: ['Start', 'References'], speed: 3, quality: 5, credits: 500 },
  { id: 'klingo3p', name: 'Kling o3 Pro', icon: '🌟', desc: 'Advanced reasoning model, high-quality 1080p.', features: ['Start', 'References'], speed: 2, quality: 5, credits: 800 },
  { id: 'sora2', name: 'Sora 2', icon: '🎞️', desc: "OpenAI's powerful model with stable structure.", features: ['Start'], speed: 2, quality: 5, credits: 1000 },
  { id: 'wan26', name: 'Wan 2.6', icon: '🎬', desc: 'Medium-quality with multi-shot support.', features: ['Start', 'Multi-shot'], speed: 3, quality: 4, credits: 600 },
  { id: 'ltx2', name: 'LTX-2', icon: '📹', desc: 'Affordable audio-video model from Lightricks.', features: ['Start', 'Audio'], speed: 5, quality: 3, credits: 150 }
];

const durations = ['5s', '6s', '10s', '15s'];
const aspectRatios = ['16:9', '9:16', '1:1', '4:3'];
const resolutions = ['720p', '768p', '1080p'];

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
  const [selectedModel, setSelectedModel] = useState(models[2]); // Hailuo 2.3 Fast
  const [duration, setDuration] = useState('6s');
  const [resolution, setResolution] = useState('768p');
  const [aspect, setAspect] = useState('16:9');
  const [motionScore, setMotionScore] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [imageRefBase64, setImageRefBase64] = useState<string | null>(null);
  const [imageRefMime, setImageRefMime] = useState<string>('image/jpeg');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState('');
  const [topModelsOpen, setTopModelsOpen] = useState(false);
  const [bottomModelsOpen, setBottomModelsOpen] = useState(false);
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
          motionScore: motionScore,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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

  const renderRating = (score: number, max = 5) => {
    return Array.from({ length: max }).map((_, i) => (
      <Zap key={i} className={`w-3 h-3 ${i < score ? 'text-zinc-300' : 'text-zinc-700'} fill-current`} />
    ));
  };

  // The model selection list content
  const ModelSelectorContent = ({ onClose }: { onClose: () => void }) => (
    <div className="flex flex-col h-[500px] w-[320px] bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
         <p className="text-[13px] font-medium text-white">Click to view all models</p>
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
                <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                  <div className="flex gap-1 items-center bg-black/30 px-1.5 py-0.5 rounded">
                     {m.features.includes('Start') && <ImageIcon className="w-3 h-3" />}
                     {m.features.includes('End') && <span className="ml-0.5 border-l border-zinc-700 pl-1.5 border-white/10">End</span>}
                     {m.features.includes('References') && <span className="ml-0.5 border-l border-zinc-700 pl-1.5 border-white/10">References</span>}
                     {m.features.includes('Lora') && <span className="ml-0.5 border-l border-zinc-700 pl-1.5 border-white/10">Lora</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 opacity-70">
                  <div className="flex items-center gap-0.5">
                    {renderRating(m.speed, 3)}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {renderRating(m.quality, 3)}
                  </div>
                  <span className="text-[10px] text-zinc-400 ml-auto">~{m.credits} ⚡</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans">
      
      {/* TOP LEFT MODEL SWITCHER */}
      <div className="absolute top-4 left-6 z-50">
        <Popover open={topModelsOpen} onOpenChange={setTopModelsOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-transparent border-none">
              <span className="text-[14px] font-medium">Model <span className="text-white">{selectedModel.name}</span></span>
              <ChevronDown className="w-4 h-4 ml-1 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="p-0 border-none bg-transparent shadow-none" sideOffset={8}>
            <ModelSelectorContent onClose={() => setTopModelsOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* MAIN NEXTFLOW CANVAS AREA */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Empty State / Center Logo */}
        <AnimatePresence mode="wait">
          {results.length === 0 && !generating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-[40%] -translate-y-1/2 flex items-center justify-center pointer-events-none"
            >
              <div className="flex items-center justify-center gap-3 text-white">
                <div className="bg-yellow-500 rounded-md w-8 h-8 flex items-center justify-center text-black shadow-lg">
                  <Video size={20} className="fill-black" />
                </div>
                <h1 className="text-[32px] font-semibold tracking-tight">{selectedModel.name}</h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <div className="absolute inset-0 overflow-y-auto pb-48 pt-24 px-6 flex flex-col items-center">
          <div className="w-full max-w-5xl mx-auto space-y-6">
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-4 h-[400px]">
                <div className="w-full max-w-3xl aspect-video rounded-2xl bg-white/[0.02] border border-white/5 items-center justify-center flex flex-col relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent animate-pulse" />
                   <div className="w-6 h-6 border-[3px] border-white/10 border-t-white rounded-full animate-spin mb-4" />
                   <p className="text-[14px] text-zinc-400 font-medium tracking-wide">{step}</p>
                </div>
              </motion.div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 gap-8 pb-20 max-w-3xl mx-auto">
                {generating && (
                  <div className="w-full aspect-video rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
                     <div className="w-6 h-6 border-[3px] border-white/10 border-t-white rounded-full animate-spin mb-3" />
                     <p className="text-[13px] text-zinc-500 tracking-wide">{step}</p>
                  </div>
                )}
                {results.map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    key={i} 
                    className="group relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl"
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
                    
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-all shadow-xl pointer-events-auto cursor-pointer ${playing === r.url ? 'opacity-0 scale-95 group-hover:opacity-100' : 'opacity-100 scale-100'}`} onClick={() => togglePlay(r.url)}>
                        {playing === r.url
                          ? <Pause className="w-8 h-8 text-white" />
                          : <Play className="w-8 h-8 text-white ml-1 pl-0.5" />}
                      </div>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16">
                      <p className="text-[14px] text-white font-medium mb-3 drop-shadow-md leading-relaxed">{r.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-[12px] font-medium text-white/60">
                          <span className="text-white/90 bg-white/10 px-2 py-0.5 rounded-md">{r.model}</span>
                          <span className="bg-white/5 px-2 py-0.5 rounded-md">{r.duration}</span>
                          <span className="bg-white/5 px-2 py-0.5 rounded-md">{resolution}</span>
                        </div>
                        <a
                          href={r.url}
                          download={`generations/video-${i + 1}.mp4`}
                          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-md"
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[760px] px-4 z-40">
          <div 
            className="w-full bg-[#1c1c1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-white/20 flex flex-col"
            onDragOver={e => e.preventDefault()}
            onDrop={handleImageDrop}
          >
            {/* Top row: Textarea and utility buttons */}
            <div className="relative flex min-h-[60px]">
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
                 className="flex-1 bg-transparent text-[15px] text-zinc-300 placeholder-zinc-500 resize-none outline-none py-5 px-6 leading-relaxed"
                 rows={1}
                 style={{ minHeight: '60px' }}
              />
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
              
              {/* Selected Model Pill connected to the same model selector */}
              <Popover open={bottomModelsOpen} onOpenChange={setBottomModelsOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-3xl bg-[#2a2a2a] hover:bg-[#333] border border-transparent text-[13px] font-medium text-zinc-300 transition-colors">
                    <span className="text-zinc-400">@</span>
                    {selectedModel.name}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none" sideOffset={12}>
                  <ModelSelectorContent onClose={() => setBottomModelsOpen(false)} />
                </PopoverContent>
              </Popover>

              {/* Start Frame Image Upload Pill */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-3xl bg-[#2a2a2a] hover:bg-[#333] border border-transparent text-[13px] font-medium text-zinc-300 transition-colors cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Start frame</span>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f) loadImageRef(f) }} className="hidden" />
              </label>

              {/* Aspect Ratio / Quality Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-3xl bg-[#2a2a2a] hover:bg-[#333] border border-transparent text-[13px] font-medium text-zinc-300 transition-colors">
                    {resolution}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-[220px] p-2 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-xl">
                   <p className="text-[11px] font-medium tracking-wide text-zinc-500 px-2 mb-2">Resolution</p>
                   <div className="grid grid-cols-2 gap-1 mb-3">
                     {resolutions.map(r => (
                       <button
                         key={r}
                         onClick={() => setResolution(r)}
                         className={`py-1.5 rounded-xl text-[12px] font-medium transition-all ${resolution === r ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}
                       >
                         {r}
                       </button>
                     ))}
                   </div>
                   <p className="text-[11px] font-medium tracking-wide text-zinc-500 px-2 mb-2">Aspect Ratio</p>
                   <div className="grid grid-cols-2 gap-1 mb-3">
                     {aspectRatios.map(r => (
                       <button
                         key={r}
                         onClick={() => setAspect(r)}
                         className={`py-1.5 rounded-xl text-[12px] font-medium transition-all ${aspect === r ? 'bg-white text-black' : 'hover:bg-white/10 text-zinc-300'}`}
                       >
                         {r}
                       </button>
                     ))}
                   </div>
                   <p className="text-[11px] font-medium tracking-wide text-zinc-500 px-2 mb-2">Motion Intensity</p>
                   <div className="px-2 pb-2 flex items-center justify-between gap-3">
                     <span className="text-[10px] text-zinc-500">Static</span>
                     <input
                        type="range" min={1} max={5} value={motionScore}
                        onChange={e => setMotionScore(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                     />
                     <span className="text-[10px] text-zinc-500">Fluid</span>
                   </div>
                </PopoverContent>
              </Popover>

              {/* Duration Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-3xl bg-[#2a2a2a] hover:bg-[#333] border border-transparent text-[13px] font-medium text-zinc-300 transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                    {duration}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-[180px] p-2 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-xl">
                   <p className="text-[11px] font-medium tracking-wide text-zinc-500 px-2 mb-2">Duration</p>
                   <div className="grid grid-cols-2 gap-1">
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

              <div className="flex-1" />

              {/* Submit Button */}
              <button 
                onClick={handleGenerate}
                disabled={(!prompt.trim() && !imageRef) || generating}
                className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                   (!prompt.trim() && !imageRef) || generating 
                     ? 'bg-[#333] text-zinc-500 cursor-not-allowed' 
                     : 'bg-[#444] text-white hover:bg-[#555]'
                }`}
              >
                {generating ? <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
