"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Image as ImageIcon, Video, Layers, Wand2, Zap, Settings2, HelpCircle, MessageCircle, Grid3x3, Database, Folder, Menu, X
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/image', label: 'Generate', icon: ImageIcon },
  { href: '/dashboard/realtime', label: 'Realtime', icon: Zap },
  { href: '/dashboard/video', label: 'Video', icon: Video },
  { href: '/dashboard/enhancer', label: 'Enhance', icon: Wand2 },
  { href: '/dashboard/edit', label: 'Edit', icon: Layers },
  { href: '/dashboard/train', label: 'Train', icon: Database },
  { href: '/dashboard/workflows', label: 'Workflows', icon: Grid3x3 },
  { href: '/dashboard/assets', label: 'Assets', icon: Folder },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="w-[64px] h-full flex flex-col items-center py-5 bg-[#0c0c0c] z-[60]">
        
        {/* NextFlow Logo */}
        <Link href="/" className="mb-6 relative group z-50">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="text-black font-extrabold text-[15px] font-sans tracking-tighter">N</span>
          </div>
        </Link>

        {/* Primary Tools */}
        <nav className="flex flex-col gap-2 w-full px-2 mt-2 z-50">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <div key={item.label} className="relative group flex justify-center">
                <Link
                  href={item.href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                    active 
                      ? 'bg-white/[0.12] text-white shadow-inner' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
                  {active && (
                    <motion.div layoutId="activeInd" className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-md" />
                  )}
                </Link>
                
                {/* Framer Motion Tooltip */}
                <div className="hidden md:block absolute left-[54px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-[100] shadow-xl whitespace-nowrap tracking-wide">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Tools */}
        <div className="mt-auto flex flex-col items-center gap-2 w-full px-2 z-50">
          <div className="w-6 h-[1px] bg-white/[0.06] my-2" />
          
          <div className="relative group flex justify-center">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors">
              <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <div className="hidden md:block absolute left-[54px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-[100] shadow-xl whitespace-nowrap">
              Community
            </div>
          </div>

          <div className="relative group flex justify-center">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors">
              <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <div className="hidden md:block absolute left-[54px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-[100] shadow-xl whitespace-nowrap">
              Help
            </div>
          </div>

          <div className="relative group flex justify-center">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors">
              <Settings2 className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <div className="hidden md:block absolute left-[54px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-[100] shadow-xl whitespace-nowrap">
              Settings
            </div>
          </div>

          {/* User Profile */}
          <div className="relative mt-2">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border-[2px] border-[#0c0c0c] ring-2 ring-transparent hover:ring-white/10 transition-all shadow-md group"
            >
              <span className="text-[13px] font-bold text-white group-hover:scale-105 transition-transform">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-0 left-[60px] md:left-[60px] max-md:-left-[240px] w-[240px] bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-[9999]"
                >
                  <div className="p-4 flex items-center gap-3 border-b border-white/[0.04]">
                     <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-[13px]">
                        {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[13px] text-white font-medium">{user?.fullName || 'Nextflow User'}</span>
                        <span className="text-[12px] text-zinc-500">Free plan</span>
                     </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                     <Link href="/dashboard/pricing" onClick={() => setProfileOpen(false)} className="px-3 py-2 text-[12px] text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors">
                       Upgrade to Pro
                     </Link>
                     <button className="px-3 py-2 text-[12px] text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors text-left">
                       Manage Subscription
                     </button>
                     <div className="h-px bg-white/[0.04] my-1" />
                     <button onClick={() => { signOut(); setProfileOpen(false); }} className="px-3 py-2 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium">
                       Log out
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex w-screen h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* ── DESKTOP MINIMALIST SIDEBAR ── */}
      <div className="hidden md:flex h-full border-r border-white/[0.04] shadow-md z-[60]">
         <SidebarContent />
      </div>

      {/* ── MOBILE OVERLAY MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[50] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="h-full border-r border-white/[0.04]"
              onClick={(e) => e.stopPropagation()}
            >
               <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE NAVBAR TOP ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0c0c0c]/90 backdrop-blur border-b border-white/[0.04] z-[40] flex items-center justify-between px-4">
         <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                 <span className="text-black font-bold text-xs tracking-tighter">N</span>
             </div>
             <span className="text-white font-medium text-sm">NextFlow App</span>
         </div>
         <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
            <Menu className="w-5 h-5" />
         </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 w-full h-full relative overflow-y-auto bg-[#0A0A0A] md:pt-0 pt-14 flex flex-col">
        {children}
      </div>
      
    </div>
  );
}
