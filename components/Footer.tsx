import Link from "next/link";

const CATEGORIES = [
  { label: "Product", labelJp: "プロダクト" },
  { label: "Brand Story", labelJp: "ブランド" },
  { label: "Collection", labelJp: "コレクション" },
  { label: "Culture", labelJp: "カルチャー" },
  { label: "Report", labelJp: "レポート" },
  { label: "Essay", labelJp: "エッセイ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <p className="text-[13px] tracking-[0.25em] font-bold uppercase">
              Considered Japan
            </p>
            <p
              className="text-[11px] text-muted mt-1"
              style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.12em" }}
            >
              考えられた日本
            </p>
            <p className="text-[13px] leading-[1.9] tracking-wide text-muted mt-6 max-w-sm">
              A curation platform dedicated to Japanese fashion brands
              that prioritize craft, intention, and quiet design.
            </p>
            <p
              className="text-[12px] leading-[1.9] text-muted/60 mt-3 max-w-sm"
              style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.04em" }}
            >
              クラフト、意志、静かなデザインを重視する日本のファッションブランドを紹介するキュレーションメディア。
            </p>
          </div>

          {/* Categories column */}
          <div className="md:col-span-3">
            <p className="section-label mb-5">
              Categories
              <span className="section-label-jp">カテゴリー</span>
            </p>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={`/?cat=${cat.label.toLowerCase().replace(" ", "-")}`}
                    className="text-[12px] tracking-wide text-muted hover:text-ink transition-colors"
                  >
                    {cat.label}
                    <span
                      className="text-[10px] ml-2 text-muted/50"
                      style={{ fontFamily: "var(--font-jp)" }}
                    >
                      {cat.labelJp}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About column */}
          <div className="md:col-span-4">
            <p className="section-label mb-5">
              About
              <span className="section-label-jp">このサイトについて</span>
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[12px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  About Considered Japan
                </Link>
              </li>
              <li>
                <span className="text-[12px] tracking-wide text-muted">
                  Contact — hello@consideredjapan.com
                </span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-[11px] tracking-wide text-muted">
                Published from Tokyo, Japan
              </p>
              <p
                className="text-[10px] text-muted/50 mt-1"
                style={{ fontFamily: "var(--font-jp)" }}
              >
                東京より発信
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] tracking-widest uppercase text-muted">
            © {new Date().getFullYear()} Considered Japan
          </p>
          <p className="text-[10px] tracking-widest uppercase text-muted/50">
            Curated fashion intelligence from Japan
          </p>
        </div>
      </div>
    </footer>
  );
}
