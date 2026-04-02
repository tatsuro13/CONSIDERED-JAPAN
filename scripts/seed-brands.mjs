// scripts/seed-brands.mjs
// Run: node --env-file=.env.local scripts/seed-brands.mjs

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_BRANDS_DB_ID;

const brands = [
  {
    name: "COMOLI",
    nameJp: "コモリ",
    since: 2012,
    category: "Minimal / Natural Material",
    officialUrl: "https://comoli.jp",
    internationalShipping: false,
  },
  {
    name: "Graphpaper",
    nameJp: "グラフペーパー",
    since: 2016,
    category: "Workwear / Refined",
    officialUrl: "https://graphpaper.jp",
    internationalShipping: false,
  },
  {
    name: "Markaware",
    nameJp: "マーカウェア",
    since: 2011,
    category: "Sustainable / Minimal",
    officialUrl: "https://markaware.jp",
    internationalShipping: false,
  },
  {
    name: "Porter Classic",
    nameJp: "ポータークラシック",
    since: 2007,
    category: "Bags / Craft",
    officialUrl: "https://www.porter.co.jp",
    internationalShipping: false,
  },
  {
    name: "sacai",
    nameJp: "サカイ",
    since: 1999,
    category: "Hybrid / Designer",
    officialUrl: "https://www.sacai.jp",
    internationalShipping: true,
  },
  {
    name: "Y-3",
    nameJp: "ワイスリー",
    since: 2002,
    category: "Sport / Designer",
    officialUrl: "https://www.y-3.com",
    internationalShipping: true,
  },
  {
    name: "HYKE",
    nameJp: "ハイク",
    since: 2013,
    category: "Womenswear / Minimal",
    officialUrl: "https://hyke.jp",
    internationalShipping: false,
  },
  {
    name: "Freshservice",
    nameJp: "フレッシュサービス",
    since: 2008,
    category: "Workwear / Functional",
    officialUrl: "https://freshservice.jp",
    internationalShipping: false,
  },
  {
    name: "EYEVAN",
    nameJp: "アイヴァン",
    since: 1972,
    category: "Eyewear / Heritage",
    officialUrl: "https://www.eyevan.com",
    internationalShipping: true,
  },
  {
    name: "Kijima Takayuki",
    nameJp: "木島タカユキ",
    since: 2002,
    category: "Hats / Artisan",
    officialUrl: "https://kijima-takayuki.com",
    internationalShipping: false,
  },
  {
    name: "Comme des Garçons",
    nameJp: "コム・デ・ギャルソン",
    since: 1969,
    category: "Avant-garde / Designer",
    officialUrl: "https://www.comme-des-garcons.com",
    internationalShipping: true,
  },
  {
    name: "Yohji Yamamoto",
    nameJp: "ヨウジヤマモト",
    since: 1972,
    category: "Avant-garde / Dark",
    officialUrl: "https://www.yohjiyamamoto.co.jp",
    internationalShipping: true,
  },
];

async function main() {
  console.log(`Seeding ${brands.length} brands to Notion...`);

  for (const brand of brands) {
    try {
      await notion.pages.create({
        parent: { database_id: DB_ID },
        properties: {
          名前: {
            title: [{ text: { content: brand.name } }],
          },
          NameJp: {
            rich_text: [{ text: { content: brand.nameJp } }],
          },
          Since: {
            number: brand.since,
          },
          Category: {
            select: { name: brand.category },
          },
          OfficialUrl: {
            url: brand.officialUrl,
          },
          InternationalShipping: {
            checkbox: brand.internationalShipping,
          },
          Status: {
            select: { name: "Published" },
          },
        },
      });
      console.log(`✓ ${brand.name}`);
    } catch (err) {
      console.error(`✗ ${brand.name}: ${err.message}`);
    }
  }

  console.log("Done!");
}

main();
