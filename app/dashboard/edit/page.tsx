'use client';

import { useState, useRef } from 'react';
import { Upload, Wand2, Download, X, ChevronDown } from 'lucide-react';

const editModes = [
  { id: 'inpaint', label: 'Inpaint', desc: 'Edit selected region' },
  { id: 'outpaint', label: 'Outpaint', desc: 'Extend beyond edges' },
  { id: 'replace', label: 'Replace', desc: 'Replace background' },
  { id: 'relight', label: 'Relight', desc: 'Change lighting' },
];

const strengthPresets = ['Subtle', 'Balanced', 'Strong', 'Extreme'];

export default function EditPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('inpaint');
  const [strength, setStrength] = useState('Balanced');
  const [maskStrength, setMaskStrength] = useState(50);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt.trim()) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setResult(image);
    setGenerating(false);
  };

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      {/* LEFT */}
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="text-[13px] font-semibold">NextFlow Edit</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">
          {/* Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Source Image</label>
            <div
              onClick={() => !image && fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onDragOver={e => e.preventDefault()}
              className="relative w-full rounded-xl border border-dashed border-white/[0.08] hover:border-white/[0.15] transition-colors cursor-pointer overflow-hidden bg-[#0d0d0f]"
              style={{ height: image ? 140 : 90 }}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {image ? (
                <>
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button onClick={e => { e.stopPropagation(); setImage(null); setResult(null); }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-zinc-600" />
                  <p className="text-[10px] text-zinc-600">Upload image to edit</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit mode */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Edit Mode</label>
            <div className="grid grid-cols-2 gap-1.5">
              {editModes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    mode === m.id ? 'border-purple-500/30 bg-purple-500/10' : 'border-white/[0.05] bg-[#111] hover:border-white/10'
                  }`}
                >
                  <p className={`text-[11px] font-semibold ${mode === m.id ? 'text-purple-300' : 'text-zinc-300'}`}>{m.label}</p>
                  <p className="text-[9px] text-zinc-600 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Edit Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={mode === 'inpaint' ? 'What to replace the masked area with...' : mode === 'relight' ? 'Lighting description...' : 'Describe the edit...'}
              rows={3}
              className="w-full bg-[#111] border border-white/[0.07] hover:border-white/[0.12] focus:border-purple-500/30 rounded-xl p-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          <div className="border-t border-white/[0.05]" />

          {/* Strength */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Edit Strength</label>
            <div className="grid grid-cols-2 gap-1.5">
              {strengthPresets.map(s => (
                <button
                  key={s}
                  onClick={() => setStrength(s)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    strength === s ? 'bg-white text-black' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Mask blur */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Mask Blur</label>
              <span className="text-[11px] text-zinc-400">{maskStrength}px</span>
            </div>
            <input
              type="range" min={0} max={100} value={maskStrength}
              onChange={e => setMaskStrength(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${maskStrength}%, #27272a ${maskStrength}%, #27272a 100%)` }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button
            onClick={handleEdit}
            disabled={!image || !prompt.trim() || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {generating ? (
              <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Editing...</>
            ) : (
              <><Wand2 className="w-4 h-4" />Apply Edit</>
            )}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">{result ? 'Edit applied' : 'Upload an image and describe your edit'}</span>
          {result && (
            <button className="flex items-center gap-1.5 text-[12px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          {!image ? (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full max-w-lg aspect-square border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/[0.15] transition-colors bg-[#0d0d0f]"
            >
              <Upload className="w-10 h-10 text-zinc-700" />
              <p className="text-[14px] text-zinc-500 font-medium">Upload an image to edit</p>
              <p className="text-[12px] text-zinc-700">JPG, PNG, WEBP up to 20MB</p>
            </div>
          ) : result ? (
            <div className="flex gap-6 max-w-3xl w-full">
              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-zinc-500 text-center uppercase tracking-widest">Original</p>
                <img src={image} alt="original" className="w-full rounded-xl border border-white/[0.06]" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-purple-400 text-center uppercase tracking-widest">Edited</p>
                <img src={result} alt="result" className="w-full rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10" />
              </div>
            </div>
          ) : (
            <div className="max-w-sm w-full space-y-4">
              <img src={image} alt="source" className="w-full rounded-xl border border-white/[0.06]" />
              {!prompt && <p className="text-[12px] text-zinc-500 text-center">Enter an edit prompt on the left</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
