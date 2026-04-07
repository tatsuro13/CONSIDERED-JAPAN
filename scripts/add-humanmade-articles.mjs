/**
 * HUMAN MADE記事をNotionにDraftとして追加
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
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (data += c));
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
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : "";
  } catch { return ""; }
}

function makeSlug(title, link) {
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    if (last.length > 5) return last.slice(0, 60);
  } catch {}
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

async function slugExists(s) {
  const res = await notion.databases.query({
    database_id: DB,
    filter: { property: "Slug", rich_text: { equals: s } },
  });
  return res.results.length > 0;
}

async function createDraft(item) {
  const s = makeSlug(item.title, item.link);
  if (await slugExists(s)) {
    console.log(`  SKIP (exists): ${item.title.slice(0, 50)}`);
    return false;
  }

  const image = await fetchOgImage(item.link);
  const today = new Date().toISOString().slice(0, 10);

  const children = [];
  if (image) {
    children.push({
      object: "block", type: "image",
      image: { type: "external", external: { url: image } },
    });
  }
  if (item.description) {
    children.push({
      object: "block", type: "paragraph",
      paragraph: { rich_text: [{ type: "text", text: { content: item.description.slice(0, 2000) } }] },
    });
  }

  const props = {
    名前: { title: [{ text: { content: `[RSS] ${item.title}` } }] },
    Slug: { rich_text: [{ text: { content: s } }] },
    Date: { date: { start: item.date || today } },
    Status: { select: { name: "Draft" } },
    SourceUrl: { url: item.link },
    SourceName: { rich_text: [{ text: { content: item.source } }] },
  };
  if (image) props.HeroImage = { url: image };

  await notion.pages.create({ parent: { database_id: DB }, properties: props, children });
  console.log(`  ADDED: ${item.title.slice(0, 50)}`);
  return true;
}

const ARTICLES = [
  {
    title: "Nigo Officially Launches Human Made US & Top Fashion News",
    link: "https://hypebeast.com/2026/3/nigo-human-made-simone-rocha-pitti-uomo-john-galliano-zara-adidas-fw26-runway-trends-top-fashion-news",
    date: "2026-03-28",
    source: "Hypebeast",
    description: "Nigo officially launches Human Made in the US market alongside other top fashion news of the week.",
  },
  {
    title: "Human Made's \"Affordable\" New Brand Buffer Is for High Schoolers",
    link: "https://www.highsnobiety.com/p/buffer-human-made/",
    date: "2026-03-25",
    source: "Highsnobiety",
    description: "Tetsu Nishiyama launches Buffer under Human Made — a new affordable sub-brand targeting a younger generation.",
  },
  {
    title: "Bangkok Welcomes HUMAN MADE's First Southeast Asian Store",
    link: "https://hypebeast.com/2026/3/human-made-bangkok-store-opening-thailand-kaws-exclusive-items-info",
    date: "2026-03-20",
    source: "Hypebeast",
    description: "Human Made opens its first Southeast Asian store in Bangkok, featuring exclusive KAWS collaboration items.",
  },
  {
    title: "Nigo's Human Made Quietly Establishes US Subsidiary With $4 Million USD Capital",
    link: "https://hypebeast.com/2026/3/nigo-human-made-us-subsidiary-expansion-announcment-info",
    date: "2026-03-15",
    source: "Hypebeast",
    description: "Following a successful Tokyo IPO, Human Made establishes a US subsidiary with $4 million in capital for global expansion.",
  },
  {
    title: "Can Pharrell & NIGO Work Their Magic With Human Made?",
    link: "https://www.highsnobiety.com/p/pharrell-williams-human-made-advisor/",
    date: "2026-02-10",
    source: "Highsnobiety",
    description: "Pharrell Williams as both second-largest shareholder and key creative advisor — what this means for Human Made's future.",
  },
  {
    title: "Follow the Pink Rabbit: Tetsu Nishiyama Launches Buffer Under Human Made",
    link: "https://hypebeast.com/2026/3/follow-the-pink-rabbit-tetsu-nishiyama-launches-buffer-under-human-made",
    date: "2026-03-22",
    source: "Hypebeast",
    description: "Buffer's debut collection features graphic T-shirts with designs by a diverse roster of illustrators and artists.",
  },
  {
    title: "Human Made x Red Wing Collection — The Future Is in the Past",
    link: "https://hypebeast.com/2025/12/human-made-red-wing-boots-footwear-apparel-collection-release-info",
    date: "2025-12-20",
    source: "Hypebeast",
    description: "Red Wing Heritage and Human Made collaborate on a limited-edition collection guided by the philosophy 'The Future Is in the Past.'",
  },
  {
    title: "Human Made Launches Historic IPO on Tokyo Stock Exchange",
    link: "https://hypebeast.com/2025/11/nigo-pharrell-human-made-historic-ipo-tokyo-stock-exchange-announcement",
    date: "2025-11-15",
    source: "Hypebeast",
    description: "NIGO's Human Made makes history with a $460 million Tokyo IPO, marking a new chapter for the Japanese fashion brand.",
  },
  {
    title: "NIGO × NIKE Collaboration Items Release",
    link: "https://humanmade.jp/en/blogs/news/nigo-nike-pendleton-2026-jan",
    date: "2026-01-31",
    source: "HUMAN MADE",
    description: "The world-first release of the NIGO x NIKE collaboration — a four-piece collection of footwear and apparel inspired by college style.",
  },
  {
    title: "NIGO × NIKE Collaboration Sneaker Release",
    link: "https://humanmade.jp/en/blogs/news/nigo-nike-2025-nov",
    date: "2025-11-01",
    source: "HUMAN MADE",
    description: "NIGO and Nike team up on a collaborative sneaker release, available through Human Made's online store.",
  },
];

async function main() {
  let added = 0;
  for (const article of ARTICLES) {
    try {
      const ok = await createDraft(article);
      if (ok) added++;
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\nDone. ${added} HUMAN MADE articles added.`);
}

main().catch(console.error);
