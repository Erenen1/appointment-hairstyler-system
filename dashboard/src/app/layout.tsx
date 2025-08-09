import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emlak Takip – Emlakçılara Özel SaaS",
    template: "%s | Emlak Takip",
  },
  description:
    "AI önerileri, otomatik iletişim ve entegrasyonlarla emlak ofisinizi tek panelde yönetin.",
  keywords: [
    "emlak saas",
    "emlak crm",
    "emlak otomasyon",
    "sahibinden entegrasyon",
    "emlakjet entegrasyon",
    "n8n",
    "wordpress",
  ],
  applicationName: "Emlak Takip",
  authors: [{ name: "Emlak Takip" }],
  alternates: { canonical: "/", languages: { "tr-TR": "/" } },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Emlak Takip – Emlakçılara Özel SaaS",
    description:
      "AI önerileri, otomatik iletişim ve entegrasyonlarla emlak ofisinizi tek panelde yönetin.",
    siteName: "Emlak Takip",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emlak Takip – Emlakçılara Özel SaaS",
    description:
      "AI önerileri, otomatik iletişim ve entegrasyonlarla emlak ofisinizi tek panelde yönetin.",
  },
  category: "real estate",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Header />
        {children}
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
