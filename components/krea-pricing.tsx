import Link from 'next/link';

export function Pricing() {
    return (
        <section className="bg-black pt-32 pb-40 px-6 font-sans">
            <div className="max-w-[1400px] mx-auto text-center">
                <h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight leading-[1.05] text-white max-w-4xl mx-auto mb-20 text-balance">
                    Trusted by over 30,000,000 users. From 191 countries. We've got a plan for everybody.
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Free */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">$0</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition">Get Started</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 100 compute units/day</p>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-white/70">
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/30" />Basic real-time text-to-image</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/30" />Basic image enhancements</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/30" />Slow generation queue</li>
                        </ul>
                    </div>
                    {/* Basic */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$9</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 5,000 compute units/month</p>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-white/70">
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />Fast generation queue</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />Commercial use</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />Video generation (standard)</li>
                        </ul>
                    </div>
                    {/* Pro */}
                    <div className="bg-[#111] border border-zinc-700 rounded-3xl p-8 text-left flex flex-col relative transform md:-translate-y-4 hover:border-zinc-500 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">MOST POPULAR</div>
                        <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$35</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-white text-black font-semibold text-center rounded-xl hover:bg-zinc-200 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 20,000 compute units/month</p>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-white/70">
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />Premium generation queue</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />Private mode (hidden from gallery)</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />API Access</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white" />High-res exports</li>
                        </ul>
                    </div>
                    {/* Max */}
                    <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 text-left flex flex-col hover:border-zinc-700 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Max</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-[40px] font-black text-white leading-none">US$105</span>
                            <span className="text-zinc-500 font-medium mb-1">/month</span>
                        </div>
                        <Link href="/sign-up" className="w-full py-3.5 bg-zinc-800 text-white font-semibold text-center rounded-xl hover:bg-zinc-700 transition">Subscribe</Link>
                        <p className="text-sm text-zinc-500 font-medium mt-6">Includes 60,000 compute units/month</p>
                        <ul className="mt-8 flex flex-col gap-3 text-sm text-white/70">
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />Priority support</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />Custom inference servers</li>
                             <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />Dedicated account manager</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
