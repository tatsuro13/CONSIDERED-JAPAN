import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const DATABASES = {
  season: process.env.NOTION_SEASON_DB_ID!,
  brands: process.env.NOTION_BRANDS_DB_ID!,
  journal: process.env.NOTION_JOURNAL_DB_ID!,
};

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
      title: props.Title?.title[0]?.plain_text ?? "",
      titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
      tag: props.Tag?.select?.name ?? "NEW ARRIVAL",
      tagJp: props.TagJp?.rich_text[0]?.plain_text ?? "新着",
      image: props.Image?.url ?? "",
      date: props.Date?.date?.start ?? "",
    };
  });
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
      title: props.Title?.title[0]?.plain_text ?? "",
      titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
      date: props.Date?.date?.start ?? "",
    };
  });
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
    // Title property may be named "名前" (Japanese default) or "Name"
    const titleProp =
      props["名前"] ?? props["Name"] ??
      Object.values(props).find((p: any) => p.type === "title");
    return {
      id: page.id,
      name: (titleProp as any)?.title[0]?.plain_text ?? "",
      nameJp: props.NameJp?.rich_text[0]?.plain_text ?? "",
      since: props.Since?.number?.toString() ?? "",
      category: props.Category?.select?.name ?? "",
      internationalShipping: props.InternationalShipping?.checkbox ?? false,
      officialUrl: props.OfficialUrl?.url ?? "",
    };
  });
}
