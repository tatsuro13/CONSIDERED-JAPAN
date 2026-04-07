/**
 * Draft記事を一括処理: タイトル整理 + カテゴリ設定 + Publish
 * 日英バイリンガルタイトル + サマリー付与
 */
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

// Article processing data: titleJp, summary, category
const ARTICLE_DATA = {
  // HUMAN MADE articles
  "nigo-human-made-simone-rocha-pitti-uomo-john-galliano-zara-adidas-fw26-runway-trends-top-fashion-news": {
    title: "Nigo Officially Launches Human Made US — Top Fashion News of the Week",
    titleJp: "NIGO、HUMAN MADE米国展開を正式始動——今週のファッションニュース",
    summary: "Human Made's US launch leads the week's biggest stories, alongside Simone Rocha at Pitti Uomo and adidas FW26 runway trends.",
    category: "Report",
  },
  "buffer-human-made": {
    title: `Human Made's New Sub-Brand Buffer — Affordable Streetwear for the Next Generation`,
    titleJp: `HUMAN MADE新ブランド「Buffer」——次世代に向けた手の届くストリートウェア`,
    summary: `Tetsu Nishiyama launches Buffer under Human Made's umbrella, targeting high schoolers with graphic tees by a rotating roster of artists.`,
    category: "Brand Story",
  },
  "human-made-bangkok-store-opening-thailand-kaws-exclusive-items-info": {
    title: "HUMAN MADE Opens First Southeast Asian Store in Bangkok — Exclusive KAWS Items",
    titleJp: "HUMAN MADE、バンコクに東南アジア初の旗艦店をオープン——KAWS限定アイテムも",
    summary: "Human Made expands into Southeast Asia with a Bangkok flagship featuring exclusive KAWS collaboration pieces.",
    category: "Report",
  },
  "nigo-human-made-us-subsidiary-expansion-announcment-info": {
    title: "Human Made Establishes US Subsidiary With $4M Capital — Global Expansion Accelerates",
    titleJp: "HUMAN MADE、400万ドルで米国子会社を設立——グローバル展開が加速",
    summary: "Following a historic Tokyo IPO, NIGO's Human Made quietly establishes a US subsidiary to drive North American growth.",
    category: "Report",
  },
  "pharrell-williams-human-made-advisor": {
    title: "Can Pharrell & NIGO Work Their Magic With Human Made?",
    titleJp: "ファレルとNIGOはHUMAN MADEでその魔法を再現できるか",
    summary: "Pharrell Williams holds the second-largest stake and serves as creative advisor — a look at what this partnership means for the brand's trajectory.",
    category: "Brand Story",
  },
  "follow-the-pink-rabbit-tetsu-nishiyama-launches-buffer-under-human-made": {
    title: "Follow the Pink Rabbit — Tetsu Nishiyama Launches Buffer Under Human Made",
    titleJp: "ピンクのウサギを追え——西山徹がHUMAN MADE傘下で「Buffer」を始動",
    summary: "Buffer's debut drops four graphic tees and goods, each designed by a different illustrator, at an accessible price point.",
    category: "Product",
  },
  "human-made-red-wing-boots-footwear-apparel-collection-release-info": {
    title: `Human Made × Red Wing — "The Future Is in the Past" Collection`,
    titleJp: `HUMAN MADE × Red Wing——「未来は過去にある」コレクション`,
    summary: `A limited capsule of heritage boots and varsity-inspired apparel, bridging Japanese craft and American workwear tradition.`,
    category: "Product",
  },
  "nigo-pharrell-human-made-historic-ipo-tokyo-stock-exchange-announcement": {
    title: "Human Made Makes History — $460M IPO on the Tokyo Stock Exchange",
    titleJp: "HUMAN MADE、東京証券取引所に上場——時価総額460億円の歴史的IPO",
    summary: `NIGO's label becomes one of the first independent Japanese streetwear brands to go public, backed by Pharrell Williams as second-largest shareholder.`,
    category: "Report",
  },
  "nigo-nike-pendleton-2026-jan": {
    title: "NIGO × NIKE — College-Inspired Collaboration Drops Worldwide",
    titleJp: "NIGO × NIKE——カレッジスタイルにインスパイアされたコラボレーション、全世界発売",
    summary: "A four-piece footwear and apparel collection blending Nike's athletic DNA with NIGO's vintage Americana obsession.",
    category: "Product",
  },
  "nigo-nike-2025-nov": {
    title: "NIGO × NIKE Collaboration Sneaker — A First Look",
    titleJp: "NIGO × NIKEコラボスニーカー——ファーストルック",
    summary: "NIGO and Nike unveil their collaborative sneaker, available exclusively through Human Made's online store.",
    category: "Product",
  },
};

async function main() {
  // Fetch all drafts
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

  console.log(`Found ${allDrafts.length} drafts\n`);

  let processed = 0;

  for (const page of allDrafts) {
    const props = page.properties;
    const title = props["名前"]?.title?.[0]?.plain_text ?? "";
    const slug = props.Slug?.rich_text?.[0]?.plain_text ?? "";

    // Check if we have data for this slug
    const data = ARTICLE_DATA[slug];
    if (!data) {
      console.log(`  SKIP (no data): ${title.slice(0, 50)}`);
      continue;
    }

    process.stdout.write(`  Processing: ${slug.slice(0, 40)}... `);

    const update = {
      名前: { title: [{ text: { content: data.title } }] },
      Status: { select: { name: "Published" } },
    };

    if (data.titleJp) {
      update.TitleJp = { rich_text: [{ text: { content: data.titleJp } }] };
    }
    if (data.summary) {
      update.Summary = { rich_text: [{ text: { content: data.summary } }] };
    }
    if (data.category) {
      update.Category = { select: { name: data.category } };
    }

    await notion.pages.update({ page_id: page.id, properties: update });
    console.log("PUBLISHED");
    processed++;

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. ${processed} articles processed and published.`);
}

main().catch(console.error);
