'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Scissors, Loader2 } from 'lucide-react';
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
      if (data.onChange) {
        data.onChange({ x, y, width, height });
      }
    }, 1500);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-[#1c1c1c] shadow-2xl min-w-[220px] max-w-[260px] transition-all ${
        isExecuting
          ? 'border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse'
          : 'border-white/8 hover:border-white/15'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full" />
          <span className="text-xs font-medium text-gray-200">Crop Image</span>
        </div>
        <div className="flex items-center gap-2">
          {isExecuting && <Loader2 className="w-3.5 h-3.5 text-pink-400 animate-spin" />}
          <Scissors className="w-3.5 h-3.5 text-pink-400" />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">X %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={x}
              onChange={(e) => {
                setX(Number(e.target.value));
                if (data.onChange) data.onChange({ x: Number(e.target.value), y, width, height });
              }}
              className="bg-[#111] border border-white/8 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">Y %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={y}
              onChange={(e) => {
                setY(Number(e.target.value));
                if (data.onChange) data.onChange({ x, y: Number(e.target.value), width, height });
              }}
              className="bg-[#111] border border-white/8 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">W %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value));
                if (data.onChange) data.onChange({ x, y, width: Number(e.target.value), height });
              }}
              className="bg-[#111] border border-white/8 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block mb-1">H %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                if (data.onChange) data.onChange({ x, y, width, height: Number(e.target.value) });
              }}
              className="bg-[#111] border border-white/8 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !imageConnected}
          className="bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 text-xs rounded-xl py-2 w-full font-medium transition-colors disabled:opacity-50"
        >
          {isExecuting ? 'Cropping...' : 'Crop Image'}
        </button>
      </div>

      {/* Target handles - left */}
      <div className="absolute left-[-10px] top-16">
        <Handle
          type="target"
          position={Position.Left}
          id="image_url"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[52px]">Image</span>

      <div className="absolute left-[-10px] top-[88px]">
        <Handle
          type="target"
          position={Position.Left}
          id="x_percent"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[82px]">X</span>

      <div className="absolute left-[-10px] top-[112px]">
        <Handle
          type="target"
          position={Position.Left}
          id="y_percent"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[106px]">Y</span>

      <div className="absolute left-[-10px] top-[136px]">
        <Handle
          type="target"
          position={Position.Left}
          id="width_percent"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[130px]">W</span>

      <div className="absolute left-[-10px] top-[160px]">
        <Handle
          type="target"
          position={Position.Left}
          id="height_percent"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[154px]">H</span>

      {/* Source handle - right */}
      <div className="absolute right-[-10px] bottom-4">
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>
    </div>
  );
}
