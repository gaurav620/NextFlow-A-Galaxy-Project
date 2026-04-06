'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://nextflow.ai/ref/x7A9pq';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">Earn 3,000 Compute Units</h2>
              <p className="text-[14px] text-zinc-400 mb-8 leading-relaxed">
                Share NextFlow with a friend and you both get rewarded.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-[14.5px] text-zinc-300">Your friend gets <strong className="text-white">500 compute units</strong> on sign up</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-[14.5px] text-zinc-300">You receive <strong className="text-white">3,000 compute units</strong> when they subscribe to any paid plan</span>
                </li>
              </ul>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Your Referral Link</label>
                <div className="flex items-center gap-2 p-1.5 bg-[#1a1a1a] border border-white/10 rounded-xl relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={referralLink}
                    className="w-full bg-transparent text-[14px] text-white px-3 outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              
              <p className="text-center mt-6">
                <a href="#" className="text-[12px] text-zinc-500 hover:text-zinc-400 underline decoration-zinc-700 underline-offset-4">Terms & Conditions</a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
