export type ProblemCard = {
  glyph: string;
  title: string;
  body: string;
};

export type Step = {
  id: string;
  title: string;
  body: string;
  detail: string;
};

export type Deliverable = {
  label: string;
  value: string;
};

export type PricingTier = {
  title: string;
  price: string;
  blurb: string;
  items: string[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export const problemCards: ProblemCard[] = [
  {
    glyph: "[]",
    title: "Canon Scaffolding",
    body:
      "Your emotional engine works. Your setting, institutions, factions, and plot leverage may still be leaning on somebody else's franchise architecture.",
  },
  {
    glyph: "/\\",
    title: "Inherited Characters",
    body:
      "Changing names is not enough when the chemistry, role geometry, and reader expectation stack are still doing unpaid labor from canon.",
  },
  {
    glyph: "<>",
    title: "World Logic Debt",
    body:
      "Fanfiction can borrow authority from a known system. Original fiction has to explain why the world runs, why the powers matter, and why the conflict scales.",
  },
  {
    glyph: "()",
    title: "Publishability Gap",
    body:
      "AO3 applause is real. So is the moment an agent asks whether the book still functions after the fandom oxygen supply is removed.",
  },
];

export const solutionBullets = [
  "Preserve the audience fantasy that made the fanfic hit",
  "Map every canon-dependent load-bearing element before rewriting",
  "Rebuild cast, premise, world logic, and conflict from a transformation spec",
  "Evaluate until the manuscript reads like original fiction, not a disguised dependency",
  "Package the result for indie, traditional, or hybrid release",
];

export const processSteps: Step[] = [
  {
    id: "01",
    title: "Upload Your Draft",
    body:
      "Bring your manuscript, chapter set, or serial opener. Optionally include the source URL, target market, and the publishing path you want to pursue.",
    detail:
      "Accepted intent: self-authored fanfiction only. We are not a laundering service for somebody else's fic.",
  },
  {
    id: "02",
    title: "Extract Franchise Dependence",
    body:
      "The system isolates names, institutions, power logic, relationship geometry, plot scaffolding, and fandom assumptions that are quietly carrying the draft.",
    detail:
      "Output: franchise dependency map, originality surface gap, and transformation load estimate.",
  },
  {
    id: "03",
    title: "Build The Transformation Spec",
    body:
      "Before a single rewrite pass, we decide what must be preserved, replaced, invented, and cut so the new version can survive without canon.",
    detail:
      "Output: promise stack, rebuilt premise, cast strategy, world rules, and conflict spine.",
  },
  {
    id: "04",
    title: "Rewrite From Spec, Not From Habit",
    body:
      "The rewrite pass works from the specification rather than doing cosmetic noun swaps. That is the entire point.",
    detail:
      "Output: fresh synopsis, opening rebuild, sample chapters, and a cleaner premise engine.",
  },
  {
    id: "05",
    title: "Judge It Like A Book",
    body:
      "We grade the new version on distinctiveness, residual canon dependence, hook strength, consequence density, and publishability for the path you chose.",
    detail:
      "If it still reads like fanfic with the serial numbers filed off, the loop is not done.",
  },
];

export const deliverables: Deliverable[] = [
  { label: "Source Type", value: "self-authored fanfiction" },
  { label: "Core Artifact", value: "originalization dossier" },
  { label: "Rewrite Constraint", value: "spec-first, not find-and-replace" },
  { label: "Target Outcome", value: "market-ready original fiction" },
  { label: "Publishing Paths", value: "indie / traditional / hybrid" },
  { label: "Success Condition", value: "the book stands without fandom oxygen" },
];

export const pricingTiers: PricingTier[] = [
  {
    title: "Dossier",
    price: "$149",
    blurb: "For authors who need brutal clarity before they need prose.",
    items: [
      "Originalization dossier",
      "Canon dependency map",
      "Preserve / replace / invent / cut grid",
      "Transformation load estimate",
    ],
  },
  {
    title: "Opening Rebuild",
    price: "$449",
    blurb: "For authors who want proof that the story can survive outside the fandom.",
    items: [
      "Everything in Dossier",
      "Rebuilt premise note",
      "Chapter one rewrite",
      "Publishability read on the opening",
    ],
  },
  {
    title: "Submission Sample",
    price: "$1,250",
    blurb: "For authors who want an actual package instead of a motivational speech.",
    items: [
      "Everything in Opening Rebuild",
      "Synopsis",
      "Pitch paragraph + comp positioning",
      "Path recommendation for indie / trad / hybrid",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "It identified the exact places where I was borrowing emotional authority from canon and forced me to build my own. Extremely rude. Extremely useful.",
    author: "Mina R.",
    role: "Progression fantasy author",
  },
  {
    quote:
      "The opening no longer reads like 'you can tell what fandom this used to be in three paragraphs.' That alone justified the price.",
    author: "Jonah K.",
    role: "Romantasy serial writer",
  },
  {
    quote:
      "I thought I needed a rewrite. What I actually needed was a replacement theory for why the story worked. The dossier caught that immediately.",
    author: "S. Vale",
    role: "Mystery / thriller author",
  },
];

export const faqs: Faq[] = [
  {
    question: "Is this a legal shield?",
    answer:
      "No. It is a writing and transformation system. The goal is to help authors rebuild self-authored fanfiction into original fiction that stands on its own. Legal review is still legal review.",
  },
  {
    question: "Will this just rename characters and call it a day?",
    answer:
      "Absolutely not. Cosmetic substitution is how you end up with the phrase 'serial numbers filed off' in every critique thread. The pipeline forces a premise-level rebuild.",
  },
  {
    question: "Can I use this on someone else's fic?",
    answer:
      "No. The product framing and the site copy assume author attestation. If you did not write the source text, you are outside the intended use case.",
  },
  {
    question: "What kinds of projects fit best?",
    answer:
      "The strongest early wedge is chapter-based fiction in progression fantasy, romantasy, thriller, and mystery. Those genres benefit from clear promise stacks and strong opening packages.",
  },
  {
    question: "How do I know the rewrite kept what readers loved?",
    answer:
      "Because the system evaluates the preserved audience fantasy explicitly. We are not trying to erase the engine. We are trying to rebuild the vehicle around it.",
  },
];
