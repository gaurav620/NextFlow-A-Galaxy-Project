'use client';
import Link from 'next/link';

const modelImages = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108755-2616b612b55c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
];

const features = [
  'Photorealistic skin textures and color science',
  'Discover new perspectives with extreme camera angles',
  'Perfect imperfection. Grain, bloom, blur',
  'Engineered for high visual complexity',
  'Dreamy, vivid, weird. Artistic and expressive rendering',
  'Dali paintings or cat memes. Ultra realistic surrealism',
  'Simple prompts, strong visuals',
];

export function ModelShowcaseSection() {
  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-32 font-sans overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <div>
            <p className="text-zinc-600 text-[13px] sm:text-[14px] font-medium mb-3">Our flagship model</p>
            <h2 className="text-[clamp(32px,5vw,64px)] font-bold text-white tracking-tighter leading-[1.05] max-w-xl">
              NextFlow 1 — Our ultra-realistic image model
            </h2>
          </div>
          <Link
            href="/dashboard/image"
            className="self-start lg:self-end px-6 py-3 bg-white text-black text-[14px] font-bold rounded-full hover:bg-zinc-100 transition-colors flex-shrink-0"
          >
            Try NextFlow 1
          </Link>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-12 sm:mb-16">
          {modelImages.map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl bg-zinc-900 group ${
                i === 0 ? 'row-span-2 aspect-[2/3] sm:aspect-auto' : 'aspect-[3/4]'
              }`}
            >
              <img
                src={src}
                alt={`NextFlow 1 example ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>

        {/* Feature bullets (horizontal scroll on mobile) */}
        <div
          className="flex flex-col sm:flex-row gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
              <span className="text-white/70 text-[12px] sm:text-[13px] font-medium whitespace-nowrap">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
