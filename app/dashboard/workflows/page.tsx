'use client';

import { useState, useEffect } from 'react';
import { Grid3x3, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkflowsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch('/api/workflow');
        const data = await res.json();
        if (data.success) {
          setWorkflows(data.workflows);
        }
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflows();
  }, []);

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'apps', label: 'Apps' },
    { id: 'examples', label: 'Examples' },
    { id: 'templates', label: 'Templates' },
  ];

  const handleNewWorkflow = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Untitled Workflow',
          data: { nodes: [], edges: [] }
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/workflows/${data.workflow.id}`);
      } else {
        alert('Failed to create workflow');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* HERO SECTION */}
      <div
        className="w-full h-80 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #1a1a2e 0%, #0a0a0a 100%)',
        }}
      >
        {/* Optional: Subtle canvas effect overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#333"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="1200" height="300" fill="url(#grid)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-8 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 text-blue-500 flex items-center justify-center">
              <Grid3x3 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Node Editor</h1>
          </div>

          <p className="text-sm text-gray-400 mt-2 max-w-xs leading-relaxed">
            Nodes is the most powerful way to operate NextFlow. Connect every
            tool and model into complex automated LLM pipelines.
          </p>

          <button
            onClick={handleNewWorkflow}
            disabled={isCreating}
            className="mt-4 border border-white/30 hover:border-white/60 text-white text-sm rounded-full px-5 py-2 flex items-center gap-2 w-fit hover:bg-white/5 transition-all disabled:opacity-50"
          >
             {isCreating ? 'Creating...' : 'New Workflow'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="px-6 flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white pb-3'
                  : 'text-gray-500 hover:text-gray-300 pb-3'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[calc(100vh-380px)]">
        {activeTab === 'projects' && (
          <>
            isLoading ? (
              <div className="flex items-center justify-center mt-24">
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : workflows.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center mt-24">
                <div className="w-12 h-12 text-blue-500 mx-auto">
                  <Grid3x3 className="w-12 h-12" />
                </div>
                <h2 className="text-lg font-medium text-white mt-4">
                  No Workflows Yet
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  You haven&apos;t created any workflows yet.
                </p>
                <p className="text-sm text-gray-500">
                  Get started by creating your first one.
                </p>
                <button
                  onClick={handleNewWorkflow}
                  disabled={isCreating}
                  className="mt-6 border border-white/20 text-white text-sm rounded-full px-6 py-2.5 hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'New Workflow'}
                </button>
              </div>
            ) : (
              // Workflows Grid
              <div className="grid grid-cols-3 gap-4 p-6">
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/dashboard/workflows/${workflow.id}`}
                  >
                    <div className="bg-[#1a1a1a] hover:bg-[#222] rounded-2xl overflow-hidden cursor-pointer transition-all border border-transparent hover:border-white/10 group">
                      {/* Thumbnail */}
                      <div className="h-36 bg-[#111] relative flex items-center justify-center overflow-hidden">
                        <Grid3x3 className="w-8 h-8 text-gray-600 group-hover:text-gray-500 transition-colors" />
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-white truncate">
                          {workflow.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </p>
                        {workflow.status && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-400">
                              {workflow.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'apps' && (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="text-gray-400">Apps coming soon</p>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="text-gray-400">Examples coming soon</p>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="text-gray-400">Templates coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
