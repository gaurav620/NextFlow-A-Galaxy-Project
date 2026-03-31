'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Download, Heart, Share2, RotateCcw, Sliders, AlertCircle } from 'lucide-react';
import { useAssetStore } from '@/store/assets';

const models = [
  { id: 'imagen3', name: 'Imagen 3', tag: 'Featured', credits: -100 },
  { id: 'imagen3-fast', name: 'Imagen 3 Fast', tag: 'Fast', credits: -50 },
  { id: 'flux2', name: 'Flux 2', tag: 'Free', credits: 20 },
  { id: 'zimage', name: 'Z Image', tag: 'Free', credits: 2 },
];

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];

const stylePresets = [
  'None', 'Photorealistic', 'Digital Art', 'Oil Painting',
  'Watercolor', 'Anime', 'Cinematic', 'Sketch',
];

export default function ImagePage() {
  const { addAsset } = useAssetStore();
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel] = useState(models[0]);
  const [aspect, setAspect] = useState('1:1');
  const [style, setStyle] = useState('None');
  const [showNeg, setShowNeg] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showModelDrop, setShowModelDrop] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negPrompt: negPrompt.trim() || undefined,
          aspectRatio: aspect,
          style,
          count: 4,
          modelId: model.id,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Generation failed');
      setResults(prev => [...data.images, ...prev]);
      // Auto-save to Assets
      for (const imgUrl of data.images) {
        addAsset({ url: imgUrl, prompt: prompt.trim(), tool: 'image', ratio: aspect });
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
    a.download = `nextflow-image-${i + 1}.png`;
    a.click();
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">

      {/* ── LEFT PANEL ────────────────────────────────── */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px]">🖼️</div>
          <span className="text-[13px] font-semibold">Image Generation</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              placeholder="Describe what you want to generate..."
              rows={4}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-white/[0.18] rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          {/* Negative prompt toggle */}
          <button
            type="button"
            onClick={() => setShowNeg(!showNeg)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showNeg ? 'rotate-180' : ''}`} />
            Negative prompt
          </button>
          {showNeg && (
            <textarea
              value={negPrompt}
              onChange={e => setNegPrompt(e.target.value)}
              placeholder="What to avoid..."
              rows={2}
              className="w-full bg-[#111] border border-white/[0.07] rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none"
            />
          )}

          <div className="border-t border-white/[0.05]" />

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Model</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDrop(!showModelDrop)}
                className="w-full flex items-center justify-between bg-[#111] border border-white/[0.07] rounded-xl px-3 py-2.5 text-[12px] text-zinc-200 hover:border-white/[0.12] transition-colors"
              >
                <span>{model.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${model.credits < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {model.credits > 0 ? `+${model.credits}` : model.credits}⚡
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </div>
              </button>
              {showModelDrop && (
                <div className="absolute top-full mt-1 w-full bg-[#161616] border border-white/[0.08] rounded-xl overflow-hidden z-20 shadow-2xl">
                  {models.map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => { setModel(m); setShowModelDrop(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-white/5 transition-colors ${m.id === model.id ? 'text-white bg-white/5' : 'text-zinc-400'}`}
                    >
                      <span>{m.name}</span>
                      <span className={`text-[10px] ${m.credits < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {m.credits > 0 ? `+${m.credits}` : m.credits}⚡
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Aspect Ratio */}
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

          {/* Style */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {stylePresets.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-left ${
                    style === s ? 'bg-white/10 text-white border border-white/20' : 'bg-[#111] text-zinc-500 hover:text-zinc-300 border border-white/[0.05]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className="p-4 border-t border-white/[0.05]">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
          <p className="text-[10px] text-zinc-700 text-center mt-1.5">⌘+Enter · Auto-saves to Assets</p>
        </div>
      </div>

      {/* ── MAIN CANVAS ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">
            {results.length > 0 ? `${results.length} results` : 'No generations yet'}
          </span>
          <div className="flex items-center gap-2">
            <button type="button" className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Clear results"
              onClick={() => setResults([])}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-red-300">{error}</p>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 text-[11px]">×</button>
          </div>
        )}

        {/* Results grid */}
        <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden">
          {generating && results.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="grid grid-cols-2 gap-3 w-48">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-white/[0.04] animate-pulse" />
                ))}
              </div>
              <p className="text-zinc-500 text-[12px]">Generating with Imagen 3...</p>
            </div>
          )}
          {!generating && results.length === 0 && !error && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">🖼️</div>
              <p className="text-zinc-500 text-[13px]">Enter a prompt and click Generate</p>
              <p className="text-zinc-700 text-[11px]">Powered by Google Imagen 3 · Saves to Assets</p>
            </div>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {generating && [0, 1, 2, 3].map(i => (
                <div key={`skeleton-${i}`} className="aspect-square rounded-xl bg-white/[0.04] animate-pulse" />
              ))}
              {results.map((src, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer"
                  onClick={() => setSelectedImg(src)}
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1.5">
                    <button
                      type="button"
                      title="Favorite"
                      onClick={e => e.stopPropagation()}
                      className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      type="button"
                      title="Download"
                      onClick={e => { e.stopPropagation(); handleDownload(src, i); }}
                      className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────── */}
      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImg} alt="" className="w-full rounded-2xl shadow-2xl" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                type="button"
                title="Download"
                onClick={() => handleDownload(selectedImg, 0)}
                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                title="Share image"
                aria-label="Share image"
                className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
