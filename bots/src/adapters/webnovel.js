import {
  absoluteUrl,
  cleanText,
  loadHtml,
  parseCount,
  parseDate,
  textList
} from "../utils.js";
import { scrapeWithFirecrawl } from "../firecrawl.js";

const BASE_URL = "https://www.webnovel.com";

const SURFACE_URLS = {
  power: `${BASE_URL}/ranking/fanfic/bi_annual/power_rank`,
  collect: `${BASE_URL}/ranking/fanfic/all_time/collection_rank`,
  popular: `${BASE_URL}/ranking/fanfic/all_time/popular_rank`,
  update: `${BASE_URL}/ranking/fanfic/all_time/update_rank`,
  active: `${BASE_URL}/ranking/fanfic/all_time/engagement_rank`
};

function parseRankingMarkdown(markdown, surface) {
  const parts = markdown.split(/(?:^|\n)_(\d{3})_\s+/g);
  const items = [];

  for (let index = 1; index < parts.length; index += 2) {
    const rankText = parts[index];
    const block = parts[index + 1];
    if (!block) {
      continue;
    }

    const titleLine = block
      .split("\n")
      .find((line) => line.startsWith("### ["));

    const titleMatch = titleLine?.match(/^### \[([^\]]+)\]\((https?:\/\/[^ )\n]+)/);
    if (!titleMatch) {
      continue;
    }

    const categoryLine = block
      .split("\n")
      .find((line) => /\*\*[\d.]+[KMB]?\*\*/.test(line) && /\[[^\]]+\]/.test(line));

    const categoryMatch = categoryLine?.match(/\*\*([\d.]+[KMB]?)\*\*.*?\[([^\]]+)\]\([^)]*\)\s*·\s*\*\*([^*]+)\*\*/);

    items.push({
      siteId: "webnovel",
      surface,
      rank: Number(rankText),
      title: cleanText(titleMatch[1]),
      url: cleanText(titleMatch[2]),
      category: cleanText(categoryMatch?.[2]),
      author: cleanText(categoryMatch?.[3]),
      metrics: {
        collections: surface === "collect" ? parseCount(categoryMatch?.[1]) : null,
        chapters: parseCount(block.match(/(\d+(?:\.\d+)?[KMB]?)\s*Chapters/i)?.[1]),
        views: parseCount(block.match(/(\d+(?:\.\d+)?[KMB]?)\s*Views/i)?.[1])
      }
    });
  }

  return items;
}

function parseWorkHtml(payload, url) {
  const $ = loadHtml(payload.html);
  const text = payload.html;
  const title = cleanText(payload.metadata?.ogTitle ?? $("h1").first().text());
  const author = cleanText($("a[href*='/profile/']").first().text() ?? payload.metadata?.["og:author"]);
  const synopsisNode = $(".j_synopsis").first();
  const ratingText = cleanText($("small").filter((_, node) => /ratings/i.test($(node).text())).first().text());
  const reviewsText = cleanText($(".rev-tit").text());
  const powerSection = cleanText(text.match(/Weekly Power Status[\s\S]{0,500}?NO\.\d+[\s\S]{0,300}?(\d+(?:\.\d+)?[KMB]?)/)?.[0]);
  const chapters = parseCount(text.match(/(\d+(?:\.\d+)?[KMB]?) Chapters/)?.[1]);
  const views = parseCount(text.match(/(\d+(?:\.\d+)?[KMB]?) Views/)?.[1]);
  const ratingValue = Number(text.match(/<strong class="vam fs24 mr8">([\d.]+)<\/strong>/)?.[1] ?? NaN);
  const powerRank = parseCount(text.match(/NO\.(\d+)/)?.[1]);
  const powerStones = parseCount(
    text.match(/Power Ranking<\/small>[\s\S]{0,500}?<strong class="dib vam fs32 fw700 mr8 lh32">\s*([\d.]+[KMB]?)\s*<\/strong>/)?.[1] ??
    text.match(/Stone[\s\S]{0,200}?([\d.]+[KMB]?)\s*<\/strong>/)?.[1]
  );

  return {
    siteId: "webnovel",
    title,
    url,
    author,
    category: cleanText(text.match(/<span>([^<]+)<\/span>\s*<\/a>\s*<strong>\s*<svg><use xlink:href="#i-chapter"/)?.[1]),
    summary: cleanText(synopsisNode.text() ?? payload.metadata?.ogDescription),
    summaryHtml: synopsisNode.html() ?? null,
    tags: textList((payload.metadata?.["og:tag"] ?? "").split(",")),
    metrics: {
      chapters,
      views,
      rating: Number.isFinite(ratingValue) ? ratingValue : null,
      reviewCount: parseCount(reviewsText),
      powerRank,
      powerStones
    },
    lastUpdatedAt: parseDate(payload.metadata?.["og:updated_time"])
  };
}

export const webnovelAdapter = {
  id: "webnovel",

  async crawlSurface({ surface = "power", limit } = {}) {
    const url = SURFACE_URLS[surface];
    if (!url) {
      throw new Error(`Unknown Webnovel surface: ${surface}`);
    }

    const payload = await scrapeWithFirecrawl(url, {
      format: "markdown",
      waitForMs: 1500
    });

    const items = parseRankingMarkdown(payload.markdown ?? "", surface);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  },

  async extractStory({ url } = {}) {
    const payload = await scrapeWithFirecrawl(url, {
      format: "html",
      waitForMs: 1500
    });

    return parseWorkHtml(payload, url);
  }
};
