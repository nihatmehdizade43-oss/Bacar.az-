/* ============================================
   Bacar.az — Landing Sayfası (Ana Səhifə)
   ============================================ */
import HeroSection from '@/components/landing/HeroSection';
import ModuleCards from '@/components/landing/ModuleCards';
import StatsCounter from '@/components/landing/StatsCounter';
import CTASection from '@/components/landing/CTASection';
import AlovluElanlar from '@/components/ui/AlovluElanlar';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ModuleCards />
      <AlovluElanlar />
      <StatsCounter />
      <CTASection />
    </>
  );
}
