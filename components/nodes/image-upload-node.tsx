'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Upload, Loader2, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

async function uploadToTransloadit(file: File): Promise<string> {
  // 1. Get signed params from server
  const paramsRes = await fetch('/api/upload/params')
  if (!paramsRes.ok) throw new Error('Failed to get upload params')
  const { params, signature } = await paramsRes.json()

  // 2. POST file directly to Transloadit assembly
  const formData = new FormData()
  formData.append('params', params)
  formData.append('signature', signature)
  formData.append('file', file)

  const assemblyRes = await fetch('https://api2.transloadit.com/assemblies', {
    method: 'POST',
    body: formData,
  })
  if (!assemblyRes.ok) throw new Error('Transloadit upload failed')
  const assemblyData = await assemblyRes.json()

  // 3. Poll until assembly completes
  const pollUrl = assemblyData.assembly_ssl_url || assemblyData.assembly_url
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000))
    const statusRes = await fetch(pollUrl)
    const status = await statusRes.json()
    if (status.ok === 'ASSEMBLY_COMPLETED') {
      // No processing steps — original file is in uploads
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

export default function ImageUploadNode({ id, data }: NodeProps) {
  const [preview, setPreview] = useState<string | null>(data.preview || null);
  const [filename, setFilename] = useState(data.filename || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFilename(file.name);
    setError(null);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to Transloadit in background
    setUploading(true);
    try {
      const cdnUrl = await uploadToTransloadit(file);
      useWorkflowStore.getState().updateNodeData(id, { imageUrl: cdnUrl, value: cdnUrl });
      useWorkflowStore.getState().setNodeOutput(id, cdnUrl);
    } catch (err: any) {
      setError(err.message);
      // Fallback: use local object URL so workflow can still run in dev
      useWorkflowStore.getState().updateNodeData(id, { imageUrl: localUrl, value: localUrl });
      useWorkflowStore.getState().setNodeOutput(id, localUrl);
    } finally {
      setUploading(false);
    }
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
          <div className="w-3 h-3 rounded" style={{ background: '#22c55e' }} />
          <span className="text-xs font-medium text-gray-300">Upload Image</span>
        </div>
        {uploading && <Loader2 className="w-3 h-3 text-green-400 animate-spin" />}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFileChange(e.dataTransfer.files[0]) }}
            className="rounded-xl p-4 text-center cursor-pointer transition-colors hover:bg-white/5"
            style={{ background: '#0f0f0f', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <Upload className="w-6 h-6 text-gray-600 mx-auto mb-1" />
            <p className="text-[11px] text-gray-500">Drop image or click</p>
            <p className="text-[10px] text-gray-600 mt-0.5">JPG PNG WEBP GIF</p>
          </div>
        ) : (
          <div>
            <div className="relative">
              <img src={preview} alt="Preview" className="rounded-xl max-h-28 w-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Uploading...
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-600 mt-2 truncate">{filename}</p>
            {error && <p className="text-[10px] text-orange-400 mt-0.5 truncate" title={error}>⚠ {error}</p>}
            <button
              onClick={() => { setPreview(null); setFilename(''); setError(null); }}
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
        id="image_url"
        style={{
          width: 10, height: 10, borderRadius: '50%',
          border: '2px solid #0a0a0a', background: '#22c55e', right: -5,
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
