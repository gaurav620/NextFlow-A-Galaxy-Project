import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import Link from 'next/link';
import { Video, Film, Gauge, Wand2, Activity } from 'lucide-react';

export default function AIVideoGeneratorPage() {
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
                    <Video className="w-4 h-4 text-white" />
                    Text to Video Generator
                </div>
                
                <h1 className="text-[56px] md:text-[76px] leading-[1.05] font-medium tracking-tight mb-8">
                    AI Video<br />Generator
                </h1>
                
                <p className="text-[19px] leading-relaxed text-zinc-400 mb-10 max-w-[500px]">
                    Create cinematic, high-resolution videos from text or images. Control motion, style, and flow with unparalleled precision.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/dashboard/video" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-zinc-200 transition-colors">
                        Generate video
                    </Link>
                    <Link href="/dashboard/motion" className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white/10 text-white border border-white/10 font-semibold text-[15px] hover:bg-white/20 transition-colors">
                        Try Motion Transfer
                    </Link>
                </div>
            </div>

            {/* Showcase Visual */}
            <div className="relative order-1 lg:order-2">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]">
                    {/* HTML5 Video Showcase */}
                    <video 
                        className="w-full h-full object-cover opacity-90 scale-[1.02] transition-transform duration-1000"
                        src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-cyberpunk-city-32693-large.mp4"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        poster="https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=2564&auto=format&fit=crop"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                            <Film className="w-5 h-5 text-zinc-400 shrink-0" />
                            <p className="text-[15px] text-white font-medium truncate">
                                A sweeping drone shot over a glowing cyberpunk city, neon lights reflecting on wet streets
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-8 -left-8 w-48 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl z-20">
                     <div className="flex items-center gap-3 mb-2">
                         <Activity className="w-4 h-4 text-emerald-400" />
                         <span className="text-xs font-semibold uppercase tracking-wider text-white">Motion</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-400 w-[85%]" />
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
                        <Wand2 className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Image to Video</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Bring your still images to life. Add cinematic movement, physics, and particle effects seamlessly.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Film className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Keyframe Control</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Direct the camera like a pro. Set precise keyframes to control pan, tilt, zoom, and roll automatically.</p>
                </div>
                
                <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Gauge className="w-6 h-6 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Upscale & Interpolate</h3>
                    <p className="text-zinc-400 leading-relaxed text-[15px]">Enhance any video up to 4K resolution and 60 FPS. Turn low-res footage into silky-smooth masterpieces.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6">
          <div className="max-w-[800px] mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Ready to animate?</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-[500px] mx-auto">Create stunning videos in seconds with NextFlow's cutting-edge video generation models.</p>
              <Link href="/dashboard/video" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-bold text-[16px] hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                  Start generating
              </Link>
          </div>
      </section>

      <Footer theme="dark" />
    </main>
  );
}
