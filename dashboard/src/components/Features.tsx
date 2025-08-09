import { Brain, Mail, LayoutGrid, Wallet, Plug } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Yapay Zeka Destekli Mülk Önerileri",
    desc: "Müşteri tercihlerini öğrenerek kişiselleştirilmiş mülk önerileri sunar.",
  },
  {
    icon: Mail,
    title: "Otomatik E-posta ve SMS",
    desc: "Etkileşimi artıran otomatik mesaj ve bildirim akışları.",
  },
  {
    icon: LayoutGrid,
    title: "Portföy ve İlan Yönetimi",
    desc: "Durum takibi, fiyat güncelleme ve otomatik eşleştirme ile hız kazanın.",
  },
  {
    icon: Wallet,
    title: "Finansal Yönetim",
    desc: "Komisyon paylaşımı, fatura ve ödemeleri tek panelden yönetin.",
  },
  {
    icon: Plug,
    title: "Entegre API Desteği",
    desc: "Emlak platformları ve muhasebe yazılımlarıyla çift yönlü entegrasyon.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Emlak Ofisiniz İçin Sunulan İleri Düzey Hizmetler
        </h2>
        <p className="mt-3 text-muted max-w-2xl">
          Yapay zeka, otomasyon ve entegrasyonlarla üretkenliği artırın.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="relative rounded-xl border border-border/60 bg-card/60 p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-inset ring-primary/30">
                <Icon className="text-primary" size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


