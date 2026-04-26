'use client';

import { Handle, Position } from '@xyflow/react';
import { Loader2, Crop, Play, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/workflowStore';

export default function CropImageNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [x, setX] = useState(data.x || 0);
  const [y, setY] = useState(data.y || 0);
  const [width, setWidth] = useState(data.width || 100);
  const [height, setHeight] = useState(data.height || 100);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const edges = useWorkflowStore((state) => state.edges);

  const connectedHandles = useMemo(() => {
    const connected = new Set<string>();
    const edgeList = Array.isArray(edges) ? edges : [];
    edgeList.forEach((e: any) => {
      if (e.target === id && e.targetHandle) connected.add(e.targetHandle);
    });
    return connected;
  }, [edges, id]);

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
      const xSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'x_percent')?.source;
      const ySourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'y_percent')?.source;
      const wSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'width_percent')?.source;
      const hSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'height_percent')?.source;

      const imageUrl = imgSourceId ? store.nodeOutputs[imgSourceId] : '';
      const finalX = xSourceId ? Number(store.nodeOutputs[xSourceId]) : x;
      const finalY = ySourceId ? Number(store.nodeOutputs[ySourceId]) : y;
      const finalW = wSourceId ? Number(store.nodeOutputs[wSourceId]) : width;
      const finalH = hSourceId ? Number(store.nodeOutputs[hSourceId]) : height;

      if (!imageUrl) throw new Error('No image connected');

      const res = await fetch('/api/execute/crop-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, x: finalX, y: finalY, width: finalW, height: finalH, nodeId: id }),
      });
      const resData = await (async () => {
        try { return await res.json(); } catch {
          throw new Error(res.status === 504 ? 'Gateway timeout — try again' : `Server error ${res.status}`);
        }
      })();
      if (!res.ok || !resData.success) throw new Error(resData?.error || 'Crop failed');
      setResultUrl(resData.output);
      syncToStore({ output: resData.output });
      store.setNodeOutput(id, resData.output);
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
      store.setNodes((prevNodes: any) => (Array.isArray(prevNodes) ? prevNodes : []).filter((n: any) => n.id !== id));
    });
  };

  const inputClass = (disabled: boolean) => `w-full rounded-lg text-[12px] px-3 py-1.5 outline-none transition-colors border ${
    disabled
      ? (dark ? 'bg-purple-500/5 text-purple-400/50 border-purple-500/20 cursor-not-allowed' : 'bg-purple-500/5 text-purple-400/50 border-purple-500/20 cursor-not-allowed')
      : (dark ? 'bg-[#111] text-white border-white/[0.06] focus:border-pink-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] focus:border-pink-500/50')
  }`;

  return (
    <div
      className={`relative rounded-2xl w-[280px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl ${data.isExecuting ? 'node-executing' : ''}`}
    >
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
            {connectedHandles.has('x_percent') ? (
              <div className={`rounded-lg px-3 py-1.5 text-[11px] font-medium border ${dark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-500/10 border-purple-500/20'}`}>✓ Linked</div>
            ) : (
              <input type="number" min={0} max={100} value={x} onChange={e => { setX(Number(e.target.value)); syncToStore({ x: Number(e.target.value) }) }} className={inputClass(false)} />
            )}
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Y</label>
            {connectedHandles.has('y_percent') ? (
              <div className={`rounded-lg px-3 py-1.5 text-[11px] font-medium border ${dark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-500/10 border-purple-500/20'}`}>✓ Linked</div>
            ) : (
              <input type="number" min={0} max={100} value={y} onChange={e => { setY(Number(e.target.value)); syncToStore({ y: Number(e.target.value) }) }} className={inputClass(false)} />
            )}
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Width</label>
            {connectedHandles.has('width_percent') ? (
              <div className={`rounded-lg px-3 py-1.5 text-[11px] font-medium border ${dark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-500/10 border-purple-500/20'}`}>✓ Linked</div>
            ) : (
              <input type="number" min={1} max={100} value={width} onChange={e => { setWidth(Number(e.target.value)); syncToStore({ width: Number(e.target.value) }) }} className={inputClass(false)} />
            )}
          </div>
          <div>
            <label className={`text-[9px] font-medium mb-0.5 block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Height</label>
            {connectedHandles.has('height_percent') ? (
              <div className={`rounded-lg px-3 py-1.5 text-[11px] font-medium border ${dark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-500/10 border-purple-500/20'}`}>✓ Linked</div>
            ) : (
              <input type="number" min={1} max={100} value={height} onChange={e => { setHeight(Number(e.target.value)); syncToStore({ height: Number(e.target.value) }) }} className={inputClass(false)} />
            )}
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

      {/* ── INPUT HANDLES ──
          Header = ~44px, so image_url handle at ~44
          Crop inputs start at ~90px (after "Crop Region" label)
          X row at ~112, Y row at ~148, W row at ~184, H row at ~220 */}

      {/* Image URL */}
      <Handle type="target" position={Position.Left} id="image_url"
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full"
        style={{ left: -6, top: 44 }} />
      <span className={`absolute text-[7px] font-bold pointer-events-none select-none ${dark ? 'text-green-400' : 'text-green-600'}`}
        style={{ left: -34, top: 39 }}>IMG</span>

      {/* X percent */}
      <Handle type="target" position={Position.Left} id="x_percent"
        className="!w-2.5 !h-2.5 !border-2 !border-pink-500/40 !bg-pink-500 !rounded-full"
        style={{ left: -5, top: 117 }} />
      <span className={`absolute text-[7px] font-bold pointer-events-none select-none ${dark ? 'text-pink-400' : 'text-pink-600'}`}
        style={{ left: -14, top: 113 }}>X</span>

      {/* Y percent */}
      <Handle type="target" position={Position.Left} id="y_percent"
        className="!w-2.5 !h-2.5 !border-2 !border-pink-500/40 !bg-pink-500 !rounded-full"
        style={{ left: -5, top: 153 }} />
      <span className={`absolute text-[7px] font-bold pointer-events-none select-none ${dark ? 'text-pink-400' : 'text-pink-600'}`}
        style={{ left: -14, top: 149 }}>Y</span>

      {/* Width percent */}
      <Handle type="target" position={Position.Left} id="width_percent"
        className="!w-2.5 !h-2.5 !border-2 !border-pink-500/40 !bg-pink-500 !rounded-full"
        style={{ left: -5, top: 189 }} />
      <span className={`absolute text-[7px] font-bold pointer-events-none select-none ${dark ? 'text-pink-400' : 'text-pink-600'}`}
        style={{ left: -14, top: 185 }}>W</span>

      {/* Height percent */}
      <Handle type="target" position={Position.Left} id="height_percent"
        className="!w-2.5 !h-2.5 !border-2 !border-pink-500/40 !bg-pink-500 !rounded-full"
        style={{ left: -5, top: 225 }} />
      <span className={`absolute text-[7px] font-bold pointer-events-none select-none ${dark ? 'text-pink-400' : 'text-pink-600'}`}
        style={{ left: -14, top: 221 }}>H</span>

      {/* ── OUTPUT HANDLE — centered vertically ── */}
      <Handle type="source" position={Position.Right} id="output"
        className="!w-3 !h-3 !border-2 !border-pink-500/50 !bg-pink-500 !rounded-full"
        style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
}
