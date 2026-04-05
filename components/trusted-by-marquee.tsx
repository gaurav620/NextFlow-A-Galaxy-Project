'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const brands = [
  "Samsung", "Nike", "Microsoft", "Shopify", "Lego", "Samsung", "Nike"
];

export function TrustedByMarquee() {
  return (
    <section className="bg-white py-32 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <p className="text-zinc-500 font-medium text-[16px] md:text-[18px] mb-6">A tool suite for pros and beginners alike</p>
        <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-black tracking-tighter leading-tight max-w-4xl mb-24">
          NextFlow powers millions of creatives, enterprises, and everyday people.
        </h2>

        {/* Marquee */}
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden mb-24 flex items-center opacity-40 grayscale">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
            
            <motion.div 
                initial={{ x: "0%" }}
                animate={{ x: "-50%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                className="flex items-center gap-16 md:gap-32 min-w-max pr-16 md:pr-32"
            >
                {[...brands, ...brands].map((b, i) => (
                    <div key={`${b}-${i}`} className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase">
                        {b}
                    </div>
                ))}
            </motion.div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
           <Link href="/pricing" className="px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-100 transition-colors border border-zinc-200">
              Sign up for free
           </Link>
           <Link href="/dashboard" className="px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors border border-black">
              Contact Sales
           </Link>
        </div>
      </div>
    </section>
  );
}
