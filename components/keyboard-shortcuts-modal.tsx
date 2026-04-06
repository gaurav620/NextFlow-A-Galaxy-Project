'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

const shortcuts = [
  { keys: ['N'], desc: 'New generation' },
  { keys: ['⌘', 'K'], desc: 'Quick search' },
  { keys: ['S'], desc: 'Open settings' },
  { keys: ['A'], desc: 'View assets' },
  { keys: ['Esc'], desc: 'Close modal / panel' },
  { keys: ['?'], desc: 'Show this dialog' },
];

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Command className="w-4 h-4 text-zinc-400" />
                <h2 className="text-[15px] font-semibold text-white">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="p-3 space-y-1">
              {shortcuts.map((s) => (
                <div
                  key={s.desc}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-[13px] text-zinc-300">{s.desc}</span>
                  <div className="flex items-center gap-1.5">
                    {s.keys.map((key) => (
                      <kbd
                        key={key}
                        className="min-w-[28px] h-[26px] px-2 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-md text-[11px] font-mono text-zinc-300 shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 pt-0 border-t border-white/[0.04] mt-1">
              <p className="text-[11px] text-zinc-600 text-center py-2">
                Press <kbd className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] mx-0.5 font-mono">?</kbd> to toggle
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
