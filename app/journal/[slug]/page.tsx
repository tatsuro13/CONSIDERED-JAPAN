import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalPostBySlug, getPageBlocks } from "@/lib/notion";
import { NotionBlocks } from "@/app/components/notion-blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) return {};

  const description = `${post.titleJp} — CONSIDERED JAPAN Journal`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);
  if (!post) notFound();

  const blocks = await getPageBlocks(post.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/journal" className="label hover:text-ink transition-colors">
        ← JOURNAL
      </Link>

      <div className="border-b border-border pb-8 mt-8 mb-10">
        {post.date && (
          <p className="label text-muted mb-4">{post.date}</p>
        )}
        <h1 className="bilingual-en text-2xl tracking-wide leading-snug">{post.title}</h1>
        <p className="bilingual-jp text-muted mt-2">{post.titleJp}</p>
      </div>

      {blocks.length > 0 ? (
        <NotionBlocks blocks={blocks} />
      ) : (
        <p className="label text-muted">Coming soon.</p>
      )}
    </div>
  );
}
