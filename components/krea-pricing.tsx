import Link from 'next/link';

export function Pricing() {
    return (
        <section className="bg-black pt-32 pb-40 px-6 font-sans">
            <div className="max-w-[1400px] mx-auto text-center">
                <h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight leading-[1.05] text-white max-w-4xl mx-auto mb-20 text-balance">
                    Trusted by over 30,000,000 users. From 191 countries. We've got a plan for everybody.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Basic Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Basic Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$10</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Buy now</Link>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 20,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Creator Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Creator Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$25</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Buy now</Link>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 60,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Pro Pack */}
                    <div className="bg-[#111] border border-zinc-700 rounded-3xl p-8 text-left flex flex-col relative transform md:-translate-y-4 hover:border-zinc-500 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">MOST POPULAR</div>
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors">RECHARGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Pro Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$70</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition">Buy now</Link>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 200,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                    {/* Studio Pack */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-[#FFBD2E]/20 text-[#FFBD2E] text-xs font-bold rounded hover:bg-[#FFBD2E]/30 transition-colors">HIGH VOLUME</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">Studio Pack</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$180</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Buy now</Link>
                        <p className="text-sm text-zinc-300 font-bold mt-6">+ 600,000 compute units</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">Never expires</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
