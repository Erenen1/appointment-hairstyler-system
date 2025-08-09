import { Brain, MessageSquare, Plug } from "lucide-react";
import Link from "next/link";

const items = [
  {
    icon: Brain,
    title: "AI ile Doğru Eşleştirme",
    desc: "Davranışsal analizle en uygun ilanları otomatik önerir.",
    href: "/solutions",
  },
  {
    icon: MessageSquare,
    title: "Otomatik İletişim",
    desc: "E-posta/SMS/WhatsApp ile çok kanallı takip.",
    href: "/solutions",
  },
  {
    icon: Plug,
    title: "Tek Panel Entegrasyon",
    desc: "WordPress, n8n ve pazaryerlerine anında bağlanın.",
    href: "/integrations",
  },
];

export function ValueProps() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc, href }) => (
            <Link
              href={href}
              key={title}
              className="rounded-xl border border-border/60 bg-card/60 p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-inset ring-primary/30">
                <Icon className="text-primary" size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
              <span className="mt-4 inline-block text-sm text-primary">Detayları gör →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


