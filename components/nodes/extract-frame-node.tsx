'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Film, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ExtractFrameNode({ data }: NodeProps) {
  const [timestamp, setTimestamp] = useState(data.timestamp || 0);
  const [isExecuting, setIsExecuting] = useState(false);

  const videoConnected = data.videoConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (data.onChange) {
        data.onChange({ timestamp });
      }
    }, 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-[#1c1c1c] shadow-2xl min-w-[220px] max-w-[260px] transition-all ${
        isExecuting
          ? 'border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-pulse'
          : 'border-white/8 hover:border-white/15'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-xs font-medium text-gray-200">Extract Frame</span>
        </div>
        <div className="flex items-center gap-2">
          {isExecuting && <Loader2 className="w-3.5 h-3.5 text-yellow-400 animate-spin" />}
          <Film className="w-3.5 h-3.5 text-yellow-400" />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Timestamp input */}
        <div>
          <label className="text-[10px] text-gray-600 block mb-1">Timestamp (sec)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={timestamp}
            onChange={(e) => {
              setTimestamp(Number(e.target.value));
              if (data.onChange) data.onChange({ timestamp: Number(e.target.value) });
            }}
            placeholder="0.0"
            className="bg-[#111] border border-white/8 rounded-xl text-white text-xs px-3 py-2 w-full focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        {/* Helper text */}
        <p className="text-[10px] text-gray-600">Use percentage like 50%</p>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !videoConnected}
          className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 text-xs rounded-xl py-2 w-full font-medium transition-colors disabled:opacity-50"
        >
          {isExecuting ? 'Extracting...' : 'Extract Frame'}
        </button>
      </div>

      {/* Target handles - left */}
      <div className="absolute left-[-10px] top-16">
        <Handle
          type="target"
          position={Position.Left}
          id="video_url"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[52px]">Video</span>

      <div className="absolute left-[-10px] top-[96px]">
        <Handle
          type="target"
          position={Position.Left}
          id="timestamp"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[90px]">Time</span>

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
