import Link from "next/link";
import { getJournalPosts } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-6 mb-10">
        <p className="label">JOURNAL</p>
        <p className="label-jp mt-1">読み物</p>
        <p className="bilingual-en mt-6 max-w-lg">
          Long reads on brand philosophy, craft, and the people behind Japan&apos;s most considered fashion.
        </p>
        <p className="bilingual-jp text-muted max-w-lg">
          ブランドの哲学、ものづくり、そしてその背景にある人々についての読み物。
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex items-center justify-center h-48 border border-dashed border-border">
          <div className="text-center">
            <p className="label">COMING SOON</p>
            <p className="label-jp mt-1">準備中</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group py-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-baseline block"
            >
              <p className="label text-muted">{post.date}</p>
              <div className="md:col-span-3">
                <p className="bilingual-en group-hover:underline underline-offset-2">{post.title}</p>
                <p className="bilingual-jp text-muted mt-0.5">{post.titleJp}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
