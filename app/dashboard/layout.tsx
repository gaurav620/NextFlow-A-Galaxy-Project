"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Grid3x3,
  Folder,
  Gamepad2,
  ChevronDown,
  Plus,
  Gift,
  LogOut,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const toolItems = [
  { label: 'Image',          color: '#4B9FFF', href: '/dashboard/image',        icon: '🖼️' },
  { label: 'Video',          color: '#FF8A4B', href: '/dashboard/video',         icon: '🎬' },
  { label: 'Enhancer',       color: '#9CA3AF', href: '/dashboard/enhancer',      icon: '✨' },
  { label: 'Nano Banana',    color: '#FFD93D', href: '/dashboard/nano',          icon: '⚡' },
  { label: 'Realtime',       color: '#A78BFA', href: '/dashboard/realtime',      icon: '🔴' },
  { label: 'Edit',           color: '#A78BFA', href: '/dashboard/edit',          icon: '✏️' },
  { label: 'Video Lipsync',  color: '#22D3EE', href: '/dashboard/lipsync',       icon: '💬' },
  { label: 'Motion Transfer',color: '#34D399', href: '/dashboard/motion',        icon: '🔄' },
  { label: '3D Objects',     color: '#6B7280', href: '/dashboard/3d',            icon: '📦' },
  { label: 'Video Restyle',  color: '#F472B6', href: '/dashboard/video-restyle', icon: '🎨' },
];

const mainItems = [
  { id: 'home',   label: 'Home',        icon: Home,     href: '/dashboard' },
  { id: 'train',  label: 'Train Lora',  icon: Gamepad2, href: '/dashboard/train' },
  { id: 'nodes',  label: 'Node Editor', icon: Grid3x3,  href: '/dashboard/workflows' },
  { id: 'assets', label: 'Assets',      icon: Folder,   href: '/dashboard/assets' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [showAllTools, setShowAllTools] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sessions = [
    { id: '1', label: 'Cyberpunk portrait series' },
    { id: '2', label: 'Product mockup shoot' },
    { id: '3', label: 'Logo variations v2' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setIsSidebarOpen(false);
    };
    handler(mq);
    mq.addEventListener('change', handler as any);
    return () => mq.removeEventListener('change', handler as any);
  }, []);

  const visibleTools = showAllTools ? toolItems : toolItems.slice(0, 6);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const textAnimation = {
    initial: { opacity: 0, width: 0, display: 'none' },
    animate: { opacity: 1, width: 'auto', display: 'block', transition: { delay: 0.1 } },
    exit: { opacity: 0, width: 0, display: 'none', transition: { duration: 0.1 } },
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0c0c0c', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <motion.div
        animate={{ width: isSidebarOpen ? 220 : (isMobile ? 0 : 70) }}
        transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
        className={`flex flex-col h-full flex-shrink-0 relative overflow-visible z-50 ${isMobile && !isSidebarOpen ? 'hidden' : ''} ${isMobile && isSidebarOpen ? 'absolute left-0 top-0 bottom-0 shadow-2xl' : ''}`}
        style={{ background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >

        {/* Logo & Toggle */}
        <div className={`px-4 pt-5 pb-3 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} gap-2.5`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-white/20">
              <span className="text-black font-extrabold text-sm font-sans tracking-tighter">N</span>
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  {...textAnimation}
                  className="text-white text-[14px] font-semibold tracking-tight whitespace-nowrap"
                >
                  NextFlow
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-zinc-500 hover:text-white transition-colors flex-shrink-0 p-1 rounded-md hover:bg-white/[0.05]"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* Model Switcher Pill */}
        <div className={`px-3 pb-3 flex justify-center ${!isSidebarOpen && 'mt-2'}`}>
          <button
            className={`flex items-center justify-between gap-2 py-1.5 rounded-full text-[12px] font-medium text-zinc-300 hover:text-white transition-all group ${isSidebarOpen ? 'w-full px-3' : 'w-auto px-1.5'}`}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa] mx-1" />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span {...textAnimation} className="whitespace-nowrap">Model NextFlow</motion.span>
                )}
              </AnimatePresence>
            </div>
            {isSidebarOpen && <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />}
          </button>
        </div>

        {/* Main Nav */}
        <div className="flex flex-col gap-1 px-3 pb-2 pt-1 border-t border-white/[0.04] mt-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-[13px] font-medium ${
                    active
                      ? 'bg-white/[0.08] text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span {...textAnimation} className="whitespace-nowrap">{item.label}</motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-800 text-white text-[11px] rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tools Section */}
        <div className="flex-1 overflow-hidden flex flex-col px-3 mt-4">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div {...textAnimation} className="px-1 mb-2">
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Studio</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto flex flex-col gap-1 [&::-webkit-scrollbar]:hidden">
            {visibleTools.map((tool, idx) => {
              const active = isActive(tool.href);
              return (
                <div key={idx} className="relative group">
                  <Link
                    href={tool.href}
                    className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-1.5 rounded-xl transition-all duration-150 text-[12.5px] font-medium ${
                      active
                        ? 'bg-white/[0.08] text-white'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[10px]"
                      style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}33`, color: tool.color }}
                    >
                      <span className="opacity-80">{tool.icon}</span>
                    </div>
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span {...textAnimation} className="truncate">{tool.label}</motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-800 text-white text-[11px] rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl">
                      {tool.label}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* More / Less */}
            <div className="relative group mt-1">
              <button
                onClick={() => setShowAllTools(!showAllTools)}
                className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3 text-[12px] text-zinc-500 hover:text-white px-3 py-1.5 transition-colors w-full rounded-xl hover:bg-white/[0.03]`}
              >
                <MoreHorizontal className="w-4 h-4 shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span {...textAnimation} className="whitespace-nowrap">{showAllTools ? 'Show Less' : 'Explore More'}</motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Section */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div {...textAnimation} className="px-3 mt-4 border-t border-white/[0.04] pt-4">
              <div className="px-1 mb-2 flex items-center justify-between">
                <button
                  onClick={() => setSessionsOpen(!sessionsOpen)}
                  className="flex items-center gap-1.5 group"
                >
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold group-hover:text-zinc-400 transition-colors">Sessions</span>
                  <ChevronDown className={`w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-all ${sessionsOpen ? '' : '-rotate-90'}`} />
                </button>
                <button
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/[0.07] text-zinc-600 hover:text-white transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {sessionsOpen && (
                <div className="flex flex-col gap-0.5">
                  {sessions.map(session => (
                    <button
                      key={session.id}
                      className="flex items-center gap-2 px-3 py-[6px] rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 text-[12px] w-full transition-all text-left truncate"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 flex-shrink-0" />
                      <span className="truncate">{session.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom: Credits + Profile */}
        <div className="px-3 pt-4 pb-4 mt-auto flex flex-col gap-3 border-t border-white/[0.04]" ref={menuRef}>
          
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div {...textAnimation} className="flex flex-col gap-2">
                {/* Earn Credits */}
                <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-zinc-800/20 to-zinc-900/20 rounded-lg border border-white/[0.02] cursor-pointer hover:border-white/[0.08] transition-colors">
                  <Gift className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-[11px] font-medium text-zinc-400">Earn 3,000 Credits</span>
                </div>

                {/* Upgrade Button */}
                <Link
                  href="/dashboard/pricing"
                  className="w-full py-2 rounded-xl text-white text-[12px] font-semibold text-center transition-all hover:opacity-90 active:scale-[0.98] block shadow-lg shadow-blue-900/10"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3b82f6 50%, #1D4ED8 100%)' }}
                >
                  Upgrade
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex w-full items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-2.5 px-2 py-2 rounded-xl border border-transparent transition-all group ${
                showProfileMenu ? 'bg-white/[0.07] border-white/10' : 'hover:bg-white/[0.04]'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0 shadow border border-white/[0.05]">
                <span className="text-[11px] font-bold text-white">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
                </span>
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div {...textAnimation} className="flex-1 min-w-0 text-left">
                    <div className="text-[12px] text-zinc-300 truncate font-semibold group-hover:text-white transition-colors">
                      {user?.firstName ? `${user.firstName}` : 'nextflow'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-medium">Free plan</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Floating Profile Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute bottom-full mb-3 left-0 w-[270px] bg-[#111] border border-white/[0.06] rounded-2xl z-[9999] flex flex-col p-1.5 shadow-2xl overflow-hidden"
                  style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
                >
                  {/* Workspace */}
                  <div className="px-3 pt-2 pb-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Workspace</span>
                  </div>
                  <div className="px-1 flex flex-col gap-1 mb-1">
                    <div className="flex w-full items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-left">
                      <div className="w-6 h-6 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-zinc-300">D</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-white truncate">Default Workspace</div>
                        <div className="text-[10px] text-zinc-500">Free plan</div>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/[0.06] my-1" />
                  <div className="px-1 pb-1 pt-1">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
                    >
                      <LogOut className="w-3.5 h-3.5 text-zinc-500 shrink-0 group-hover:text-red-400 transition-colors" />
                      <span className="text-[12px] font-medium text-zinc-400 group-hover:text-red-400 transition-colors">Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar backdrop overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile sidebar toggle button (floating) */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-3 left-3 z-50 w-9 h-9 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-lg"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}>
        {children}
      </div>
    </div>
  );
}
