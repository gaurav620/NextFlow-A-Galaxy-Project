import {
  Zap,
  Brain,
  GitBranch,
  Upload,
  History,
  Shield,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    iconColor: "#3b82f6",
    title: "Visual Canvas",
    description:
      "Drag, drop, and connect nodes on an infinite React Flow canvas",
  },
  {
    icon: Brain,
    iconColor: "#22c55e",
    title: "Gemini AI",
    description:
      "Run Google Gemini models with full vision support",
  },
  {
    icon: GitBranch,
    iconColor: "#f97316",
    title: "Parallel Execution",
    description:
      "Independent branches run concurrently with DAG ordering",
  },
  {
    icon: Upload,
    iconColor: "#3b82f6",
    title: "Media Processing",
    description:
      "Upload images/videos, crop frames, chain into workflow",
  },
  {
    icon: History,
    iconColor: "#22c55e",
    title: "Workflow History",
    description:
      "Every run tracked with node-level details and timing",
  },
  {
    icon: Shield,
    iconColor: "#f97316",
    title: "Secure & Fast",
    description:
      "Clerk auth, PostgreSQL persistence, deployed on Vercel",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="flex flex-col gap-4 bg-[#1c1c1c] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors duration-200"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: `${feature.iconColor}15` }}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" style={{ color: feature.iconColor }} />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
