/**
 * rss-aggregator.mjs
 * ファッションサイトのRSSを巡回し、関連記事をNotionジャーナルDraftとして追加
 * Usage: NOTION_TOKEN=xxx NOTION_JOURNAL_DB_ID=xxx node scripts/rss-aggregator.mjs
 *
 * 毎日cronで実行 → 新着記事をNotionにDraftで溜め、編集者がレビューしてPublishする
 */

import { Client } from "@notionhq/client";
import { createRequire } from "module";
import https from "https";
import http from "http";
import { URL } from "url";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const JOURNAL_DB = process.env.NOTION_JOURNAL_DB_ID;

// ──────────────────────────────────────────────
// RSS フィード一覧
// ──────────────────────────────────────────────
const RSS_FEEDS = [
  // メディア（日本）
  { name: "Houyhnhnm", url: "https://www.houyhnhnm.jp/feed/", lang: "ja" },
  { name: "Fashionsnap", url: "https://www.fashionsnap.com/news/feed/", lang: "ja" },
  { name: "Fashion Press", url: "https://www.fashion-press.net/news/rss", lang: "ja" },
  // メディア（海外）
  { name: "Highsnobiety", url: "https://www.highsnobiety.com/feed/", lang: "en" },
  { name: "Hypebeast JP", url: "https://hypebeast.com/jp/feed", lang: "ja" },
  { name: "Hypebeast EN", url: "https://hypebeast.com/feed", lang: "en" },
  // セレクトショップ（Shopify Atom）
  { name: "ref.", url: "https://www.refnet.tv/blogs/news.atom", lang: "ja" },
  { name: "ref. (RSS)", url: "https://www.refnet.tv/blogs/news.rss", lang: "ja" },
  // その他
  { name: "GQ Japan", url: "https://www.gqjapan.jp/feed", lang: "ja" },
  { name: "OCEANS", url: "https://oceans.tokyo.jp/feed/", lang: "ja" },
];

// ──────────────────────────────────────────────
// 対象ブランドキーワード（記事フィルタリング用）
// ──────────────────────────────────────────────
const BRAND_KEYWORDS = [
  "nonnative", "sacai", "kijima takayuki", "木島", "porter classic", "ポータークラシック",
  "y-3", "graphpaper", "グラフペーパー", "comoli", "コモリ", "markaware", "マーカウェア",
  "hyke", "ハイク", "eyevan", "アイヴァン", "yohji yamamoto", "ヨウジ",
  "comme des garçons", "コムデギャルソン", "freshservice", "フレッシュサービス",
  "kaptain sunshine", "キャプテンサンシャイン", "aton", "エイトン", "ancellm", "アンセルム",
  "digawel", "ディガウェル", "neat", "ニート", "phigvel", "フィグベル",
  "teatora", "テアトラ", "hender scheme", "エンダースキーマ", "marka", "マーカ",
  "maatee", "マーティー",
  // 追加：日本ファッション一般
  "japanese fashion", "made in japan", "日本製", "japan brand",
];

// ──────────────────────────────────────────────
// HTTP フェッチ（Node v16 対応）
// ──────────────────────────────────────────────
function fetchUrl(rawUrl, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.get(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)",
          Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
        },
        timeout: 10000,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(fetchUrl(res.headers.location, redirectCount + 1));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${rawUrl}`));
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error(`Timeout: ${rawUrl}`)); });
  });
}

// ──────────────────────────────────────────────
// RSS / Atom 簡易パーサー
// ──────────────────────────────────────────────
function parseXmlText(xml, tag) {
  const re = new RegExp(`<${tag}(?:[^>]*)>\\s*(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?\\s*</${tag}>`, "is");
  return (xml.match(re)?.[1] ?? "").trim();
}

function parseItems(xml) {
  // RSS <item> または Atom <entry>
  const itemTag = xml.includes("<entry") ? "entry" : "item";
  const re = new RegExp(`<${itemTag}[^>]*>([\\s\\S]*?)</${itemTag}>`, "gi");
  const items = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const title = parseXmlText(block, "title");
    // Atom <link href="..."/> vs RSS <link>...</link>
    let link = parseXmlText(block, "link");
    if (!link) {
      const hrefM = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      link = hrefM?.[1] ?? "";
    }
    // 公開日
    const pubDate =
      parseXmlText(block, "pubDate") ||
      parseXmlText(block, "published") ||
      parseXmlText(block, "updated") ||
      "";
    // 概要
    const description =
      parseXmlText(block, "description") ||
      parseXmlText(block, "summary") ||
      parseXmlText(block, "content") ||
      "";
    // 画像 (media:thumbnail, enclosure, og)
    let image = "";
    const mediaThumbnail = block.match(/media:thumbnail[^>]+url=["']([^"']+)["']/i);
    const enclosure = block.match(/enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i);
    const imgInContent = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (mediaThumbnail) image = mediaThumbnail[1];
    else if (enclosure) image = enclosure[1];
    else if (imgInContent) image = imgInContent[1];

    // HTMLタグ除去
    const cleanDesc = description.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").trim().slice(0, 500);

    if (title && link) {
      items.push({ title, link, pubDate, description: cleanDesc, image });
    }
  }
  return items;
}

// ──────────────────────────────────────────────
// OGP画像フォールバック取得
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// 関連記事フィルタ
// ──────────────────────────────────────────────
function isRelevant(item) {
  const text = (item.title + " " + item.description).toLowerCase();
  return BRAND_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// ──────────────────────────────────────────────
// Notion 重複チェック（URLで確認）
// ──────────────────────────────────────────────
async function slugExists(s) {
  const res = await notion.databases.query({
    database_id: JOURNAL_DB,
    filter: { property: "Slug", rich_text: { equals: s } },
  });
  return res.results.length > 0;
}

function makeSlug(title, link) {
  // URLのパス末尾をベースにしつつ、titleからも生成
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    if (last.length > 5) return last.slice(0, 60);
  } catch {}
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

// ──────────────────────────────────────────────
// Notion Draft 作成
// ──────────────────────────────────────────────
async function createDraft(item, sourceName) {
  const s = makeSlug(item.title, item.link);
  if (await slugExists(s)) return false;

  // OGP画像フォールバック
  if (!item.image && item.link) {
    item.image = await fetchOgImage(item.link);
  }

  const today = new Date().toISOString().slice(0, 10);
  const children = [
    {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "📰" },
        rich_text: [
          {
            type: "text",
            text: { content: `Source: ${sourceName} — ${item.link}` },
          },
        ],
        color: "gray_background",
      },
    },
  ];

  if (item.description) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: item.description } }],
      },
    });
  }

  children.push({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "→ 元記事を参考にオリジナル記事を執筆してください。コピーは行わないこと。" },
        },
      ],
    },
  });

  // 画像があればcalloutブロックに含める
  if (item.image) {
    children.splice(1, 0, {
      object: "block",
      type: "image",
      image: { type: "external", external: { url: item.image } },
    });
  }

  const props = {
    名前: { title: [{ text: { content: `[RSS] ${item.title}` } }] },
    Slug: { rich_text: [{ text: { content: s } }] },
    Date: { date: { start: today } },
    Status: { select: { name: "Draft" } },
    SourceUrl: { url: item.link },
    SourceName: { rich_text: [{ text: { content: sourceName } }] },
  };

  if (item.image) {
    props.HeroImage = { url: item.image };
  }

  await notion.pages.create({
    parent: { database_id: JOURNAL_DB },
    properties: props,
    children,
  });

  return true;
}

// ──────────────────────────────────────────────
// メイン
// ──────────────────────────────────────────────
async function main() {
  let totalAdded = 0;
  let totalChecked = 0;

  for (const feed of RSS_FEEDS) {
    process.stdout.write(`Fetching ${feed.name}... `);
    let xml;
    try {
      xml = await fetchUrl(feed.url);
    } catch (e) {
      console.log(`SKIP (${e.message})`);
      continue;
    }

    const items = parseItems(xml);
    const relevant = items.filter(isRelevant);
    process.stdout.write(`${items.length} items, ${relevant.length} relevant → `);

    let added = 0;
    for (const item of relevant) {
      totalChecked++;
      try {
        const ok = await createDraft(item, feed.name);
        if (ok) { added++; totalAdded++; }
      } catch (e) {
        console.error(`  ERROR creating draft: ${e.message}`);
      }
      // Notion APIレート制限対策
      await new Promise((r) => setTimeout(r, 300));
    }
    console.log(`${added} new drafts`);
  }

  console.log(`\nDone. ${totalAdded} drafts added (${totalChecked} relevant articles checked).`);
}

main().catch(console.error);
