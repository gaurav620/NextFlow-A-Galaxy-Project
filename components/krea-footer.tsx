import Link from 'next/link';

export function Footer({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isLight = theme === 'light';
  
  const containerClass = isLight 
    ? 'bg-[#fafafa] text-black border-t border-zinc-200' 
    : 'bg-black text-white border-t border-zinc-900';
    
  const headingClass = isLight ? 'text-black' : 'text-white';
  const linkClass = isLight ? 'text-zinc-400 hover:text-black' : 'text-zinc-500 hover:text-white';
  const copyClass = isLight ? 'text-zinc-400' : 'text-zinc-600';
  const iconClass = isLight ? 'text-zinc-400 hover:text-black' : 'text-zinc-600 hover:text-white';

  return (
    <footer className={`${containerClass} pt-20 pb-16 font-sans`}>
      <div className="max-w-[1240px] mx-auto px-6">
        
        {/* Core Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32">
          <div>
              <h4 className={`font-semibold text-[13px] mb-6 tracking-tight ${headingClass}`}>NextFlow</h4>
              <ul className={`flex flex-col gap-3.5 font-medium text-[13px] ${linkClass}`}>
                  <li><Link href="/dashboard" className="transition">Log In</Link></li>
                  <li><Link href="/dashboard/pricing" className="transition">Pricing</Link></li>
                  <li><Link href="#" className="transition">Enterprise</Link></li>
                  <li><Link href="/dashboard" className="transition">Gallery</Link></li>
              </ul>
          </div>
          <div>
              <h4 className={`font-semibold text-[13px] mb-6 tracking-tight ${headingClass}`}>Products</h4>
              <ul className={`flex flex-col gap-3.5 font-medium text-[13px] ${linkClass}`}>
                  <li><Link href="/features/ai-image-generator" className="transition">Image Generator</Link></li>
                  <li><Link href="/features/ai-video-generator" className="transition">Video Generator</Link></li>
                  <li><Link href="/features/ai-upscaler" className="transition">Enhancer</Link></li>
                  <li><Link href="/dashboard/realtime" className="transition">Realtime</Link></li>
                  <li><Link href="/dashboard/edit" className="transition">Edit</Link></li>
              </ul>
          </div>
          <div>
              <h4 className={`font-semibold text-[13px] mb-6 tracking-tight ${headingClass}`}>Resources</h4>
              <ul className={`flex flex-col gap-3.5 font-medium text-[13px] ${linkClass}`}>
                  <li><Link href="/pricing" className="transition">Pricing</Link></li>
                  <li><Link href="#" className="transition">Careers</Link></li>
                  <li><Link href="#" className="transition">Terms of Service</Link></li>
                  <li><Link href="#" className="transition">Privacy Policy</Link></li>
                  <li><Link href="/features/api" className="transition">API</Link></li>
                  <li><Link href="/dashboard" className="transition">Documentation</Link></li>
              </ul>
          </div>
          <div>
              <h4 className={`font-semibold text-[13px] mb-6 tracking-tight ${headingClass}`}>About</h4>
              <ul className={`flex flex-col gap-3.5 font-medium text-[13px] ${linkClass}`}>
                  <li><Link href="#" className="transition">Blog</Link></li>
                  <li><Link href="#" className="transition">Discord</Link></li>
              </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
            <span className={`font-medium text-[12px] ${copyClass}`}>© 2026 NextFlow</span>
            
            <div className={`flex items-center gap-4 ${iconClass}`}>
                <svg className="w-4 h-4 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                <svg className="w-4 h-4 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                <svg className="w-4 h-4 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </div>
        </div>
      </div>
    </footer>
  );
}
