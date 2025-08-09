import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
export const metadata = {
  title: "Hizmetler – Emlak Takip",
  description: "AI, otomasyon, portföy ve finans yönetimi özellikleri.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Hizmetler</h1>
          <p className="mt-3 text-muted max-w-2xl">Tüm özellikler ve ekran örnekleri.</p>
        </div>
      </section>
      <Features />
      <CTA />
    </div>
  );
}


