'use client';

import { Handle, Position } from '@xyflow/react';
import { MonitorPlay, Copy, Check, Download, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/workflowStore';

function isImageUrl(s: string) {
  return /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i.test(s) || s.startsWith('data:image');
}

function isVideoUrl(s: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(s) || s.startsWith('blob:');
}

export default function OutputNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const nodeOutputs = useWorkflowStore((s) => s.nodeOutputs);

  // Prefer live nodeOutputs (after execution) over persisted data.output
  const value: string = String(nodeOutputs[id] || data.output || '');

  // Keep store in sync when data.output changes (e.g. after page load from DB)
  const setNodeOutput = useWorkflowStore((s) => s.setNodeOutput);
  useEffect(() => {
    if (data.output && !nodeOutputs[id]) {
      setNodeOutput(id, data.output);
    }
  }, [data.output, id, nodeOutputs, setNodeOutput]);

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const s = useWorkflowStore.getState();
      s.setNodes((prev: any[]) => (Array.isArray(prev) ? prev : []).filter((n: any) => n.id !== id));
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImg = isImageUrl(value);
  const isVid = isVideoUrl(value);

  return (
    <div className={`relative rounded-2xl w-[280px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
            <MonitorPlay className="w-3.5 h-3.5 text-green-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Output</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {value && (
            <button onClick={handleCopy} className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-500 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
          <button onClick={handleDelete} className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {!value ? (
          <div className={`rounded-xl border border-dashed flex items-center justify-center py-10 ${dark ? 'border-white/10 text-gray-600' : 'border-black/10 text-gray-400'}`}>
            <span className="text-[12px]">Waiting for input…</span>
          </div>
        ) : isImg ? (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <img src={value} alt="Output" className="w-full object-cover rounded-t-xl" style={{ maxHeight: 200 }} />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-green-400' : 'text-green-600'}`}>Image</span>
              <a href={value} download className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                <Download className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : isVid ? (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <video src={value} controls className="w-full rounded-t-xl" style={{ maxHeight: 180 }} />
            <div className={`flex items-center justify-between px-3 py-2 border-t ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-green-400' : 'text-green-600'}`}>Video</span>
              <a href={value} download className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                <Download className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl border ${dark ? 'border-white/[0.06] bg-[#111]' : 'border-black/[0.06] bg-gray-50'}`}>
            <div className={`flex items-center justify-between px-3 py-2 border-b ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-green-400' : 'text-green-600'}`}>Text</span>
              <button onClick={handleCopy} className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className={`px-3 py-2 text-[12px] leading-relaxed max-h-40 overflow-y-auto ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              {value}
            </div>
          </div>
        )}
      </div>

      {/* Input handle only — this is a terminal node */}
      <Handle type="target" position={Position.Left} id="input"
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full"
        style={{ left: -6, top: '50%' }} />
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-green-500/60' : 'text-green-500/60'}`} style={{ left: -28, top: 'calc(50% - 6px)' }}>IN</span>
    </div>
  );
}
