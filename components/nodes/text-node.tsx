'use client';

import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function TextNode({ id, data }: any) {
  const [content, setContent] = useState(data.content || '');
  const { theme } = useTheme();

  return (
    <div className={`relative rounded-xl w-[280px] p-4 transition-colors ${theme === 'dark' ? 'bg-[#1C1C1C] border border-white/10' : 'bg-white border border-black/10'} shadow-lg group`}>
      {/* Label */}
      <div className={`text-[11px] font-semibold tracking-wide uppercase mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Prompt
      </div>

      {/* Body */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          // Dynamic import to avoid circular dependency loop if any
          import('@/store/workflowStore').then(({ useWorkflowStore }) => {
            useWorkflowStore.getState().updateNodeData(id, { content: e.target.value });
          });
        }}
        placeholder="Enter your prompt here..."
        className={`w-full text-[13px] resize-none h-24 p-0 outline-none transition-colors overflow-y-auto placeholder:opacity-50 ${
          theme === 'dark' ? 'bg-transparent text-[#E0E0E0]' : 'bg-transparent text-gray-800'
        }`}
      />
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`w-3 h-3 border border-white/20 transition-all ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#E5E5E5]'}`}
        style={{ right: -6, top: '50%' }}
      />
    </div>
  );
}
