import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
export const metadata = {
  title: "Referanslar – Emlak Takip",
  description: "Gerçek emlakçı yorumları ve başarı hikayeleri.",
  alternates: { canonical: "/customers" },
};

export default function CustomersPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Referanslar</h1>
          <p className="mt-3 text-muted max-w-2xl">Gerçek emlakçı deneyimleri ve başarı hikayeleri.</p>
        </div>
      </section>
      <Testimonials />
      <CTA />
    </div>
  );
}


