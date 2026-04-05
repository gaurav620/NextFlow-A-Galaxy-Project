'use client';

import { Handle, Position } from '@xyflow/react';
import { Type } from 'lucide-react';
import { useState } from 'react';

export default function TextNode({ id, data }: any) {
  const [content, setContent] = useState(data.content || '');

  return (
    <div className="relative rounded-2xl w-[240px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#3b82f6]" style={{ background: '#3b82f6' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">Text</span>
        </div>
        <Type className="w-3 h-3 text-gray-500" />
      </div>

      {/* Body */}
      <div className="p-2">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            // Dynamic import to avoid circular dependency loop if any
            import('@/store/workflowStore').then(({ useWorkflowStore }) => {
              useWorkflowStore.getState().updateNodeData(id, { content: e.target.value });
            });
          }}
          placeholder="Enter text..."
          className="rounded-xl text-gray-200 text-xs w-full p-2.5 resize-none h-20 placeholder-gray-600 focus:outline-none bg-transparent hover:bg-white/[0.02] transition-colors shadow-inner box-border"
        />
        <div className="text-[9px] text-gray-600 text-right mt-1 px-1">
          {content.length} chars
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"
        style={{ right: -4 }}
      />
    </div>
  );
}
