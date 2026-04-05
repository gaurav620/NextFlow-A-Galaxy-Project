'use client';
import Image from 'next/image';

const cases = [
    {
        title: "AI Image Generation",
        desc: "Generate images with a simple text description. Control your compositions precisely with over 1000 styles, 20 different models, native 4K, image prompts, and image style transfer through exceptionally simple interfaces. NextFlow offers the industry's fastest generation speeds at 3s for a 1024px Flux image at FP16.",
        buttonText: "Try AI Image Generation",
        imgUrl: "https://images.unsplash.com/photo-1620641788421-7a1c34a26020?q=80&w=1200"
    },
    {
        title: "Image Upscaling",
        desc: "Enhance and upscale images up to a 22K resolution. Make blurry photos razor-sharp, turn simple 3D renders into realistic images, and restore old photos. NextFlow Upscaler is known for preserving shapes and textures unparalleled by any other upscaler in the industry.",
        buttonText: "Try Image Upscaling",
        imgUrl: "https://images.unsplash.com/photo-1634153037059-d88d266d71b3?q=80&w=1200"
    },
    {
        title: "AI Video Generation",
        desc: "Access the most powerful video models from the same dashboard. Generate video from text or image. Keyframe interpolation ensures smooth movement and cohesive transitions across styles. Start from scratch or reimagine existing videos with a single click.",
        buttonText: "Try AI Video Generation",
        imgUrl: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1200"
    }
];

export function UseCasesSection() {
  return (
    <section className="bg-white py-12 pb-32 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left Text Column - Sticky */}
        <div className="lg:w-1/2 flex flex-col">
           <div className="sticky top-[120px]">
               <p className="text-zinc-500 font-medium text-[16px] mb-4">Use cases</p>
               <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-black tracking-tight leading-[1.05] mb-12">
                 Generate or edit high quality images, videos, and 3D objects with AI
               </h2>

               <div className="flex flex-col gap-12 sm:gap-24 pb-24">
                   {cases.map((c, i) => (
                       <div key={i} className="flex flex-col bg-[#f9fafb] p-8 sm:p-10 rounded-[32px] border border-zinc-100 shadow-sm">
                           <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">{c.title}</h3>
                           <p className="text-zinc-600 leading-relaxed mb-8">{c.desc}</p>
                           <button className="self-start px-6 py-3 bg-white border border-zinc-200 text-black font-semibold text-sm rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
                               {c.buttonText}
                           </button>
                       </div>
                   ))}
               </div>
           </div>
        </div>

        {/* Right Media Column */}
        <div className="lg:w-1/2 flex flex-col gap-16 sm:gap-32 pt-[200px] lg:pt-[240px]">
             {cases.map((c, i) => (
                 <div key={i} className="relative rounded-[32px] overflow-hidden shadow-2xl bg-zinc-100 aspect-square sm:aspect-[4/3] ring-1 ring-zinc-200 w-full mb-[50vh] lg:mb-[calc(60vh)]">
                     <Image src={c.imgUrl} fill className="object-cover" alt={c.title} />
                 </div>
             ))}
        </div>

      </div>
    </section>
  );
}
