'use client';

import { useState, useMemo } from 'react';
import { useAssetStore } from '@/store/assets';
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
  LayoutGrid,
  List,
  Download,
  Copy,
  Trash2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type FilterCategory = 'All' | 'Favorites';
type ToolFilter = string;

const tools = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'edited', label: 'Edited', icon: Edit2 },
  { id: 'enhancer', label: 'Enhanced', icon: Sparkles },
  { id: '3d', label: '3D Object', icon: Box },
  { id: 'motion', label: 'Motion Transfer', icon: RotateCw },
  { id: 'upload', label: 'Uploaded', icon: Upload },
];

export default function AssetsPage() {
  const { assets, toggleFavorite, removeAsset } = useAssetStore();
  const [category, setCategory] = useState<FilterCategory>('All');
  const [activeTools, setActiveTools] = useState<ToolFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Custom states
  const [zoomLevel, setZoomLevel] = useState(50); // 0 = minimal, 100 = large

  const toggleTool = (id: string) => {
    setActiveTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `krea-asset-${name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. Search Query
      if (searchQuery && !asset.prompt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      // 2. Category (Favorites)
      if (category === 'Favorites' && !asset.isFavorite) return false;
      // 3. Tool Filters
      if (activeTools.length > 0 && !activeTools.includes(asset.tool)) return false;
      
      return true;
    });
  }, [assets, searchQuery, category, activeTools]);

  return (
    <div className="flex w-full h-full text-white font-sans bg-[#070707] relative overflow-hidden">
      {/* Background cinematic glow */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#070707] to-transparent pointer-events-none z-0" />

      {/* Main Asset Gallery Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full min-w-0">
        {/* Top Navbar */}
        <div className="h-16 w-full flex justify-between items-center px-8 border-b border-white/[0.05] flex-shrink-0 bg-[#070707]/80 backdrop-blur-3xl z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[17px] font-semibold text-white tracking-tight">Assets</h1>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[13px] text-zinc-500 font-medium">{filteredAssets.length}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
                <span className="text-zinc-600">
                    <Maximize2 className="w-3.5 h-3.5" />
                </span>
                <input
                    type="range" min={0} max={100} value={zoomLevel}
                    onChange={e => setZoomLevel(Number(e.target.value))}
                    className="w-24 h-1 appearance-none bg-zinc-800 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:hover:bg-white cursor-grab active:cursor-grabbing"
                    style={{ background: `linear-gradient(to right, #ffffff 0%, #ffffff ${zoomLevel}%, #27272a ${zoomLevel}%, #27272a 100%)` }}
                />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.05] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'text-white bg-white/10 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'text-white bg-white/10 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden w-full h-full relative">
          <AnimatePresence mode="popLayout">
            {filteredAssets.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="w-full h-full flex flex-col items-center justify-center -mt-16"
                >
                <div className="w-16 h-16 rounded-[20px] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                    <Folder className="w-7 h-7 text-zinc-600" />
                </div>
                <h2 className="text-[20px] font-semibold mb-3 text-white tracking-tight">No assets yet</h2>
                <p className="text-zinc-500 text-[14px] text-center max-w-[280px] leading-relaxed mb-6">
                    {assets.length === 0 
                    ? "Generate images, videos, and objects to build your library." 
                    : "No assets match your current filters."}
                </p>
                {assets.length === 0 && (
                    <button 
                       onClick={() => window.location.href = '/dashboard/image'}
                       className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full font-bold text-[14px] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-0.5 mt-2"
                    >
                        Generate Images
                    </button>
                )}
                </motion.div>
            ) : (
                <div className={`grid gap-4 w-full auto-rows-[minmax(180px,auto)] ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                {filteredAssets.map((asset) => (
                    <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={asset.id} 
                    className={`group relative rounded-[20px] overflow-hidden bg-[#111] border border-transparent hover:border-white/20 transition-all duration-300 flex ${
                        viewMode === 'grid' 
                        ? asset.ratio === '16:9' ? 'col-span-2 row-span-1' : asset.ratio === '9:16' ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1 aspect-square'
                        : 'flex h-36 border border-white/5 bg-[#0a0a0c]'
                    }`}
                    >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full h-full'}`}>
                        <img 
                            src={asset.url} 
                            alt={asset.prompt} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                        />
                        {/* Hover Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    
                    {/* Minimal Internal Tags (Visible on Hover in Grid, Always in List maybe) */}
                    <div className={`absolute top-0 inset-x-0 p-3 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${viewMode === 'list' ? 'left-48' : ''}`}>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] uppercase font-bold text-white tracking-widest border border-white/10">
                                {asset.tool}
                            </span>
                            <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] uppercase font-bold text-white tracking-widest border border-white/10">
                                {asset.ratio}
                            </span>
                        </div>
                    </div>

                    {/* Interaction Actions */}
                    <div className={`absolute bottom-0 inset-x-0 p-3 flex justify-end items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 ${viewMode === 'list' ? 'left-48' : ''}`}>
                        <button 
                            onClick={() => handleCopy(asset.prompt)}
                            title="Copy Prompt"
                            className="w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-xl transition-all border border-white/10 text-white"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => toggleFavorite(asset.id)}
                            className="w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-xl transition-all border border-white/10"
                        >
                            <Heart className={`w-4 h-4 ${asset.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                        <button 
                            onClick={() => handleDownload(asset.url, asset.id)}
                            title="Download"
                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-zinc-200 text-black rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => { removeAsset(asset.id); toast.success('Asset deleted'); }}
                            className="w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-red-500/80 backdrop-blur-md rounded-xl transition-all border border-white/10 text-white"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* List Mode Info Area */}
                    {viewMode === 'list' && (
                        <div className="flex-1 p-5 flex flex-col justify-center">
                            <p className="text-white text-[15px] font-medium line-clamp-2 max-w-xl leading-relaxed">{asset.prompt}</p>
                            <div className="flex items-center gap-3 text-[12px] text-zinc-500 mt-2 font-medium">
                            <span className="capitalize text-zinc-400">{asset.tool}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span>{asset.ratio}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span>{new Date(asset.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}
                    </motion.div>
                ))}
                </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar — Krea Style Filters */}
      <div className="w-[300px] border-l border-white/[0.04] flex flex-col bg-[#070707] flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-transparent">
          <span className="text-[13px] font-bold text-white tracking-wide">Library Filters</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden">
          {/* Edge-to-edge Search */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#0055ff] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-white/[0.03] border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="w-full h-[1px] bg-white/[0.03]" />

          {/* Core Categories */}
          <div className="flex flex-col gap-1">
            {[
                { id: 'All', icon: Folder, count: assets.length },
                { id: 'Favorites', icon: Heart, count: assets.filter(a => a.isFavorite).length }
            ].map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as FilterCategory)}
                    className={`flex justify-between items-center w-full px-4 py-3 rounded-2xl transition-all ${
                        category === cat.id
                        ? 'bg-[#0070f3] text-white shadow-[0_4px_14px_0_rgba(0,112,243,0.39)]'
                        : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <cat.icon className={`w-4 h-4 ${category === cat.id ? 'fill-current opacity-80' : ''}`} />
                        <span className="text-[14px] font-medium">{cat.id === 'All' ? 'All assets' : cat.id}</span>
                    </div>
                    {cat.count > 0 && <span className={`text-[12px] font-semibold ${category === cat.id ? 'text-blue-100' : 'text-zinc-600'}`}>{cat.count}</span>}
                </button>
            ))}
          </div>

          <div className="w-full h-[1px] bg-white/[0.03]" />

          {/* Tools */}
          <div className="flex flex-col gap-1">
            <div className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold px-2 py-2">Tools</div>

            {tools.map((tool) => {
              const isToolActive = activeTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`flex justify-between items-center w-full px-4 py-3 rounded-[14px] transition-all ${
                    isToolActive
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className={`w-[18px] h-[18px]`} />
                    <span className="text-[14px] font-medium">{tool.label}</span>
                  </div>
                  {isToolActive && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
