"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
      {/* Animated gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-purple-700/10 blur-[120px] animate-pulse" />
        <div className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full bg-blue-700/8 blur-[100px] animate-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] rounded-full bg-purple-600/8 blur-[100px] animate-pulse [animation-delay:3s]" />
      </div>

      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6 select-none">
        🚀 Built for Galaxy.ai
      </span>

      {/* Heading */}
      <h1 className="font-bold leading-tight tracking-tight text-balance">
        <span className="block text-6xl md:text-7xl text-white">
          Build AI Workflows
        </span>
        <span className="block text-6xl md:text-7xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-1">
          Visually
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed text-pretty">
        Connect LLM nodes, process images, and build powerful AI pipelines —
        all with drag and drop.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg shadow-purple-900/40"
        >
          Get Started Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
