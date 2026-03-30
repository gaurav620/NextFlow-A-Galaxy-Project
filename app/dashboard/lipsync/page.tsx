'use client';

import { useState, useRef } from 'react';
import { Upload, Mic, Play, Download, X, Sparkles } from 'lucide-react';

export default function LipsyncPage() {
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioName, setAudioName] = useState('');
  const [faceDetect, setFaceDetect] = useState(true);
  const [smoothing, setSmoothing] = useState(70);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const handleVideo = (file: File) => {
    if (file.type.startsWith('video/')) setVideo(URL.createObjectURL(file));
  };
  const handleAudio = (file: File) => {
    setAudio(URL.createObjectURL(file));
    setAudioName(file.name);
  };

  const handleGenerate = async () => {
    if (!video || !audio) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 3000));
    setResult(true);
    setGenerating(false);
  };

  const DropZone = ({ label, icon, accept, onFile, uploaded, name, onClear }: any) => (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{label}</label>
      <div
        onClick={() => !uploaded && document.getElementById(`input-${label}`)?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        onDragOver={e => e.preventDefault()}
        className={`relative w-full rounded-xl border border-dashed transition-all cursor-pointer overflow-hidden bg-[#0d0d0f] ${uploaded ? 'border-green-500/20' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
        style={{ height: 90 }}
      >
        <input id={`input-${label}`} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        {uploaded ? (
          <div className="h-full flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              {icon}
            </div>
            <p className="text-[10px] text-green-400 font-medium truncate max-w-[180px]">{name || 'Uploaded'}</p>
            <button onClick={e => { e.stopPropagation(); onClear(); }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-zinc-600" />
            <p className="text-[10px] text-zinc-600">Drop {label.toLowerCase()} or click</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-full text-white overflow-hidden bg-[#09090b]">
      <div className="w-[280px] border-r border-white/[0.05] bg-[#000] flex flex-col flex-shrink-0">
        <div className="h-12 flex items-center px-4 border-b border-white/[0.05] gap-2">
          <Mic className="w-4 h-4 text-cyan-400" />
          <span className="text-[13px] font-semibold">Video Lipsync</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 [&::-webkit-scrollbar]:hidden pb-24">
          <DropZone label="Video" icon={<Play className="w-4 h-4 text-green-400" />} accept="video/*"
            onFile={handleVideo} uploaded={!!video} name="video.mp4" onClear={() => setVideo(null)} />

          <DropZone label="Audio" icon={<Mic className="w-4 h-4 text-green-400" />} accept="audio/*"
            onFile={handleAudio} uploaded={!!audio} name={audioName} onClear={() => { setAudio(null); setAudioName(''); }} />

          <div className="border-t border-white/[0.05]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-zinc-300 font-medium">Face Detection</p>
              <p className="text-[10px] text-zinc-600">Auto-detect face regions</p>
            </div>
            <button onClick={() => setFaceDetect(!faceDetect)}
              className={`w-9 h-5 rounded-full transition-colors relative ${faceDetect ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${faceDetect ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Smoothing</label>
              <span className="text-[11px] text-zinc-400">{smoothing}%</span>
            </div>
            <input type="range" min={0} max={100} value={smoothing}
              onChange={e => setSmoothing(Number(e.target.value))}
              className="w-full h-1 appearance-none bg-zinc-800 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              style={{ background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${smoothing}%, #27272a ${smoothing}%, #27272a 100%)` }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.05]">
          <button onClick={handleGenerate} disabled={!video || !audio || generating}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-zinc-100 transition-colors disabled:opacity-30 flex items-center justify-center gap-2">
            {generating ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Syncing...</>
              : <><Sparkles className="w-4 h-4" />Generate Lipsync</>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] flex-shrink-0">
          <span className="text-[12px] text-zinc-500">{result ? 'Lipsync complete' : 'Upload video and audio to begin'}</span>
          {result && <button className="flex items-center gap-1.5 text-[12px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Download className="w-3.5 h-3.5" />Download</button>}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
              <Mic className="w-8 h-8 text-cyan-400/50" />
            </div>
            <div>
              <p className="text-white text-[15px] font-semibold mb-1">Video Lipsync</p>
              <p className="text-zinc-500 text-[13px] max-w-xs">Upload a video with a face and an audio file. AI will sync the mouth movements to the audio.</p>
            </div>
            {video && !audio && <p className="text-[12px] text-cyan-400">✓ Video uploaded — now upload audio</p>}
            {video && audio && !result && <p className="text-[12px] text-green-400">✓ Ready — click Generate Lipsync</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
