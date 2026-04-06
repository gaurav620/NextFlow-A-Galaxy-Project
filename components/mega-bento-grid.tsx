'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const models = [
  { name: 'Veo 3', icon: '🌀' },
  { name: 'Ideogram', icon: '❄' },
  { name: 'Runway', icon: 'ℜ' },
  { name: 'Luma', icon: 'L' },
  { name: 'Flux', icon: '▴' },
  { name: 'Gemini', icon: '✨' },
  { name: 'NextFlow 1', icon: '⬡' },
  { name: 'Kling', icon: 'K' },
  { name: 'Hailuo', icon: 'H' },
];

const stats = [
  { value: '22K', label: 'Pixels upscaling', dark: false },
  { value: '4K', label: 'Native image generation', dark: false },
  { value: '3s', label: 'For a 1024px Flux image', dark: false },
  { value: '64+', label: 'Models available', dark: false },
  { value: '1000+', label: 'Styles to choose from', dark: true },
  { value: '120fps', label: 'Video interpolation', dark: true },
];

export function MegaBentoGrid() {
  return (
    <section className="bg-white pt-8 pb-24 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Headline */}
        <h2 className="text-[clamp(36px,6.5vw,88px)] font-bold text-black tracking-tighter leading-[1.05] text-center mb-12 max-w-4xl mx-auto">
          The industry&apos;s best AI models.{' '}
          <span className="text-zinc-400">In one subscription.</span>
        </h2>

        {/* Models Marquee — standalone, not nested */}
        <div className="relative w-full overflow-hidden mb-16 flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10" />

          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 32 }}
            className="flex items-center gap-12 sm:gap-20 min-w-max pr-12 sm:pr-20"
          >
            {[...models, ...models, ...models].map((m, i) => (
              <div
                key={`${m.name}-${i}`}
                className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-black tracking-tight shrink-0 opacity-30"
              >
                <span className="text-2xl sm:text-3xl">{m.icon}</span>
                {m.name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bento Grid — fixed, no nesting */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[240px] sm:auto-rows-[280px]">

          {/* Hero image — spans 6 cols, 1 row */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-6 rounded-[28px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=1200"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Industry-leading speed"
            />
            <div className="absolute inset-0 bg-black/40" />
            <h3 className="absolute inset-x-6 sm:inset-x-8 top-1/2 -translate-y-1/2 text-white font-bold text-[clamp(24px,4vw,48px)] leading-tight text-center drop-shadow-md">
              Industry-leading<br />inference speed
            </h3>
          </div>

          {/* 22K stat */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <p className="text-[clamp(52px,7vw,80px)] font-black text-black leading-none tracking-tighter mb-2">22K</p>
            <p className="font-bold text-zinc-600 text-[13px]">Pixels upscaling</p>
          </div>

          {/* Train stat */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
            <p className="text-[clamp(40px,6vw,64px)] font-black text-black leading-none tracking-tighter mb-2">Train</p>
            <p className="font-bold text-zinc-600 text-[13px]">Fine-tune with your data</p>
          </div>

          {/* 4K with portrait photo */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-[28px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt="4K generation"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[56px] lg:text-[64px] font-black text-white leading-none tracking-tighter mb-0.5">4K</p>
              <p className="font-medium text-white/80 text-[13px]">Native image generation</p>
            </div>
          </div>

          {/* Minimalist UI dark card */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-black rounded-[28px] overflow-hidden relative group shadow-sm flex items-end p-6 sm:p-8">
            <div
              className="absolute inset-0 opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800')" }}
            />
            <p className="text-[26px] sm:text-[30px] font-bold text-white relative z-10 tracking-tight leading-tight">
              Minimalist UI<br /><span className="text-white/50 font-medium text-[15px]">No friction at all</span>
            </p>
          </div>

          {/* NextFlow 1 — Large feature hero (6 cols, 2 rows) */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-6 lg:row-span-2 rounded-[28px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              alt="NextFlow 1"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[clamp(48px,8vw,110px)] font-black text-white leading-none tracking-tighter drop-shadow-2xl mb-2 text-center">
                NextFlow 1
              </p>
              <p className="text-white/80 font-medium text-[14px] sm:text-[16px] text-center px-4">
                Ultra-realistic flagship model
              </p>
            </div>
          </div>

          {/* Do not train */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-5 sm:p-6 flex flex-col justify-center items-center text-center">
            <p className="text-[22px] sm:text-[26px] font-bold text-black leading-tight tracking-tight mb-2">Do not train</p>
            <p className="font-medium text-zinc-500 text-[12px] sm:text-[13px]">Safely generate proprietary data</p>
          </div>

          {/* 64+ models */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-5 sm:p-6 flex flex-col justify-center items-center text-center">
            <p className="text-[56px] sm:text-[64px] font-black text-black leading-none tracking-tighter mb-2">64+</p>
            <p className="font-bold text-zinc-700 text-[13px]">Models</p>
          </div>

          {/* Asset Manager */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-zinc-900 rounded-[28px] overflow-hidden relative group shadow-sm">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5 opacity-20 p-3">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="bg-white/40 rounded-sm" />
              ))}
            </div>
            <p className="text-[20px] sm:text-[24px] font-bold text-white relative z-10 m-6 tracking-tight leading-tight max-w-[200px]">
              Full-fledged asset manager
            </p>
          </div>

          {/* 1000+ Styles */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-zinc-900 rounded-[28px] overflow-hidden relative shadow-sm border border-zinc-800 text-white p-6 sm:p-8 group">
            <div
              className="absolute inset-0 opacity-15 mix-blend-screen group-hover:scale-105 transition-transform bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800')" }}
            />
            <p className="text-[32px] sm:text-[42px] font-bold leading-none tracking-tight relative z-10 pb-2">
              1000+<br />styles
            </p>
          </div>

          {/* Realtime Canvas */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-[28px] overflow-hidden bg-black relative group shadow-sm flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-30 mix-blend-color-dodge group-hover:scale-105 transition-transform bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800')" }}
            />
            <p className="text-white font-bold text-[26px] sm:text-[30px] tracking-tight relative z-10 text-center px-4">
              Realtime Canvas
            </p>
          </div>

          {/* Text to 3D */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-5 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <p className="text-[26px] sm:text-[32px] font-bold text-black tracking-tight z-20">Text to 3D</p>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-24 h-24 bg-zinc-500 rotate-45 transform-gpu blur-sm" />
            </div>
            <p className="text-zinc-400 text-[12px] font-medium mt-2 z-20">Full 3D object generation</p>
          </div>

          {/* Lipsync */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-3 bg-[#f4f4f5] rounded-[28px] p-5 sm:p-8 flex flex-col justify-between">
            <p className="text-[22px] sm:text-[26px] font-bold text-black tracking-tight">Lipsync</p>
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 py-2">
              {[4, 8, 14, 6, 18, 5, 12, 16, 8, 4, 10, 7].map((h, i) => (
                <div key={i} className="w-2 bg-black rounded-full" style={{ height: `${h * 4}px` }} />
              ))}
            </div>
            <p className="text-zinc-400 text-[12px] font-medium">Sync audio to any face</p>
          </div>
        </div>
      </div>
    </section>
  );
}
