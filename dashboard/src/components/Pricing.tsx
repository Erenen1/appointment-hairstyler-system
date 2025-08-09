"use client";
import { useMemo, useState } from "react";

type Plan = {
  name: string;
  baseMonthly: number | null; // null for contact-us
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const basePlans: Plan[] = [
  {
    name: "Temel",
    baseMonthly: 499,
    description: "Küçük ekipler için temel işlevler",
    features: [
      "Portföy yönetimi",
      "Basit CRM",
      "Sınırlı raporlama",
      "3 kullanıcıya kadar",
    ],
    cta: "Başla",
  },
  {
    name: "Profesyonel",
    baseMonthly: 999,
    description: "Büyüyen ekipler için gelişmiş özellikler",
    features: [
      "AI önerileri",
      "Otomatik e-posta/SMS",
      "Gelişmiş raporlama",
      "10 kullanıcıya kadar",
    ],
    cta: "Başla",
    highlighted: true,
  },
  {
    name: "Kurumsal",
    baseMonthly: null,
    description: "Büyük ekipler için tam esneklik",
    features: [
      "API entegrasyonları",
      "Özel destek",
      "Sınırsız erişim",
    ],
    cta: "Teklif Al",
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const discount = 0.1; // yıllık %10 indirim
  const plans = useMemo(() => basePlans, []);

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Fiyatlandırma Paketlerimiz
        </h2>
        <p className="mt-3 text-muted">İlk 30 gün ücretsiz. Yıllık abonelikte %10 indirim. 14 günde iptal edilebilir.</p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-1 text-sm">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-3 py-1.5 ${
              billing === "monthly" ? "bg-primary text-primary-foreground" : "hover:bg-card"
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-md px-3 py-1.5 ${
              billing === "yearly" ? "bg-primary text-primary-foreground" : "hover:bg-card"
            }`}
          >
            Yıllık (%10 indirim)
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 transition-colors ${
                plan.highlighted
                  ? "border-primary/70 bg-card/70 shadow-xl"
                  : "border-border/60 bg-card/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 right-4 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/40">
                  Önerilen
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-2 text-2xl font-bold">
                {plan.baseMonthly === null
                  ? "İletişime geçin"
                  : billing === "monthly"
                  ? `₺${plan.baseMonthly}/ay`
                  : `₺${Math.round(plan.baseMonthly * (1 - discount))}/ay`}
              </div>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                {plan.cta}
              </button>
              <p className="mt-2 text-xs text-muted">30 gün ücretsiz dene, memnun kalmazsan iptal et.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


