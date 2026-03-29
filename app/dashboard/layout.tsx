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
  History,
  RotateCcw,
  Brain,
  ChevronRight,
  Clock,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [workflowRuns] = useState<
    Array<{
      id: string;
      status: 'success' | 'failed' | 'running';
      timestamp: string;
      duration: string;
    }>
  >([]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'running':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950">
      {/* LEFT SIDEBAR */}
      <div className="flex flex-col h-full w-64 bg-gray-900 border-r border-gray-800">
        {/* Logo Row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-white font-bold text-lg">NextFlow</span>
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 w-full px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Quick Access Label */}
        <div className="text-xs text-gray-500 uppercase tracking-widest px-4 py-2 mt-1">
          Quick Access
        </div>

        {/* Node Buttons */}
        <div className="flex-1 overflow-y-auto">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-gray-800 cursor-grab active:cursor-grabbing text-gray-300 hover:text-white transition-all"
              >
                <Icon className={`w-5 h-5 ${node.color}`} />
                <span className="text-sm">{node.label}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Account Section */}
        <div className="mt-auto border-t border-gray-800 p-4 flex items-center gap-3">
          <UserButton />
          <span className="text-gray-400 text-sm">Account</span>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* RIGHT SIDEBAR */}
      <div className="flex flex-col h-full w-72 bg-gray-900 border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-200">
              Workflow History
            </span>
          </div>
          <button className="text-gray-600 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {workflowRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Brain className="w-10 h-10 text-gray-800 mb-3" />
              <p className="text-gray-500 text-sm font-medium text-center">
                No runs yet
              </p>
              <p className="text-gray-600 text-xs text-center mt-1">
                Run a workflow to see history
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {workflowRuns.map((run) => (
                <div
                  key={run.id}
                  className="bg-gray-800/40 hover:bg-gray-800/70 rounded-xl p-3 cursor-pointer border border-transparent hover:border-gray-700 transition-all"
                >
                  {/* Row 1: Status and Chevron */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          run.status
                        )}`}
                      />
                      <span className="text-xs text-gray-300 font-medium">
                        {getStatusLabel(run.status)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </div>

                  {/* Row 2: Scope and Timestamp */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Full Run</span>
                    <span className="text-xs text-gray-600">{run.timestamp}</span>
                  </div>

                  {/* Row 3: Duration */}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-600">{run.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
