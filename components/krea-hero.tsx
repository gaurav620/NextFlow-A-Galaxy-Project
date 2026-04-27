'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const heroImages = [
  {
    label: 'NextFlow 1',
    prompt: 'Cinematic photo of a person in a linen jacket',
    img: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1600&auto=format&fit=crop',
    btn: 'Generate image',
    href: '/dashboard/image',
  },
  {
    label: 'Veo 3',
    prompt: 'An animated capybara talking about NextFlow.ai',
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1600&auto=format&fit=crop',
    btn: 'Generate video',
    href: '/dashboard/video',
  },
  {
    label: 'Topaz Upscaler',
    prompt: 'Upscale image 512px → 8K',
    img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1600&auto=format&fit=crop',
    btn: 'Upscale image',
    href: '/dashboard/enhancer',
  },
  {
    label: 'Hailuo',
    prompt: 'Advertisement shot of a sandwich vertically exploding into layers',
    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1600&auto=format&fit=crop',
    btn: 'Animate image',
    href: '/dashboard/video',
  },
  {
    label: 'NextFlow 1',
    prompt: 'Dramatic photo of an old offroad truck racing through the desert',
    img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1600&auto=format&fit=crop',
    btn: 'Generate image',
    href: '/dashboard/image',
  },
];

const dashboardScreenshot =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2560&auto=format&fit=crop';

export function KreaHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ─── MAIN HERO ─── */}
      <section
        className="relative flex flex-col items-center pt-[130px] sm:pt-[160px] pb-20 overflow-hidden font-sans"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(30,30,60,0.7) 0%, #000 70%)',
          backgroundColor: '#000',
        }}
      >
        {/* Subtle background image (forest/dark environment like Krea) */}
        <div
          className="absolute inset-0 opacity-20 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=30&w=2560&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div
          className={`relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Headline */}
          <h1 className="text-[clamp(34px,6.5vw,76px)] font-bold tracking-tighter text-white leading-[1.05] mb-5 px-2 max-w-4xl">
            NextFlow.ai is the world's most powerful creative AI suite.
          </h1>
          <p className="text-[clamp(15px,2.2vw,19px)] text-zinc-400 mb-10 max-w-xl font-medium">
            Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-16 w-full sm:w-auto px-6 sm:px-0">
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-[15px] rounded-full hover:bg-zinc-100 active:scale-[0.98] transition-all shadow-lg"
            >
              Start for free
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold text-[15px] rounded-full hover:bg-white/10 active:scale-[0.98] transition-all backdrop-blur"
            >
              Launch App
            </Link>
          </div>

          {/* Monitor/App Mockup */}
          <div className="relative w-full max-w-[960px] mx-auto">
            {/* Glow behind monitor */}
            <div className="absolute -inset-4 bg-blue-900/20 rounded-full blur-[80px] pointer-events-none" />

            {/* iMac-style device frame */}
            <div className="relative rounded-[18px] sm:rounded-[24px] border border-white/10 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-[#0d0d0d]">
              {/* Toolbar */}
              <div className="h-9 sm:h-11 bg-[#161616] border-b border-white/[0.06] flex items-center px-4 gap-2 flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-5 w-44 sm:w-64 bg-white/5 rounded border border-white/10 flex items-center justify-center gap-2 px-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium tracking-wide uppercase">nextflow.ai</span>
                  </div>
                </div>
              </div>
              {/* Screen */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={dashboardScreenshot}
                  alt="NextFlow dashboard"
                  className="w-full h-full object-cover opacity-80"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10" />
                {/* Overlay UI elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-2xl">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <span className="text-black font-black text-sm tracking-tighter">N</span>
                    </div>
                    <span className="text-white font-semibold text-base tracking-tight">Let's create something</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE CARDS (horizontal scroll) ─── */}
      <section className="bg-white py-16 sm:py-20 font-sans overflow-hidden">
        <div
          className="flex flex-row gap-4 sm:gap-5 overflow-x-auto pb-6 px-4 sm:px-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {heroImages.map((card, i) => (
            <div
              key={i}
              className="group relative shrink-0 snap-center w-[80vw] sm:w-[300px] lg:w-[320px] h-[480px] sm:h-[520px] rounded-[28px] overflow-hidden cursor-pointer"
              style={{ minWidth: 'min(80vw, 320px)' }}
            >
              {/* Background image */}
              <img
                src={card.img}
                alt={card.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Model badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2 text-white font-bold text-[14px]">
                <div className="w-[22px] h-[22px] rounded-[6px] bg-white flex items-center justify-center shadow">
                  <span className="text-black font-black text-[11px] tracking-tighter">N</span>
                </div>
                {card.label}
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-7 left-6 right-6 flex flex-col gap-3">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em]">Prompt</p>
                <h3 className="text-white font-semibold text-[20px] sm:text-[22px] leading-tight pr-2">
                  &ldquo;{card.prompt}&rdquo;
                </h3>
                <Link
                  href={card.href}
                  className="self-start mt-1 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold text-[13px] border border-white/10 transition-colors"
                >
                  {card.btn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
