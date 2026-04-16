const METRIC_MAX = {
  followers: 25000,
  views: 10000000,
  pages: 3000,
  chapters: 1000,
  comments: 5000,
  reviews: 1000,
  reviewCount: 1000,
  replies: 10000,
  kudos: 50000,
  bookmarks: 10000,
  hits: 1000000,
  subscriptions: 10000,
  threadmarks: 1000,
  wordCount: 3000000,
  collections: 10000,
  powerStones: 5000,
  threadLikeCount: 10000,
  watchers: 5000
};

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function rankScore(rank, maxRank = 50) {
  if (!rank) {
    return 0;
  }

  return clamp((maxRank - rank + 1) / maxRank);
}

function logScore(value, maxValue) {
  if (!value || !maxValue) {
    return 0;
  }

  return clamp(Math.log10(value + 1) / Math.log10(maxValue + 1));
}

function dateScore(dateLike, horizonDays = 14) {
  if (!dateLike) {
    return 0;
  }

  const now = new Date();
  const date = new Date(dateLike);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysOld = (now - date) / msPerDay;

  if (Number.isNaN(daysOld)) {
    return 0;
  }

  return clamp((horizonDays - daysOld) / horizonDays);
}

function average(values) {
  const present = values.filter((value) => typeof value === "number");
  if (present.length === 0) {
    return 0;
  }

  return present.reduce((sum, value) => sum + value, 0) / present.length;
}

function metricScore(metrics, names) {
  return average(
    names.map((name) => logScore(metrics[name], METRIC_MAX[name]))
  );
}

function explainMetric(label, value) {
  if (value === undefined || value === null) {
    return null;
  }

  return `${label}: ${value}`;
}

export function scoreStory(story) {
  const metrics = story.metrics ?? {};
  const ranks = story.ranks ?? {};

  const momentum = average([
    rankScore(ranks.trending, ranks.trendingMaxRank ?? 50),
    rankScore(ranks.weekly, ranks.weeklyMaxRank ?? 50),
    rankScore(ranks.ongoing, ranks.ongoingMaxRank ?? 50),
    rankScore(ranks.power, ranks.powerMaxRank ?? 100),
    rankScore(ranks.active, ranks.activeMaxRank ?? 100),
    dateScore(story.lastUpdatedAt ?? story.lastPostAt ?? story.lastThreadmarkAt)
  ]);

  const reach = metricScore(metrics, [
    "followers",
    "views",
    "hits",
    "collections",
    "watchers"
  ]);

  const engagement = metricScore(metrics, [
    "comments",
    "reviews",
    "reviewCount",
    "replies",
    "kudos",
    "bookmarks",
    "subscriptions",
    "powerStones",
    "threadLikeCount"
  ]);

  const commitment = metricScore(metrics, [
    "chapters",
    "pages",
    "threadmarks",
    "wordCount"
  ]);

  const overall =
    momentum * 0.35 +
    reach * 0.25 +
    engagement * 0.25 +
    commitment * 0.15;

  return {
    momentum: round(momentum),
    reach: round(reach),
    engagement: round(engagement),
    commitment: round(commitment),
    overall: round(overall)
  };
}

export function explainPopularity(story) {
  const metrics = story.metrics ?? {};
  const ranks = story.ranks ?? {};
  const reasons = [];

  if (ranks.trending) {
    reasons.push(`ranked #${ranks.trending} on a trending surface`);
  }

  if (ranks.weekly) {
    reasons.push(`ranked #${ranks.weekly} on a weekly popularity surface`);
  }

  if (ranks.ongoing) {
    reasons.push(`ranked #${ranks.ongoing} on an ongoing or active surface`);
  }

  if (ranks.power) {
    reasons.push(`ranked #${ranks.power} on a power-based ranking`);
  }

  if (metrics.powerStones) {
    reasons.push(`${metrics.powerStones} power stones indicate current momentum`);
  }

  const largeAudience = [
    explainMetric("followers", metrics.followers),
    explainMetric("views", metrics.views),
    explainMetric("hits", metrics.hits),
    explainMetric("collections", metrics.collections)
  ].filter(Boolean);
  if (largeAudience.length > 0) {
    reasons.push(`audience scale looks strong (${largeAudience.slice(0, 2).join(", ")})`);
  }

  const strongEngagement = [
    explainMetric("kudos", metrics.kudos),
    explainMetric("bookmarks", metrics.bookmarks),
    explainMetric("comments", metrics.comments),
    explainMetric("reviews", metrics.reviews ?? metrics.reviewCount),
    explainMetric("replies", metrics.replies)
  ].filter(Boolean);
  if (strongEngagement.length > 0) {
    reasons.push(`reader engagement is visible (${strongEngagement.slice(0, 2).join(", ")})`);
  }

  const depthSignals = [
    explainMetric("chapters", metrics.chapters),
    explainMetric("pages", metrics.pages),
    explainMetric("wordCount", metrics.wordCount),
    explainMetric("threadmarks", metrics.threadmarks)
  ].filter(Boolean);
  if (depthSignals.length > 0) {
    reasons.push(`reader commitment looks durable (${depthSignals.slice(0, 2).join(", ")})`);
  }

  if (story.lastUpdatedAt || story.lastPostAt || story.lastThreadmarkAt) {
    reasons.push("it has very recent activity, which usually boosts discoverability");
  }

  return reasons.slice(0, 5);
}
