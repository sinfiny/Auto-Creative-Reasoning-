import { getSite } from "./siteCatalog.js";
import { explainPopularity, scoreStory } from "./popularity.js";

const sampleStories = [
  {
    siteId: "royalroad",
    title: "Path to Transcendence",
    url: "https://www.royalroad.com/fictions/weekly-popular",
    ranks: {
      weekly: 1
    },
    metrics: {
      followers: 18039,
      views: 23556917,
      chapters: 622,
      pages: 4829
    },
    lastUpdatedAt: "2026-04-16T00:00:00Z"
  },
  {
    siteId: "ao3",
    title: "Example AO3 Work",
    url: "https://archive.transformativeworks.org/",
    ranks: {
      trending: null
    },
    metrics: {
      kudos: 6517,
      bookmarks: 7527,
      hits: 397972,
      comments: 1261,
      chapters: 15
    },
    lastUpdatedAt: "2026-04-14T00:00:00Z"
  },
  {
    siteId: "spacebattles",
    title: "A Young Woman's Defense of the Inner Sphere",
    url: "https://forums.spacebattles.com/threads/a-young-womans-defense-of-the-inner-sphere.1210145/",
    ranks: {
      ongoing: 1
    },
    metrics: {
      replies: 30000,
      views: 4000000,
      wordCount: 510000
    },
    lastPostAt: "2026-04-17T00:00:00Z",
    lastThreadmarkAt: "2026-04-17T00:00:00Z"
  },
  {
    siteId: "questionablequesting",
    title: "With This Ring (Young Justice SI) (Thread Fourteen)",
    url: "https://forum.questionablequesting.com/threads/with-this-ring-young-justice-si-thread-fourteen.8938/",
    metrics: {
      replies: 85000,
      views: 53000000,
      wordCount: 3000000
    },
    lastPostAt: "2026-04-17T00:00:00Z"
  },
  {
    siteId: "webnovel",
    title: "In Hogwarts with a Game Template System",
    url: "https://www.webnovel.com/book/in-hogwarts-with-a-game-template-system_35592210900846705",
    ranks: {
      power: 21
    },
    metrics: {
      views: 618600,
      chapters: 19,
      reviewCount: 15,
      powerStones: 779
    },
    lastUpdatedAt: "2026-04-17T00:00:00Z"
  }
];

for (const story of sampleStories) {
  const site = getSite(story.siteId);
  const score = scoreStory(story);
  const reasons = explainPopularity(story);

  console.log(
    JSON.stringify(
      {
        site: site?.label ?? story.siteId,
        title: story.title,
        score,
        reasons
      },
      null,
      2
    )
  );
}
