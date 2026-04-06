"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { label: "Product", labelJp: "プロダクト", href: "/?cat=product" },
  { label: "Brand Story", labelJp: "ブランド", href: "/?cat=brand-story" },
  { label: "Collection", labelJp: "コレクション", href: "/?cat=collection" },
  { label: "Culture", labelJp: "カルチャー", href: "/?cat=culture" },
  { label: "Report", labelJp: "レポート", href: "/?cat=report" },
  { label: "Essay", labelJp: "エッセイ", href: "/?cat=essay" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
      {/* Primary bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="text-[13px] tracking-[0.25em] font-bold uppercase">
              Considered Japan
            </span>
            <span
              className="text-[10px] text-muted hidden sm:inline"
              style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.12em" }}
            >
              考えられた日本
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-widest uppercase text-muted hidden lg:block">
              Curated Fashion Intelligence from Japan
            </span>
            <Link
              href="/about"
              className="nav-link hidden md:block"
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Category bar — only on home */}
      {isHome && (
        <div className="border-b border-border">
          <nav className="max-w-7xl mx-auto px-6 h-10 flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <Link
              href="/"
              className="nav-link nav-link-active flex-shrink-0"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="nav-link flex-shrink-0"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
