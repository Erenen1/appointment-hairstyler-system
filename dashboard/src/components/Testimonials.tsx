type Testimonial = {
  quote: string;
  name: string;
  company: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Portföy ve müşteri süreçlerimiz %40 hızlandı. AI önerileri ile daha hızlı kapanış yapıyoruz.",
    name: "Elif K.",
    company: "Mavi Emlak",
  },
  {
    quote:
      "Otomatik e-posta ve SMS akışları sayesinde sıcak müşteri kaybımız neredeyse yok.",
    name: "Murat A.",
    company: "Atlas Gayrimenkul",
  },
  {
    quote:
      "WordPress ve muhasebe entegrasyonları ile tüm veriyi tek panelden yönetiyoruz.",
    name: "Seda Y.",
    company: "Nova Realty",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Müşterilerimiz Ne Diyor?
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border/60 bg-card/60 p-6"
            >
              <blockquote className="text-sm leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-medium text-foreground">{t.name}</span> · {t.company}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


