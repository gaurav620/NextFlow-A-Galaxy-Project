"use client";

import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Image as ImageIcon, Video, Wand2, Zap, PenTool, AudioLines, Sparkles, Folder, Network, Box, Film, Aperture, Fingerprint, Footprints, MicVocal, Accessibility, Compass, TriangleRight, Menu, PanelLeft, MoreHorizontal
} from 'lucide-react';

const BananaIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} {...props}>
    <path fill="currentColor" d="M12.215 5.534c.485.485.679 1.157.575 1.831-.083.542-.32 1.059-.75 1.488-.86.86-2.253.86-3.111 0l-3.393-3.393a.964.964 0 0 1 0-1.363l3.393-3.393a2.203 2.203 0 0 1 3.111 0c.348.348.601.815.688 1.341a2.222 2.222 0 0 1-.513 1.489z" opacity="0.3"></path>
    <path fill="currentColor" d="M19.06 6.353a.964.964 0 0 0-1.363 0l-8.485 8.486c-.86.86-.86 2.253 0 3.111.43.43.946.666 1.488.75.675.105 1.347-.09 1.832-.575a2.222 2.222 0 0 0 .513-1.489c-.087-.525-.34-.992-.688-1.34L19.06 7.716a.964.964 0 0 0 0-1.363z"></path>
    <path fill="#eab308" d="M6.333 17.666A11.956 11.956 0 0 1 4 12C4 5.373 9.373 0 16 0A12.012 12.012 0 0 1 6.333 17.666z"></path>
  </svg>
);

const ColorWheelIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2a10 10 0 0 1 10 10h-10V2z" fill="#f87171" />
    <path d="M22 12a10 10 0 0 1-10 10v-10h10z" fill="#3b82f6" />
    <path d="M12 22a10 10 0 0 1-10-10h10v10z" fill="#10b981" />
    <path d="M2 12A10 10 0 0 1 12 2v10H2z" fill="#facc15" />
  </svg>
);

const NodeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="6" cy="6" r="3" fill="currentColor" />
    <circle cx="18" cy="18" r="3" fill="currentColor" />
    <path d="M7.5 7.5 L16.5 16.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const MotionIcon = (props: any) => (
   <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
     <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8.5 24v-8.5L7 17.5l-1.5-1.5L9 12V6h6v6l3.5 4-1.5 1.5-1.5-2V24h-2v-6h-1v6h-2Z"/>
   </svg>
);

const mainLinks = [
  { href: '/dashboard', label: 'Home', icon: Home, boxClass: 'bg-white', iconClass: 'text-black fill-current w-[14px] h-[14px]' },
  { href: '/dashboard/train', label: 'Train Lora', customIcon: ColorWheelIcon, boxClass: 'bg-[#1C1C1C]', iconClass: 'w-[16px] h-[16px] text-white/10' },
  { href: '/dashboard/workflows', label: 'Node Editor', customIcon: NodeIcon, boxClass: 'bg-[#0076FF]', iconClass: 'text-white w-[14px] h-[14px]' },
  { href: '/dashboard/assets', label: 'Assets', icon: Folder, boxClass: 'bg-transparent', iconClass: 'text-[#4CB5FF] fill-current w-[20px] h-[20px] -ml-0.5' },
];

const defaultTools = [
  { href: '/dashboard/image', label: 'Image', icon: ImageIcon, boxClass: 'bg-white', iconClass: 'text-[#0076FF] w-[14px] h-[14px]' },
  { href: '/dashboard/video', label: 'Video', icon: Video, boxClass: 'bg-gradient-to-br from-[#FFC800] to-[#FF8C00]', iconClass: 'text-white fill-current w-[12px] h-[12px]' },
  { href: '/dashboard/enhancer', label: 'Enhancer', icon: Sparkles, boxClass: 'bg-[#1C1C1C]', iconClass: 'text-white/90 w-[14px] h-[14px]' },
  { href: '/dashboard/nano', label: 'Nano Banana', customIcon: BananaIcon, boxClass: 'bg-[#FAC213]', iconClass: 'w-[16px] h-[16px]' }, 
  { href: '/dashboard/realtime', label: 'Realtime', icon: PenTool, boxClass: 'bg-[#00A1FF]', iconClass: 'text-white w-[14px] h-[14px]' },
  { href: '/dashboard/edit', label: 'Edit', icon: Compass, boxClass: 'bg-[#8E24AA]', iconClass: 'text-white w-[14px] h-[14px]' },
];

const moreTools = [
  { href: '/dashboard/lipsync', label: 'Video Lipsync', icon: MicVocal, boxClass: 'bg-[#1C1C1C]', iconClass: 'text-white/80 w-[14px] h-[14px]' },
  { href: '/dashboard/motion', label: 'Motion Transfer', customIcon: MotionIcon, boxClass: 'bg-[#DFFF00]', iconClass: 'text-black w-[14px] h-[14px]' },
  { href: '/dashboard/3d', label: '3D Objects', icon: Box, boxClass: 'bg-white', iconClass: 'text-[#111] fill-current w-[14px] h-[14px]' },
  { href: '/dashboard/video-restyle', label: 'Video Restyle', icon: Film, boxClass: 'bg-[#F57C00]', iconClass: 'text-white w-[14px] h-[14px]' },
];

const RenderIcon = ({ item }: { item: any }) => {
  if (item.label === 'Assets') {
    const Icon = item.icon;
    return <Icon className={item.iconClass} strokeWidth={2} />;
  }
  return (
    <div className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0 shadow-sm border border-white/5 ${item.boxClass}`}>
      {item.customIcon 
        ? <item.customIcon className={item.iconClass} /> 
        : <item.icon className={item.iconClass} strokeWidth={item.label === 'Home' ? 2 : 2.5} />}
    </div>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Clone specific states
  const [isCollapsed, setIsCollapsed] = useState(true);
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
    <div className={`h-full flex flex-col pt-3 pb-5 bg-black z-[60] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[64px] items-center px-1' : 'w-[240px] px-3'}`}>
      
      {/* Top Toggle Button */}
      <div className={`flex items-center mb-6 mt-1 ${isCollapsed ? 'justify-center w-full' : 'px-3'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`group flex items-center w-full transition-all duration-200 ${isCollapsed ? 'justify-center' : 'gap-3 hover:bg-white/[0.04] p-1.5 -ml-1.5 rounded-xl'}`}
          title="Toggle Sidebar"
        >
          <div className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)] flex-shrink-0 transition-transform group-hover:scale-[1.05]">
            <span className="text-black font-black text-[15px] font-sans tracking-tighter">N</span>
          </div>
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
               <span className="text-white font-bold text-[15px] tracking-wide">NextFlow</span>
               <PanelLeft className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </button>
      </div>

      {/* Primary Links */}
      <nav className={`flex flex-col gap-0.5 w-full ${isCollapsed ? 'items-center' : ''}`}>
        {mainLinks.map((item) => {
          const active = isActive(item.href);
          return (
            <div key={item.label} className="relative group w-full">
              <Link
                href={item.href}
                className={`flex items-center transition-all duration-200 ${
                  isCollapsed 
                    ? `w-[38px] h-[38px] rounded-xl justify-center ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`
                    : `w-full h-[38px] px-3 rounded-lg gap-3 ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'}`
                }`}
              >
                <RenderIcon item={item} />
                {!isCollapsed && <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="fixed left-[64px] px-3 py-1.5 bg-[#1C1C1C] border border-white/10 text-white text-[12px] font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Tools Section */}
      <div className="mt-8 w-full flex flex-col">
        {!isCollapsed && (
          <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2">Tools</span>
        )}
        <nav className={`flex flex-col gap-0.5 w-full ${isCollapsed ? 'items-center' : ''}`}>
          {defaultTools.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.label} className="relative group w-full">
                <Link
                  href={item.href}
                  className={`flex items-center transition-all duration-200 ${
                    isCollapsed 
                      ? `w-[38px] h-[38px] rounded-xl justify-center ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`
                      : `w-full h-[38px] px-3 rounded-lg gap-3 ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'}`
                  }`}
                >
                  <RenderIcon item={item} />
                  {!isCollapsed && <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>}
                </Link>
                {isCollapsed && (
                  <div className="fixed left-[64px] px-3 py-1.5 bg-[#1C1C1C] border border-white/10 text-white text-[12px] font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}

          <AnimatePresence>
            {showMoreTools && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-0.5"
              >
                {moreTools.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <div key={item.label} className="relative group w-full">
                      <Link
                        href={item.href}
                        className={`flex items-center transition-all duration-200 ${
                          isCollapsed 
                            ? `w-[38px] h-[38px] rounded-xl justify-center ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}`
                            : `w-full h-[38px] px-3 rounded-lg gap-3 ${active ? 'bg-[#1C1C1C] text-white shadow-inner' : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'}`
                        }`}
                      >
                        <RenderIcon item={item} />
                        {!isCollapsed && <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>}
                      </Link>
                      {isCollapsed && (
                        <div className="fixed left-[64px] px-3 py-1.5 bg-[#1C1C1C] border border-white/10 text-white text-[12px] font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] shadow-xl whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowMoreTools(!showMoreTools)}
            className={`flex items-center transition-all duration-200 ${
              isCollapsed 
                ? 'w-[38px] h-[38px] rounded-xl justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                : 'w-full h-10 px-3 rounded-lg gap-3 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] mt-1'
            }`}
          >
            <MoreHorizontal className="w-[18px] h-[18px] flex-shrink-0" />
            {!isCollapsed && <span className="text-[13.5px] font-medium">{showMoreTools ? 'Less' : 'More'}</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex flex-col w-full relative z-50">
        
        {!isCollapsed && (
          <div className="px-5 mb-2 mt-4 flex flex-col">
             <div className="flex flex-col mb-4">
                <span className="text-[13px] font-semibold text-zinc-600 mb-2 mt-4 tracking-tight">Sessions</span>
             </div>
             
             {/* Bottom Links */}
             <div className="flex flex-col gap-3 mt-4">
               <Link href="/dashboard/pricing" className="text-[13px] text-white hover:text-zinc-300 font-medium transition-colors w-max tracking-tight">
                  Earn 3,000 Credits
               </Link>
               <Link href="/dashboard/pricing" className="w-full relative py-[10px] rounded-[10px] overflow-hidden group shadow-[0_4px_16px_rgba(0,85,255,0.2)] block active:scale-[0.98] transition-transform">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-blue-600 to-blue-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40"></div>
                  <span className="relative z-10 text-[14px] font-medium text-white tracking-wide text-center flex justify-center w-full drop-shadow-md">
                    Upgrade
                  </span>
               </Link>
             </div>
          </div>
        )}

        {/* Profile */}
        <div className={`mt-2 mb-3 ${isCollapsed ? 'flex flex-col items-center gap-3' : 'px-4'}`}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className={`flex items-center relative gap-3 rounded-[12px] hover:bg-white/[0.04] transition-colors ${
               isCollapsed ? 'w-[38px] h-[38px] justify-center' : 'w-full p-1.5 justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-[34px] h-[34px] flex-shrink-0 rounded-[8px] bg-[#222222] flex items-center justify-center text-[#cccccc]">
                 <span className="text-[14px] font-medium">
                   {user?.firstName ? user.firstName[0].toUpperCase() : 'P'}
                 </span>
               </div>
               {!isCollapsed && (
                  <div className="flex flex-col items-start overflow-hidden">
                     <span className="text-[13.5px] text-white font-medium whitespace-nowrap truncate w-full text-left tracking-tight">
                        {user?.fullName || 'preciselovingseal'}
                     </span>
                     <span className="text-[12.5px] text-zinc-500 tracking-tight">Free</span>
                  </div>
               )}
            </div>
            
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
                className={`absolute bottom-[60px] ${isCollapsed ? 'left-[64px]' : 'left-3'} w-[240px] bg-[#111] border border-white/[0.08] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden z-[9999]`}
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
                     Pricing
                   </Link>
                   <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="px-3 py-2 text-[13px] text-zinc-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors">
                     Settings
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

          {/* Bottom Sidebar Collapse Toggle */}
          <button
             onClick={() => setIsCollapsed(!isCollapsed)}
             className={`hidden md:flex items-center justify-center text-zinc-500 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.04] ${isCollapsed ? 'mt-2 mb-2' : 'absolute bottom-3 right-4'}`}
             title="Toggle Sidebar"
          >
             {isCollapsed ? <TriangleRight className="w-4 h-4 fill-current rotate-0" /> : <TriangleRight className="w-4 h-4 fill-current rotate-180" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-screen h-screen bg-[#000000] overflow-hidden font-sans">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex h-full border-r border-white/[0.03] shadow-2xl z-[60]">
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
      <div className="flex-1 w-full h-full relative overflow-y-auto bg-[#000000] md:pt-0 pt-14 flex flex-col">
        {children}
      </div>
      
    </div>
  );
}
