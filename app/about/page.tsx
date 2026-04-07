import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://considered-japan.vercel.app";

export const metadata: Metadata = {
  title: "About",
  description:
    "Considered Japan is a curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About — CONSIDERED JAPAN",
    description:
      "A curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About CONSIDERED JAPAN",
    description:
      "A curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "CONSIDERED JAPAN",
      alternateName: "考えられた日本",
      url: SITE_URL,
      description:
        "A curation platform dedicated to Japanese fashion brands that prioritize craft, intention, and quiet design.",
      foundingLocation: {
        "@type": "Place",
        name: "Tokyo, Japan",
      },
      knowsAbout: [
        "Japanese fashion",
        "COMOLI",
        "sacai",
        "nonnative",
        "Graphpaper",
        "HYKE",
        "AURALEE",
        "ATON",
        "Porter Classic",
        "Hender Scheme",
        "TEATORA",
      ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-16 lg:py-24">
        {/* Main content */}
        <div className="lg:col-span-8">
          <p className="label mb-8">About</p>

          <h1 className="headline-xl mb-6">
            Considered Japan
          </h1>
          <p
            className="text-lg md:text-xl text-muted title-jp mb-12"
            style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.06em" }}
          >
            考えられた日本
          </p>

          <div className="space-y-8 max-w-2xl">
            <p className="bilingual-en">
              Considered Japan is a curation platform dedicated to Japanese
              fashion brands that prioritize craft, intention, and quiet
              design. We cover the designers, collections, and cultural
              narratives that define Japan&apos;s most thoughtful approach to
              clothing.
            </p>
            <p
              className="bilingual-jp"
            >
              Considered Japanは、クラフト、意志、静かなデザインを重視する日本のファッションブランドに特化したキュレーションメディアです。日本の衣服づくりにおける最も思慮深いアプローチを定義するデザイナー、コレクション、そして文化的な物語を取り上げます。
            </p>

            <hr className="border-border my-12" />

            <h2 className="headline-sm font-medium mb-4">What We Cover</h2>
            <p className="bilingual-en">
              From COMOLI&apos;s understated essentials to sacai&apos;s
              deconstructed hybrids, from nonnative&apos;s urban utility to
              Graphpaper&apos;s architectural silhouettes — we curate stories
              about brands that make clothing worth considering.
            </p>
            <p className="bilingual-jp">
              COMOLIの控えめなエッセンシャルからsacaiの解体的ハイブリッド、nonnativeのアーバンユーティリティからGraphpaperの建築的シルエットまで——「考える価値のある服」をつくるブランドの物語をキュレーションします。
            </p>

            <hr className="border-border my-12" />

            <h2 className="headline-sm font-medium mb-4">Categories</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Product — プロダクト</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  New releases, seasonal drops, and product analysis.
                </dd>
              </div>
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Brand Story — ブランドストーリー</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  Deep dives into the philosophy and craft behind each label.
                </dd>
              </div>
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Collection — コレクション</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  Seasonal collection reviews and runway analysis.
                </dd>
              </div>
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Culture — カルチャー</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  The broader cultural context of Japanese fashion.
                </dd>
              </div>
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Report — レポート</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  Event coverage, fashion week dispatches, and industry reports.
                </dd>
              </div>
              <div>
                <dt className="text-[13px] tracking-wide font-medium">Essay — エッセイ</dt>
                <dd className="text-[13px] text-muted mt-1 leading-relaxed tracking-wide">
                  Opinion pieces and personal perspectives on Japanese fashion.
                </dd>
              </div>
            </dl>

            <hr className="border-border my-12" />

            <p className="text-[13px] text-muted tracking-wide leading-[1.9]">
              Published from Tokyo, Japan.
            </p>
            <p
              className="text-[12px] text-muted/60 leading-[1.9]"
              style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.04em" }}
            >
              東京より発信。
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 lg:border-l lg:border-border lg:pl-12">
          <div className="sticky top-24">
            <p className="section-label mb-5">
              Contact
              <span className="section-label-jp">お問い合わせ</span>
            </p>
            <p className="text-[13px] text-muted tracking-wide leading-relaxed">
              hello@consideredjapan.com
            </p>

            <div className="mt-12">
              <p className="section-label mb-5">
                Featured Brands
                <span className="section-label-jp">注目ブランド</span>
              </p>
              <ul className="space-y-2 text-[12px] tracking-wide text-muted">
                <li>COMOLI</li>
                <li>sacai</li>
                <li>nonnative</li>
                <li>Graphpaper</li>
                <li>HYKE</li>
                <li>AURALEE</li>
                <li>ATON</li>
                <li>Porter Classic</li>
                <li>Hender Scheme</li>
                <li>TEATORA</li>
              </ul>
            </div>

            <div className="mt-12">
              <Link
                href="/"
                className="text-[12px] tracking-widest uppercase text-muted hover:text-ink transition-colors"
              >
                ← Back to Feed
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
