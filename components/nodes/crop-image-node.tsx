'use client';

import { Handle, Position } from '@xyflow/react';
import { Loader2, Crop, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function CropImageNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [x, setX] = useState(data.x || 0);
  const [y, setY] = useState(data.y || 0);
  const [width, setWidth] = useState(data.width || 100);
  const [height, setHeight] = useState(data.height || 100);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

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
      const imgSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'image_url')?.source;
      const imageUrl = imgSourceId ? store.nodeOutputs[imgSourceId] : '';

      if (!imageUrl) throw new Error('No image connected');

      const res = await fetch('/api/execute/crop-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, x, y, width, height, nodeId: id }),
      });
      const resData = await res.json();
      if (resData.success) {
        setResultUrl(resData.output);
        syncToStore({ output: resData.output });
        store.setNodeOutput(id, resData.output);
      } else {
        syncToStore({ error: resData.error || 'Crop failed' });
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

  const inputClass = `w-full rounded-lg text-[12px] px-3 py-1.5 outline-none transition-colors border ${
    dark ? 'bg-[#111] text-white border-white/[0.06] focus:border-pink-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] focus:border-pink-500/50'
  }`;

  return (
    <div className={`relative rounded-2xl w-[260px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-pink-500/20' : 'bg-pink-500/10'}`}>
            <Crop className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Crop Image</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleRun} disabled={isExecuting} title="Run crop"
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isExecuting ? (dark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-500/20 text-pink-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-pink-400' : 'hover:bg-black/5 text-gray-400 hover:text-pink-600')
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
        <div className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Crop Region (%)</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>X</label>
            <input type="number" min={0} max={100} value={x} onChange={e => { setX(Number(e.target.value)); syncToStore({ x: Number(e.target.value) }) }} className={inputClass} />
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Y</label>
            <input type="number" min={0} max={100} value={y} onChange={e => { setY(Number(e.target.value)); syncToStore({ y: Number(e.target.value) }) }} className={inputClass} />
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Width</label>
            <input type="number" min={1} max={100} value={width} onChange={e => { setWidth(Number(e.target.value)); syncToStore({ width: Number(e.target.value) }) }} className={inputClass} />
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Height</label>
            <input type="number" min={1} max={100} value={height} onChange={e => { setHeight(Number(e.target.value)); syncToStore({ height: Number(e.target.value) }) }} className={inputClass} />
          </div>
        </div>

        {/* Result */}
        {resultUrl && !isExecuting && (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
            <img src={resultUrl} alt="Cropped" className="w-full object-cover" />
          </div>
        )}

        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">
            ⚠ {data.error}
          </div>
        )}
      </div>

      {/* Input Handle */}
      <Handle type="target" position={Position.Left} id="image_url"
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full"
        style={{ left: -6, top: '50%' }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output"
        className="!w-3 !h-3 !border-2 !border-pink-500/50 !bg-pink-500 !rounded-full"
        style={{ right: -6, bottom: 25 }} />
    </div>
  );
}
