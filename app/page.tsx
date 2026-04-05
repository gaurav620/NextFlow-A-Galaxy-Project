'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowRight,
  Workflow,
  Menu,
  X,
  Wand2,
  Image as ImageIcon,
  Video,
  Box,
  MonitorPlay,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── SHOWCASE HIGHLIGHTS ──────────────────────────────────── */
const showcaseFeatures = [
    {
        id: 'image',
        title: 'Image Generation',
        desc: 'Generate high quality images in milliseconds.',
        imgUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'video',
        title: 'Video Generation',
        desc: 'State of the art video rendering and motion processing.',
        imgUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3d',
        title: '3D Objects',
        desc: 'Turn any image or text prompt into a rich 3D mesh.',
        imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'restyle',
        title: 'Video Restyle',
        desc: 'Apply diverse visual aesthetics seamlessly to your videos.',
        imgUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
    }
];

/* ─── NAVBAR ─────────────────────────────────────────────────  */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <span className="text-black font-bold text-[18px] tracking-tight">NextFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/dashboard" className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors">App</Link>
          
          <div 
            className="relative h-[72px] flex items-center"
            onMouseEnter={() => setFeaturesOpen(true)}
            onMouseLeave={() => setFeaturesOpen(false)}
          >
            <button className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors flex items-center gap-1">
              Features <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {featuresOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[500px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-black/5 p-4 grid grid-cols-2 gap-2"
                    >
                        <div className="flex flex-col gap-1">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-3">Generate</h4>
                            <Link href="/dashboard/motion" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition">
                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center"><MonitorPlay className="w-5 h-5 text-blue-600" /></div>
                                <div><p className="text-sm font-semibold text-black">Motion Transfer</p><p className="text-xs text-zinc-500">Video character retargeting</p></div>
                            </Link>
                            <Link href="/dashboard/3d" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition">
                                <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center"><Box className="w-5 h-5 text-purple-600" /></div>
                                <div><p className="text-sm font-semibold text-black">3D Objects</p><p className="text-xs text-zinc-500">Image & text to 3D mesh</p></div>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-3">Edit</h4>
                            <Link href="/dashboard/video-restyle" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition">
                                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center"><Video className="w-5 h-5 text-orange-600" /></div>
                                <div><p className="text-sm font-semibold text-black">Video Restyle</p><p className="text-xs text-zinc-500">AI style transfer</p></div>
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition">
                                <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-pink-600" /></div>
                                <div><p className="text-sm font-semibold text-black">Image Generator</p><p className="text-xs text-zinc-500">AI generation</p></div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <Link href="/dashboard" className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors">Image Generator</Link>
          <Link href="/dashboard/video-restyle" className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors">Video Generator</Link>
          <Link href="/dashboard" className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors">API</Link>
          <Link href="#" className="text-[14px] font-medium text-zinc-600 hover:text-black transition-colors">Pricing</Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/sign-up"
            className="px-5 py-2 text-[14px] font-semibold text-black border border-black/10 hover:bg-black/5 rounded-full transition-colors"
          >
            Sign up for free
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 text-[14px] font-semibold text-white bg-black hover:bg-black/80 rounded-full transition-colors shadow-lg"
          >
            Log in
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-black/5 px-6 py-4 flex flex-col gap-4 shadow-xl">
            <Link href="/dashboard" className="text-[15px] font-medium text-black py-2">App</Link>
            <Link href="/dashboard/motion" className="text-[15px] font-medium text-black py-2">Motion Transfer</Link>
            <Link href="/dashboard/3d" className="text-[15px] font-medium text-black py-2">3D Objects</Link>
            <Link href="/dashboard/video-restyle" className="text-[15px] font-medium text-black py-2">Video Restyle</Link>
          <div className="flex gap-3 pt-4 border-t border-black/5">
            <Link href="/sign-up" className="flex-1 text-center py-3 text-[14px] font-bold text-black border border-black/10 rounded-xl">Sign up</Link>
            <Link href="/dashboard" className="flex-1 text-center py-3 text-[14px] font-bold text-white bg-black rounded-xl">Log in</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── LOGO MARQUEE ───────────────────────────────────────────  */
function Logos() {
    return (
        <div className="w-full flex justify-center py-8 opacity-40 grayscale">
            <div className="flex items-center gap-12 max-w-4xl overflow-hidden px-6">
                <span className="text-xl font-bold font-serif italic">NIKE</span>
                <span className="text-xl font-black">SAMSUNG</span>
                <span className="text-xl font-semibold tracking-tighter">Microsoft</span>
                <span className="text-xl font-bold tracking-tight">shopify</span>
                <span className="text-xl font-black text-red-600">LEGO</span>
            </div>
        </div>
    )
}

/* ─── HERO & DEMO INTERFACE ──────────────────────────────────  */
function Hero() {
  return (
    <section className="relative pt-[180px] pb-24 bg-[#f3f3f5] flex flex-col items-center text-center overflow-hidden font-sans">
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
        <h1 className="text-[clamp(48px,8vw,88px)] font-bold tracking-[-0.04em] text-black leading-[1.05] mb-6">
          Dead simple UI.<br />No tutorials needed.
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] text-zinc-600 mb-12 max-w-2xl leading-relaxed font-medium">
          NextFlow offers the simplest interfaces. Skip dry tutorials and get right into your creative flow with minimal distraction, even if you or your team has never worked with AI tools before.
        </p>

        {/* Central Dashboard Mockup Simulation */}
        <div className="w-full max-w-3xl bg-[#e5e5e5] rounded-[2rem] p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] flex flex-col gap-4 border border-white/50">
            <div className="w-full h-[180px] bg-[#d4d4d4] rounded-2xl flex flex-col p-6 items-start">
               <p className="text-zinc-500 font-medium text-left">Describe any visual you want to create. NextFlow will generate it instantly for free. You can write in any language.</p>
               
               <div className="mt-auto w-full flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <span className="bg-white/50 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 flex items-center gap-1"><MonitorPlay className="w-3 h-3"/> 16:9</span>
                       <span className="bg-white/50 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Style</span>
                   </div>
                   <Link href="/dashboard" className="bg-white px-5 py-2.5 rounded-xl font-bold text-black flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
                       <Wand2 className="w-4 h-4" /> Generate
                   </Link>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
}

/* ─── INTERACTIVE SHOWCASE ───────────────────────────────────  */
function InteractiveShowcase() {
    const [activeId, setActiveId] = useState(showcaseFeatures[0].id);

    return (
        <section className="py-32 bg-black text-white px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16">
                    <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight leading-[1.05] max-w-2xl">
                        Generate or edit high quality images, videos, and 3D objects with AI
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 min-h-[600px]">
                    <div className="md:col-span-4 flex flex-col gap-2">
                        {showcaseFeatures.map((feat) => (
                            <button
                                key={feat.id}
                                onClick={() => setActiveId(feat.id)}
                                className={`text-left p-6 rounded-3xl transition-all duration-300 relative overflow-hidden focus:outline-none ${
                                    activeId === feat.id 
                                        ? 'bg-zinc-900 border border-white/10' 
                                        : 'bg-transparent hover:bg-zinc-950 border border-transparent'
                                }`}
                            >
                                <h3 className={`text-2xl font-bold tracking-tight mb-2 ${activeId === feat.id ? 'text-white' : 'text-zinc-500'}`}>{feat.title}</h3>
                                {activeId === feat.id && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-zinc-400 leading-relaxed font-medium"
                                    >
                                        {feat.desc}
                                    </motion.p>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.img 
                                key={activeId}
                                src={showcaseFeatures.find(f => f.id === activeId)?.imgUrl}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Link href="/dashboard" className="px-8 py-3.5 bg-white text-black font-bold text-[15px] rounded-full hover:scale-105 transition-transform shadow-2xl">
                                Try it now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── PRICING PREVIEW ─────────────────────────────────────────  */
function PricingSection() {
    return (
        <section className="py-32 bg-white px-6">
            <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center">
                <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-tight leading-[1.05] text-black max-w-3xl mb-4">
                    Trusted by over 30,000,000 users. From 191 countries. We've got a plan for everybody.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-16">
                    <div className="p-8 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 text-left flex flex-col">
                        <h3 className="text-xl font-bold mb-2 text-black">Free</h3>
                        <p className="text-4xl font-black mb-8 text-black">$0 <span className="text-lg text-zinc-400 font-medium">/mo</span></p>
                        <Link href="/sign-up" className="w-full py-3 bg-black text-white text-center rounded-xl font-bold hover:bg-zinc-800 transition">Get Started</Link>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-600 font-medium">
                            <li>• Basic Generations</li>
                            <li>• Limited queue priority</li>
                            <li>• Community Support</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-black bg-black text-white text-left flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-black/20">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">MOST POPULAR</div>
                        <h3 className="text-xl font-bold mb-2">Pro</h3>
                        <p className="text-4xl font-black mb-8">$35 <span className="text-lg text-zinc-400 font-medium">/mo</span></p>
                        <Link href="/sign-up" className="w-full py-3 bg-white text-black text-center rounded-xl font-bold hover:bg-zinc-200 transition">Subscribe</Link>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-300 font-medium">
                            <li>• Unlimited Generations</li>
                            <li>• Fast queue priority</li>
                            <li>• Private mode</li>
                            <li>• All features access</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 text-left flex flex-col">
                        <h3 className="text-xl font-bold mb-2 text-black">Basic</h3>
                        <p className="text-4xl font-black mb-8 text-black">$9 <span className="text-lg text-zinc-400 font-medium">/mo</span></p>
                        <Link href="/sign-up" className="w-full py-3 bg-zinc-200 text-black text-center rounded-xl font-bold hover:bg-zinc-300 transition">Subscribe</Link>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-600 font-medium">
                            <li>• Increased Generations</li>
                            <li>• Standard queue</li>
                            <li>• Private mode</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 text-left flex flex-col">
                        <h3 className="text-xl font-bold mb-2 text-black">Max</h3>
                        <p className="text-4xl font-black mb-8 text-black">$105 <span className="text-lg text-zinc-400 font-medium">/mo</span></p>
                        <Link href="/sign-up" className="w-full py-3 bg-zinc-200 text-black text-center rounded-xl font-bold hover:bg-zinc-300 transition">Subscribe</Link>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-zinc-600 font-medium">
                            <li>• Maximum Performance</li>
                            <li>• Dedicated nodes</li>
                            <li>• Enterprise Support</li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    )
}

/* ─── FOOTER ─────────────────────────────────────────────────  */
function Footer() {
  const cols = [
    { title: 'NextFlow', links: [{ n: 'Log In', u: '/dashboard' }, { n: 'Pricing', u: '#' }, { n: 'Enterprise', u: '#' }] },
    { title: 'Products', links: [{ n: 'Motion Transfer', u: '/dashboard/motion' }, { n: '3D Objects', u: '/dashboard/3d' }, { n: 'Video Restyle', u: '/dashboard/video-restyle' }, { n: 'Dashboard', u: '/dashboard' }] },
    { title: 'Resources', links: [{ n: 'API', u: '#' }, { n: 'Documentation', u: '#' }, { n: 'Careers', u: '#' }] },
  ];

  return (
    <footer className="bg-black text-white pt-24 pb-12 font-sans border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Workflow className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">NextFlow</span>
            </Link>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">X</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">In</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">Ig</div>
            </div>
          </div>

          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-lg mb-6">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link.n}>
                    <Link href={link.u} className="text-zinc-400 hover:text-white transition-colors font-medium">
                        {link.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 font-medium">© 2026 NextFlow. All rights reserved.</p>
          <div className="flex gap-6">
              <span className="text-zinc-500 font-medium">Terms of Service</span>
              <span className="text-zinc-500 font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ENTRY ─────────────────────────────────────────────  */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f5] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Logos />
      <InteractiveShowcase />
      <PricingSection />
      <Footer />
    </main>
  );
}
