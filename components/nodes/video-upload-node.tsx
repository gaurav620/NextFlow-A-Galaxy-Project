'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Upload } from 'lucide-react';
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
        data.onChange({
          preview: e.target?.result,
          filename: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative rounded-2xl border bg-[#1c1c1c] shadow-2xl min-w-[220px] max-w-[260px] transition-all border-white/8 hover:border-white/15">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-xs font-medium text-gray-200">Upload Video</span>
        </div>
        <Video className="w-3.5 h-3.5 text-orange-400" />
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-white/10 hover:border-orange-500/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-6 h-6 text-gray-700 mx-auto mb-1" />
            <p className="text-[11px] text-gray-600">Drop video</p>
            <p className="text-[10px] text-gray-700 mt-0.5">MP4 MOV WEBM</p>
          </div>
        ) : (
          <div>
            <video
              src={preview}
              controls
              className="rounded-xl max-h-28 w-full object-cover bg-[#111]"
            />
            <p className="text-[10px] text-gray-600 mt-2 truncate">{filename}</p>
            <button
              onClick={() => {
                setPreview(null);
                setFilename('');
              }}
              className="text-[10px] text-blue-400 hover:text-blue-300 mt-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Handle - output on right */}
      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2">
        <Handle
          type="source"
          position={Position.Right}
          id="video_url"
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #0a0a0a',
            background: '#3b82f6',
          }}
        />
      </div>

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
