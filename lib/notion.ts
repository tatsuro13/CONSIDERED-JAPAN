import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

type QueryDatabaseArgs = Parameters<typeof notion.databases.query>[0];
type ListBlockChildrenArgs = Parameters<typeof notion.blocks.children.list>[0];

export const DATABASES = {
  season: process.env.NOTION_SEASON_DB_ID!,
  brands: process.env.NOTION_BRANDS_DB_ID!,
  journal: process.env.NOTION_JOURNAL_DB_ID!,
};

const NOTION_REQUEST_INTERVAL_MS = 350;
const NOTION_MAX_RETRIES = 5;
const NOTION_LIST_CACHE_TTL_MS = 60_000;
const NOTION_BLOCK_CACHE_TTL_MS = 300_000;

let notionRequestChain: Promise<void> = Promise.resolve();
let lastNotionRequestAt = 0;

const promiseCache = new Map<string, { expiresAt: number; promise: Promise<unknown> }>();

export interface SeasonPick {
  id: string;
  slug: string;
  brand: string;
  title: string;
  titleJp: string;
  tag: string;
  tagJp: string;
  image: string;
  date: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  titleJp: string;
  date: string;
}

export interface FeedItem {
  id: string;
  slug: string;
  title: string;
  titleJp: string;
  date: string;
  sourceUrl: string;
  sourceName: string;
  heroImage: string;
  summary: string;
  category: string;
}

export interface Brand {
  id: string;
  name: string;
  nameJp: string;
  slug: string;
  since: string;
  category: string;
  internationalShipping: boolean;
  officialUrl: string;
  description: string;
  descriptionJp: string;
  heroImage: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function memoize<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const cached = promiseCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise as Promise<T>;
  }

  const pending = loader().catch((error) => {
    promiseCache.delete(key);
    throw error;
  });

  promiseCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    promise: pending,
  });
  return pending;
}

function getHeaderValue(headers: unknown, key: string): string | null {
  if (!headers || typeof headers !== "object") return null;
  const candidate = headers as { get?: (name: string) => string | null };
  return typeof candidate.get === "function" ? candidate.get(key) : null;
}

function getRetryDelayMs(error: unknown, attempt: number) {
  const retryAfter = Number(getHeaderValue((error as { headers?: unknown })?.headers, "retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }

  return Math.min(16000, 1000 * 2 ** attempt);
}

async function withNotionRetry<T>(loader: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    const code = (error as { code?: string })?.code;
    const status = (error as { status?: number })?.status;

    if ((code === "rate_limited" || status === 429) && attempt < NOTION_MAX_RETRIES) {
      await sleep(getRetryDelayMs(error, attempt));
      return withNotionRetry(loader, attempt + 1);
    }

    throw error;
  }
}

function enqueueNotionRequest<T>(loader: () => Promise<T>): Promise<T> {
  const task = notionRequestChain.then(async () => {
    const waitMs = Math.max(0, lastNotionRequestAt + NOTION_REQUEST_INTERVAL_MS - Date.now());
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    lastNotionRequestAt = Date.now();
    return withNotionRetry(loader);
  });

  notionRequestChain = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
}

async function queryDatabase(args: QueryDatabaseArgs) {
  return enqueueNotionRequest(() => notion.databases.query(args));
}

async function listBlockChildren(args: ListBlockChildrenArgs) {
  return enqueueNotionRequest(() => notion.blocks.children.list(args));
}

async function queryAllDatabasePages(
  args: Omit<QueryDatabaseArgs, "page_size" | "start_cursor">,
) {
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const res = await queryDatabase({
      ...args,
      page_size: 100,
      start_cursor: cursor,
    });

    pages.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

/** Normalize image URL: upgrade http→https for Shopify CDN etc. */
function normalizeImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

function extractTitle(props: any): string {
  const titleProp =
    props["名前"] ??
    props["Title"] ??
    props["Name"] ??
    Object.values(props).find((p: any) => p.type === "title");

  return (titleProp as any)?.title[0]?.plain_text ?? "";
}

function mapSeasonPick(page: any): SeasonPick {
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
}

function mapFeedItem(page: any): FeedItem {
  const props = page.properties;

  return {
    id: page.id,
    slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
    title: extractTitle(props),
    titleJp: props.TitleJp?.rich_text[0]?.plain_text ?? "",
    date: props.Date?.date?.start ?? "",
    sourceUrl: props.SourceUrl?.url ?? "",
    sourceName: props.SourceName?.rich_text[0]?.plain_text ?? "",
    heroImage: normalizeImageUrl(props.HeroImage?.url ?? ""),
    summary: props.Summary?.rich_text[0]?.plain_text ?? "",
    category: props.Category?.select?.name ?? "",
  };
}

function mapBrand(page: any): Brand {
  const props = page.properties;

  return {
    id: page.id,
    name: extractTitle(props),
    nameJp: props.NameJp?.rich_text[0]?.plain_text ?? "",
    slug: props.Slug?.rich_text[0]?.plain_text ?? page.id,
    since: props.Since?.number?.toString() ?? "",
    category: props.Category?.select?.name ?? "",
    internationalShipping: props.InternationalShipping?.checkbox ?? false,
    officialUrl: props.OfficialUrl?.url ?? "",
    description: props.Description?.rich_text[0]?.plain_text ?? "",
    descriptionJp: props.DescriptionJp?.rich_text[0]?.plain_text ?? "",
    heroImage: normalizeImageUrl(props.HeroImage?.url ?? ""),
  };
}

// Fetch published season picks from Notion
export async function getSeasonPicks(): Promise<SeasonPick[]> {
  return memoize("season-picks", NOTION_LIST_CACHE_TTL_MS, async () => {
    const pages = await queryAllDatabasePages({
      database_id: DATABASES.season,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return pages.map(mapSeasonPick);
  });
}

// Fetch a single season pick by slug
export async function getSeasonPickBySlug(slug: string) {
  const picks = await getSeasonPicks();
  return picks.find((pick) => pick.slug === slug) ?? null;
}

// Fetch published journal/feed items
export async function getFeedItems(): Promise<FeedItem[]> {
  return memoize("feed-items", NOTION_LIST_CACHE_TTL_MS, async () => {
    const pages = await queryAllDatabasePages({
      database_id: DATABASES.journal,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return pages.map(mapFeedItem);
  });
}

// Fetch published journal posts
export async function getJournalPosts(): Promise<JournalPost[]> {
  const items = await getFeedItems();

  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    titleJp: item.titleJp,
    date: item.date,
  }));
}

// Fetch a single journal post by slug
export async function getJournalPostBySlug(slug: string) {
  const item = await getFeedItemBySlug(slug);
  if (!item) return null;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    titleJp: item.titleJp,
    date: item.date,
  };
}

export async function getFeedItemBySlug(slug: string) {
  const items = await getFeedItems();
  return items.find((item) => item.slug === slug) ?? null;
}

// Fetch page blocks (for article body) — handles pagination
export async function getPageBlocks(pageId: string) {
  return memoize(`page-blocks:${pageId}`, NOTION_BLOCK_CACHE_TTL_MS, async () => {
    const blocks: any[] = [];
    let cursor: string | undefined;

    do {
      const res = await listBlockChildren({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      blocks.push(...res.results);
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return blocks;
  });
}

// Fetch related articles (same category, excluding current)
export async function getRelatedArticles(
  currentId: string,
  category: string,
  limit = 6,
): Promise<FeedItem[]> {
  const items = await getFeedItems();

  return items
    .filter((item) => item.id !== currentId && (!category || item.category === category))
    .slice(0, limit);
}

// Fetch latest articles (for sidebar / related)
export async function getLatestArticles(
  excludeId: string,
  limit = 4,
): Promise<FeedItem[]> {
  const items = await getFeedItems();

  return items
    .filter((item) => item.id !== excludeId)
    .slice(0, limit);
}

// Fetch all published brands
export async function getBrands(): Promise<Brand[]> {
  return memoize("brands", NOTION_LIST_CACHE_TTL_MS, async () => {
    const pages = await queryAllDatabasePages({
      database_id: DATABASES.brands,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
    });

    return pages.map(mapBrand);
  });
}

// Fetch a single brand by slug
export async function getBrandBySlug(slug: string) {
  const brands = await getBrands();
  return brands.find((brand) => brand.slug === slug) ?? null;
}
