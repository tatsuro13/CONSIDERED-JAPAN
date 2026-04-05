"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-[12px] tracking-widest font-bold uppercase">
            Considered Japan
          </span>
          <span
            className="text-[9px] tracking-editorial text-muted hidden sm:inline"
            style={{ fontFamily: "var(--font-jp)" }}
          >
            考えられた日本
          </span>
        </Link>

        <p className="text-[10px] tracking-widest uppercase text-muted hidden md:block">
          Curated fashion intelligence from Japan
        </p>
      </div>
    </header>
  );
}
