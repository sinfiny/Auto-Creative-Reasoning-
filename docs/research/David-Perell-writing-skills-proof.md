# David Perell Writing Skills Proof

## Goal

Turn the most skill-convertible writing episodes from David Perell's channel into a small set of composable skills for `storyskill-atlas`.

The guiding question is not "Which videos are best?" but "Which learnings can be turned into reusable, narrow AI jobs with clear triggers, rules, and output shapes?"

## Method

I used the previously shortlisted high-value videos and checked:

1. Whether the episode teaches a repeatable workflow instead of general inspiration.
2. Whether the workflow has a clear boundary that can become a skill.
3. Whether the resulting skill would overlap too much with another one.
4. Whether the advice is evergreen enough to stay useful.

Source inventory was pulled from `https://www.youtube.com/@DavidPerellChannel/videos`, then narrowed to the strongest skill candidates.

## Video-By-Video Investigation

### 1. Learn Copywriting in 76 Minutes - Harry Dry

Link: https://www.youtube.com/watch?v=TUMjnmfsPeM

Evidence from description:

- "Harry's Three Rules"
- "Can I visualize it?"
- "Can I falsify it?"
- "Can nobody else say it?"
- "You sit down. You write copy. What's the process?!"

Reasoning:

This is a clean skill source because the episode already breaks copy into testable rules. The skill boundary is narrow and practical: headlines, taglines, landing-page copy, email hooks, offer framing, and ad rewrites. The rules are concrete enough to become checks rather than vague taste.

Decision:

Make a `copywriting-mechanics` skill.

### 2. Harvard Professor Explains The Rules of Writing - Steven Pinker

Link: https://www.youtube.com/watch?v=nBQPnvmaNcE

Evidence from description:

- "Why Is There So Much Bad Writing"
- "How To Make Your Writing Visual"
- "What Makes Writing So Much Harder Than Speaking"
- "Why Examples Without Context Are Useless"
- "Why Shorter Writing Is Always Better"
- "Why AI Writing Feels So Bland"

Reasoning:

This should not become a generic "write better" skill. Its strongest job is diagnosis and repair of abstract, contextless, reader-hostile prose. The episode points toward a specific editor role: make language visual, reduce abstraction, preserve context, and cut bland AI flattening.

Decision:

Make a `clarity-and-visuality-editor` skill.

### 3. How to Write Structurally Well - Daniel Pink

Link: https://www.youtube.com/watch?v=gCNNwjyQQIA

Evidence from description:

- "Daniel's writing routine"
- "How to write a book proposal"
- "Lessons from writing a play"
- "The most important question to ask"

Reasoning:

The strongest reusable unit here is structure, not productivity. This episode looks useful for turning a fuzzy topic into a governing question, then into an outline, section logic, and proposal. That is a distinct skill from line editing or idea generation.

Decision:

Make a `nonfiction-structure-architect` skill.

### 4. How to Write Online Workshop

Link: https://www.youtube.com/watch?v=1MNS21b6O_s

Evidence from description:

- "the most distilled version of everything I teach in Write of Passage"
- "How to improve your ideas through note-taking"
- "How to write so people will want to read your work"
- "How to build an audience of like-minded people"

Reasoning:

This episode covers multiple jobs, so it should not become one giant omnibus skill. The most distinct extractable pieces are:

- idea discovery and note-to-topic development
- online writing workflow for audience-aware publishing

The audience-building part is valuable, but weaker as a writing skill than the idea and draft formation parts.

Decision:

Use this as a primary source for `online-writing-idea-finder`, and as support for `nonfiction-structure-architect`.

### 5. Learn Storytelling in 72 Minutes - Will Storr

Link: https://www.youtube.com/watch?v=kDrsYMW_EYg

Evidence from description:

- "Great stories don't start with plot... they start with people"
- "What makes for a good character"
- "Character drives everything"
- "Story is just change"
- "The components of an outline [5-Act Plan]"
- "Obstacles and goals"

Reasoning:

This clearly wants to be a storytelling skill, but the right boundary is not "all storytelling." The episode centers character change, motive, social stakes, and act structure. That makes the best skill a character-driven story designer, especially for outlines and scene planning.

Decision:

Make a `character-driven-storytelling` skill.

### 6. Writing Formulas Everybody Should Know - Mark Forsyth

Link: https://www.youtube.com/watch?v=ulhrXgpjveA

Evidence from description:

- "the secret sauce to memorable writing: rhetorical devices"
- "Chiasmus. Anaphora. Antithesis. Synecdoche."
- "use rhetorical formulas to create unforgettable lines"
- "If you want to write something that sticks in your reader's brain"

Reasoning:

This is a textbook source for a line-level rhetorical skill. It is not a general style skill. It is for making lines more quotable, rhythmic, emphatic, and memorable through classical devices.

Decision:

Cluster with Ward Farnsworth and make one shared skill: `memorable-lines-and-rhetoric`.

### 7. This Research System Will Change How You Write - Johann Hari

Link: https://www.youtube.com/watch?v=Gfyup3HdK6A

Evidence from description:

- "he'll explain exactly how he does it"
- "Finding the problem"
- "Why does this story matter"
- "Talk less, listen more"
- "Make yourself vulnerable"
- "The maps of reality"

Reasoning:

This is not mainly a prose skill. It is a research and interviewing workflow skill. The boundary is strong: reporting, interviews, contradiction-hunting, synthesis, and extracting meaning from lived material.

Decision:

Make a `research-interview-synthesis` skill.

### 8. Johnny Harris Reveals How He Writes YouTube Videos

Link: https://www.youtube.com/watch?v=zq4b96m1AvM

Evidence from description:

- "the complete workflow: writing, drafting, editing, visual composition, and sound design"
- "Writing visual scripts"
- "Every story is a promise"
- "Finding the paradoxes"
- "Writing for retention"
- "Complexity, made simple"
- "The art of surprise"

Reasoning:

This is a strong medium-specific skill source. It should not be folded into general storytelling because the workflow is explicitly visual and retention-driven. Script beats depend on visuals, promises, paradoxes, and reveals.

Decision:

Make a `youtube-visual-scriptwriter` skill.

### 9. 14 Techniques To Make Your Writing Memorable - Ward Farnsworth

Link: https://www.youtube.com/watch?v=QZ1ryhBvRm4

Evidence from description:

- repeated concrete examples from the Bible, Churchill, Lincoln, JFK
- "The 3 Techniques, explained"
- "Practical advice for everyone"
- emphasis on classical English rhetoric

Reasoning:

This overlaps heavily with Mark Forsyth, which is good. It strengthens the case that rhetorical memorability deserves its own skill instead of being buried inside general editing.

Decision:

Use as co-source for `memorable-lines-and-rhetoric`, not as a separate skill.

### 10. How to Find GREAT Writing Ideas

Link: https://www.youtube.com/watch?v=ffqLMkqlZl4

Evidence from description:

- "start by looking for things that don't make sense"

Reasoning:

This is a small but very skill-friendly workflow. Idea finding is often upstream of writing and deserves a clean skill boundary. It pairs naturally with the note-taking and audience-aware parts of the online workshop.

Decision:

Use as co-source for `online-writing-idea-finder`.

## Skill Partition

The right division is by job, not by speaker:

| Skill | Primary source videos | Why this boundary is right |
| --- | --- | --- |
| `copywriting-mechanics` | Harry Dry | Distinct job: persuasive commercial language with testable rules |
| `clarity-and-visuality-editor` | Steven Pinker | Distinct job: turn abstract, bland prose into clear, concrete writing |
| `nonfiction-structure-architect` | Daniel Pink, How to Write Online Workshop | Distinct job: shape ideas into outline, proposal, section order, and governing question |
| `online-writing-idea-finder` | How to Write Online Workshop, How to Find GREAT Writing Ideas | Distinct job: find topics, mine notes, and frame online-native ideas |
| `character-driven-storytelling` | Will Storr | Distinct job: build stories from character change, pressure, and act logic |
| `memorable-lines-and-rhetoric` | Mark Forsyth, Ward Farnsworth | Distinct job: strengthen line-level memorability through rhetoric |
| `research-interview-synthesis` | Johann Hari | Distinct job: gather and synthesize research and interviews for nonfiction |
| `youtube-visual-scriptwriter` | Johnny Harris | Distinct job: build scripts that coordinate promise, visuals, surprise, and retention |

## Why These Are Skills Instead of One Big Writing Skill

One large writing skill would create three problems:

1. Trigger ambiguity: the agent would not know whether the user needs structure, line editing, story design, research, or copy.
2. Overlap and drift: the skill would start giving generic advice instead of specialized help.
3. Weak composition: you could not stack a research skill with a rhetoric skill or a story skill with a visual script skill.

The split above matches the `storyskill-atlas` principle of skill isolation and composition.

## What I Am Not Making

- A separate skill for each interview. That would create overlapping clutter.
- A single "David Perell writing mentor" persona. That would be too broad and too vibe-driven.
- A separate Ward skill and Mark skill. Their strongest reusable function is the same line-level rhetoric job.
- A general audience-growth skill. The writing-related parts are more durable and better scoped than platform-growth advice.

## Final Decision

Create these eight skills inside `repo-blueprints/storyskill-atlas/skills/`:

1. `copywriting-mechanics`
2. `clarity-and-visuality-editor`
3. `nonfiction-structure-architect`
4. `online-writing-idea-finder`
5. `character-driven-storytelling`
6. `memorable-lines-and-rhetoric`
7. `research-interview-synthesis`
8. `youtube-visual-scriptwriter`
