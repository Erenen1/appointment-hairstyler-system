"use client";
import { useEffect, useState } from "react";

function useCounter(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.floor(t * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export function Stats() {
  const leads = useCounter(1200);
  const timeSaved = useCounter(48);
  const closeRate = useCounter(32);
  const integrations = useCounter(15);

  return (
    <section className="py-12">
      <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aylık yeni lead" value={leads} suffix="+" />
        <StatCard label="Zaman tasarrufu" value={timeSaved} suffix="saat/ay" />
        <StatCard label="Kapanış oranı artışı" value={closeRate} suffix="%" />
        <StatCard label="Hazır entegrasyon" value={integrations} suffix="+" />
      </div>
    </section>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-6 text-center">
      <div className="text-3xl font-bold tracking-tight">{value}{suffix ? ` ${suffix}` : ""}</div>
      <div className="mt-2 text-sm text-muted">{label}</div>
    </div>
  );
}


