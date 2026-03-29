'use client';

import { SignIn } from '@clerk/nextjs';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">NextFlow</h1>
          </div>
        </div>

        {/* Heading & Subtext */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 text-sm">Sign in to your NextFlow account</p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="mb-6">
          <SignIn
            appearance={{
              elements: {
                card: 'bg-gray-900 border border-gray-800 shadow-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-400',
                socialButtonsBlockButton: 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700',
                formFieldInput: 'bg-gray-800 border-gray-700 text-white',
                footerActionLink: 'text-purple-400 hover:text-purple-300',
                formButtonPrimary: 'bg-purple-600 hover:bg-purple-700',
              },
            }}
          />
        </div>

        {/* Bottom Link */}
        <div className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
