#!/usr/bin/env node
import { extractStory } from "../crawl.js";
import { listAdapters } from "../adapters/index.js";
import { parseArgs } from "./args.js";

const { positionals, flags } = parseArgs(process.argv.slice(2));
const [siteId, url] = positionals;

if (!siteId || !url) {
  console.error(`Usage: npm run extract -- <site> <url> [--include-content] [--max-pages 3] [--max-chapters 10]`);
  console.error(`Sites: ${listAdapters().join(", ")}`);
  process.exit(1);
}

const result = await extractStory(siteId, {
  url,
  includeContent: Boolean(flags["include-content"]),
  maxPages: flags["max-pages"] ? Number(flags["max-pages"]) : undefined,
  maxChapters: flags["max-chapters"] ? Number(flags["max-chapters"]) : undefined
});

console.log(JSON.stringify(result, null, 2));
