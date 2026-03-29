'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ExtractFrameNode({ data }: NodeProps) {
  const [timestamp, setTimestamp] = useState(data.timestamp || 0);
  const [isExecuting, setIsExecuting] = useState(false);

  const videoConnected = data.videoConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (data.onChange) data.onChange({ timestamp });
    }, 2000);
  };

  return (
    <div
      className="relative rounded-2xl min-w-[220px] max-w-[260px] transition-all"
      style={{
        background: '#1c1c1c',
        border: isExecuting ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isExecuting ? '0 0 20px rgba(234,179,8,0.2)' : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#eab308' }} />
          <span className="text-xs font-medium text-gray-300">Extract Frame</span>
        </div>
        {isExecuting && <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Timestamp input */}
        <div>
          <label className="text-[10px] text-gray-600 block mb-1">Timestamp (sec)</label>
          <input
            type="number" min={0} step={0.1} value={timestamp}
            onChange={(e) => { setTimestamp(Number(e.target.value)); if (data.onChange) data.onChange({ timestamp: Number(e.target.value) }); }}
            placeholder="0.0"
            className="rounded-xl text-white text-xs px-3 py-2 w-full focus:outline-none"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        </div>

        <p className="text-[10px] text-gray-600">Use percentage like 50%</p>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !videoConnected}
          className="text-xs rounded-full py-2 w-full font-medium transition-colors disabled:opacity-50"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          {isExecuting ? 'Extracting...' : 'Extract Frame'}
        </button>
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="video_url" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#f97316', left: -5, top: 60 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 54 }}>Video</span>

      <Handle type="target" position={Position.Left} id="timestamp" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 100 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 94 }}>Time</span>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#eab308', right: -5, bottom: 20 }} />
    </div>
  );
}
