'use client';

import { Handle, Position } from '@xyflow/react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

async function uploadToTransloadit(file: File): Promise<string> {
  const paramsRes = await fetch('/api/upload/params')
  if (!paramsRes.ok) throw new Error('Failed to get upload params')
  const { params, signature } = await paramsRes.json()

  const formData = new FormData()
  formData.append('params', params)
  formData.append('signature', signature)
  formData.append('file', file)

  const assemblyRes = await fetch('https://api2.transloadit.com/assemblies', {
    method: 'POST', body: formData,
  })
  if (!assemblyRes.ok) throw new Error('Transloadit upload failed')
  const assemblyData = await assemblyRes.json()

  const pollUrl = assemblyData.assembly_ssl_url || assemblyData.assembly_url
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000))
    const statusRes = await fetch(pollUrl)
    const status = await statusRes.json()
    if (status.ok === 'ASSEMBLY_COMPLETED') {
      const upload = status.uploads?.[0]
      if (upload?.ssl_url) return upload.ssl_url
      if (upload?.url) return upload.url
      break
    }
    if (status.ok === 'REQUEST_ABORTED' || status.error) {
      throw new Error(status.error || 'Transloadit assembly failed')
    }
  }
  throw new Error('Transloadit upload timed out')
}

export default function ImageUploadNode({ id, data }: any) {
  const [preview, setPreview] = useState<string | null>(data.preview || null);
  const [filename, setFilename] = useState(data.filename || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFilename(file.name);
    setError(null);

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const cdnUrl = await uploadToTransloadit(file);
      useWorkflowStore.getState().updateNodeData(id, { imageUrl: cdnUrl, value: cdnUrl });
      useWorkflowStore.getState().setNodeOutput(id, cdnUrl);
    } catch (err: any) {
      setError(err.message);
      useWorkflowStore.getState().updateNodeData(id, { imageUrl: localUrl, value: localUrl });
      useWorkflowStore.getState().setNodeOutput(id, localUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative rounded-2xl w-[240px] transition-all bg-[#0d0d0d]/90 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_#22c55e]" style={{ background: '#22c55e' }} />
          <span className="text-[10px] font-semibold text-gray-300 tracking-wider uppercase">Image</span>
        </div>
        {uploading ? (
          <Loader2 className="w-3 h-3 text-green-400 animate-spin" />
        ) : (
          <ImageIcon className="w-3 h-3 text-gray-500" />
        )}
      </div>

      {/* Body */}
      <div className="p-2">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFileChange(e.dataTransfer.files[0]) }}
            className="rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center border border-white/[0.02]"
          >
            <Upload className="w-5 h-5 text-gray-600 mb-1" />
            <p className="text-[10px] text-gray-500 font-medium tracking-tight mt-1">Drop image or Browse</p>
          </div>
        ) : (
          <div className="group relative rounded-xl overflow-hidden shadow-inner bg-black border border-white/[0.04]">
            <img src={preview} alt="Preview" className="w-full h-auto max-h-32 object-cover object-center" />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
                <Loader2 className="w-5 h-5 text-green-400 animate-spin drop-shadow-[0_0_8px_#22c55e]" />
              </div>
            )}
            
            {/* Hover actions */}
            {!uploading && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setPreview(null); setFilename(''); setError(null); }}
                     className="bg-black/60 hover:bg-red-500/80 text-white p-1 rounded-lg backdrop-blur-md transition-colors"
                   >
                     <span className="text-[9px] font-bold px-1">✕</span>
                   </button>
                </div>
            )}
          </div>
        )}
        {error && <p className="text-[9px] text-red-400 mt-1.5 truncate px-1" title={error}>{error}</p>}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="image_url"
        className="w-2 h-2 !border-2 !border-[#0d0d0d] !bg-[#22c55e] shadow-[0_0_8px_#22c55e]"
        style={{ right: -4 }}
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
