'use client';

import { useState, useRef, useEffect } from 'react';
import { Brush, Eraser, Sliders, Sparkles, RotateCcw, Download } from 'lucide-react';

const brushSizes = [4, 8, 16, 32];

export default function RealtimePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [prompt, setPrompt] = useState('');
  const [guidance, setGuidance] = useState(7);
  const [generating, setGenerating] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0d0d0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#0d0d0f' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
    if (prompt) triggerGenerate();
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const triggerGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 800);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#0d0d0f';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const colors = ['#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      {/* LEFT PANEL */}
      <div className="w-[220px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <Brush className="w-4 h-4 text-purple-400" />
          <span className="text-[13px] font-semibold">Realtime</span>
          <div className={`ml-auto w-2 h-2 rounded-full ${generating ? 'bg-green-400 animate-pulse' : 'bg-zinc-700'}`} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the image..."
              rows={3}
              className="w-full bg-[#111] border border-white/[0.07] focus:border-purple-500/30 rounded-xl p-2.5 text-[11px] text-zinc-200 placeholder:text-zinc-600 resize-none outline-none transition-colors"
            />
          </div>

          <div className="border-t border-white/[0.05]" />

          {/* Tool */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Tool</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setTool('brush')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all ${tool === 'brush' ? 'bg-purple-600 text-white' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'}`}
              >
                <Brush className="w-3 h-3" /> Brush
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all ${tool === 'eraser' ? 'bg-zinc-600 text-white' : 'bg-[#111] text-zinc-500 hover:text-zinc-200 border border-white/[0.06]'}`}
              >
                <Eraser className="w-3 h-3" /> Eraser
              </button>
            </div>
          </div>

          {/* Brush size */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Size</label>
            <div className="grid grid-cols-4 gap-1.5">
              {brushSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setBrushSize(s)}
                  className={`py-1.5 rounded-lg flex items-center justify-center transition-all ${brushSize === s ? 'bg-white/10 border border-white/20' : 'bg-[#111] border border-white/[0.06] hover:bg-white/5'}`}
                >
                  <div className="rounded-full bg-white" style={{ width: Math.min(s / 2, 12), height: Math.min(s / 2, 12) }} />
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Color</label>
            <div className="grid grid-cols-4 gap-1.5">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => { setBrushColor(c); setTool('brush'); }}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${brushColor === c && tool === 'brush' ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Guidance</label>
              <span className="text-[11px] text-zinc-400">{guidance}</span>
            </div>
            <input
              type="range" min={1} max={15} value={guidance}
              onChange={e => setGuidance(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((guidance - 1) / 14) * 100}%, #27272a ${((guidance - 1) / 14) * 100}%, #27272a 100%)` }}
            />
          </div>
        </div>

        <div className="p-3 border-t border-white/[0.05] flex gap-2">
          <button onClick={clearCanvas} className="flex-1 py-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5">
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
          <button className="flex-1 py-2 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-white text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5">
            <Download className="w-3 h-3" /> Save
          </button>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Draw canvas */}
        <div className="flex-1 flex flex-col border-r border-white/[0.05]">
          <div className="h-10 flex items-center px-4 border-b border-white/[0.05] flex-shrink-0">
            <span className="text-[11px] text-zinc-600">Draw</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              className="w-full h-full cursor-crosshair"
              style={{ imageRendering: 'pixelated' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col">
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/[0.05] flex-shrink-0">
            <span className="text-[11px] text-zinc-600">AI Preview</span>
            {generating && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400">Generating</span>
              </div>
            )}
          </div>
          <div className="flex-1 bg-[#080808] flex items-center justify-center">
            {prompt ? (
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-purple-500/40 mx-auto" />
                    <p className="text-[12px] text-zinc-600">Draw something to generate</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Sparkles className="w-8 h-8 text-purple-500/20 mx-auto" />
                <p className="text-[12px] text-zinc-700">Enter a prompt to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
