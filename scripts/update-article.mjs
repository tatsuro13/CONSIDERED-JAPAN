/**
 * update-article.mjs
 * Notionの記事を更新（プロパティ + ブロック内容の差し替え）
 * Usage: NOTION_TOKEN=xxx node scripts/update-article.mjs <pageId> <jsonFile>
 *
 * jsonFileフォーマット:
 * {
 *   "title": "New Title",
 *   "titleJp": "日本語タイトル",
 *   "summary": "Short summary",
 *   "category": "Brand Story",
 *   "sourceUrl": "https://...",
 *   "sourceName": "ref.",
 *   "body": "Paragraph 1\n\nParagraph 2\n\n..."
 * }
 */
import { Client } from "@notionhq/client";
import { readFileSync } from "fs";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const pageId = process.argv[2];
const jsonFile = process.argv[3];

if (!pageId || !jsonFile) {
  console.error("Usage: node scripts/update-article.mjs <pageId> <jsonFile>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonFile, "utf-8"));

async function main() {
  // 1. プロパティを更新
  const props = {
    名前: { title: [{ text: { content: data.title } }] },
    Status: { select: { name: "Published" } },
  };
  if (data.titleJp) props.TitleJp = { rich_text: [{ text: { content: data.titleJp } }] };
  if (data.summary) props.Summary = { rich_text: [{ text: { content: data.summary } }] };
  if (data.category) props.Category = { select: { name: data.category } };
  if (data.sourceUrl) props.SourceUrl = { url: data.sourceUrl };
  if (data.sourceName) props.SourceName = { rich_text: [{ text: { content: data.sourceName } }] };
  if (data.heroImage) props.HeroImage = { url: data.heroImage };

  await notion.pages.update({ page_id: pageId, properties: props });
  console.log("Properties updated.");

  // 2. 既存ブロックを削除
  const existing = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });
  for (const block of existing.results) {
    await notion.blocks.delete({ block_id: block.id });
  }
  console.log(`Deleted ${existing.results.length} old blocks.`);

  // 3. 新しいブロックを追加
  const paragraphs = data.body
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const children = paragraphs.map(p => ({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: p } }],
    },
  }));

  // ソース帰属をフッターに追加
  if (data.sourceUrl) {
    children.push({
      object: "block",
      type: "divider",
      divider: {},
    });
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{
          type: "text",
          text: {
            content: `Source: ${data.sourceName || "Original"} — ${data.sourceUrl}`,
            link: { url: data.sourceUrl },
          },
          annotations: { italic: true, color: "gray" },
        }],
      },
    });
  }

  // Notion APIは100ブロックまで
  for (let i = 0; i < children.length; i += 100) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: children.slice(i, i + 100),
    });
  }

  console.log(`Added ${children.length} new blocks. Published.`);
}

main().catch(console.error);
