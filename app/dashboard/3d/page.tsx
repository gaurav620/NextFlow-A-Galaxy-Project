'use client';

import { useState, useRef } from 'react';
import { Upload, Box, Download, X, Sparkles, RotateCcw } from 'lucide-react';

const meshStyles = [
  { id: 'realistic', label: 'Realistic' },
  { id: 'stylized', label: 'Stylized' },
  { id: 'lowpoly', label: 'Low Poly' },
  { id: 'sculpted', label: 'Sculpted' },
];

const outputFormats = ['GLB', 'OBJ', 'FBX', 'USDZ'];

export default function ThreeDPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [meshStyle, setMeshStyle] = useState('realistic');
  const [format, setFormat] = useState('GLB');
  const [remesh, setRemesh] = useState(true);
  const [polyCount, setPolyCount] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) setImage(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !image) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 4000));
    setResult(true);
    setGenerating(false);
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      {/* LEFT */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <Box className="w-4 h-4 text-sky-400" />
          <span className="text-[13px] font-semibold">3D Generation</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">
          {/* Image input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Reference Image</label>
            <div
              onClick={() => !image && fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onDragOver={e => e.preventDefault()}
              className={`relative w-full rounded-xl border border-dashed transition-all cursor-pointer overflow-hidden bg-[#0d0d0f] ${image ? 'border-sky-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
              style={{ height: image ? 130 : 90 }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {image ? (
                <>
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button onClick={e => { e.stopPropagation(); setImage(null); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-zinc-600" />
                  <p className="text-[10px] text-zinc-600">Upload reference image</p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Text Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the 3D object..."
              rows={3}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-sky-500/30 rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
            <p className="text-[10px] text-zinc-600">Use image, text, or both</p>
          </div>

          <div className="border-t border-white/[0.05]" />

          {/* Mesh style */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Mesh Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {meshStyles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setMeshStyle(s.id)}
                  className={`py-2 rounded-xl text-[11px] font-medium transition-all border ${
                    meshStyle === s.id
                      ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                      : 'border-white/[0.05] bg-[#111] text-zinc-500 hover:text-zinc-200 hover:border-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output format */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Export Format</label>
            <div className="grid grid-cols-4 gap-1.5">
              {outputFormats.map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    format === f ? 'bg-white text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Remesh toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-zinc-300 font-medium">Auto Remesh</p>
              <p className="text-[10px] text-zinc-600">Optimize mesh topology</p>
            </div>
            <button
              onClick={() => setRemesh(!remesh)}
              className={`w-9 h-5 rounded-full transition-colors relative ${remesh ? 'bg-sky-500' : 'bg-zinc-800'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${remesh ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Poly count */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Poly Density</label>
              <span className="text-[11px] text-zinc-400">{polyCount}%</span>
            </div>
            <input
              type="range" min={10} max={100} value={polyCount}
              onChange={e => setPolyCount(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #38bdf8 0%, #38bdf8 ${polyCount}%, #27272a ${polyCount}%, #27272a 100%)` }}
            />
            <div className="flex justify-between text-[9px] text-zinc-700">
              <span>Low</span><span>High</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button
            onClick={handleGenerate}
            disabled={(!prompt.trim() && !image) || generating}
            className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold text-[13px] hover:bg-sky-400 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating
              ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Generating 3D...</>
              : <><Box className="w-4 h-4" />Generate 3D</>}
          </button>
          <p className="text-[10px] text-zinc-600 text-center mt-2">~15-30s · 20⚡ credits</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">{result ? '3D model ready' : 'Generate a 3D model from image or text'}</span>
          {result && (
            <div className="flex items-center gap-2">
              <button onClick={() => { setResult(false); }} className="flex items-center gap-1.5 text-[12px] text-zinc-400 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />New
              </button>
              <button className="flex items-center gap-1.5 text-[12px] text-zinc-300 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Download className="w-3.5 h-3.5" />Download {format}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          {result ? (
            <div className="w-full max-w-lg aspect-square rounded-2xl border border-sky-500/20 bg-[#0d0d0f] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* 3D viewer placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent" />
              <div className="w-32 h-32 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Box className="w-16 h-16 text-sky-400/60" />
              </div>
              <div className="text-center">
                <p className="text-white text-[14px] font-semibold mb-1">3D Model Generated</p>
                <p className="text-zinc-500 text-[12px]">{format} format · {meshStyle} style</p>
              </div>
              <div className="flex gap-2 text-[10px] text-zinc-600">
                <span className="px-2 py-1 rounded bg-white/5">Drag to rotate</span>
                <span className="px-2 py-1 rounded bg-white/5">Scroll to zoom</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto">
                <Box className="w-8 h-8 text-sky-400/50" />
              </div>
              <div>
                <p className="text-white text-[15px] font-semibold mb-1">3D Generation</p>
                <p className="text-zinc-500 text-[13px]">Upload an image or describe an object to generate a 3D mesh you can download and use.</p>
              </div>
              {(image || prompt) && !generating && (
                <p className="text-[12px] text-sky-400">✓ Ready — click Generate 3D</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
