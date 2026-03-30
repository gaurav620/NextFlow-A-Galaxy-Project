'use client';

import { useState, useRef } from 'react';
import { Upload, Sparkles, Download, ZoomIn, ZoomOut, X } from 'lucide-react';

const upscaleFactors = ['2x', '4x', '8x', '16x'];

export default function EnhancerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [factor, setFactor] = useState('4x');
  const [creativity, setCreativity] = useState(30);
  const [hdr, setHdr] = useState(false);
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleEnhance = async () => {
    if (!image) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setResult(image);
    setGenerating(false);
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">

      {/* LEFT PANEL */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <div className="w-5 h-5 rounded bg-zinc-500/20 border border-zinc-500/30 flex items-center justify-center text-[10px]">✨</div>
          <span className="text-[13px] font-semibold">Enhance & Upscale</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">

          {/* Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Input Image</label>
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => !image && fileRef.current?.click()}
              className={`relative w-full rounded-xl border border-dashed transition-all cursor-pointer overflow-hidden ${
                isDragging ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/[0.08] hover:border-white/[0.15] bg-[#0d0d0f]'
              }`}
              style={{ height: image ? 160 : 100 }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {image ? (
                <>
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={e => { e.stopPropagation(); setImage(null); setResult(null); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <Upload className="w-5 h-5 text-zinc-600" />
                  <p className="text-[11px] text-zinc-600">Drop image or click to upload</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/[0.05]" />

          {/* Upscale factor */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Upscale Factor</label>
            <div className="grid grid-cols-4 gap-1.5">
              {upscaleFactors.map(f => (
                <button
                  key={f}
                  onClick={() => setFactor(f)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    factor === f ? 'bg-white text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Creativity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Creativity Strength</label>
              <span className="text-[11px] text-zinc-400">{creativity}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={creativity}
              onChange={e => setCreativity(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${creativity}%, #27272a ${creativity}%, #27272a 100%)` }}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              { label: 'HDR Enhancement', sub: 'Boost dynamic range and contrast', val: hdr, set: setHdr },
              { label: 'Face Enhancement', sub: 'Sharpen facial details', val: faceEnhance, set: setFaceEnhance },
            ].map(({ label, sub, val, set }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-zinc-300 font-medium">{label}</p>
                  <p className="text-[10px] text-zinc-600">{sub}</p>
                </div>
                <button
                  onClick={() => set(!val)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${val ? 'bg-blue-500' : 'bg-zinc-800'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button
            onClick={handleEnhance}
            disabled={!image || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Enhancing...</>
            ) : (
              <><ZoomIn className="w-4 h-4" />Enhance {factor}</>
            )}
          </button>
        </div>
      </div>

      {/* MAIN — before/after */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center px-5 border-b border-white/[0.05] flex-shrink-0 justify-between">
          <span className="text-[12px] text-zinc-500">
            {result ? `Enhanced ${factor} — ready to download` : 'Upload an image to begin'}
          </span>
          {result && (
            <button className="flex items-center gap-1.5 text-[12px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          {!image ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl">✨</div>
              <p className="text-zinc-500 text-[13px]">Upload an image on the left to enhance it</p>
            </div>
          ) : result ? (
            <div className="flex gap-6 max-w-3xl w-full">
              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-zinc-500 text-center uppercase tracking-widest">Original</p>
                <img src={image} alt="original" className="w-full rounded-xl border border-white/[0.06]" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-zinc-300 text-center uppercase tracking-widest">Enhanced {factor}</p>
                <div className="relative">
                  <img src={result} alt="enhanced" className="w-full rounded-xl border border-white/10 shadow-lg shadow-purple-500/10" />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {factor} Enhanced
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-sm w-full">
              <img src={image} alt="input" className="w-full rounded-xl border border-white/[0.06]" />
              <p className="text-[12px] text-zinc-500 text-center mt-3">Ready to enhance — click the button</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
