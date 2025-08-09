import Image from "next/image";
export function LogoMarquee() {
  const logos = [
    { name: "sahibinden", svg: "/globe.svg" },
    { name: "hepsiemlak", svg: "/globe.svg" },
    { name: "zingat", svg: "/globe.svg" },
    { name: "emlakjet", svg: "/globe.svg" },
    { name: "takas-tapu", svg: "/globe.svg" },
  ];
  // Daha uzun ve kesintisiz akış için üç kat çoğaltıyoruz
  const items = [...logos, ...logos, ...logos];

  return (
    <div className="marquee border-y border-border/60 py-8">
      <div className="marquee-content items-center">
        {items.map((l, idx) => (
          <div key={`${l.name}-${idx}`} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
            <Image src={l.svg} alt={l.name} width={28} height={28} />
            <span className="text-base text-muted capitalize">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


