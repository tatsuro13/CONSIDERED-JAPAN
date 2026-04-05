import Link from "next/link";
import Image from "next/image";
import { getFeedItems } from "@/lib/notion";

export const revalidate = 60;

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function FeedPage() {
  const items = await getFeedItems();
  const hero = items[0];
  const rest = items.slice(1);

  return (
    <div>
      {/* Hero article */}
      {hero && (
        <section className="border-b border-border">
          <Link href={`/read/${hero.slug}`} className="group block">
            {hero.heroImage ? (
              <div className="cinema relative overflow-hidden">
                <Image
                  src={hero.heroImage}
                  alt={hero.title}
                  fill
                  priority
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-all" />
                <div className="absolute bottom-6 left-6 md:left-10 right-6 md:right-10">
                  <div className="flex items-center gap-3 mb-3">
                    {hero.sourceName && (
                      <span className="text-[10px] tracking-widest uppercase text-white/60">
                        {hero.sourceName}
                      </span>
                    )}
                    <span className="text-[10px] tracking-widest text-white/40">
                      {formatDate(hero.date)}
                    </span>
                  </div>
                  <h2 className="text-white text-lg md:text-2xl title-en max-w-3xl">
                    {hero.title}
                  </h2>
                  {hero.titleJp && (
                    <p className="text-white/50 text-sm mt-2 title-jp">
                      {hero.titleJp}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  {hero.sourceName && (
                    <span className="label">{hero.sourceName}</span>
                  )}
                  <span className="label text-muted/50">
                    {formatDate(hero.date)}
                  </span>
                </div>
                <h2 className="text-xl md:text-3xl title-en">
                  {hero.title}
                </h2>
                {hero.titleJp && (
                  <p className="text-base md:text-lg text-muted mt-3 title-jp">
                    {hero.titleJp}
                  </p>
                )}
                {hero.summary && (
                  <p className="bilingual-en text-muted mt-6 max-w-2xl">
                    {hero.summary}
                  </p>
                )}
              </div>
            )}
          </Link>
        </section>
      )}

      {/* Feed */}
      <section className="max-w-5xl mx-auto px-6">
        {rest.map((item) => (
          <article key={item.id} className="border-b border-border py-8">
            <Link href={`/read/${item.slug}`} className="group block">
              <div className="flex gap-6 md:gap-10">
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {item.sourceName && (
                      <span className="label">{item.sourceName}</span>
                    )}
                    {item.category && (
                      <span className="label text-muted/50">{item.category}</span>
                    )}
                    <span className="label text-muted/50">
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base title-en group-hover:text-ink/70 transition-colors">
                    {item.title}
                  </h3>

                  {item.titleJp && (
                    <p className="text-xs text-muted mt-1.5 title-jp line-clamp-1">
                      {item.titleJp}
                    </p>
                  )}

                  {item.summary && (
                    <p className="text-xs text-muted mt-3 leading-relaxed line-clamp-2 max-w-xl">
                      {item.summary}
                    </p>
                  )}
                </div>

                {/* Thumbnail */}
                {item.heroImage && (
                  <div className="hidden sm:block w-32 md:w-40 flex-shrink-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.heroImage}
                        alt=""
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="160px"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}

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
