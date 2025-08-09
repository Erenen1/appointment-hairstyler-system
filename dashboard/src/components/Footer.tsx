import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" className="border-t border-border/60">
      <div className="container py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary" />
            <span className="text-base font-semibold">Emlak Takip</span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Emlakçılara özel, yapay zeka destekli SaaS.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Linkler</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/">Ana Sayfa</Link></li>
            <li><Link href="/features">Hizmetler</Link></li>
            <li><Link href="/pricing">Paketler</Link></li>
            <li><Link href="/faq">SSS</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium">Yasal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/legal/privacy">Gizlilik</Link></li>
            <li><Link href="/legal/terms">Kullanım Şartları</Link></li>
            <li><Link href="/legal/kvkk">KVKK</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium">Bülten</h4>
          <p className="mt-2 text-sm text-muted">Gelişmelerden haberdar olun.</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/70"
            />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Abone Ol
            </button>
          </form>
          <p className="mt-2 text-xs text-muted">E-posta’nızı üçüncü kişilerle paylaşmayız.</p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 text-xs text-muted flex justify-between">
          <span>© {new Date().getFullYear()} Emlak Takip</span>
          <span>Made with Next.js</span>
        </div>
      </div>
    </footer>
  );
}


