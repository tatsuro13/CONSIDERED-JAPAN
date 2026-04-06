/**
 * fix-broken-images.mjs
 * 画像なしのPublished記事からSourceUrlにアクセスし、OGP画像を取得してHeroImageを更新
 * Usage: NOTION_TOKEN=xxx NOTION_JOURNAL_DB_ID=xxx node scripts/fix-broken-images.mjs
 */
import { Client } from "@notionhq/client";
import https from "node:https";
import http from "node:http";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

function fetchUrl(rawUrl, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)" },
        timeout: 10000,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(fetchUrl(res.headers.location, redirectCount + 1));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchOgImage(url) {
  try {
    const html = await fetchUrl(url);
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch) return ogMatch[1];
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twMatch) return twMatch[1];
    return "";
  } catch {
    return "";
  }
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

  const noImage = allPages.filter((p) => !p.properties.HeroImage?.url);
  console.log(`Found ${noImage.length} published articles without HeroImage\n`);

  let fixed = 0;
  let failed = 0;

  for (const page of noImage) {
    const props = page.properties;
    const title = props["名前"]?.title?.[0]?.plain_text ?? "?";
    const sourceUrl = props.SourceUrl?.url ?? "";

    if (!sourceUrl) {
      console.log(`  SKIP (no SourceUrl): ${title.slice(0, 50)}`);
      failed++;
      continue;
    }

    process.stdout.write(`  ${title.slice(0, 50)}... `);
    const ogImage = await fetchOgImage(sourceUrl);

    if (ogImage) {
      await notion.pages.update({
        page_id: page.id,
        properties: { HeroImage: { url: ogImage } },
      });
      console.log(`FIXED → ${ogImage.slice(0, 60)}`);
      fixed++;
    } else {
      console.log("NO OG IMAGE");
      failed++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. Fixed: ${fixed}, Failed: ${failed}`);
}

main().catch(console.error);
