import Image from "next/image";

type RichText = { plain_text: string; annotations?: any; href?: string | null };

function renderRichText(texts: RichText[]) {
  return texts.map((t, i) => {
    let el: React.ReactNode = t.plain_text;
    if (t.annotations?.bold) el = <strong key={i}>{el}</strong>;
    if (t.annotations?.italic) el = <em key={i}>{el}</em>;
    if (t.href) el = <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{el}</a>;
    return <span key={i}>{el}</span>;
  });
}

export function NotionBlocks({ blocks }: { blocks: any[] }) {
  return (
    <div className="prose-notion">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={block.id} className="bilingual-en leading-loose mb-4 text-ink">
                {renderRichText(block.paragraph.rich_text)}
              </p>
            );
          case "heading_1":
            return (
              <h1 key={block.id} className="text-xl tracking-wide uppercase mt-10 mb-4">
                {renderRichText(block.heading_1.rich_text)}
              </h1>
            );
          case "heading_2":
            return (
              <h2 key={block.id} className="text-base tracking-widest uppercase mt-8 mb-3 text-muted">
                {renderRichText(block.heading_2.rich_text)}
              </h2>
            );
          case "heading_3":
            return (
              <h3 key={block.id} className="text-sm tracking-widest uppercase mt-6 mb-2 text-muted">
                {renderRichText(block.heading_3.rich_text)}
              </h3>
            );
          case "bulleted_list_item":
            return (
              <li key={block.id} className="bilingual-en mb-1 ml-4 list-disc">
                {renderRichText(block.bulleted_list_item.rich_text)}
              </li>
            );
          case "numbered_list_item":
            return (
              <li key={block.id} className="bilingual-en mb-1 ml-4 list-decimal">
                {renderRichText(block.numbered_list_item.rich_text)}
              </li>
            );
          case "quote":
            return (
              <blockquote key={block.id} className="border-l border-ink pl-4 my-6 text-muted italic">
                {renderRichText(block.quote.rich_text)}
              </blockquote>
            );
          case "divider":
            return <hr key={block.id} className="border-border my-8" />;
          case "image": {
            const src =
              block.image?.type === "external"
                ? block.image.external?.url
                : block.image?.file?.url;
            const caption = block.image?.caption?.[0]?.plain_text ?? "";
            if (!src) return null;
            return (
              <figure key={block.id} className="my-8">
                <div className="cinema overflow-hidden relative">
                  <Image
                    src={src}
                    alt={caption}
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                {caption && (
                  <figcaption className="label text-muted mt-2 text-center">{caption}</figcaption>
                )}
              </figure>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
