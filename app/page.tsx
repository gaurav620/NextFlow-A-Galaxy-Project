'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Workflow,
  Zap,
  Layers,
  Grid3x3,
  Sparkles,
  Shield,
  Video,
  Mic,
  Brush,
  Box,
  Menu,
  X,
} from 'lucide-react';

/* ─── NAV ──────────────────────────────────────────────────── */
const navLinks = [
  { label: 'App', href: '/dashboard' },
  { label: 'Features', href: '#features', hasDropdown: true },
  { label: 'Image Generator', href: '#image' },
  { label: 'Video Generator', href: '#video' },
  { label: 'Upscaler', href: '#upscaler' },
  { label: 'API', href: '#api' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Enterprise', href: '#enterprise' },
];

/* ─── SHOWCASE CARDS ─────────────────────────────────────────  */
const showcaseCards = [
  {
    tool: 'NextFlow 1',
    toolIcon: '⬡',
    isPrompt: true,
    prompt: 'Cinematic photo of a person in a linen jacket',
    image: '/card-portrait.png',
    bg: '#0a0a0a',
  },
  {
    tool: 'Veo 3',
    toolIcon: '◉',
    isPrompt: true,
    prompt: 'An animated capybara talking about NextFlow',
    image: '/card-capybara.png',
    bg: '#0a0a0a',
  },
  {
    tool: 'Topaz Upscaler',
    toolIcon: '↗',
    isPrompt: false,
    prompt: 'Upscale image\n512px → 8K',
    image: '/card-upscale.png',
    bg: '#0a0a0a',
  },
  {
    tool: 'Hailuo',
    toolIcon: '◎',
    isPrompt: true,
    prompt: 'Advertisement shot of a sandwich vertically exploding into different layers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    bg: '#0a0a0a',
  },
  {
    tool: 'NextFlow 1',
    toolIcon: '⬡',
    isPrompt: true,
    prompt: 'Dramatic photo of an old offroad truck racing through the desert',
    image: '/card-truck.png',
    bg: '#0a0a0a',
  },
];

/* ─── MODEL LOGOS ────────────────────────────────────────────  */
const models = ['Luma', 'Flux', 'Gemini', 'NextFlow 1', 'Veo 3.1', 'Ideogram', 'Runway'];

/* ─── BENTO CELLS ────────────────────────────────────────────  */
const bentoFeatures = [
  {
    id: 'speed',
    title: 'Industry-leading inference speed',
    image: '/bento-speed.png',
    dark: true,
    size: 'tall',
  },
  {
    id: '22k',
    title: '22K',
    subtitle: 'Pixels upscaling',
    dark: false,
    size: 'stat',
  },
  {
    id: 'train',
    title: 'Train',
    subtitle: 'Fine-tune models with your own data',
    dark: false,
    size: 'stat',
  },
  {
    id: '4k',
    title: '4K',
    subtitle: 'Native image generation',
    image: '/bento-eye.png',
    dark: true,
    size: 'medium',
  },
  {
    id: 'krea1',
    title: 'NextFlow 1',
    subtitle: 'Ultra-realistic flagship model',
    image: '/bento-warrior.png',
    dark: true,
    size: 'hero',
  },
  {
    id: 'notrain',
    title: 'Do not train',
    subtitle: 'Safely generate proprietary data',
    dark: false,
    size: 'stat',
  },
  {
    id: '64',
    title: '64+',
    subtitle: 'Models',
    dark: false,
    size: 'stat',
  },
];

const miniFeatures = [
  { icon: Layers, label: 'Full-fledged asset manager', dark: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400' },
  { icon: Zap, label: 'Bleeding Edge', dark: false, sub: 'Access the latest models directly on release day', clock: true },
  { icon: Sparkles, label: '1000+ styles', dark: false, hasPhone: true, color: true },
  { icon: Brush, label: 'Image Editor', dark: true },
  { icon: Mic, label: 'Lipsync', dark: true, waveform: true },
  { icon: Grid3x3, label: 'Realtime Canvas', dark: true },
  { icon: Box, label: 'Text to 3D', dark: false },
];

/* ─── NAVBAR ─────────────────────────────────────────────────  */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Workflow className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">NextFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-[13px] text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-0.5"
            >
              {link.label}
              {link.hasDropdown && <ChevronRight className="w-3 h-3 rotate-90 opacity-50" />}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sign-up"
            className="px-4 py-1.5 text-[13px] font-medium text-white border border-white/20 hover:border-white/40 rounded-full transition-colors"
          >
            Sign up for free
          </Link>
          <Link
            href="/sign-in"
            className="px-4 py-1.5 text-[13px] font-medium text-black bg-white hover:bg-zinc-100 rounded-full transition-colors"
          >
            Log in
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[14px] text-zinc-400 hover:text-white py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/10 mt-2">
            <Link href="/sign-up" className="flex-1 text-center py-2 text-[13px] text-white border border-white/20 rounded-full">Sign up</Link>
            <Link href="/sign-in" className="flex-1 text-center py-2 text-[13px] text-black bg-white rounded-full font-medium">Log in</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ───────────────────────────────────────────────────  */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden pt-14">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Strong dark overlay so text pops */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col items-center">
        <h1 className="text-[clamp(38px,6vw,72px)] font-bold leading-[1.08] tracking-tight text-white text-balance mb-5">
          NextFlow is the world&apos;s most powerful creative AI suite.
        </h1>
        <p className="text-[clamp(14px,1.6vw,17px)] text-white/60 mb-10 max-w-md leading-relaxed">
          Generate, enhance, and edit images, videos, or 3D meshes for free with AI.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-up"
            className="px-7 py-3 bg-white text-black font-semibold text-[14px] rounded-full hover:bg-zinc-100 transition-all duration-200 shadow-lg"
          >
            Start for free
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-[14px] rounded-full hover:bg-white/20 transition-all duration-200"
          >
            Launch App
          </Link>
        </div>
      </div>

      {/* Product screenshot mockup */}
      <div className="relative z-10 mt-16 px-6 w-full max-w-2xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
          style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)' }}
        >
          {/* Fake browser chrome */}
          <div className="h-8 bg-[#111] border-b border-white/5 flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <div className="ml-3 flex-1 h-4 bg-white/5 rounded-full" />
          </div>
          {/* App screenshot body */}
          <div className="aspect-[16/8] bg-[#09090b] relative flex items-center justify-center">
            <div className="absolute inset-0 flex">
              {/* Fake sidebar */}
              <div className="w-[140px] bg-[#000] border-r border-white/5 flex flex-col p-3 gap-2">
                {[72, 58, 85, 64, 78, 55].map((w, i) => (
                  <div key={i} className={`h-3 rounded ${i === 0 ? 'w-16 bg-white/20' : 'bg-white/5'}`} style={{ width: `${w}%` }} />
                ))}
              </div>
              {/* Fake canvas area */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-28 rounded-xl bg-gradient-to-br from-orange-400/30 to-pink-500/30 border border-white/10 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white/50 text-sm font-medium">Let&apos;s create something</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-16 h-10 rounded-lg bg-white/5 border border-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SHOWCASE CAROUSEL ──────────────────────────────────────  */
function ShowcaseCarousel() {
  const [current, setCurrent] = useState(0);
  const total = showcaseCards.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Compute visible card indices (show 4 at a time, wrapping)
  const visibleIndices = Array.from({ length: 4 }, (_, i) => (current + i) % total);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cards */}
        <div className="flex gap-4 mb-8">
          {visibleIndices.map((cardIdx, displayIdx) => {
            const card = showcaseCards[cardIdx];
            return (
              <div
                key={`${cardIdx}-${displayIdx}`}
                className="flex-1 min-w-0 rounded-2xl overflow-hidden relative aspect-[3/4] cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
                style={{ background: card.bg }}
              >
                {/* Image */}
                <img
                  src={card.image}
                  alt={card.prompt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Tool badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
                  <span className="text-[11px] text-white/70">{card.toolIcon}</span>
                  <span className="text-[12px] font-semibold text-white">{card.tool}</span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {card.isPrompt && (
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
                      Prompt
                    </div>
                  )}
                  <p className={`text-white font-semibold leading-snug ${card.isPrompt ? 'text-[14px]' : 'text-[18px]'}`}>
                    {card.isPrompt ? `"${card.prompt}"` : card.prompt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-zinc-300 hover:border-zinc-400 flex items-center justify-center transition-colors hover:bg-zinc-50"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-zinc-300 hover:border-zinc-400 flex items-center justify-center transition-colors hover:bg-zinc-50"
          >
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── MODELS SECTION ─────────────────────────────────────────  */
function ModelsSection() {
  return (
    <section className="bg-white pt-4 pb-16 border-t border-zinc-100" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-[clamp(32px,4.5vw,60px)] font-bold leading-[1.08] tracking-tight text-black mb-6 max-w-3xl">
          The industry&apos;s best Image models.
          <br />
          In one subscription.
        </h2>

        {/* Model logos row */}
        <div className="flex flex-wrap items-center gap-6 mb-16">
          {models.map((m) => (
            <div key={m} className="flex items-center gap-1.5 text-[14px] text-zinc-500 font-medium">
              <div className="w-4 h-4 rounded-full bg-zinc-200 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-500" />
              </div>
              {m}
            </div>
          ))}
        </div>

        {/* Bento Grid Row 1 */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Speed — col-span 5, tall */}
          <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative h-[220px]">
            <img src="/bento-speed.png" alt="Speed" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-bold text-[20px] leading-tight">Industry-leading<br />inference speed</p>
            </div>
          </div>

          {/* 22K stat */}
          <div className="col-span-6 md:col-span-4 rounded-2xl bg-zinc-50 border border-zinc-100 p-6 flex flex-col justify-end h-[220px]">
            <p className="text-black font-black text-[56px] leading-none tracking-tight">22K</p>
            <p className="text-zinc-500 text-[14px] font-medium mt-1">Pixels upscaling</p>
          </div>

          {/* Train stat */}
          <div className="col-span-6 md:col-span-3 rounded-2xl bg-zinc-50 border border-zinc-100 p-6 flex flex-col justify-center h-[220px]">
            <p className="text-black font-black text-[48px] leading-none tracking-tight">Train</p>
            <p className="text-zinc-500 text-[14px] font-medium mt-2">Fine-tune models with your own data</p>
          </div>
        </div>

        {/* Bento Grid Row 2 */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* 4K eye */}
          <div className="col-span-6 md:col-span-3 rounded-2xl overflow-hidden relative h-[220px]">
            <img src="/bento-eye.png" alt="4K" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-black text-[36px] leading-none">4K</p>
              <p className="text-white/60 text-[12px] mt-0.5">Native image generation</p>
            </div>
          </div>

          {/* Minimalist UI */}
          <div className="col-span-6 md:col-span-2 rounded-2xl bg-black flex items-end p-4 h-[220px]">
            <p className="text-white font-bold text-[16px]">Minimalist UI</p>
          </div>

          {/* Warrior hero */}
          <div className="col-span-12 md:col-span-4 rounded-2xl overflow-hidden relative h-[220px]">
            <img src="/bento-warrior.png" alt="NextFlow 1" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white font-black text-[28px] leading-none">NextFlow 1</p>
              <p className="text-white/50 text-[12px] mt-1">Ultra-realistic flagship model</p>
            </div>
          </div>

          {/* Do not train */}
          <div className="col-span-6 md:col-span-2 rounded-2xl bg-zinc-50 border border-zinc-100 p-4 flex flex-col justify-center h-[220px]">
            <p className="text-black font-bold text-[18px] leading-tight">Do not train</p>
            <p className="text-zinc-500 text-[12px] mt-2">Safely generate proprietary data</p>
          </div>

          {/* 64+ Models */}
          <div className="col-span-6 md:col-span-1 rounded-2xl bg-zinc-50 border border-zinc-100 p-4 flex flex-col justify-end h-[220px]">
            <p className="text-black font-black text-[36px] leading-none">64+</p>
            <p className="text-zinc-500 text-[12px] mt-1">Models</p>
          </div>
        </div>

        {/* Mini features row */}
        <div className="grid grid-cols-7 gap-3">
          <div className="col-span-2 rounded-2xl bg-black overflow-hidden relative h-[140px]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format"
              alt="Assets"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute bottom-3 left-3">
              <p className="text-white font-semibold text-[13px]">Full-fledged asset manager</p>
            </div>
          </div>
          <div className="col-span-1 rounded-2xl bg-zinc-50 border border-zinc-100 p-3 flex flex-col h-[140px]">
            <p className="text-black font-bold text-[14px]">Bleeding Edge</p>
            <p className="text-zinc-500 text-[10px] mt-1 leading-tight">Access the latest models directly on release day</p>
            <div className="mt-auto text-[32px]">🕐</div>
          </div>
          <div className="col-span-1 rounded-2xl overflow-hidden relative h-[140px] bg-gradient-to-br from-orange-400 to-pink-500">
            <div className="absolute bottom-3 left-3">
              <p className="text-white font-bold text-[14px]">1000+<br/>styles</p>
            </div>
          </div>
          <div className="col-span-1 rounded-2xl bg-black flex items-end p-3 h-[140px]">
            <p className="text-white font-semibold text-[13px]">Image Editor</p>
          </div>
          <div className="col-span-1 rounded-2xl bg-black flex flex-col items-center justify-center h-[140px] gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-full"
                style={{ width: 3, height: 8 + i * 6, opacity: 0.6 + i * 0.08 }}
              />
            ))}
            <p className="text-white/60 text-[11px] mt-2">Lipsync</p>
          </div>
          <div className="col-span-1 rounded-2xl bg-black flex items-end p-3 h-[140px]">
            <p className="text-white font-semibold text-[13px]">Realtime Canvas</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA SECTION ────────────────────────────────────────────  */
function CTASection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[1.08] tracking-tight text-white mb-5">
          Start creating with AI today.
        </h2>
        <p className="text-white/50 text-[16px] mb-10 max-w-md mx-auto">
          Join millions of creators using NextFlow to build, generate, and explore with AI.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-[15px] rounded-full hover:bg-zinc-100 transition-all shadow-lg"
        >
          Get started for free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────  */
function Footer() {
  const cols = [
    { title: 'Product', links: ['App', 'Image Generator', 'Video Generator', 'Upscaler', 'API'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Do not train'] },
  ];

  return (
    <footer className="bg-black border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-[15px]">NextFlow</span>
            </div>
            <p className="text-zinc-600 text-[13px] leading-relaxed max-w-[200px]">
              The world&apos;s most powerful creative AI suite.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-[12px] uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-600 hover:text-zinc-300 transition-colors text-[13px]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-700 text-[12px]">© 2025 NextFlow. All rights reserved.</p>
          <p className="text-zinc-700 text-[12px]">Made with ❤️ for creative professionals</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────  */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <Hero />
      <ShowcaseCarousel />
      <ModelsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
