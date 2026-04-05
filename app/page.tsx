'use client';

import { useState, useEffect, useRef } from 'react';
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

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeaturesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setFeaturesOpen(false);
    }, 150);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b ${scrolled ? 'bg-black/90 backdrop-blur-xl border-white/5' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
            <span className="text-black font-extrabold text-sm font-sans tracking-tighter">N</span>
          </div>
          <span className={`font-semibold text-lg tracking-tight ${scrolled ? 'text-white' : 'text-white'}`}>NextFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/dashboard" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">App</Link>
          
          <div 
            className="relative h-[72px] flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className={`text-[13px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${featuresOpen ? 'bg-white/[0.08] text-white' : 'bg-transparent text-white hover:bg-white/5 hover:text-white'}`}>
              Features <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {featuresOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-[72px] left-1/2 -translate-x-[45%] w-[1000px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-black/5 p-8 flex gap-10 z-[100]"
                    >
                        {/* Links Columns */}
                        <div className="flex-[2] grid grid-cols-3 gap-8">
                            
                            {/* Column 1: Generate */}
                            <div className="flex flex-col">
                                <h4 className="text-[14px] font-medium text-zinc-400 mb-6">Generate</h4>
                                <div className="flex flex-col gap-6">
                                    {/* AI Image Generation */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <ImageIcon className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI Image Generation
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/image" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Text to Image <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/realtime" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Realtime Image Generation <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* AI Video Generation */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <Video className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI Video Generation
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/video" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Text to Video <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/motion" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Motion Transfer <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* AI 3D Generation */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <Box className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI 3D Generation
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/3d" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Text to 3D Object <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/3d" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Image to 3D Object <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Column 2: Edit */}
                            <div className="flex flex-col">
                                <h4 className="text-[14px] font-medium text-zinc-400 mb-6">Edit</h4>
                                <div className="flex flex-col gap-6">
                                    {/* AI Image Enhancements */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <Sparkles className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI Image Enhancements
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/enhancer" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Upscaling <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/edit" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Generative Image Editing <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* AI Video Enhancements */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <MonitorPlay className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI Video Enhancements
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/video-restyle" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Frame Interpolation <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/video-restyle" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Video Style Transfer <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/enhancer" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Video Upscaling <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Column 3: Customize */}
                            <div className="flex flex-col">
                                <h4 className="text-[14px] font-medium text-zinc-400 mb-6">Customize</h4>
                                <div className="flex flex-col gap-6">
                                    {/* AI Finetuning */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <Settings2 className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            AI Finetuning
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/train" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Image LoRA Finetuning <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/train" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Video LoRA Finetuning <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                            <Link href="/dashboard/train" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                LoRA Sharing <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* File Management */}
                                    <div>
                                        <div className="flex items-center gap-3 text-black mb-3 font-semibold text-[14px]">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200/60 shadow-sm">
                                                <FileBox className="w-[15px] h-[15px] text-zinc-600"/>
                                            </div>
                                            File Management
                                        </div>
                                        <div className="flex flex-col gap-2 pl-[44px]">
                                            <Link href="/dashboard/assets" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
                                                Krea Asset Manager <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel Card */}
                        <div className="w-[340px] rounded-[16px] overflow-hidden relative group cursor-pointer bg-[#0A0A0A] shrink-0 h-[430px] border border-black/80">
                            <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" alt="card" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />
                            
                            <div className="absolute top-5 left-5 flex items-center gap-2">
                                <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2"><div className="w-4 h-4 rounded bg-white flex items-center justify-center"><span className="text-black font-extrabold text-[10px] tracking-tighter">N</span></div> NextFlow 1</span>
                            </div>
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-[10px] text-white/50 font-bold tracking-[0.15em] mb-3 uppercase">Prompt</p>
                                <p className="text-white font-medium text-[20px] leading-tight mb-5 drop-shadow-sm">“Cinematic photo of a person in a linen jacket”</p>
                                <Link href="/dashboard/image" className="inline-flex px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-lg text-white text-[13px] font-semibold transition-colors">
                                    Generate image
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <Link href="/dashboard/image" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">Image Generator</Link>
          <Link href="/dashboard/video" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">Video Generator</Link>
          <Link href="/dashboard/enhancer" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">Upscaler</Link>
          <Link href="/dashboard/workflows" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">API</Link>
          <Link href="/dashboard/pricing" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="#" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors">Enterprise</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/sign-up"
            className="px-4 py-2 text-[13px] font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            Sign up for free
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-[13px] font-bold text-black bg-white hover:bg-zinc-200 rounded-full transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
}

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
function ExactPricing() {
    return (
        <section className="bg-black pt-32 pb-40 px-6 font-sans">
            <div className="max-w-[1400px] mx-auto text-center">
                <h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight leading-[1.05] text-white max-w-4xl mx-auto mb-20 text-balance">
                    Trusted by over 30,000,000 users. From 191 countries. We've got a plan for everybody.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Free */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">$0</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition">Get Started</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 100 compute units/day</p>
                    </div>
                    {/* Basic */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$9</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 5,000 compute units/month</p>
                    </div>
                    {/* Pro */}
                    <div className="bg-[#111] border border-zinc-700 rounded-3xl p-8 text-left flex flex-col relative transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">MOST POPULAR</div>
                        <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$35</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 20,000 compute units/month</p>
                    </div>
                    {/* Max */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2">Max</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$105</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 60,000 compute units/month</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── KREA FOOTER EXACT CLONE ──────────────────────────────── */
function ExactFooter() {
  return (
    <footer className="bg-black text-white pt-20 pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Core Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div>
              <h4 className="font-semibold text-lg mb-6">NextFlow</h4>
              <ul className="flex flex-col gap-4 text-zinc-500 font-medium">
                  <li><Link href="/dashboard" className="hover:text-white transition">Log In</Link></li>
                  <li><Link href="/dashboard/pricing" className="hover:text-white transition">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Enterprise</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">Gallery</Link></li>
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-6">Products</h4>
              <ul className="flex flex-col gap-4 text-zinc-500 font-medium">
                  <li><Link href="/dashboard/image" className="hover:text-white transition">Image Generator</Link></li>
                  <li><Link href="/dashboard/video" className="hover:text-white transition">Video Generator</Link></li>
                  <li><Link href="/dashboard/enhancer" className="hover:text-white transition">Enhancer</Link></li>
                  <li><Link href="/dashboard/realtime" className="hover:text-white transition">Realtime</Link></li>
                  <li><Link href="/dashboard/edit" className="hover:text-white transition">Edit</Link></li>
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-6">Resources</h4>
              <ul className="flex flex-col gap-4 text-zinc-500 font-medium">
                  <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link href="/dashboard/workflows" className="hover:text-white transition">API</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">Documentation</Link></li>
              </ul>
          </div>
          <div>
              <h4 className="font-semibold text-lg mb-6">About</h4>
              <ul className="flex flex-col gap-4 text-zinc-500 font-medium">
                  <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Discord</Link></li>
              </ul>
          </div>
        </div>

        {/* Investors & Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-zinc-900 pt-8 gap-6">
            <div className="flex items-center gap-6">
                <span className="text-zinc-600 font-medium text-sm">© 2026 NextFlow</span>
                <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 cursor-pointer">X</div>
                     <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 cursor-pointer">In</div>
                     <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 cursor-pointer">Ig</div>
                </div>
            </div>

            <div className="flex items-center flex-wrap gap-4 text-zinc-600">
                <span className="text-sm font-semibold uppercase tracking-wider">Backed By</span>
                <span className="font-black">a16z</span>
                <span className="font-bold border-l border-zinc-800 pl-4">BCV</span>
                <span className="font-bold border-l border-zinc-800 pl-4">Gradient Ventures</span>
                <span className="font-bold border-l border-zinc-800 pl-4">Pebblebed</span>
                <span className="font-bold border-l border-zinc-800 pl-4">HF0</span>
                <span className="font-bold border-l border-zinc-800 pl-4">Abstract</span>
            </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN LANDING PAGE ────────────────────────────────────── */

export default function PixelPerfectLandingPage() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Navbar />
      <DarkHero />
      <BentoGrid />
      <FeatureSwitcher />
      <ExactPricing />
      <ExactFooter />
    </main>
  );
}
