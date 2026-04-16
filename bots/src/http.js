import { DEFAULT_USER_AGENT } from "./utils.js";

export async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    ...options,
    headers: {
      "user-agent": DEFAULT_USER_AGENT,
      "accept-language": "en-US,en;q=0.9",
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${url}`);
  }

  return await response.text();
}
