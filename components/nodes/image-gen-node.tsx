'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Download, ChevronDown, Wand2, Play, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const MODELS = [
  { value: 'nextflow1', label: 'NextFlow 1', badge: null },
  { value: 'flux', label: 'Flux 2', badge: null },
  { value: 'flux-klein', label: 'Flux 2 Klein', badge: null },
  { value: 'nano', label: 'Nano Banana', badge: '🍌' },
  { value: 'nano2', label: 'Nano Banana 2', badge: 'PRO' },
  { value: 'recraft', label: 'Recraft v3', badge: null },
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];

export default function ImageGenNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  
  const [model, setModel] = useState(data.model || 'nextflow1');
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [aspectRatio, setAspectRatio] = useState(data.aspectRatio || '1:1');
  const [resultUrl, setResultUrl] = useState(data.resultUrl || '');
  const [copied, setCopied] = useState(false);
  const [isNodeRunning, setIsNodeRunning] = useState(false);

  const promptConnected = data.promptConnected || false;

  useEffect(() => {
    if (data.output && typeof data.output === 'string' && (data.output.startsWith('http') || data.output.startsWith('data:image'))) {
      setResultUrl(data.output);
    }
  }, [data.output]);

  useEffect(() => {
    setIsNodeRunning(!!data.isExecuting);
  }, [data.isExecuting]);

  const syncToStore = (key: string, value: any) => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      useWorkflowStore.getState().updateNodeData(id, { [key]: value });
    });
  };

  const handleModelChange = (val: string) => {
    setModel(val);
    syncToStore('model', val);
  };

  const handlePromptChange = (val: string) => {
    setPrompt(val);
    syncToStore('prompt', val);
  };

  const handleAspectChange = (val: string) => {
    setAspectRatio(val);
    syncToStore('aspectRatio', val);
  };

  // Run just this single node
  const handleRunNode = async () => {
    const currentPrompt = prompt || data.prompt;
    if (!currentPrompt && !promptConnected) return;
    
    setIsNodeRunning(true);
    syncToStore('isExecuting', true);
    syncToStore('error', undefined);
    
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          count: 1,
          modelId: model,
          aspectRatio,
          resolution: '1K'
        }),
      });
      const resData = await res.json();
      if (resData.success && resData.images?.[0]) {
        setResultUrl(resData.images[0]);
        syncToStore('output', resData.images[0]);
      } else {
        syncToStore('error', resData.error || 'Generation failed');
      }
    } catch (err: any) {
      syncToStore('error', err.message);
    } finally {
      setIsNodeRunning(false);
      syncToStore('isExecuting', false);
    }
  };

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.setNodes((store.nodes || []).filter((n: any) => n.id !== id));
    });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `nextflow-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className={`relative rounded-2xl w-[340px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}>
      
      {/* Header with Model Select */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <select 
            value={model} 
            onChange={e => handleModelChange(e.target.value)}
            className={`bg-transparent outline-none text-[13px] font-semibold cursor-pointer appearance-none pr-4 ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}
          >
            {MODELS.map(m => (
              <option key={m.value} value={m.value}>{m.label}{m.badge === 'PRO' ? ' ⚡' : m.badge ? ` ${m.badge}` : ''}</option>
            ))}
          </select>
          <ChevronDown className={`w-3.5 h-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'} -ml-3 pointer-events-none`} />
        </div>
        <div className="flex items-center gap-1">
          {/* Run this node */}
          <button 
            onClick={handleRunNode} 
            disabled={isNodeRunning || (!prompt && !promptConnected)}
            title="Run this node"
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isNodeRunning 
                ? (dark ? 'bg-green-500/20 text-green-400' : 'bg-green-500/20 text-green-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-green-400' : 'hover:bg-black/5 text-gray-400 hover:text-green-600')
            }`}
          >
            {isNodeRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleDelete} title="Delete node" className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100 ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        
        {/* Aspect Ratio Picker */}
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Aspect Ratio</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ASPECT_RATIOS.map(ratio => (
              <button
                key={ratio}
                onClick={() => handleAspectChange(ratio)}
                className={`px-2.5 py-1.5 text-[10px] font-medium rounded-lg transition-all border ${
                  aspectRatio === ratio
                    ? dark ? 'bg-white/10 border-white/20 text-white shadow-sm' : 'bg-black/5 border-black/10 text-black'
                    : dark ? 'bg-transparent border-white/[0.06] text-gray-500 hover:bg-white/5 hover:text-white' : 'bg-transparent border-black/[0.04] text-gray-400 hover:bg-black/5 hover:text-black'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        {!promptConnected && (
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Prompt</div>
            <textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Describe your image..."
              rows={3}
              className={`w-full rounded-xl p-3 text-[13px] resize-none outline-none transition-colors border leading-relaxed ${
                dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] placeholder:text-gray-600 focus:border-purple-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] placeholder:text-gray-400 focus:border-purple-500/50'
              }`}
            />
          </div>
        )}

        {/* Connected indicator */}
        {promptConnected && (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600 bg-blue-500/10 border-blue-500/20'}`}>
            ✓ Prompt connected from upstream node
          </div>
        )}

        {/* Executing State */}
        {isNodeRunning && (
          <div className={`w-full relative aspect-[1/1] rounded-xl overflow-hidden ${dark ? 'bg-[#111]' : 'bg-gray-100'} border ${dark ? 'border-white/[0.06]' : 'border-black/[0.06]'} flex items-center justify-center`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent w-[200%] animate-[shimmer_2s_infinite]" />
            <div className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'} flex flex-col items-center gap-2`}>
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span>Generating...</span>
              <span className={`text-[10px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{MODELS.find(m => m.value === model)?.label}</span>
            </div>
          </div>
        )}

        {/* Result Image */}
        {resultUrl && !isNodeRunning && (
          <div className={`relative w-full rounded-xl overflow-hidden border ${dark ? 'border-white/[0.08]' : 'border-black/[0.08]'} group/img`}>
            <img src={resultUrl} alt="Generated" className="w-full object-cover" loading="lazy" />
            
            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
              <button onClick={downloadImage} className="w-8 h-8 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-md hover:bg-black/90 transition-colors shadow-lg border border-white/10">
                <Download className="w-4 h-4 text-white" />
              </button>
              <button onClick={copyResult} className="w-8 h-8 flex items-center justify-center bg-black/70 rounded-xl backdrop-blur-md hover:bg-black/90 transition-colors shadow-lg border border-white/10">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Model tag overlay */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
              <span className="text-[10px] px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10">
                {MODELS.find(m => m.value === model)?.label}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {data.error && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">
            ⚠ {data.error}
          </div>
        )}
      </div>

      {/* Input Handle for external Text/Prompt */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="prompt" 
        className="!w-3 !h-3 !border-2 !border-purple-500/50 !bg-purple-500 !rounded-full"
        style={{ top: 130, left: -6 }} 
      />

      {/* Output Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="output" 
        className="!w-3 !h-3 !border-2 !border-purple-500/50 !bg-purple-500 !rounded-full"
        style={{ right: -6, bottom: 40 }} 
      />
    </div>
  );
}
