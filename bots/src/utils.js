import * as cheerio from "cheerio";

export const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; nextchapter-dev-bot/0.1; +https://nextchapter.dev)";

export function loadHtml(html) {
  return cheerio.load(html, {
    decodeEntities: false
  });
}

export function cleanText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  return String(value).replace(/\s+/g, " ").trim() || null;
}

export function absoluteUrl(baseUrl, maybeRelativeUrl) {
  if (!maybeRelativeUrl) {
    return null;
  }

  try {
    return new URL(maybeRelativeUrl, baseUrl).toString();
  } catch {
    return null;
  }
}

export function parseCount(value) {
  const text = cleanText(value);
  if (!text) {
    return null;
  }

  if (/too few ratings/i.test(text)) {
    return 0;
  }

  const normalized = text.replace(/,/g, "");
  const match = normalized.match(/(-?\d+(?:\.\d+)?)\s*([KMB])?/i);
  if (!match) {
    return null;
  }

  const number = Number(match[1]);
  if (!Number.isFinite(number)) {
    return null;
  }

  const suffix = match[2]?.toUpperCase();
  const multiplier =
    suffix === "B" ? 1_000_000_000 :
    suffix === "M" ? 1_000_000 :
    suffix === "K" ? 1_000 :
    1;

  return Math.round(number * multiplier);
}

export function parseDate(value) {
  const text = cleanText(value);
  if (!text) {
    return null;
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export function firstNonEmpty(...values) {
  for (const value of values) {
    const text = cleanText(value);
    if (text) {
      return text;
    }
  }

  return null;
}

export function toSlug(value) {
  return cleanText(value)
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") ?? null;
}

export function uniqueBy(items, getKey) {
  const seen = new Set();
  const output = [];

  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(item);
  }

  return output;
}

export function textList(elements) {
  return elements
    .map((element) => cleanText(element))
    .filter(Boolean);
}

export function labeledPairsFromItems(values) {
  const output = {};

  for (let index = 0; index < values.length; index += 2) {
    const key = cleanText(values[index])?.replace(/\s*:$/, "");
    const value = cleanText(values[index + 1]);
    if (!key || !value) {
      continue;
    }

    output[key] = value;
  }

  return output;
}

export function extractTextAfterLabel(text, label) {
  const pattern = new RegExp(`${label}\\s*:?\\s*([^\\n<]+)`, "i");
  const match = text.match(pattern);
  return cleanText(match?.[1]);
}
