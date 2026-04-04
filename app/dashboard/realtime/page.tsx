'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brush, Eraser, Sparkles, Download, Circle, Square as SquareIcon, 
  MousePointer2, Image as ImageIcon, Folder, Camera, Video, 
  ChevronDown, LayoutTemplate, RotateCcw, Box, Eye
} from 'lucide-react';
import { useAssetStore } from '@/store/assets';

const brushSizes = [4, 8, 16, 32];
const colors = ['#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

const RATIOS = ['1:1', '16:9', '4:3', '9:16'];
const MODES = [
  { id: 'edit', name: 'NextFlow Edit' },
  { id: 'hd', name: 'HD Mode' },
  { id: 'flux', name: 'Flux Realtime' }
];

export default function RealtimePage() {
  const { addAsset } = useAssetStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(16);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [tool, setTool] = useState<'pointer' | 'brush' | 'eraser' | 'circle' | 'square'>('brush');
  
  const [prompt, setPrompt] = useState('An astronaut in a cyberpunk orchid forest');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [activeRatio, setActiveRatio] = useState(RATIOS[0]);
  const [drawEnabled, setDrawEnabled] = useState(true);

  // Popovers
  const [showModes, setShowModes] = useState(false);
  const [showRatios, setShowRatios] = useState(false);

  useEffect(() => {
    initCanvas();
    triggerGenerate();
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    return { 
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY 
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawEnabled || tool === 'pointer') return;
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawEnabled || tool === 'pointer') return;
    
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    const pos = getPos(e);
    
    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#1c1c1c' : brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    lastPos.current = pos;
    debouncedGenerate();
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    initCanvas();
    triggerGenerate();
  };

  // Debounced API call to simulate real-time updating
  const debouncedGenerate = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      triggerGenerate();
    }, 600);
  };

  const triggerGenerate = async () => {
    setGenerating(true);
    // Add artificial delay to show UI updates
    await new Promise(r => setTimeout(r, 400));
    const sizeMap: Record<string, {w:number, h:number}> = {
      '1:1': {w:800, h:800},
      '16:9': {w:1024, h:576},
      '4:3': {w:1024, h:768},
      '9:16': {w:576, h:1024}
    };
    const s = sizeMap[activeRatio];
    const encodedPrompt = encodeURIComponent(prompt || 'Random abstract shape');
    setResult(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=${s.w}&height=${s.h}&nologo=true&seed=${seed}`);
    setGenerating(false);
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
    triggerGenerate();
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `nextflow-realtime-${Date.now()}.jpg`;
    a.click();
    addAsset({ url: result, prompt: prompt, tool: 'realtime', ratio: activeRatio });
  };

  return (
    <div className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans">
      
      {/* GLOBAL STATUS CORNERS */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#1a1c23] px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
          <span className="text-[12px] font-medium text-zinc-300">Fast</span>
        </div>
        <div className="bg-[#1a1c23] px-3 py-1.5 rounded-full border border-white/5">
          <span className="text-[12px] font-medium text-zinc-400">Remaining free usage: <span className="text-white">99%</span></span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50 flex items-center gap-3">
        <button className="p-2.5 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5">
          <LayoutTemplate className="w-4 h-4 text-zinc-400" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5 text-[12px] font-medium text-zinc-300">
          <Box className="w-4 h-4 text-blue-400" /> Model
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5 text-[12px] font-medium text-zinc-300">
          <Sparkles className="w-4 h-4 text-zinc-400" /> Send to Upscale
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1c23] hover:bg-[#2a2c35] transition-colors rounded-xl border border-white/5 text-[12px] font-medium text-zinc-300">
          <Video className="w-4 h-4 text-zinc-400" /> Record
        </button>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl text-[12px] font-bold">
          <Download className="w-4 h-4" /> Save
        </button>
      </div>

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="flex w-full h-full pb-32">
        {/* Left Side: Input Canvas */}
        <div className="flex-1 border-r border-[#222] relative flex flex-col items-center justify-center bg-[#000] p-8">
           <div className={`relative aspect-square w-full max-w-[70vh] bg-[#1c1c1c] rounded-lg overflow-hidden shadow-2xl transition-opacity ${drawEnabled ? 'opacity-100' : 'opacity-40'}`}>
              <canvas
                ref={canvasRef}
                width={1024}
                height={1024}
                className={`w-full h-full ${tool === 'pointer' ? 'cursor-default' : 'cursor-crosshair'}`}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
              />
           </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[#0u0u0u] p-8">
           <div className="relative aspect-square w-full max-w-[70vh] bg-[#111] rounded-lg overflow-hidden shadow-2xl border border-white/5">
              {generating && (
                <div className="absolute inset-0 bg-white/5 z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              {result && (
                <img 
                  src={result} 
                  alt="Generation" 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${generating ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
                />
              )}
           </div>
        </div>
      </div>

      {/* FLOATING PROMPT HUB (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[680px] z-[100] flex flex-col items-center gap-3">
        
        {/* Drawing Tools Palette */}
        {drawEnabled && (
          <div className="bg-[#2a2c35] border border-white/10 shadow-xl rounded-full px-2 py-1.5 flex items-center justify-center gap-1 mb-1 animate-in fade-in slide-in-from-bottom-2">
            <button onClick={() => setTool('pointer')} className={`p-2 rounded-full transition-colors ${tool === 'pointer' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
              <MousePointer2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            
            <button onClick={() => setTool('brush')} className={`relative p-2 rounded-full transition-colors ${tool === 'brush' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
              <Brush className="w-4 h-4" />
              {tool === 'brush' && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border border-[#2a2c35] rounded-full" style={{ backgroundColor: brushColor }} />}
            </button>
            
            <button onClick={() => setTool('eraser')} className={`p-2 rounded-full transition-colors ${tool === 'eraser' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
              <Eraser className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-white/10 mx-1" />
            
            <button onClick={() => clearCanvas()} className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors" title="Clear Canvas">
               <RotateCcw className="w-4 h-4" />
            </button>

            <button onClick={() => setTool('circle')} className={`p-2 rounded-full transition-colors ${tool === 'circle' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
              <Circle className="w-4 h-4" />
            </button>
            <button onClick={() => setTool('square')} className={`p-2 rounded-full transition-colors ${tool === 'square' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}>
              <SquareIcon className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-white/10 mx-1" />
            
            <button className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></button>
            <button className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"><Folder className="w-4 h-4" /></button>
            
            <div className="w-px h-4 bg-white/10 mx-1" />
            
            <button className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"><Sparkles className="w-4 h-4" /></button>
            <button className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors"><Camera className="w-4 h-4" /></button>
          </div>
        )}

        {/* Floating Prompt Pill */}
        <div className="bg-[#1a1c23] border border-white/10 rounded-3xl p-2.5 flex flex-col gap-2 shadow-[0_15px_60px_rgba(0,0,0,0.6)] w-full">
          
          <div className="px-4 pt-2">
             <textarea
               value={prompt}
               onChange={(e) => {
                 setPrompt(e.target.value);
                 debouncedGenerate();
               }}
               placeholder="Describe what you want to generate..."
               className="w-full bg-transparent text-[15px] text-white placeholder:text-zinc-500 outline-none font-medium resize-none min-h-[44px]"
             />
          </div>

          <div className="flex items-center gap-2 px-1 relative">
             
             {/* Popovers */}
             <AnimatePresence>
               {showModes && (
                 <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.1 }} className="absolute bottom-[calc(100%+8px)] left-0 w-[200px] bg-[#2a2c35] border border-white/10 shadow-2xl rounded-2xl p-1.5 origin-bottom-left">
                   {MODES.map(m => (
                     <button key={m.id} onClick={() => { setActiveMode(m); setShowModes(false); triggerGenerate(); }} className={`w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium ${activeMode.id === m.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                       {m.name}
                     </button>
                   ))}
                 </motion.div>
               )}
               {showRatios && (
                 <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.1 }} className="absolute bottom-[calc(100%+8px)] left-[180px] w-[260px] bg-[#2a2c35] border border-white/10 shadow-2xl rounded-2xl p-2 origin-bottom grid grid-cols-4 gap-1.5">
                   {RATIOS.map(r => (
                     <button key={r} onClick={() => { setActiveRatio(r); setShowRatios(false); triggerGenerate(); }} className={`py-2 text-center rounded-xl text-[12px] font-medium ${activeRatio === r ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
                       {r}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Action Pills */}
             <button onClick={() => { setShowModes(!showModes); setShowRatios(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2c35] hover:bg-[#3a3c45] border border-transparent text-white rounded-full text-[12px] font-medium transition-colors">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop" className="w-4 h-4 rounded-full object-cover" alt="Model" /> 
                {activeMode.name}
             </button>

             <button 
               onClick={() => setDrawEnabled(!drawEnabled)} 
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${drawEnabled ? 'bg-white/10 text-white border-white/20' : 'bg-[#2a2c35] text-zinc-400 hover:bg-[#3a3c45]'}`}
             >
                <Brush className="w-3.5 h-3.5" /> Draw
             </button>

             <button onClick={() => { setShowRatios(!showRatios); setShowModes(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2c35] hover:bg-[#3a3c45] border border-transparent text-white rounded-full text-[12px] font-medium transition-colors">
                <Box className="w-3.5 h-3.5 opacity-70" /> {activeRatio}
             </button>

             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2c35] hover:bg-[#3a3c45] border border-transparent text-white rounded-full text-[12px] font-medium transition-colors">
                <Eye className="w-3.5 h-3.5 opacity-70" /> Examples
             </button>

             <button onClick={randomizeSeed} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2c35] hover:bg-[#3a3c45] border border-transparent text-white rounded-full text-[12px] font-medium transition-colors ml-auto group">
                <RotateCcw className="w-3 h-3 opacity-70 group-hover:-rotate-90 transition-transform" /> Seed
             </button>
             
          </div>

        </div>
      </div>

    </div>
  );
}
