import { Navbar } from '@/components/krea-navbar';
import { Footer } from '@/components/krea-footer';
import { Pricing } from '@/components/krea-pricing';

export default function PricingPage() {
  return (
    <main className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar theme="dark" />
      
      {/* Spacer for fixed navbar since Pricing component has own top padding, but need to make sure it clears */}
      <div className="pt-20 bg-black" />
      
      <Pricing />
      
      <Footer theme="dark" />
    </main>
  );
}
