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
  iconBg: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Visual Canvas",
    description:
      "Drag, drop, and connect nodes on an infinite React Flow canvas",
  },
  {
    icon: Brain,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Gemini AI",
    description:
      "Run Google Gemini models with full vision support",
  },
  {
    icon: GitBranch,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Parallel Execution",
    description:
      "Independent branches run concurrently with DAG ordering",
  },
  {
    icon: Upload,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Media Processing",
    description:
      "Upload images/videos, crop frames, chain into workflow",
  },
  {
    icon: History,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    title: "Workflow History",
    description:
      "Every run tracked with node-level details and timing",
  },
  {
    icon: Shield,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    title: "Secure & Fast",
    description:
      "Clerk auth, PostgreSQL persistence, deployed on Vercel",
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="group flex flex-col gap-4 bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 rounded-2xl p-6 transition-colors duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${feature.iconBg}`}
                aria-hidden="true"
              >
                <Icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
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
