'use client';

import { Navbar } from '@/components/krea-navbar';
import { KreaHero } from '@/components/krea-hero';
import { PowersMillion } from '@/components/powers-million';
import { FeaturesTabSection } from '@/components/features-tab-section';
import { MegaBentoGrid } from '@/components/mega-bento-grid';
import { SimpleUISection } from '@/components/simple-ui-section';
import { ModelShowcaseSection } from '@/components/model-showcase-section';
import { PricingSection } from '@/components/pricing-section';
import { BackedBySection } from '@/components/backed-by-section';
import { Footer } from '@/components/krea-footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-black selection:text-white">
      {/* Dark navbar over dark hero */}
      <Navbar theme="dark" />

      {/* 1. Hero: dark bg + app mockup + horizontal card scroll */}
      <KreaHero />

      {/* 2. Powers millions: dark section with brand marquee */}
      <PowersMillion />

      {/* 3. Features tab: left list + right image panel */}
      <FeaturesTabSection />

      {/* 4. Bento stats grid: mixed dark/light */}
      <MegaBentoGrid />

      {/* 5. Dead simple UI section (dark) */}
      <SimpleUISection />

      {/* 6. NextFlow 1 model showcase */}
      <ModelShowcaseSection />

      {/* 7. Pricing cards */}
      <PricingSection />

      {/* 8. Backed by VCs + hiring */}
      <BackedBySection />

      {/* 9. Footer */}
      <Footer theme="light" />
    </main>
  );
}
