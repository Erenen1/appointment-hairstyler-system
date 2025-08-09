import Link from "next/link";

export function CTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 via-card/60 to-card/60 p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Siz de Emlak Ofisinizi Dijital Dönüşüme Taşıyın!
          </h3>
          <p className="mt-2 text-muted">
            Tüm süreçler tek panelde. Yapay zeka, otomasyon ve entegrasyonlarla verimliliğinizi artırın.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="#signup"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


