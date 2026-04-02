import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrands, getBrandBySlug } from "@/lib/notion";

export const revalidate = 3600;

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.filter((b) => b.slug).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description,
    openGraph: {
      title: brand.name,
      description: brand.description,
      ...(brand.heroImage && { images: [{ url: brand.heroImage }] }),
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  return (
    <div>
      {/* Hero */}
      {brand.heroImage && (
        <section className="border-b border-border">
          <div className="cinema relative overflow-hidden">
            <Image
              src={brand.heroImage}
              alt={brand.name}
              fill
              priority
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-ink/20" />
            <div className="absolute bottom-8 left-6 md:left-12">
              <h1 className="text-white text-2xl md:text-4xl tracking-widest uppercase font-light">
                {brand.name}
              </h1>
              <p className="text-white/70 text-xs mt-1" style={{ fontFamily: "var(--font-jp)", letterSpacing: "0.15em" }}>
                {brand.nameJp}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/brands" className="label hover:text-ink transition-colors">
          ← BRANDS
        </Link>

        {/* Header (if no hero) */}
        {!brand.heroImage && (
          <div className="mt-8">
            <h1 className="bilingual-en text-2xl tracking-wide">{brand.name}</h1>
            <p className="bilingual-jp text-muted mt-1">{brand.nameJp}</p>
          </div>
        )}

        {/* Meta */}
        <div className="flex gap-8 mt-8 mb-8 border-b border-border pb-8">
          {brand.since && (
            <div>
              <p className="label text-muted">EST.</p>
              <p className="bilingual-en mt-1">{brand.since}</p>
            </div>
          )}
          {brand.category && (
            <div>
              <p className="label text-muted">CATEGORY</p>
              <p className="bilingual-en mt-1">{brand.category}</p>
            </div>
          )}
          {brand.internationalShipping && (
            <div>
              <p className="label text-muted">SHIPS INTL.</p>
              <p className="bilingual-en mt-1">Yes</p>
            </div>
          )}
        </div>

        {/* Description */}
        {brand.description && (
          <div className="mb-10">
            <p className="bilingual-en leading-loose text-ink">{brand.description}</p>
            {brand.descriptionJp && (
              <p className="bilingual-jp text-muted mt-3">{brand.descriptionJp}</p>
            )}
          </div>
        )}

        {/* Official site */}
        {brand.officialUrl && (
          <a
            href={brand.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="label underline underline-offset-2 hover:text-ink transition-colors"
          >
            Official Site →
          </a>
        )}
      </div>
    </div>
  );
}
