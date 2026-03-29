'use client';

import { useState } from 'react';
import {
  Folder,
  ImageIcon,
  Video,
  Edit2,
  Sparkles,
  Box,
  RotateCw,
  Upload,
  Search,
  Heart,
  Plus,
  LayoutGrid,
  List,
} from 'lucide-react';

type FilterCategory = 'All' | 'Favorites';
type ToolFilter = string;

const tools = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'edited', label: 'Edited', icon: Edit2 },
  { id: 'enhanced', label: 'Enhanced', icon: Sparkles },
  { id: '3d', label: '3D Object', icon: Box },
  { id: 'motion', label: 'Motion Transfer', icon: RotateCw },
  { id: 'upload', label: 'Uploaded', icon: Upload },
];

export default function AssetsPage() {
  const [category, setCategory] = useState<FilterCategory>('All');
  const [activeTools, setActiveTools] = useState<ToolFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleTool = (id: string) => {
    setActiveTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex w-full h-full text-white font-sans bg-[#09090b]">
      {/* Main Empty State Area */}
      <div className="flex-1 flex flex-col min-h-full">
        {/* Top Navbar */}
        <div className="h-12 w-full flex justify-between items-center px-6 border-b border-white/[0.05] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[13px] font-semibold text-white">Assets</h1>
            <span className="text-[11px] text-zinc-700">0 items</span>
          </div>
          {/* View toggle + zoom controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#111] rounded-lg border border-white/[0.06] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Zoom slider */}
            <div className="w-28 h-7 bg-[#111] rounded-lg flex items-center px-3 gap-2 border border-white/[0.06]">
              <div className="w-2.5 h-2.5 rounded-sm border border-zinc-600 flex-shrink-0" />
              <div className="flex-1 h-[2px] bg-zinc-800 relative rounded-full">
                <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-md" style={{ left: '50%' }} />
              </div>
              <div className="w-3 h-3 rounded border border-zinc-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Empty State Center */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <ImageIcon className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <h2 className="text-[16px] font-semibold mb-2 text-white">No assets yet</h2>
          <p className="text-zinc-600 text-[13px] text-center mb-6 max-w-[200px] leading-relaxed">
            Your generations will appear here. Get started by generating images.
          </p>
          <button className="bg-white text-black font-semibold text-[12px] px-6 py-2 rounded-full hover:bg-zinc-100 transition-colors">
            Generate images
          </button>
        </div>
      </div>

      {/* Right Sidebar — Filters */}
      <div className="w-[240px] border-l border-[#151515] flex flex-col bg-[#030305] flex-shrink-0">
        {/* Header */}
        <div className="h-12 flex items-center px-4 border-b border-white/[0.04]">
          <span className="text-[12px] font-semibold text-zinc-400">Filters</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 [&::-webkit-scrollbar]:hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-[#0d0d0f] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-[12px] text-zinc-400 placeholder:text-zinc-700 outline-none focus:border-white/10 transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setCategory('All')}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all ${
                category === 'All'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-zinc-500 hover:bg-[#0d0d0f] hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className={`w-3.5 h-3.5 ${category === 'All' ? 'text-blue-400' : 'text-zinc-600'}`} />
                <span className="text-[12px] font-medium">All</span>
              </div>
              {category === 'All' && (
                <div className="w-7 h-[14px] rounded-full bg-blue-600 relative flex-shrink-0">
                  <div className="w-[11px] h-[11px] rounded-full bg-white absolute top-[1.5px] right-[1.5px]" />
                </div>
              )}
            </button>

            <button
              onClick={() => setCategory('Favorites')}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all ${
                category === 'Favorites'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-zinc-500 hover:bg-[#0d0d0f] hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className={`w-3.5 h-3.5 ${category === 'Favorites' ? 'text-red-400 fill-red-400' : 'text-zinc-600'}`} />
                <span className="text-[12px] font-medium">Favorites</span>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.04]" />

          {/* Tools */}
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold px-1 mb-1">Tools</div>

            {tools.map((tool) => {
              const isToolActive = activeTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all ${
                    isToolActive
                      ? 'bg-[#151515] text-zinc-200'
                      : 'text-zinc-600 hover:bg-[#0d0d0f] hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <tool.icon className="w-3.5 h-3.5" />
                    <span className="text-[12px]">{tool.label}</span>
                  </div>
                  <div
                    className={`w-[13px] h-[13px] rounded bg-transparent border flex-shrink-0 transition-colors flex items-center justify-center ${
                      isToolActive ? 'border-blue-500 bg-blue-500' : 'border-zinc-800'
                    }`}
                  >
                    {isToolActive && (
                      <svg viewBox="0 0 10 10" className="w-2 h-2">
                        <polyline points="1.5,5.5 4,8 8.5,2.5" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.04]" />

          {/* Folders */}
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center px-1 mb-1">
              <div className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">Folders</div>
              <button className="w-5 h-5 rounded flex items-center justify-center text-zinc-700 hover:text-zinc-400 hover:bg-white/5 transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[11px] text-zinc-800 px-3 py-2 italic">No folders yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
