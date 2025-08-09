"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" width={28} height={28} alt="Emlak Takip logo" />
          <span className="text-lg font-semibold tracking-tight">Emlak Takip</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">Ana Sayfa</Link>
          <Link href="/solutions" className="hover:text-foreground">Çözümler</Link>
          <Link href="/features" className="hover:text-foreground">Hizmetler</Link>
          <Link href="/integrations" className="hover:text-foreground">Entegrasyonlar</Link>
          <Link href="/pricing" className="hover:text-foreground">Paketler</Link>
          <Link href="/customers" className="hover:text-foreground">Referanslar</Link>
          <Link href="/contact" className="hover:text-foreground">İletişim</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="#trial"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Ücretsiz Deneyin
          </Link>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menüyü Aç"
        >
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60">
          <div className="container py-3 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setOpen(false)}>Ana Sayfa</Link>
            <Link href="/solutions" onClick={() => setOpen(false)}>Çözümler</Link>
            <Link href="/features" onClick={() => setOpen(false)}>Hizmetler</Link>
            <Link href="/integrations" onClick={() => setOpen(false)}>Entegrasyonlar</Link>
            <Link href="/pricing" onClick={() => setOpen(false)}>Paketler</Link>
            <Link href="/customers" onClick={() => setOpen(false)}>Referanslar</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>İletişim</Link>
            <div className="pt-2 flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="#trial"
                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                onClick={() => setOpen(false)}
              >
                Ücretsiz Deneyin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


