'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function LLMNode({ id, data }: any) {
  const [model, setModel] = useState(data.model || 'gemini-2.0-flash');
  const [systemPrompt, setSystemPrompt] = useState(data.systemPrompt || '');
  const [userMessage, setUserMessage] = useState(data.userMessage || '');
  const [result, setResult] = useState(data.result || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultHeight, setResultHeight] = useState(0);

  const systemConnected = data.systemConnected || false;
  const userConnected = data.userConnected || false;
  const estimatedTokens = result ? Math.ceil(result.length / 4) : 0;

  useEffect(() => {
    if (resultRef.current) {
      setResultHeight(resultRef.current.scrollHeight);
    }
  }, [result]);

  const handleRun = async () => {
    const store = useWorkflowStore.getState();
    store.addExecutingNode(id);
    setIsExecuting(true);
    try {
      const edges = store.edges;
      const sysSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'system_prompt')?.source;
      const userSourceId = edges.find((e: any) => e.target === id && e.targetHandle === 'user_message')?.source;
      const imgSourceIds = edges.filter((e: any) => e.target === id && e.targetHandle === 'images').map((e: any) => e.source);

      const finalSystemPrompt = sysSourceId ? String(store.nodeOutputs[sysSourceId] || '') : systemPrompt;
      const finalUserMessage = userSourceId ? String(store.nodeOutputs[userSourceId] || '') : (userMessage || data.value || 'Hello');
      const images = imgSourceIds.map((id: string) => store.nodeOutputs[id]).filter(Boolean);

      const res = await fetch('/api/execute/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'gemini-2.0-flash',
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
      store.updateNodeData(id, { error: err.message });
      setResult(`Error: ${err.message}`);
    } finally {
      store.removeExecutingNode(id);
      setIsExecuting(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative rounded-2xl w-[280px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md shadow-2xl"
      style={{
        border: isExecuting ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isExecuting ? '0 0 20px rgba(168,85,247,0.15)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#a855f7]" style={{ background: '#a855f7' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">LLM Generation</span>
        </div>
        {isExecuting ? (
          <Loader2 className="w-3 h-3 text-[#a855f7] animate-spin" />
        ) : (
           <Sparkles className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Body */}
      <div className="p-2 space-y-2">
        {/* Model selector */}
        <div className="relative group">
          <select
            value={model}
            onChange={(e) => { setModel(e.target.value); if (data.onChange) data.onChange({ model: e.target.value }); }}
            className="rounded-lg text-xs text-white px-2 py-1.5 w-full focus:outline-none bg-white/[0.02] border border-white/[0.04] appearance-none cursor-pointer pr-6 hover:bg-white/[0.04] transition-colors"
          >
            <option className="bg-[#111]">gemini-2.0-flash</option>
            <option className="bg-[#111]">gemini-1.5-flash</option>
            <option className="bg-[#111]">gemini-1.5-pro</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[8px]">▼</div>
        </div>

        {/* System prompt */}
        {!systemConnected && (
          <textarea
            value={systemPrompt}
            onChange={(e) => { setSystemPrompt(e.target.value); if (data.onChange) data.onChange({ systemPrompt: e.target.value }); }}
            placeholder="System prompt (optional)..."
            className="rounded-lg text-gray-200 text-xs w-full p-2 resize-none h-12 placeholder-gray-600 focus:outline-none bg-transparent hover:bg-white/[0.02] transition-colors border border-transparent focus:border-white/10 shadow-inner"
          />
        )}
        {systemConnected && (
          <div className="rounded-lg px-2 py-1.5 text-[10px] text-[#a855f7] bg-[#a855f7]/10 flex items-center gap-1.5 border border-[#a855f7]/20">
            <div className="w-1 h-1 rounded-full bg-[#a855f7] animate-pulse" /> Linked
          </div>
        )}

        {/* User message */}
        {!userConnected && (
          <textarea
            value={userMessage}
            onChange={(e) => { setUserMessage(e.target.value); if (data.onChange) data.onChange({ userMessage: e.target.value }); }}
            placeholder="User message (required)..."
            className="rounded-lg text-gray-200 text-xs w-full p-2 resize-none h-16 placeholder-gray-600 focus:outline-none bg-transparent hover:bg-white/[0.02] transition-colors border border-transparent focus:border-white/10 shadow-inner"
          />
        )}
        {userConnected && (
          <div className="rounded-lg px-2 py-1.5 text-[10px] text-[#a855f7] bg-[#a855f7]/10 flex items-center gap-1.5 border border-[#a855f7]/20 mt-1">
            <div className="w-1 h-1 rounded-full bg-[#a855f7] animate-pulse" /> Linked
          </div>
        )}

        {/* Response area */}
        {result && (
          <div className="rounded-lg overflow-hidden border border-white/[0.04] bg-black/40">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.02]">
              <span className="text-[9px] text-[#a855f7] font-medium tracking-widest uppercase">Output</span>
              <button onClick={copyResult} className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white">
                {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
              </button>
            </div>
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{ maxHeight: isExpanded ? `${resultHeight + 8}px` : '0px', opacity: isExpanded ? 1 : 0 }}
            >
              <div ref={resultRef} className="px-2 py-1.5 text-[11px] text-gray-300 leading-relaxed max-h-32 overflow-y-auto hide-scrollbar">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Handles - left side */}
      <Handle type="target" position={Position.Left} id="system_prompt" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#6b7280]" style={{ left: -4, top: 78 }} />
      <span className="absolute text-[8px] text-gray-500/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 74 }}>SYS</span>

      <Handle type="target" position={Position.Left} id="user_message" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" style={{ left: -4, top: 120 }} />
      <span className="absolute text-[8px] text-[#3b82f6]/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 116 }}>PROMPT</span>

      <Handle type="target" position={Position.Left} id="images" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#22c55e] shadow-[0_0_8px_#22c55e]" style={{ left: -4, top: 180 }} />
      <span className="absolute text-[8px] text-[#22c55e]/70 font-medium tracking-wide right-[102%] pointer-events-none" style={{ top: 176 }}>IMAGE</span>

      {/* Output Handle - right side */}
      <Handle type="source" position={Position.Right} id="output" className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#a855f7] shadow-[0_0_8px_#a855f7]" style={{ right: -4, bottom: 20 }} />
    </div>
  );
}
