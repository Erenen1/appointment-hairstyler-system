import { Integrations } from "@/components/Integrations";
import { HowItWorks } from "@/components/HowItWorks";
import { CTA } from "@/components/CTA";
export const metadata = {
  title: "Entegrasyonlar – Emlak Takip",
  description: "WordPress, n8n, muhasebe ve pazaryerleri entegrasyonları.",
  alternates: { canonical: "/integrations" },
};

export default function IntegrationsPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Entegrasyonlar</h1>
          <p className="mt-3 text-muted max-w-2xl">WordPress, n8n, muhasebe ve pazaryeri bağlantıları.</p>
        </div>
      </section>
      <Integrations />
      <HowItWorks />
      <CTA />
    </div>
  );
}


