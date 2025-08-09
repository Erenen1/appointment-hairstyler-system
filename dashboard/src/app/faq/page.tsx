import { FAQ } from "@/components/FAQ";
export const metadata = {
  title: "SSS – Emlak Takip",
  description: "Platform, güvenlik ve entegrasyonlar hakkında sıkça sorulan sorular.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sıkça Sorulan Sorular</h1>
          <p className="mt-3 text-muted max-w-2xl">Platform, güvenlik ve entegrasyonlarla ilgili sık sorulan sorular.</p>
        </div>
      </section>
      <FAQ />
    </div>
  );
}


