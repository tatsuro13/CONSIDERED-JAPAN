import { Client } from "@notionhq/client";
import https from "node:https";
import http from "node:http";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

function headCheck(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, { method: "HEAD", timeout: 5000, headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        headCheck(res.headers.location).then(resolve);
        return;
      }
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
    });
    req.on("error", (e) => resolve({ ok: false, reason: e.message }));
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, reason: "timeout" }); });
    req.end();
  });
}

async function main() {
  const allPages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DB,
      filter: { property: "Status", select: { equals: "Published" } },
      page_size: 100,
      start_cursor: cursor,
    });
    allPages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  console.log(`Total published: ${allPages.length}\n`);

  const domainCount = {};
  const noImage = [];
  const broken = [];
  const working = [];

  for (const page of allPages) {
    const props = page.properties;
    const title = props["名前"]?.title?.[0]?.plain_text ?? "?";
    const url = props.HeroImage?.url ?? "";

    if (!url) {
      noImage.push(title);
      continue;
    }

    // Extract domain
    try {
      const domain = new URL(url).hostname;
      domainCount[domain] = (domainCount[domain] || 0) + 1;
    } catch {
      broken.push({ title, url, reason: "Invalid URL" });
      continue;
    }

    // Check if image is accessible
    const result = await headCheck(url);
    if (result.ok) {
      working.push(title);
    } else {
      broken.push({ title, url: url.slice(0, 100), status: result.status, reason: result.reason });
    }
  }

  console.log("=== DOMAIN DISTRIBUTION ===");
  const sorted = Object.entries(domainCount).sort((a, b) => b[1] - a[1]);
  for (const [domain, count] of sorted) {
    console.log(`  ${count}x  ${domain}`);
  }

  console.log(`\n=== NO IMAGE (${noImage.length}) ===`);
  for (const t of noImage.slice(0, 10)) console.log(`  - ${t.slice(0, 70)}`);
  if (noImage.length > 10) console.log(`  ... +${noImage.length - 10} more`);

  console.log(`\n=== BROKEN IMAGES (${broken.length}) ===`);
  for (const b of broken) {
    console.log(`  - ${b.title.slice(0, 60)}`);
    console.log(`    ${b.url}  [${b.status ?? b.reason ?? ""}]`);
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Working: ${working.length}`);
  console.log(`  Broken:  ${broken.length}`);
  console.log(`  No image: ${noImage.length}`);
}

main().catch(console.error);
