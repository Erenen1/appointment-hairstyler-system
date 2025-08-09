"use client";
import { useState } from "react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("İstek başarısız");
      setStatus("success");
      setMessage("Başvurunuz alındı. En kısa sürede dönüş yapacağız.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bize Ulaşın</h2>
          <p className="mt-3 text-muted">
            Sorularınız ve entegrasyon talepleriniz için formu doldurun; ekibimiz 24 saat içinde dönüş yapar.
          </p>
          <div className="mt-6 space-y-2 text-sm text-muted">
            <p>E-posta: destek@propflow.app</p>
            <p>Telefon: +90 212 000 00 00</p>
            <p>Hafta içi 09:00 – 18:00</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Ad Soyad</label>
              <input name="name" required className="mt-1 w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/70" />
            </div>
            <div>
              <label className="text-sm">E-posta</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/70" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm">Telefon</label>
            <input name="phone" className="mt-1 w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/70" />
          </div>
          <div className="mt-4">
            <label className="text-sm">Mesajınız</label>
            <textarea name="message" rows={4} className="mt-1 w-full rounded-md border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/70" />
          </div>
          <button
            disabled={status === "loading"}
            className="mt-5 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {status === "loading" ? "Gönderiliyor…" : "Gönder"}
          </button>
          {message && (
            <p className={`mt-3 text-sm ${status === "success" ? "text-accent" : "text-muted"}`}>{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}


