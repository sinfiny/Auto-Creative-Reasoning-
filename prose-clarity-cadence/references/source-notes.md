# Source Notes

This reference maps the requested David Perell "How I Write" episodes into an AI-executable editing skill. Use it when tuning the workflow or explaining why a pass exists.

## Transcript Pass

Primary captions were fetched with `yt-dlp`, cleaned in `/tmp/perell-prose-transcripts`, and reviewed for practical editing controls. Cleaned transcript lengths:

- Steven Pinker, "Harvard Professor Explains The Rules of Writing" (`nBQPnvmaNcE`), 43:29, published 2025-06-04, about 7.4k words.
- Ward Farnsworth, "14 Techniques To Make Your Writing Memorable" (`QZ1ryhBvRm4`), 1:01:57, published 2025-12-10, about 13.7k words.
- Robert Macfarlane, "Cambridge Professor: Why All Writing Sounds the Same Now" (`rdsE9XqB2bI`), 1:29:17, published 2025-06-18, about 15.9k words.
- Jason Fried, "The New Rules of Business Communication" (`UDOeqjQbUcU`), 1:31:20, published 2024-05-22, about 19.3k words.

Do not store or reproduce full transcripts in the skill. These notes paraphrase the craft lessons into operating rules.

## How To Use Each Video

### Steven Pinker: Clarity And Reader Orientation

Use Pinker as the first diagnostic pass. His transcript centers on the curse of knowledge: writers forget what readers do not know, then hide ideas behind jargon, acronyms, abstractions, and unexplained mechanisms.

Agent rules:

- Define the reader's starting knowledge before rewriting.
- Replace insider language with an explanation a smart outsider can follow.
- Start with the problem or observable scene before the technical mechanism.
- Use examples to ground general claims.
- Convert zombie nouns into active verbs when the noun hides action.
- Split sentences that overload working memory.

Useful failure modes:

- The paragraph names a method before explaining the problem.
- The key sentence uses abstractions where a reader needs a picture.
- The prose assumes shared context that the reader does not have.
- The writer explains at peer level when the audience is outside the field.

### Ward Farnsworth: Sentence Geometry And Memorable Endings

Use Farnsworth as the rhythm pass after clarity is solved. The transcript breaks down how memorable prose gets its force from word family, repetition, contrast, syntax, and sentence endings.

Agent rules:

- Vary sentence length deliberately.
- Prefer short, plain words for force, especially near the end of a sentence.
- Use longer Latinate words for precision, setup, or contrast, not as the default register.
- Treat the beginning and end of a sentence as the highest-attention positions.
- Use anaphora, contrast, or inversion only when the idea deserves a rhetorical lift.
- Revise the paragraph's last sentence so the strongest word lands last.

Useful failure modes:

- Every sentence has the same subject-verb-object shape.
- The paragraph's best word appears in the middle.
- Rhetorical repetition appears without a real point.
- The final sentence trails off into a weak modifier or abstraction.

### Robert Macfarlane: Lexical Specificity And Sensory Pressure

Use Macfarlane as the anti-bland pass. The transcript emphasizes alertness to physical sensation, precision of prepositions and punctuation, rhythm, first sentences, and language that carries a distinct encounter rather than an average summary.

Agent rules:

- Replace generic nouns and verbs before decorating with adjectives.
- Add one true, specific sensory detail to descriptive or narrative paragraphs.
- Remove empty intensifiers.
- Rewrite lazy "is/was/were/has" constructions when a stronger verb can carry the sentence.
- Let syntax mirror the subject only when it improves comprehension.
- Rework first lines until they create direction, pressure, or curiosity.

Useful failure modes:

- The paragraph sounds statistically average.
- The adjectives are broad, but the nouns are vague.
- The prose says a scene is vivid without giving the reader anything to sense.
- Rhythm fights the subject: frantic content in slack syntax, or calm content in fussy syntax.

### Jason Fried: Compression And Business Scannability

Use Fried as the final screen and business-writing pass. The transcript stresses communication over "content," short forms, compression, stopping before overwork, reader participation, and writing that makes decisions easier.

Agent rules:

- Keep each paragraph to one job.
- Cut repeated explanations.
- Make the action, decision, or consequence clear in business prose.
- Use short sections and whitespace to keep the reader moving.
- Trust readers to fill obvious gaps instead of over-explaining.
- Stop editing when further work makes the piece longer but not clearer.

Useful failure modes:

- The paragraph is long because the writer is proving effort.
- A memo buries the decision or next action.
- The piece repeats the same point in slightly different words.
- The text reads like generic content rather than a message from one person to another.

## Combined Editing Stack

Use the videos in this order:

1. Pinker: make the prose intelligible to the intended reader.
2. Farnsworth: make the prose move and land.
3. Macfarlane: make the prose specific instead of generic.
4. Fried: make the prose usable on a screen.

The order matters. Do not polish rhythm before the meaning is clear. Do not add detail before the reader knows why the paragraph exists. Do not format a page before deciding which sentence deserves isolation.

## AI-Executable Checklist

```text
Input:
Reader:
Writing job:
Core thesis:

Pinker clarity:
- What does the writer know that the reader may not?
- Which terms need explanation or replacement?
- Which nominalizations hide action?
- Which sentence fails the breath test?

Farnsworth geometry:
- Sentence length pattern:
- Repeated structure:
- Rhetorical device, if justified:
- Strongest ending word:

Macfarlane specificity:
- Empty modifiers:
- Weak "to be" or "to have" verbs:
- Generic nouns:
- One true sensory detail:

Perell/Fried screen pass:
- Paragraphs over four sentences:
- Sentence to isolate:
- Sentence to bold:
- Conceptual pivot:
- Next action or consequence:

Final skim check:
- Can a skimmer catch the thesis?
- Can a careful reader follow the logic?
- Does every paragraph do one job?
```

## Calibration Notes

- The nominalization rule is a diagnostic, not a blind ban. Some words ending in `-tion`, `-ment`, or `-ity` are necessary terms.
- The sensory-detail rule applies to descriptive, narrative, or illustrative prose. It should not distort technical documentation.
- Rhetorical devices should be rare. Their job is to make a true point memorable, not to make prose sound ornate.
- Bold should usually mark a full sentence, not a single word. Overuse destroys skim value.
- The workflow improves prose mechanics. It does not verify factual accuracy unless the user asks for fact-checking.
