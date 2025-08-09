import { Contact } from "@/components/Contact";
export const metadata = {
  title: "İletişim – Emlak Takip",
  description: "Satış ve destek ekibimizle iletişime geçin.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="font-sans">
      <section className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">İletişim</h1>
          <p className="mt-3 text-muted max-w-2xl">Sorularınız ve entegrasyon talepleriniz için bizimle iletişime geçin.</p>
        </div>
      </section>
      <Contact />
    </div>
  );
}


