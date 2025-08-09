"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Verdiğiniz hizmetlere nasıl erişebilirim?",
    a: "Hesap oluşturup giriş yaptıktan sonra kontrol panelinden tüm modüllere erişebilirsiniz.",
  },
  {
    q: "Sistem ne kadar güvenli?",
    a: "Verileriniz şifrelenmiş olarak saklanır ve erişimler rol tabanlı olarak sınırlandırılır.",
  },
  {
    q: "Veri entegrasyonları nasıl yapılır?",
    a: "Açık API'miz ve hazır n8n iş akışları ile WordPress ve üçüncü parti platformlarla hızlı entegrasyon sağlanır.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sıkça Sorulan Sorular</h2>
        <div className="mt-8 divide-y divide-border/60 rounded-xl border border-border/60 bg-card/50">
          {faqs.map((item, idx) => (
            <div key={item.q}>
              <button
                className="w-full px-6 py-4 text-left font-medium flex items-center justify-between"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {item.q}
                <span className="text-muted text-sm">{openIndex === idx ? "–" : "+"}</span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-sm text-muted">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


