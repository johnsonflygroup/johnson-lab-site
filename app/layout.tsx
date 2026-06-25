import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Johnson Lab | Rare metabolic disease research",
  description:
    "Johnson Lab at La Trobe University: cell signalling, rare metabolic disease, preclinical treatments, and innovative research tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
