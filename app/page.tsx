import Link from "next/link";
import Image from "next/image";
import { getFeedItems } from "@/lib/notion";

export const revalidate = 60;

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function categoryBadge(category: string) {
  if (!category) return null;
  const cls =
    category === "Product" ? "badge-product" :
    category === "Essay" ? "badge-essay" :
    category === "Collection" ? "badge-collection" :
    category === "Brand Story" ? "badge-brand-story" :
    category === "Report" ? "badge-report" :
    category === "Culture" ? "badge-culture" :
    "badge-product";
  return <span className={`badge ${cls}`}>{category}</span>;
}

export default async function FeedPage() {
  const items = await getFeedItems();
  const hero = items[0];
  const featured = items.slice(1, 5);
  const rest = items.slice(5);

  return (
    <div>
      {/* ── Hero ── */}
      {hero && (
        <section>
          <Link href={`/read/${hero.slug}`} className="group block relative">
            {hero.heroImage ? (
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2.4/1" }}>
                <Image
                  src={hero.heroImage}
                  alt={hero.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="flex items-center gap-3 mb-3">
                    {categoryBadge(hero.category)}
                    {hero.sourceName && (
                      <span className="text-[10px] tracking-widest uppercase text-white/60">
                        {hero.sourceName}
                      </span>
                    )}
                    <span className="text-[10px] tracking-widest text-white/40">
                      {formatDate(hero.date)}
                    </span>
                  </div>
                  <h2 className="text-white text-xl md:text-3xl title-en max-w-4xl">
                    {hero.title}
                  </h2>
                  {hero.titleJp && (
                    <p className="text-white/50 text-sm md:text-base mt-2 title-jp">
                      {hero.titleJp}
                    </p>
                  )}
                  {hero.summary && (
                    <p className="text-white/60 text-sm mt-4 max-w-2xl leading-relaxed hidden md:block">
                      {hero.summary}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-ink text-white p-8 md:p-14">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    {categoryBadge(hero.category)}
                    <span className="text-[10px] tracking-widest text-white/40">
                      {formatDate(hero.date)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl title-en">{hero.title}</h2>
                  {hero.titleJp && (
                    <p className="text-white/50 text-base md:text-lg mt-3 title-jp">
                      {hero.titleJp}
                    </p>
                  )}
                  {hero.summary && (
                    <p className="text-white/60 text-sm mt-6 max-w-2xl leading-relaxed">
                      {hero.summary}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Link>
        </section>
      )}

      {/* ── Featured grid (2×2) ── */}
      {featured.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/read/${item.slug}`}
              className="group block border-b md:border-b-0 md:odd:border-r border-border card-hover"
            >
              {item.heroImage ? (
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <Image
                    src={item.heroImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {categoryBadge(item.category)}
                      <span className="text-[9px] tracking-widest text-white/50">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h3 className="text-white text-sm md:text-base title-en line-clamp-2">
                      {item.title}
                    </h3>
                    {item.titleJp && (
                      <p className="text-white/40 text-xs mt-1 title-jp line-clamp-1">
                        {item.titleJp}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="no-image-card bg-ink text-white p-6 flex flex-col justify-end"
                  style={{ aspectRatio: "16/10" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {categoryBadge(item.category)}
                    {item.sourceName && (
                      <span className="text-[9px] tracking-widest text-white/50">
                        {item.sourceName}
                      </span>
                    )}
                    <span className="text-[9px] tracking-widest text-white/50">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-lg title-en leading-snug">
                    {item.title}
                  </h3>
                  {item.titleJp && (
                    <p className="text-white/40 text-xs mt-2 title-jp line-clamp-1">
                      {item.titleJp}
                    </p>
                  )}
                </div>
              )}
            </Link>
          ))}
        </section>
      )}

      {/* ── Article list ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map((item) => (
            <article key={item.id} className="card-hover">
              <Link href={`/read/${item.slug}`} className="group block">
                {item.heroImage ? (
                  <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "16/10" }}>
                    <Image
                      src={item.heroImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className="no-image-card bg-ink text-white flex items-end p-5 mb-4"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <span className="text-lg md:text-xl title-en leading-snug line-clamp-3">
                      {item.title}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {categoryBadge(item.category)}
                  {item.sourceName && (
                    <span className="label">{item.sourceName}</span>
                  )}
                  <span className="label">{formatDate(item.date)}</span>
                </div>

                {item.heroImage && (
                  <h3 className="text-sm title-en group-hover:opacity-70 transition-opacity line-clamp-2">
                    {item.title}
                  </h3>
                )}

                {item.titleJp && (
                  <p className="text-xs text-muted mt-1 title-jp line-clamp-1">
                    {item.titleJp}
                  </p>
                )}

                {item.summary && (
                  <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-24 text-center">
            <p className="label">NO ARTICLES YET</p>
            <p className="label-jp mt-1">記事はまだありません</p>
          </div>
        )}
      </section>
    </div>
  );
}
