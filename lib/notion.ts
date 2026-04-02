import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const DATABASES = {
  season: process.env.NOTION_SEASON_DB_ID!,
  brands: process.env.NOTION_BRANDS_DB_ID!,
  journal: process.env.NOTION_JOURNAL_DB_ID!,
};

function extractTitle(props: any): string {
  const titleProp =
    props["名前"] ?? props["Title"] ?? props["Name"] ??
    Object.values(props).find((p: any) => p.type === "title");
  return (titleProp as any)?.title[0]?.plain_text ?? "";
}

// Fetch published season picks from Notion
export async function getSeasonPicks() {
  const res = await notion.databases.query({
    database_id: DATABASES.season,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return res.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
      brand: props.Brand?.select?.name ?? "",
      title: extractTitle(props),
      titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
      tag: props.Tag?.select?.name ?? "NEW ARRIVAL",
      tagJp: props.TagJp?.rich_text[0]?.plain_text ?? "新着",
      image: props.Image?.url ?? "",
      date: props.Date?.date?.start ?? "",
    };
  });
}

// Fetch a single season pick by slug
export async function getSeasonPickBySlug(slug: string) {
  const res = await notion.databases.query({
    database_id: DATABASES.season,
    filter: {
      and: [
        { property: "Status", select: { equals: "Published" } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
  });

  if (!res.results.length) return null;

  const page = res.results[0] as any;
  const props = page.properties;
  return {
    id: page.id,
    slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
    brand: props.Brand?.select?.name ?? "",
    title: extractTitle(props),
    titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
    tag: props.Tag?.select?.name ?? "",
    tagJp: props.TagJp?.rich_text[0]?.plain_text ?? "",
    image: props.Image?.url ?? "",
    date: props.Date?.date?.start ?? "",
  };
}

// Fetch published journal posts
export async function getJournalPosts() {
  const res = await notion.databases.query({
    database_id: DATABASES.journal,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return res.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
      title: extractTitle(props),
      titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
      date: props.Date?.date?.start ?? "",
    };
  });
}

// Fetch a single journal post by slug
export async function getJournalPostBySlug(slug: string) {
  const res = await notion.databases.query({
    database_id: DATABASES.journal,
    filter: {
      and: [
        { property: "Status", select: { equals: "Published" } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
  });

  if (!res.results.length) return null;

  const page = res.results[0] as any;
  const props = page.properties;
  return {
    id: page.id,
    slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
    title: extractTitle(props),
    titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
    date: props.Date?.date?.start ?? "",
  };
}

// Fetch page blocks (for article body)
export async function getPageBlocks(pageId: string) {
  const res = await notion.blocks.children.list({ block_id: pageId });
  return res.results;
}

// Fetch all published brands
export async function getBrands() {
  const res = await notion.databases.query({
    database_id: DATABASES.brands,
    filter: {
      property: "Status",
      select: { equals: "Published" },
    },
  });

  return res.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      name: extractTitle(props),
      nameJp: props.NameJp?.rich_text[0]?.plain_text ?? "",
      since: props.Since?.number?.toString() ?? "",
      category: props.Category?.select?.name ?? "",
      internationalShipping: props.InternationalShipping?.checkbox ?? false,
      officialUrl: props.OfficialUrl?.url ?? "",
    };
  });
}
