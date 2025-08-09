import { Pricing } from "@/components/Pricing";
import { ROI } from "@/components/ROI";
import { CTA } from "@/components/CTA";
export const metadata = {
  title: "Fiyatlandırma – Emlak Takip",
  description: "Temel, Profesyonel ve Kurumsal paketler. 30 gün ücretsiz deneyin.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Paketler</h1>
          <p className="mt-3 text-muted max-w-2xl">İhtiyacınıza göre ölçeklenebilir fiyatlama.</p>
        </div>
      </section>
      <Pricing />
      <ROI />
      <CTA />
    </div>
  );
}


