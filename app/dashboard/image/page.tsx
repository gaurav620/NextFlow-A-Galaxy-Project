"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Download,
  Image as ImageIcon,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useAssetStore } from "@/store/assets";
import { toast } from "sonner";

type ModelOption = {
  id: string;
  name: string;
  subtitle: string;
  credits: string;
};

type InspirationCard = {
  title: string;
  image: string;
  prompt: string;
  rotation: string;
  offset: string;
};

const models: ModelOption[] = [
  { id: "krea1", name: "NextFlow 1", subtitle: "Most creative model with LoRAs", credits: "6 ⚡" },
  { id: "nano-banana", name: "Nano Banana", subtitle: "Most versatile intelligent model", credits: "30 ⚡" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", subtitle: "Highest quality for premium outputs", credits: "80 ⚡" },
  { id: "flux-klein", name: "Flux 2 Klein", subtitle: "Fast lightweight Flux model", credits: "4 ⚡" },
  { id: "recraft-v4", name: "Recraft V4", subtitle: "Sharp detailed image rendering", credits: "12 ⚡" },
];

const ratioOptions = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"];
const resolutionOptions = ["1K", "1.2K", "1.5K", "4K"];

const inspirationCards: InspirationCard[] = [
  {
    title: "35mm Photo of a fox...",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=900&q=80",
    prompt: "35mm photo of a fox playing the drums in a lush forest, cinematic lighting, ultra detailed",
    rotation: "-rotate-6",
    offset: "-translate-x-28",
  },
  {
    title: "A highly stylized...",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80",
    prompt: "a highly stylized cinematic street scene, dreamy atmosphere, rich colors, ultra sharp",
    rotation: "-rotate-2",
    offset: "-translate-x-8",
  },
  {
    title: "Different pieces...",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=900&q=80",
    prompt: "different pieces of sushi floating in air, studio lighting, product photography, white background",
    rotation: "rotate-3",
    offset: "translate-x-12",
  },
  {
    title: "A small, warm...",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=80",
    prompt: "a small warm roadside diner under dramatic stormy sky, moody cinematic realism",
    rotation: "rotate-6",
    offset: "translate-x-28",
  },
];

const ratioToFriendly = {
  "1:1": "Square",
  "16:9": "Landscape",
  "9:16": "Portrait",
  "4:3": "Classic",
  "3:4": "Tall",
  "21:9": "Cinematic",
} as const;

export default function ImagePage() {
  const { addAsset } = useAssetStore();

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState<ModelOption>(models[0]);
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [showImagePromptMenu, setShowImagePromptMenu] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [rightTab, setRightTab] = useState<'settings' | 'history'>('settings');

  const [selectedCard, setSelectedCard] = useState(0);

  const activePrompt = useMemo(() => prompt.trim(), [prompt]);

  const closeMenus = () => {
    setShowModelMenu(false);
    setShowRatioMenu(false);
    setShowResolutionMenu(false);
    setShowImagePromptMenu(false);
  };

  const handleGenerate = async () => {
    if (!activePrompt || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt,
          negPrompt: negativePrompt.trim() || undefined,
          aspectRatio: ratio,
          style: "None",
          resolution,
          count: 1,
          modelId: model.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image generation failed");
      }

      const images: string[] = data.images || [];
      if (images.length === 0) {
        throw new Error("No image returned from generator");
      }

      setResultImages((prev) => [...images, ...prev]);
      toast.success(`Generated ${images.length} image${images.length > 1 ? 's' : ''} successfully`);

      for (const imageUrl of images) {
        addAsset({
          url: imageUrl,
          prompt: activePrompt,
          tool: "image",
          ratio,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image generation failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardHover = (index: number) => {
    setSelectedCard(index);
    setPrompt(inspirationCards[index].prompt);
  };

  const handleDownload = (src: string, idx: number) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `nextflow-image-${idx + 1}.png`;
    a.click();
  };

  return (
    <div
      className="relative flex h-full w-full overflow-hidden text-white bg-[#070707]"
      onClick={closeMenus}
    >
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[40%] w-[60%] -translate-x-1/2 rounded-[100%] bg-indigo-500/10 blur-[120px]" />
      
      <div className="flex-1 px-5 pb-8 pt-6 md:px-8 relative z-10 w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowModelMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 hover:border-white/20"
            >
              <span>{model.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>

            {showModelMenu && (
              <div className="absolute left-0 top-full z-30 mt-2 w-80 rounded-2xl border border-white/10 bg-[#16171c]/95 p-2 shadow-2xl backdrop-blur-xl">
                {models.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setModel(item);
                      setShowModelMenu(false);
                    }}
                    className={`mb-1 flex w-full items-start justify-between rounded-xl px-3 py-2 text-left transition ${
                      item.id === model.id ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.subtitle}</p>
                    </div>
                    <span className="text-xs text-zinc-300">{item.credits}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowRightPanel((v) => !v);
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 hover:border-white/20 hover:text-white"
            title={showRightPanel ? "Hide right panel" : "Show right panel"}
          >
            {showRightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative flex min-h-[62vh] items-center justify-center">
          {resultImages.length === 0 ? (
            <>
              <div className="pointer-events-none absolute -top-12 text-center">
                <div className="mb-2 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <ImageIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-white/90">Image</h1>
                </div>
              </div>

              <div className="relative mt-12 h-[340px] w-full max-w-4xl">
                {inspirationCards.map((card, index) => {
                  const rotationMap = ["-rotate-[3deg]", "-rotate-[1deg]", "rotate-[2deg]", "rotate-[4deg]"];
                  const offsetMap = ["-translate-x-40", "-translate-x-12", "translate-x-12", "translate-x-40"];
                  const zIndexMap = [10, 20, 20, 10];
                  
                  return (
                  <button
                    key={card.title}
                    type="button"
                    onMouseEnter={() => handleCardHover(index)}
                    onFocus={() => handleCardHover(index)}
                    className={`absolute left-1/2 top-1/2 h-[320px] w-[256px] -translate-y-1/2 rounded-[20px] border border-white/[0.08] bg-zinc-900 text-left shadow-2xl transition-all duration-400 ease-out hover:scale-[1.03] hover:-translate-y-[55%] hover:border-white/20 hover:z-50 ${rotationMap[index]} ${offsetMap[index]} ${
                      selectedCard === index ? "ring-1 ring-white/20" : ""
                    }`}
                    style={{ zIndex: zIndexMap[index] }}
                  >
                    <img src={card.image} alt={card.title} className="h-full w-full rounded-[20px] object-cover" />
                    <div className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[20px] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[15px] font-medium text-white line-clamp-2 leading-snug drop-shadow-md">{card.title}</p>
                    </div>
                  </button>
                )})}
              </div>
            </>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resultImages.map((src, idx) => (
                <div key={`${src}-${idx}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <img src={src} alt={`Result ${idx + 1}`} className="h-[280px] w-full object-cover" />
                  <div className="absolute inset-0 flex items-end justify-end bg-black/30 p-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleDownload(src, idx)}
                      className="rounded-lg bg-black/70 p-2 text-white hover:bg-black"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[800px] px-4 z-40" onClick={() => closeMenus()}>
          {error && <p className="mb-2 text-sm text-red-400 text-center">{error}</p>}

          <div className="w-full bg-[#111214]/80 backdrop-blur-3xl border border-white/[0.08] rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all p-3 pl-4 hover:border-white/[0.12]" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe an image and click generate..."
              className="h-[52px] w-full resize-none bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setModel(models[0]);
                  setShowModelMenu(true);
                }}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                {model.name}
              </button>

              <button
                type="button"
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                LoRA
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowImagePromptMenu((v) => !v)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  Image prompt
                </button>
                {showImagePromptMenu && (
                  <div className="absolute bottom-full left-0 z-30 mb-3 w-64 rounded-2xl border border-white/[0.08] bg-[#1a1c22]/95 backdrop-blur-xl p-3 shadow-2xl">
                    <p className="mb-2 text-xs text-zinc-400">Upload/select image for image prompt guidance.</p>
                    <button type="button" className="mb-2 w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-black">
                      Upload
                    </button>
                    <button type="button" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
                      Select asset
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                Style transfer
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRatioMenu((v) => !v)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  {ratio}
                </button>
                {showRatioMenu && (
                  <div className="absolute bottom-full left-0 z-30 mb-3 w-44 rounded-2xl border border-white/[0.08] bg-[#1a1c22]/95 backdrop-blur-xl p-2 shadow-2xl">
                    {ratioOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setRatio(item);
                          setShowRatioMenu(false);
                        }}
                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
                          ratio === item ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        <span>{item}</span>
                        <span className="text-xs text-zinc-500">{ratioToFriendly[item as keyof typeof ratioToFriendly]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowResolutionMenu((v) => !v)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                  {resolution}
                </button>
                {showResolutionMenu && (
                  <div className="absolute bottom-full right-0 z-30 mb-3 w-32 rounded-2xl border border-white/[0.08] bg-[#1a1c22]/95 backdrop-blur-xl p-2 shadow-2xl">
                    {resolutionOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setResolution(item);
                          setShowResolutionMenu(false);
                        }}
                        className={`mb-1 w-full rounded-lg px-2 py-1.5 text-left text-sm ${
                          resolution === item ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!activePrompt || isGenerating}
                className="ml-auto inline-flex h-9 w-[110px] items-center justify-center gap-1.5 rounded-full bg-white text-black font-semibold text-[14px] transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? <div className="flex gap-1.5 items-center"><Wand2 className="h-4 w-4 animate-spin" /><span>Gen...</span></div> : <div className="flex gap-1.5 items-center"><Sparkles className="h-4 w-4" strokeWidth={2.5} /><span>Generate</span></div>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRightPanel && (
        <aside className="hidden md:flex w-[280px] border-l border-white/[0.04] bg-[#09090b] flex-col flex-shrink-0 z-10 transition-all">
          {/* Tab Switcher */}
          <div className="flex border-b border-white/[0.04]">
            <button
              onClick={() => setRightTab('settings')}
              className={`flex-1 py-3 text-[12px] font-semibold text-center transition-colors ${
                rightTab === 'settings' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setRightTab('history')}
              className={`flex-1 py-3 text-[12px] font-semibold text-center transition-colors ${
                rightTab === 'history' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4">
            {rightTab === 'settings' && (
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-xs text-zinc-500">Model</p>
                  <p className="font-medium text-zinc-100">{model.name}</p>
                  <p className="text-xs text-zinc-500">{model.subtitle}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-xs text-zinc-500">Aspect ratio</p>
                  <p className="font-medium text-zinc-100">{ratio}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-xs text-zinc-500">Resolution</p>
                  <p className="font-medium text-zinc-100">{resolution}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-xs text-zinc-500">Negative prompt</p>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Avoid objects, style or artifacts..."
                    className="h-20 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {rightTab === 'history' && (
              <div className="space-y-2">
                {resultImages.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                    <p className="text-[13px] text-zinc-500">No generations yet</p>
                    <p className="text-[11px] text-zinc-600 mt-1">Generate images to see them here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {resultImages.map((img, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-white/[0.06] group relative cursor-pointer">
                        <img src={img} alt={`Gen ${i+1}`} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
                        <button
                          onClick={() => handleDownload(img, i)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
