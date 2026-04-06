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
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
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

  const isLight = theme === 'light';
  const headerBgClass = scrolled 
    ? (isLight ? 'bg-white/90 border-zinc-200 backdrop-blur-xl' : 'bg-black/90 backdrop-blur-xl border-white/5') 
    : 'bg-transparent border-transparent';
  
  const textColor = isLight ? (scrolled ? 'text-black' : 'text-black') : 'text-white';
  const navItemColor = isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-300 hover:text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b ${headerBgClass}`}>
      <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isLight ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <span className="font-extrabold text-sm font-sans tracking-tighter">N</span>
          </div>
          <span className={`font-semibold text-lg tracking-tight hidden sm:block ${textColor}`}>NextFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/dashboard" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>App</Link>
          
          <div 
            className="relative h-[72px] flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              onClick={() => setFeaturesOpen(!featuresOpen)}
              className={`text-[13px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${featuresOpen ? (isLight ? 'bg-black/[0.05] text-black' : 'bg-white/[0.08] text-white') : `bg-transparent ${textColor} hover:bg-black/5 hover:text-black`}`}>
              Features <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {featuresOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-[72px] left-1/2 -translate-x-[45%] w-[1000px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-black/5 p-8 flex gap-10 z-[100] text-left"
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
                                            <Link href="/features/ai-image-generator" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
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
                                            <Link href="/features/ai-video-generator" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
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
                                            <Link href="/features/ai-upscaler" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
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
                                            <Link href="/features/ai-upscaler" className="group flex items-center text-[13px] font-medium text-zinc-500 hover:text-black transition-colors">
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
                                                NextFlow Asset Manager <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1 text-zinc-400"/>
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

          <Link href="/features/ai-image-generator" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>Image Generator</Link>
          <Link href="/features/ai-video-generator" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>Video Generator</Link>
          <Link href="/features/ai-upscaler" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>Upscaler</Link>
          <Link href="/features/api" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>API</Link>
          <Link href="/pricing" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>Pricing</Link>
          <Link href="/dashboard" className={`text-[13px] font-medium transition-colors ${navItemColor}`}>Enterprise</Link>
        </nav>

        {/* CTA Buttons & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/pricing"
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-bold rounded-full transition-colors whitespace-nowrap ${isLight ? 'text-black bg-zinc-100 hover:bg-zinc-200' : 'text-black bg-white hover:bg-zinc-200'}`}
            >
              Sign up <span className="hidden min-[380px]:inline">for free</span>
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-bold rounded-full transition-colors whitespace-nowrap border ${isLight ? 'text-black border-zinc-200 hover:bg-zinc-50' : 'text-white border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}
            >
              Log in
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden ${textColor} ml-1`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
