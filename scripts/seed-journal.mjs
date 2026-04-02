// scripts/seed-journal.mjs
// Run: node --env-file=.env.local scripts/seed-journal.mjs

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_JOURNAL_DB_ID;

async function main() {
  console.log("Creating journal article...");

  const page = await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      名前: {
        title: [{ text: { content: "nonnative: The Art of Considered Movement" } }],
      },
      TitleJp: {
        rich_text: [{ text: { content: "ノンネイティブ：考え抜かれた動きのアート" } }],
      },
      Slug: {
        rich_text: [{ text: { content: "nonnative-considered-movement" } }],
      },
      Date: {
        date: { start: "2026-03-20" },
      },
      Status: {
        select: { name: "Published" },
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "There is a specific kind of restraint in nonnative's work that takes years to understand. The Tokyo-based label, founded in 1999 by Daisuke Nishida, does not chase trends. It does not shout. It waits — and when you are ready, you find it.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Functional Roots" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "nonnative draws its vocabulary from workwear, military surplus, and outdoor equipment — but reinterprets each reference with an almost obsessive attention to material and proportion. A field jacket becomes a meditation on silhouette. A camp cap becomes a study in fabric weight. Nothing is adopted without being reconsidered.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "The Philosophy of Wear" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "What separates nonnative from its peers is a commitment to wearability that never sacrifices aesthetics. Nishida describes his ideal customer as someone who moves through the city and the countryside with equal ease — not a fashion person, but a person for whom clothes are tools that also happen to be beautiful.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "quote",
        quote: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "I want people to forget they are wearing nonnative. I want the clothes to disappear into their lives.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Season After Season" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "Each nonnative collection is built around a loose narrative — a journey, a landscape, a state of mind. Spring/Summer 2026 takes its cues from high-altitude trekking: elongated silhouettes that allow full range of motion, fabrics that breathe in the heat and hold warmth in the cold, colors pulled from stone and lichen and early morning sky.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "The Trekker Coat — perhaps the season's defining piece — is cut from a Japanese-milled nylon ripstop with a hand that feels almost like cotton. It moves with the body rather than against it. This is the nonnative way: technical thinking made human.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "divider",
        divider: {},
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "nonnative is stocked at select retailers in Tokyo, Osaka, and internationally. Their official site ships worldwide.",
              },
            },
          ],
        },
      },
    ],
  });

  console.log(`✓ Created: ${page.id}`);
  console.log("Slug: nonnative-considered-movement");
  console.log("Done!");
}

main().catch(console.error);
