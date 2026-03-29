'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
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
  Menu,
  X,
  Plus,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HistorySidebar } from '@/components/history-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const mainItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'train', label: 'Train Lora', icon: Gamepad2 },
    { id: 'editor', label: 'Node Editor', icon: Grid3x3 },
    { id: 'assets', label: 'Assets', icon: Folder },
  ];

  const toolItems = [
    { label: 'Image', icon: ImageIcon, color: 'bg-blue-500' },
    { label: 'Video', icon: Video, color: 'bg-orange-500' },
    { label: 'Enhancer', icon: Sparkles, color: 'bg-gray-500' },
    { label: 'Nano Banana', icon: Square, color: 'bg-yellow-500' },
    { label: 'Realtime', icon: Zap, color: 'bg-purple-500' },
    { label: 'Edit', icon: Edit2, color: 'bg-purple-500' },
    { label: 'Video Lipsync', icon: Video, color: 'bg-cyan-500' },
    { label: 'Motion Transfer', icon: RotateCw, color: 'bg-green-500' },
    { label: '3D Objects', icon: Cube, color: 'bg-gray-700' },
    { label: 'Video Restyle', icon: Wand2, color: 'bg-gradient-to-r from-pink-500 to-purple-500' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712]">
      {/* Mobile Menu Trigger */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Bottom Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 rounded-t-3xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <SidebarMenu />
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR - krea.ai style */}
      <div className="hidden md:flex flex-col w-[160px] bg-[#0f0f0f] border-r border-gray-900 transition-all duration-300">
        <SidebarMenu />
      </div>

      {/* CENTER CANVAS */}
      <div className="flex-1 overflow-hidden w-full">{children}</div>

      {/* RIGHT SIDEBAR - History */}
      <div className="hidden md:flex flex-col h-full w-72 bg-[#0f0f0f] border-l border-gray-900">
        <HistorySidebar />
      </div>
    </div>
  );

  function SidebarMenu() {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Main Items */}
          <div className="flex flex-col">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 mx-2 rounded-lg flex items-center gap-3 text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tools Section */}
          <div className="mt-4 px-3">
            <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-3">
              Tools
            </div>
            <div className="flex flex-col gap-1">
              {toolItems.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <button className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm text-gray-300 hover:bg-white/5 transition-colors group">
                        <div className={`w-4 h-4 rounded flex-shrink-0 ${tool.color}`} />
                        <span className="hidden md:inline text-sm">{tool.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{tool.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Sessions Section */}
          <div className="mt-auto border-t border-gray-900 pt-4 px-3 pb-4">
            <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-3">
              Sessions
            </div>
            <button className="w-full px-3 py-2 rounded-lg flex items-center justify-center gap-2 bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">New Session</span>
            </button>
          </div>

          {/* User Section */}
          <div className="border-t border-gray-900 p-3 flex items-center gap-2">
            <div className="flex-shrink-0">
              <UserButton />
            </div>
            <div className="hidden md:flex flex-col flex-1 min-w-0">
              <span className="text-sm text-gray-300 truncate">User</span>
              <span className="text-xs text-gray-500">Free</span>
            </div>
            <button className="hidden md:inline text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
              Upgrade
            </button>
          </div>
        </div>
      </TooltipProvider>
    );

}
