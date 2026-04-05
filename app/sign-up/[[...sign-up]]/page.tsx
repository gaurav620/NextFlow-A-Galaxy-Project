'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-[32px] h-[32px] rounded-[10px] bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="text-black font-black text-[18px] font-sans tracking-tighter">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">NextFlow</h1>
          </div>
        </div>

        {/* Heading & Subtext */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-gray-400 text-sm">Start building AI workflows today</p>
        </div>

        <div className="mb-6">
          <SignUp
            appearance={{
              elements: {
                card: 'bg-[#09090b]/80 backdrop-blur-3xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-3xl',
                headerTitle: 'text-white font-bold',
                headerSubtitle: 'text-zinc-400',
                socialButtonsBlockButton: 'bg-white/[0.03] border border-white/[0.05] text-white hover:bg-white/[0.08] transition-all',
                socialButtonsBlockButtonText: 'text-white font-medium',
                dividerLine: 'bg-white/[0.08]',
                dividerText: 'text-zinc-500',
                formFieldLabel: 'text-zinc-300',
                formFieldInput: 'bg-[#111111] border border-white/[0.08] text-white focus:border-white/20 transition-all rounded-xl',
                footerActionLink: 'text-white font-semibold hover:text-zinc-300',
                formButtonPrimary: 'bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-0.5',
              },
            }}
          />
        </div>

        {/* Bottom Link */}
        <div className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
