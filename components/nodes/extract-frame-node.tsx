'use client';

import { Handle, Position } from '@xyflow/react';
import { Loader2, Film, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function ExtractFrameNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [timestamp, setTimestamp] = useState(data.timestamp || 0);
  const [isExecuting, setIsExecuting] = useState(false);

  const syncToStore = (vals: Record<string, any>) => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      useWorkflowStore.getState().updateNodeData(id, vals);
    });
  };

  const handleRun = async () => {
    setIsExecuting(true);
    syncToStore({ isExecuting: true, error: undefined });

    try {
      const store = await import('@/store/workflowStore').then(m => m.useWorkflowStore.getState());
      const edges = store.edges;
      const vidSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'video_url')?.source;
      const videoUrl = vidSourceId ? store.nodeOutputs[vidSourceId] : '';

      if (!videoUrl) throw new Error('No video connected');

      const res = await fetch('/api/execute/extract-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, timestamp, nodeId: id }),
      });
      const resData = await res.json();
      if (resData.success) {
        syncToStore({ output: resData.output });
        store.setNodeOutput(id, resData.output);
      } else {
        syncToStore({ error: resData.error || 'Extract failed' });
      }
    } catch (err: any) {
      syncToStore({ error: err.message });
    } finally {
      setIsExecuting(false);
      syncToStore({ isExecuting: false });
    }
  };

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.setNodes((store.nodes || []).filter((n: any) => n.id !== id));
    });
  };

  return (
    <div className={`relative rounded-2xl w-[260px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-yellow-500/20' : 'bg-yellow-500/10'}`}>
            <Film className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Extract Frame</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleRun} disabled={isExecuting} title="Run extract"
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isExecuting ? (dark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-500/20 text-yellow-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-yellow-400' : 'hover:bg-black/5 text-gray-400 hover:text-yellow-600')
            }`}>
            {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleDelete} title="Delete" className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100 ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Timestamp (seconds)</div>
          <input
            type="number" min={0} step={0.1} value={timestamp}
            onChange={e => { setTimestamp(Number(e.target.value)); syncToStore({ timestamp: Number(e.target.value) }) }}
            className={`w-full rounded-xl text-[12px] px-3 py-2 outline-none transition-colors border ${
              dark ? 'bg-[#111] text-white border-white/[0.06] focus:border-yellow-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] focus:border-yellow-500/50'
            }`}
          />
        </div>

        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">
            ⚠ {data.error}
          </div>
        )}
      </div>

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} id="video_url"
        className="!w-3 !h-3 !border-2 !border-orange-500/50 !bg-orange-500 !rounded-full"
        style={{ left: -6, top: '50%' }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output"
        className="!w-3 !h-3 !border-2 !border-yellow-500/50 !bg-yellow-500 !rounded-full"
        style={{ right: -6, bottom: 25 }} />
    </div>
  );
}
