'use client';

import { useState } from 'react';
import { Zap, Download, Heart, RotateCcw, AlertCircle } from 'lucide-react';
import { useAssetStore } from '@/store/assets';

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:2'];
const speedModes = ['Turbo', 'Standard', 'Quality'];

export default function NanoPage() {
  const { addAsset } = useAssetStore();
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [speed, setSpeed] = useState('Turbo');
  const [count, setCount] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/nano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), aspectRatio: aspect, count, speed }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Generation failed');
      setResults(prev => [...data.images, ...prev]);
      for (const imgUrl of data.images) {
        addAsset({ url: imgUrl, prompt: prompt.trim(), tool: 'nano', ratio: aspect });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (src: string, i: number) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `nano-${i + 1}.png`;
    a.click();
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      {/* LEFT */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-[13px] font-semibold">Nano Banana</span>
          <span className="ml-auto text-[9px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20 font-semibold">FAST</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3">
            <p className="text-[11px] text-yellow-400/80 leading-relaxed">Lightning-fast generation with world-class prompt adherence. Best for iteration and exploring ideas.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe your image..."
              rows={4}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-yellow-500/30 rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          <div className="border-t border-white/[0.05]" />

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Speed Mode</label>
            <div className="grid grid-cols-3 gap-1.5">
              {speedModes.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    speed === s ? 'bg-yellow-400 text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-1.5">
              {aspectRatios.map(r => (
                <button
                  type="button"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Count</label>
              <span className="text-[11px] text-zinc-400">{count}</span>
            </div>
            <input
              type="range" min={1} max={8} value={count}
              aria-label="Image count"
              onChange={e => setCount(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #eab308 0%, #eab308 ${((count - 1) / 7) * 100}%, #27272a ${((count - 1) / 7) * 100}%, #27272a 100%)` }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold text-[13px] hover:bg-yellow-300 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Generating...</>
            ) : (
              <><Zap className="w-4 h-4" />Generate Fast</>
            )}
          </button>
          <p className="text-[10px] text-zinc-600 text-center mt-2">~{speed === 'Turbo' ? '5-10s' : speed === 'Standard' ? '10-20s' : '20-30s'} · Saves to Assets</p>
        </div>
      </div>

      {/* RESULTS */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">{results.length} results</span>
          <button type="button" title="Clear results" onClick={() => { setResults([]); setError(null); }} className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-red-300">{error}</p>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 text-[11px]">×</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden">
          {generating && results.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="grid grid-cols-4 gap-2 w-64">
                {Array.from({ length: count > 4 ? 8 : 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-yellow-400/5 animate-pulse" />
                ))}
              </div>
              <p className="text-zinc-500 text-[12px]">Generating fast...</p>
            </div>
          )}
          {!generating && results.length === 0 && !error && (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Zap className="w-10 h-10 text-yellow-400/30" />
              <p className="text-zinc-500 text-[13px]">Enter a prompt to generate fast</p>
            </div>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {generating && Array.from({ length: 4 }).map((_, i) => (
                <div key={`sk-${i}`} className="aspect-square rounded-xl bg-yellow-400/5 animate-pulse" />
              ))}
              {results.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer">
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1.5">
                    <button type="button" title="Favorite" className="w-6 h-6 rounded-lg bg-black/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                    <button type="button" title="Download" onClick={() => handleDownload(src, i)} className="w-6 h-6 rounded-lg bg-black/60 flex items-center justify-center">
                      <Download className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
