import { Brain, MessageSquare, Sparkles, Workflow, BarChart3, Users } from "lucide-react";

const solutions = [
  {
    icon: Brain,
    title: "AI ile Akıllı Eşleştirme",
    benefit: "Müşterinin tercihlerini öğrenir, en uygun ilanları otomatik eşleştirir.",
    proof: "%32 daha yüksek kapanış oranı",
  },
  {
    icon: MessageSquare,
    title: "Çok Kanallı Etkileşim",
    benefit: "E-posta, SMS ve WhatsApp ile otomatik takip.",
    proof: "%45 daha fazla geri dönüş",
  },
  {
    icon: Workflow,
    title: "Otomasyonla Süreç Kısaltma",
    benefit: "İlan yayınlama, fiyat güncelleme, randevu planlama tek akışta.",
    proof: "Aylık 48 saat zaman tasarrufu",
  },
  {
    icon: BarChart3,
    title: "Gelir Odaklı Raporlama",
    benefit: "Kanal bazlı performans, komisyon takibi, tahsilat görünürlüğü.",
    proof: "%18 ek gelir potansiyeli",
  },
  {
    icon: Users,
    title: "Takım Verimliliği",
    benefit: "Roller, görevler, onay akışları ile sorumluluk netliği.",
    proof: "%25 daha hızlı operasyon",
  },
  {
    icon: Sparkles,
    title: "No-Code Entegrasyonlar",
    benefit: "n8n ile WordPress ve pazaryerlerine dakikalar içinde bağlanın.",
    proof: "15+ hazır entegrasyon",
  },
];

export function Solutions() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Çözümlerimiz</h2>
        <p className="mt-3 text-muted max-w-2xl">Satış huninizdeki tıkanıklıkları veri ve otomasyonla giderin; lead’leri sıcak tutun, fırsatları hızla kapatın.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, title, benefit, proof }) => (
            <div key={title} className="rounded-xl border border-border/60 bg-card/60 p-6 hover:border-primary/50 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-inset ring-primary/30">
                <Icon className="text-primary" size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{benefit}</p>
              <p className="mt-3 text-xs text-accent">{proof}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


