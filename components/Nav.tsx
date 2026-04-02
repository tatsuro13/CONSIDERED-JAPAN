"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { en: "BRANDS", jp: "ブランド", href: "/brands" },
  { en: "SEASON", jp: "シーズン", href: "/season" },
  { en: "JOURNAL", jp: "読み物", href: "/journal" },
  { en: "BUY GUIDE", jp: "購入ガイド", href: "/buy-guide" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-[11px] tracking-widest font-medium uppercase">
            Considered Japan
          </span>
          <span className="text-[9px] tracking-editorial text-muted" style={{ fontFamily: "var(--font-jp)" }}>
            考えられた日本
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col items-center leading-none"
            >
              <span className="label group-hover:text-ink transition-colors">
                {l.en}
              </span>
              <span className="label-jp group-hover:text-ink transition-colors">
                {l.jp}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <span className={`block w-5 h-px bg-ink transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-ink transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-ink transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-paper">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex justify-between items-center px-6 py-4 border-b border-border"
              onClick={() => setOpen(false)}
            >
              <span className="label">{l.en}</span>
              <span className="label-jp">{l.jp}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
