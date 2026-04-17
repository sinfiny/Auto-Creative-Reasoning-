import "./styles.css";
import {
  deliverables,
  faqs,
  pricingTiers,
  problemCards,
  processSteps,
  solutionBullets,
  testimonials,
} from "./content";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

const problemMarkup = problemCards
  .map(
    (card) => `
      <article class="problem-card" data-reveal>
        <span class="problem-card__glyph">${card.glyph}</span>
        <h3>${card.title}</h3>
        <p>${card.body}</p>
      </article>
    `,
  )
  .join("");

const solutionMarkup = solutionBullets
  .map((bullet) => `<li>${bullet}</li>`)
  .join("");

const processMarkup = processSteps
  .map(
    (step) => `
      <article class="step" data-reveal>
        <span class="step__id">${step.id}</span>
        <h3>${step.title}</h3>
        <p>${step.body}</p>
        <div class="step__detail">${step.detail}</div>
      </article>
    `,
  )
  .join("");

const deliverableMarkup = deliverables
  .map(
    (item) => `
      <article class="deliverable-card" data-reveal>
        <span class="deliverable-card__label">${item.label}</span>
        <span class="deliverable-card__value">${item.value}</span>
      </article>
    `,
  )
  .join("");

const pricingMarkup = pricingTiers
  .map(
    (tier) => `
      <article class="pricing-card" data-reveal>
        <span class="problem-card__glyph">pilot tier</span>
        <h3>${tier.title}</h3>
        <span class="pricing-card__price">${tier.price}</span>
        <p class="pricing-card__blurb">${tier.blurb}</p>
        <ul>${tier.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `,
  )
  .join("");

const testimonialMarkup = testimonials
  .map(
    (item) => `
      <article class="testimonial" data-reveal>
        <p class="testimonial__quote">"${item.quote}"</p>
        <div class="testimonial__meta">${item.author}<br />${item.role}</div>
      </article>
    `,
  )
  .join("");

const faqMarkup = faqs
  .map(
    (item) => `
      <article class="faq" data-reveal>
        <h3>${item.question}</h3>
        <p>${item.answer}</p>
      </article>
    `,
  )
  .join("");

app.innerHTML = `
  <div class="page-shell">
    <header class="topbar">
      <div class="topbar__inner">
        <a class="brand" href="#top" aria-label="NextChapter">
          <span class="brand__title">NEXTCHAPTER</span>
          <span class="brand__meta">Originalization Studio // author-attested</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <a href="#problem">Problem</a>
          <a href="#process">Process</a>
          <a href="#deliverables">Dossier</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq" class="nav__cta">Initialize</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="hero__grid">
          <div class="hero__copy">
            <div class="eyebrow">SYS-017 · REV-1.0 · Canon Extraction · Publishability Evaluation</div>
            <h1 class="hero__title">Publishable Fiction as a Service</h1>
            <p class="hero__lede">
              Turn self-authored fanfiction into original fiction that can survive agents, editors,
              and readers who do not know what canon was doing for you behind the curtain.
            </p>
            <p class="hero__sublede">
              Keep the audience fantasy. Replace the IP dependence. End with a book-shaped thing
              instead of a fandom-shaped approximation of one.
            </p>
            <div class="hero__actions">
              <a class="button button--primary" href="#process">Upload Manuscript</a>
              <a class="button button--secondary" href="#deliverables">View Dossier</a>
            </div>
            <div class="hero__stats" aria-label="Product stats">
              <div class="stat">
                <span class="stat__value">05</span>
                <span class="stat__label">pipeline stages between "good fic" and "credible original"</span>
              </div>
              <div class="stat">
                <span class="stat__value">01</span>
                <span class="stat__label">core artifact: the originalization dossier</span>
              </div>
              <div class="stat">
                <span class="stat__value">0</span>
                <span class="stat__label">interest in lazy noun swaps masquerading as adaptation</span>
              </div>
            </div>
          </div>

          <div class="hero__visual" data-reveal>
            <div class="console">
              <section class="pane" aria-label="Story plan">
                <div class="pane__header">
                  <span class="pane__title">Story Plan</span>
                  <span class="pane__dots">...</span>
                </div>
                <div class="pane__body">
                  <div class="card">
                    <span class="card__label">Preserve</span>
                    <p>
                      Rivalry with intimacy. Emotional competence gap. Competence fantasy wrapped
                      in yearning.
                    </p>
                  </div>
                  <div class="card card--accent">
                    <span class="card__label">Replace</span>
                    <p>
                      Canon academy, inherited power hierarchy, franchise bloodline logic, and the
                      famous scene your comments section keeps quoting.
                    </p>
                  </div>
                  <div class="card">
                    <span class="card__label">Invent</span>
                    <p>
                      A new institution, new escalation ladder, new mythology, and a conflict that
                      belongs to this manuscript instead of to corporate IP.
                    </p>
                  </div>
                </div>
                <div class="pane__footer">
                  <div class="footer-actions">
                    <span class="footer-chip">reimagine</span>
                    <span class="footer-chip">rebuild</span>
                    <span class="footer-chip">lock</span>
                  </div>
                </div>
              </section>

              <section class="pane" aria-label="Beat plan">
                <div class="pane__header">
                  <span class="pane__title">Beat Plan</span>
                  <span class="pane__dots">...</span>
                </div>
                <div class="pane__body">
                  <div class="card">
                    <span class="card__label">Scene Instruction</span>
                    <p>
                      Preserve the magnetism of the original meet-cute, but move it into a setting
                      whose politics and power costs are fully original.
                    </p>
                  </div>
                  <div class="beat-list">
                    <div class="beat">
                      <span class="beat__title">Beat 1</span>
                      <p>The heroine realizes the institution is lying about how talent is measured.</p>
                    </div>
                    <div class="beat beat--active">
                      <span class="beat__title">Beat 2 (current)</span>
                      <p>
                        The rival exposes her workaround, but recognizes the same ambition in her.
                      </p>
                    </div>
                    <div class="beat">
                      <span class="beat__title">Beat 3</span>
                      <p>
                        Their alliance forms around a shared enemy that did not exist in the source fandom.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="pane__footer">
                  <div class="footer-actions">
                    <span class="footer-chip">evaluate</span>
                    <span class="footer-chip">regenerate</span>
                  </div>
                </div>
              </section>

              <section class="pane" aria-label="Script">
                <div class="pane__header">
                  <span class="pane__title">Script</span>
                  <span class="pane__dots">...</span>
                </div>
                <div class="pane__body">
                  <div class="script__preview" aria-hidden="true"></div>
                  <div class="script__body">
                    <div class="card">
                      <span class="script__scene">INT. RANK HALL - PREDAWN</span>
                      <p>
                        The hall was built to convince first-years that excellence could be measured
                        cleanly. Maris knew better. The walls hummed with old bargains, and every
                        perfect score in the archives had been purchased by someone with a family
                        name important enough to survive audit.
                      </p>
                    </div>
                    <div class="card">
                      <p>
                        When Cael sat beside her, he did it with the composure of a man who had
                        already read the ending. That expression had no canon to hide behind now.
                        It had to earn itself from scratch.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="pane__footer">
                  <div class="footer-actions">
                    <span class="footer-chip">generate</span>
                    <span class="footer-chip">prompt</span>
                    <span class="footer-chip">package</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--split" id="problem">
        <div>
          <span class="section__eyebrow">The Problem</span>
          <h2 class="section__title">Fanfiction can prove the engine. It does not automatically build the car.</h2>
          <p class="section__copy">
            Great fanfiction often demonstrates real craft: audience instinct, scene propulsion,
            chemistry, escalation, and emotional payoff. It can also quietly outsource setting
            authority, power logic, and reader onboarding to a universe the manuscript does not own.
            That is fine until you want to publish.
          </p>
        </div>
        <div class="grid problem-grid">
          ${problemMarkup}
        </div>
      </section>

      <section class="section section--split">
        <div>
          <span class="section__eyebrow">The Solution</span>
          <h2 class="section__title">A dead-serious pipeline for removing canon dependency without removing the reason the story works.</h2>
          <p class="section__copy">
            This is not "AI rewrites your fanfic." It is a structured originalization workflow with
            explicit artifacts, hard separation between analysis and rewrite, and an evaluation loop
            that keeps going until the manuscript behaves like original fiction.
          </p>
        </div>
        <article class="solution-card" data-reveal>
          <span class="problem-card__glyph">solution stack</span>
          <h3>Originalization Studio</h3>
          <p>
            The product promise is simple: keep the engine, replace the IP dependence, and hand the
            author something they can actually take to market.
          </p>
          <ul>${solutionMarkup}</ul>
        </article>
      </section>

      <section class="section" id="process">
        <span class="section__eyebrow">How It Works</span>
        <h2 class="section__title">Clean separation between analysis, rebuild, and judgment.</h2>
        <p class="section__copy">
          The structure is the joke and the point. If you skip the artifact handoff, you get a
          shallow rewrite. If you do the handoff properly, you get a manuscript with a fighting
          chance at standing on its own.
        </p>
        <div class="grid process-grid">
          ${processMarkup}
        </div>
      </section>

      <section class="section" id="deliverables">
        <span class="section__eyebrow">Core Artifact</span>
        <h2 class="section__title">Every run produces an originalization dossier.</h2>
        <p class="section__copy">
          The dossier is the operational heart of the system. It records what the manuscript is
          really doing, what canon is carrying for free, what must be rebuilt, and what the next
          rewrite pass is allowed to touch.
        </p>
        <div class="grid deliverables-grid">
          ${deliverableMarkup}
        </div>
      </section>

      <section class="section" id="pricing">
        <span class="section__eyebrow">Investment In Independence</span>
        <h2 class="section__title">Pilot pricing for authors who want deliverables, not vibes.</h2>
        <p class="section__copy">
          Transparent packages. No token-theater pricing, no nebulous "creative consultation,"
          and no pretending chapter one is enough if the underlying premise still collapses under
          scrutiny.
        </p>
        <div class="grid pricing-grid">
          ${pricingMarkup}
        </div>
      </section>

      <section class="section">
        <span class="section__eyebrow">Field Reports</span>
        <h2 class="section__title">Occasionally painful. Consistently clarifying.</h2>
        <div class="grid testimonial-grid">
          ${testimonialMarkup}
        </div>
      </section>

      <section class="section" id="faq">
        <span class="section__eyebrow">Frequently Asked Questions</span>
        <h2 class="section__title">Questions from writers who are correctly suspicious.</h2>
        <div class="grid faq-grid">
          ${faqMarkup}
        </div>

        <div class="cta" data-reveal>
          <h3 class="cta__title">Ready to remove the fandom oxygen tank?</h3>
          <p>
            Bring the draft you wrote, the readership you want, and a willingness to discover which
            parts of the story are genuinely yours already. We will handle the uncomfortable audit.
          </p>
          <div class="cta__actions">
            <a class="button button--primary" href="#top">Initialize Originalization</a>
            <a class="button button--secondary" href="#pricing">View Pilot Pricing</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer__row">
        <div>
          <div class="footer__brand">NEXTCHAPTER</div>
          <div class="brand__meta">Originalization Studio // for self-authored source text</div>
        </div>
        <p class="footer__copy">
          NextChapter helps authors transform self-authored fanfiction into original fiction through
          structured analysis, rebuild, and publishability evaluation. It is not a legal opinion, a
          rights workaround, or a magic noun-swapping machine.
        </p>
      </div>
    </footer>
  </div>
`;

const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealItems.forEach((item) => observer.observe(item));
