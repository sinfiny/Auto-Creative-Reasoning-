#!/usr/bin/env node
import { extractStory } from "../crawl.js";
import { listAdapters } from "../adapters/index.js";
import { buildOriginalizationDossier } from "../originalization.js";
import { parseArgs } from "./args.js";

const { positionals, flags } = parseArgs(process.argv.slice(2));
const [siteId, url] = positionals;

if (!siteId || !url) {
  console.error(
    "Usage: npm run originalize -- <site> <url> [--goal control] [--path hybrid] [--audience \"progression fantasy readers\"] [--project-type novel] [--rights-status self-authored] [--include-content] [--max-pages 3] [--max-chapters 10]"
  );
  console.error(`Sites: ${listAdapters().join(", ")}`);
  process.exit(1);
}

const story = await extractStory(siteId, {
  url,
  includeContent: Boolean(flags["include-content"]),
  maxPages: flags["max-pages"] ? Number(flags["max-pages"]) : undefined,
  maxChapters: flags["max-chapters"] ? Number(flags["max-chapters"]) : undefined
});

const dossier = buildOriginalizationDossier(story, {
  goal: flags.goal,
  publishingPath: flags.path,
  audience: flags.audience,
  projectType: flags["project-type"],
  rightsStatus: flags["rights-status"]
});

console.log(JSON.stringify(dossier, null, 2));
