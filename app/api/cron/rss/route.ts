import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const JOURNAL_DB = process.env.NOTION_JOURNAL_DB_ID!;

// ── RSS Feeds ──
const RSS_FEEDS = [
  // Tier 1: メディア（日本）
  { name: "Houyhnhnm", url: "https://www.houyhnhnm.jp/feed/", lang: "ja" },
  { name: "Fashionsnap", url: "https://www.fashionsnap.com/rss.xml", lang: "ja" },
  { name: "WWD JAPAN", url: "https://www.wwdjapan.com/feed/", lang: "ja" },
  { name: "MEN'S NON-NO", url: "https://www.mensnonno.jp/feed/", lang: "ja" },
  { name: "Vogue Japan", url: "https://www.vogue.co.jp/feed/rss", lang: "ja" },
  { name: "EYESCREAM", url: "https://eyescream.jp/feed/", lang: "ja" },
  { name: "GQ Japan", url: "https://www.gqjapan.jp/feed", lang: "ja" },
  // Tier 1: メディア（海外）
  { name: "Highsnobiety", url: "https://www.highsnobiety.com/feed/", lang: "en" },
  { name: "Hypebeast JP", url: "https://hypebeast.com/jp/feed", lang: "ja" },
  { name: "Hypebeast EN", url: "https://hypebeast.com/feed", lang: "en" },
  // Tier 3: ブランド公式
  { name: "ref.", url: "https://www.refnet.tv/blogs/news.atom", lang: "ja" },
  { name: "Graphpaper", url: "https://graphpaper-tokyo.com/blogs/news.atom", lang: "ja" },
  { name: "nonnative", url: "https://nonnative.com/feed/", lang: "ja" },
  { name: "HYKE", url: "https://hyke.jp/blogs/news.atom", lang: "ja" },
  { name: "sacai", url: "https://www.sacai.jp/blogs/news.atom", lang: "ja" },
  { name: "Porter Classic", url: "https://www.porterclassic.com/blogs/journal.atom", lang: "ja" },
  { name: "Hender Scheme", url: "https://henderscheme.com/feed/", lang: "ja" },
  { name: "ATON", url: "https://aton-tokyo.com/blogs/news.atom", lang: "ja" },
];

// ── Brand keywords ──
const BRAND_KEYWORDS = [
  "nonnative", "sacai", "kijima takayuki", "木島", "porter classic", "ポータークラシック",
  "y-3", "graphpaper", "グラフペーパー", "comoli", "コモリ", "markaware", "マーカウェア",
  "hyke", "ハイク", "eyevan", "アイヴァン", "yohji yamamoto", "ヨウジ",
  "comme des garçons", "コムデギャルソン", "freshservice", "フレッシュサービス",
  "kaptain sunshine", "キャプテンサンシャイン", "aton", "エイトン", "ancellm", "アンセルム",
  "digawel", "ディガウェル", "neat", "phigvel", "フィグベル",
  "teatora", "テアトラ", "hender scheme", "エンダースキーマ", "marka", "マーカ",
  "maatee", "マーティー", "n.hoolywood",
  "human made", "ヒューマンメイド", "humanmade",
  "japanese fashion", "made in japan", "日本製", "japan brand",
  "fashion week tokyo", "rakuten fashion",
];

// ── XML parser ──
function parseXmlText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:[^>]*)>\\s*(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?\\s*</${tag}>`, "is");
  return (xml.match(re)?.[1] ?? "").trim();
}

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image: string;
}

function parseItems(xml: string): FeedItem[] {
  const itemTag = xml.includes("<entry") ? "entry" : "item";
  const re = new RegExp(`<${itemTag}[^>]*>([\\s\\S]*?)</${itemTag}>`, "gi");
  const items: FeedItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const title = parseXmlText(block, "title");
    let link = parseXmlText(block, "link");
    if (!link) {
      const hrefM = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      link = hrefM?.[1] ?? "";
    }
    const pubDate =
      parseXmlText(block, "pubDate") ||
      parseXmlText(block, "published") ||
      parseXmlText(block, "updated") || "";
    const description =
      parseXmlText(block, "description") ||
      parseXmlText(block, "summary") ||
      parseXmlText(block, "content") || "";

    let image = "";
    const mediaThumbnail = block.match(/media:thumbnail[^>]+url=["']([^"']+)["']/i);
    const enclosure = block.match(/enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i);
    const imgInContent = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (mediaThumbnail) image = mediaThumbnail[1];
    else if (enclosure) image = enclosure[1];
    else if (imgInContent) image = imgInContent[1];

    const cleanDesc = description.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").trim().slice(0, 500);
    if (title && link) items.push({ title, link, pubDate, description: cleanDesc, image });
  }
  return items;
}

// Fetch OG image from article page as fallback
async function fetchOgImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) return "";
    const html = await res.text();
    // og:image
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch) return ogMatch[1];
    // twitter:image
    const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
    if (twMatch) return twMatch[1];
    return "";
  } catch {
    return "";
  }
}

function isRelevant(item: FeedItem): boolean {
  const text = (item.title + " " + item.description).toLowerCase();
  return BRAND_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function makeSlug(title: string, link: string): string {
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    if (last.length > 5) return last.slice(0, 60);
  } catch { /* ignore */ }
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

async function slugExists(s: string): Promise<boolean> {
  const res = await notion.databases.query({
    database_id: JOURNAL_DB,
    filter: { property: "Slug", rich_text: { equals: s } },
  });
  return res.results.length > 0;
}

async function createDraft(item: FeedItem, sourceName: string): Promise<boolean> {
  const s = makeSlug(item.title, item.link);
  if (await slugExists(s)) return false;

  // If no image from RSS, try OG image from the article page
  if (!item.image && item.link) {
    item.image = await fetchOgImage(item.link);
  }

  // Normalize http → https (Shopify Atom feeds often return http URLs)
  if (item.image && item.image.startsWith("http://")) {
    item.image = item.image.replace("http://", "https://");
  }

  // Skip generic brand logos/OGP that aren't real article images
  if (item.image && (
    item.image.includes("sacai_articles_image_logo") ||
    item.image.includes("teatora.jp/wp/wp-content/uploads/2025/02/og_teatora.png")
  )) {
    item.image = "";
  }

  const today = new Date().toISOString().slice(0, 10);

  const children: any[] = [];

  if (item.image) {
    children.push({
      object: "block",
      type: "image",
      image: { type: "external", external: { url: item.image } },
    });
  }

  if (item.description) {
    children.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: item.description.slice(0, 2000) } }],
      },
    });
  }

  const props: Record<string, any> = {
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

// ── Cron handler ──
export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { feed: string; items: number; relevant: number; added: number; error?: string }[] = [];
  let totalAdded = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)",
          Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        results.push({ feed: feed.name, items: 0, relevant: 0, added: 0, error: `HTTP ${res.status}` });
        continue;
      }

      const xml = await res.text();
      const items = parseItems(xml);
      const relevant = items.filter(isRelevant);

      let added = 0;
      for (const item of relevant) {
        try {
          const ok = await createDraft(item, feed.name);
          if (ok) { added++; totalAdded++; }
        } catch (e: any) {
          // skip individual failures
        }
        // Rate limit
        await new Promise((r) => setTimeout(r, 300));
      }

      results.push({ feed: feed.name, items: items.length, relevant: relevant.length, added });
    } catch (e: any) {
      results.push({ feed: feed.name, items: 0, relevant: 0, added: 0, error: e.message });
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    totalAdded,
    feeds: results,
  });
}
