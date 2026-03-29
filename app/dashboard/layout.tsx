'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Home,
  Gamepad2,
  Grid3x3,
  Folder,
  ImageIcon,
  Video,
  Sparkles,
  Square,
  Zap,
  Edit2,
  Wand2,
  RotateCw,
  Cube,
  Plus,
  ChevronDown,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [showAllTools, setShowAllTools] = useState(true);
  const [activeNav, setActiveNav] = useState('editor');

  const mainItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#' },
    { id: 'train', label: 'Train Lora', icon: Gamepad2, href: '#' },
    { id: 'editor', label: 'Node Editor', icon: Grid3x3, href: '/dashboard' },
    { id: 'assets', label: 'Assets', icon: Folder, href: '#' },
  ];

  const toolItems = [
    { label: 'Image', icon: Square, color: '#4B9FFF' },
    { label: 'Video', icon: Square, color: '#FF8A4B' },
    { label: 'Enhancer', icon: Sparkles, color: '#6B7280' },
    { label: 'Nano Banana', icon: Square, color: '#FFD93D' },
    { label: 'Realtime', icon: Zap, color: '#A855F7' },
    { label: 'Edit', icon: Edit2, color: '#A855F7' },
    { label: 'Video Lipsync', icon: Video, color: '#06B6D4' },
    { label: 'Motion Transfer', icon: RotateCw, color: '#22C55E' },
    { label: '3D Objects', icon: Cube, color: '#4B5563' },
    { label: 'Video Restyle', icon: Wand2, color: '#EC4899' },
  ];

  const visibleTools = showAllTools ? toolItems : toolItems.slice(0, 5);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* LEFT SIDEBAR */}
      <div className="w-[160px] bg-[#0f0f0f] flex flex-col h-full px-2 py-3 border-r border-[#1a1a1a]">
        {/* TOP SECTION - Main Navigation */}
        <div className="flex flex-col">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/5 my-2" />

        {/* TOOLS SECTION */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="text-[11px] text-gray-600 uppercase tracking-wider px-3 py-1 font-medium">
            Tools
          </div>

          {/* Tools List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
            {visibleTools.map((tool, idx) => (
              <button
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/8 transition-all text-gray-400 hover:text-white text-sm group"
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ background: tool.color }}
                />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Less/More Toggle */}
          {toolItems.length > 5 && (
            <button
              onClick={() => setShowAllTools(!showAllTools)}
              className="text-xs text-gray-600 hover:text-gray-500 px-3 py-1 transition-colors text-left"
            >
              {showAllTools ? '... Less' : '... More'}
            </button>
          )}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/5 my-2" />

        {/* SESSIONS SECTION */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] text-gray-600 uppercase tracking-wider px-3 py-1 font-medium">
            Sessions
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl hover:bg-white/8 transition-all text-gray-400 hover:text-white text-sm">
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* BOTTOM - USER SECTION */}
        <div className="mt-auto border-t border-white/5 pt-3">
          <div className="px-3 py-2 flex flex-col gap-2">
            {/* User Avatar and Name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-white">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-300 truncate">
                  {user?.firstName || 'User'}
                </div>
                <div className="text-[10px] text-gray-500">Free</div>
              </div>
            </div>
            {/* Upgrade Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg px-3 py-1.5 font-medium transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* CENTER - MAIN CONTENT */}
      <div className="flex-1 overflow-hidden bg-[#0a0a0a]">{children}</div>
    </div>
  );
}
