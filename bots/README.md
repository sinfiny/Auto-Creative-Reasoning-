# Fanfic Trend Tracker Starter

This repo is a starter for a bot-driven system that:

- watches public "trending" and "popular" surfaces across fanfic platforms
- captures richer popularity and activity signals than a single trend list
- generates commentary explaining why a story looks hot right now
- keeps extraction and publishing behind policy gates instead of assuming every source can be mirrored safely

The current scaffold is intentionally source-light and automation-heavy: it gives you a normalized data model, per-site capability map, and a scoring/explanation layer you can plug real crawlers into later.

## What the starter includes

- `src/siteCatalog.js`
  - public surfaces and signals we can reliably observe per site
- `src/popularity.js`
  - normalized scoring and "why this is popular" explanation logic
- `src/demo.js`
  - sample records showing how cross-site inputs become a common score

## Suggested system architecture

1. Discovery layer
   - Pull public ranking pages, forum indexes, tag listings, or work pages.
   - Store raw HTML or markdown snapshots so you can audit parser changes.

2. Normalization layer
   - Convert source-specific fields into a shared story record.
   - Example: `followers`, `kudos`, `collections`, `replies`, and `powerStones` all become engagement inputs.

3. Commentary layer
   - Produce human-readable reasons such as:
   - "ranked on Royal Road Trending and Popular This Week"
   - "updated in the last 24 hours and has unusually strong comments-per-view"
   - "large word count plus active discussion suggests ongoing reader commitment"

4. Extraction layer
   - Keep this separate from ranking.
   - Prefer official download flows when they exist.
   - For chapter scraping, require an allowlist plus rate limits and a rights check.

5. Generation layer for `nextchapter.dev`
   - Never auto-publish directly from ingestion.
   - Add rights, source-policy, and franchise-risk gates first.

## What to watch besides "trending"

Different sites expose different proxies for popularity and current activity.

- Royal Road
  - Trending
  - Popular this week
  - Ongoing Fictions
  - Best Rated
  - Rising Stars
  - Followers, views, chapters, pages, last update date

- AO3
  - No official "trending" page
  - Sorts by kudos, comments, bookmarks, hits, date updated, date posted
  - Public counters on works commonly include kudos, bookmarks, hits, comments, chapters
  - Work subscriptions matter, but are less visible from public browsing than kudos/bookmarks/hits

- SpaceBattles
  - Creative Writing forum index
  - New posts
  - New threadmarks
  - Index sorting supports replies, views, thread like count, word count, awards count, last threadmark, watchers
  - Thread-level momentum is usually better captured by recent replies plus recency plus threadmark activity than by raw views alone

- Questionable Questing
  - Creative Writing forum index
  - New posts
  - New threadmarks
  - Public thread listings expose replies, views, word count, last activity time

- Webnovel
  - Fan-fic rankings for Power, Collect, Popular, Update, Active
  - Work pages expose chapter count, views, ratings, reviews
  - Weekly power status and power stones are strong current-momentum signals

## Recommended popularity model

Use four buckets instead of a single score:

- Momentum
  - trend rank, weekly rank, active rank, recency of update, new threadmarks
- Reach
  - views, followers, hits, collections
- Engagement
  - comments, reviews, kudos, bookmarks, subscriptions, replies, power stones
- Reader commitment
  - chapters, word count, threadmarks, repeat discussion over time

This lets your bots explain both:

- "why it is big"
- "why it is hot right now"

## Safe extraction strategy

Use one of three modes per site:

- `official_download`
  - Best case. AO3 already supports downloads.
- `chapter_scrape`
  - Needed for sites that do not expose a first-party export.
- `metadata_only`
  - Use this when rights or policy are unclear and you only need ranking/commentary.

## Publishing policy for `nextchapter.dev`

This is the part that needs the strongest guardrails.

- Low-risk mode
  - publish commentary, summaries, rankings, and links back
- Medium-risk mode
  - publish opt-in continuations only for works where the author has granted permission
- High-risk mode
  - auto-generating "next chapters" for copyrighted fanfiction or scraped full texts without permission

I would strongly recommend you do not auto-publish continuation chapters unless:

- the source work is opt-in
- the underlying franchise risk is acceptable to you
- the site policy for the source is compatible with your use
- you have a takedown path and provenance records

## Sources used for this starter

- Royal Road Trending: https://www.royalroad.com/fictions/trending
- Royal Road Ongoing Fictions: https://www.royalroad.com/fictions/active-popular
- Royal Road Popular This Week: https://www.royalroad.com/fictions/weekly-popular
- AO3 searching and sorting overview: https://archive.transformativeworks.org/admin_posts/259
- AO3 accessing fanworks FAQ: https://archive.transformativeworks.org/faq/accessing-fanworks?language_id=en
- SpaceBattles Creative Writing: https://forums.spacebattles.com/forums/creative-writing.18/
- Questionable Questing Creative Writing: https://forum.questionablequesting.com/forums/creative-writing.19/
- Webnovel fan-fic rankings: https://www.webnovel.com/ranking/fanfic/all_time/collection_rank
- Example Webnovel work page: https://www.webnovel.com/book/in-hogwarts-with-a-game-template-system_35592210900846705

## Run the demo

```bash
npm run demo
```

## Crawl live surfaces

```bash
npm run crawl -- royalroad trending --limit 5
npm run crawl -- spacebattles --limit 5
npm run crawl -- questionablequesting --limit 5
npm run crawl -- webnovel power --limit 5
npm run crawl -- ao3 "https://archive.transformativeworks.org/tags/Harry%20Potter/works?work_search%5Bsort_column%5D=kudos_count"
```

## Extract stories

```bash
npm run extract -- royalroad https://www.royalroad.com/fiction/21220/mother-of-learning --max-chapters 3 --include-content
npm run extract -- spacebattles https://forums.spacebattles.com/threads/a-young-womans-defense-of-the-inner-sphere.1210145/ --max-pages 2
npm run extract -- questionablequesting https://forum.questionablequesting.com/threads/the-cold-between-wars-naruto-oc.37532/ --max-pages 2 --include-content
npm run extract -- ao3 https://archive.transformativeworks.org/works/16844275
npm run extract -- webnovel https://www.webnovel.com/book/in-hogwarts-with-a-game-template-system_35592210900846705
```
