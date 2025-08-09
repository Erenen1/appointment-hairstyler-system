import { Hero } from "@/components/Hero";
// import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
// import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
// import { Contact } from "@/components/Contact";
// import { SectionsDivider } from "@/components/SectionsDivider";
import { LogoMarquee } from "@/components/LogoMarquee";
import { ValueProps } from "@/components/ValueProps";
import { FloatingCTA } from "@/components/FloatingCTA";
export const metadata = {
  title: "Emlak Takip – Emlakçılara Özel SaaS",
  description: "Emlak ofisleri için AI önerileri, otomatik iletişim ve entegrasyonlar. 30 gün ücretsiz deneyin.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="font-sans">
      <main>
        <Hero />
        <LogoMarquee />
        <ValueProps />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <FloatingCTA />
    </div>
  );
}
