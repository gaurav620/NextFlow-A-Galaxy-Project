'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Download, Heart, Share2, RotateCcw, Sliders } from 'lucide-react';

const models = [
  { id: 'nano-pro', name: 'Nano Banana Pro', tag: 'Featured', credits: -100 },
  { id: 'nano2', name: 'Nano Banana 2', tag: 'New', credits: -50 },
  { id: 'flux2', name: 'Flux 2', tag: 'Free', credits: 20 },
  { id: 'zimage', name: 'Z Image', tag: 'Free', credits: 2 },
];

const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];

const stylePresets = [
  'None', 'Photorealistic', 'Digital Art', 'Oil Painting',
  'Watercolor', 'Anime', 'Cinematic', 'Sketch',
];

const sampleResults = [
  '/card-portrait.png',
  '/bento-warrior.png',
  '/card-truck.png',
  '/card-capybara.png',
  '/m-nano1.png',
  '/m-nano2.png',
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel] = useState(models[0]);
  const [aspect, setAspect] = useState('1:1');
  const [style, setStyle] = useState('None');
  const [showNeg, setShowNeg] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(sampleResults);
  const [showModelDrop, setShowModelDrop] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
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
              placeholder="Describe what you want to generate..."
              rows={4}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-white/[0.18] rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          {/* Negative prompt toggle */}
          <button
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
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setResults([])}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Results grid or empty */}
        <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">🖼️</div>
              <p className="text-zinc-500 text-[13px]">Enter a prompt and click Generate</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {results.map((src, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer"
                  onClick={() => setSelectedImg(src)}
                >
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); }}
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
              <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
                <Download className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
