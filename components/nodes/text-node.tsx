'use client';

import { Handle, Position } from '@xyflow/react';
import { Type } from 'lucide-react';
import { useState } from 'react';

export default function TextNode({ data }: any) {
  const [content, setContent] = useState(data.content || '');

  return (
    <div
      className="relative rounded-2xl min-w-[220px] max-w-[260px] transition-all"
      style={{
        background: '#1c1c1c',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#3b82f6' }} />
          <span className="text-xs font-medium text-gray-300">Text</span>
        </div>
        <Type className="w-3.5 h-3.5 text-gray-500" />
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
          className="rounded-xl text-white text-xs w-full p-3 resize-none h-20 placeholder-gray-600 focus:outline-none"
          style={{
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        />
        <div className="text-[10px] text-gray-600 text-right mt-1">
          {content.length} chars
        </div>
      </div>

      {/* Output Handle */}
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
          right: -5,
        }}
      />
    </div>
  );
}
