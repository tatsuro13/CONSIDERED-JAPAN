import Image from "next/image";
import Link from "next/link";
import { getSeasonPicks, getBrands } from "@/lib/notion";

export const revalidate = 60;

export default async function Home() {
  const [picks, brands] = await Promise.all([getSeasonPicks(), getBrands()]);
  const featured = picks.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="cinema">
          <Image
            src={featured[0]?.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2400&q=85"}
            alt="CONSIDERED JAPAN"
            fill
            priority
            className="object-cover grayscale"
          />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute bottom-8 left-6 md:left-12">
            <p className="text-[10px] tracking-widest uppercase text-white/70 mb-2">
              The English guide to Japan&apos;s most thoughtful fashion
            </p>
            <h1 className="text-white text-2xl md:text-4xl tracking-widest uppercase font-light">
              Considered Japan
            </h1>
            <p className="text-white/70 text-xs mt-1" style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.15em" }}>
              考えられた日本のファッション
            </p>
          </div>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-border">
        <div className="max-w-xl">
          <p className="bilingual-en text-ink leading-loose">
            Japan's most considered fashion exists largely outside the international conversation.
            We change that — one brand, one season at a time.
          </p>
          <p className="bilingual-jp text-muted mt-3">
            日本の優れたファッションの多くは、国際的な場で語られることなく存在している。
            私たちはそれを変えていく。
          </p>
        </div>
      </section>

      {/* Featured grid */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-baseline mb-8 rule pt-0 border-t border-border pb-4">
            <div>
              <p className="label">LATEST</p>
              <p className="label-jp mt-0.5">最新情報</p>
            </div>
            <Link href="/season" className="label hover:text-ink transition-colors">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {featured.map((item) => (
              <Link
                key={item.id}
                href={`/season/${item.slug}`}
                className="group bg-paper block"
              >
                <div className="cinema overflow-hidden relative bg-border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-border" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="label">{item.tag}</span>
                    <span className="label-jp">{item.tagJp}</span>
                  </div>
                  <p className="text-xs tracking-wide font-medium uppercase">{item.brand}</p>
                  <p className="bilingual-en mt-1 text-xs">{item.title}</p>
                  <p className="bilingual-jp text-muted text-xs">{item.titleJp}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brand strip */}
      <section className="border-t border-border py-8 overflow-hidden">
        <div className="flex gap-12 px-6 overflow-x-auto scrollbar-none">
          {(brands.length > 0 ? brands : []).map((b) => (
            <span key={b.id} className="label whitespace-nowrap">{b.name}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
