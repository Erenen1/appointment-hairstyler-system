"use client";
import { useMemo, useState } from "react";

export function ROI() {
  const [agentCount, setAgentCount] = useState(5);
  const [avgCommission, setAvgCommission] = useState(50000); // TL
  const [monthlyDeals, setMonthlyDeals] = useState(8);

  const result = useMemo(() => {
    const base = agentCount * monthlyDeals * avgCommission;
    const uplift = 0.18; // çözümlerle varsayılan gelir artışı
    const timeSavings = agentCount * 48 * 300; // saat * saatlik değer (varsayılan 300 TL)
    const total = base * uplift + timeSavings;
    return Math.round(total);
  }, [agentCount, avgCommission, monthlyDeals]);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">ROI Hesaplayıcı</h2>
        <p className="mt-3 text-muted max-w-2xl">Çözümlerimizi kullandığınızda beklenen aylık ek kazancı tahmini olarak görün.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
            <Field label="Danışman sayısı">
              <input type="range" min={1} max={50} value={agentCount} onChange={(e) => setAgentCount(Number(e.currentTarget.value))} className="w-full" />
              <div className="mt-1 text-sm text-muted">{agentCount} kişi</div>
            </Field>
            <Field label="Aylık ort. kapanan işlem">
              <input type="range" min={1} max={50} value={monthlyDeals} onChange={(e) => setMonthlyDeals(Number(e.currentTarget.value))} className="w-full" />
              <div className="mt-1 text-sm text-muted">{monthlyDeals} işlem</div>
            </Field>
            <Field label="Ortalama komisyon (TL)">
              <input type="range" step={1000} min={10000} max={150000} value={avgCommission} onChange={(e) => setAvgCommission(Number(e.currentTarget.value))} className="w-full" />
              <div className="mt-1 text-sm text-muted">₺{avgCommission.toLocaleString("tr-TR")}</div>
            </Field>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-muted">Tahmini aylık ek kazanç</div>
            <div className="mt-2 text-4xl font-bold tracking-tight">₺{result.toLocaleString("tr-TR")}</div>
            <p className="mt-4 text-sm text-muted max-w-sm">Hesaplamalar varsayımsaldır; sektör, bölge ve ekip dinamiklerine göre değişebilir.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}


