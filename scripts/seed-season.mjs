// scripts/seed-season.mjs
// Run: node --env-file=.env.local scripts/seed-season.mjs

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_SEASON_DB_ID;

const picks = [
  {
    name: "Trekker Coat — Spring 2026",
    titleJp: "トレッカーコート — 2026春",
    slug: "nonnative-trekker-coat-ss26",
    brand: "nonnative",
    tag: "NEW ARRIVAL",
    tagJp: "新着",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    date: "2026-03-15",
  },
  {
    name: "Silk Noil Shirt",
    titleJp: "シルクノイルシャツ",
    slug: "comoli-silk-noil-shirt",
    brand: "COMOLI",
    tag: "SEASON PICK",
    tagJp: "シーズンピック",
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1200&q=80",
    date: "2026-03-10",
  },
  {
    name: "Oxford B.D. Shirt",
    titleJp: "オックスフォードBDシャツ",
    slug: "graphpaper-oxford-bd",
    brand: "Graphpaper",
    tag: "SEASON PICK",
    tagJp: "シーズンピック",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    date: "2026-03-05",
  },
  {
    name: "Organic Cotton Trousers",
    titleJp: "オーガニックコットントラウザー",
    slug: "markaware-organic-cotton-trousers",
    brand: "Markaware",
    tag: "SEASON PICK",
    tagJp: "シーズンピック",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=80",
    date: "2026-03-01",
  },
];

async function main() {
  console.log(`Seeding ${picks.length} season picks...`);

  for (const pick of picks) {
    try {
      await notion.pages.create({
        parent: { database_id: DB_ID },
        properties: {
          名前: {
            title: [{ text: { content: pick.name } }],
          },
          TitleJp: {
            rich_text: [{ text: { content: pick.titleJp } }],
          },
          Slug: {
            rich_text: [{ text: { content: pick.slug } }],
          },
          Brand: {
            select: { name: pick.brand },
          },
          Tag: {
            select: { name: pick.tag },
          },
          TagJp: {
            rich_text: [{ text: { content: pick.tagJp } }],
          },
          Image: {
            url: pick.image,
          },
          Date: {
            date: { start: pick.date },
          },
          Status: {
            select: { name: "Published" },
          },
        },
      });
      console.log(`✓ ${pick.name}`);
    } catch (err) {
      console.error(`✗ ${pick.name}: ${err.message}`);
    }
  }

  console.log("Done!");
}

main();
