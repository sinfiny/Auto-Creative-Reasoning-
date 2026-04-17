export const siteCatalog = [
  {
    id: "royalroad",
    label: "Royal Road",
    trendSurfaces: [
      "Trending",
      "Popular this week",
      "Ongoing Fictions",
      "Best Rated",
      "Rising Stars"
    ],
    publicSignals: [
      "followers",
      "views",
      "chapters",
      "pages",
      "lastUpdatedAt",
      "genreTags",
      "status"
    ],
    extractionMode: "chapter_scrape",
    notes: [
      "Trending is genre-limited and works well as a momentum signal.",
      "Followers plus views plus recency give a strong baseline for commentary."
    ],
    sources: [
      "https://www.royalroad.com/fictions/trending",
      "https://www.royalroad.com/fictions/active-popular",
      "https://www.royalroad.com/fictions/weekly-popular"
    ]
  },
  {
    id: "ao3",
    label: "AO3",
    trendSurfaces: [
      "Sort by kudos",
      "Sort by comments",
      "Sort by bookmarks",
      "Sort by hits",
      "Sort by date updated"
    ],
    publicSignals: [
      "kudos",
      "comments",
      "bookmarks",
      "hits",
      "chapters",
      "dateUpdated",
      "datePosted"
    ],
    extractionMode: "official_download",
    notes: [
      "AO3 exposes sort surfaces instead of a dedicated trending page.",
      "Use kudos, bookmarks, comments, hits, and freshness as the main blend."
    ],
    sources: [
      "https://archive.transformativeworks.org/admin_posts/259",
      "https://archive.transformativeworks.org/faq/accessing-fanworks?language_id=en"
    ]
  },
  {
    id: "spacebattles",
    label: "SpaceBattles",
    trendSurfaces: [
      "Creative Writing forum index",
      "New posts",
      "New threadmarks"
    ],
    publicSignals: [
      "replies",
      "views",
      "threadLikeCount",
      "wordCount",
      "awardsCount",
      "lastThreadmarkAt",
      "watchers",
      "lastPostAt"
    ],
    extractionMode: "chapter_scrape",
    notes: [
      "Momentum is best captured through recent replies and recent threadmarks.",
      "Watchers and likes are useful when available from the listing or thread view."
    ],
    sources: [
      "https://forums.spacebattles.com/forums/creative-writing.18/"
    ]
  },
  {
    id: "questionablequesting",
    label: "Questionable Questing",
    trendSurfaces: [
      "Creative Writing forum index",
      "New posts",
      "New threadmarks"
    ],
    publicSignals: [
      "replies",
      "views",
      "wordCount",
      "lastPostAt"
    ],
    extractionMode: "chapter_scrape",
    notes: [
      "QQ exposes fewer ranking controls than SpaceBattles, so recency matters more.",
      "Replies and views are the most consistent public engagement signals."
    ],
    sources: [
      "https://forum.questionablequesting.com/forums/creative-writing.19/"
    ]
  },
  {
    id: "webnovel",
    label: "Webnovel",
    trendSurfaces: [
      "Power",
      "Collect",
      "Popular",
      "Update",
      "Active"
    ],
    publicSignals: [
      "views",
      "chapters",
      "rating",
      "reviewCount",
      "collections",
      "powerRank",
      "powerStones",
      "activeRank"
    ],
    extractionMode: "chapter_scrape",
    notes: [
      "Power and power stones are strong short-term momentum signals.",
      "Collections and views help separate curiosity from durable demand."
    ],
    sources: [
      "https://www.webnovel.com/ranking/fanfic/all_time/collection_rank",
      "https://www.webnovel.com/book/in-hogwarts-with-a-game-template-system_35592210900846705"
    ]
  }
];

export function getSite(siteId) {
  return siteCatalog.find((site) => site.id === siteId);
}
