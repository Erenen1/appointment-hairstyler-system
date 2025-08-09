const steps = [
  {
    title: "WordPress Bağlantısı",
    desc: "İlanlar ve talepler WP REST API ile içe alınır.",
  },
  {
    title: "n8n Akışları",
    desc: "Lead yönlendirme, bildirim ve raporlama otomasyona bağlanır.",
  },
  {
    title: "AI Skorlama",
    desc: "Lead ve ilan eşlemesi, kapanış olasılığına göre önceliklenir.",
  },
  {
    title: "CRM ve Raporlama",
    desc: "Takip ve performans görünürlüğü tek panelde sunulur.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-grid">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nasıl Çalışır?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-border/60 bg-card/70 p-6">
              <div className="absolute -top-3 left-4 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/40">
                Adım {i + 1}
              </div>
              <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


