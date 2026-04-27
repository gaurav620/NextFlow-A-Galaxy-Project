import Image from 'next/image';
import Link from 'next/link';

export function KreaFeatureCards() {
  const cards = [
    {
      title: "NextFlow 1",
      icon: "N",
      prompt: "Cinematic photo of a person in a linen jacket",
      buttonText: "",
      image: "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Veo 3",
      icon: "🌀",
      prompt: "An animated capybara talking about NextFlow",
      buttonText: "Generate video",
      image: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Topaz Upscaler",
      icon: "✨",
      prompt: "Upscale image 512px → 8K",
      buttonText: "",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Hailuo",
      icon: "H",
      prompt: "Advertisement of a realistic sandwich exploding...",
      buttonText: "",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="bg-white py-16 sm:py-24 font-sans px-4 sm:px-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-row gap-4 sm:gap-6 lg:gap-8 justify-start md:justify-center overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar w-full relative left-0 right-0 px-4">
        {cards.map((card, i) => (
          <div key={i} className="group relative w-[85vw] sm:w-[320px] lg:w-[340px] h-[480px] sm:h-[520px] rounded-[32px] overflow-hidden shrink-0 snap-center sm:snap-align-none bg-zinc-900 border border-zinc-200 shadow-xl cursor-pointer">
            <Image 
              src={card.image} 
              alt={card.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
            
            {/* Top Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 text-white font-bold tracking-tight">
              {card.icon === "N" ? (
                 <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-white text-black"><span className="text-[12px] tracking-tighter">N</span></div>
              ) : (
                <span className="text-xl">{card.icon}</span>
              )}
              {card.title}
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-8 left-6 right-6">
               <p className="text-[11px] font-bold text-white/50 tracking-[0.15em] uppercase mb-2">Prompt</p>
               <h3 className="text-white font-semibold text-[22px] leading-tight drop-shadow-md pr-4">{`“${card.prompt}”`}</h3>
               {card.buttonText && (
                 <Link href="/dashboard" className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white font-semibold text-sm transition-colors border border-white/10">
                   {card.buttonText}
                 </Link>
               )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
