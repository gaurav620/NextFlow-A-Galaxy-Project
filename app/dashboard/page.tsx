'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Zap,
  ExternalLink,
  Sparkles,
  Video,
  ArrowUpRight,
  Eye,
} from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────── */

const quickActions = [
  {
    label: 'Generate Image',
    href: '/dashboard/image',
    image: '/card-portrait.png',
    icon: '🖼️',
  },
  {
    label: 'Generate Video',
    href: '/dashboard/video',
    image: '/v-kling.png',
    icon: '🎬',
  },
  {
    label: 'Upscale & Enhance',
    href: '/dashboard/enhancer',
    image: '/m-flux2.png',
    icon: '✨',
  },
  {
    label: 'Realtime',
    href: '/dashboard/realtime',
    image: '/bento-eye.png',
    icon: '⚡',
  },
];

const imageModels = [
  {
    name: 'Nano Banana Pro',
    desc: 'Smartest model. World\'s best prompt adherence. Best model for complex tasks and image editing.',
    image: '/m-nano1.png',
    tags: ['Featured'],
    speed: '⚡⚡',
    quality: '♥♥♥♥',
    credits: -100,
    badge: 'featured',
  },
  {
    name: 'Nano Banana 2',
    desc: 'Google\'s latest flash image model (also known as Gemini 3.1 Flash Image) optimized for fast generation with support for up to 4K...',
    image: '/m-nano2.png',
    tags: ['Featured', 'New'],
    speed: '⚡⚡',
    quality: '♥♥♥♥',
    credits: -50,
    badge: 'featured',
  },
  {
    name: 'Flux 2',
    desc: 'FLUX.2 [dev] from Black Forest Labs. Enhanced realism and crisper text generation.',
    image: '/m-flux2.png',
    tags: ['Free', 'New'],
    speed: '⚡',
    quality: '♥♥',
    credits: 20,
    badge: 'free',
  },
  {
    name: 'Z Image',
    desc: 'Cheapest model. Medium-quality photorealism at a budget. Realistic textures, weak diversity.',
    image: '/m-zimage.png',
    tags: ['Free', 'New'],
    speed: '⚡',
    quality: '♥',
    credits: 2,
    badge: 'free',
  },
];

const videoModels = [
  {
    name: 'Kling 2.6',
    desc: 'Frontier model from Kling with native audio. Highest quality at a moderate price point.',
    image: '/v-kling.png',
    tags: ['Featured'],
    credits: -300,
    badge: 'featured',
    hasGenBtn: true,
  },
  {
    name: 'LTX-2',
    desc: 'Affordable medium-quality audio-video model from Lightricks with native sound generation.',
    image: '/v-ltx.png',
    tags: ['New'],
    credits: -200,
    badge: 'new',
  },
  {
    name: 'Kling 3.0',
    desc: 'Latest frontier model from Kling with native audio and extended durations up to 15 seconds.',
    image: '/v-kling3.png',
    tags: ['New'],
    credits: -1000,
    badge: 'new',
  },
  {
    name: 'Kling o3',
    desc: 'Advanced reasoning video model with strong video element, and video reference...',
    image: '/v-kling3.png',
    tags: ['New'],
    credits: -1000,
    badge: 'new',
  },
];

const nodeApps = [
  {
    name: 'CCTV Selfies',
    desc: 'Put your face and outfit into a convincing collage of CCTV st...',
    image: '/card-portrait.png',
    bg: 'from-zinc-800 to-zinc-900',
  },
  {
    name: 'Animorph yourself',
    desc: 'How would you look like morphing into a raccoon, giraffe, m...',
    image: '/card-capybara.png',
    bg: 'from-pink-900 to-pink-950',
  },
  {
    name: 'Digicam Snapshots',
    desc: 'Show your best outfits on a 2000s digicam. Proof you were ...',
    image: '/card-truck.png',
    bg: 'from-zinc-700 to-zinc-800',
  },
  {
    name: 'Truck Ad',
    desc: 'Place your product on a virtual truck. Get a video and a 4K...',
    image: '/bento-warrior.png',
    bg: 'from-zinc-800 to-zinc-900',
  },
];

const releaseNotes = [
  {
    title: 'Annotations in NextFlow Edit',
    desc: 'Mark up multiple regions, write a separate prompt for each one, and generate all the changes in a single pass.',
    date: 'Mar 28, 2026',
    image: '/bento-speed.png',
  },
  {
    title: 'The Node Agent',
    desc: 'An AI agent that builds and runs creative workflows from a single sentence.',
    date: 'Mar 18, 2026',
    image: '/bento-eye.png',
  },
  {
    title: 'A New, More Powerful NextFlow Edit',
    desc: 'Change specific regions, render new perspectives, adjust lighting, apply color palettes, and more. A rebuilt editing tool with fine-grained AI control.',
    date: 'Mar 9, 2026',
    image: '/card-portrait.png',
  },
  {
    title: 'Turn Any Image Into a Prompt',
    desc: 'Drop any image into NextFlow and get a detailed, generation-ready prompt in seconds. AI vision analyzes style, lighting, composition, and more.',
    date: 'Mar 5, 2026',
    image: '/m-flux2.png',
  },
];

const instantActions = [
  {
    name: 'AI Hairstyle',
    desc: 'Try new hairstyles with AI for free. Upload your photo to change haircuts, colors, and hair styles instantly using our AI...',
    image: '/m-flux2.png',
  },
  {
    name: 'Colorize',
    desc: 'Turn sketches, doodles, or lineart colorful pictures.',
    image: '/m-nano1.png',
    bw: true,
  },
  {
    name: 'Change Lighting',
    desc: 'Dim the lights, change the time of day, or make it rain.',
    image: '/bento-warrior.png',
  },
  {
    name: 'Clothes Changer',
    desc: 'Upload selfies and try on different outfits with our free AI virtual try-on tool. See how any clothing looks on you instantly.',
    image: '/card-portrait.png',
  },
];

/* ─── BADGE COMPONENT ─────────────────────────────────────── */
function Badge({ type, label }: { type: string; label: string }) {
  const styles: Record<string, string> = {
    featured: 'bg-purple-600/80 text-purple-100',
    new: 'bg-zinc-700/90 text-zinc-200',
    free: 'bg-zinc-700/90 text-zinc-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${styles[type] || styles.new}`}>
      {type === 'featured' && <Star className="w-2.5 h-2.5 fill-purple-300 text-purple-300" />}
      {label}
    </span>
  );
}

/* ─── SECTION HEADER ──────────────────────────────────────── */
function SectionHeader({
  title,
  hasSearch,
  hasNav,
}: {
  title: string;
  hasSearch?: boolean;
  hasNav?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <h2 className="text-white font-semibold text-[17px]">{title}</h2>
        {hasSearch && (
          <button className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        )}
      </div>
      {hasNav && (
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          <button className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── MODEL CARD ──────────────────────────────────────────── */
function ModelCard({
  model,
  hasGenBtn,
}: {
  model: (typeof imageModels)[0] & { hasGenBtn?: boolean };
  hasGenBtn?: boolean;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer group flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0">
        <img
          src={model.image}
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {model.tags.map((tag) => (
            <Badge key={tag} type={tag.toLowerCase()} label={tag} />
          ))}
        </div>
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-white font-semibold text-[13px] leading-tight">{model.name}</p>
        <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2">{model.desc}</p>
        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-[10px]">{model.speed}</span>
            <span className="text-zinc-500 text-[10px]">{model.quality}</span>
          </div>
          <span className={`text-[11px] font-medium ${model.credits < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {model.credits > 0 ? `${model.credits}` : `${model.credits}`} ⚡
          </span>
        </div>
        {hasGenBtn && (
          <button className="mt-2 w-full py-2 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            Generate video
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── PAGE ─────────────────────────────────────────────────── */
export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <div className="flex-1 overflow-y-auto bg-[#111] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
      <div className="max-w-[900px] mx-auto px-6 py-6 space-y-10">

        {/* ── HERO BANNER ──────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)',
            height: 180,
          }}
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(ellipse at 50% 120%, rgba(120,120,140,0.18) 0%, transparent 70%)',
          }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <p className="text-white/90 text-[22px] font-light tracking-wide">
              Start by generating a free image
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/image"
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-[13px] font-semibold rounded-full hover:bg-zinc-100 transition-colors"
              >
                Generate Image
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/video"
                className="flex items-center gap-1.5 px-4 py-2 bg-transparent text-white text-[13px] font-medium rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              >
                Generate Video
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="absolute top-3 right-4 flex gap-1">
            <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS ───────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group block"
            >
              <img
                src={action.image}
                alt={action.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Tool icon badge */}
              <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-sm border border-white/10">
                {action.icon}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-[12px] font-medium">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── UPGRADE BANNER ──────────────────────────────────── */}
        <div
          className="rounded-2xl flex items-center justify-between px-8 py-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)', border: '1px solid #2a2a2a' }}
        >
          <div className="space-y-1.5 flex-1">
            {[
              'Upscale images & videos to 22K',
              'Lora fine-tuning',
              'Access all 150+ models',
              'Ultra fast & no throttling',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-500" />
                <p className="text-zinc-400 text-[13px]">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-white font-black text-[36px] leading-none tracking-tight">
                Try <span className="text-purple-400">Pro</span>
              </p>
            </div>
            {/* Icon cluster */}
            <div className="relative w-20 h-16 flex-shrink-0">
              <div className="absolute top-0 right-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg" />
              <div className="absolute top-4 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg" />
              <div className="absolute top-6 right-1 w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-700 shadow-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
          </div>
        </div>

        {/* ── EXPLORE IMAGE MODELS ─────────────────────────────── */}
        <section id="explore-image-models">
          <SectionHeader title="Explore image models" hasSearch hasNav />
          <div className="grid grid-cols-4 gap-3">
            {imageModels.map((model) => (
              <ModelCard key={model.name} model={model as any} />
            ))}
          </div>
        </section>

        {/* ── TRY VIDEO MODELS ─────────────────────────────────── */}
        <section id="try-video-models">
          <SectionHeader title="Try video models" hasSearch hasNav />
          <div className="grid grid-cols-4 gap-3">
            {videoModels.map((model, i) => (
              <ModelCard key={model.name} model={model as any} hasGenBtn={i === 0} />
            ))}
          </div>
        </section>

        {/* ── PLAY WITH NODE APPS ──────────────────────────────── */}
        <section id="node-apps">
          <SectionHeader title="Play with node apps" hasNav />
          <div className="grid grid-cols-4 gap-3">
            {nodeApps.map((app) => (
              <Link
                key={app.name}
                href="/dashboard/nodes"
                className="relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group block"
              >
                <img
                  src={app.image}
                  alt={app.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                  <p className="text-white text-[13px] font-semibold leading-tight">{app.name}</p>
                  <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2">{app.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── RELEASE NOTES ────────────────────────────────────── */}
        <section id="release-notes">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-[17px]">Release notes</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[12px] font-medium transition-colors">
              View all
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {releaseNotes.map((note) => (
              <div
                key={note.title}
                className="flex gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="w-[120px] h-[80px] rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Text */}
                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <p className="text-white text-[13px] font-semibold leading-tight mb-1.5 line-clamp-2">{note.title}</p>
                    <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-3">{note.desc}</p>
                  </div>
                  <p className="text-zinc-600 text-[10px] mt-2">{note.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INSTANT RESULTS / ACTIONS ────────────────────────── */}
        <section id="instant-actions">
          <SectionHeader title="Instant results with NextFlow actions" hasNav />
          <div className="grid grid-cols-4 gap-3">
            {instantActions.map((action) => (
              <Link
                key={action.name}
                href="/dashboard/nodes"
                className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer group block"
              >
                <img
                  src={action.image}
                  alt={action.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${action.bw ? 'grayscale' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
                  <p className="text-white text-[14px] font-bold leading-tight">{action.name}</p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="border-t border-zinc-800 pt-10 pb-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {[
              {
                heading: 'NextFlow',
                links: ['Log In', 'Pricing', 'Plans', 'NextFlow Terms', 'NextFlow Enterprise', 'Gallery', 'NextFlow for Architecture'],
              },
              {
                heading: 'Products',
                links: ['Image', 'Video', 'Enhancer', 'Realtime', 'Edit', 'Chat', 'Stage', 'Animator', 'Train'],
              },
              {
                heading: 'Resources',
                links: ['Pricing', 'Careers', 'Terms of Service', 'Privacy Policy', 'Documentation', 'Models'],
              },
              {
                heading: 'About',
                links: ['Blog', 'Discord', 'Articles'],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest mb-4">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-zinc-500 hover:text-zinc-300 text-[12px] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-zinc-700 text-[11px]">© 2026 NextFlow</p>
            <div className="flex items-center gap-4">
              {['✉', '𝕏', 'in', '▶'].map((icon) => (
                <button key={icon} className="text-zinc-600 hover:text-zinc-400 transition-colors text-[14px]">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
