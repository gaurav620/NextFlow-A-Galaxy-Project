import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import Link from 'next/link';
import { ImageIcon, Wand2, Sparkles, Layers, Box, PenTool } from 'lucide-react';

export default function AIImageGeneratorPage() {
  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar theme="dark" />
      
      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[100px] px-6 overflow-hidden max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
            <div className="max-w-[600px]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-8">
                    <ImageIcon className="w-4 h-4 text-white" />
                    Feature
                </div>
                
                <h1 className="text-[56px] md:text-[76px] leading-[1.05] font-medium tracking-tight mb-8">
                    AI Image<br />Generator
                </h1>
                
                <p className="text-[19px] leading-relaxed text-zinc-400 mb-10 max-w-[500px]">
                    The most advanced AI image generator. Realtime generation, text-to-image, high-fidelity models, and precise editing, all directly in your browser.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/dashboard/image" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-zinc-200 transition-colors">
                        Generate image
                    </Link>
                    <Link href="/dashboard/realtime" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white/10 text-white border border-white/10 font-semibold text-[15px] hover:bg-white/20 transition-colors">
                        Try Realtime
                    </Link>
                </div>
            </div>

            {/* Showcase Visual */}
            <div className="relative">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                        alt="AI Generation Showcase" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                            <Sparkles className="w-5 h-5 text-zinc-400 shrink-0" />
                            <p className="text-[15px] text-white font-medium truncate">
                                A hyper-realistic cinematic portrait of a cybernetic woman with glowing neon accents
                            </p>
                            <div className="w-8 h-8 rounded-full bg-white text-black shrink-0 flex items-center justify-center ml-auto">
                                <span className="font-bold text-xs tracking-tighter">N</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl rotate-12">
                     <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="sample" />
                </div>
                <div className="absolute top-1/2 -left-12 w-40 h-40 rounded-full overflow-hidden border border-white/10 shadow-2xl -rotate-6">
                     <img src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="sample" />
                </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Wand2 className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Live Canvas</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Sketch and prompt simultaneously. Watch the AI generate high-fidelity images in real-time as you draw and iterate.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Infinite Variations</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Generate variations of your favorite images instantly until you find the exact composition and mood you need.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <PenTool className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Precise Control</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Use advanced tools like ControlNet, img2img, and localized logic to guide the generation exactly to your vision.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6">
          <div className="max-w-[800px] mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Ready to create?</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-[500px] mx-auto">Join NextFlow today and start generating breathtaking images in seconds.</p>
              <Link href="/dashboard/image" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-bold text-[16px] hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                  Start generating
              </Link>
          </div>
      </section>

      {/* Krea completely dark footer on this specific page variant if needed, but standard light one is what we extracted */}
      <Footer theme="dark" />
    </main>
  );
}
