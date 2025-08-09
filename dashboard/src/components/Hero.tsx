"use client";
// import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroBullets } from "@/components/HeroBullets";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.25]" />
      <div className="container py-16 md:py-24 grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Daha Hızlı Kapanış. Daha Az Operasyon.
          </motion.h1>
          <motion.p
            className="mt-6 text-muted text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Gelişmiş AI önerileri, otomatik iletişim ve tek tık entegrasyonlarla emlak ofisinizi büyütün.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Ücretsiz Deneyin
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center rounded-md border border-border/70 px-5 py-3 text-sm font-medium hover:bg-card/40"
            >
              Çözümleri Gör
            </Link>
          </motion.div>
          <p className="mt-6 text-sm text-muted">İlk 30 gün ücretsiz. Kredi kartı gerekmez.</p>
          <HeroBullets />
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="absolute -inset-24 -z-10 bg-primary/25 blur-3xl opacity-20 rounded-full" />
          <div className="relative rounded-xl border border-border/60 bg-card/60 p-0 shadow-2xl overflow-hidden">
            {/* Buraya gerçek dashboard/video yerleştirebilirsiniz */}
            <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary/30 via-card to-card flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-semibold">AI Eşleştirme • Otomasyon • Entegrasyon</div>
                <div className="mt-2 text-sm text-muted">Gerçek panel/ürün videosu burada oynatılabilir</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


