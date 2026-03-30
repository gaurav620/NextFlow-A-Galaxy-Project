'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  LayoutDashboard,
  User,
  Lock,
  Palette,
  Tag,
  Users,
  Settings2,
  Package,
  CreditCard,
  Code2,
  X,
  ChevronRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'GENERAL' },
  { id: 'profile', label: 'Profile', icon: User, group: 'GENERAL' },
  { id: 'account', label: 'Account', icon: Lock, group: 'GENERAL' },
  { id: 'appearance', label: 'Appearance', icon: Palette, group: 'GENERAL' },
  { id: 'promo', label: 'Promo', icon: Tag, group: 'GENERAL' },
  { id: 'members', label: 'Members', icon: Users, group: 'WORKSPACE' },
  { id: 'workspace-settings', label: 'Settings', icon: Settings2, group: 'WORKSPACE' },
  { id: 'compute-packs', label: 'Compute Packs', icon: Package, group: 'BILLING' },
  { id: 'billing', label: 'Billing', icon: CreditCard, group: 'BILLING' },
  { id: 'api-tokens', label: 'API Tokens', icon: Code2, group: 'DEVELOPER' },
];

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [active, setActive] = useState('overview');

  const grouped = ['GENERAL', 'WORKSPACE', 'BILLING', 'DEVELOPER'];

  return (
    <div className="flex w-full h-full bg-[#09090b] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-[220px] border-r border-white/[0.06] flex flex-col flex-shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/[0.05]">
          <span className="text-[13px] font-semibold text-white">Settings</span>
          <Link href="/dashboard" className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>

        <div className="flex-1 p-2">
          {grouped.map((group) => (
            <div key={group} className="mb-4">
              <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold px-2 mb-1">{group}</div>
              {sections.filter((s) => s.group === group).map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] font-medium transition-all ${
                      active === s.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-8">
        {active === 'overview' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Overview</h2>

            {/* Active Workspace */}
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold">Active Workspace</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Switch between your workspaces to view different accounts</p>
                </div>
                <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/[0.06] rounded-lg px-3 py-1.5 text-[12px] text-zinc-300 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="w-4 h-4 rounded bg-zinc-700 flex items-center justify-center text-[9px] font-medium">D</div>
                  Default Workspace
                  <ChevronRight className="w-3 h-3 text-zinc-600" />
                </div>
              </div>
            </div>

            {/* Workspace Card */}
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[14px] font-medium text-zinc-300">D</div>
                <div>
                  <p className="text-[14px] font-semibold">Default Workspace</p>
                  <p className="text-[11px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full inline-block mt-1">Free</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#1a1a1a] border border-white/[0.06] hover:border-white/10 rounded-lg text-[12px] text-zinc-300 transition-colors">
                  Manage Workspace
                </button>
                <button className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade
                </button>
              </div>
            </div>

            {/* Compute */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">FREE COMPUTE</p>
                <p className="text-[40px] font-black leading-none text-white mb-1">17</p>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
                  <span>Daily Allowance</span>
                  <span>17 / 100</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '17%' }} />
                </div>
              </div>
              <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">ONE-TIME COMPUTE</p>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[40px] font-black leading-none text-white">0</p>
                  <button className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Buy
                  </button>
                </div>
                <p className="text-[11px] text-zinc-600">No compute packs purchased</p>
              </div>
            </div>
          </div>
        )}

        {active === 'profile' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Profile</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-semibold text-zinc-300">
                  {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div>
                  <p className="text-[14px] font-semibold">{user?.fullName ?? 'User'}</p>
                  <p className="text-[12px] text-zinc-500">{user?.emailAddresses?.[0]?.emailAddress ?? ''}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1.5">Display Name</label>
                  <input
                    defaultValue={user?.fullName ?? ''}
                    className="w-full bg-[#0d0d0f] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-white/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1.5">Email</label>
                  <input
                    defaultValue={user?.emailAddresses?.[0]?.emailAddress ?? ''}
                    disabled
                    className="w-full bg-[#0d0d0f] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-zinc-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors">
                Save changes
              </button>
            </div>
          </div>
        )}

        {active === 'appearance' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Appearance</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <p className="text-[13px] text-zinc-400">Choose your preferred theme.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Dark', 'Light'].map((theme) => (
                  <button
                    key={theme}
                    className={`p-4 rounded-xl border text-[13px] font-medium transition-all ${
                      theme === 'Dark' ? 'border-white/20 bg-zinc-900 text-white' : 'border-white/[0.06] bg-white text-black'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'api-tokens' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">API Tokens</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <p className="text-[13px] text-zinc-400">Create API tokens to access NextFlow programmatically.</p>
              <button className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Create new token
              </button>
              <div className="text-[12px] text-zinc-600 pt-2">No tokens created yet.</div>
            </div>
          </div>
        )}

        {!['overview', 'profile', 'appearance', 'api-tokens'].includes(active) && (
          <div className="max-w-xl">
            <h2 className="text-[18px] font-semibold mb-4 capitalize">{sections.find(s => s.id === active)?.label}</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
              <p className="text-[13px] text-zinc-500">This section is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
