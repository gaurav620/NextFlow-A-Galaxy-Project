'use client';

import { Handle, Position } from '@xyflow/react';
import { Loader2, Crop } from 'lucide-react';
import { useState } from 'react';

export default function CropImageNode({ data }: any) {
  const [x, setX] = useState(data.x || 0);
  const [y, setY] = useState(data.y || 0);
  const [width, setWidth] = useState(data.width || 100);
  const [height, setHeight] = useState(data.height || 100);
  const [isExecuting, setIsExecuting] = useState(false);

  const imageConnected = data.imageConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (data.onChange) data.onChange({ x, y, width, height });
    }, 1500);
  };

  return (
    <div
      className="relative rounded-2xl w-[240px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl"
      style={{
        border: isExecuting ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isExecuting ? '0 0 20px rgba(236,72,153,0.15)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#ec4899]" style={{ background: '#ec4899' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">Crop Image</span>
        </div>
        {isExecuting ? (
          <Loader2 className="w-3 h-3 text-pink-500 animate-spin" />
        ) : (
          <Crop className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Body */}
      <div className="p-2 space-y-2">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
            <label className="text-[9px] text-gray-500 px-2 font-medium border-r border-white/10 bg-white/[0.02] py-1.5">X</label>
            <input
              type="number" min={0} max={100} value={x}
              onChange={(e) => { setX(Number(e.target.value)); if (data.onChange) data.onChange({ x: Number(e.target.value), y, width, height }); }}
              className="bg-transparent text-white text-xs px-2 py-1.5 w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
            <label className="text-[9px] text-gray-500 px-2 font-medium border-r border-white/10 bg-white/[0.02] py-1.5">Y</label>
            <input
              type="number" min={0} max={100} value={y}
              onChange={(e) => { setY(Number(e.target.value)); if (data.onChange) data.onChange({ x, y: Number(e.target.value), width, height }); }}
              className="bg-transparent text-white text-xs px-2 py-1.5 w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
            <label className="text-[9px] text-gray-500 px-2 font-medium border-r border-white/10 bg-white/[0.02] py-1.5">W</label>
            <input
              type="number" min={0} max={100} value={width}
              onChange={(e) => { setWidth(Number(e.target.value)); if (data.onChange) data.onChange({ x, y, width: Number(e.target.value), height }); }}
              className="bg-transparent text-white text-xs px-2 py-1.5 w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
            <label className="text-[9px] text-gray-500 px-2 font-medium border-r border-white/10 bg-white/[0.02] py-1.5">H</label>
            <input
              type="number" min={0} max={100} value={height}
              onChange={(e) => { setHeight(Number(e.target.value)); if (data.onChange) data.onChange({ x, y, width, height: Number(e.target.value) }); }}
              className="bg-transparent text-white text-xs px-2 py-1.5 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !imageConnected}
          className="text-xs rounded-lg py-1.5 w-full font-medium transition-colors disabled:opacity-50 border border-transparent hover:border-white/10"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          {isExecuting ? 'Cropping...' : 'Crop'}
        </button>
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="image_url" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#22c55e] shadow-[0_0_8px_#22c55e]" style={{ left: -4, top: 46 }} />
      <span className="absolute text-[8px] text-[#22c55e]/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 42 }}>IMAGE</span>

      <Handle type="target" position={Position.Left} id="x_percent" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#6b7280]" style={{ left: -4, top: 80 }} />
      <Handle type="target" position={Position.Left} id="y_percent" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#6b7280]" style={{ left: -4, top: 96 }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#ec4899] shadow-[0_0_8px_#ec4899]" style={{ right: -4, bottom: 20 }} />
    </div>
  );
}
