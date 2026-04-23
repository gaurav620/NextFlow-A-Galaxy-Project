'use client';

import { Handle, Position } from '@xyflow/react';
import { Video, Play, Trash2, ChevronDown, Loader2, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/workflowStore';

const MODELS = [
  { value: 'kling26', label: 'Kling 2.6' },
  { value: 'kling21', label: 'Kling 2.1' },
  { value: 'ltx', label: 'LTX Video' },
  { value: 'runway', label: 'Runway Gen-3' },
];

const DURATIONS = ['5s', '10s'];
const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3'];

export default function VideoGenNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [model, setModel] = useState(data.model || 'kling26');
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [duration, setDuration] = useState(data.duration || '5s');
  const [aspectRatio, setAspectRatio] = useState(data.aspectRatio || '16:9');
  const [isExecuting, setIsExecuting] = useState(false);
  const [videoUrl, setVideoUrl] = useState(data.videoUrl || data.output || '');
  const edges = useWorkflowStore((s) => s.edges);

  const promptConnected = useMemo(() => {
    const list = Array.isArray(edges) ? edges : [];
    return list.some((e: any) => e.target === id && e.targetHandle === 'prompt');
  }, [edges, id]);

  const imageConnected = useMemo(() => {
    const list = Array.isArray(edges) ? edges : [];
    return list.some((e: any) => e.target === id && e.targetHandle === 'image_ref');
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
    if (!prompt && !promptConnected) return;
    setIsExecuting(true);
    syncToStore('isExecuting', true);
    syncToStore('error', undefined);

    try {
      const store = await import('@/store/workflowStore').then((m) => m.useWorkflowStore.getState());
      const edgeList = store.edges;

      const promptSrcId = edgeList.find((e: any) => e.target === id && e.targetHandle === 'prompt')?.source;
      const imgSrcId = edgeList.find((e: any) => e.target === id && e.targetHandle === 'image_ref')?.source;

      const finalPrompt = promptSrcId ? String(store.nodeOutputs[promptSrcId] || '') : prompt;
      const imgOutput = imgSrcId ? store.nodeOutputs[imgSrcId] : undefined;

      const body: Record<string, any> = {
        prompt: finalPrompt,
        model,
        duration,
        aspectRatio,
        nodeId: id,
      };

      if (imgOutput && typeof imgOutput === 'string' && imgOutput.startsWith('data:')) {
        const [meta, b64] = imgOutput.split(',');
        body.imageRefBase64 = b64;
        body.imageRefMimeType = meta.replace('data:', '').replace(';base64', '');
      }

      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.success && result.videoUrl) {
        setVideoUrl(result.videoUrl);
        store.updateNodeData(id, { output: result.videoUrl, videoUrl: result.videoUrl, isExecuting: false, error: undefined });
        store.setNodeOutput(id, result.videoUrl);
      } else {
        throw new Error(result.error || 'Video generation failed');
      }
    } catch (err: any) {
      syncToStore('error', err.message);
    } finally {
      setIsExecuting(false);
      syncToStore('isExecuting', false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl w-[300px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}
      style={isExecuting ? { boxShadow: dark ? '0 0 20px rgba(249,115,22,0.15)' : '0 0 20px rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.4)' } : undefined}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-orange-500/20' : 'bg-orange-500/10'}`}>
            <Video className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Generate Video</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleRun} disabled={isExecuting || (!prompt && !promptConnected)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isExecuting ? (dark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500/20 text-orange-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-orange-400' : 'hover:bg-black/5 text-gray-400 hover:text-orange-600')
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
        {/* Model */}
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Model</div>
          <div className="relative">
            <select value={model} onChange={(e) => { setModel(e.target.value); syncToStore('model', e.target.value); }}
              className={`w-full rounded-xl text-[12px] px-3 py-2 outline-none appearance-none cursor-pointer pr-7 border ${dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] hover:border-white/20' : 'bg-gray-50 text-gray-800 border-black/[0.06] hover:border-black/20'}`}>
              {MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Prompt */}
        {promptConnected ? (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-orange-600 bg-orange-500/10 border-orange-500/20'}`}>✓ Prompt linked</div>
        ) : (
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Prompt</div>
            <textarea value={prompt} onChange={(e) => { setPrompt(e.target.value); syncToStore('prompt', e.target.value); }}
              placeholder="Describe your video..." rows={3}
              className={`w-full rounded-xl text-[12px] p-3 resize-none outline-none border leading-relaxed ${dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] placeholder:text-gray-600 focus:border-orange-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] placeholder:text-gray-400 focus:border-orange-500/50'}`}
            />
          </div>
        )}

        {/* Duration + Aspect */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Duration</div>
            <div className="flex gap-1">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => { setDuration(d); syncToStore('duration', d); }}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${duration === d ? (dark ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-600') : (dark ? 'bg-[#111] border-white/[0.06] text-gray-500 hover:border-white/20' : 'bg-gray-50 border-black/[0.06] text-gray-400 hover:border-black/20')}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Ratio</div>
            <div className="relative">
              <select value={aspectRatio} onChange={(e) => { setAspectRatio(e.target.value); syncToStore('aspectRatio', e.target.value); }}
                className={`w-full rounded-xl text-[11px] px-2 py-1.5 outline-none appearance-none cursor-pointer pr-5 border ${dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06]' : 'bg-gray-50 text-gray-800 border-black/[0.06]'}`}>
                {ASPECT_RATIOS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className={`w-2.5 h-2.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>

        {/* Image ref connected indicator */}
        {imageConnected && (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-green-600 bg-green-500/10 border-green-500/20'}`}>✓ Image reference linked</div>
        )}

        {/* Video output */}
        {videoUrl && (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <video src={videoUrl} controls className="w-full rounded-xl" style={{ maxHeight: 160 }} />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-orange-400' : 'text-orange-600'}`}>Output</span>
              <a href={videoUrl} download className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                <Download className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">⚠ {data.error}</div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} id="prompt"
        className="!w-3 !h-3 !border-2 !border-orange-500/50 !bg-orange-500 !rounded-full" style={{ left: -6, top: 100 }} />
      <Handle type="target" position={Position.Left} id="image_ref"
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full" style={{ left: -6, top: 150 }} />
      <Handle type="source" position={Position.Right} id="output"
        className="!w-3 !h-3 !border-2 !border-orange-500/50 !bg-orange-500 !rounded-full" style={{ right: -6, bottom: 25 }} />
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-orange-500/60' : 'text-orange-500/60'}`} style={{ left: -48, top: 96 }}>PROMPT</span>
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-green-500/60' : 'text-green-500/60'}`} style={{ left: -36, top: 146 }}>IMAGE</span>
    </div>
  );
}
