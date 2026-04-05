'use client';

import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import { KreaHero } from '@/components/krea-hero';
import { KreaFeatureCards } from '@/components/krea-feature-cards';
import { MegaBentoGrid } from '@/components/mega-bento-grid';
import { TrustedByMarquee } from '@/components/trusted-by-marquee';
import { UseCasesSection } from '@/components/use-cases-section';

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-black selection:bg-black selection:text-white pb-0">
      <Navbar theme="dark" />
      <KreaHero />
      <KreaFeatureCards />
      <MegaBentoGrid />
      <TrustedByMarquee />
      <UseCasesSection />
      <Footer theme="light" />
    </main>
  );
}
