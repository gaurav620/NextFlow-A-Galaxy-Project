'use client';
import Link from 'next/link';

const vcs = ['Y Combinator', 'a16z', 'Sequoia', 'Accel', 'General Catalyst'];

export function BackedBySection() {
  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-32 font-sans border-t border-white/[0.04]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
        {/* VC Logos (text) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-16 opacity-30">
          {vcs.map((vc) => (
            <span key={vc} className="text-white font-black text-[18px] sm:text-[22px] tracking-tighter uppercase">
              {vc}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h2 className="text-[clamp(28px,5vw,56px)] font-bold text-white tracking-tighter leading-[1.05] max-w-2xl mb-8">
          We are backed by world-class venture firms. And we are hiring.
        </h2>

        <p className="text-zinc-500 text-[15px] sm:text-[16px] max-w-lg mb-10 leading-relaxed">
          Join us in building the most powerful creative AI platform in the world.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/pricing"
            className="px-7 py-3.5 bg-white text-black text-[15px] font-bold rounded-full hover:bg-zinc-100 transition-colors"
          >
            Sign up for free
          </Link>
          <Link
            href="#"
            className="px-7 py-3.5 bg-transparent border border-white/20 text-white text-[15px] font-bold rounded-full hover:bg-white/5 transition-colors"
          >
            Browse job listings
          </Link>
        </div>
      </div>
    </section>
  );
}
