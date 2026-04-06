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

// ── Card variants ──

function CardLarge({ item }: { item: any }) {
  return (
    <article className="card-hover col-span-full">
      <Link href={`/read/${item.slug}`} className="group block">
        {item.heroImage ? (
          <div className="relative overflow-hidden" style={{ aspectRatio: "2.2/1" }}>
            <Image
              src={item.heroImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                {categoryBadge(item.category)}
                {item.sourceName && (
                  <span className="text-[9px] tracking-widest uppercase text-white/50">
                    {item.sourceName}
                  </span>
                )}
                <span className="text-[9px] tracking-widest text-white/40">
                  {formatDate(item.date)}
                </span>
              </div>
              <h3 className="text-white text-lg md:text-2xl title-en max-w-3xl line-clamp-2">
                {item.title}
              </h3>
              {item.titleJp && (
                <p className="text-white/40 text-sm mt-2 title-jp line-clamp-1">
                  {item.titleJp}
                </p>
              )}
              {item.summary && (
                <p className="text-white/50 text-sm mt-3 max-w-2xl leading-relaxed hidden md:block line-clamp-2">
                  {item.summary}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="no-image-card bg-ink text-white p-8 md:p-10 flex flex-col justify-end" style={{ aspectRatio: "2.2/1" }}>
            <div className="flex items-center gap-2 mb-3">
              {categoryBadge(item.category)}
              <span className="text-[9px] tracking-widest text-white/50">{formatDate(item.date)}</span>
            </div>
            <h3 className="text-xl md:text-3xl title-en max-w-3xl">{item.title}</h3>
            {item.titleJp && (
              <p className="text-white/40 text-sm mt-2 title-jp">{item.titleJp}</p>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}

function CardMedium({ item }: { item: any }) {
  return (
    <article className="card-hover">
      <Link href={`/read/${item.slug}`} className="group block">
        {item.heroImage ? (
          <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "16/10" }}>
            <Image
              src={item.heroImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div
            className="no-image-card bg-ink text-white flex items-end p-5 mb-4"
            style={{ aspectRatio: "16/10" }}
          >
            <span className="text-base md:text-lg title-en leading-snug line-clamp-3">
              {item.title}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          {categoryBadge(item.category)}
          {item.sourceName && <span className="label">{item.sourceName}</span>}
          <span className="label">{formatDate(item.date)}</span>
        </div>
        {item.heroImage && (
          <h3 className="text-sm md:text-base title-en group-hover:opacity-70 transition-opacity line-clamp-2">
            {item.title}
          </h3>
        )}
        {item.titleJp && (
          <p className="text-xs text-muted mt-1 title-jp line-clamp-1">{item.titleJp}</p>
        )}
        {item.summary && (
          <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">{item.summary}</p>
        )}
      </Link>
    </article>
  );
}

function CardSmall({ item }: { item: any }) {
  return (
    <article className="card-hover">
      <Link href={`/read/${item.slug}`} className="group block flex gap-4">
        {item.heroImage ? (
          <div className="relative overflow-hidden flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
            <Image
              src={item.heroImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="112px"
            />
          </div>
        ) : (
          <div className="no-image-card bg-ink flex-shrink-0 w-24 h-24 md:w-28 md:h-28" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {categoryBadge(item.category)}
            <span className="label">{formatDate(item.date)}</span>
          </div>
          <h3 className="text-sm title-en group-hover:opacity-70 transition-opacity line-clamp-2">
            {item.title}
          </h3>
          {item.titleJp && (
            <p className="text-[11px] text-muted mt-1 title-jp line-clamp-1">{item.titleJp}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

// ── Rhythm layout: repeating pattern of large → 2-col → 3-col → list ──
function renderArticleStream(items: any[]) {
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < items.length) {
    const cycle = blocks.length;

    // Pattern 0: 1 large full-width
    if (i < items.length) {
      blocks.push(
        <div key={`lg-${i}`} className="mb-8">
          <CardLarge item={items[i]} />
        </div>
      );
      i++;
    }

    // Pattern 1: 2-column medium cards
    if (i < items.length) {
      const pair = items.slice(i, i + 2);
      blocks.push(
        <div key={`2col-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {pair.map((item) => (
            <CardMedium key={item.id} item={item} />
          ))}
        </div>
      );
      i += pair.length;
    }

    // Pattern 2: 3-column medium cards
    if (i < items.length) {
      const trio = items.slice(i, i + 3);
      blocks.push(
        <div key={`3col-${i}`} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trio.map((item) => (
            <CardMedium key={item.id} item={item} />
          ))}
        </div>
      );
      i += trio.length;
    }

    // Pattern 3: Compact list (4-5 items, small horizontal cards)
    if (i < items.length) {
      const listItems = items.slice(i, i + 4);
      blocks.push(
        <div key={`list-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 py-6 border-t border-b border-border">
          {listItems.map((item) => (
            <CardSmall key={item.id} item={item} />
          ))}
        </div>
      );
      i += listItems.length;
    }
  }

  return <>{blocks}</>;
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

      {/* ── Article stream with rhythm ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        {renderArticleStream(rest)}

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
