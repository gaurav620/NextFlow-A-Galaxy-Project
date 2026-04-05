import Link from 'next/link';
import Image from 'next/image';
import { BeforeAfterSlider } from '@/components/before-after-slider';

export function KreaHero() {
  return (
    <section className="relative flex flex-col items-center pt-[120px] sm:pt-[150px] pb-24 overflow-hidden font-sans border-b border-zinc-900 bg-black">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] h-[400px] bg-blue-900/30 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] sm:blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Responsive Text Clamps */}
        <h1 className="text-[clamp(36px,8vw,76px)] font-bold tracking-tighter text-white leading-[1.05] mb-6 px-2">
          NextFlow.ai is the world's most<br className="hidden sm:block"/>powerful creative AI suite.
        </h1>
        <p className="text-[clamp(15px,3vw,20px)] text-zinc-400 mb-8 sm:mb-10 max-w-2xl font-medium px-4">
          Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
        </p>

        {/* Buttons - Flex Row on Desktop, Flex Col on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-20 sm:mb-24 w-full sm:w-auto px-6">
          <Link href="/pricing" className="w-full sm:w-[160px] flex justify-center py-3.5 bg-white text-black font-bold text-[15px] rounded-full hover:bg-zinc-200 transition-colors">
            Start for free
          </Link>
          <Link href="/dashboard" className="w-full sm:w-[160px] flex justify-center py-3.5 bg-zinc-900/50 backdrop-blur-md border border-white/10 text-white font-bold text-[15px] rounded-full hover:bg-zinc-800 transition-colors">
            Launch App
          </Link>
        </div>

        {/* The Slide Window / Realtime Showcase Mockup (Responsive) */}
        <div className="relative w-full max-w-[1000px] rounded-[24px] sm:rounded-[32px] border border-white/10 shadow-[0_0_80px_rgba(0,85,255,0.15)] overflow-hidden flex flex-col bg-[#070707] group ring-1 ring-white/5 mx-auto">
            {/* Fake Toolbar */}
            <div className="w-full h-10 sm:h-12 bg-[#111] flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse" />
                   <span className="text-[10px] sm:text-[11px] font-bold text-zinc-300 uppercase tracking-widest hidden sm:block">Let's create something</span>
                </div>
            </div>
            
            {/* Sliding Window Canvas */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full flex bg-[#0a0a0a]">
                <BeforeAfterSlider 
                    beforeImage="https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800&auto=format&fit=crop"
                    afterImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=100&w=2560&auto=format&fit=crop"
                    beforeLabel="Canvas"
                    afterLabel="Render"
                />
            </div>
        </div>
      </div>
    </section>
  );
}
