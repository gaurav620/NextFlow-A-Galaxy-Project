'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Download, ChevronDown, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ImageGenNode({ id, data }: any) {
  const { theme } = useTheme();
  
  const [model, setModel] = useState('Flux 2');
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resultUrl, setResultUrl] = useState(data.resultUrl || '');
  const [copied, setCopied] = useState(false);

  const promptConnected = data.promptConnected || false;

  useEffect(() => {
    if (data.output && typeof data.output === 'string' && (data.output.startsWith('http') || data.output.startsWith('data:image'))) {
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
    a.download = `krea-clone-${Date.now()}.png`;
    a.click();
  };

  const dark = theme === 'dark';

  return (
    <div className={`relative rounded-2xl w-[320px] transition-all ${dark ? 'bg-[#1C1C1C] border border-white/10' : 'bg-white border border-black/10'} shadow-2xl`}>
      
      {/* Header Dropdown (Model Select) */}
      <div className={`flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/5' : 'border-black/5'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-[#2A2A2A]' : 'bg-gray-100'}`}>
            <Wand2 className={`w-3.5 h-3.5 ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`} />
          </div>
          <select 
            value={model} 
            onChange={e => {
              setModel(e.target.value);
              import('@/store/workflowStore').then(({ useWorkflowStore }) => {
                useWorkflowStore.getState().updateNodeData(id, { model: e.target.value });
              });
            }}
            className={`bg-transparent outline-none text-[13px] font-semibold cursor-pointer appearance-none ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}
          >
            <option value="nextflow1">NextFlow 1</option>
            <option value="flux">Flux 2</option>
            <option value="nano">Nano Banana</option>
          </select>
          <ChevronDown className={`w-3.5 h-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'} ml-[-4px] pointer-events-none`} />
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Aspect Ratio Picker */}
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Aspect Ratio</div>
          <div className="flex items-center gap-2">
            {['1:1', '16:9', '9:16', '3:2'].map(ratio => (
              <button
                key={ratio}
                onClick={() => {
                  setAspectRatio(ratio);
                  import('@/store/workflowStore').then(({ useWorkflowStore }) => {
                    useWorkflowStore.getState().updateNodeData(id, { aspectRatio: ratio });
                  });
                }}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-colors border ${
                  aspectRatio === ratio
                    ? dark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-black'
                    : dark ? 'bg-transparent border-transparent text-gray-400 hover:bg-white/5' : 'bg-transparent border-transparent text-gray-500 hover:bg-black/5'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input (Hidden if external text node connected) */}
        {!promptConnected && (
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Prompt</div>
            <textarea
              value={prompt}
              onChange={(e) => { 
                setPrompt(e.target.value);
                import('@/store/workflowStore').then(({ useWorkflowStore }) => {
                  useWorkflowStore.getState().updateNodeData(id, { prompt: e.target.value });
                });
              }}
              placeholder="Describe your image..."
              className={`w-full rounded-xl p-3 text-[13px] resize-none h-20 outline-none transition-colors border ${
                dark ? 'bg-[#111] text-[#E0E0E0] border-white/5 placeholder:opacity-40 focus:border-white/20' : 'bg-gray-50 text-gray-800 border-black/5 placeholder:opacity-40 focus:border-black/20'
              }`}
            />
          </div>
        )}

        {/* Executing State */}
        {data.isExecuting && (
          <div className={`w-full relative aspect-[1/1] rounded-xl overflow-hidden ${dark ? 'bg-[#111]' : 'bg-gray-100'} border ${dark ? 'border-white/5' : 'border-black/5'} flex items-center justify-center`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] animate-[shimmer_2s_infinite]" />
            <div className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating...
            </div>
          </div>
        )}

        {/* Result Image */}
        {resultUrl && !data.isExecuting && (
          <div className={`relative w-full aspect-[1/1] rounded-xl overflow-hidden border ${dark ? 'border-white/10' : 'border-black/10'} group`}>
            <img src={resultUrl} alt="Result" className="w-full h-full object-cover" />
            
            {/* Quick Actions Hover */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={downloadImage} className="w-7 h-7 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-md hover:bg-black/80 transition-colors shadow-lg border border-white/10">
                <Download className="w-3.5 h-3.5 text-white" />
              </button>
              <button onClick={copyResult} className="w-7 h-7 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-md hover:bg-black/80 transition-colors shadow-lg border border-white/10">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-500 bg-red-500/10 border border-red-500/20">
            {data.error}
          </div>
        )}
      </div>

      {/* Input Handle for external Text/Prompt */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="prompt" 
        className={`w-3 h-3 border border-white/20 transition-all ${dark ? 'bg-[#333]' : 'bg-[#E5E5E5]'}`} 
        style={{ top: 130, left: -6 }} 
      />

      {/* Output Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output" 
        className={`w-3 h-3 border border-white/20 transition-all ${dark ? 'bg-[#333]' : 'bg-[#E5E5E5]'}`}
        style={{ right: -6, bottom: 40 }} 
      />
    </div>
  );
}
