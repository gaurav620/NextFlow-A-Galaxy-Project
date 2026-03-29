'use client';

import { ArrowRight } from 'lucide-react';

const sampleImages = [
  {
    src: 'https://images.unsplash.com/photo-1578500494198-246f612b3b6d?q=80&w=500&auto=format&fit=crop',
    alt: 'Blue and white vase',
  },
  {
    src: 'https://images.unsplash.com/photo-1613274554329-70f997f5789f?q=80&w=500&auto=format&fit=crop',
    alt: 'Vase with dried flowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=500&auto=format&fit=crop',
    alt: 'Leaf in vase',
  },
  {
    src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=500&auto=format&fit=crop',
    alt: 'Box',
  },
];

function VennLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const containerSize = size === 'lg' ? 'w-10 h-10' : 'w-[22px] h-[22px]';
  const circleSize = size === 'lg' ? 'w-[22px] h-[22px]' : 'w-[14px] h-[14px]';
  const offsetTop = size === 'lg' ? '-top-1' : '-top-[2px]';
  const offsetBottom = size === 'lg' ? '-bottom-0.5' : 'bottom-0';
  const offsetLeft = size === 'lg' ? '-left-0.5' : '-left-[1px]';
  const offsetRight = size === 'lg' ? '-right-0.5' : '-right-[1px]';
  
  return (
    <div className={`relative ${containerSize} flex items-center justify-center flex-shrink-0`}>
      <div className={`absolute ${circleSize} rounded-full bg-red-500/90 ${offsetTop} left-1/2 -translate-x-1/2 mix-blend-screen shadow-[0_0_8px_rgba(239,68,68,0.5)]`} />
      <div className={`absolute ${circleSize} rounded-full bg-green-500/90 ${offsetBottom} ${offsetLeft} mix-blend-screen shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
      <div className={`absolute ${circleSize} rounded-full bg-blue-500/90 ${offsetBottom} ${offsetRight} mix-blend-screen shadow-[0_0_8px_rgba(59,130,246,0.5)]`} />
    </div>
  );
}

export default function TrainLoraPage() {
  return (
    <div className="flex flex-col w-full h-full bg-[#111] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 font-sans">
      
      {/* Hero Banner Area */}
      <div className="relative w-full h-[420px] shrink-0 bg-[#000] border-b border-zinc-900 flex overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-14 z-20 relative bg-gradient-to-r from-black via-black to-transparent">
          <div className="flex items-center gap-3 mb-5">
            <VennLogo />
            <h1 className="text-white text-[28px] font-semibold tracking-tight">Train Lora</h1>
          </div>
          <p className="max-w-[440px] text-zinc-400 text-[14px] leading-relaxed mb-8">
            Teach a model to generate specific styles, faces, or products. Upload images of the same subject and let NextFlow analyze the content over a few minutes. Load your Loras in the image and video models to use them.
          </p>
          <div>
            <button className="bg-white text-black font-semibold text-[13px] px-5 py-2.5 rounded-full hover:bg-zinc-100 transition-all flex items-center gap-2">
              Train new Lora
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Subtle reflection overlay on left side at bottom */}
          <div className="absolute bottom-0 left-0 right-1/4 h-32 bg-gradient-to-t from-zinc-800/10 to-transparent pointer-events-none blur-xl" />
        </div>
        
        {/* Right Content - Images */}
        <div className="absolute right-0 top-0 bottom-0 w-[60%] flex">
           {/* Fade overlay so images blend smoothly into black on the left */}
           <div className="absolute top-0 bottom-0 left-0 w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
           
           {sampleImages.map((img, i) => (
             <div key={i} className="flex-1 h-full relative group cursor-pointer overflow-hidden border-l border-zinc-900/50">
               <img 
                 src={img.src} 
                 alt={img.alt} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
               />
               {/* Vignette effect on each image */}
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 opacity-60" />
             </div>
           ))}
        </div>
      </div>
      
      {/* Empty State / Bottom Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#111]">
        <div className="flex flex-col items-center max-w-sm text-center -mt-10">
          <div className="mb-6 flex items-center justify-center border border-zinc-800 bg-zinc-900/50 w-16 h-16 rounded-2xl shadow-xl shadow-black/50">
            <VennLogo size="lg" />
          </div>
          <h2 className="text-zinc-100 text-[17px] font-semibold mb-2">No LoRAs yet</h2>
          <p className="text-zinc-500 text-[13px] leading-relaxed mb-8">
            Loras are customized models. Upload images of the same object, face, or style, to teach models how to reproduce them.
          </p>
          <button className="bg-white text-black font-semibold text-[13px] px-8 py-2.5 rounded-full hover:bg-zinc-100 transition-colors mb-4 inline-flex items-center justify-center min-w-[160px] shadow-lg shadow-white/5">
            Train Lora
          </button>
          <button className="text-zinc-400 font-medium text-[13px] hover:text-white transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
