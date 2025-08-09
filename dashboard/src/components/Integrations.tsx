import { Plug } from "lucide-react";

const items = [
  { name: "WordPress", desc: "WP REST API ile ilan ve içerik senkronu" },
  { name: "n8n", desc: "No-code iş akışları, botlar ve entegrasyonlar" },
  { name: "Muhasebe", desc: "Luca/Logo ile gelir-gider, fatura"
  },
  { name: "Pazaryerleri", desc: "HepsiEmlak, Zingat, Sahibinden vb." },
];

export function Integrations() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Entegrasyonlar</h2>
            <p className="mt-3 text-muted max-w-2xl">Süreçlerinizi kullandığınız araçlarla uyumlu hale getirin. Veriye tek kaynaktan hâkim olun.</p>
          </div>
          <div className="rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30">15+ hazır entegrasyon</div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.name} className="rounded-xl border border-border/60 bg-card/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 ring-1 ring-inset ring-primary/30">
                <Plug size={18} className="text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{it.name}</h3>
              <p className="mt-2 text-sm text-muted">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


