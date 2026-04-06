'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUser, useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Script from 'next/script';
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
  Menu,
  Loader2,
  Trash2,
  Copy
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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  // States for Settings forms
  const [displayName, setDisplayName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('Default Workspace');
  const [promoCode, setPromoCode] = useState('');
  const { theme, setTheme } = useTheme();
  const [tokens, setTokens] = useState<any[]>([]);

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);

  useEffect(() => {
    if (user?.fullName) setDisplayName(user.fullName);
  }, [user]);

  // Handlers
  const handleRazorpay = (amount: number, planName: string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SZwdjVacEhnkjd",
      amount: amount * 100,
      currency: "USD",
      name: "NextFlow AI",
      description: planName,
      image: "https://v0-next-flow-landing-page.vercel.app/favicon.ico",
      handler: function (response: any) {
        toast.success(`Payment successful! Welcome to ${planName}.`);
      },
      prefill: {
        name: user?.fullName || "NextFlow User",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },
      theme: { color: "#111111" }
    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const handleSaveProfile = async () => {
    setIsLoadingProfile(true);
    try {
      await user?.update({ firstName: displayName.split(' ')[0], lastName: displayName.split(' ').slice(1).join(' ') });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
    setIsLoadingProfile(false);
  };

  const handleRedeemPromo = () => {
    if (!promoCode.trim()) return toast.error('Please enter a promo code');
    setIsLoadingPromo(true);
    setTimeout(() => {
      setIsLoadingPromo(false);
      toast.error('Invalid or expired promo code');
    }, 1000);
  };

  const handleSaveWorkspace = () => {
    setIsLoadingWorkspace(true);
    setTimeout(() => {
      setIsLoadingWorkspace(false);
      toast.success('Workspace settings saved');
    }, 800);
  };

  const handleCreateToken = () => {
    setIsTokenLoading(true);
    setTimeout(() => {
      const newToken = {
        id: Math.random().toString(36).substr(2, 9),
        token: 'nf_sk_' + Math.random().toString(36).substr(2, 24),
        created: new Date().toLocaleDateString()
      };
      setTokens([newToken, ...tokens]);
      setIsTokenLoading(false);
      toast.success('API Token created');
    }, 800);
  };

  const handleRevokeToken = (id: string) => {
    setTokens(tokens.filter(t => t.id !== id));
    toast.success('API Token revoked');
  };

  const grouped = ['GENERAL', 'WORKSPACE', 'BILLING', 'DEVELOPER'];

  const SidebarNav = () => (
    <div className="flex-1 p-2">
      {grouped.map((group) => (
        <div key={group} className="mb-4">
          <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold px-2 mb-1">{group}</div>
          {sections.filter((s) => s.group === group).map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setMobileSettingsOpen(false); }}
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
  );

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex w-full h-full bg-[#09090b] text-white overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[220px] border-r border-white/[0.06] flex-col flex-shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/[0.05]">
          <span className="text-[13px] font-semibold text-white">Settings</span>
          <Link href="/dashboard" className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>
        <SidebarNav />
      </div>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-14 left-0 right-0 h-12 bg-[#09090b]/90 backdrop-blur border-b border-white/[0.06] z-30 flex items-center px-4 gap-3">
        <button onClick={() => setMobileSettingsOpen(true)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center transition-colors">
          <Menu className="w-4 h-4 text-zinc-300" />
        </button>
        <span className="text-[13px] font-semibold text-white capitalize">{active.replace('-', ' ')}</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileSettingsOpen(false)}
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full w-[240px] bg-[#09090b] border-r border-white/[0.06] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b border-white/[0.05]">
                <span className="text-[13px] font-semibold text-white">Settings</span>
                <button onClick={() => setMobileSettingsOpen(false)} className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors">
                  <X className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
              <SidebarNav />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4 md:p-8 md:pt-8 pt-16">
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
                <button 
                  onClick={() => setActive('workspace-settings')}
                  className="px-4 py-2 bg-[#1a1a1a] border border-white/[0.06] hover:border-white/10 rounded-lg text-[12px] text-zinc-300 transition-colors">
                  Manage Workspace
                </button>
                <Link href="/dashboard/pricing" className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade
                </Link>
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
                  <Link href="/dashboard/pricing#compute-packs" className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Buy
                  </Link>
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
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
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
              <button 
                onClick={handleSaveProfile}
                disabled={isLoadingProfile}
                className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 min-w-[120px]"
              >
                {isLoadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
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
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      toast.success(`Theme updated to ${t === 'dark' ? 'Dark' : 'Light'}`);
                    }}
                    className={`p-4 rounded-xl border text-[13px] font-medium transition-all capitalize ${
                      theme === t
                        ? 'border-blue-500/60 bg-blue-500/10 text-white'
                        : 'border-white/[0.06] bg-[#0d0d0f] text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl mr-2">{t === 'dark' ? '🌙' : '☀️'}</span>
                    {t === 'dark' ? 'Dark' : 'Light'}
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
              <button 
                onClick={handleCreateToken}
                disabled={isTokenLoading}
                className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5 w-fit min-w-[140px]"
              >
                {isTokenLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Create new token</>}
              </button>
              
              <div className="pt-4">
                {tokens.length === 0 ? (
                  <div className="text-[12px] text-zinc-600">No tokens created yet.</div>
                ) : (
                  <div className="space-y-3">
                    {tokens.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-[#0d0d0f] rounded-lg border border-white/[0.06]">
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="text-[13px] font-medium text-white">{t.token.substring(0, 8)}...</span>
                             <button onClick={() => { navigator.clipboard.writeText(t.token); toast.success('Token copied'); }} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                               <Copy className="w-3 h-3" />
                             </button>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Created {t.created}</p>
                        </div>
                        <button onClick={() => handleRevokeToken(t.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {active === 'account' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Account</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <p className="text-[13px] text-zinc-400">Manage your account security and preferences.</p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-medium text-white">Two-factor Authentication</p>
                      <p className="text-[12px] text-zinc-500 mt-0.5">Add an extra layer of security to your account.</p>
                   </div>
                   <button 
                     onClick={() => toast.success('Check your email to configure 2FA')}
                     className="px-4 py-2 bg-[#1a1a1a] border border-white/[0.06] hover:border-white/10 rounded-lg text-[12px] text-zinc-300 transition-colors">
                     Enable
                   </button>
                </div>
                <div className="h-px bg-white/[0.06] w-full my-4"></div>
                <div className="flex items-center justify-between">
                   <div>
                      <p className="text-[14px] font-medium text-red-500">Delete Account</p>
                      <p className="text-[12px] text-zinc-500 mt-0.5">Permanently delete your account and all data.</p>
                   </div>
                   <button 
                     onClick={() => toast.success('Check your email to confirm deletion request')}
                     className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-[12px] font-semibold transition-colors">
                     Delete
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'promo' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Promo Codes</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <p className="text-[13px] text-zinc-400">Redeem a promo code for compute packs or subscriptions.</p>
              <div className="flex gap-3 pt-2">
                 <input 
                   value={promoCode}
                   onChange={e => setPromoCode(e.target.value)}
                   placeholder="Enter code" 
                   className="flex-1 bg-[#0d0d0f] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-white/10 transition-colors"
                 />
                 <button 
                   onClick={handleRedeemPromo}
                   disabled={isLoadingPromo}
                   className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center min-w-[90px]"
                 >
                   {isLoadingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Redeem'}
                 </button>
              </div>
            </div>
          </div>
        )}

        {active === 'members' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Members</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                  <div>
                     <p className="text-[14px] font-medium text-white">Default Workspace</p>
                     <p className="text-[12px] text-zinc-500 mt-0.5">Invite others to collaborate in this workspace.</p>
                  </div>
                  <button 
                    onClick={() => toast.success('Invite link copied to clipboard')}
                    className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Invite
                  </button>
              </div>
              
              <div className="space-y-4">
                 <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Current Members</div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[12px] font-semibold text-zinc-300">
                         {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                       </div>
                       <div>
                         <p className="text-[13px] font-medium text-white">{user?.fullName ?? 'User'} (You)</p>
                         <p className="text-[11px] text-zinc-500">{user?.emailAddresses?.[0]?.emailAddress ?? ''}</p>
                       </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">Owner</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {active === 'workspace-settings' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Workspace Settings</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-5">
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1.5">Workspace Name</label>
                  <input
                    value={workspaceName}
                    onChange={e => setWorkspaceName(e.target.value)}
                    className="w-full bg-[#0d0d0f] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-white outline-none focus:border-white/10 transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveWorkspace}
                disabled={isLoadingWorkspace}
                className="px-4 py-2 bg-white text-black rounded-lg text-[12px] font-semibold hover:bg-zinc-100 transition-colors flex items-center justify-center min-w-[80px]"
              >
                {isLoadingWorkspace ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </button>
              
              <div className="h-px bg-white/[0.06] w-full my-4"></div>
              
              <div>
                <h3 className="text-[14px] font-medium text-white mb-1">Danger Zone</h3>
                <p className="text-[12px] text-zinc-500 mb-4">Deleting this workspace will remove all assets and workflows permanently.</p>
                <button 
                  onClick={() => toast.success('Please empty your workspace before deletion')}
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-[12px] font-semibold transition-colors"
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {active === 'compute-packs' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Compute Packs</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <Package className="w-6 h-6 text-[#5b61ff]" />
                 <div>
                    <h3 className="text-[15px] font-semibold text-white">Need more compute?</h3>
                    <p className="text-[12px] text-zinc-400">Buy one-time compute packs that never expire.</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                 <button 
                   onClick={() => handleRazorpay(10, '1,000 Compute units')}
                   className="bg-[#0d0d0f] border border-white/[0.06] hover:border-white/10 transition-colors rounded-xl p-5 flex flex-col items-center justify-center text-center w-full"
                 >
                    <p className="text-[24px] font-bold text-white mb-1">1,000</p>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">Compute units</p>
                    <p className="text-[14px] font-medium text-white">$10.00</p>
                 </button>
                 <button 
                   onClick={() => handleRazorpay(45, '5,000 Compute units')}
                   className="bg-[#0d0d0f] border border-[#5b61ff]/40 hover:border-[#5b61ff]/80 transition-colors rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_20px_rgba(91,97,255,0.15)] w-full"
                 >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <p className="text-[24px] font-bold text-white mb-1">5,000</p>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">Compute units</p>
                    <p className="text-[14px] font-medium text-white">$45.00</p>
                 </button>
              </div>
            </div>
          </div>
        )}

        {active === 'billing' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-[18px] font-semibold">Billing</h2>
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                 <div>
                    <h3 className="text-[14px] font-medium text-white">Current Plan</h3>
                    <p className="text-[12px] text-zinc-400 mt-0.5">You are currently on the Free plan.</p>
                 </div>
                 <span className="bg-zinc-800 text-zinc-300 text-[11px] font-medium px-2.5 py-1 rounded-full">Free</span>
              </div>
              <Link href="/dashboard/pricing" className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-[13px] font-semibold transition-all text-center block">
                Upgrade to Pro
              </Link>
              
              <div className="h-px bg-white/[0.06] w-full my-4"></div>
              
              <div>
                <h3 className="text-[14px] font-medium text-white mb-1">Payment Methods</h3>
                <p className="text-[12px] text-zinc-500 mb-4">No payment methods added.</p>
                <button 
                  onClick={() => handleRazorpay(0, 'Add Default Payment Method')}
                  className="px-4 py-2 bg-[#1a1a1a] border border-white/[0.06] hover:border-white/10 rounded-lg text-[12px] text-zinc-300 transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
