/**
 * 大量Draftを一括処理: タイトル整理、カテゴリ自動判定、画像チェック、Publish
 * ストアお知らせ系はスキップ、実質的な記事のみPublish
 */
import { Client } from "@notionhq/client";
import https from "node:https";
import http from "node:http";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

function fetchUrl(rawUrl, rc = 0) {
  if (rc > 5) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.get(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)" },
        timeout: 10000 },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location)
          return resolve(fetchUrl(res.headers.location, rc + 1));
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        let d = ""; res.setEncoding("utf8");
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchOgImage(url) {
  try {
    const html = await fetchUrl(url);
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : "";
  } catch { return ""; }
}

// Skip patterns: store notices, system errors, lottery info, playlists
const SKIP_PATTERNS = [
  /システムエラー/i, /お詫び/i, /抽選に関して/i, /入場抽選/i,
  /Outlet Pop up/i, /発売日店頭/i, /システムメンテナンス/i,
  /Playlist/i, /playlist/i,
  /リストック/i, /Restock/i,
  /営業時間/i, /定休日/i, /臨時休業/i,
  /SPRING SUMMUR/i, // typo in source, store event
];

// Category detection from title + source
function detectCategory(title, source) {
  const t = title.toLowerCase();
  if (t.includes("collection") || t.includes("コレクション") || t.includes("ss2") || t.includes("fw2") || t.includes("aw2")) return "Collection";
  if (t.includes("pop up") || t.includes("pop-up") || t.includes("popup") || t.includes("exhibition") || t.includes("展示")) return "Report";
  if (t.includes("collab") || t.includes("コラボ") || t.includes("×") || t.includes("x ")) return "Product";
  if (t.includes("発売") || t.includes("release") || t.includes("新作") || t.includes("launch") || t.includes("drop")) return "Product";
  if (source === "Graphpaper" || source === "HYKE" || source === "sacai" || source === "Porter Classic" || source === "Hender Scheme" || source === "TEATORA" || source === "ATON") return "Product";
  if (source === "WWD JAPAN" || source === "Fashionsnap") return "Report";
  return "Product";
}

// Generate clean English title from Japanese
function cleanTitle(title) {
  return title.replace(/^\[RSS\]\s*/, "").trim();
}

async function main() {
  const allDrafts = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DB,
      filter: { property: "Status", select: { equals: "Draft" } },
      page_size: 100,
      start_cursor: cursor,
    });
    allDrafts.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  console.log(`Processing ${allDrafts.length} drafts...\n`);

  let published = 0, skipped = 0, imageFixed = 0;

  for (const page of allDrafts) {
    const props = page.properties;
    const rawTitle = props["名前"]?.title?.[0]?.plain_text ?? "";
    const title = cleanTitle(rawTitle);
    const source = props.SourceName?.rich_text?.[0]?.plain_text ?? "";
    const sourceUrl = props.SourceUrl?.url ?? "";
    let heroImage = props.HeroImage?.url ?? "";

    // Skip store notices
    if (SKIP_PATTERNS.some((p) => p.test(title))) {
      console.log(`  SKIP (notice): ${title.slice(0, 50)}`);
      skipped++;
      continue;
    }

    // Try to get OG image if missing
    if (!heroImage && sourceUrl) {
      heroImage = await fetchOgImage(sourceUrl);
      if (heroImage) imageFixed++;
    }

    const category = detectCategory(title, source);

    const update = {
      "名前": { title: [{ text: { content: title } }] },
      Status: { select: { name: "Published" } },
      Category: { select: { name: category } },
    };

    if (heroImage && !props.HeroImage?.url) {
      update.HeroImage = { url: heroImage };
    }

    process.stdout.write(`  ${title.slice(0, 55)}... `);

    await notion.pages.update({ page_id: page.id, properties: update });
    console.log(`${category} ✓`);
    published++;

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. Published: ${published}, Skipped: ${skipped}, Images fixed: ${imageFixed}`);
}

main().catch(console.error);
