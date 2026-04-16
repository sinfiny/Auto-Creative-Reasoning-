import {
  absoluteUrl,
  cleanText,
  labeledPairsFromItems,
  loadHtml,
  parseCount,
  parseDate,
  textList
} from "../utils.js";
import { fetchText } from "../http.js";

const BASE_URL = "https://www.royalroad.com";

const SURFACE_URLS = {
  trending: `${BASE_URL}/fictions/trending`,
  weekly: `${BASE_URL}/fictions/weekly-popular`,
  ongoing: `${BASE_URL}/fictions/active-popular`,
  active: `${BASE_URL}/fictions/active-popular`,
  bestRated: `${BASE_URL}/fictions/best-rated`,
  rising: `${BASE_URL}/fictions/rising-stars`
};

function parseListingItem($, element, surface, rank) {
  const root = $(element);
  const titleLink = root.find("h2 a").first();
  const url = absoluteUrl(BASE_URL, titleLink.attr("href"));
  const title = cleanText(titleLink.text());
  const summary = cleanText(root.find("[id^='description-']").first().text());
  const statusText = cleanText(root.text());
  const tags = textList(root.find(".fiction-tag").map((_, tag) => $(tag).text()).get());

  const spans = root.find(".stats span").map((_, span) => $(span).text()).get();
  const metrics = {
    followers: parseCount(spans.find((text) => /followers/i.test(text))),
    pages: parseCount(spans.find((text) => /pages/i.test(text))),
    views: parseCount(spans.find((text) => /views/i.test(text))),
    chapters: parseCount(spans.find((text) => /chapters/i.test(text)))
  };

  const dateText = root.find("time").attr("datetime") ?? root.find("time").text();

  return {
    siteId: "royalroad",
    surface,
    rank,
    title,
    url,
    summary,
    tags,
    status: /completed/i.test(statusText) ? "completed" : /ongoing/i.test(statusText) ? "ongoing" : null,
    metrics,
    lastUpdatedAt: parseDate(dateText)
  };
}

function parseListing(html, surface) {
  const $ = loadHtml(html);

  return $(".fiction-list-item")
    .map((index, element) => parseListingItem($, element, surface, index + 1))
    .get()
    .filter((item) => item.title && item.url);
}

function parseStoryDetails(html, url) {
  const $ = loadHtml(html);
  const ldJsonText = $("script[type='application/ld+json']")
    .map((_, node) => $(node).contents().text())
    .get()
    .find((text) => /"@type":"Book"/.test(text));
  let ldJson = null;
  if (ldJsonText) {
    try {
      ldJson = JSON.parse(ldJsonText);
    } catch {
      ldJson = null;
    }
  }
  const title = cleanText($("h1").first().text());
  const author = cleanText($("h4 a[href*='/profile/']").first().text());
  const summaryHtml = $(".description .hidden-content").html() ?? $(".description").html();
  const summary = cleanText($(".description").text());
  const tags = textList($(".fiction-tag").map((_, tag) => $(tag).text()).get());
  const statusText = cleanText($("body").text());
  const infoValues = $("#chapters")
    .closest(".row")
    .prevAll(".fiction-info")
    .first()
    .find("li")
    .map((_, item) => $(item).text())
    .get();
  const labeled = labeledPairsFromItems(infoValues);
  const chapters = $("#chapters tr.chapter-row")
    .map((index, row) => {
      const root = $(row);
      const chapterLink = root.find("td a").first();
      const chapterUrl = absoluteUrl(BASE_URL, root.attr("data-url") ?? chapterLink.attr("href"));
      const titleText = cleanText(chapterLink.text());
      const publishedAt = parseDate(root.find("time").attr("datetime") ?? root.find("time").text());

      return {
        index: index + 1,
        title: titleText,
        url: chapterUrl,
        publishedAt
      };
    })
    .get()
    .filter((chapter) => chapter.url);

  return {
    siteId: "royalroad",
    title,
    url,
    author,
    summary,
    summaryHtml,
    tags,
    status: /completed/i.test(statusText) ? "completed" : /ongoing/i.test(statusText) ? "ongoing" : null,
    metrics: {
      views: parseCount(labeled["Total Views"]) ?? parseCount(ldJson?.interactionStatistic?.userInteractionCount),
      followers: parseCount(labeled["Followers"]) ?? parseCount(html.match(/Followers\s*:<\/li>\s*<li[^>]*>\s*([^<]+)/i)?.[1]),
      pages: parseCount(labeled["Pages"]) ?? parseCount(ldJson?.numberOfPages),
      chapters: parseCount(cleanText($("#chapters").attr("data-chapters")) ?? chapters.length),
      averageViews: parseCount(labeled["Average Views"])
    },
    lastUpdatedAt: parseDate(labeled["Last Update"]) ?? parseDate(ldJson?.dateModified),
    chapters
  };
}

function parseChapter(html, url, index) {
  const $ = loadHtml(html);

  return {
    index,
    title: cleanText($("h1").first().text()),
    url,
    contentText: cleanText($(".chapter-inner.chapter-content").text()),
    contentHtml: $(".chapter-inner.chapter-content").html() ?? null,
    authorNoteText: cleanText($(".author-note-portlet").text()),
    authorNoteHtml: $(".author-note-portlet .portlet-body").html() ?? null
  };
}

export const royalRoadAdapter = {
  id: "royalroad",

  async crawlSurface({ surface = "trending", limit } = {}) {
    const url = SURFACE_URLS[surface];
    if (!url) {
      throw new Error(`Unknown Royal Road surface: ${surface}`);
    }

    const html = await fetchText(url);
    const items = parseListing(html, surface);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  },

  async extractStory({ url, includeContent = false, maxChapters } = {}) {
    const html = await fetchText(url);
    const story = parseStoryDetails(html, url);

    if (!includeContent) {
      return story;
    }

    const chapterLimit = maxChapters ?? story.chapters.length;
    const chapters = [];

    for (const chapter of story.chapters.slice(0, chapterLimit)) {
      const chapterHtml = await fetchText(chapter.url);
      chapters.push(parseChapter(chapterHtml, chapter.url, chapter.index));
    }

    return {
      ...story,
      chapters
    };
  }
};
