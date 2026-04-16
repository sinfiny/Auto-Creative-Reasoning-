import { cleanText, toSlug, uniqueBy } from "./utils.js";

const GENERIC_TERMS = new Set([
  "chapter",
  "chapters",
  "book",
  "books",
  "story",
  "stories",
  "fanfic",
  "fanfiction",
  "fiction",
  "series",
  "reader",
  "readers",
  "author",
  "authors",
  "alternate universe",
  "au",
  "canon",
  "oc",
  "original character",
  "self insert",
  "si"
]);

const GENERIC_CAPS = new Set([
  "The",
  "A",
  "An",
  "And",
  "Or",
  "But",
  "He",
  "She",
  "They",
  "We",
  "You",
  "I",
  "His",
  "Her",
  "Their",
  "My",
  "Our",
  "In",
  "On",
  "At",
  "From",
  "To",
  "Of",
  "For",
  "With",
  "Without",
  "Into",
  "After",
  "Before"
]);

const DEFAULT_SKILL_STACK = [
  "sanderson-story-architecture",
  "sanderson-character-engine",
  "sanderson-speculative-design",
  "grainbound-causal-worldbuilding",
  "narrative-surgical-editing",
  "creative-autoresearch-control-plane",
  "sanderson-publishing-strategy"
];

function chunkText(values) {
  return values
    .map((value) => cleanText(value))
    .filter(Boolean)
    .join("\n");
}

function pickChapterSamples(chapters = [], limit = 3) {
  return chapters
    .slice(0, limit)
    .map((chapter) => chunkText([chapter.title, chapter.contentText?.slice(0, 1500)]))
    .filter(Boolean);
}

function collectSourceText(story) {
  return chunkText([
    story.title,
    story.summary,
    ...(story.tags ?? []),
    ...pickChapterSamples(story.chapters)
  ]);
}

function normalizeEntity(value) {
  return cleanText(value)?.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "") ?? null;
}

function extractCapitalizedPhrases(text) {
  const matches = text.match(/\b[A-Z][a-z0-9]+(?: +[A-Z][a-z0-9]+){0,3}\b/g) ?? [];

  return uniqueBy(
    matches
      .map((value) => normalizeEntity(value))
      .filter((value) => value && !GENERIC_CAPS.has(value)),
    (value) => value.toLowerCase()
  );
}

function extractFandomSignals(tags = []) {
  return uniqueBy(
    tags
      .map((tag) => cleanText(tag))
      .filter(Boolean)
      .filter((tag) => {
        const lower = tag.toLowerCase();
        return (
          lower.includes("fandom") ||
          lower.includes("alternate universe") ||
          lower.includes("crossover") ||
          lower.includes("fusion") ||
          lower.includes("self insert") ||
          lower.includes("canon")
        );
      }),
    (value) => value.toLowerCase()
  );
}

function extractRelationshipSignals(tags = []) {
  return uniqueBy(
    tags
      .map((tag) => cleanText(tag))
      .filter(Boolean)
      .filter((tag) => tag.includes("/") || tag.includes("&")),
    (value) => value.toLowerCase()
  );
}

function extractLikelyCanonTerms(story) {
  const tags = story.tags ?? [];
  const text = collectSourceText(story);
  const tagTerms = tags
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .filter((tag) => !GENERIC_TERMS.has(tag.toLowerCase()))
    .slice(0, 20);

  const capitalizedTerms = extractCapitalizedPhrases(text)
    .filter((value) => !GENERIC_TERMS.has(value.toLowerCase()))
    .slice(0, 20);

  return uniqueBy([...tagTerms, ...capitalizedTerms], (value) => value.toLowerCase()).slice(0, 25);
}

function scoreDependency(story, signals) {
  const tagCount = (story.tags ?? []).length;
  const chapterCount = (story.chapters ?? []).length;
  const canonTermCount = signals.likelyCanonTerms.length;
  const fandomSignalCount = signals.fandomSignals.length;
  const relationshipSignalCount = signals.relationshipSignals.length;
  const siteBase =
    story.siteId === "ao3" ? 18 :
    story.siteId === "spacebattles" || story.siteId === "questionablequesting" ? 12 :
    story.siteId === "webnovel" ? 10 :
    6;

  const score = Math.min(
    100,
    siteBase +
      Math.min(30, canonTermCount * 2) +
      Math.min(20, fandomSignalCount * 5) +
      Math.min(12, relationshipSignalCount * 2) +
      Math.min(10, Math.floor(tagCount / 3)) +
      Math.min(10, Math.floor(chapterCount / 10))
  );

  return score;
}

function classifyTransformationLoad(score) {
  if (score >= 75) {
    return "heavy";
  }

  if (score >= 45) {
    return "medium";
  }

  return "light";
}

function choosePublishingPath(goal, requestedPath) {
  if (requestedPath) {
    return requestedPath;
  }

  if (goal === "speed" || goal === "audience-growth") {
    return "indie";
  }

  if (goal === "prestige" || goal === "distribution") {
    return "traditional";
  }

  return "hybrid";
}

function buildPreserveList(story) {
  const preserve = [
    "the core audience fantasy that made the fanfic work",
    "the strongest scene-level hooks and reversals",
    "the author's natural pacing and tonal strengths"
  ];

  if ((story.metrics?.chapters ?? 0) >= 20) {
    preserve.push("the sense of long-horizon serial momentum");
  }

  if (story.summary) {
    preserve.push("the central premise pressure visible in the current summary");
  }

  return preserve;
}

function buildReplaceList(signals) {
  const replace = [
    "all franchise-specific names, settings, factions, and terminology",
    "all canon-dependent power logic and inherited world assumptions",
    "all relationship dynamics that only work because readers already know the source IP"
  ];

  if (signals.relationshipSignals.length > 0) {
    replace.push("relationship labels and pairings that directly point back to canon");
  }

  return replace;
}

function buildInventList(story, load) {
  const invent = [
    "an original world premise that delivers the same reader fantasy without borrowed IP",
    "a fresh cast topology with distinct motivations and social pressure",
    "an original conflict ladder that can scale past the fanfic's former canon ceiling"
  ];

  if (load !== "light") {
    invent.push("a replacement ruleset for institutions, factions, or powers that were previously inherited from canon");
  }

  if ((story.metrics?.chapters ?? 0) >= 10) {
    invent.push("a new series bible so later chapters remain coherent after the transition");
  }

  return invent;
}

function buildCutList() {
  return [
    "reader-assumed lore shortcuts",
    "wink-at-the-fandom references",
    "canon patch notes disguised as exposition"
  ];
}

function buildStages(load, publishingPath) {
  return [
    {
      id: "intake",
      label: "Intake and provenance",
      objective: "Confirm author ownership of the source draft and capture publishing intent."
    },
    {
      id: "dependency-map",
      label: "Canon dependency extraction",
      objective: "Map fandom signals, borrowed entities, and load-bearing canon assumptions."
    },
    {
      id: "transformation-spec",
      label: "Originalization spec",
      objective: "Write the preserve / replace / invent / cut contract that all later work must follow."
    },
    {
      id: "rebuild",
      label: "Independent rebuild",
      objective:
        load === "heavy"
          ? "Rebuild premise, cast, and world logic before sentence-level editing."
          : "Rebuild only the minimum world and cast structures needed to support an original project."
    },
    {
      id: "rewrite",
      label: "Opening package rewrite",
      objective: "Produce a new synopsis and opening sample that can survive without canon familiarity."
    },
    {
      id: "publishability",
      label: "Publishing package",
      objective: `Package the transformed work for a ${publishingPath} path.`
    }
  ];
}

function buildDeliverables(publishingPath) {
  const shared = [
    "originalization dossier",
    "revised premise and promise stack",
    "opening package rewrite",
    "publishability report"
  ];

  if (publishingPath === "traditional") {
    return [...shared, "query letter", "synopsis", "agent-facing comps note"];
  }

  if (publishingPath === "indie") {
    return [...shared, "retail positioning note", "series hook copy", "launch asset checklist"];
  }

  return [...shared, "query package", "indie positioning note", "hybrid rights checklist"];
}

function buildRecommendedNextAction(load, publishingPath) {
  if (load === "heavy") {
    return "Do a transformation-spec pass first. Do not start by line-editing chapters.";
  }

  if (publishingPath === "traditional") {
    return "Rewrite the opening package, then test whether the new premise and comps feel truly original enough for agent research.";
  }

  return "Rewrite the opening package, then test market positioning before attempting full-manuscript conversion.";
}

export function buildOriginalizationDossier(story, options = {}) {
  const authorGoal = cleanText(options.goal) ?? "control";
  const rightsStatus = cleanText(options.rightsStatus) ?? "self-authored";
  const audience = cleanText(options.audience) ?? "commercial genre readers";
  const projectType = cleanText(options.projectType) ?? "novel";
  const publishingPath = choosePublishingPath(authorGoal, cleanText(options.publishingPath));
  const signals = {
    fandomSignals: extractFandomSignals(story.tags),
    relationshipSignals: extractRelationshipSignals(story.tags),
    likelyCanonTerms: extractLikelyCanonTerms(story)
  };
  const dependencyScore = scoreDependency(story, signals);
  const transformationLoad = classifyTransformationLoad(dependencyScore);
  const titleSlug = toSlug(story.title) ?? "untitled-project";

  return {
    version: "0.1",
    generatedAt: new Date().toISOString(),
    source: {
      siteId: story.siteId ?? null,
      title: story.title ?? null,
      url: story.url ?? null,
      authors: story.authors ?? [],
      tags: story.tags ?? [],
      metrics: story.metrics ?? {},
      titleSlug
    },
    contract: {
      sourceType: "fanfiction",
      authorAttestation: rightsStatus,
      projectType,
      careerGoal: authorGoal,
      audienceTarget: audience,
      publishingPath
    },
    scores: {
      franchiseDependency: dependencyScore,
      originalitySurfaceGap: dependencyScore,
      transformationLoad
    },
    signals,
    preserve: buildPreserveList(story),
    replace: buildReplaceList(signals),
    invent: buildInventList(story, transformationLoad),
    cut: buildCutList(),
    stages: buildStages(transformationLoad, publishingPath),
    deliverables: buildDeliverables(publishingPath),
    skillStack: DEFAULT_SKILL_STACK,
    evaluationRubric: [
      "remaining canon dependence",
      "clarity of new premise and audience promise",
      "character distinctiveness after renaming and rebuild",
      "world logic independence",
      "opening hook strength",
      "path-specific publishability"
    ],
    nextAction: buildRecommendedNextAction(transformationLoad, publishingPath)
  };
}
