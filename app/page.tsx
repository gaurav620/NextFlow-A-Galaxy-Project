'use client';

import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import { Pricing } from '@/components/krea-pricing';import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Menu,
  X,
  Image as ImageIcon,
  Video,
  Box,
  MonitorPlay,
  FileBox,
  Sparkles,
  Settings2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/* ─── KREA-CLONE COMPONENT DATA ───────────────────────────── */

const showcaseFeatures = [
    {
        id: 'image',
        title: 'AI Image Generation',
        subtitle: '1000+ Styles',
        desc: 'Focus on simple text descriptions or your imagination.',
        imgUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'upscale',
        title: 'Image Upscaling',
        subtitle: '22K Resolution',
        desc: 'Enhancing fuzzy photos and low-res generations to flawless fidelity.',
        imgUrl: 'https://images.unsplash.com/photo-1634153037059-d88d266d71b3?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'realtime',
        title: 'Real-time Rendering',
        subtitle: '50ms Latency',
        desc: 'Instant generation at the edge. The future of creative flow.',
        imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'video',
        title: 'AI Video Generation',
        subtitle: 'Veo 3.1 & More',
        desc: 'Generate seamless motion, retarget characters, and interpolate frames.',
        imgUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'lora',
        title: 'LoRA Fine-tuning',
        subtitle: 'Custom Models',
        desc: 'Train bespoke models on your exact dataset within minutes.',
        imgUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
    }
];

const models = [
    { name: 'Veo 3.1', icon: '🌀' },
    { name: 'Ideogram', icon: '❄' },
    { name: 'Runway', icon: 'ℜ' },
    { name: 'Luma', icon: 'L' },
    { name: 'Flux', icon: '▴' },
    { name: 'Gemini', icon: '✨' },
    { name: 'NextFlow 1', icon: '⬡' }
];

/* ─── EXACT HEADER & MEGA MENU ────────────────────────────── */



/* ─── DARK HERO SECTION ────────────────────────────────────── */

function DarkHero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center pt-[150px] pb-10 overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/30 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-900/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center">
        <h1 className="text-[clamp(40px,7vw,72px)] font-bold tracking-tight text-white leading-[1.1] mb-6">
          NextFlow is the world's most<br/>powerful creative AI suite.
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] text-zinc-400 mb-10 max-w-2xl font-medium">
          Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
        </p>

        <div className="flex items-center gap-4 mb-20">
          <Link href="/sign-up" className="px-8 py-3.5 bg-white text-black font-semibold text-[15px] rounded-full hover:bg-zinc-200 transition-colors">
            Start for free
          </Link>
          <Link href="/dashboard" className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-semibold text-[15px] rounded-full hover:bg-white/10 transition-colors">
            Launch App
          </Link>
        </div>

        {/* iMac Dashboard Mockup */}
        <div className="relative w-full max-w-[900px] aspect-[16/10] mt-4">
            <div className="absolute inset-0 bg-[#1e1e1e] rounded-[32px] border-[12px] border-[#111] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden shadow-black flex flex-col">
                <div className="w-full h-8 bg-[#2a2a2a] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 bg-[#111] relative p-6 flex flex-col">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="w-8 h-8 rounded bg-white/5" />
                        <div className="w-8 h-8 rounded bg-white/5" />
                    </div>
                    {/* Simulated App inside Monitor */}
                    <div className="flex-1 flex flex-col items-center justify-center mt-4">
                        <div className="w-full max-w-lg aspect-[21/9] rounded-xl bg-gradient-to-br from-orange-400/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=600')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                            <span className="text-white/60 font-medium z-10 text-lg">Let's create something</span>
                        </div>
                        <div className="flex gap-4">
                             <div className="w-40 h-24 rounded-xl bg-white/5 border border-white/10 flex items-end p-3"><span className="text-xs text-white">Generate Image</span></div>
                             <div className="w-40 h-24 rounded-xl bg-white/5 border border-white/10 flex items-end p-3"><span className="text-xs text-white">Generate Video</span></div>
                             <div className="w-40 h-24 rounded-xl bg-white/5 border border-white/10 flex items-end p-3"><span className="text-xs text-white">Realtime Rendering</span></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* iMac Stand */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[160px] h-8 bg-zinc-800 rounded-b-xl" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }} />
        </div>
      </div>
    </section>
  );
}

/* ─── LIGHT LOGOS AND BENTO GRID ───────────────────────────── */

function BentoGrid() {
    return (
        <section className="bg-[#f3f4f6] pt-16 pb-32 font-sans overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* Marquee Logos */}
                <div className="flex items-center justify-between opacity-50 grayscale mb-16 px-4">
                    {models.map(m => (
                        <div key={m.name} className="flex items-center gap-2 text-2xl font-bold text-zinc-900 tracking-tight">
                            <span>{m.icon}</span> {m.name}
                        </div>
                    ))}
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-12 gap-5 auto-rows-[250px]">
                    
                    {/* Industry Leading Speed */}
                    <div className="col-span-12 md:col-span-5 rounded-3xl overflow-hidden relative shadow-sm group">
                        <img src="https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Speed" />
                        <div className="absolute inset-0 bg-black/40" />
                        <h3 className="absolute inset-x-8 top-[35%] -translate-y-1/2 text-white font-bold text-4xl leading-tight text-center drop-shadow-md">Industry-leading<br/>inference speed</h3>
                    </div>

                    {/* 22K Pixels */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-3 bg-[#e5e7eb] rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-zinc-200">
                        <p className="text-[72px] font-black text-black leading-none tracking-tighter mb-2">22K</p>
                        <p className="font-semibold text-zinc-800">Pixels upscaling</p>
                    </div>

                    {/* Train */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 bg-[#e5e7eb] rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-zinc-200">
                        <p className="text-[72px] font-black text-black leading-none tracking-tighter mb-2">Train</p>
                        <p className="font-semibold text-zinc-800">Fine-tune models with your own data</p>
                    </div>

                    {/* 4K Native */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-4 rounded-3xl overflow-hidden relative shadow-sm">
                        <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="4K" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-8 left-8">
                            <p className="text-[64px] font-black text-white leading-none tracking-tighter mb-1">4K</p>
                            <p className="font-semibold text-white/90 text-lg">Native image generation</p>
                        </div>
                    </div>

                    {/* NextFlow 1 vertical */}
                    <div className="col-span-12 sm:col-span-6 md:col-span-6 row-span-2 rounded-3xl overflow-hidden relative shadow-sm group">
                        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="NextFlow 1" />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-10 left-0 right-0 text-center">
                            <p className="text-[72px] font-black text-white leading-none tracking-tighter drop-shadow-lg mb-2">NextFlow 1</p>
                        </div>
                    </div>

                    {/* Right column stack */}
                    <div className="col-span-12 md:col-span-2 flex flex-col gap-5 row-span-2">
                        <div className="flex-1 bg-[#e5e7eb] rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-zinc-200">
                            <p className="text-[32px] font-bold text-black leading-none tracking-tight mb-2">Do not train</p>
                            <p className="font-medium text-zinc-700 text-sm">Safely generate proprietary data</p>
                        </div>
                        <div className="flex-1 bg-[#e5e7eb] rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-zinc-200">
                            <p className="text-[64px] font-black text-black leading-none tracking-tighter mb-2">64+</p>
                            <p className="font-bold text-zinc-800 text-lg">Models</p>
                        </div>
                    </div>

                    {/* Minimalist UI */}
                    <div className="col-span-12 md:col-span-4 rounded-3xl overflow-hidden relative bg-black shadow-sm flex items-end p-8">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800')] bg-cover opacity-30" />
                         <p className="text-[32px] font-bold text-white relative z-10 tracking-tight">Minimalist UI</p>
                    </div>

                </div>
            </div>
        </section>
    );
}

/* ─── INTERACTIVE SHOWCASE (SPLIT VIEW) ────────────────────── */

function FeatureSwitcher() {
    const [activeId, setActiveId] = useState(showcaseFeatures[0].id);

    return (
        <section className="bg-black text-white font-sans pt-32 pb-40 px-6 border-b border-zinc-900">
            <div className="max-w-[1400px] mx-auto">
                <h2 className="text-[clamp(32px,4vw,56px)] font-bold tracking-tight leading-[1.1] max-w-3xl mb-24">
                    Generate or edit high quality images, videos, and 3D objects with AI
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 min-h-[700px]">
                    <div className="md:col-span-4 flex flex-col gap-2">
                        {showcaseFeatures.map((feat) => (
                            <button
                                key={feat.id}
                                onClick={() => setActiveId(feat.id)}
                                className={`text-left p-6 rounded-3xl transition-all duration-300 relative focus:outline-none ${
                                    activeId === feat.id 
                                        ? 'bg-[#111] border border-white/5' 
                                        : 'bg-transparent border border-transparent hover:bg-zinc-900/50'
                                }`}
                            >
                                <h3 className={`text-2xl font-bold tracking-tight mb-2 ${activeId === feat.id ? 'text-white' : 'text-zinc-600'}`}>{feat.title}</h3>
                                
                                <AnimatePresence>
                                {activeId === feat.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-zinc-400 leading-relaxed font-medium mt-2">{feat.desc}</p>
                                        <Link href="/dashboard" className="inline-flex items-center gap-2 mt-6 text-white text-sm font-semibold hover:gap-3 transition-all">
                                            Try it now <ArrowRight className="w-4 h-4"/>
                                        </Link>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </button>
                        ))}
                    </div>

                    <div className="md:col-span-8 bg-[#111] border border-white/10 rounded-[40px] overflow-hidden relative shadow-2xl min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={activeId}
                                src={showcaseFeatures.find(f => f.id === activeId)?.imgUrl}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── PRICING DETAILS ──────────────────────────────────────── */


/* ─── KREA FOOTER EXACT CLONE ──────────────────────────────── */
    <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Navbar />
      <DarkHero />
      <BentoGrid />
      <FeatureSwitcher />
      <Pricing />
      <Footer theme="light" />
    </main>
  );
}
