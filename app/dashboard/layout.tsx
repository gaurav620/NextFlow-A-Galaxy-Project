'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
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
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  const [showAllTools, setShowAllTools] = useState(true);

  const mainItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
    { id: 'train', label: 'Train Lora', icon: Gamepad2, href: '/dashboard/train' },
    { id: 'nodes', label: 'Node Editor', icon: Grid3x3, href: '/dashboard/nodes' },
    { id: 'assets', label: 'Assets', icon: Folder, href: '/dashboard/assets' },
  ];

  const toolItems = [
    { label: 'Image', color: '#4B9FFF', href: '/dashboard/image' },
    { label: 'Video', color: '#FF8A4B', href: '/dashboard/video' },
    { label: 'Enhancer', color: '#9CA3AF', href: '/dashboard/enhancer' },
    { label: 'Nano Banana', color: '#FFD93D', href: '/dashboard/nano' },
    { label: 'Realtime', color: '#A78BFA', href: '/dashboard/realtime' },
    { label: 'Edit', color: '#A78BFA', href: '/dashboard/edit' },
    { label: 'Video Lipsync', color: '#22D3EE', href: '/dashboard/lipsync' },
    { label: 'Motion Transfer', color: '#34D399', href: '/dashboard/motion' },
    { label: '3D Objects', color: '#6B7280', href: '/dashboard/3d' },
    { label: 'Video Restyle', color: '#F472B6', href: '/dashboard/video-restyle' },
  ];

  const visibleTools = showAllTools ? toolItems : toolItems.slice(0, 5);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#111', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <div className="w-[130px] bg-[#000] flex flex-col h-full border-r border-[#1f1f1f] overflow-hidden flex-shrink-0">

        {/* Logo */}
        <div className="px-3 py-3.5 flex items-center gap-2">
          <div className="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Workflow className="w-3 h-3 text-white" />
          </div>
          <span className="text-white text-[12px] font-semibold tracking-tight truncate">NextFlow</span>
        </div>

        {/* Main Nav */}
        <div className="flex flex-col gap-px px-1.5 pb-1">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-2.5 py-[7px] rounded-md transition-all duration-150 text-[12px] font-medium group ${
                  active
                    ? 'bg-[#1f1f1f] text-white'
                    : 'text-zinc-500 hover:bg-[#0f0f0f] hover:text-zinc-300'
                }`}
              >
                <Icon
                  className={`w-[14px] h-[14px] flex-shrink-0 ${
                    active ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] mx-2 my-1" />

        {/* Tools Section */}
        <div className="flex-1 overflow-hidden flex flex-col px-1.5">
          <div className="px-2 mb-1">
            <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-semibold">Tools</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-px [&::-webkit-scrollbar]:hidden">
            {visibleTools.map((tool, idx) => {
              const active = isActive(tool.href);
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  className={`flex items-center gap-2 px-2.5 py-[6px] rounded-md transition-all duration-150 text-[11.5px] font-medium group ${
                    active
                      ? 'bg-[#1f1f1f] text-white'
                      : 'text-zinc-500 hover:bg-[#0f0f0f] hover:text-zinc-300'
                  }`}
                >
                  <div
                    className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                    style={{ background: tool.color, boxShadow: `0 0 5px ${tool.color}80` }}
                  />
                  <span className="truncate">{tool.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Less / More */}
          {toolItems.length > 5 && (
            <button
              onClick={() => setShowAllTools(!showAllTools)}
              className="flex items-center gap-1 text-[10px] text-zinc-700 hover:text-zinc-400 px-2.5 py-1.5 transition-colors w-full"
            >
              {showAllTools ? (
                <><ChevronUp className="w-2.5 h-2.5" /><span>Less</span></>
              ) : (
                <><ChevronDown className="w-2.5 h-2.5" /><span>More</span></>
              )}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] mx-2 my-1" />

        {/* Sessions */}
        <div className="px-1.5 pb-1">
          <div className="px-2 mb-1">
            <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-semibold">Sessions</span>
          </div>
          <button className="flex items-center gap-2 px-2.5 py-[6px] rounded-md hover:bg-[#0f0f0f] text-zinc-600 hover:text-zinc-300 text-[11.5px] font-medium w-full transition-colors">
            <Plus className="w-[13px] h-[13px]" />
            <span className="truncate">New</span>
          </button>
        </div>

        {/* Bottom User / Credits */}
        <div className="border-t border-[#1a1a1a] mx-2 pt-2 pb-3 flex flex-col gap-2 px-1">
          {/* Earn credits hint */}
          <div className="flex items-center gap-1.5 px-2 py-1">
            <Gift className="w-3 h-3 text-zinc-600 flex-shrink-0" />
            <span className="text-[10px] text-zinc-600 leading-tight">Earn 3,000 Credits</span>
          </div>

          {/* Upgrade button - matches Krea.ai blue gradient */}
          <button
            className="w-full py-1.5 rounded-lg text-white text-[11px] font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
          >
            Upgrade
          </button>

          {/* User row */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-semibold text-zinc-200">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'N'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] text-zinc-400 truncate font-medium">
                {user?.firstName ? `${user.firstName.toLowerCase()}...` : 'nextflowu...'}
              </div>
              <div className="text-[9px] text-zinc-600">Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#111]">
        {children}
      </div>
    </div>
  );
}
