import Link from "next/link";
import { getBrands } from "@/lib/notion";

export const revalidate = 60;

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-6 mb-10">
        <p className="label">BRANDS</p>
        <p className="label-jp mt-1">ブランド</p>
        <p className="bilingual-en mt-6 max-w-lg">
          A curated index of Japan&apos;s most considered labels —
          each chosen for craft, philosophy, and enduring relevance.
        </p>
        <p className="bilingual-jp text-muted max-w-lg">
          素材、哲学、そして時代を超えた存在感を基準に選んだブランド一覧。
        </p>
      </div>

      {brands.length === 0 ? (
        <p className="label text-muted">No brands published yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="py-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-baseline"
            >
              <div>
                {brand.slug ? (
                  <Link href={`/brands/${brand.slug}`} className="hover:underline underline-offset-2">
                    <p className="text-sm font-medium tracking-wide">{brand.name}</p>
                  </Link>
                ) : (
                  <p className="text-sm font-medium tracking-wide">{brand.name}</p>
                )}
                <p className="label-jp mt-0.5">{brand.nameJp}</p>
              </div>
              <p className="label hidden md:block">
                {brand.since ? `EST. ${brand.since}` : ""}
              </p>
              <p className="label col-span-1 md:col-span-2">{brand.category}</p>
              {brand.officialUrl && (
                <a
                  href={brand.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label hidden md:block text-right underline underline-offset-2"
                >
                  Official Site
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
