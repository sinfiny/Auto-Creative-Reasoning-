import { getAdapter } from "./adapters/index.js";
import { explainPopularity, scoreStory } from "./popularity.js";

function attachSurfaceRanks(story) {
  const ranks = { ...(story.ranks ?? {}) };
  const metrics = story.metrics ?? {};

  if (typeof story.rank === "number") {
    if (story.surface === "trending") {
      ranks.trending = story.rank;
    }

    if (story.surface === "weekly") {
      ranks.weekly = story.rank;
    }

    if (story.surface === "ongoing") {
      ranks.ongoing = story.rank;
    }

    if (story.surface === "active") {
      ranks.active = story.rank;
    }

    if (story.surface === "power") {
      ranks.power = story.rank;
    }
  }

  if (!ranks.power && typeof metrics.powerRank === "number") {
    ranks.power = metrics.powerRank;
  }

  if (!ranks.active && typeof metrics.activeRank === "number") {
    ranks.active = metrics.activeRank;
  }

  return {
    ...story,
    ranks
  };
}

export async function crawlSite(siteId, options = {}) {
  const adapter = getAdapter(siteId);
  const stories = await adapter.crawlSurface(options);

  return stories.map((rawStory) => {
    const story = attachSurfaceRanks(rawStory);

    return {
      ...story,
      score: scoreStory(story),
      reasons: explainPopularity(story)
    };
  });
}

export async function extractStory(siteId, options = {}) {
  const adapter = getAdapter(siteId);
  const story = attachSurfaceRanks(await adapter.extractStory(options));

  return {
    ...story,
    score: scoreStory(story),
    reasons: explainPopularity(story)
  };
}
