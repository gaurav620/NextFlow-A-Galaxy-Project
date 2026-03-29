'use client';

import { useState } from 'react';
import { ArrowRight, ExternalLink, Grid3x3, Layers, BookOpen, Sparkles, Plus, Clock, Workflow } from 'lucide-react';
import Link from 'next/link';

const tabs = ['Projects', 'Apps', 'Examples', 'Templates'];

export default function NodesPage() {
  const [activeTab, setActiveTab] = useState('Projects');

  return (
    <div className="flex flex-col w-full min-h-full text-white font-sans overflow-y-auto bg-[#09090b]">
      {/* Hero Banner Area */}
      <div className="relative w-full h-[340px] shrink-0 overflow-hidden flex items-end">
        {/* Background: Blurred node cards */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Dark base */}
          <div className="absolute inset-0 bg-[#0d0d0f]" />

          {/* Animated gradient orbs */}
          <div className="absolute top-[-40px] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-[20px] right-[30%] w-[200px] h-[200px] bg-purple-600/8 rounded-full blur-[60px] pointer-events-none" />

          {/* Node cards floating in background */}
          <div className="absolute right-[-20px] top-[30px] w-[520px] flex gap-3 opacity-60">
            {/* Card 1 */}
            <div className="w-[160px] h-[95px] rounded-xl bg-[#111115] border border-white/[0.06] backdrop-blur-sm transform rotate-[-3deg] translate-y-4 flex flex-col p-2.5 gap-1.5 shadow-2xl">
              <div className="w-14 h-1.5 bg-blue-500/40 rounded-full" />
              <div className="w-10 h-1.5 bg-zinc-700/60 rounded-full" />
              <div className="mt-auto flex gap-1.5">
                <div className="w-5 h-5 rounded bg-blue-600/30 border border-blue-500/20" />
                <div className="w-5 h-5 rounded bg-purple-600/30 border border-purple-500/20" />
              </div>
            </div>
            {/* Card 2 */}
            <div className="w-[180px] h-[110px] rounded-xl bg-[#0f0f13] border border-white/[0.08] backdrop-blur-sm transform rotate-[2deg] translate-y-0 flex flex-col p-3 gap-2 shadow-2xl">
              <div className="w-full flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-400/20 flex-shrink-0" />
                <div className="w-16 h-1.5 bg-zinc-600/60 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-5 rounded bg-zinc-800/60 border border-white/5" />
                <div className="h-5 rounded bg-zinc-800/60 border border-white/5" />
                <div className="h-5 rounded bg-zinc-800/60 border border-white/5" />
                <div className="h-5 rounded bg-zinc-800/60 border border-white/5" />
              </div>
            </div>
            {/* Card 3 */}
            <div className="w-[150px] h-[90px] rounded-xl bg-[#101014] border border-white/[0.05] backdrop-blur-sm transform rotate-[-1deg] translate-y-6 flex flex-col p-2.5 gap-1.5 shadow-2xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                <Workflow className="w-4 h-4 text-blue-400/60" />
              </div>
              <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full" />
            </div>
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
              <line x1="160" y1="60" x2="175" y2="65" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="340" y1="55" x2="355" y2="60" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#09090b]/20 via-transparent to-[#09090b]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-20 w-full px-10 pb-10 flex flex-col justify-end h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Grid3x3 className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-[28px] font-semibold tracking-tight leading-none">Node Editor</h1>
          </div>
          <p className="max-w-[380px] text-zinc-500 text-[13px] leading-relaxed mb-5">
            Connect every tool and model into complex automated pipelines. The most powerful way to operate NextFlow.
          </p>
          <div className="flex items-center gap-3">
            <button className="bg-white text-black font-semibold text-[12px] px-4 py-2 rounded-full w-fit hover:bg-zinc-100 transition-colors flex items-center gap-1.5">
              New Workflow
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-zinc-300 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-10">
        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.06] pt-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-medium px-3 py-2.5 transition-all relative ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5">
            <Workflow className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-[16px] font-semibold mb-2 text-white">No Workflows Yet</h2>
          <p className="text-zinc-600 text-[13px] text-center max-w-[260px] mb-6 leading-relaxed">
            You haven&apos;t created any workflows yet. Get started by creating your first one.
          </p>
          <button className="bg-white text-black font-semibold text-[12px] px-6 py-2 rounded-full hover:bg-zinc-100 transition-colors mb-3">
            New Workflow
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors">
            <ExternalLink className="w-3 h-3" />
            View examples
          </button>
        </div>
      </div>
    </div>
  );
}
