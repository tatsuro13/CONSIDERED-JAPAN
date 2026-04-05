import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFeedItems, getFeedItemBySlug, getPageBlocks } from "@/lib/notion";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getFeedItems();
  return items.filter((i) => i.slug).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getFeedItemBySlug(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary || item.titleJp,
    openGraph: {
      title: item.title,
      description: item.summary || item.titleJp,
      ...(item.heroImage && { images: [{ url: item.heroImage }] }),
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

function renderBlock(block: any) {
  const type = block.type;

  if (type === "paragraph") {
    const richText = block.paragraph?.rich_text;
    if (!richText?.length) return <div className="h-4" key={block.id} />;
    const text = richText.map((t: any) => t.plain_text).join("");
    if (!text.trim()) return <div className="h-4" key={block.id} />;

    // Check if italic gray → source attribution
    const isSource = richText[0]?.annotations?.italic && richText[0]?.annotations?.color === "gray";
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
        className="text-base tracking-wide font-medium uppercase mt-12 mb-4"
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
      <h3 key={block.id} className="text-sm tracking-wide font-medium mt-10 mb-3">
        {text}
      </h3>
    );
  }

  if (type === "bulleted_list_item") {
    const text = block.bulleted_list_item?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("");
    return (
      <li key={block.id} className="bilingual-en ml-4 mb-2 list-disc">
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
        className="border-l-2 border-border pl-4 text-muted bilingual-en italic my-8"
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
        className="bg-border/30 px-4 py-3 text-xs text-muted my-6"
      >
        {text}
      </div>
    );
  }

  if (type === "image") {
    const url =
      block.image?.external?.url ?? block.image?.file?.url ?? "";
    if (!url) return null;
    return (
      <figure key={block.id} className="my-10">
        <div className="relative aspect-video overflow-hidden">
          <Image src={url} alt="" fill className="object-cover grayscale" />
        </div>
      </figure>
    );
  }

  if (type === "divider") {
    return <hr key={block.id} className="border-border my-10" />;
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

  const blocks = await getPageBlocks(item.id);

  return (
    <div>
      {/* Hero image */}
      {item.heroImage && (
        <section className="border-b border-border">
          <div className="cinema relative overflow-hidden">
            <Image
              src={item.heroImage}
              alt={item.title}
              fill
              priority
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-ink/20" />
          </div>
        </section>
      )}

      <article className="max-w-2xl mx-auto px-6 py-16">
        {/* Back */}
        <Link href="/" className="label hover:text-ink transition-colors">
          ← FEED
        </Link>

        {/* Header — bilingual */}
        <header className="mt-10 mb-12 pb-10 border-b border-border">
          <div className="flex items-center gap-3 mb-5">
            {item.sourceName && <span className="label">{item.sourceName}</span>}
            {item.category && (
              <span className="label text-muted/50">{item.category}</span>
            )}
            <span className="label text-muted/50">{formatDate(item.date)}</span>
          </div>

          {/* EN title */}
          <h1 className="text-xl md:text-2xl title-en">
            {item.title}
          </h1>

          {/* JP title */}
          {item.titleJp && (
            <p className="text-base md:text-lg text-muted mt-3 title-jp">
              {item.titleJp}
            </p>
          )}

          {/* EN summary */}
          {item.summary && (
            <p className="bilingual-en text-muted mt-6 italic">
              {item.summary}
            </p>
          )}
        </header>

        {/* Body */}
        <div className="article-body">{blocks.map(renderBlock)}</div>

        {/* Source attribution */}
        {item.sourceUrl && (
          <footer className="mt-16 pt-10 border-t border-border">
            <p className="label mb-2">SOURCE</p>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wide underline underline-offset-2 hover:text-ink transition-colors"
            >
              {item.sourceName || "Original article"} →
            </a>
          </footer>
        )}
      </article>
    </div>
  );
}
