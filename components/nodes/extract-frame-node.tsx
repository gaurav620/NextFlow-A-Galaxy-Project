'use client';

import { Handle, Position } from '@xyflow/react';
import { Loader2, Scissors } from 'lucide-react';
import { useState } from 'react';

export default function ExtractFrameNode({ id, data }: any) {
  const [timestamp, setTimestamp] = useState(data.timestamp || 0);
  const [isExecuting, setIsExecuting] = useState(false);

  const videoConnected = data.videoConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      import('@/store/workflowStore').then(({ useWorkflowStore }) => {
        useWorkflowStore.getState().updateNodeData(id, { timestamp });
      });
    }, 2000);
  };

  return (
    <div
      className="relative rounded-2xl w-[240px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl"
      style={{
        border: isExecuting ? '1px solid rgba(234,179,8,0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isExecuting ? '0 0 20px rgba(234,179,8,0.15)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#eab308]" style={{ background: '#eab308' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">Extract Frame</span>
        </div>
        {isExecuting ? (
          <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />
        ) : (
          <Scissors className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Body */}
      <div className="p-2 space-y-2">
        {/* Timestamp input */}
        <div className="flex items-center bg-transparent border border-white/10 rounded-lg overflow-hidden focus-within:border-white/20 transition-colors">
          <label className="text-[9px] text-gray-500 px-2 font-medium border-r border-white/10 bg-white/[0.02] py-2">TIME (S)</label>
          <input
            type="number" min={0} step={0.1} value={timestamp}
            onChange={(e) => { 
               setTimestamp(Number(e.target.value)); 
               import('@/store/workflowStore').then(({ useWorkflowStore }) => {
                 useWorkflowStore.getState().updateNodeData(id, { timestamp: Number(e.target.value) });
               });
            }}
            placeholder="0.0"
            className="bg-transparent text-white text-xs px-2 py-2 w-full focus:outline-none"
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !videoConnected}
          className="text-xs rounded-lg py-1.5 w-full font-medium transition-colors disabled:opacity-50 border border-transparent hover:border-white/10"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          {isExecuting ? 'Extracting...' : 'Extract'}
        </button>
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="video_url" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#f97316] shadow-[0_0_8px_#f97316]" style={{ left: -4, top: 46 }} />
      <span className="absolute text-[8px] text-[#f97316]/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 42 }}>VIDEO</span>

      <Handle type="target" position={Position.Left} id="timestamp" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#6b7280]" style={{ left: -4, top: 80 }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#eab308] shadow-[0_0_8px_#eab308]" style={{ right: -4, bottom: 20 }} />
    </div>
  );
}
