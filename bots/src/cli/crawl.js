#!/usr/bin/env node
import { crawlSite } from "../crawl.js";
import { listAdapters } from "../adapters/index.js";
import { parseArgs } from "./args.js";

const { positionals, flags } = parseArgs(process.argv.slice(2));
const [siteId, surfaceOrUrl] = positionals;

if (!siteId) {
  console.error(`Usage: npm run crawl -- <site> [surface-or-url] [--limit 10]`);
  console.error(`Sites: ${listAdapters().join(", ")}`);
  process.exit(1);
}

const options = {
  limit: flags.limit ? Number(flags.limit) : undefined
};

if (siteId === "ao3") {
  options.url = surfaceOrUrl;
} else if (surfaceOrUrl) {
  options.surface = surfaceOrUrl;
}

const result = await crawlSite(siteId, options);
console.log(JSON.stringify(result, null, 2));
