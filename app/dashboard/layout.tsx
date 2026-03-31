'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Gamepad2,
  Grid3x3,
  Folder,
  ChevronDown,
  ChevronUp,
  Workflow,
  Plus,
  Gift,
  LogOut,
  Settings,
  BarChart2,
  CreditCard,
  Sparkles,
  MoreHorizontal,
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

  const visibleTools = showAllTools ? toolItems : toolItems.slice(0, 6);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0c0c0c', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <div className="w-[210px] flex flex-col h-full flex-shrink-0" style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Workflow className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white text-[13px] font-semibold tracking-tight">NextFlow</span>
        </div>

        {/* Model Switcher Pill */}
        <div className="px-3 pb-2">
          <button
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium text-zinc-300 hover:text-white transition-all group"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
              <span>Model NextFlow 1</span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </button>
        </div>

        {/* Main Nav */}
        <div className="flex flex-col gap-0.5 px-2 pb-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-[13px] font-medium group ${
                  active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Tools Section */}
        <div className="flex-1 overflow-hidden flex flex-col px-2 mt-3">
          <div className="px-3 mb-1.5">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Tools</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 [&::-webkit-scrollbar]:hidden">
            {visibleTools.map((tool, idx) => {
              const active = isActive(tool.href);
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg transition-all duration-150 text-[12.5px] font-medium group ${
                    active
                      ? 'bg-white/[0.08] text-white'
                      : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
                  }`}
                >
                  {/* Colored dot icon */}
                  <div
                    className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-[11px]"
                    style={{ background: `${tool.color}22`, border: `1px solid ${tool.color}44` }}
                  >
                    <span>{tool.icon}</span>
                  </div>
                  <span className="truncate">{tool.label}</span>
                </Link>
              );
            })}
          </div>

          {/* More / Less */}
          <button
            onClick={() => setShowAllTools(!showAllTools)}
            className="flex items-center gap-2 text-[12px] text-zinc-600 hover:text-zinc-400 px-3 py-2 transition-colors w-full rounded-lg hover:bg-white/[0.03]"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            <span>{showAllTools ? 'Less' : 'More'}</span>
          </button>
        </div>

        {/* Sessions Section */}
        <div className="px-2 mt-2">
          <div className="px-3 mb-1 flex items-center justify-between">
            <button
              onClick={() => setSessionsOpen(!sessionsOpen)}
              className="flex items-center gap-1.5 group"
            >
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold group-hover:text-zinc-400 transition-colors">Sessions</span>
              <ChevronDown className={`w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-all ${sessionsOpen ? '' : '-rotate-90'}`} />
            </button>
            <button
              title="New Session"
              className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-white/[0.07] text-zinc-600 hover:text-zinc-300 transition-all"
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
                  <div className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0" />
                  <span className="truncate">{session.label}</span>
                </button>
              ))}
              <button className="flex items-center gap-2 px-3 py-[6px] rounded-lg hover:bg-white/[0.04] text-zinc-600 hover:text-zinc-300 text-[12px] w-full transition-all">
                <Plus className="w-3 h-3" />
                <span>New Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom: Credits + Upgrade + Profile */}
        <div className="px-3 pt-3 pb-4 mt-auto flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} ref={menuRef}>
          {/* Earn Credits */}
          <div className="flex items-center gap-1.5 px-1">
            <Gift className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
            <span className="text-[11px] text-zinc-600">Earn 3,000 Credits</span>
          </div>

          {/* Pricing text link */}
          <Link
            href="/dashboard/pricing"
            className="text-center text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors py-0.5"
          >
            Pricing
          </Link>

          {/* Upgrade Button — blue gradient */}
          <Link
            href="/dashboard/pricing"
            className="w-full py-2 rounded-xl text-white text-[12px] font-semibold text-center transition-all hover:opacity-90 active:scale-[0.98] block"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3b82f6 50%, #1D4ED8 100%)' }}
          >
            Upgrade
          </Link>

          {/* User Profile Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex w-full items-center gap-2.5 px-2 py-2 rounded-xl border border-transparent transition-all group ${
                showProfileMenu ? 'bg-white/[0.07] border-white/10' : 'hover:bg-white/[0.05]'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-[11px] font-bold text-white">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[12px] text-zinc-300 truncate font-medium group-hover:text-white transition-colors">
                  {user?.firstName ? `${user.firstName}` : 'nextflow'}
                </div>
                <div className="text-[10px] text-zinc-600">Free plan</div>
              </div>
              <ChevronUp className={`w-3 h-3 text-zinc-600 transition-transform ${showProfileMenu ? '' : 'rotate-180'}`} />
            </button>

            {/* Floating Profile Menu */}
            {showProfileMenu && (
              <div
                className="absolute bottom-full mb-2 left-0 w-[270px] bg-[#151515] border border-white/[0.08] shadow-2xl rounded-2xl z-[9999] flex flex-col p-1.5 overflow-hidden"
                style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)' }}
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
                  <button className="flex w-full items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-all text-left group">
                    <div className="w-6 h-6 rounded-lg border border-zinc-800 bg-transparent flex items-center justify-center shrink-0">
                      <Plus className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    </div>
                    <span className="text-[12px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">Add workspace</span>
                  </button>
                </div>

                <div className="h-px w-full bg-white/[0.06] my-1" />

                {/* Credits */}
                <div className="px-1 mb-1">
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-3 flex flex-row items-center gap-3 cursor-pointer hover:border-white/10 transition-colors">
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#222" strokeWidth="3.5" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22D3EE" strokeWidth="3.5"
                          strokeLinecap="round" strokeDasharray="16 84" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-semibold text-white">16 Credits</span>
                      <span className="text-[10px] text-zinc-500">100 per day free</span>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/[0.06] my-1" />

                {/* Links */}
                <div className="px-1 flex flex-col gap-0.5">
                  {[
                    { href: '/dashboard/pricing', icon: Sparkles, label: 'Upgrade plan' },
                    { href: '/dashboard/pricing#compute-packs', icon: CreditCard, label: 'Buy credits' },
                    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                    { href: '/dashboard/usage-statistics', icon: BarChart2, label: 'Usage Statistics' },
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] transition-colors text-left group"
                    >
                      <item.icon className="w-3.5 h-3.5 text-zinc-500 shrink-0 group-hover:text-white transition-colors" />
                      <span className="text-[12px] font-medium text-zinc-400 group-hover:text-white transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px w-full bg-white/[0.06] my-1" />

                <div className="px-1 pb-1">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors text-left group"
                  >
                    <LogOut className="w-3.5 h-3.5 text-zinc-500 shrink-0 group-hover:text-red-400 transition-colors" />
                    <span className="text-[12px] font-medium text-zinc-400 group-hover:text-red-400 transition-colors">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0c0c0c' }}>
        {children}
      </div>
    </div>
  );
}
