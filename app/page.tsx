'use client';

import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import { Pricing } from '@/components/krea-pricing';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BeforeAfterSlider } from '@/components/before-after-slider';
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
    <section className="relative min-h-screen flex flex-col items-center pt-[120px] sm:pt-[150px] pb-10 overflow-hidden font-sans border-b border-zinc-900 bg-black">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] h-[400px] bg-blue-900/30 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] sm:blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Responsive Text Clamps */}
        <h1 className="text-[clamp(36px,8vw,76px)] font-bold tracking-tighter text-white leading-[1.05] mb-6 px-2">
          NextFlow is the world's most<br className="hidden sm:block"/>powerful creative AI suite.
        </h1>
        <p className="text-[clamp(15px,3vw,20px)] text-zinc-400 mb-8 sm:mb-10 max-w-2xl font-medium px-4">
          Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
        </p>

        {/* Buttons - Flex Row on Desktop, Flex Col on Mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-16 sm:mb-20 w-full sm:w-auto px-6">
          <Link href="/sign-up" className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-[15px] rounded-full hover:bg-zinc-200 transition-colors">
            Start for free
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900/50 backdrop-blur-md border border-white/10 text-white font-semibold text-[15px] rounded-full hover:bg-zinc-800 transition-colors">
            Launch App
          </Link>
        </div>

        {/* The Slide Window / Realtime Showcase Mockup (Responsive) */}
        <div className="relative w-full max-w-[1000px] rounded-[24px] sm:rounded-[32px] border border-white/10 shadow-[0_0_80px_rgba(0,85,255,0.15)] overflow-hidden flex flex-col bg-[#070707] group ring-1 ring-white/5">
            {/* Fake Toolbar */}
            <div className="w-full h-10 sm:h-12 bg-[#111] flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)] animate-pulse" />
                   <span className="text-[10px] sm:text-[11px] font-bold text-zinc-300 uppercase tracking-widest hidden sm:block">Realtime Edge</span>
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

            {/* Mock Prompt Box */}
            <div className="absolute bottom-4 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 left-4 right-4 sm:w-max px-4 sm:px-6 py-3 sm:py-4 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center shadow-xl gap-3 sm:gap-4 overflow-hidden pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse hidden sm:block"/>
                <span className="text-[13px] sm:text-[15px] font-medium text-white/90 truncate">A futuristic neon glowing sphere, unreal engine 5, masterpiece...</span>
            </div>
        </div>
      </div>
    </section>
  );
}

/* ─── LIGHT LOGOS AND BENTO GRID ───────────────────────────── */

/* ─── LIGHT LOGOS AND BENTO GRID ───────────────────────────── */

function BentoGrid() {
    return (
        <section className="bg-[#f3f4f6] pt-12 sm:pt-16 pb-20 sm:pb-32 font-sans overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                
                {/* Animated Marquee Logos */}
                <div className="relative w-full overflow-hidden mb-12 sm:mb-16 flex items-center opacity-50 grayscale pb-6 sm:pb-8 pt-4">
                    {/* Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#f3f4f6] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#f3f4f6] to-transparent z-10" />
                    
                    <motion.div 
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                        className="flex items-center gap-10 sm:gap-16 min-w-max pr-10 sm:pr-16"
                    >
                        {[...models, ...models, ...models].map((m, i) => (
                            <div key={`${m.name}-${i}`} className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-zinc-900 tracking-tight shrink-0">
                                <span className="text-xl sm:text-3xl">{m.icon}</span> {m.name}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 auto-rows-min md:auto-rows-[250px]">
                    
                    {/* Industry Leading Speed */}
                    <div className="col-span-1 md:col-span-5 rounded-[24px] sm:rounded-3xl overflow-hidden relative shadow-sm group min-h-[200px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="Speed" />
                        <div className="absolute inset-0 bg-black/40" />
                        <h3 className="absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2 text-white font-bold text-[clamp(28px,5vw,40px)] leading-tight text-center drop-shadow-md">Industry-leading<br/>inference speed</h3>
                    </div>

                    {/* 22K Pixels */}
                    <div className="col-span-1 md:col-span-3 bg-[#e5e7eb] rounded-[24px] sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-zinc-200 min-h-[200px] md:min-h-0">
                        <p className="text-[clamp(56px,8vw,72px)] font-black text-black leading-none tracking-tighter mb-2">22K</p>
                        <p className="font-semibold text-zinc-800 text-sm sm:text-base">Pixels upscaling</p>
                    </div>

                    {/* Train */}
                    <div className="col-span-1 md:col-span-4 bg-[#e5e7eb] rounded-[24px] sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center border border-zinc-200 min-h-[200px] md:min-h-0">
                        <p className="text-[clamp(48px,8vw,72px)] font-black text-black leading-none tracking-tighter mb-2">Train</p>
                        <p className="font-semibold text-zinc-800 text-sm sm:text-base">Fine-tune models with your own data</p>
                    </div>

                    {/* 4K Native Interactive Slider Array */}
                    <div className="col-span-1 md:col-span-4 rounded-[24px] sm:rounded-3xl overflow-hidden relative shadow-sm group min-h-[250px] md:min-h-0">
                        <BeforeAfterSlider 
                            beforeImage="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop"
                            afterImage="https://images.unsplash.com/photo-1542596594-649edbc13630?q=100&w=2560&auto=format&fit=crop"
                            beforeLabel="SD"
                            afterLabel="4K"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 pointer-events-none z-10">
                            <p className="text-[clamp(48px,8vw,64px)] font-black text-white leading-none tracking-tighter mb-1 drop-shadow-md">4K</p>
                            <p className="font-semibold text-white/90 text-sm sm:text-lg drop-shadow-md">Native generative upscaling</p>
                        </div>
                    </div>

                    {/* NextFlow 1 vertical */}
                    <div className="col-span-1 md:col-span-6 md:row-span-2 rounded-[24px] sm:rounded-3xl overflow-hidden relative shadow-sm group min-h-[250px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="NextFlow 1" />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-10 left-0 right-0 text-center">
                            <p className="text-[clamp(44px,8vw,72px)] font-black text-white leading-none tracking-tighter drop-shadow-lg mb-2">NextFlow 1</p>
                        </div>
                    </div>

                    {/* Right column stack */}
                    <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-4 sm:gap-5 md:row-span-2">
                        <div className="flex-1 bg-[#e5e7eb] rounded-[24px] sm:rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-zinc-200">
                            <p className="text-[clamp(28px,5vw,32px)] font-bold text-black leading-none tracking-tight mb-2">Do not train</p>
                            <p className="font-medium text-zinc-700 text-xs sm:text-sm">Safely generate proprietary data</p>
                        </div>
                        <div className="flex-1 bg-[#e5e7eb] rounded-[24px] sm:rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-zinc-200">
                            <p className="text-[clamp(48px,8vw,64px)] font-black text-black leading-none tracking-tighter mb-2">64+</p>
                            <p className="font-bold text-zinc-800 text-base sm:text-lg">Models</p>
                        </div>
                    </div>

                    {/* Minimalist UI */}
                    <div className="col-span-1 md:col-span-4 rounded-[24px] sm:rounded-3xl overflow-hidden relative bg-black shadow-sm flex items-end p-6 sm:p-8 min-h-[200px] md:min-h-0">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800')] bg-cover opacity-30" />
                         <p className="text-[clamp(24px,5vw,32px)] font-bold text-white relative z-10 tracking-tight">Minimalist UI</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 min-h-0 lg:min-h-[700px]">
                    <div className="lg:col-span-5 flex flex-col gap-2">
                        {showcaseFeatures.map((feat) => (
                            <button
                                key={feat.id}
                                onClick={() => setActiveId(feat.id)}
                                className={`text-left p-5 sm:p-6 rounded-[24px] transition-all duration-300 relative focus:outline-none ${
                                    activeId === feat.id 
                                        ? 'bg-[#111] border border-white/5 shadow-lg' 
                                        : 'bg-transparent border border-transparent hover:bg-zinc-900/50'
                                }`}
                            >
                                <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${activeId === feat.id ? 'text-white' : 'text-zinc-600'}`}>{feat.title}</h3>
                                
                                <AnimatePresence>
                                {activeId === feat.id && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-zinc-400 leading-relaxed font-medium mt-2 text-sm sm:text-base">{feat.desc}</p>
                                        <Link href="/dashboard" className="inline-flex items-center gap-2 mt-4 sm:mt-6 text-white text-xs sm:text-sm font-semibold hover:gap-3 transition-all">
                                            Try it now <ArrowRight className="w-4 h-4"/>
                                        </Link>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-7 bg-[#111] border border-white/10 rounded-[24px] sm:rounded-[40px] overflow-hidden relative shadow-2xl min-h-[300px] sm:min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={showcaseFeatures.find(f => f.id === activeId)?.imgUrl || ''}
                                    fill
                                    className="object-cover"
                                    alt="Feature showcase"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── PRICING DETAILS ──────────────────────────────────────── */


export default function Home() {
  return (
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
