'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const brands = [
  'Samsung', 'Nike', 'Microsoft', 'Shopify', 'Lego', 'Adobe', 'Figma', 'Notion', 'Canva', 'Stripe'
];

export function PowersMillion() {
  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32 font-sans overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        {/* Headline */}
        <h2 className="text-[clamp(32px,5.5vw,64px)] font-bold text-white tracking-tighter leading-[1.05] max-w-3xl mb-12">
          NextFlow powers millions of creatives, enterprises, and everyday people.
        </h2>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-20">
          <Link
            href="/pricing"
            className="px-7 py-3 bg-white text-black text-[14px] font-bold rounded-full hover:bg-zinc-100 transition-colors"
          >
            Sign up for free
          </Link>
          <Link
            href="#"
            className="px-7 py-3 bg-transparent border border-white/20 text-white text-[14px] font-bold rounded-full hover:bg-white/5 transition-colors"
          >
            Contact Sales
          </Link>
        </div>

        {/* Brand Marquee */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
            className="flex items-center gap-16 sm:gap-24 min-w-max pr-16 sm:pr-24"
          >
            {[...brands, ...brands].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="text-2xl sm:text-3xl font-black text-white/20 tracking-tighter uppercase whitespace-nowrap"
              >
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
