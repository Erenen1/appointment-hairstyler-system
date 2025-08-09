import Link from "next/link";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-lg">
        <Link href="#signup" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">
          Ücretsiz Deneyin
        </Link>
      </div>
    </div>
  );
}


