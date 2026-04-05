'use client';

import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import Link from 'next/link';
import { Terminal, Code, Cpu, Zap, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function APIPage() {
  const [activeTab, setActiveTab] = useState<'ts' | 'curl'>('ts');
  return (
    <main className="bg-white min-h-screen text-black font-sans selection:bg-black selection:text-white">
      <Navbar theme="light" />
      
      {/* Hero Section */}
      <section className="pt-[200px] pb-[100px] px-6 text-center max-w-[1000px] mx-auto min-h-[70vh] flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[13px] font-medium mb-8">
              <Terminal className="w-4 h-4" />
              API Access
          </div>
          
          <h1 className="text-[64px] md:text-[84px] leading-[1.05] font-semibold tracking-tight mb-8">
              Build with<br />NextFlow API
          </h1>
          
          <p className="text-[20px] leading-relaxed text-zinc-500 mb-12 max-w-[600px] mx-auto">
              Get your API key and start generating with 40+ AI models in minutes. Same compute units, same account, one API.
          </p>
          
          <div className="flex items-center gap-4">
              <Link href="/dashboard/workflows" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-black text-white font-semibold text-[15px] hover:bg-zinc-800 transition-colors shadow-xl">
                  Get Started
              </Link>
              <Link href="#" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-transparent text-black border border-black/10 font-semibold text-[15px] hover:bg-zinc-50 transition-colors">
                  Read Docs
              </Link>
          </div>
      </section>

      {/* Code Snippet / Features */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">Simple, powerful endpoints</h2>
                <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                    Our REST API is designed to be intuitive and fast, letting you generate images, videos, and upscale assets with reliable latency and high concurrency.
                </p>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-zinc-700" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Ultra-low latency</h4>
                            <p className="text-zinc-500 text-[15px]">Optimized inference stack delivering generations in milliseconds.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                            <Cpu className="w-5 h-5 text-zinc-700" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">Scale instantly</h4>
                            <p className="text-zinc-500 text-[15px]">Enterprise-grade infrastructure that scales automatically with your traffic.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                            <Code className="w-5 h-5 text-zinc-700" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-1">OpenAPI Spec</h4>
                            <p className="text-zinc-500 text-[15px]">Typed SDKs and clear documentation to get you building faster.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#111] rounded-2xl p-6 shadow-2xl border border-black/10 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4 justify-between">
                    <div className="flex items-center">
                        <div className="flex gap-2 mr-6">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActiveTab('ts')}
                                className={`text-xs font-mono pb-4 -mb-4 transition-colors ${activeTab === 'ts' ? 'text-white border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                TypeScript
                            </button>
                            <button 
                                onClick={() => setActiveTab('curl')}
                                className={`text-xs font-mono pb-4 -mb-4 transition-colors ${activeTab === 'curl' ? 'text-white border-b-2 border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                cURL
                            </button>
                        </div>
                    </div>
                    <span className="text-zinc-500 text-xs font-mono">{activeTab === 'ts' ? 'generate.ts' : 'request.sh'}</span>
                </div>
                
                {activeTab === 'ts' ? (
                    <pre className="text-[13px] font-mono text-zinc-300 leading-relaxed overflow-x-auto min-h-[200px]">
                        <code>
                            <span className="text-[#F97583]">import</span> {'{'} NextFlow {'}'} <span className="text-[#F97583]">from</span> <span className="text-[#9ECBFF]">'nextflow-sdk'</span>;{'\n\n'}
                            <span className="text-[#F97583]">const</span> nextflow = <span className="text-[#F97583]">new</span> NextFlow({'{'} apiKey: process.env.NEXTFLOW_KEY {'}'});{'\n\n'}
                            <span className="text-[#F97583]">const</span> image = <span className="text-[#F97583]">await</span> nextflow.images.generate({'{'}{'\n'}
                            {'  '}prompt: <span className="text-[#9ECBFF]">'A cinematic shot of a neon city, 8k resolution'</span>,{'\n'}
                            {'  '}model: <span className="text-[#9ECBFF]">'nextflow-v1'</span>,{'\n'}
                            {'  '}aspect_ratio: <span className="text-[#9ECBFF]">'16:9'</span>{'\n'}
                            {'}'});{'\n\n'}
                            console.log(image.url);
                        </code>
                    </pre>
                ) : (
                    <pre className="text-[13px] font-mono text-zinc-300 leading-relaxed overflow-x-auto min-h-[200px]">
                        <code>
                            <span className="text-[#79B8FF]">curl</span> -X POST https://api.nextflow.ai/v1/images/generations \{'\n'}
                            {'  '}-H <span className="text-[#9ECBFF]">"Content-Type: application/json"</span> \{'\n'}
                            {'  '}-H <span className="text-[#9ECBFF]">"Authorization: Bearer $NEXTFLOW_KEY"</span> \{'\n'}
                            {'  '}-d <span className="text-[#9ECBFF]">'{'{'}"prompt": "A cinematic shot of a neon city", "model": "nextflow-v1"'}'</span>{'\n'}
                        </code>
                    </pre>
                )}
            </div>
        </div>
      </section>

      {/* Use the standalone light footer */}
      <Footer theme="light" />
    </main>
  );
}
