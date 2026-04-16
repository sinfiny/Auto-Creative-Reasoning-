import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function scrapeWithFirecrawl(url, options = {}) {
  const args = ["scrape", url, "--json"];

  if (options.format) {
    args.push("--format", options.format);
  }

  if (options.waitForMs) {
    args.push("--wait-for", String(options.waitForMs));
  }

  const { stdout } = await execFileAsync("firecrawl", args, {
    maxBuffer: 64 * 1024 * 1024
  });

  return JSON.parse(stdout);
}
