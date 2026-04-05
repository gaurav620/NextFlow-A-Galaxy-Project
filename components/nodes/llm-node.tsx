'use client';

import { Handle, Position } from '@xyflow/react';
import { Copy, Check, Loader2 } from 'lucide-react';
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
      className="relative rounded-2xl min-w-[240px] max-w-[280px] transition-all"
      style={{
        background: '#1c1c1c',
        border: isExecuting ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isExecuting ? '0 0 20px rgba(168,85,247,0.2)' : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#a855f7' }} />
          <span className="text-xs font-medium text-gray-300">Run LLM</span>
        </div>
        {isExecuting && <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin" />}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Model selector */}
        <select
          value={model}
          onChange={(e) => { setModel(e.target.value); if (data.onChange) data.onChange({ model: e.target.value }); }}
          className="rounded-xl text-xs text-white px-3 py-2 w-full focus:outline-none"
          style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <option>gemini-2.0-flash</option>
          <option>gemini-1.5-flash</option>
          <option>gemini-1.5-pro</option>
        </select>

        {/* System prompt */}
        {!systemConnected && (
          <textarea
            value={systemPrompt}
            onChange={(e) => { setSystemPrompt(e.target.value); if (data.onChange) data.onChange({ systemPrompt: e.target.value }); }}
            placeholder="System prompt (optional)..."
            className="rounded-xl text-white text-xs w-full p-3 resize-none h-12 placeholder-gray-600 focus:outline-none"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        )}
        {systemConnected && (
          <div className="rounded-xl px-3 py-2 text-[11px] text-gray-500" style={{ background: '#0f0f0f', border: '1px solid rgba(168,85,247,0.2)' }}>
            Connected from node
          </div>
        )}

        {/* User message */}
        {!userConnected && (
          <textarea
            value={userMessage}
            onChange={(e) => { setUserMessage(e.target.value); if (data.onChange) data.onChange({ userMessage: e.target.value }); }}
            placeholder="User message (required)..."
            className="rounded-xl text-white text-xs w-full p-3 resize-none h-14 placeholder-gray-600 focus:outline-none"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}
          />
        )}
        {userConnected && (
          <div className="rounded-xl px-3 py-2 text-[11px] text-gray-500" style={{ background: '#0f0f0f', border: '1px solid rgba(168,85,247,0.2)' }}>
            Connected from node
          </div>
        )}

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting}
          className="text-xs rounded-full py-2 w-full flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          {isExecuting ? <><Loader2 className="w-3 h-3 animate-spin" />Running...</> : 'Run'}
        </button>

        {/* Response area */}
        {result && (
          <div className="rounded-xl overflow-hidden" style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-[10px] text-gray-600">Response</span>
              <button onClick={copyResult} className="p-1 hover:bg-white/5 rounded transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-600" />}
              </button>
            </div>
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{ maxHeight: isExpanded ? `${resultHeight + 8}px` : '0px', opacity: isExpanded ? 1 : 0 }}
            >
              <div ref={resultRef} className="px-3 py-2 text-[11px] text-gray-400 leading-relaxed max-h-32 overflow-y-auto">
                {result}
              </div>
            </div>
            <div className="px-3 py-1 text-[10px] text-gray-600" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              ~{estimatedTokens} tokens
            </div>
          </div>
        )}
      </div>

      {/* Input Handles - left side */}
      <Handle type="target" position={Position.Left} id="system_prompt" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#6b7280', left: -5, top: 80 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 74 }}>System</span>

      <Handle type="target" position={Position.Left} id="user_message" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#3b82f6', left: -5, top: 130 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 124 }}>Message</span>

      <Handle type="target" position={Position.Left} id="images" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#22c55e', left: -5, top: 180 }} />
      <span className="absolute text-[10px] text-gray-600 left-3" style={{ top: 174 }}>Images</span>

      {/* Output Handle - right side */}
      <Handle type="source" position={Position.Right} id="output" style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #0a0a0a', background: '#a855f7', right: -5, bottom: 20 }} />
    </div>
  );
}
