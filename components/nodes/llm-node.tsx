'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { BrainCircuit, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function LLMNode({ data }: NodeProps) {
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

  // Estimate tokens
  const estimatedTokens = result ? Math.ceil(result.length / 4) : 0;

  useEffect(() => {
    if (resultRef.current) {
      setResultHeight(resultRef.current.scrollHeight);
    }
  }, [result]);

  const handleRun = async () => {
    setIsExecuting(true);
    setTimeout(() => {
      setResult('Model output here. This is a placeholder response from the LLM node.');
      setIsExecuting(false);
    }, 2000);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-[#1c1c1c] shadow-2xl min-w-[220px] max-w-[260px] transition-all ${
        isExecuting
          ? 'border-purple-500/60 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse'
          : 'border-white/8 hover:border-white/15'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span className="text-xs font-medium text-gray-200">Run LLM</span>
        </div>
        <div className="flex items-center gap-2">
          {isExecuting && (
            <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          )}
          <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Model selector */}
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            if (data.onChange) data.onChange({ model: e.target.value });
          }}
          className="bg-[#111] border border-white/8 rounded-xl text-xs text-white px-3 py-2 w-full focus:border-blue-500/50 focus:outline-none"
        >
          <option>gemini-2.0-flash</option>
          <option>gemini-1.5-flash</option>
          <option>gemini-1.5-pro</option>
        </select>

        {/* System prompt */}
        {!systemConnected && (
          <textarea
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
              if (data.onChange) data.onChange({ systemPrompt: e.target.value });
            }}
            placeholder="System prompt (optional)..."
            className="bg-[#111] border border-white/8 rounded-xl text-white text-xs w-full p-3 resize-none h-12 placeholder-gray-700 focus:border-blue-500/50 focus:outline-none"
          />
        )}
        {systemConnected && (
          <div className="bg-[#111] rounded-xl px-3 py-2 text-[11px] text-purple-400/70 border border-purple-500/20">
            ⚡ Connected from node
          </div>
        )}

        {/* User message */}
        {!userConnected && (
          <textarea
            value={userMessage}
            onChange={(e) => {
              setUserMessage(e.target.value);
              if (data.onChange) data.onChange({ userMessage: e.target.value });
            }}
            placeholder="User message (required)..."
            className="bg-[#111] border border-white/8 rounded-xl text-white text-xs w-full p-3 resize-none h-14 placeholder-gray-700 focus:border-blue-500/50 focus:outline-none"
          />
        )}
        {userConnected && (
          <div className="bg-[#111] rounded-xl px-3 py-2 text-[11px] text-purple-400/70 border border-purple-500/20">
            ⚡ Connected from node
          </div>
        )}

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={isExecuting}
          className="bg-[#2a1f3d] hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs rounded-xl py-2.5 w-full flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Running...
            </>
          ) : (
            <>▶ Run</>
          )}
        </button>

        {/* Response area */}
        {result && (
          <div className="bg-[#111] rounded-xl border border-white/8 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/6">
              <span className="text-[10px] text-gray-600">Response</span>
              <button
                onClick={copyResult}
                className="p-1 hover:bg-white/5 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-600 hover:text-gray-400" />
                )}
              </button>
            </div>
            <div
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{
                maxHeight: isExpanded ? `${resultHeight + 8}px` : '0px',
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <div
                ref={resultRef}
                className="px-3 py-2 text-[11px] text-gray-300 leading-relaxed max-h-32 overflow-y-auto"
              >
                {result}
              </div>
            </div>
            <div className="px-3 py-1 border-t border-white/6 text-[10px] text-gray-600">
              ~{estimatedTokens} tokens
            </div>
          </div>
        )}
      </div>

      {/* Target handles - left side */}
      <div className="absolute left-[-10px] top-20">
        <Handle
          type="target"
          position={Position.Left}
          id="system_prompt"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#6b7280',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[76px]">System</span>

      <div className="absolute left-[-10px] top-40">
        <Handle
          type="target"
          position={Position.Left}
          id="user_message"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[134px]">Message</span>

      <div className="absolute left-[-10px] top-60">
        <Handle
          type="target"
          position={Position.Left}
          id="images"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#22c55e',
          }}
        />
      </div>
      <span className="absolute text-[10px] text-gray-500 left-4 top-[192px]">Images</span>

      {/* Source handle - right side */}
      <div className="absolute right-[-10px] bottom-4">
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>
    </div>
  );
}
