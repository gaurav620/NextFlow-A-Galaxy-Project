'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Loader2, Sparkles, Play, Trash2, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/workflowStore';

const LLM_MODELS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

export default function LLMNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [model, setModel] = useState(data.model || 'gemini-2.0-flash');
  const [systemPrompt, setSystemPrompt] = useState(data.systemPrompt || '');
  const [userMessage, setUserMessage] = useState(data.userMessage || '');
  const [result, setResult] = useState(data.result || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const edges = useWorkflowStore((state) => state.edges);

  const { systemConnected, userConnected } = useMemo(() => {
    const edgeList = Array.isArray(edges) ? edges : [];
    return {
      systemConnected: edgeList.some((e: any) => e.target === id && e.targetHandle === 'system_prompt'),
      userConnected: edgeList.some((e: any) => e.target === id && e.targetHandle === 'user_message'),
    };
  }, [edges, id]);

  useEffect(() => {
    if (data.output && typeof data.output === 'string') {
      setResult(data.output);
    }
  }, [data.output]);

  const syncToStore = (key: string, value: any) => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      useWorkflowStore.getState().updateNodeData(id, { [key]: value });
    });
  };

  const handleRun = async () => {
    setIsExecuting(true);
    syncToStore('isExecuting', true);
    syncToStore('error', undefined);
    
    try {
      const store = await import('@/store/workflowStore').then(m => m.useWorkflowStore.getState());
      const edges = store.edges;
      const sysSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'system_prompt')?.source;
      const userSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'user_message')?.source;
      const imgSourceIds = edges.filter((e: any) => e.target === id && e.targetHandle === 'images').map((e: any) => e.source);

      const finalSystemPrompt = sysSourceId ? String(store.nodeOutputs[sysSourceId] || '') : systemPrompt;
      const finalUserMessage = userSourceId ? String(store.nodeOutputs[userSourceId] || '') : (userMessage || 'Hello');
      const images = imgSourceIds.map((sid: string) => store.nodeOutputs[sid]).filter(Boolean);

      const res = await fetch('/api/execute/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          systemPrompt: finalSystemPrompt,
          userMessage: finalUserMessage,
          images: images.length ? images : undefined,
          nodeId: id
        })
      });
      const resultData = await res.json();
      if (resultData.success) {
        store.updateNodeData(id, { output: resultData.output, error: undefined });
        store.setNodeOutput(id, resultData.output);
        setResult(resultData.output);
      } else {
        store.updateNodeData(id, { error: resultData.error });
        setResult(`Error: ${resultData.error}`);
      }
    } catch (err: any) {
      syncToStore('error', err.message);
      setResult(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
      syncToStore('isExecuting', false);
    }
  };

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.setNodes((prevNodes: any) => (Array.isArray(prevNodes) ? prevNodes : []).filter((n: any) => n.id !== id));
    });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-2xl w-[300px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl ${data.isExecuting ? 'node-executing' : ''}`}
      style={isExecuting ? { boxShadow: dark ? '0 0 20px rgba(168,85,247,0.15)' : '0 0 20px rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.4)' } : undefined}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>LLM Generation</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleRun} disabled={isExecuting} title="Run this node"
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-30 ${
              isExecuting ? (dark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/20 text-purple-600')
                : (dark ? 'hover:bg-white/10 text-gray-500 hover:text-purple-400' : 'hover:bg-black/5 text-gray-400 hover:text-purple-600')
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
        {/* Model selector */}
        <div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Model</div>
          <div className="relative">
            <select value={model} onChange={(e) => { setModel(e.target.value); syncToStore('model', e.target.value) }}
              className={`w-full rounded-xl text-[12px] px-3 py-2 outline-none appearance-none cursor-pointer pr-7 transition-colors border ${
                dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] hover:border-white/20' : 'bg-gray-50 text-gray-800 border-black/[0.06] hover:border-black/20'
              }`}>
              {LLM_MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* System prompt */}
        {!systemConnected && (
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>System Prompt</div>
            <textarea value={systemPrompt} onChange={(e) => { setSystemPrompt(e.target.value); syncToStore('systemPrompt', e.target.value) }}
              placeholder="System prompt (optional)..."
              rows={2}
              className={`w-full rounded-xl text-[12px] p-3 resize-none outline-none transition-colors border leading-relaxed ${
                dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] placeholder:text-gray-600 focus:border-purple-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] placeholder:text-gray-400 focus:border-purple-500/50'
              }`}
            />
          </div>
        )}
        {systemConnected && (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600 bg-purple-500/10 border-purple-500/20'}`}>
            ✓ System prompt linked
          </div>
        )}

        {/* User message */}
        {!userConnected && (
          <div>
            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>User Message</div>
            <textarea value={userMessage} onChange={(e) => { setUserMessage(e.target.value); syncToStore('userMessage', e.target.value) }}
              placeholder="User message (required)..."
              rows={3}
              className={`w-full rounded-xl text-[12px] p-3 resize-none outline-none transition-colors border leading-relaxed ${
                dark ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] placeholder:text-gray-600 focus:border-blue-500/50' : 'bg-gray-50 text-gray-800 border-black/[0.06] placeholder:text-gray-400 focus:border-blue-500/50'
              }`}
            />
          </div>
        )}
        {userConnected && (
          <div className={`rounded-xl px-3 py-2 text-[11px] font-medium border ${dark ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600 bg-blue-500/10 border-blue-500/20'}`}>
            ✓ User message linked
          </div>
        )}

        {/* Response area */}
        {result && (
          <div className={`rounded-xl overflow-hidden border ${dark ? 'border-white/[0.06] bg-[#111]' : 'border-black/[0.06] bg-gray-50'}`}>
            <div className={`flex items-center justify-between px-3 py-2 border-b ${dark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${dark ? 'text-purple-400' : 'text-purple-600'}`}>Output</span>
              <button onClick={copyResult} className={`p-1 rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div ref={resultRef} className={`px-3 py-2 text-[11px] leading-relaxed max-h-36 overflow-y-auto ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
              {result}
            </div>
          </div>
        )}

        {/* Error */}
        {data.error && !result.startsWith('Error:') && (
          <div className="rounded-xl px-3 py-2 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20">
            ⚠ {data.error}
          </div>
        )}
      </div>

      {/* Input Handles */}
      <Handle type="target" position={Position.Left} id="system_prompt" 
        className="!w-3 !h-3 !border-2 !border-gray-500/50 !bg-gray-500 !rounded-full" 
        style={{ left: -6, top: 100 }} />
      
      <Handle type="target" position={Position.Left} id="user_message" 
        className="!w-3 !h-3 !border-2 !border-blue-500/50 !bg-blue-500 !rounded-full" 
        style={{ left: -6, top: 150 }} />
      
      <Handle type="target" position={Position.Left} id="images" 
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full" 
        style={{ left: -6, top: 200 }} />

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="output" 
        className="!w-3 !h-3 !border-2 !border-purple-500/50 !bg-purple-500 !rounded-full" 
        style={{ right: -6, bottom: 25 }} />
      
      {/* Handle Labels */}
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-gray-600' : 'text-gray-400'}`} style={{ left: -30, top: 96 }}>SYS</span>
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-blue-500/60' : 'text-blue-500/60'}`} style={{ left: -42, top: 146 }}>PROMPT</span>
      <span className={`absolute text-[8px] font-medium pointer-events-none ${dark ? 'text-green-500/60' : 'text-green-500/60'}`} style={{ left: -36, top: 196 }}>IMAGE</span>
    </div>
  );
}
