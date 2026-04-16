import {
  absoluteUrl,
  cleanText,
  loadHtml,
  parseCount,
  parseDate,
  textList,
  uniqueBy
} from "../utils.js";
import { fetchText } from "../http.js";

function parseForumListing(html, { baseUrl, siteId, sourceUrl, includeSticky = false }) {
  const $ = loadHtml(html);

  return $(".structItem--thread")
    .map((index, element) => {
      const root = $(element);
      const sticky = root.find(".structItem-status--sticky").length > 0 || /sticky/i.test(root.text());
      if (sticky && !includeSticky) {
        return null;
      }

      const titleLink = root.find(".structItem-title a[href*='/threads/']").first();
      const url = absoluteUrl(baseUrl, titleLink.attr("href"));
      const title = cleanText(titleLink.text());
      const author = cleanText(root.find(".structItem-cell--main a[href*='/members/']").first().text());
      const tags = textList(root.find(".structItem-tagBlock a").map((_, node) => $(node).text()).get());
      const wordCount = parseCount(root.find("a[href*='/threadmarks']").first().text());
      const latestDate = root.find(".structItem-latestDate").first();
      const metaCell = root.find(".structItem-cell--meta").first();

      const dtPairs = {};
      metaCell.find("dt").each((_, dt) => {
        const key = cleanText($(dt).text());
        const value = cleanText($(dt).next("dd").text());
        if (key && value) {
          dtPairs[key] = value;
        }
      });

      return {
        siteId,
        surface: sourceUrl,
        rank: index + 1,
        title,
        url,
        author,
        tags,
        metrics: {
          wordCount,
          replies: parseCount(dtPairs.Replies),
          views: parseCount(dtPairs.Views),
          threadLikeCount: parseCount(metaCell.attr("title")),
          watchers: parseCount(dtPairs.Watchers)
        },
        startedAt: parseDate(root.find(".structItem-startDate time").attr("datetime")),
        lastPostAt: parseDate(latestDate.attr("datetime"))
      };
    })
    .get()
    .filter((item) => item?.title && item?.url)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}

function parseThreadmarkListing(html, { baseUrl, siteId, storyUrl }) {
  const $ = loadHtml(html);
  const title = cleanText($(".threadmarkListingHeader-content h1, h1.p-title-value").first().text());
  const summaryNode = $(".threadmarkListingHeader-extraInfoChild .bbWrapper").first();
  const statsText = cleanText($("[data-storage-key*='threadmark-authors-thread']").text());
  const recentReaders = parseCount(
    $(".threadmarkListingHeader-stats dt")
      .filter((_, dt) => cleanText($(dt).text()) === "Recent readers")
      .next("dd")
      .first()
      .text()
  );

  const chapters = $(".structItem--threadmark")
    .map((_, element) => {
      const root = $(element);
      const titleLink = root.find(".structItem-title a[href*='#post-']").first();
      const url = absoluteUrl(baseUrl, titleLink.attr("href"));
      const titleText = cleanText(titleLink.text());
      const publishedAt = parseDate(root.find("time").attr("datetime"));

      return {
        title: titleText,
        url,
        publishedAt,
        likes: parseCount(root.find(".structItem-cell--meta").attr("title"))
      };
    })
    .get()
    .filter((chapter) => chapter.url);

  return {
    siteId,
    title,
    url: storyUrl,
    summary: cleanText(summaryNode.text()),
    summaryHtml: summaryNode.html() ?? null,
    metrics: {
      threadmarks: parseCount(statsText.match(/(\d+(?:\.\d+)?[KMB]?)\s+threadmarks/i)?.[1]),
      wordCount: parseCount(statsText.match(/(\d+(?:\.\d+)?[KMB]?)\s+words/i)?.[1]),
      recentReaders
    },
    chapters
  };
}

function getLastPageNumber($) {
  const numbers = $(".pageNav-page a")
    .map((_, link) => parseCount($(link).text()))
    .get()
    .filter((value) => typeof value === "number");

  return numbers.length > 0 ? Math.max(...numbers) : 1;
}

async function fetchThreadmarkPages(threadmarksUrl, maxPages) {
  const firstHtml = await fetchText(threadmarksUrl);
  const $ = loadHtml(firstHtml);
  const lastPage = Math.min(getLastPageNumber($), maxPages ?? Number.POSITIVE_INFINITY);
  const pages = [{ page: 1, html: firstHtml }];

  for (let page = 2; page <= lastPage; page += 1) {
    const separator = threadmarksUrl.includes("?") ? "&" : "?";
    const html = await fetchText(`${threadmarksUrl}${separator}page=${page}`);
    pages.push({ page, html });
  }

  return pages;
}

async function fetchReaderPages(readerUrl, maxPages) {
  const firstHtml = await fetchText(readerUrl);
  const $ = loadHtml(firstHtml);
  const lastPage = Math.min(getLastPageNumber($), maxPages ?? Number.POSITIVE_INFINITY);
  const pages = [{ page: 1, html: firstHtml }];

  for (let page = 2; page <= lastPage; page += 1) {
    const nextUrl = readerUrl.endsWith("/") ? `${readerUrl}page-${page}` : `${readerUrl}/page-${page}`;
    const html = await fetchText(nextUrl);
    pages.push({ page, html });
  }

  return pages;
}

function parseReaderContent(html, { baseUrl }) {
  const $ = loadHtml(html);

  return $("article.message.hasThreadmark")
    .map((_, element) => {
      const root = $(element);
      const threadmarkLabel = root.find(".threadmarkLabel").first();
      const content = root.find(".message-body .bbWrapper").first();
      const contentLink = root.find(".threadmark-control--viewContent").first();

      return {
        title: cleanText(threadmarkLabel.text()),
        url: absoluteUrl(baseUrl, contentLink.attr("href")),
        publishedAt: parseDate(root.find("time").first().attr("datetime")),
        contentText: cleanText(content.text()),
        contentHtml: content.html() ?? null
      };
    })
    .get()
    .filter((chapter) => chapter.title && chapter.contentText);
}

export function createXenforoAdapter({
  id,
  baseUrl,
  defaultForumUrl
}) {
  return {
    id,

    async crawlSurface({ url = defaultForumUrl, limit, includeSticky = false } = {}) {
      const html = await fetchText(url);
      const items = parseForumListing(html, {
        baseUrl,
        siteId: id,
        sourceUrl: url,
        includeSticky
      });

      return typeof limit === "number" ? items.slice(0, limit) : items;
    },

    async extractStory({ url, includeContent = false, maxPages } = {}) {
      const storyUrl = url.replace(/\/threadmarks.*$/i, "").replace(/\/all\/reader\/?.*$/i, "").replace(/\/reader\/?.*$/i, "");
      const threadmarksUrl = `${storyUrl.replace(/\/$/, "")}/threadmarks`;
      const pages = await fetchThreadmarkPages(threadmarksUrl, maxPages);
      const parsedPages = pages.map((page) =>
        parseThreadmarkListing(page.html, {
          baseUrl,
          siteId: id,
          storyUrl
        })
      );

      const story = parsedPages[0];
      story.chapters = uniqueBy(
        parsedPages.flatMap((page) => page.chapters),
        (chapter) => chapter.url
      ).map((chapter, index) => ({
        ...chapter,
        index: index + 1
      }));

      if (!includeContent) {
        return story;
      }

      const readerUrl = `${storyUrl.replace(/\/$/, "")}/all/reader/`;
      const readerPages = await fetchReaderPages(readerUrl, maxPages);
      const chapters = uniqueBy(
        readerPages.flatMap((page) => parseReaderContent(page.html, { baseUrl })),
        (chapter) => chapter.url ?? `${chapter.title}:${chapter.publishedAt}`
      ).map((chapter, index) => ({
        ...chapter,
        index: index + 1
      }));

      return {
        ...story,
        chapters
      };
    }
  };
}
