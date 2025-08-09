export function HeroBullets() {
  const bullets = [
    {
      title: "AI ile Doğru Mülk, Doğru Müşteri",
      desc: "Davranışsal analizle en uygun ilanları otomatik eşleştirir.",
    },
    {
      title: "Otomatik Takip, Sıcak Lead Kaybetme",
      desc: "E-posta/SMS/WhatsApp ile çok kanallı otomasyon.",
    },
    {
      title: "Tek Panelden Entegrasyon",
      desc: "WordPress, n8n ve pazaryerleriyle saniyeler içinde bağlantı.",
    },
  ];

  return (
    <ul className="mt-10 space-y-5">
      {bullets.map((b) => (
        <li key={b.title} className="flex flex-col">
          <span className="text-base font-semibold">{b.title}</span>
          <span className="mt-1 text-sm text-muted">{b.desc}</span>
        </li>
      ))}
    </ul>
  );
}


