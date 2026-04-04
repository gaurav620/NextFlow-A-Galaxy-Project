'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Mic, Play, Download, X, Sparkles, ChevronDown, 
  Smile, AlignLeft, Disc, Check, ArrowLeft
} from 'lucide-react';
import { useAssetStore } from '@/store/assets';

const MODELS = [
  { id: 'nextflow-sync', name: 'NextFlow Sync', desc: 'Omnimodal lipsync model' },
  { id: 'fabric', name: 'Fabric Fast', desc: 'Turn any image into a talking video' }
];

export default function LipsyncPage() {
  const { addAsset } = useAssetStore();
  const fileRef = useRef<HTMLInputElement>(null);

  // States
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModels, setShowModels] = useState(false);
  
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [speechText, setSpeechText] = useState('');
  
  const [showTextModal, setShowTextModal] = useState(false);
  const [tempSpeech, setTempSpeech] = useState('');

  const [generating, setGenerating] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);

  const handleFaceUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFaceImage(url);
    }
  };

  const handleGenerate = async () => {
    if (!faceImage || !speechText.trim()) return;
    setGenerating(true);
    
    // Simulating generation time
    await new Promise(r => setTimeout(r, 4000));
    
    // Since we can't reliably generate a deepfake video via basic API,
    // we simulate the success by revealing the UI state and a stock loop.
    // In production this would be the webhook response from the AI Lipsync worker
    const dummyVideo = 'https://cdn.pixabay.com/video/2019/04/18/22822-331201502_tiny.mp4';
    
    setResultVideo(dummyVideo);
    
    addAsset({
      url: faceImage, // Store face as thumbnail
      prompt: speechText,
      tool: 'lipsync',
      ratio: '1:1'
    });
    
    setGenerating(false);
  };

  const resetSession = () => {
    setFaceImage(null);
    setSpeechText('');
    setResultVideo(null);
  };

  return (
    <div className="flex w-full h-full text-white bg-[#0f0f0f] relative overflow-hidden font-sans">
      
      {/* Top Left Model Selector (Krea Style) */}
      <div className="absolute top-6 left-6 z-20">
        <div className="relative">
          <button 
            onClick={() => setShowModels(!showModels)} 
            className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:text-white transition-colors text-[14px] font-medium"
          >
            Model <span className="text-white">{selectedModel.name}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
          
          <AnimatePresence>
            {showModels && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -5 }} 
                className="absolute top-full left-0 mt-2 w-[280px] bg-[#1a1b1e] rounded-xl border border-white/5 shadow-2xl p-2 z-50"
              >
                {MODELS.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => { setSelectedModel(m); setShowModels(false); }} 
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-[13px] hover:bg-white/5 transition-colors ${selectedModel.id === m.id ? 'bg-white/5 text-white' : 'text-zinc-400'}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-white">{m.name}</span>
                      <span className="text-[11px] opacity-60 leading-tight">{m.desc}</span>
                    </div>
                    {selectedModel.id === m.id && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input 
        ref={fileRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={e => {
          const f = e.target.files?.[0]; 
          if (f) handleFaceUpload(f); 
          e.target.value = ''; // reset so same file can trigger again
        }} 
      />

      {/* Center Layout Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        
        {/* State 1: Generation UI */}
        {!resultVideo && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center max-w-4xl w-full"
          >
            {/* Title */}
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-[#1f2937] p-1.5 rounded-lg border border-white/10">
                <Mic className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Lip sync</h1>
            </div>

            {/* Main Interactive Box */}
            <div className="flex items-center bg-[#151516] p-3 rounded-[2rem] border border-white/[0.06] shadow-2xl">
              
              {/* FACE BLOCK */}
              <div className="relative group">
                <div 
                  onClick={() => fileRef.current?.click()}
                  className={`w-[160px] h-[160px] rounded-[1.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border ${faceImage ? 'border-emerald-500/30 bg-[#1f2937]' : 'border-white/[0.04] bg-[#222224] hover:bg-[#2A2A2D]'}`}
                >
                  {faceImage ? (
                    <img src={faceImage} className="w-full h-full object-cover rounded-[1.5rem]" alt="Face" />
                  ) : (
                    <>
                      <Smile className="w-8 h-8 text-zinc-400" />
                      <span className="text-[14px] font-medium text-zinc-300">Add face</span>
                    </>
                  )}
                </div>
                {faceImage && (
                  <button onClick={(e) => { e.stopPropagation(); setFaceImage(null); }} className="absolute -top-2 -right-2 bg-black border border-white/10 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-zinc-800">
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                )}
                {!faceImage && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded border border-white/10 whitespace-nowrap">
                    Step 1: Add face
                  </div>
                )}
              </div>

              <div className="px-5 text-2xl font-light text-zinc-600">+</div>

              {/* SPEECH BLOCK */}
              <div className="relative group flex-shrink-0">
                <div 
                  onClick={() => {
                     setTempSpeech(speechText);
                     setShowTextModal(true);
                  }}
                  className={`w-[320px] h-[160px] rounded-[1.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border ${speechText ? 'border-emerald-500/30 bg-[#1f2937]' : 'border-white/[0.04] bg-[#222224] hover:bg-[#2A2A2D]'}`}
                >
                  {speechText ? (
                    <div className="p-4 w-full h-full text-center flex flex-col items-center justify-center">
                       <AlignLeft className="w-6 h-6 text-emerald-400 mb-2 opacity-80" />
                       <p className="text-[13px] text-zinc-300 line-clamp-3 overflow-hidden italic leading-relaxed">"{speechText}"</p>
                    </div>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 text-zinc-400" />
                      <span className="text-[14px] font-medium text-zinc-300">Add speech</span>
                    </>
                  )}
                </div>
                {speechText && (
                  <button onClick={(e) => { e.stopPropagation(); setSpeechText(''); }} className="absolute -top-2 -right-2 bg-black border border-white/10 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-zinc-800">
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                )}
              </div>

              {/* GENERATE BUTTON */}
              <div className="ml-5 mr-1">
                <button 
                  onClick={handleGenerate}
                  disabled={!faceImage || !speechText || generating}
                  className={`px-6 py-4 rounded-xl font-medium tracking-wide flex items-center gap-2 transition-all ${
                    (!faceImage || !speechText) 
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                  } ${generating ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {generating ? (
                    <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate</>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* State 2: Result Video Viewer */}
        {resultVideo && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }} 
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-2xl flex flex-col items-center gap-6"
           >
              <div className="flex items-center justify-between w-full">
                 <button onClick={resetSession} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[14px] font-medium">
                    <ArrowLeft className="w-4 h-4" /> Start New
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-medium text-[13px] text-white">
                    <Download className="w-4 h-4" /> Download
                 </button>
              </div>

              <div className="w-full aspect-square md:aspect-[4/3] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                 {/* Simulate a video playing with stock video for demo effect */}
                 <video src={resultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                 
                 {/* Visual indicator that this is the generated result incorporating the face */}
                 {faceImage && (
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-lg border-2 border-white/20 overflow-hidden shadow-lg">
                       <img src={faceImage} className="w-full h-full object-cover grayscale opacity-70" alt="Reference" />
                    </div>
                 )}
              </div>
           </motion.div>
        )}

      </div>

      {/* TEXT INPUT MODAL */}
      <AnimatePresence>
        {showTextModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1a1b1e] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-2 p-5 border-b border-white/5">
                <AlignLeft className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Write Speech</h2>
              </div>
              
              <div className="p-5">
                <textarea 
                  value={tempSpeech}
                  onChange={(e) => setTempSpeech(e.target.value)}
                  placeholder="Type the script you want the face to say..."
                  className="w-full h-40 bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 text-[15px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 resize-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/5 bg-[#151516]">
                <button 
                  onClick={() => setShowTextModal(false)}
                  className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setSpeechText(tempSpeech);
                    setShowTextModal(false);
                  }}
                  disabled={!tempSpeech.trim()}
                  className="px-6 py-2.5 rounded-xl text-[14px] font-semibold bg-emerald-500 text-emerald-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Script
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
