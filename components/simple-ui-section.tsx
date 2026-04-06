'use client';

export function SimpleUISection() {
  return (
    <section className="bg-[#0a0a0a] py-20 sm:py-32 font-sans overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Headline */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-[clamp(32px,5.5vw,72px)] font-bold text-white tracking-tighter leading-[1.05] mb-5 max-w-3xl mx-auto">
            Dead simple UI. No tutorials needed.
          </h2>
          <p className="text-[clamp(14px,2vw,18px)] text-zinc-500 max-w-xl mx-auto leading-relaxed">
            NextFlow offers the simplest interfaces. Skip dry tutorials and get right into your creative flow with minimal distraction, even if you&apos;ve never worked with AI tools before.
          </p>
        </div>

        {/* UI Screenshot Mockup */}
        <div className="relative max-w-[960px] mx-auto">
          {/* Glow */}
          <div className="absolute -inset-8 bg-indigo-900/20 blur-[60px] rounded-full pointer-events-none" />

          {/* Browser Frame */}
          <div className="relative rounded-[18px] sm:rounded-[24px] border border-white/10 overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.9)] bg-[#0d0d0d]">
            {/* Toolbar */}
            <div className="h-9 sm:h-11 bg-[#161616] border-b border-white/[0.06] flex items-center px-4 gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-[10px] sm:text-[11px] text-zinc-500 font-medium">
                  nextflow.ai/image
                </div>
              </div>
            </div>

            {/* Fake UI Content */}
            <div className="relative bg-[#090909] aspect-[16/9]">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
                alt="NextFlow UI"
                className="w-full h-full object-cover opacity-40"
              />
              {/* Overlay fake UI elements */}
              <div className="absolute inset-0 flex">
                {/* Left panel */}
                <div className="w-[200px] sm:w-[260px] h-full bg-black/80 backdrop-blur border-r border-white/[0.06] p-4 flex flex-col gap-3 hidden sm:flex">
                  <div className="w-8 h-8 rounded-[8px] bg-white flex items-center justify-center mb-2">
                    <span className="text-black font-black text-[14px]">N</span>
                  </div>
                  {['Image', 'Video', 'Enhancer', 'Realtime', 'Edit'].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5">
                      <div className="w-[20px] h-[20px] rounded-[6px] bg-white/10 flex-shrink-0" />
                      <span className="text-[12px] text-zinc-400 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Main area */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                  <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                    <div className="text-zinc-500 text-[11px] sm:text-[12px] font-medium mb-2">Describe your image</div>
                    <div className="text-white text-[12px] sm:text-[14px] font-medium">
                      &ldquo;Cinematic photo of a person in a linen jacket&rdquo;
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-[10px] sm:text-[11px] text-zinc-600">NextFlow 1 · 4K · 3.1s</div>
                      <div className="px-4 py-1.5 bg-white rounded-full text-black text-[11px] sm:text-[12px] font-bold">
                        Generate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
