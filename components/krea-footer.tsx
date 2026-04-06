import Link from 'next/link';

const COLS = [
  {
    heading: 'NextFlow',
    links: [
      { label: 'Log In', href: '/dashboard' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Enterprise', href: '#' },
      { label: 'Gallery', href: '/dashboard' },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Image Generator', href: '/features/ai-image-generator' },
      { label: 'Video Generator', href: '/features/ai-video-generator' },
      { label: 'Enhancer', href: '/features/ai-upscaler' },
      { label: 'Realtime', href: '/dashboard/realtime' },
      { label: 'Edit', href: '/dashboard/edit' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Careers', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'API', href: '/features/api' },
      { label: 'Documentation', href: '#' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
];

export function Footer({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const dark = theme === 'dark';

  return (
    <footer
      className={`${dark ? 'bg-black border-t border-zinc-900 text-white' : 'bg-[#fafafa] border-t border-zinc-100 text-black'} pt-16 pb-12 font-sans`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Logo + nav row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-12 mb-20">
          {COLS.map((col) => (
            <div key={col.heading}>
              <h4
                className={`font-semibold text-[13px] mb-5 tracking-tight ${dark ? 'text-white' : 'text-black'}`}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={`text-[13px] font-medium transition-colors ${
                        dark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[6px] bg-black flex items-center justify-center dark:bg-white">
              <span className="text-white dark:text-black font-black text-[11px]">N</span>
            </div>
            <span className={`text-[13px] font-medium ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              © 2026 NextFlow. All rights reserved.
            </span>
          </div>

          {/* Social icons */}
          <div className={`flex items-center gap-5 ${dark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            {/* GitHub */}
            <a href="#" className="hover:text-current transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="hover:text-current transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-current transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-current transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
