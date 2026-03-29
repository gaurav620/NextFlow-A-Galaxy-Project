"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-medium mb-6 select-none">
        Built for Galaxy.ai
      </span>

      {/* Heading — no gradient text */}
      <h1 className="font-bold leading-tight tracking-tight text-balance">
        <span className="block text-5xl md:text-6xl text-white">
          Build AI Workflows
        </span>
        <span className="block text-5xl md:text-6xl text-white mt-1">
          Visually
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-xl text-base md:text-lg text-gray-500 leading-relaxed text-pretty">
        Connect LLM nodes, process images, and build powerful AI pipelines —
        all with drag and drop.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
        >
          Get Started Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
