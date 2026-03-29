'use client';

import { useState, useRef } from 'react';
import { Upload, ChevronRight, Wand2, Film, Sliders, Sparkles, ArrowRight } from 'lucide-react';

export default function VideoRestylePage() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [styleStrength, setStyleStrength] = useState(70);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoUploaded(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoUploaded(true);
  };

  return (
    <div className="flex flex-col w-full h-full text-white font-sans overflow-hidden bg-[#09090b]">
      {/* Top Header / Breadcrumb */}
      <div className="h-12 border-b border-white/[0.05] flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[12px]">
          <div className="w-5 h-5 rounded-md bg-pink-600/20 border border-pink-500/20 flex items-center justify-center">
            <Wand2 className="w-3 h-3 text-pink-400" />
          </div>
          <span className="text-zinc-600">Video Restyle</span>
          <ChevronRight className="w-3 h-3 text-zinc-800" />
          <span className="text-zinc-400 font-medium">New Project</span>
        </div>

        {/* Right side settings */}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            <Sliders className="w-3 h-3" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content — Two column node layout */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-6">
          {/* Page Title */}
          <div className="text-center mb-2">
            <h1 className="text-[24px] font-semibold tracking-tight mb-1.5">Video Restyle</h1>
            <p className="text-zinc-600 text-[13px] max-w-sm">
              Upload a video and describe the style you want to apply. Our AI will transform it.
            </p>
          </div>

          {/* Nodes Row */}
          <div className="flex items-start gap-4 w-full">
            {/* Node 1: Upload Video */}
            <div className="flex-1 flex flex-col">
              {/* Node header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-5 h-5 rounded bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                  <Film className="w-3 h-3 text-zinc-400" />
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">Input Video</span>
              </div>

              {/* Node body */}
              <div
                className={`relative group cursor-pointer rounded-2xl transition-all duration-200 ${
                  isDragging ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {!videoUploaded ? (
                  <div className="h-[220px] border border-dashed border-white/[0.08] hover:border-white/[0.14] rounded-2xl bg-[#0d0d0f] flex flex-col items-center justify-center gap-3 transition-all duration-200 group-hover:bg-[#111]">
                    <div className="w-12 h-12 rounded-xl bg-[#151518] border border-white/[0.06] flex items-center justify-center">
                      <Upload className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-medium text-zinc-400 mb-0.5">Add Video</p>
                      <p className="text-[11px] text-zinc-700">MP4, WebM · up to 500MB</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-white/[0.06] text-[11px] text-zinc-500 mt-1">
                      Browse files
                    </div>
                  </div>
                ) : (
                  <div className="h-[220px] border border-green-500/20 rounded-2xl bg-green-500/5 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <Film className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-medium text-green-400">Video loaded</p>
                      <p className="text-[11px] text-zinc-600">Click to replace</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex items-center justify-center pt-12 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className="w-8 h-px bg-zinc-800" />
                <div className="w-10 h-10 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-pink-400" />
                </div>
                <div className="w-8 h-px bg-zinc-800" />
              </div>
            </div>

            {/* Node 2: Style Settings */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-5 h-5 rounded bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-zinc-400" />
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">Style Settings</span>
              </div>

              <div className="h-[220px] border border-white/[0.06] rounded-2xl bg-[#0d0d0f] p-4 flex flex-col gap-4">
                {/* Style strength slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-zinc-500">Style Strength</span>
                    <span className="text-[11px] text-zinc-400 font-medium">{styleStrength}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={styleStrength}
                    onChange={(e) => setStyleStrength(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${styleStrength}%, #27272a ${styleStrength}%, #27272a 100%)`,
                    }}
                  />
                </div>

                {/* Quick style chips */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-zinc-600">Quick Styles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Anime', 'Oil Paint', 'Watercolor', 'Sketch', 'Neon'].map((s) => (
                      <button
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-[#151518] border border-white/[0.06] text-[11px] text-zinc-500 hover:border-pink-500/30 hover:text-pink-300 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input Area */}
          <div className="w-full relative group">
            <div
              className={`absolute -inset-px rounded-2xl transition-opacity duration-300 ${videoUploaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                background: 'linear-gradient(90deg, #ec489920, #a855f720, #3b82f620)',
              }}
            />
            <div className="relative">
              <textarea
                disabled={!videoUploaded}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  videoUploaded
                    ? "Describe the style you want to apply... (e.g. 'A vintage 1970s film aesthetic with warm grain')"
                    : 'Upload a video first to enter a prompt...'
                }
                rows={3}
                className="w-full bg-[#0d0d0f] border border-white/[0.06] rounded-2xl px-5 py-4 text-[13px] text-zinc-300 placeholder:text-zinc-700 outline-none disabled:opacity-40 resize-none transition-all focus:border-white/10"
              />
              <button
                disabled={!videoUploaded || !prompt.trim()}
                className="absolute right-3 bottom-3 bg-white text-black px-5 py-2 rounded-xl text-[12px] font-semibold disabled:opacity-30 hover:bg-zinc-100 transition-all flex items-center gap-1.5"
              >
                Generate
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tips */}
          <p className="text-[11px] text-zinc-800 text-center">
            Processing time: ~2-5 minutes · Results will appear in your Assets
          </p>
        </div>
      </div>
    </div>
  );
}
