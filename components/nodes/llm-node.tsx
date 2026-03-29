'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { BrainCircuit, Copy, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LLMNode({ data }: NodeProps) {
  const [model, setModel] = useState(data.model || 'gemini-2.0-flash');
  const [systemPrompt, setSystemPrompt] = useState(data.systemPrompt || '');
  const [userMessage, setUserMessage] = useState(data.userMessage || '');
  const [result, setResult] = useState(data.result || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isResultExpanded, setIsResultExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const systemConnected = data.systemConnected || false;
  const userConnected = data.userConnected || false;

  const handleRun = async () => {
    setIsExecuting(true);
    // Simulate LLM execution
    setTimeout(() => {
      setResult('Model output would appear here. This is a placeholder for the LLM response.');
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
      className={`rounded-2xl border bg-gray-900 shadow-2xl min-w-[280px] max-w-[320px] transition-all ${
        isExecuting ? 'ring-2 ring-purple-500 animate-pulse border-purple-500/50' : 'border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-semibold text-white">Run LLM</span>
        </div>
        {isExecuting && (
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Model Select */}
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            if (data.onChange) {
              data.onChange({ model: e.target.value });
            }
          }}
          className="bg-gray-800 border border-gray-700 rounded-lg text-sm text-white px-3 py-2 w-full focus:border-purple-500 focus:outline-none"
        >
          <option value="gemini-2.0-flash">gemini-2.0-flash</option>
          <option value="gemini-1.5-flash">gemini-1.5-flash</option>
          <option value="gemini-1.5-pro">gemini-1.5-pro</option>
        </select>

        {/* System Prompt */}
        <div>
          <label className="text-xs text-gray-500">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
              if (data.onChange) {
                data.onChange({ systemPrompt: e.target.value });
              }
            }}
            placeholder="Optional system instructions..."
            disabled={systemConnected}
            className={`bg-gray-800 border border-gray-700 rounded-xl text-white text-xs w-full p-3 resize-none h-16 placeholder-gray-600 focus:border-purple-500 focus:outline-none mt-1 ${
              systemConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {systemConnected && (
            <div className="text-xs text-purple-400 mt-1">Connected</div>
          )}
        </div>

        {/* User Message */}
        <div>
          <label className="text-xs text-gray-500">User Message</label>
          <textarea
            value={userMessage}
            onChange={(e) => {
              setUserMessage(e.target.value);
              if (data.onChange) {
                data.onChange({ userMessage: e.target.value });
              }
            }}
            placeholder="Enter your message..."
            disabled={userConnected}
            className={`bg-gray-800 border border-gray-700 rounded-xl text-white text-xs w-full p-3 resize-none h-20 placeholder-gray-600 focus:border-purple-500 focus:outline-none mt-1 ${
              userConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {userConnected && (
            <div className="text-xs text-purple-400 mt-1">Connected</div>
          )}
        </div>

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={isExecuting}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-700 disabled:opacity-75 rounded-xl py-2.5 text-sm font-medium w-full flex items-center justify-center gap-2 text-white transition-colors"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              Run
            </>
          )}
        </button>

        {/* Result Area */}
        {result && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <span className="text-xs font-medium text-gray-400">Result</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={copyResult}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy"
                >
                  <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                </button>
                <button
                  onClick={() => setIsResultExpanded(!isResultExpanded)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <ChevronDown
                    className={`w-3 h-3 text-gray-500 transition-transform ${
                      isResultExpanded ? '' : '-rotate-90'
                    }`}
                  />
                </button>
              </div>
            </div>
            {isResultExpanded && (
              <div className="p-3 max-h-48 overflow-y-auto text-xs text-gray-300 whitespace-pre-wrap">
                {result}
              </div>
            )}
            {copied && (
              <div className="px-3 py-1 bg-green-500/20 border-t border-gray-700 text-xs text-green-400">
                Copied!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="system_prompt"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 80,
        }}
      />
      <div className="absolute left-[-55px] top-[77px] text-xs text-gray-500">
        System
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="user_message"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 140,
        }}
      />
      <div className="absolute left-[-60px] top-[137px] text-xs text-gray-500">
        User Msg
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="images"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 200,
        }}
      />
      <div className="absolute left-[-50px] top-[197px] text-xs text-gray-500">
        Images
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
        }}
      />
    </div>
  );
}
