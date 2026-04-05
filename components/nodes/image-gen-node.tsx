'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import Image from 'next/image';

export default function ImageGenNode({ id, data }: any) {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [resultUrl, setResultUrl] = useState(data.resultUrl || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptConnected = data.promptConnected || false;

  const handleRun = async () => {
    // This node's execution is typically handled by the global executor,
    // but if we were to invoke it directly, here it is:
    console.log("Execution is delegated to the workflow executor.");
  };

  // Sync result if global execution updates it
  useEffect(() => {
    if (data.output && typeof data.output === 'string' && data.output.startsWith('http')) {
      setResultUrl(data.output);
    }
  }, [data.output]);

  const copyResult = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `generation-${Date.now()}.png`;
    a.click();
  };

  return (
    <div
      className={`relative rounded-2xl w-[280px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl ${
        data.error ? 'border-red-500/50' : ''
      }`}
      style={{
        border: data.isExecuting ? '1px solid rgba(14,165,233,0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: data.isExecuting ? '0 0 20px rgba(14,165,233,0.15)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#0ea5e9]" style={{ background: '#0ea5e9' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">Image Gen</span>
        </div>
        {data.isExecuting ? (
          <Loader2 className="w-3 h-3 text-[#0ea5e9] animate-spin" />
        ) : (
           <ImageIcon className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Body */}
      <div className="p-2 space-y-2">
        {/* Prompt */}
        {!promptConnected && (
          <textarea
            value={prompt}
            onChange={(e) => { 
                setPrompt(e.target.value);
                useWorkflowStore.getState().updateNodeData(id, { prompt: e.target.value });
             }}
            placeholder="Image prompt (required)..."
            className="rounded-lg text-gray-200 text-xs w-full p-2 resize-none h-16 placeholder-gray-600 focus:outline-none bg-transparent hover:bg-white/[0.02] transition-colors border border-white/[0.04] focus:border-white/10 shadow-inner"
          />
        )}
        {promptConnected && (
          <div className="rounded-lg px-2 py-1.5 text-[10px] text-[#0ea5e9] bg-[#0ea5e9]/10 flex items-center gap-1.5 border border-[#0ea5e9]/20">
            <div className="w-1 h-1 rounded-full bg-[#0ea5e9] animate-pulse" /> Linked
          </div>
        )}

        {/* Output Error */}
        {data.error && (
          <div className="rounded-lg px-2 py-1.5 text-[10px] text-red-400 bg-red-400/10 border border-red-400/20">
            {data.error}
          </div>
        )}

        {/* Response image area */}
        {resultUrl && (
          <div className="rounded-lg overflow-hidden border border-white/[0.04] bg-black/40 mt-2 flex flex-col group relative">
            <div className="w-full aspect-[4/3] relative bg-[#111] overflow-hidden rounded-t-lg">
                <Image src={resultUrl} alt="Generated" fill className="object-cover" />
                
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={downloadImage} className="w-6 h-6 flex items-center justify-center bg-black/60 rounded backdrop-blur-md hover:bg-white/20 transition-colors pointer-events-auto shadow-xl border border-white/10">
                        <Download className="w-3 h-3 text-white" />
                    </button>
                    <button onClick={copyResult} className="w-6 h-6 flex items-center justify-center bg-black/60 rounded backdrop-blur-md hover:bg-white/20 transition-colors pointer-events-auto shadow-xl border border-white/10">
                         {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-white" />}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 border-t border-white/[0.02] bg-[#0a0a0a]">
              <span className="text-[9px] text-gray-500 font-medium tracking-widest uppercase truncate max-w-[200px]">
                {resultUrl}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="prompt" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#0ea5e9] shadow-[0_0_8px_#0ea5e9]" style={{ top: 70, left: -4 }} />
      <span className="absolute text-[8px] text-[#0ea5e9]/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 66 }}>PROMPT</span>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#0ea5e9] shadow-[0_0_8px_#0ea5e9]" style={{ right: -4, bottom: 20 }} />
    </div>
  );
}
