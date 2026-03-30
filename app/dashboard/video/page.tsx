'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Upload, Play, Download, X } from 'lucide-react';

const models = [
  { id: 'kling26', name: 'Kling 2.6', tag: 'Featured', credits: -300 },
  { id: 'ltx2', name: 'LTX-2', tag: 'New', credits: -200 },
  { id: 'kling30', name: 'Kling 3.0', tag: 'New', credits: -1000 },
  { id: 'klingo3', name: 'Kling o3', tag: 'New', credits: -1000 },
];

const durations = ['5s', '10s', '15s'];
const aspectRatios = ['16:9', '9:16', '1:1', '4:3'];
const motionScores = [1, 2, 3, 4, 5];

export default function VideoPage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(models[0]);
  const [duration, setDuration] = useState('5s');
  const [aspect, setAspect] = useState('16:9');
  const [motion, setMotion] = useState(3);
  const [showModelDrop, setShowModelDrop] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageRef, setImageRef] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 3000));
    setGenerating(false);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageRef(url);
    }
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">

      {/* LEFT PANEL */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <div className="w-5 h-5 rounded bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px]">🎬</div>
          <span className="text-[13px] font-semibold">Video Generation</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">

          {/* Image reference */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Image Reference <span className="text-zinc-700 normal-case">(optional)</span></label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleImageDrop}
              onClick={() => { if (!imageRef) document.getElementById('img-ref-input')?.click(); }}
              className="relative w-full h-20 border border-dashed border-white/[0.08] rounded-xl flex items-center justify-center cursor-pointer hover:border-white/[0.15] transition-colors bg-[#0d0d0f]"
            >
              <input id="img-ref-input" type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) setImageRef(URL.createObjectURL(f));
              }} />
              {imageRef ? (
                <>
                  <img src={imageRef} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    onClick={e => { e.stopPropagation(); setImageRef(null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-4 h-4 text-zinc-600" />
                  <span className="text-[10px] text-zinc-600">Drop image or click</span>
                </div>
              )}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create..."
              rows={4}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-white/[0.18] rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          <div className="border-t border-white/[0.05]" />

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Model</label>
            <div className="relative">
              <button
                onClick={() => setShowModelDrop(!showModelDrop)}
                className="w-full flex items-center justify-between bg-[#111] border border-white/[0.07] rounded-xl px-3 py-2.5 text-[12px] text-zinc-200 hover:border-white/[0.12] transition-colors"
              >
                <span>{model.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-orange-400">{model.credits}⚡</span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </div>
              </button>
              {showModelDrop && (
                <div className="absolute top-full mt-1 w-full bg-[#161616] border border-white/[0.08] rounded-xl overflow-hidden z-20 shadow-2xl">
                  {models.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setModel(m); setShowModelDrop(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-white/5 transition-colors ${m.id === model.id ? 'text-white bg-white/5' : 'text-zinc-400'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">{m.tag}</span>
                      </div>
                      <span className="text-[10px] text-orange-400">{m.credits}⚡</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Duration</label>
            <div className="grid grid-cols-3 gap-1.5">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    duration === d ? 'bg-white text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-1.5">
              {aspectRatios.map(r => (
                <button
                  key={r}
                  onClick={() => setAspect(r)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    aspect === r ? 'bg-white text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Motion Score</label>
              <span className="text-[11px] text-zinc-400">{motion}</span>
            </div>
            <input
              type="range" min={1} max={5} value={motion}
              onChange={e => setMotion(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #f97316 0%, #f97316 ${((motion - 1) / 4) * 100}%, #27272a ${((motion - 1) / 4) * 100}%, #27272a 100%)` }}
            />
            <div className="flex justify-between text-[9px] text-zinc-700">
              <span>Subtle</span><span>Dynamic</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Generate Video</>
            )}
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">Results will appear here</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">🎬</div>
          <div>
            <p className="text-white text-[15px] font-semibold mb-1">Generate a video</p>
            <p className="text-zinc-500 text-[13px] max-w-xs">Write a prompt, optionally add an image reference, then click Generate Video.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
