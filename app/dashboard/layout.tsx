'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import {
  Zap,
  ChevronLeft,
  Search,
  Type,
  ImageIcon,
  Video,
  BrainCircuit,
  Scissors,
  Film,
  Menu,
  X,
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nodeTypes = [
    {
      type: 'textNode',
      icon: Type,
      label: 'Text Node',
      color: 'text-blue-400',
    },
    {
      type: 'imageUploadNode',
      icon: ImageIcon,
      label: 'Upload Image',
      color: 'text-green-400',
    },
    {
      type: 'videoUploadNode',
      icon: Video,
      label: 'Upload Video',
      color: 'text-orange-400',
    },
    {
      type: 'llmNode',
      icon: BrainCircuit,
      label: 'Run LLM',
      color: 'text-purple-400',
    },
    {
      type: 'cropImageNode',
      icon: Scissors,
      label: 'Crop Image',
      color: 'text-pink-400',
    },
    {
      type: 'extractFrameNode',
      icon: Film,
      label: 'Extract Frame',
      color: 'text-yellow-400',
    },
  ];

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    e.dataTransfer.setData('nodeType', nodeType);
  };

  const SidebarContent = ({ collapsed }: { collapsed: boolean }) => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full">
        {/* Logo Row */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4`}>
          <div className={`flex items-center gap-2 ${collapsed ? '' : ''}`}>
            <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
            {!collapsed && <span className="text-foreground font-bold text-lg">NextFlow</span>}
          </div>
          {!collapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="absolute -right-3 top-5 bg-secondary border border-border rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-3 h-3 rotate-180" />
            </button>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input rounded-lg text-sm text-foreground placeholder-muted-foreground w-full px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Quick Access Label */}
        {!collapsed && (
          <div className="text-xs text-muted-foreground uppercase tracking-widest px-4 py-2 mt-1">
            Quick Access
          </div>
        )}

        {/* Node Buttons */}
        <div className="flex-1 overflow-y-auto">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            const nodeButton = (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2 py-3 mx-1' : 'px-4 py-3 mx-2'} rounded-xl hover:bg-secondary cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-all`}
              >
                <Icon className={`w-5 h-5 ${node.color} flex-shrink-0`} />
                {!collapsed && <span className="text-sm">{node.label}</span>}
              </div>
            );

            if (collapsed) {
              return (
                <Tooltip key={node.type}>
                  <TooltipTrigger asChild>{nodeButton}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                    {node.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return nodeButton;
          })}
        </div>

        {/* Bottom Account Section */}
        <div className={`mt-auto border-t border-border p-4 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <UserButton />
          {!collapsed && <span className="text-muted-foreground text-sm">Account</span>}
        </div>
      </div>
    </TooltipProvider>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Mobile Bottom Sheet Trigger */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Bottom Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span className="text-foreground font-bold">Nodes</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3 overflow-y-auto">
              {nodeTypes.map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => {
                      handleDragStart(e, node.type);
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 cursor-grab active:cursor-grabbing transition-all"
                  >
                    <Icon className={`w-6 h-6 ${node.color}`} />
                    <span className="text-xs text-foreground text-center">{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR - Desktop */}
      <div
        className={`hidden md:flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out relative ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </div>

      {/* CENTER */}
      <div className="flex-1 overflow-hidden w-full">{children}</div>

      {/* RIGHT SIDEBAR - Hidden on mobile */}
      <div className="hidden md:flex flex-col h-full w-72 bg-card border-l border-border">
        <HistorySidebar />
      </div>
    </div>
  );
}
