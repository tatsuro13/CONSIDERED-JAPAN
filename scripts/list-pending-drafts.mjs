/**
 * list-pending-drafts.mjs
 * 未処理のRSS Draftをリストアップし、ソースURL付きでJSON出力
 * Usage: NOTION_TOKEN=xxx NOTION_JOURNAL_DB_ID=xxx node scripts/list-pending-drafts.mjs
 */
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

async function main() {
  const res = await notion.databases.query({
    database_id: DB,
    filter: {
      and: [
        { property: "Status", select: { equals: "Draft" } },
      ],
    },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 20,
  });

  const items = [];

  for (const page of res.results) {
    const props = page.properties;
    const title = props["名前"]?.title?.[0]?.plain_text ?? "";

    // ブロックからソースURLを抽出
    const blocks = await notion.blocks.children.list({ block_id: page.id, page_size: 10 });
    let sourceUrl = props.SourceUrl?.url ?? "";
    let sourceName = props.SourceName?.rich_text?.[0]?.plain_text ?? "";
    let description = "";

    for (const block of blocks.results) {
      if (block.type === "callout") {
        const text = block.callout?.rich_text?.[0]?.plain_text ?? "";
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        if (urlMatch && !sourceUrl) sourceUrl = urlMatch[0];
        const nameMatch = text.match(/Source:\s*([^—]+)/);
        if (nameMatch && !sourceName) sourceName = nameMatch[1].trim();
      }
      if (block.type === "paragraph") {
        const text = block.paragraph?.rich_text?.map(t => t.plain_text).join("") ?? "";
        if (text && !text.startsWith("→") && !description) {
          description = text;
        }
      }
    }

    items.push({
      id: page.id,
      title,
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? "",
      date: props.Date?.date?.start ?? "",
      sourceUrl,
      sourceName,
      description: description.slice(0, 300),
    });
  }

  console.log(JSON.stringify(items, null, 2));
}

main().catch(console.error);
