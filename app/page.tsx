import { HeroSection } from "@/components/hero-section";
import { FeatureGrid } from "@/components/feature-grid";
import { Footer } from "@/components/page-footer";

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center font-sans"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <HeroSection />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
