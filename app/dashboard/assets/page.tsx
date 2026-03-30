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
  Plus,
  LayoutGrid,
  List,
  Download,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';

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
      link.download = `nextflow-asset-${name}.jpg`;
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
    <div className="flex w-full h-full text-white font-sans bg-[#09090b]">
      {/* Main Asset Gallery Area */}
      <div className="flex-1 flex flex-col min-h-full h-full overflow-hidden">
        {/* Top Navbar */}
        <div className="h-12 w-full flex justify-between items-center px-6 border-b border-white/[0.05] flex-shrink-0 bg-[#09090b] z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-[13px] font-semibold text-white">Assets</h1>
            <span className="text-[11px] text-zinc-700 font-medium">{filteredAssets.length} items</span>
          </div>
          {/* View toggle + zoom controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#111] rounded-lg border border-white/[0.06] overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden">
          {filteredAssets.length === 0 ? (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                <ImageIcon className="w-5 h-5 text-zinc-600" />
              </div>
              <h2 className="text-[16px] font-semibold mb-2 text-white">No assets found</h2>
              <p className="text-zinc-500 text-[13px] text-center max-w-[220px] leading-relaxed">
                {assets.length === 0 
                  ? "Your generated masterpieces will automatically appear here." 
                  : "No assets match your current filters."}
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 auto-rows-[minmax(180px,auto)] ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              {filteredAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  className={`group relative rounded-xl overflow-hidden bg-[#111] border border-white/5 hover:border-white/20 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? asset.ratio === '16:9' ? 'col-span-2 row-span-1' : asset.ratio === '9:16' ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1 aspect-square'
                      : 'flex h-32'
                  }`}
                >
                  <img 
                    src={asset.url} 
                    alt={asset.prompt} 
                    className={`object-cover w-full h-full ${viewMode === 'list' ? 'w-32 shrink-0' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between ${viewMode === 'list' ? 'left-32' : ''}`}>
                    {/* Top Row: Actions */}
                    <div className="flex justify-end p-3 gap-2">
                       <button 
                         onClick={() => toggleFavorite(asset.id)}
                         className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg transition-transform hover:scale-105"
                       >
                         <Heart className={`w-3.5 h-3.5 ${asset.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                       </button>
                       <button 
                         onClick={() => removeAsset(asset.id)}
                         className="p-2 bg-black/40 hover:bg-red-500/80 backdrop-blur-md rounded-lg transition-transform hover:scale-105 text-white"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>

                    {/* Bottom Row: Prompt & Tools */}
                    <div className="p-4 flex items-end gap-3">
                      <div className="flex-1 truncate">
                        <p className="text-white text-[12px] font-medium truncate mb-1 bg-black/20 max-w-max px-2 py-0.5 rounded backdrop-blur-sm">
                          {asset.tool.toUpperCase()} • {asset.ratio}
                        </p>
                        <p className="text-zinc-300 text-[11px] truncate flex-1 leading-relaxed">
                          {asset.prompt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                         <button 
                           title="Copy Prompt"
                           onClick={() => handleCopy(asset.prompt)}
                           className="p-2 bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-lg transition-all"
                         >
                           <Copy className="w-3.5 h-3.5" />
                         </button>
                         <button 
                           title="Download"
                           onClick={() => handleDownload(asset.url, asset.id)}
                           className="p-2 bg-white text-black hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] backdrop-blur-md rounded-lg transition-all"
                         >
                           <Download className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                  </div>

                  {/* Base Info (Only visible in list mode when NOT hovering) */}
                  {viewMode === 'list' && (
                    <div className="flex-1 p-4 flex justify-between items-center group-hover:opacity-0 transition-opacity">
                       <div>
                         <p className="text-white text-[14px] font-medium line-clamp-2 max-w-xl leading-relaxed">{asset.prompt}</p>
                         <div className="flex items-center gap-3 text-[12px] text-zinc-500 mt-2 font-medium">
                           <span className="capitalize">{asset.tool}</span>
                           <span>•</span>
                           <span>{asset.ratio}</span>
                           <span>•</span>
                           <span>{new Date(asset.timestamp).toLocaleDateString()}</span>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar — Filters */}
      <div className="w-[240px] border-l border-white/[0.05] flex flex-col bg-[#030305] flex-shrink-0 z-20">
        <div className="h-12 flex items-center px-5 border-b border-white/[0.04]">
          <span className="text-[12px] font-semibold text-zinc-400">Filters</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 [&::-webkit-scrollbar]:hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2.5 text-[12px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setCategory('All')}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all ${
                category === 'All'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Folder className={`w-4 h-4 ${category === 'All' ? 'text-blue-400' : 'text-zinc-600'}`} />
                <span className="text-[12px] font-medium">All Assets</span>
              </div>
            </button>

            <button
              onClick={() => setCategory('Favorites')}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all ${
                category === 'Favorites'
                  ? 'bg-red-500/10 text-red-400'
                  : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className={`w-4 h-4 ${category === 'Favorites' ? 'fill-red-400 text-red-400' : 'text-zinc-600'}`} />
                <span className="text-[12px] font-medium">Favorites</span>
              </div>
            </button>
          </div>

          <div className="border-t border-white/[0.04]" />

          {/* Tools */}
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold px-1 mb-2">Tools Filter</div>

            {tools.map((tool) => {
              const isToolActive = activeTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg transition-all ${
                    isToolActive
                      ? 'bg-white/[0.06] text-white'
                      : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className={`w-4 h-4 ${isToolActive ? "text-blue-400" : "text-zinc-600"}`} />
                    <span className="text-[12px] font-medium">{tool.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-all ${
                      isToolActive ? 'border-blue-500 bg-blue-500' : 'border-zinc-700 bg-transparent'
                    }`}
                  >
                    {isToolActive && (
                      <Check className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
