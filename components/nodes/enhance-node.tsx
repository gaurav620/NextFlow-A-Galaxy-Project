'use client';

import { Handle, Position } from '@xyflow/react';
import { Wand2, Play, Trash2, Loader2, Download, Copy, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/workflowStore';

const SCALES = [2, 4, 8, 16];

export default function EnhanceNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [scale, setScale] = useState<number>(data.scale || 4);
  const [hdr, setHdr] = useState<boolean>(data.hdr || false);
  const [faceEnhance, setFaceEnhance] = useState<boolean>(data.faceEnhance || false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>(data.output || '');
  const [copied, setCopied] = useState(false);
  const edges = useWorkflowStore((s) => s.edges);

  const imageConnected = useMemo(() => {
    const list = Array.isArray(edges) ? edges : [];
    return list.some((e: any) => e.target === id && e.targetHandle === 'image_url');
  }, [edges, id]);

  const syncToStore = (key: string, value: any) => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      useWorkflowStore.getState().updateNodeData(id, { [key]: value });
    });
  };

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const s = useWorkflowStore.getState();
      s.setNodes((prev: any[]) => (Array.isArray(prev) ? prev : []).filter((n: any) => n.id !== id));
    });
  };

  const handleRun = async () => {
    setIsExecuting(true);
    syncToStore('isExecuting', true);
    syncToStore('error', undefined);

    try {
      const store = await import('@/store/workflowStore').then((m) => m.useWorkflowStore.getState());
      const edgeList = store.edges;
      const imgSrcId = edgeList.find((e: any) => e.target === id && e.targetHandle === 'image_url')?.source;
      const imageUrl: string = imgSrcId ? String(store.nodeOutputs[imgSrcId] || '') : (data.imageUrl || '');

      if (!imageUrl) throw new Error('No image connected — link an image source');

      // Convert URL to base64 for the API
      let imageBase64 = '';
      let mimeType = 'image/jpeg';

      if (imageUrl.startsWith('data:')) {
        const [meta, b64] = imageUrl.split(',');
        imageBase64 = b64;
        mimeType = meta.replace('data:', '').replace(';base64', '');
      } else {
        // Fetch remote image and convert to base64
        const imgRes = await fetch(imageUrl);
        const blob = await imgRes.blob();
        mimeType = blob.type || 'image/jpeg';
        const buf = await blob.arrayBuffer();
        imageBase64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      }

      const res = await fetch('/api/generate/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, scale, hdr, faceEnhance, nodeId: id }),
      });
      const result = await res.json();

      if (result.success && result.enhanced) {
        setResultUrl(result.enhanced);
        store.updateNodeData(id, { output: result.enhanced, isExecuting: false, error: undefined });
        store.setNodeOutput(id, result.enhanced);
      } else {
        throw new Error(result.error || 'Enhancement failed');
      }
    } catch (err: any) {
      syncToStore('error', err.message);
    } finally {
      setIsExecuting(false);
      syncToStore('isExecuting', false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-2xl w-[280px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}
      style={isExecuting ? { boxShadow: dark ? '0 0 20px rgba(236,72,153,0.15)' : '0 0 20px rgba(236,72,153,0.1)', borderColor: 'rgba(236,72,153,0.4)' } : undefined}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-pink-500/20' : 'bg-pink-500/10'}`}>
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Enhance Image</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleRun} disabled={isExecuting || !imageConnected}
            title={!imageConnected ? 'Connect an image source first' : 'Run'}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isExecuting ? (dark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-500/20 text-pink-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-pink-400' : 'hover:bg-black/5 text-gray-400 hover:text-pink-600')
            }`}>
            {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleDelete} className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100 ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Image source */}
        {imageConnected ? (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : 'text-pink-600 bg-pink-500/10 border-pink-500/20'}`}>✓ Image linked</div>
        ) : (
          <div className={`rounded-xl px-3 py-2 text-[11px] border border-dashed ${dark ? 'text-gray-600 border-white/10' : 'text-gray-400 border-black/10'}`}>Connect an image source node</div>
        )}

        {/* Scale */}
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Upscale</div>
          <div className="flex gap-1.5">
            {SCALES.map((s) => (
              <button key={s} onClick={() => { setScale(s); syncToStore('scale', s); }}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${scale === s ? (dark ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-600') : (dark ? 'bg-[#111] border-white/[0.06] text-gray-500 hover:border-white/20' : 'bg-gray-50 border-black/[0.06] text-gray-400 hover:border-black/20')}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-2">
          {[{ key: 'hdr', val: hdr, set: setHdr, label: 'HDR' }, { key: 'faceEnhance', val: faceEnhance, set: setFaceEnhance, label: 'Face' }].map(({ key, val, set, label }) => (
            <button key={key} onClick={() => { const next = !val; set(next); syncToStore(key, next); }}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${val ? (dark ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-600') : (dark ? 'bg-[#111] border-white/[0.06] text-gray-500 hover:border-white/20' : 'bg-gray-50 border-black/[0.06] text-gray-400 hover:border-black/20')}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Result */}
        {resultUrl && (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <img src={resultUrl} alt="Enhanced" className="w-full rounded-t-xl object-cover" style={{ maxHeight: 140 }} />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-pink-400' : 'text-pink-600'}`}>Output</span>
              <div className="flex gap-1">
                <button onClick={copyResult} className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <a href={resultUrl} download className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                  <Download className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">⚠ {data.error}</div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} id="image_url"
        className="!w-3 !h-3 !border-2 !border-pink-500/50 !bg-pink-500 !rounded-full" style={{ left: -6, top: '40%' }} />
      <Handle type="source" position={Position.Right} id="output"
        className="!w-3 !h-3 !border-2 !border-pink-500/50 !bg-pink-500 !rounded-full" style={{ right: -6, bottom: 25 }} />
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-pink-500/60' : 'text-pink-500/60'}`} style={{ left: -32, top: '38%' }}>IMAGE</span>
    </div>
  );
}
