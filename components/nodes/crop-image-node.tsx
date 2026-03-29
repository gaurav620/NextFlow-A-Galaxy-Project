'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Scissors } from 'lucide-react';
import { useState } from 'react';

export default function CropImageNode({ data }: NodeProps) {
  const [x, setX] = useState(data.x || 0);
  const [y, setY] = useState(data.y || 0);
  const [width, setWidth] = useState(data.width || 100);
  const [height, setHeight] = useState(data.height || 100);
  const [isExecuting, setIsExecuting] = useState(false);

  const imageConnected = data.imageConnected || false;
  const xConnected = data.xConnected || false;
  const yConnected = data.yConnected || false;
  const widthConnected = data.widthConnected || false;
  const heightConnected = data.heightConnected || false;

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (data.onChange) {
        data.onChange({ x, y, width, height });
      }
    }, 1500);
  };

  return (
    <div
      className={`relative rounded-2xl border bg-gray-900 shadow-2xl min-w-[280px] max-w-[320px] transition-all ${
        isExecuting ? 'ring-2 ring-pink-500 animate-pulse border-pink-500/50' : 'border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-pink-400" />
          <span className="text-sm font-semibold text-white">Crop Image</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* 2x2 Grid of Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 block mb-1">X (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={x}
              onChange={(e) => {
                setX(Number(e.target.value));
                if (data.onChange) {
                  data.onChange({ x: Number(e.target.value), y, width, height });
                }
              }}
              disabled={xConnected}
              className={`bg-gray-800 border border-gray-700 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-purple-500 focus:outline-none ${
                xConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Y (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={y}
              onChange={(e) => {
                setY(Number(e.target.value));
                if (data.onChange) {
                  data.onChange({ x, y: Number(e.target.value), width, height });
                }
              }}
              disabled={yConnected}
              className={`bg-gray-800 border border-gray-700 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-purple-500 focus:outline-none ${
                yConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">W (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value));
                if (data.onChange) {
                  data.onChange({ x, y, width: Number(e.target.value), height });
                }
              }}
              disabled={widthConnected}
              className={`bg-gray-800 border border-gray-700 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-purple-500 focus:outline-none ${
                widthConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">H (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                if (data.onChange) {
                  data.onChange({ x, y, width, height: Number(e.target.value) });
                }
              }}
              disabled={heightConnected}
              className={`bg-gray-800 border border-gray-700 rounded-lg text-white text-xs px-2 py-1.5 text-center w-full focus:border-purple-500 focus:outline-none ${
                heightConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={isExecuting || !imageConnected}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-700 disabled:opacity-75 rounded-xl py-2 text-sm font-medium w-full text-white transition-colors"
        >
          {isExecuting ? 'Cropping...' : 'Crop Image'}
        </button>
      </div>

      {/* Handles with labels */}
      <Handle
        type="target"
        position={Position.Left}
        id="image_url"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 50,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[44px]">
        Image
      </span>

      <Handle
        type="target"
        position={Position.Left}
        id="x_percent"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 100,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[94px]">
        X
      </span>

      <Handle
        type="target"
        position={Position.Left}
        id="y_percent"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 130,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[124px]">
        Y
      </span>

      <Handle
        type="target"
        position={Position.Left}
        id="width_percent"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 160,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[154px]">
        W
      </span>

      <Handle
        type="target"
        position={Position.Left}
        id="height_percent"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
          top: 190,
        }}
      />
      <span className="absolute text-[10px] text-gray-500 left-4 top-[184px]">
        H
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
        Output
      </span>
    </div>
  );
}
