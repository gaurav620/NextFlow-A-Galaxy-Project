'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    id: 'image-gen',
    title: 'AI Image Generation',
    desc: 'Generate images with a simple text description. Control your compositions precisely with over 1000 styles, 20 different models, native 4K, and image style transfer through exceptionally simple interfaces. The industry\'s fastest speeds at 3s for a 1024px Flux image.',
    btn: 'Try AI Image Generation',
    href: '/dashboard/image',
    img: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'upscaling',
    title: 'Image Upscaling',
    desc: 'Enhance and upscale images up to a 22K resolution. Make blurry photos razor-sharp, turn simple 3D renders into photo-like architecture visualizations, restore old film scans, or add ultra-fine skin textures.',
    btn: 'Try Image Upscaling',
    href: '/dashboard/enhancer',
    img: 'https://images.unsplash.com/photo-1634153037059-d88d266d71b3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'realtime',
    title: 'Real-time Rendering',
    desc: 'The market leader in realtime image generation. Turn easy-to-control primitives into photorealistic images in less than 50ms. Or try revolutionary Video Realtime with full frame consistency.',
    btn: 'Try Real-time Rendering',
    href: '/dashboard/realtime',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'video-gen',
    title: 'AI Video Generation',
    desc: 'Access all of the most powerful AI video models including Veo 3, Kling, Hailuo, Wan, and Runway. Generate viral videos for social media, animate static images, or add new details to existing videos.',
    btn: 'Try AI Video Generation',
    href: '/dashboard/video',
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'lora',
    title: 'LoRA Fine-tuning',
    desc: 'Train your own model. Upload just a few images of the same face, product, or visual style and teach NextFlow to generate it on demand.',
    btn: 'Try LoRA Fine-tuning',
    href: '/dashboard/train',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'video-upscale',
    title: 'Video Upscaling',
    desc: 'Upscale Videos up to 8K and interpolate frames to 120fps. Restore old videos, turn phone captures into professional footage, or make regular videos ultra slow-mo.',
    btn: 'Try Video Upscaling',
    href: '/dashboard/enhancer',
    img: 'https://images.unsplash.com/photo-1536240478700-b869ad10025f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'gen-editing',
    title: 'Generative Editing',
    desc: 'Choose from 10 editing models to edit images with generative AI. Add or remove objects, merge images, change expressions, or lighting in an exceptionally simple interface.',
    btn: 'Try Generative Editing',
    href: '/dashboard/edit',
    img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
  },
];

export function FeaturesTabSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-16 sm:py-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Section label */}
        <p className="text-zinc-400 font-medium text-[15px] mb-4">Use cases</p>
        <h2 className="text-[clamp(28px,4.5vw,52px)] font-bold text-black tracking-tighter leading-tight mb-12 sm:mb-16 max-w-2xl">
          Generate or edit high quality images, videos, and 3D objects with AI
        </h2>

        {/* Desktop: Two-column layout */}
        <div className="hidden lg:flex gap-16 xl:gap-24">
          {/* Left: Feature list */}
          <div className="w-[380px] xl:w-[420px] flex-shrink-0">
            <div className="flex flex-col gap-1">
              {features.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={`group flex flex-col text-left px-5 py-4 rounded-2xl transition-all duration-200 ${
                    active === i
                      ? 'bg-zinc-50 border border-zinc-200'
                      : 'hover:bg-zinc-50/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-semibold text-[16px] tracking-tight transition-colors ${
                        active === i ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-700'
                      }`}
                    >
                      {f.title}
                    </h3>
                    {active === i && (
                      <Link
                        href={f.href}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[12px] font-semibold text-black border border-zinc-200 rounded-lg px-3 py-1 hover:bg-zinc-100 transition-colors flex-shrink-0"
                      >
                        {f.btn} →
                      </Link>
                    )}
                  </div>
                  {active === i && (
                    <p className="text-[13px] text-zinc-500 leading-relaxed">{f.desc}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Image panel */}
          <div className="flex-1 relative">
            <div className="sticky top-24 rounded-[32px] overflow-hidden aspect-[4/3] bg-zinc-100 shadow-2xl ring-1 ring-zinc-200">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={features[active].img}
                  alt={features[active].title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile: Accordion list */}
        <div className="lg:hidden flex flex-col gap-4">
          {features.map((f, i) => (
            <div key={f.id} className="border border-zinc-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className={`font-semibold text-[16px] ${active === i ? 'text-black' : 'text-zinc-500'}`}>
                  {f.title}
                </span>
                <span className="text-zinc-400 text-xl leading-none">{active === i ? '−' : '+'}</span>
              </button>
              {active === i && (
                <div className="px-5 pb-5">
                  <div className="rounded-2xl overflow-hidden aspect-video mb-4">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{f.desc}</p>
                  <Link href={f.href} className="inline-block px-5 py-2.5 bg-black text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-800 transition-colors">
                    {f.btn} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
