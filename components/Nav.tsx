"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-[11px] tracking-widest font-medium uppercase">
            Considered Japan
          </span>
          <span
            className="text-[9px] tracking-editorial text-muted"
            style={{ fontFamily: "var(--font-jp)" }}
          >
            考えられた日本
          </span>
        </Link>

        <p className="label hidden sm:block">
          Curated fashion intelligence from Japan
        </p>
      </div>
    </header>
  );
}
