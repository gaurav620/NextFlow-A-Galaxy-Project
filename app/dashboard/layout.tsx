"use client";

import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Image as ImageIcon, Video, Layers, Wand2, Zap, Menu, 
  Database, Grid3x3, Folder, Mic, Activity, Box, Film, MoreHorizontal, PanelLeft
} from 'lucide-react';

const mainLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/train', label: 'Train Lora', icon: Database },
  { href: '/dashboard/workflows', label: 'Node Editor', icon: Grid3x3 },
  { href: '/dashboard/assets', label: 'Assets', icon: Folder },
];

const defaultTools = [
  { href: '/dashboard/image', label: 'Image', icon: ImageIcon },
  { href: '/dashboard/video', label: 'Video', icon: Video },
  { href: '/dashboard/enhancer', label: 'Enhancer', icon: Wand2 },
  { href: '#', label: 'Nano Banana', icon: SparklesIcon }, // defined inline
  { href: '/dashboard/realtime', label: 'Realtime', icon: Zap },
  { href: '/dashboard/edit', label: 'Edit', icon: Layers },
];

const moreTools = [
  { href: '#', label: 'Video Lipsync', icon: Mic },
  { href: '#', label: 'Motion Transfer', icon: Activity },
  { href: '#', label: '3D Objects', icon: Box },
  { href: '#', label: 'Video Restyle', icon: Film },
];

// Simple Sparkles Custom Icon
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Clone specific states
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className={`h-full flex flex-col pt-3 pb-5 bg-[#0A0A0A] z-[60] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[64px] items-center px-1' : 'w-[240px] px-3'}`}>
      
      {/* Top Toggle Button */}
      <div className={`flex items-center mb-5 ${isCollapsed ? 'justify-center w-full' : 'justify-between px-2'}`}>
        {!isCollapsed && (
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <span className="text-black font-extrabold text-[11px] font-sans tracking-tighter">N</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Links */}
      <nav className={`flex flex-col gap-0.5 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <div key={item.label} className="relative group w-full">
              <Link
                href={item.href}
                className={`flex items-center transition-all duration-200 ${
                  isCollapsed 
                    ? `w-[38px] h-[38px] rounded-xl justify-center ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`
                    : `w-full h-10 px-3 rounded-lg gap-3 ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                {!isCollapsed && <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="fixed left-[64px] px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Tools Section */}
      <div className="mt-6 w-full flex flex-col">
        {!isCollapsed && (
          <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2">Tools</span>
        )}
        <nav className={`flex flex-col gap-0.5 w-full ${isCollapsed ? 'items-center' : ''}`}>
          {defaultTools.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <div key={item.label} className="relative group w-full">
                <Link
                  href={item.href}
                  className={`flex items-center transition-all duration-200 ${
                    isCollapsed 
                      ? `w-[38px] h-[38px] rounded-xl justify-center ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`
                      : `w-full h-10 px-3 rounded-lg gap-3 ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'}`
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                  {!isCollapsed && <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>}
                </Link>
                {isCollapsed && (
                  <div className="fixed left-[64px] px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}

          <AnimatePresence>
            {!isCollapsed && showMoreTools && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-0.5"
              >
                {moreTools.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center w-full h-10 px-3 rounded-lg gap-3 text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
                      <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && (
             <button
                onClick={() => setShowMoreTools(!showMoreTools)}
                className="flex items-center w-full h-10 px-3 rounded-lg gap-3 text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
             >
                <MoreHorizontal className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="text-[13.5px] font-medium">{showMoreTools ? 'Less' : 'More'}</span>
             </button>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col w-full relative z-50">
        
        {!isCollapsed && (
          <div className="px-3 mb-4 mt-8 flex flex-col gap-3">
             <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">Sessions</span>
                <span className="text-[13px] text-zinc-400 mt-2">Earn 3,000 Credits</span>
             </div>
             <button className="w-full relative py-2.5 rounded-lg overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/20 to-transparent"></div>
                <span className="relative z-10 text-[13.5px] font-bold text-white tracking-wide">Upgrade</span>
             </button>
          </div>
        )}

        {/* Profile */}
        <div className={`mt-2 ${isCollapsed ? 'flex justify-center' : 'px-3'}`}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center relative gap-3 rounded-xl hover:bg-white/[0.04] transition-colors ${
               isCollapsed ? 'w-[38px] h-[38px] justify-center' : 'w-full p-2'
            }`}
          >
            <div className="w-[30px] h-[30px] flex-shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-white border border-white/10 shadow-sm">
              <span className="text-[12px] font-bold">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
              </span>
            </div>
            {!isCollapsed && (
               <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[13px] text-zinc-200 font-medium whitespace-nowrap truncate w-full text-left">
                     {user?.fullName || 'Nextflow User'}
                  </span>
                  <span className="text-[11px] text-zinc-500">Free</span>
               </div>
            )}
            
            {/* Tooltip for Profile in collapsed state */}
            {isCollapsed && (
              <div className="fixed left-[64px] px-3 py-1.5 bg-[#1e1e1e] border border-white/10 text-white text-[12px] font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                Profile
              </div>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className={`absolute bottom-14 ${isCollapsed ? 'left-[64px]' : 'left-0'} w-[240px] bg-[#111] border border-white/[0.08] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden z-[9999]`}
              >
                <div className="p-4 flex items-center gap-3 border-b border-white/[0.04]">
                   <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-[14px]">
                      {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[14px] text-white font-medium">{user?.fullName || 'Nextflow User'}</span>
                      <span className="text-[12px] text-zinc-500">Free plan</span>
                   </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                   <Link href="/dashboard/pricing" onClick={() => setProfileOpen(false)} className="px-3 py-2 text-[13px] text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors">
                     Upgrade to Pro
                   </Link>
                   <button className="px-3 py-2 text-[13px] text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors text-left">
                     Manage Subscription
                   </button>
                   <div className="h-px bg-white/[0.04] my-1" />
                   <button onClick={() => { signOut(); setProfileOpen(false); }} className="px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium">
                     Log out
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-screen h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex h-full border-r border-white/[0.08] shadow-2xl z-[60]">
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
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
             <div className="w-7 h-7 rounded bg-white flex items-center justify-center">
                 <span className="text-black font-bold text-xs tracking-tighter">N</span>
             </div>
             <span className="text-white font-medium text-sm">NextFlow</span>
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
