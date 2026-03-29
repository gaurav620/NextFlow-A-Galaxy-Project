'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Type } from 'lucide-react';
import { useState } from 'react';

export default function TextNode({ data }: NodeProps) {
  const [content, setContent] = useState(data.content || '');

  return (
    <div className="relative rounded-2xl border bg-[#1c1c1c] shadow-2xl min-w-[220px] max-w-[260px] transition-all border-white/8 hover:border-white/15">
      {/* Header - drag handle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-xs font-medium text-gray-200">Text</span>
        </div>
        <Type className="w-3.5 h-3.5 text-blue-400" />
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (data.onChange) {
              data.onChange({ content: e.target.value });
            }
          }}
          placeholder="Enter text..."
          className="bg-[#111] border border-white/8 rounded-xl text-white text-xs w-full p-3 resize-none h-20 placeholder-gray-700 focus:border-blue-500/50 focus:outline-none"
        />
        <div className="text-[10px] text-gray-700 text-right mt-1">
          {content.length} chars
        </div>
      </div>

      {/* Handle - output on right */}
      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2">
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
