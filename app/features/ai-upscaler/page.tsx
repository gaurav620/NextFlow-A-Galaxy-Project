import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import Link from 'next/link';
import { Sparkles, ImageDown, Zap, Search, Layers } from 'lucide-react';

export default function AIUpscalerPage() {
  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar theme="dark" />
      
      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[100px] px-6 overflow-hidden max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
            <div className="max-w-[600px] order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-8">
                    <Sparkles className="w-4 h-4 text-white" />
                    Feature
                </div>
                
                <h1 className="text-[56px] md:text-[76px] leading-[1.05] font-medium tracking-tight mb-8">
                    AI Enhancer<br />& Upscaler
                </h1>
                
                <p className="text-[19px] leading-relaxed text-zinc-400 mb-10 max-w-[500px]">
                    Turn low-resolution images into breathtaking masterpieces. Add incredible detail, fix artifacts, and upscale up to 4K effortlessly.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/dashboard/enhancer" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-zinc-200 transition-colors">
                        Upscale an image
                    </Link>
                </div>
            </div>

            {/* Showcase Visual */}
            <div className="relative order-1 lg:order-2 flex items-center justify-center">
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]">
                    
                    {/* Fake Before/After Slider */}
                    <div className="absolute inset-0 top-0 left-0 bottom-0 right-1/2 overflow-hidden border-r-2 border-white">
                        <img 
                            src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop" 
                            alt="Before Upscale" 
                            className="absolute max-w-none w-[200%] h-full object-cover opacity-50 blur-[2px]"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold tracking-wider rounded">BEFORE</div>
                    </div>

                    <div className="absolute inset-0 top-0 left-1/2 bottom-0 right-0 overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=100&w=2560&auto=format&fit=crop" 
                            alt="After Upscale" 
                            className="absolute max-w-none w-[200%] h-full object-cover -translate-x-1/2"
                        />
                        <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-xs font-bold tracking-wider rounded">AFTER (4K)</div>
                    </div>
                    
                    {/* Slider Handle Mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-zinc-200 cursor-ew-resize">
                        <div className="flex gap-1">
                            <div className="w-[1px] h-3 bg-black/40" />
                            <div className="w-[1px] h-3 bg-black/40" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Search className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Extreme Detail Retrieval</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Our AI hallucinates missing details intelligently. Restore old photos, blurred renders, or generated images instantly.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Custom HDR & Factor</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Control the intensity of the AI enhancement. Keep the original composition or let the AI add new intricate textures.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Zap className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Blazing Fast</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Upscale images up to 8K resolution in a matter of seconds. Optimized pipelines ensure you never wait for results.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6">
          <div className="max-w-[800px] mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Ready to enhance?</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-[500px] mx-auto">Drop your low-resolution images into NextFlow and experience the magic.</p>
              <Link href="/dashboard/enhancer" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-bold text-[16px] hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                  Start upscaling
              </Link>
          </div>
      </section>

      <Footer theme="dark" />
    </main>
  );
}
