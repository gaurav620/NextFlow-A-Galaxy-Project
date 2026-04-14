'use client';

import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Type, Play, Trash2, Copy } from 'lucide-react';

export default function TextNode({ id, data }: any) {
  const [content, setContent] = useState(data.content || '');
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const handleChange = (val: string) => {
    setContent(val);
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      useWorkflowStore.getState().updateNodeData(id, { content: val });
    });
  };

  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.setNodes((store.nodes || []).filter((n: any) => n.id !== id));
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={`relative rounded-2xl w-[300px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
            <Type className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Text / Prompt</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} title="Copy text" className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${dark ? 'hover:bg-white/10 text-gray-500 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-black'}`}>
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={handleDelete} title="Delete node" className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={4}
          className={`w-full text-[13px] resize-none outline-none transition-colors overflow-y-auto rounded-xl p-3 border leading-relaxed ${
            dark
              ? 'bg-[#111] text-[#E0E0E0] border-white/[0.06] placeholder:text-gray-600 focus:border-white/20'
              : 'bg-gray-50 text-gray-800 border-black/[0.06] placeholder:text-gray-400 focus:border-black/20'
          }`}
        />
        
        {/* Character count */}
        <div className={`text-[10px] mt-1.5 text-right ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          {content.length} chars
        </div>
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !border-2 !border-blue-500/50 !bg-blue-500 !rounded-full"
        style={{ right: -6, top: '50%' }}
      />
    </div>
  );
}
