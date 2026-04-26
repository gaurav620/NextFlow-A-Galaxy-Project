'use client';

import { Handle, Position } from '@xyflow/react';
import { Upload, Loader2, Image as ImageIcon, Trash2, Cloud, HardDrive } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function ImageUploadNode({ id, data }: any) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [preview, setPreview] = useState<string | null>(data.preview || data.uploadedUrl || null);
  const [filename, setFilename] = useState(data.filename || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProvider, setUploadProvider] = useState<string | null>(data.uploadProvider || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncToStore = (vals: Record<string, any>) => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.updateNodeData(id, vals);
      if (vals.imageUrl) store.setNodeOutput(id, vals.imageUrl);
    });
  };

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFilename(file.name);
    setError(null);
    setUploading(true);

    // Show local preview immediately via object URL
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      // Upload via server-side route (avoids CORS / Transloadit client-side timeouts)
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (data.success && data.url) {
        // If Transloadit CDN URL, update preview to CDN URL
        if (data.provider === 'transloadit') {
          setPreview(data.url);
          setUploadProvider('transloadit');
        } else {
          setUploadProvider('local');
        }
        // Store in both fields — workflow runner reads uploadedUrl
        syncToStore({
          imageUrl: data.url,
          uploadedUrl: data.url,
          value: data.url,
          filename: file.name,
          preview: data.url,
          uploadProvider: data.provider,
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      console.warn('Upload failed, using local data URL:', err.message);
      // Fallback: base64 data URL
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        setUploadProvider('local');
        syncToStore({
          imageUrl: dataUrl,
          uploadedUrl: dataUrl,
          value: dataUrl,
          filename: file.name,
          preview: dataUrl,
          uploadProvider: 'local',
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = () => {
    import('@/store/workflowStore').then(({ useWorkflowStore }) => {
      const store = useWorkflowStore.getState();
      store.setNodes((store.nodes || []).filter((n: any) => n.id !== id));
    });
  };

  return (
    <div className={`relative rounded-2xl w-[260px] transition-all group ${dark ? 'bg-[#1A1A1A] border border-white/[0.08]' : 'bg-white border border-black/[0.08]'} shadow-xl hover:shadow-2xl ${data.isExecuting ? 'node-executing' : ''}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 cursor-grab active:cursor-grabbing border-b ${dark ? 'border-white/[0.05]' : 'border-black/[0.05]'} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${dark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
            <ImageIcon className="w-3.5 h-3.5 text-green-400" />
          </div>
          <span className={`text-[13px] font-semibold ${dark ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>Image</span>
        </div>
        <button onClick={handleDelete} title="Delete" className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100 ${dark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'}`}>
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFileChange(e.dataTransfer.files[0]) }}
            className={`rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center border-2 border-dashed ${
              dark ? 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]' : 'border-black/[0.08] hover:border-black/20 hover:bg-black/[0.02]'
            }`}
          >
            <Upload className={`w-6 h-6 mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-[11px] font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Drop image or Browse</p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden group/img">
            <img src={preview} alt="Preview" className="w-full h-auto max-h-40 object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
              </div>
            )}
            {!uploading && (
              <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <button onClick={() => { setPreview(null); setFilename(''); setUploadProvider(null); }} className="w-7 h-7 flex items-center justify-center bg-black/70 rounded-lg backdrop-blur-md hover:bg-red-500/80 transition-colors text-white">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-1.5">
          {filename && <p className={`text-[10px] truncate flex-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{filename}</p>}
          {uploadProvider && (
            <div className={`flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-md ${
              uploadProvider === 'transloadit'
                ? (dark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-500/10')
                : (dark ? 'text-gray-500 bg-gray-500/10' : 'text-gray-400 bg-gray-500/10')
            }`}>
              {uploadProvider === 'transloadit' ? <Cloud className="w-2.5 h-2.5" /> : <HardDrive className="w-2.5 h-2.5" />}
              {uploadProvider === 'transloadit' ? 'CDN' : 'Local'}
            </div>
          )}
        </div>
        {error && <p className="text-[10px] text-red-400 mt-1.5 truncate">{error}</p>}
      </div>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} id="image_url"
        className="!w-3 !h-3 !border-2 !border-green-500/50 !bg-green-500 !rounded-full"
        style={{ right: -6 }} />

      <input ref={fileInputRef} type="file" accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        className="hidden" />
    </div>
  );
}
