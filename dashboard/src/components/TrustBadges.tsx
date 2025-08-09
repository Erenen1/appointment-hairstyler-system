export function TrustBadges() {
  return (
    <section className="py-10">
      <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Badge title="KVKK Uyumlu" desc="Veri güvenliği ve gizlilik önceliğimiz." />
        <Badge title="%99,9 Uptime" desc="Bulut altyapı ve ölçeklenebilir mimari." />
        <Badge title="SSO ve RBAC" desc="Kurumsal kimlik ve rol tabanlı erişim." />
        <Badge title="Destek SLA" desc="Öncelikli destek ve çözüm süreleri." />
      </div>
    </section>
  );
}

function Badge({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted">{desc}</div>
    </div>
  );
}


