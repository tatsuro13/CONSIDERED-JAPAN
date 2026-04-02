import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "CONSIDERED JAPAN",
  description: "The English guide to Japan's most thoughtful fashion",
  openGraph: {
    title: "CONSIDERED JAPAN",
    description: "The English guide to Japan's most thoughtful fashion",
    type: "website",
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
        <footer className="border-t border-border mt-24 py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <p className="label">CONSIDERED JAPAN</p>
              <p className="label-jp mt-1">考えられた日本</p>
            </div>
            <div className="text-right">
              <p className="label">© {new Date().getFullYear()}</p>
              <p className="label mt-1">Tokyo, Japan</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
