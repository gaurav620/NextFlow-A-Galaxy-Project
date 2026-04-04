'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CropImageNode({ data }: NodeProps) {
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
      className="relative rounded-2xl min-w-[220px] max-w-[260px] transition-all"
      style={{
        background: '#1c1c1c',
        border: isExecuting ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isExecuting ? '0 0 20px rgba(236,72,153,0.2)' : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#ec4899' }} />
          <span className="text-xs font-medium text-gray-300">Crop Image</span>
        </div>
        {isExecuting && <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">X %</label>
            <input
              type="number" min={0} max={100} value={x}
              onChange={(e) => { setX(Number(e.target.value)); if (data.onChange) data.onChange({ x: Number(e.target.value), y, width, height }); }}
              className="rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:outline-none"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">Y %</label>
            <input
              type="number" min={0} max={100} value={y}
              onChange={(e) => { setY(Number(e.target.value)); if (data.onChange) data.onChange({ x, y: Number(e.target.value), width, height }); }}
              className="rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:outline-none"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">W %</label>
            <input
              type="number" min={0} max={100} value={width}
              onChange={(e) => { setWidth(Number(e.target.value)); if (data.onChange) data.onChange({ x, y, width: Number(e.target.value), height }); }}
              className="rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:outline-none"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">H %</label>
            <input
              type="number" min={0} max={100} value={height}
              onChange={(e) => { setHeight(Number(e.target.value)); if (data.onChange) data.onChange({ x, y, width, height: Number(e.target.value) }); }}
              className="rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:outline-none"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
            />
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !imageConnected}
          className="text-xs rounded-full py-2 w-full font-medium transition-colors disabled:opacity-50"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          {isExecuting ? 'Cropping...' : 'Crop Image'}
        </button>
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="image_url" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#22c55e', left: -5, top: 60 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 54 }}>Image</span>

      <Handle type="target" position={Position.Left} id="x_percent" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 100 }} />
      <Handle type="target" position={Position.Left} id="y_percent" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 130 }} />
      <Handle type="target" position={Position.Left} id="width_percent" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 160 }} />
      <Handle type="target" position={Position.Left} id="height_percent" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 190 }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#ec4899', right: -5, bottom: 20 }} />
    </div>
  );
}
