import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeedItems } from "@/lib/notion";

export const dynamic = "force-dynamic";

const SITE_URL = "https://considered-japan.vercel.app";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

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
              <h3 className="text-white headline-lg max-w-3xl line-clamp-2">
                {item.title}
              </h3>
              {item.titleJp && (
                <p className="text-white/30 text-sm mt-2 title-jp line-clamp-1">
                  {item.titleJp}
                </p>
              )}
              {item.summary && (
                <p className="text-white/40 text-[13px] mt-3 max-w-2xl leading-[1.9] hidden md:block line-clamp-2">
                  {item.summary}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-ink/[0.04] p-8 md:p-12 flex flex-col justify-center items-center text-center" style={{ aspectRatio: "2.2/1" }}>
            <div className="flex items-center gap-2 mb-5">
              {categoryBadge(item.category)}
              <span className="text-[9px] tracking-widest text-muted">{formatDate(item.date)}</span>
            </div>
            <h3 className="headline-lg max-w-3xl">{item.title}</h3>
            {item.titleJp && (
              <p className="text-muted text-sm mt-3 title-jp">{item.titleJp}</p>
            )}
            {item.summary && (
              <p className="text-muted/60 text-xs mt-4 max-w-xl leading-relaxed hidden md:block">{item.summary}</p>
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
            className="bg-ink/[0.04] flex items-end p-5 mb-4"
            style={{ aspectRatio: "16/10" }}
          >
            <span className="headline-sm leading-snug line-clamp-3">
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
          <h3 className="text-[14px] md:text-base title-en group-hover:opacity-70 transition-opacity line-clamp-2 leading-snug">
            {item.title}
          </h3>
        )}
        {item.titleJp && (
          <p className="text-[11px] text-muted mt-1.5 title-jp line-clamp-1">{item.titleJp}</p>
        )}
        {item.summary && (
          <p className="text-[11px] text-muted mt-2 leading-relaxed line-clamp-2">{item.summary}</p>
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
          <div className="bg-ink/[0.04] flex-shrink-0 w-24 h-24 md:w-28 md:h-28" />
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

// ── Text-only card for no-image articles ──
function CardText({ item }: { item: any }) {
  return (
    <article className="card-hover py-4 border-b border-border last:border-b-0">
      <Link href={`/read/${item.slug}`} className="group block">
        <div className="flex items-center gap-2 mb-1.5">
          {categoryBadge(item.category)}
          {item.sourceName && <span className="label">{item.sourceName}</span>}
          <span className="label">{formatDate(item.date)}</span>
        </div>
        <h3 className="text-sm title-en group-hover:opacity-70 transition-opacity line-clamp-2">
          {item.title}
        </h3>
        {item.titleJp && (
          <p className="text-[11px] text-muted mt-1 title-jp line-clamp-1">{item.titleJp}</p>
        )}
      </Link>
    </article>
  );
}

// ── Rhythm layout: repeating pattern for visual hierarchy ──
function renderArticleStream(items: any[]) {
  const blocks: React.ReactNode[] = [];

  // Split into image and text-only items
  const imageItems = items.filter((i) => i.heroImage);
  const textItems = items.filter((i) => !i.heroImage);

  let imgIdx = 0;
  let textIdx = 0;
  let blockCount = 0;

  while (imgIdx < imageItems.length) {
    // Pattern 0: 1 large full-width (needs image)
    if (imgIdx < imageItems.length) {
      blocks.push(
        <div key={`lg-${blockCount}`} className="mb-10">
          <CardLarge item={imageItems[imgIdx]} />
        </div>
      );
      imgIdx++;
      blockCount++;
    }

    // Pattern 1: 2-column medium cards
    if (imgIdx < imageItems.length) {
      const count = Math.min(2, imageItems.length - imgIdx);
      blocks.push(
        <div key={`2col-${blockCount}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {imageItems.slice(imgIdx, imgIdx + count).map((item) => (
            <CardMedium key={item.id} item={item} />
          ))}
        </div>
      );
      imgIdx += count;
      blockCount++;
    }

    // Interlude: insert text-only items as a compact sidebar list
    if (textIdx < textItems.length) {
      const batch = textItems.slice(textIdx, textIdx + 5);
      blocks.push(
        <div key={`text-${blockCount}`} className="mb-10 py-6 border-t border-border">
          <p className="label mb-4">MORE STORIES</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {batch.map((item) => (
              <CardText key={item.id} item={item} />
            ))}
          </div>
        </div>
      );
      textIdx += batch.length;
      blockCount++;
    }

    // Pattern 2: 3-column medium cards
    if (imgIdx < imageItems.length) {
      const count = Math.min(3, imageItems.length - imgIdx);
      blocks.push(
        <div key={`3col-${blockCount}`} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {imageItems.slice(imgIdx, imgIdx + count).map((item) => (
            <CardMedium key={item.id} item={item} />
          ))}
        </div>
      );
      imgIdx += count;
      blockCount++;
    }

    // Pattern 3: Compact small cards with thumbnails
    if (imgIdx < imageItems.length) {
      const count = Math.min(4, imageItems.length - imgIdx);
      blocks.push(
        <div key={`list-${blockCount}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 py-6 border-t border-b border-border">
          {imageItems.slice(imgIdx, imgIdx + count).map((item) => (
            <CardSmall key={item.id} item={item} />
          ))}
        </div>
      );
      imgIdx += count;
      blockCount++;
    }
  }

  // Remaining text-only items at the end
  if (textIdx < textItems.length) {
    const remaining = textItems.slice(textIdx);
    blocks.push(
      <div key={`text-end-${blockCount}`} className="mb-10 py-6 border-t border-border">
        <p className="label mb-4">MORE STORIES</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {remaining.map((item) => (
            <CardText key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return <>{blocks}</>;
}

export default async function FeedPage() {
  const allItems = await getFeedItems();

  // Separate: items with images get priority placement
  const withImage = allItems.filter((i) => i.heroImage);
  const withoutImage = allItems.filter((i) => !i.heroImage);

  // Hero + featured must have images
  const hero = withImage[0];
  const featured = withImage.slice(1, 5);

  // Rest: image items first, then text-only items interspersed
  const restWithImage = withImage.slice(5);
  const rest = [...restWithImage, ...withoutImage];

  // JSON-LD: CollectionPage with ItemList
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CONSIDERED JAPAN",
    description:
      "Curated fashion intelligence from Japan — craft, intention, and quiet design.",
    url: SITE_URL,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allItems.length,
      itemListElement: allItems.slice(0, 20).map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/read/${item.slug}`,
        name: item.title,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
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
                  <h2 className="text-white headline-xl max-w-4xl">
                    {hero.title}
                  </h2>
                  {hero.titleJp && (
                    <p className="text-white/40 text-sm md:text-lg mt-3 title-jp">
                      {hero.titleJp}
                    </p>
                  )}
                  {hero.summary && (
                    <p className="text-white/50 text-[13px] mt-5 max-w-2xl leading-[1.9] tracking-wide hidden md:block">
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
                  <h2 className="headline-xl">{hero.title}</h2>
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
                    <h3 className="text-white headline-sm line-clamp-2">
                      {item.title}
                    </h3>
                    {item.titleJp && (
                      <p className="text-white/30 text-xs mt-1.5 title-jp line-clamp-1">
                        {item.titleJp}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="bg-ink/[0.04] p-6 flex flex-col justify-end"
                  style={{ aspectRatio: "16/10" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {categoryBadge(item.category)}
                    <span className="text-[9px] tracking-widest text-muted">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h3 className="headline-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {item.titleJp && (
                    <p className="text-muted text-xs mt-2 title-jp line-clamp-1">
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
      <section className="max-w-7xl mx-auto px-6 py-12">
        {renderArticleStream(rest)}

        {allItems.length === 0 && (
          <div className="py-24 text-center">
            <p className="label">NO ARTICLES YET</p>
            <p className="label-jp mt-1">記事はまだありません</p>
          </div>
        )}
      </section>
    </div>
  );
}
