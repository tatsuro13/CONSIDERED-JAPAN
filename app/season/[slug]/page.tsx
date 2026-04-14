import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeasonPickBySlug, getPageBlocks } from "@/lib/notion";
import { NotionBlocks } from "@/app/components/notion-blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pick = await getSeasonPickBySlug(slug);
  if (!pick) return {};

  const title = pick.brand ? `${pick.brand} — ${pick.title}` : pick.title;
  const description = `${pick.tag} from ${pick.brand}. ${pick.titleJp}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: pick.date || undefined,
      ...(pick.image && { images: [{ url: pick.image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(pick.image && { images: [pick.image] }),
    },
  };
}

export default async function SeasonPickPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pick = await getSeasonPickBySlug(slug);
  if (!pick) notFound();

  const blocks = await getPageBlocks(pick.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/season" className="label hover:text-ink transition-colors">
        ← SEASON
      </Link>

      {pick.image && (
        <div className="cinema overflow-hidden my-8 relative">
          <Image
            src={pick.image}
            alt={pick.title}
            fill
            className="object-cover grayscale"
            priority
          />
        </div>
      )}

      <div className="border-b border-border pb-6 mb-8">
        <div className="flex justify-between mb-3">
          <span className="label">{pick.tag}</span>
          <span className="label-jp">{pick.tagJp}</span>
        </div>
        <p className="label text-muted mb-2">{pick.brand}</p>
        <h1 className="bilingual-en text-xl tracking-wide">{pick.title}</h1>
        <p className="bilingual-jp text-muted mt-1">{pick.titleJp}</p>
        {pick.date && (
          <p className="label text-muted mt-4">{pick.date}</p>
        )}
      </div>

      {blocks.length > 0 && <NotionBlocks blocks={blocks} />}
    </div>
  );
}
