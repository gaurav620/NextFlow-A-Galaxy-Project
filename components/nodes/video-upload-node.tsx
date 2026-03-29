'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function VideoUploadNode({ data }: NodeProps) {
  const [preview, setPreview] = useState<string | null>(data.preview || null);
  const [filename, setFilename] = useState(data.filename || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      if (data.onChange) {
        data.onChange({ preview: e.target?.result, filename: file.name });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="relative rounded-2xl min-w-[220px] max-w-[260px] transition-all"
      style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ background: '#f97316' }} />
          <span className="text-xs font-medium text-gray-300">Upload Video</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl p-4 text-center cursor-pointer transition-colors hover:bg-white/5"
            style={{ background: '#0f0f0f', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <Upload className="w-6 h-6 text-gray-600 mx-auto mb-1" />
            <p className="text-[11px] text-gray-500">Drop video</p>
            <p className="text-[10px] text-gray-600 mt-0.5">MP4 MOV WEBM</p>
          </div>
        ) : (
          <div>
            <video src={preview} controls className="rounded-xl max-h-28 w-full object-cover" style={{ background: '#0f0f0f' }} />
            <p className="text-[10px] text-gray-600 mt-2 truncate">{filename}</p>
            <button
              onClick={() => { setPreview(null); setFilename(''); }}
              className="text-[10px] text-gray-500 hover:text-white mt-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="video_url"
        style={{
          width: 10, height: 10, borderRadius: '50%',
          border: '2px solid #0a0a0a', background: '#f97316', right: -5,
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
