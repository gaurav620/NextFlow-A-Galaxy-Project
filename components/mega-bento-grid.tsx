'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const models = [
    { name: 'Veo 3.1', icon: '🌀' },
    { name: 'Ideogram', icon: '❄' },
    { name: 'Runway', icon: 'ℜ' },
    { name: 'Luma', icon: 'L' },
    { name: 'Flux', icon: '▴' },
    { name: 'Gemini', icon: '✨' },
    { name: 'NextFlow 1', icon: '⬡' }
];

export function MegaBentoGrid() {
    return (
        <section className="bg-white pt-12 pb-24 font-sans overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                
                <h2 className="text-[clamp(40px,7vw,88px)] font-bold text-black tracking-tighter leading-[1.05] text-center mb-12 max-w-4xl mx-auto">
                    The industry's best Image models. <br/>In one subscription.
                </h2>

                {/* Animated Marquee Logos */}
                <div className="relative w-full overflow-hidden mb-20 flex items-center opacity-40 grayscale pb-8 pt-4">
                    {/* Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
                    
                    <motion.div 
                        initial={{ x: "0%" }}
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                        className="flex items-center gap-16 min-w-max pr-16"
                    >
                        {[...models, ...models, ...models, ...models].map((m, i) => (
                            <div key={`${m.name}-${i}`} className="flex items-center gap-3 text-2xl font-bold text-black tracking-tight shrink-0">
                                <span className="text-3xl">{m.icon}</span> {m.name}
                            </div>
                        ))}
                    </motion.div>
                           {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-[280px] md:auto-rows-[250px] lg:auto-rows-[280px]">
                    
                    {/* Row 1 */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-6 rounded-[32px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
                        <Image src="https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=800" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="Speed" />
                        <div className="absolute inset-0 bg-black/40" />
                        <h3 className="absolute inset-x-8 top-1/2 -translate-y-1/2 text-white font-bold text-[clamp(28px,5vw,48px)] leading-tight text-center drop-shadow-md">Industry-leading<br/>inference speed</h3>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-[#f4f4f5] rounded-[32px] p-8 flex flex-col justify-center items-center text-center">
                        <p className="text-[clamp(48px,8vw,72px)] font-black text-black leading-none tracking-tighter mb-2">22K</p>
                        <p className="font-bold text-zinc-900 text-[13px] sm:text-sm">Pixels upscaling</p>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#f4f4f5] rounded-[32px] p-8 flex flex-col justify-center items-center text-center">
                        <p className="text-[clamp(48px,8vw,80px)] font-black text-black leading-none tracking-tighter mb-2">Train</p>
                        <p className="font-bold text-zinc-900 text-[13px] sm:text-sm">Fine-tune models with your own data</p>
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-3 rounded-[32px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
                        <Image src="https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="4K" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-center w-full pr-16 text-left">
                           <p className="text-[56px] lg:text-[64px] font-black text-white leading-none tracking-tighter mb-1">4K</p>
                           <p className="font-medium text-white text-[13px] sm:text-sm">Native image generation</p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-black rounded-[32px] overflow-hidden relative group shadow-sm flex items-end p-8">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800')] bg-cover opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
                         <p className="text-[28px] lg:text-[32px] font-bold text-white relative z-10 tracking-tight leading-tight">Minimalist UI</p>
                    </div>

                    {/* Giant NextFlow 1 Block */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-6 md:row-span-2 lg:row-span-2 rounded-[32px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
                        <Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200" fill className="object-cover group-hover:scale-105 transition-transform duration-700 blur-[2px]" alt="NextFlow 1 Background" />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-[clamp(56px,10vw,120px)] font-black text-white leading-none tracking-tighter drop-shadow-2xl mb-2 text-center">NextFlow 1</p>
                            <p className="text-white/90 font-medium text-base lg:text-lg text-center px-4">Ultra-realistic flagship model</p>
                        </div>
                    </div>

                    {/* Row 3 Items (left of the giant block) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-[#f4f4f5] rounded-[32px] p-6 flex flex-col justify-center items-center text-center">
                        <p className="text-[28px] lg:text-[32px] font-bold text-black leading-none tracking-tight mb-2">Do not train</p>
                        <p className="font-medium text-zinc-600 text-xs">Safely generate proprietary data</p>
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-[#f4f4f5] rounded-[32px] p-6 flex flex-col justify-center items-center text-center">
                        <p className="text-[56px] lg:text-[64px] font-black text-black leading-none tracking-tighter mb-2">64+</p>
                        <p className="font-bold text-zinc-900">Models</p>
                    </div>

                    {/* Row 4 */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-3 rounded-[32px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200 bg-zinc-900">
                        <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1 opacity-50 p-2">
                           {Array.from({length: 25}).map((_, i) => (
                             <div key={i} className="bg-white/10 rounded-sm"></div>
                           ))}
                        </div>
                        <p className="text-[24px] lg:text-[28px] font-bold text-white relative z-10 m-8 tracking-tight leading-tight max-w-[200px] drop-shadow-md">Full-fledged asset manager</p>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-[#f4f4f5] rounded-[32px] p-8 flex flex-col items-center justify-between text-center">
                        <p className="text-[24px] lg:text-[28px] font-bold text-black leading-none tracking-tight">Bleeding Edge</p>
                        
                        {/* Fake Clock Graphic */}
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white bg-white/50 shadow-inner relative flex items-center justify-center">
                            <div className="w-1.5 h-8 lg:h-12 bg-black absolute top-[10%] lg:top-4 rounded-full origin-bottom rotate-[45deg]"></div>
                            <div className="w-1.5 h-12 lg:h-16 bg-yellow-500 absolute top-0 rounded-full origin-bottom rotate-[120deg]"></div>
                            <div className="w-3 h-3 bg-black rounded-full absolute z-10"></div>
                        </div>

                        <p className="font-medium text-zinc-700 text-xs lg:text-sm leading-tight">Access the latest models directly on release day</p>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-zinc-900 rounded-[32px] overflow-hidden relative shadow-sm border text-white p-8 group">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800')] bg-cover opacity-20 mix-blend-screen group-hover:scale-105 transition-transform" />
                         <p className="text-[32px] lg:text-[40px] font-bold leading-none tracking-tight relative z-10 pb-4">1000+<br/>styles</p>
                    </div>

                    <div className="col-span-1 md:col-span-1 lg:col-span-3 rounded-[32px] overflow-hidden relative group shadow-sm ring-1 ring-zinc-200">
                        <Image src="https://images.unsplash.com/photo-1634153037059-d88d266d71b3?q=80&w=800" fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="Image Editor" />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-[36px] lg:text-[44px] font-bold text-white tracking-tight drop-shadow-xl text-center">Image<br/>Editor</p>
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#f4f4f5] rounded-[32px] p-8 flex flex-col items-center justify-between">
                        <p className="text-[24px] lg:text-[28px] font-bold text-black tracking-tight w-full text-left">Lipsync</p>
                        
                        {/* Audio wave graphic */}
                        <div className="flex items-center justify-center gap-1.5 lg:gap-2 h-24 lg:h-32">
                           {[4, 8, 12, 6, 16, 5, 10, 14, 8, 4].map((h, i) => (
                             <div key={i} className="w-2 lg:w-3 bg-black rounded-full" style={{ height: `${h * 4}px`}}></div>
                           ))}
                        </div>
                        <div />
                    </div>

                    <div className="hidden lg:block lg:col-span-8"></div>
                </div>

                {/* Final 2 blocks fixed underneath row 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 mt-4 lg:mt-5 auto-rows-[250px] lg:auto-rows-[160px]">
                     <div className="hidden lg:block lg:col-span-4"></div>
                     <div className="col-span-1 md:col-span-1 lg:col-span-4 rounded-[32px] overflow-hidden bg-black relative group shadow-sm flex items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800')] opacity-40 mix-blend-color-dodge group-hover:scale-105 transition-transform"/>
                         <p className="text-white font-bold text-[32px] lg:text-[36px] tracking-tight relative z-10 text-center">Realtime Canvas</p>
                     </div>
                     <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-[#f4f4f5] rounded-[32px] p-8 flex flex-col items-center justify-center relative">
                         <p className="text-[32px] lg:text-[36px] font-bold text-black tracking-tight z-20 mt-4 lg:mt-8">Text to 3D</p>
                         <div className="absolute inset-0 flex items-center justify-center opacity-30 mt-8">
                             <div className="w-16 h-16 lg:w-20 lg:h-20 bg-zinc-400 rotate-45 transform-gpu blur-sm"></div>
                         </div>
                     </div>
                </div>       </div>

            </div>
        </section>
    );
}
