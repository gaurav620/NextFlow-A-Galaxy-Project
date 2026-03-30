'use client';

import { useState, useRef } from 'react';
import { Upload, RotateCcw, Sparkles, Download, X, ArrowRight } from 'lucide-react';

export default function MotionTransferPage() {
  const [sourceVideo, setSourceVideo] = useState<string | null>(null);
  const [refVideo, setRefVideo] = useState<string | null>(null);
  const [tracking, setTracking] = useState(true);
  const [fps, setFps] = useState(24);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(false);
  const srcRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!sourceVideo || !refVideo) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 3500));
    setResult(true);
    setGenerating(false);
  };

  const VideoDrop = ({ label, value, onSet, onClear, inputRef }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{label}</label>
      <div
        onClick={() => !value && inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('video/')) onSet(URL.createObjectURL(f)); }}
        onDragOver={e => e.preventDefault()}
        className={`relative w-full rounded-xl border border-dashed transition-all cursor-pointer overflow-hidden bg-[#0d0d0f] ${value ? 'border-green-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
        style={{ height: 90 }}
      >
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onSet(URL.createObjectURL(f)); }} />
        {value ? (
          <div className="h-full flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-[10px] text-green-400">Video loaded</p>
            <button onClick={e => { e.stopPropagation(); onClear(); }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-zinc-600" />
            <p className="text-[10px] text-zinc-600">{label}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span className="text-[13px] font-semibold">Motion Transfer</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">
          <VideoDrop label="Source Video (subject)" value={sourceVideo} onSet={setSourceVideo} onClear={() => setSourceVideo(null)} inputRef={srcRef} />
          <VideoDrop label="Reference Video (motion)" value={refVideo} onSet={setRefVideo} onClear={() => setRefVideo(null)} inputRef={refInputRef} />

          <div className="border-t border-white/[0.05]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-zinc-300 font-medium">Subject Tracking</p>
              <p className="text-[10px] text-zinc-600">Lock on primary subject</p>
            </div>
            <button onClick={() => setTracking(!tracking)}
              className={`w-9 h-5 rounded-full transition-colors relative ${tracking ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${tracking ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Framerate</label>
              <span className="text-[11px] text-zinc-400">{fps} fps</span>
            </div>
            <input type="range" min={12} max={60} step={6} value={fps}
              onChange={e => setFps(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #34d399 0%, #34d399 ${((fps - 12) / 48) * 100}%, #27272a ${((fps - 12) / 48) * 100}%, #27272a 100%)` }}
            />
            <div className="flex justify-between text-[9px] text-zinc-700">
              <span>12fps</span><span>60fps</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button onClick={handleGenerate} disabled={!sourceVideo || !refVideo || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2">
            {generating ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Transferring...</>
              : <><Sparkles className="w-4 h-4" />Transfer Motion</>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">{result ? 'Transfer complete' : 'Upload source and reference videos'}</span>
          {result && <button className="flex items-center gap-1.5 text-[12px] text-zinc-300 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Download className="w-3.5 h-3.5" />Download</button>}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-emerald-400/50" />
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-700" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400/50" />
              </div>
            </div>
            <div>
              <p className="text-white text-[15px] font-semibold mb-1">Motion Transfer</p>
              <p className="text-zinc-500 text-[13px]">Upload a subject video and a reference video with the motion you want to transfer.</p>
            </div>
            {sourceVideo && !refVideo && <p className="text-[12px] text-emerald-400">✓ Source uploaded — now upload reference</p>}
            {sourceVideo && refVideo && !result && <p className="text-[12px] text-green-400">✓ Ready — click Transfer Motion</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
