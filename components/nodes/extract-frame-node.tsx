'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Film } from 'lucide-react';
import { useState } from 'react';

export default function ExtractFrameNode({ data }: NodeProps) {
  const [timestamp, setTimestamp] = useState(data.timestamp || 0);
  const [framePreview, setFramePreview] = useState<string | null>(data.framePreview || null);
  const [isExecuting, setIsExecuting] = useState(false);

  const videoConnected = data.videoConnected || false;
  const timestampConnected = data.timestampConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    // Simulate frame extraction
    setTimeout(() => {
      setIsExecuting(false);
      if (data.onChange) {
        data.onChange({ timestamp });
      }
    }, 2000);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-gray-900 shadow-2xl min-w-[280px] max-w-[320px] transition-all ${
        isExecuting ? 'ring-2 ring-yellow-500 animate-pulse border-yellow-500/50' : 'border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold text-white">Extract Frame</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Timestamp Input */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Timestamp (seconds)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={timestamp}
            onChange={(e) => {
              setTimestamp(Number(e.target.value));
              if (data.onChange) {
                data.onChange({ timestamp: Number(e.target.value) });
              }
            }}
            placeholder="0.0"
            disabled={timestampConnected}
            className={`bg-gray-800 border border-gray-700 rounded-lg text-white text-xs px-3 py-2 w-full focus:border-purple-500 focus:outline-none ${
              timestampConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-600">Use percentage like 50% for halfway through</p>

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !videoConnected}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-700 disabled:opacity-75 rounded-xl py-2 text-sm font-medium w-full text-white transition-colors"
        >
          {isExecuting ? 'Extracting...' : 'Extract Frame'}
        </button>

        {/* Frame Preview */}
        {framePreview && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Frame Preview</p>
            <img
              src={framePreview}
              alt="Extracted frame"
              className="rounded-xl w-full object-cover max-h-32"
            />
          </div>
        )}
      </div>

      {/* Handles with labels */}
      <Handle
        type="target"
        position={Position.Left}
        id="video_url"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 50,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[44px]">
        Video
      </span>

      <Handle
        type="target"
        position={Position.Left}
        id="timestamp"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 100,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[94px]">
        Time
      </span>

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
      <span className="absolute text-[10px] text-gray-500 right-4 bottom-4">
        Frame
      </span>
    </div>
  );
}
