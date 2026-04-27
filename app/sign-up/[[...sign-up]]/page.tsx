'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen bg-[#030014] flex items-center justify-center overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-700/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[30%] right-[50%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030014_70%)]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${20 + i * 12}%`,
              left: `${15 + i * 13}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[440px] px-5">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-white/20 blur-xl" />
            <div className="relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              <span className="text-black font-black text-2xl font-sans tracking-tighter">N</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Create your account</h1>
          <p className="text-zinc-500 text-sm font-medium">Start building AI workflows today</p>
        </div>

        {/* Clerk Sign-Up Card */}
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px] pointer-events-none" />
          
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-[#0a0a1a]/80 !backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] !rounded-[24px] !p-6',
                headerTitle: 'text-white font-bold text-lg',
                headerSubtitle: 'text-zinc-400 text-sm',
                socialButtonsBlockButton: 'bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 rounded-xl h-11',
                socialButtonsBlockButtonText: 'text-white/90 font-medium text-sm',
                dividerLine: 'bg-white/[0.06]',
                dividerText: 'text-zinc-600 text-xs uppercase tracking-wider',
                formFieldLabel: 'text-zinc-300 font-medium text-sm',
                formFieldInput: 'bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 rounded-xl h-11',
                footerAction: 'text-zinc-500',
                footerActionLink: 'text-blue-400 font-semibold hover:text-blue-300 transition-colors',
                formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl h-11 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-0.5',
                identityPreview: 'bg-white/[0.04] border border-white/[0.08] rounded-xl',
                identityPreviewText: 'text-zinc-300',
                identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                formFieldAction: 'text-blue-400 hover:text-blue-300 text-sm',
                formFieldInputShowPasswordButton: 'text-zinc-400 hover:text-white',
                otpCodeFieldInput: 'bg-white/[0.04] border border-white/[0.08] text-white',
                alert: 'bg-red-500/10 border border-red-500/20 text-red-300',
              },
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
              },
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        .cl-internal-b3fm6y { display: none !important; }
        .cl-internal-1hp5nqm { display: none !important; }
        .cl-card { background: transparent !important; }
      `}</style>
    </div>
  );
}
