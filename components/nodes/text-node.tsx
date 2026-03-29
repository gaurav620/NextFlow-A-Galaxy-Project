'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Type } from 'lucide-react';
import { useState } from 'react';

export default function TextNode({ data, isConnected }: NodeProps) {
  const [content, setContent] = useState(data.content || '');

  return (
    <div className="rounded-2xl border bg-gray-900 shadow-2xl min-w-[280px] max-w-[320px] transition-all border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-white">Text Node</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <label className="text-xs text-gray-500">Content</label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (data.onChange) {
                data.onChange({ content: e.target.value });
              }
            }}
            placeholder="Enter text or prompt..."
            className="bg-gray-800 border border-gray-700 rounded-xl text-white text-sm w-full p-3 resize-none h-24 placeholder-gray-600 focus:border-purple-500 focus:outline-none mt-1"
          />
        </div>

        {/* Character count */}
        <div className="text-xs text-gray-600 text-right">
          {content.length} characters
        </div>
      </div>

      {/* Handle */}
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
