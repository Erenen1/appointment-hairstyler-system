"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const light = saved === "light";
    setIsLight(light);
    applyTheme(light);
  }, []);

  function applyTheme(light: boolean) {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (light) {
      html.setAttribute("data-theme", "light");
    } else {
      html.removeAttribute("data-theme");
    }
  }

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    applyTheme(next);
    if (typeof window !== "undefined") {
      if (next) localStorage.setItem("theme", "light");
      else localStorage.removeItem("theme");
    }
  }

  if (!mounted) {
    return (
      <button aria-label="Tema Değiştir" className="inline-flex h-9 items-center gap-2 rounded-md border border-border/60 px-3 text-sm">
        <Sun size={16} className="opacity-60" />
        <span className="hidden sm:inline">Açık Tema</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Tema Değiştir"
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border/60 px-3 text-sm hover:bg-card/50"
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{isLight ? "Koyu Tema" : "Açık Tema"}</span>
    </button>
  );
}


