import Image from "next/image";
import Link from "next/link";
import { getSeasonPicks } from "@/lib/notion";

export const revalidate = 60;

export default async function SeasonPage() {
  const picks = await getSeasonPicks();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-6 mb-10">
        <p className="label">SEASON</p>
        <p className="label-jp mt-1">シーズン</p>
        <p className="bilingual-en mt-6 max-w-lg">
          Seasonal picks from Japan&apos;s most considered labels.
          Updated weekly.
        </p>
        <p className="bilingual-jp text-muted max-w-lg">
          日本のニッチブランドから厳選した今季のピック。毎週更新。
        </p>
      </div>

      {picks.length === 0 ? (
        <div className="flex items-center justify-center h-48 border border-dashed border-border">
          <div className="text-center">
            <p className="label">COMING SOON</p>
            <p className="label-jp mt-1">準備中</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {picks.map((item) => (
            <Link
              key={item.slug}
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
              <div className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="label">{item.tag}</span>
                  <span className="label-jp">{item.tagJp}</span>
                </div>
                <p className="text-[11px] tracking-widest uppercase text-muted">{item.brand}</p>
                <p className="bilingual-en mt-1">{item.title}</p>
                <p className="bilingual-jp text-muted">{item.titleJp}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
