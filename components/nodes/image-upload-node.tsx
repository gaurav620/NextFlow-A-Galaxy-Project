'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ImageUploadNode({ data }: NodeProps) {
  const [preview, setPreview] = useState<string | null>(data.preview || null);
  const [filename, setFilename] = useState(data.filename || '');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setFilename(file.name);

    // Simulate upload progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 100);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setProgress(100);
      clearInterval(interval);
      setTimeout(() => setProgress(0), 1000);

      if (data.onChange) {
        data.onChange({
          preview: e.target?.result,
          filename: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border bg-gray-900 shadow-2xl min-w-[280px] max-w-[320px] transition-all border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold text-white">Upload Image</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-8 h-8 mx-auto text-gray-600 mb-2" />
            <p className="text-xs text-gray-500">Drop image here or click</p>
            <p className="text-xs text-gray-600">JPG, PNG, WEBP, GIF</p>
          </div>
        ) : (
          <div>
            <img
              src={preview}
              alt="Preview"
              className="rounded-xl max-h-32 w-full object-cover"
            />
            <p className="text-xs text-gray-500 mt-2">{filename}</p>
            <button
              onClick={() => {
                setPreview(null);
                setFilename('');
              }}
              className="text-xs text-purple-400 hover:text-purple-300 mt-1"
            >
              Clear
            </button>
          </div>
        )}

        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="bg-gray-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="image_url"
        style={{
          background: '#6d28d9',
          width: 12,
          height: 12,
          border: '2px solid #4c1d95',
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
