import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFeedItems,
  getFeedItemBySlug,
  getPageBlocks,
  getRelatedArticles,
  getLatestArticles,
} from "@/lib/notion";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getFeedItems();
  return items.filter((i) => i.slug).map((i) => ({ slug: i.slug }));
}

const SITE_URL = "https://considered-japan.vercel.app";
const SITE_NAME = "CONSIDERED JAPAN";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getFeedItemBySlug(slug);
  if (!item) return {};

  const title = item.title;
  const description = item.summary || item.titleJp || title;
  const url = `${SITE_URL}/read/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      alternateLocale: "ja_JP",
      type: "article",
      publishedTime: item.date ? new Date(item.date).toISOString() : undefined,
      section: item.category || undefined,
      ...(item.heroImage && {
        images: [
          {
            url: item.heroImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: item.heroImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(item.heroImage && { images: [item.heroImage] }),
    },
  };
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(d: string) {
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
    category === "Product"
      ? "badge-product"
      : category === "Essay"
        ? "badge-essay"
        : category === "Collection"
          ? "badge-collection"
          : category === "Brand Story"
            ? "badge-brand-story"
            : category === "Report"
              ? "badge-report"
              : category === "Culture"
                ? "badge-culture"
                : "badge-product";
  return <span className={`badge ${cls}`}>{category}</span>;
}

function renderBlock(block: any) {
  const type = block.type;

  if (type === "paragraph") {
    const richText = block.paragraph?.rich_text;
    if (!richText?.length) return <div className="h-6" key={block.id} />;
    const text = richText.map((t: any) => t.plain_text).join("");
    if (!text.trim()) return <div className="h-6" key={block.id} />;

    const isSource =
      richText[0]?.annotations?.italic &&
      richText[0]?.annotations?.color === "gray";
    if (isSource) {
      return (
        <p key={block.id} className="text-xs text-muted italic tracking-wide">
          {text}
        </p>
      );
    }

    return (
      <p key={block.id} className="bilingual-en text-ink mb-8">
        {text}
      </p>
    );
  }

  if (type === "heading_2") {
    const text = block.heading_2?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <h2
        key={block.id}
        className="headline-sm font-medium mt-16 mb-6 pb-3 border-b border-border"
      >
        {text}
      </h2>
    );
  }

  if (type === "heading_3") {
    const text = block.heading_3?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <h3
        key={block.id}
        className="text-base tracking-wide font-medium mt-12 mb-4"
      >
        {text}
      </h3>
    );
  }

  if (type === "bulleted_list_item") {
    const text = block.bulleted_list_item?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <li key={block.id} className="bilingual-en ml-4 mb-3 list-disc">
        {text}
      </li>
    );
  }

  if (type === "quote") {
    const text = block.quote?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <blockquote
        key={block.id}
        className="border-l-2 border-ink pl-6 pull-quote text-muted my-12"
      >
        {text}
      </blockquote>
    );
  }

  if (type === "callout") {
    const text = block.callout?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <div
        key={block.id}
        className="bg-ink/[0.03] px-6 py-5 text-[13px] text-muted my-8 leading-relaxed tracking-wide"
      >
        {text}
      </div>
    );
  }

  if (type === "image") {
    const url =
      block.image?.external?.url ?? block.image?.file?.url ?? "";
    if (!url) return null;
    const caption = block.image?.caption?.[0]?.plain_text ?? "";
    return (
      <figure key={block.id} className="my-12">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={url} alt={caption || ""} fill className="object-cover" />
        </div>
        {caption && (
          <figcaption className="text-[11px] text-muted tracking-wide mt-3">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "divider") {
    return (
      <div key={block.id} className="my-12 flex justify-center">
        <span className="text-border text-lg tracking-[0.5em]">***</span>
      </div>
    );
  }

  return null;
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getFeedItemBySlug(slug);
  if (!item) notFound();

  const [blocks, relatedArticles, latestArticles] = await Promise.all([
    getPageBlocks(item.id),
    getRelatedArticles(item.id, item.category, 4),
    getLatestArticles(item.id, 4),
  ]);

  // Deduplicate: remove from latest if already in related
  const relatedIds = new Set(relatedArticles.map((a) => a.id));
  const moreArticles = latestArticles.filter((a) => !relatedIds.has(a.id));

  // JSON-LD: Article structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    ...(item.titleJp && { alternativeHeadline: item.titleJp }),
    description: item.summary || item.titleJp || item.title,
    ...(item.heroImage && {
      image: {
        "@type": "ImageObject",
        url: item.heroImage,
        width: 1200,
        height: 630,
      },
    }),
    datePublished: item.date
      ? new Date(item.date).toISOString()
      : undefined,
    dateModified: item.date
      ? new Date(item.date).toISOString()
      : undefined,
    ...(item.category && { articleSection: item.category }),
    inLanguage: ["en", "ja"],
    url: `${SITE_URL}/read/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/read/${slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    ...(item.sourceName && {
      author: {
        "@type": "Organization",
        name: item.sourceName,
        ...(item.sourceUrl && { url: item.sourceUrl }),
      },
    }),
    ...(!item.sourceName && {
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    }),
  };

  // BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...(item.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: item.category,
              item: `${SITE_URL}/?cat=${item.category.toLowerCase().replace(" ", "-")}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: item.category ? 3 : 2,
        name: item.title,
        item: `${SITE_URL}/read/${slug}`,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ── Hero ── */}
      {item.heroImage ? (
        <section
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "2.4/1" }}
        >
          <Image
            src={item.heroImage}
            alt={item.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </section>
      ) : (
        <section className="bg-ink text-white">
          <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-6">
              {categoryBadge(item.category)}
              {item.sourceName && (
                <span className="text-[10px] tracking-widest text-white/40">
                  {item.sourceName}
                </span>
              )}
              <span className="text-[10px] tracking-widest text-white/30">
                {formatDate(item.date)}
              </span>
            </div>
            <h1 className="headline-xl text-white">{item.title}</h1>
            {item.titleJp && (
              <p
                className="text-lg md:text-xl text-white/40 mt-4"
                style={{
                  fontFamily: "var(--font-jp)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.6,
                }}
              >
                {item.titleJp}
              </p>
            )}
            {item.summary && (
              <p className="text-white/50 text-sm mt-8 max-w-2xl leading-[1.9] tracking-wide">
                {item.summary}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Article content area ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* ── Main column ── */}
          <article className="lg:col-span-8 py-12 lg:py-16">
            {/* Back link */}
            <Link
              href="/"
              className="label hover:text-ink transition-colors inline-block mb-10"
            >
              ← Back to Feed
            </Link>

            {/* ── Article header (when hero image exists) ── */}
            {item.heroImage && (
              <header className="mb-14 pb-10 border-b border-border">
                <div className="flex items-center gap-3 mb-6">
                  {categoryBadge(item.category)}
                  {item.sourceName && (
                    <span className="label">{item.sourceName}</span>
                  )}
                  <span className="label">{formatDate(item.date)}</span>
                </div>

                {/* EN Title — large */}
                <h1 className="headline-lg">{item.title}</h1>

                {/* JP Title — below, muted */}
                {item.titleJp && (
                  <p
                    className="text-base md:text-lg text-muted mt-4"
                    style={{
                      fontFamily: "var(--font-jp)",
                      letterSpacing: "0.06em",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.titleJp}
                  </p>
                )}

                {/* Summary / Lead */}
                {item.summary && (
                  <p className="text-[15px] leading-[2] tracking-wide text-muted mt-8 max-w-2xl">
                    {item.summary}
                  </p>
                )}
              </header>
            )}

            {/* No-image header: summary only */}
            {!item.heroImage && item.summary && (
              <div className="mb-14 pb-10 border-b border-border">
                <p className="text-[15px] leading-[2] tracking-wide text-muted">
                  {item.summary}
                </p>
              </div>
            )}

            {/* ── Body ── */}
            <div className="article-body">
              {blocks.map(renderBlock)}
            </div>

            {/* ── Source attribution ── */}
            {item.sourceUrl && (
              <div className="mt-16 pt-8 border-t border-border">
                <p className="section-label mb-3">
                  Source
                  <span className="section-label-jp">出典</span>
                </p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] tracking-wide text-muted hover:text-ink transition-colors underline underline-offset-4 decoration-border hover:decoration-ink"
                >
                  {item.sourceName || "Original article"} →
                </a>
              </div>
            )}

            {/* ── Article footer / share ── */}
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <div>
                <p className="label">{formatDate(item.date)}</p>
                {item.category && (
                  <p className="mt-2">{categoryBadge(item.category)}</p>
                )}
              </div>
              <Link
                href="/"
                className="text-[12px] tracking-widest uppercase text-muted hover:text-ink transition-colors"
              >
                ← Back to Feed
              </Link>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 py-12 lg:py-16 lg:border-l lg:border-border lg:pl-12">
            {/* Article info card */}
            <div className="mb-12">
              <p className="section-label mb-5">
                Article Info
                <span className="section-label-jp">記事情報</span>
              </p>
              <dl className="space-y-4 text-[12px]">
                <div>
                  <dt className="label mb-1">Date</dt>
                  <dd className="tracking-wide">{formatDate(item.date)}</dd>
                </div>
                {item.category && (
                  <div>
                    <dt className="label mb-1">Category</dt>
                    <dd>{categoryBadge(item.category)}</dd>
                  </div>
                )}
                {item.sourceName && (
                  <div>
                    <dt className="label mb-1">Source</dt>
                    <dd className="tracking-wide">{item.sourceName}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Related articles (same category) */}
            {relatedArticles.length > 0 && (
              <div className="mb-12">
                <p className="section-label mb-5">
                  Related
                  <span className="section-label-jp">関連記事</span>
                </p>
                <div className="space-y-6">
                  {relatedArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/read/${article.slug}`}
                      className="group block"
                    >
                      {article.heroImage && (
                        <div className="relative aspect-[16/10] overflow-hidden mb-3">
                          <Image
                            src={article.heroImage}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="300px"
                          />
                        </div>
                      )}
                      <p className="label mb-1">
                        {formatDateShort(article.date)}
                      </p>
                      <p className="text-[13px] tracking-wide leading-snug group-hover:opacity-70 transition-opacity line-clamp-2">
                        {article.title}
                      </p>
                      {article.titleJp && (
                        <p
                          className="text-[11px] text-muted mt-1 line-clamp-1"
                          style={{
                            fontFamily: "var(--font-jp)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {article.titleJp}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Latest articles */}
            {moreArticles.length > 0 && (
              <div>
                <p className="section-label mb-5">
                  Latest
                  <span className="section-label-jp">最新記事</span>
                </p>
                <div className="space-y-5">
                  {moreArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/read/${article.slug}`}
                      className="group block py-4 border-b border-border last:border-b-0"
                    >
                      <p className="label mb-1">
                        {formatDateShort(article.date)}
                      </p>
                      <p className="text-[13px] tracking-wide leading-snug group-hover:opacity-70 transition-opacity line-clamp-2">
                        {article.title}
                      </p>
                      {article.titleJp && (
                        <p
                          className="text-[11px] text-muted mt-1 line-clamp-1"
                          style={{
                            fontFamily: "var(--font-jp)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {article.titleJp}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ── Full-width "More from [category]" section ── */}
      {relatedArticles.length >= 3 && (
        <section className="border-t border-border mt-8">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="section-label mb-8">
              More in {item.category}
              <span className="section-label-jp">
                {item.category === "Product"
                  ? "プロダクトをもっと見る"
                  : item.category === "Brand Story"
                    ? "ブランドストーリーをもっと見る"
                    : item.category === "Collection"
                      ? "コレクションをもっと見る"
                      : item.category === "Culture"
                        ? "カルチャーをもっと見る"
                        : item.category === "Report"
                          ? "レポートをもっと見る"
                          : "もっと見る"}
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={`/read/${article.slug}`}
                  className="group block card-hover"
                >
                  {article.heroImage ? (
                    <div className="relative aspect-[16/10] overflow-hidden mb-3">
                      <Image
                        src={article.heroImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div
                      className="bg-ink/[0.03] flex items-end p-4 mb-3"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <span className="text-[11px] tracking-wide text-muted line-clamp-2">
                        {article.title}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    {categoryBadge(article.category)}
                    <span className="label">{formatDateShort(article.date)}</span>
                  </div>
                  {article.heroImage && (
                    <p className="text-[13px] tracking-wide leading-snug group-hover:opacity-70 transition-opacity line-clamp-2">
                      {article.title}
                    </p>
                  )}
                  {article.titleJp && (
                    <p
                      className="text-[11px] text-muted mt-1 line-clamp-1"
                      style={{
                        fontFamily: "var(--font-jp)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {article.titleJp}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
