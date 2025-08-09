import { Solutions } from "@/components/Solutions";
import { CTA } from "@/components/CTA";
export const metadata = {
  title: "Çözümler – Emlak Takip",
  description: "AI eşleştirme, otomasyon ve raporlama ile satış huninizi hızlandırın.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Çözümler</h1>
          <p className="mt-3 text-muted max-w-2xl">Detaylı çözüm başlıkları ve kullanım senaryoları.</p>
        </div>
      </section>
      <Solutions />
      <CTA />
    </div>
  );
}


