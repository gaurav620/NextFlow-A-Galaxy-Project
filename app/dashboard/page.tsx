'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  ExternalLink,
  Sparkles,
  Video,
  ArrowRight,
  Eye,
  Zap,
  Diamond,
  Heart,
  ArrowUpRight,
  Image as ImageIcon,
  PenTool,
} from 'lucide-react';

/* ─── TYPES ─────────────────────────────────────────────────── */
interface Model {
  name: string;
  desc: string;
  image: string;
  tags: string[];
  speed: number;    // 1-3
  quality: number;  // 1-4
  credits: number;
}

/* ─── DATA ─────────────────────────────────────────────────── */

const quickActions = [
  { label: 'Generate Image',  href: '/dashboard/image',    image: '/card-portrait.png',  icon: '🖼️', accentColor: '#4B9FFF' },
  { label: 'Generate Video',  href: '/dashboard/video',    image: '/v-kling.png',         icon: '🎬', accentColor: '#FF8A4B' },
  { label: 'Upscale & Enhance', href: '/dashboard/enhancer', image: '/m-flux2.png',       icon: '✨', accentColor: '#A78BFA' },
  { label: 'Realtime',        href: '/dashboard/realtime', image: '/bento-eye.png',       icon: '⚡', accentColor: '#22D3EE' },
];

const imageModels: Model[] = [
  { name: 'Nano Banana Pro', desc: 'World\'s best prompt adherence. Best model for complex tasks and image editing.', image: '/m-nano1.png', tags: ['Featured'], speed: 2, quality: 4, credits: -100 },
  { name: 'Nano Banana 2',   desc: 'Google\'s latest flash image model optimized for fast generation with support for 4K output.', image: '/m-nano2.png', tags: ['Featured', 'New'], speed: 2, quality: 4, credits: -50 },
  { name: 'Flux 2',          desc: 'FLUX.2 [dev] from Black Forest Labs. Enhanced realism and crisper text generation.', image: '/m-flux2.png', tags: ['Free', 'New'], speed: 1, quality: 2, credits: 20 },
  { name: 'Z Image',         desc: 'Cheapest model. Medium-quality photorealism at a budget. Realistic textures, weak diversity.', image: '/m-zimage.png', tags: ['Free', 'New'], speed: 1, quality: 1, credits: 2 },
];

const videoModels: Model[] = [
  { name: 'Kling 2.6',  desc: 'Frontier model from Kling with native audio. Highest quality at a moderate price point.', image: '/v-kling.png',  tags: ['Featured'], speed: 2, quality: 4, credits: -300 },
  { name: 'LTX-2',      desc: 'Affordable medium-quality audio-video model from Lightricks with native sound generation.', image: '/v-ltx.png',   tags: ['New'],       speed: 2, quality: 3, credits: -200 },
  { name: 'Kling 3.0',  desc: 'Latest frontier model from Kling with native audio and extended durations up to 15 seconds.', image: '/v-kling3.png', tags: ['New'],    speed: 1, quality: 4, credits: -1000 },
  { name: 'Kling o3',   desc: 'Advanced reasoning video model with strong element and reference control.', image: '/v-kling3.png', tags: ['New'],    speed: 2, quality: 4, credits: -800 },
];

const nodeApps = [
  { name: 'CCTV Selfies',       desc: 'Put your face into a convincing CCTV-style collage.',  image: '/card-portrait.png', bg: 'from-zinc-800 to-zinc-900' },
  { name: 'Animorph yourself',  desc: 'Morph yourself into a raccoon, giraffe, or any animal.', image: '/card-capybara.png', bg: 'from-pink-900 to-pink-950' },
  { name: 'Digicam Snapshots',  desc: 'Show your best outfits on a 2000s digicam.',            image: '/card-truck.png',    bg: 'from-zinc-700 to-zinc-800' },
  { name: 'Truck Ad',           desc: 'Place your product on a virtual truck for 4K output.',  image: '/bento-warrior.png', bg: 'from-zinc-800 to-zinc-900' },
];

const releaseNotes = [
  { title: 'Annotations in NextFlow Edit', desc: 'Mark up multiple regions, write a separate prompt for each, and generate all changes in a single pass.', date: 'Mar 28, 2026', image: '/bento-speed.png' },
  { title: 'The Node Agent', desc: 'An AI agent that builds and runs creative workflows from a single sentence.', date: 'Mar 18, 2026', image: '/bento-eye.png' },
  { title: 'A New, More Powerful NextFlow Edit', desc: 'Change regions, render new perspectives, adjust lighting, apply color palettes, and more.', date: 'Mar 9, 2026', image: '/card-portrait.png' },
  { title: 'Turn Any Image Into a Prompt', desc: 'Drop any image into NextFlow and get a detailed, generation-ready prompt in seconds.', date: 'Mar 5, 2026', image: '/m-flux2.png' },
];

const instantActions = [
  { name: 'AI Hairstyle',     desc: 'Try new hairstyles with AI for free. Upload your photo to change haircuts instantly.', image: '/m-flux2.png' },
  { name: 'Colorize',         desc: 'Turn sketches, doodles, or lineart into colorful pictures.',                           image: '/m-nano1.png', bw: true },
  { name: 'Change Lighting',  desc: 'Dim the lights, change the time of day, or make it rain.',                            image: '/bento-warrior.png' },
  { name: 'Clothes Changer',  desc: 'Upload selfies and try on different outfits with our free AI virtual try-on tool.',   image: '/card-portrait.png' },
];

/* ─── HELPERS ────────────────────────────────────────────────── */

function ModelBadge({ tag }: { tag: string }) {
  const isFeatured = tag.toLowerCase() === 'featured';
  const isNew = tag.toLowerCase() === 'new';
  const isFree = tag.toLowerCase() === 'free';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
      isFeatured ? 'bg-purple-600/90 text-purple-100' :
      isNew      ? 'bg-zinc-700/90 text-zinc-200' :
      isFree     ? 'bg-zinc-700/90 text-zinc-200' :
                   'bg-zinc-700/90 text-zinc-200'
    }`}>
      {isFeatured && <Star className="w-2.5 h-2.5 fill-purple-300 text-purple-300" />}
      {tag}
    </span>
  );
}

function SpeedDots({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map(i => (
        <Zap key={i} className={`w-3 h-3 ${i <= count ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}`} />
      ))}
    </div>
  );
}

function QualityDots({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map(i => (
        <Diamond key={i} className={`w-2.5 h-2.5 ${i <= count ? 'text-blue-400 fill-blue-400' : 'text-zinc-700'}`} />
      ))}
    </div>
  );
}

/* ─── FRAMER VARIANTS ─────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

const hoverSpring = {
  scale: 1.02,
  y: -2,
  transition: { type: 'spring' as const, stiffness: 400, damping: 20 }
};

/* ─── MODEL CARD ──────────────────────────────────────────── */
function ModelCard({ model, hasGenBtn, toolHref }: { model: Model; hasGenBtn?: boolean; toolHref?: string }) {
  return (
    <motion.div whileHover={hoverSpring}>
      <Link href={toolHref || '/dashboard/image'} className="block bg-[#111] rounded-[16px] overflow-hidden border border-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer group flex-shrink-0 shadow-lg">
        {/* Thumbnail */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
          <img
            src={model.image}
            alt={model.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge row */}
          <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap">
            {model.tags.map(tag => <ModelBadge key={tag} tag={tag} />)}
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex flex-col gap-2">
          <p className="text-white font-semibold text-[13px] leading-tight">{model.name}</p>
          <p className="text-zinc-500 text-[11.5px] leading-relaxed line-clamp-2">{model.desc}</p>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-3">
              <SpeedDots count={model.speed} />
              <QualityDots count={model.quality} />
            </div>
            <span className={`text-[11px] font-semibold ${model.credits < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {model.credits > 0 ? `+${model.credits}` : model.credits} ⚡
            </span>
          </div>

          {hasGenBtn && (
            <button
              className="mt-1 w-full py-2 rounded-xl bg-white text-black text-[12px] font-bold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              onClick={e => e.preventDefault()}
            >
              <Video className="w-3.5 h-3.5" />
              Generate video
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── SECTION HEADER ──────────────────────────────────────── */
function SectionHeader({ title, hasSearch, onScrollLeft, onScrollRight }: {
  title: string;
  hasSearch?: boolean;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <h2 className="text-white font-semibold text-[18px] tracking-tight">{title}</h2>
        {hasSearch && (
          <button className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        )}
      </div>
      <div className="flex gap-1.5">
        <button onClick={onScrollLeft}  className="w-7 h-7 rounded-full bg-zinc-800/70 hover:bg-zinc-700 border border-white/[0.06] flex items-center justify-center transition-colors group">
          <ChevronLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>
        <button onClick={onScrollRight} className="w-7 h-7 rounded-full bg-zinc-800/70 hover:bg-zinc-700 border border-white/[0.06] flex items-center justify-center transition-colors group">
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}

/* ─── HERO BANNER ─────────────────────────────────────────── */
function DashboardHero() {
  return (
    <div className="flex flex-col gap-10">
       {/* Big Blue Banner */}
       <motion.div variants={itemVariants} className="w-full bg-[#8fbce1] rounded-[20px] h-[360px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-sm">
           <div className="absolute inset-0 bg-gradient-to-b from-[#9ac7e8] to-[#8fbce1] pointer-events-none" />
           <h1 className="text-white text-[clamp(44px,5vw,54px)] tracking-tight mb-8 relative z-10 drop-shadow-sm font-sans" style={{ fontWeight: 500 }}>
             Start by generating a free image
           </h1>
           <div className="flex items-center gap-4 relative z-10">
              <Link href="/dashboard/image" className="bg-white text-zinc-900 font-bold text-[14px] px-6 py-3 rounded-full hover:bg-zinc-50 transition-colors shadow-sm flex items-center gap-2 tracking-wide">
                 Generate Image <ArrowRight className="w-4 h-4 opacity-70" />
              </Link>
              <Link href="/dashboard/video" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-[14px] px-6 py-3 rounded-full transition-colors flex items-center gap-2 tracking-wide">
                 Generate Video <ArrowRight className="w-4 h-4 opacity-70" />
              </Link>
           </div>
       </motion.div>

       {/* Quick Actions 4-Card Nav */}
       <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-5">
           {quickActions.map((action, i) => (
              <Link key={action.label} href={action.href} className="group relative outline-none flex flex-col">
                 <div className="w-full rounded-[16px] overflow-hidden bg-[#111] relative shadow-lg" style={{ aspectRatio: '16/9' }}>
                    <img src={action.image} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 2 ? 'grayscale' : ''}`} alt={action.label} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                    {/* Centered Icon Box */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       {i === 0 && (
                          <div className="w-[42px] h-[42px] bg-white rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,161,255,0.4)] group-hover:scale-110 transition-transform duration-300">
                             <ImageIcon className="w-5 h-5 text-[#4B9FFF] fill-blue-50" />
                          </div>
                       )}
                       {i === 1 && (
                          <div className="w-[42px] h-[42px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,140,0,0.4)] group-hover:scale-110 transition-transform duration-300">
                             <Video className="w-5 h-5 text-white fill-current" />
                          </div>
                       )}
                       {i === 2 && (
                          <div className="w-[42px] h-[42px] bg-black/90 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300">
                             <Sparkles className="w-5 h-5 text-white/90" />
                          </div>
                       )}
                       {i === 3 && (
                          <div className="w-[42px] h-[42px] bg-[#00A1FF] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,161,255,0.4)] group-hover:scale-110 transition-transform duration-300">
                             <PenTool className="w-5 h-5 text-white" />
                          </div>
                       )}
                    </div>
                 </div>
                 <p className="text-zinc-100 font-medium text-[14.5px] tracking-tight mt-3 group-hover:text-white transition-colors">{action.label}</p>
              </Link>
           ))}
       </motion.div>
    </div>
  );
}

/* ─── PAGE ─────────────────────────────────────────────────── */
export default function DashboardHome() {
  const imgScrollRef  = useRef<HTMLDivElement>(null);
  const vidScrollRef  = useRef<HTMLDivElement>(null);
  const nodeScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  };

  return (
    <div
      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scroll-smooth"
      style={{ background: '#000000' }}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1280px] mx-auto px-6 py-8 space-y-16"
      >

        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <DashboardHero />

        {/* ── UPGRADE BANNER ──────────────────────────────────── */}
        <motion.div
           variants={itemVariants}
           whileHover={{ scale: 1.01, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } }}
          className="rounded-[24px] flex flex-col md:flex-row md:items-center justify-between px-6 md:px-10 py-7 relative overflow-hidden shadow-2xl gap-6 md:gap-0"
          style={{ background: 'linear-gradient(135deg, #16161a 0%, #0d0d0f 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="space-y-3">
            {['Upscale images & videos to 22K', 'Lora fine-tuning', 'Access all 150+ models', 'Ultra fast & no throttling'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                <p className="text-zinc-300 font-medium text-[14px] tracking-tight">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-white font-black text-[42px] leading-none tracking-tight">
                Try <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Pro</span>
              </p>
            </div>
            <div className="relative w-24 h-20 flex-shrink-0">
              <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-0 right-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/30" />
              <motion.div animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-4 right-8 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-blue-500/30" />
              <div className="absolute top-7 right-2 w-10 h-10 rounded-xl bg-[#111] border border-white/10 shadow-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <Link
              href="/dashboard/pricing"
              className="px-6 py-3 bg-white text-black text-[14px] font-bold rounded-full hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-xl flex-shrink-0"
            >
              Upgrade →
            </Link>
          </div>
        </motion.div>

        {/* ── EXPLORE IMAGE MODELS ─────────────────────────────── */}
        <motion.section variants={itemVariants} id="explore-image-models">
          <SectionHeader
            title="Explore image models"
            hasSearch
            onScrollLeft={() => scroll(imgScrollRef, 'left')}
            onScrollRight={() => scroll(imgScrollRef, 'right')}
          />
          <div ref={imgScrollRef} className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth pb-4 px-1 -mx-1">
            {imageModels.map(model => (
              <div key={model.name} className="flex-shrink-0 w-[270px]">
                <ModelCard model={model} toolHref="/dashboard/image" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── TRY VIDEO MODELS ─────────────────────────────────── */}
        <motion.section variants={itemVariants} id="try-video-models">
          <SectionHeader
            title="Try video models"
            hasSearch
            onScrollLeft={() => scroll(vidScrollRef, 'left')}
            onScrollRight={() => scroll(vidScrollRef, 'right')}
          />
          <div ref={vidScrollRef} className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth pb-4 px-1 -mx-1">
            {videoModels.map((model, i) => (
              <div key={model.name} className="flex-shrink-0 w-[270px]">
                <ModelCard model={model} hasGenBtn={i === 0} toolHref="/dashboard/video" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── PLAY WITH NODE APPS ──────────────────────────────── */}
        <motion.section variants={itemVariants} id="node-apps">
          <SectionHeader
            title="Play with node apps"
            onScrollLeft={() => scroll(nodeScrollRef, 'left')}
            onScrollRight={() => scroll(nodeScrollRef, 'right')}
          />
          <div ref={nodeScrollRef} className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth pb-4 px-1 -mx-1">
            {nodeApps.map((app) => (
              <motion.div whileHover={hoverSpring} key={app.name} className="flex-shrink-0">
                <Link
                  href="/dashboard/workflows"
                  className="group relative w-[210px] rounded-[20px] overflow-hidden cursor-pointer block border border-white/[0.04] shadow-xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img src={app.image} alt={app.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                    <p className="text-white text-[15px] font-bold leading-tight drop-shadow-md">{app.name}</p>
                    <p className="text-zinc-300 text-[12px] font-medium leading-relaxed drop-shadow line-clamp-2">{app.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── RELEASE NOTES ────────────────────────────────────── */}
        <motion.section variants={itemVariants} id="release-notes">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-[18px] tracking-tight">Release notes</h2>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-[12px] font-medium transition-colors border border-white/[0.06]">
              View all <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {releaseNotes.map((note) => (
              <motion.div
                whileHover={{ scale: 1.01, y: -2, backgroundColor: 'rgba(255,255,255,0.03)' }}
                key={note.title}
                className="flex gap-5 p-5 rounded-[20px] bg-[#111] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer shadow-lg"
              >
                <div className="w-[120px] h-[80px] rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  <img src={note.image} alt={note.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <p className="text-zinc-100 text-[14px] font-bold leading-tight mb-1.5 line-clamp-2">{note.title}</p>
                    <p className="text-zinc-400 text-[12px] leading-relaxed line-clamp-2">{note.desc}</p>
                  </div>
                  <p className="text-zinc-500 font-medium text-[11px] mt-2">{note.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── INSTANT ACTIONS ─────────────────────────────────── */}
        <motion.section variants={itemVariants} id="instant-actions">
          <SectionHeader title="Instant results with NextFlow actions" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {instantActions.map((action) => (
              <motion.div whileHover={hoverSpring} key={action.name}>
                <Link
                  href="/dashboard/edit"
                  className="group relative rounded-[20px] overflow-hidden cursor-pointer block border border-white/[0.04] shadow-xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={action.image}
                    alt={action.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${action.bw ? 'grayscale' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-all opacity-80 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                    <p className="text-white text-[15px] font-bold leading-tight drop-shadow-md">{action.name}</p>
                    <p className="text-zinc-300 text-[12px] font-medium leading-relaxed drop-shadow line-clamp-3">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <motion.footer variants={itemVariants} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} className="pt-12 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-5 opacity-90">NextFlow</p>
              <ul className="space-y-3.5 flex flex-col">
                <li><Link href="/dashboard" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Log In</Link></li>
                <li><Link href="/dashboard/pricing" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard/pricing" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Plans</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Enterprise</Link></li>
                <li><Link href="/dashboard" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-5 opacity-90">Products</p>
              <ul className="space-y-3.5 flex flex-col">
                <li><Link href="/dashboard/image" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Image</Link></li>
                <li><Link href="/dashboard/video" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Video</Link></li>
                <li><Link href="/dashboard/enhancer" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Enhancer</Link></li>
                <li><Link href="/dashboard/realtime" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Realtime</Link></li>
                <li><Link href="/dashboard/edit" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Edit</Link></li>
                <li><Link href="/dashboard/train" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Train LoRA</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-5 opacity-90">Resources</p>
              <ul className="space-y-3.5 flex flex-col">
                <li><Link href="/dashboard/pricing" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/dashboard/workflows" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">API</Link></li>
                <li><Link href="/dashboard" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-5 opacity-90">About</p>
              <ul className="space-y-3.5 flex flex-col">
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Discord</Link></li>
                <li><Link href="#" className="text-zinc-400 hover:text-white font-medium text-[13px] transition-colors">Articles</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.04] pt-6">
            <p className="text-zinc-500 font-medium text-[12px]">© 2026 NextFlow AI • Made with ❤️</p>
            <div className="flex items-center gap-5">
              {['✉', '𝕏', 'in', '▶'].map(icon => (
                <button key={icon} className="text-zinc-400 hover:text-white transition-colors text-[16px]">{icon}</button>
              ))}
            </div>
          </div>
        </motion.footer>

      </motion.div>
    </div>
  );
}
