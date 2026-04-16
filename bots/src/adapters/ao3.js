import {
  absoluteUrl,
  cleanText,
  loadHtml,
  parseCount,
  parseDate,
  textList
} from "../utils.js";
import { fetchText } from "../http.js";

const BASE_URL = "https://archive.transformativeworks.org";

function parseListing(html, sourceUrl) {
  const $ = loadHtml(html);

  return $("li.work.blurb, li.blurb")
    .map((index, element) => {
      const root = $(element);
      const titleLink = root.find("h4.heading a[href*='/works/']").first();
      const url = absoluteUrl(BASE_URL, titleLink.attr("href"));
      const title = cleanText(titleLink.text());
      const authors = textList(root.find("a[rel='author']").map((_, node) => $(node).text()).get());
      const summary = cleanText(root.find("blockquote.summary, .userstuff.summary").text());
      const tags = textList(root.find("a.tag").map((_, node) => $(node).text()).get());
      const metrics = {
        words: parseCount(root.find("dd.words").text()),
        chapters: parseCount(root.find("dd.chapters").text()),
        comments: parseCount(root.find("dd.comments").text()),
        kudos: parseCount(root.find("dd.kudos").text()),
        bookmarks: parseCount(root.find("dd.bookmarks").text()),
        hits: parseCount(root.find("dd.hits").text())
      };

      return {
        siteId: "ao3",
        surface: sourceUrl,
        rank: index + 1,
        title,
        url,
        authors,
        summary,
        tags,
        metrics,
        lastUpdatedAt: parseDate(root.find(".datetime").first().text())
      };
    })
    .get()
    .filter((item) => item.title && item.url);
}

function parseDownloadLinks($) {
  return $("li.download a")
    .map((_, link) => {
      const root = $(link);
      return {
        format: cleanText(root.text()),
        url: absoluteUrl(BASE_URL, root.attr("href"))
      };
    })
    .get();
}

function parseChapters($, url) {
  const chapterBlocks = $("#chapters .chapter, #chapters [id^='chapter-']");
  if (chapterBlocks.length === 0) {
    const singleContent = $("#chapters .userstuff, .chapter .userstuff").first();
    if (singleContent.length === 0) {
      return [];
    }

    return [
      {
        index: 1,
        title: cleanText($("h2.title").first().text()) ?? "Chapter 1",
        url,
        contentText: cleanText(singleContent.text()),
        contentHtml: singleContent.html() ?? null
      }
    ];
  }

  return chapterBlocks
    .map((index, element) => {
      const root = $(element);
      const content = root.find(".userstuff[role='article'], .userstuff.module").last();
      const title =
        cleanText(root.find("h3.title, h3.heading, .chapter h3").first().text()) ??
        `Chapter ${index + 1}`;

      return {
        index: index + 1,
        title,
        url,
        contentText: cleanText(content.text()),
        contentHtml: content.html() ?? null
      };
    })
    .get();
}

function parseWork(html, url) {
  const $ = loadHtml(html);
  const stats = $("dl.stats").first();

  return {
    siteId: "ao3",
    title: cleanText($("h2.title.heading").first().text()),
    url,
    authors: textList($("a[rel='author']").map((_, node) => $(node).text()).get()),
    summary: cleanText($("blockquote.userstuff").first().text()),
    summaryHtml: $("blockquote.userstuff").first().html() ?? null,
    tags: textList($(".tags a.tag").map((_, node) => $(node).text()).get()),
    metrics: {
      words: parseCount(stats.find("dd.words").text()),
      chapters: parseCount(stats.find("dd.chapters").text()),
      comments: parseCount(stats.find("dd.comments").text()),
      kudos: parseCount(stats.find("dd.kudos").text()),
      bookmarks: parseCount(stats.find("dd.bookmarks").text()),
      hits: parseCount(stats.find("dd.hits").text())
    },
    publishedAt: parseDate(stats.find("dd.published").text()),
    lastUpdatedAt: parseDate(stats.find("dd.status").text() ?? stats.find("dd.updated").text()),
    downloadLinks: parseDownloadLinks($),
    chapters: parseChapters($, url)
  };
}

export const ao3Adapter = {
  id: "ao3",

  async crawlSurface({ url, limit } = {}) {
    if (!url) {
      throw new Error("AO3 crawling needs a listing URL, such as a fandom or tag works page.");
    }

    const html = await fetchText(url);
    const items = parseListing(html, url);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  },

  async extractStory({ url } = {}) {
    const fullWorkUrl = url.includes("?")
      ? `${url}&view_full_work=true`
      : `${url}?view_full_work=true`;
    const html = await fetchText(fullWorkUrl);
    return parseWork(html, fullWorkUrl);
  }
};
