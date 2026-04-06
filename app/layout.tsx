import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://considered-japan.vercel.app"),
  title: {
    template: "%s — CONSIDERED JAPAN",
    default: "CONSIDERED JAPAN — Curated Fashion Intelligence from Japan",
  },
  description:
    "A curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
  openGraph: {
    title: "CONSIDERED JAPAN",
    description:
      "A curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
    type: "website",
    siteName: "CONSIDERED JAPAN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink min-h-screen">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
