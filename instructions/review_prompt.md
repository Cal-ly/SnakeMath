You are an agentic coding assistant working in the SnakeMath VS Code workspace (Vue 3 + Vite + Tailwind). Your job is to upgrade the NEW site’s topic pages using the legacy review/planning summaries in [docs/content](docs/content).

High-level goal (one topic at a time)
- Pick ONE topic route/page at a time (e.g. /calculus/limits).
- Compare what the legacy planning doc(s) recommend vs what the new site currently teaches.
- Add the highest-value missing content to the actual site pages, using existing UI/content conventions.

Where content lives in this repo (must follow)
- Topic pages are implemented as Vue views in [src/views](src/views) (e.g. [src/views/calculus/LimitsView.vue](src/views/calculus/LimitsView.vue)).
- Page layout uses:
  - Topic wrapper: [src/components/content/TopicPage.vue](src/components/content/TopicPage.vue)
  - Sections: [src/components/content/ContentSection.vue](src/components/content/ContentSection.vue)
  - Math rendering: [src/components/content/MathBlock.vue](src/components/content/MathBlock.vue)
  - Code blocks: [src/components/content/CodeExample.vue](src/components/content/CodeExample.vue)
  - Cross-links: [src/components/content/RelatedTopics.vue](src/components/content/RelatedTopics.vue)
- Route mapping is defined in [src/router/index.ts](src/router/index.ts).
- Titles/descriptions used by TopicPage (and nav) are in [src/data/navigation.ts](src/data/navigation.ts).
- UI patterns/conventions are documented in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

Primary input: legacy summaries
- Use the planning/review docs in [docs/content](docs/content), especially CONTENT_*.md.
- These docs may quote archive material; DO NOT copy text verbatim into the new site. Paraphrase and improve in your own words.

Non-negotiable requirement: 3 analogies per topic page
For the chosen topic page, ensure there are at least THREE distinct analogies in the page content:
1) Everyday perspective (daily life / real-world)
2) Programming/system perspective (software, processes, debugging, signals, data, algorithms)
3) Intuitive/visual perspective (geometric/graphical mental model, “what you’d see”)

Implementation requirement for analogies (match existing site style)
- Use the established “Three analogies” UI pattern from [src/views/calculus/DerivativesView.vue](src/views/calculus/DerivativesView.vue):
  - A 3-column grid on desktop (`grid gap-4 sm:grid-cols-3`)
  - Each analogy is a card: `p-4 bg-surface-alt rounded-lg border border-border`
  - Use headings exactly like:
    - “Everyday Analogy” with an icon like `fa-car` and a warm accent class like `text-amber-600`
    - “Programming Analogy” with `fa-code` and `text-emerald-600`
    - “Visual Intuition” with `fa-mountain` and `text-blue-600`
- Keep them short, concrete, non-overlapping, and accurate. If a legacy analogy is misleading, replace it with a better one.

One-topic workflow (do not mix topics)
1) Choose the single topic route for this pass.
   - Identify its view file in [src/views](src/views) and its nav entry in [src/data/navigation.ts](src/data/navigation.ts).
2) Read the relevant legacy doc(s) in [docs/content](docs/content).
   - Extract: strongest analogies, key explanations, pitfalls/misconceptions, best examples, and any “why it matters” programmer framing.
3) Inspect the current new-site topic view.
   - Identify which sections already exist, which explanations are missing, and whether the 3-analogy block exists.
4) Decide “high-value additions” (keep scope tight).
   Prioritize in this order:
   - Add/fix the 3 analogy block
   - Add one strong misconception/pitfall callout (if missing)
   - Add one concrete example (preferably with a small code snippet in <CodeExample>)
   - Add one intuitive/visual explanation (can be prose or tie-in to an existing widget)
   - Add/adjust cross-links via <RelatedTopics> (2–4 items)
5) Propose changes BEFORE editing:
   - List the exact files you will touch (usually one view file; sometimes [src/data/navigation.ts](src/data/navigation.ts) if the description is weak).
   - Summarize the new sections you’ll add and where they’ll appear.
6) Implement the edits in the actual Vue page(s).
   - Use <ContentSection> for major blocks.
   - Use the Tailwind card patterns in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
   - Keep the tone consistent: clear, programmer-friendly, not overly academic.
7) Validate quickly:
   - Run `npm run type-check`.
   - If you changed logic/components, also run `npm run test`.
   - If there is an e2e spec matching the topic in [e2e](e2e), run `npm run test:e2e -- --grep "<topic keyword>"` when feasible.
8) Report results:
   - What you added (analogies + other improvements)
   - Files changed
   - Any follow-ups for the next pass

Guardrails
- One topic route per pass.
- No unrelated refactors.
- No verbatim reuse of archived/legacy text; paraphrase.
- Maintain accessibility (semantic headings, readable prose, no color-only meaning).
- If you can’t find where a concept is implemented, search the codebase (don’t guess).

Start now with:
- Topic route: /calculus/limits
- Legacy doc(s): [docs/content/CONTENT_LIMITS.md](docs/content/CONTENT_LIMITS.md)
- New site view: [src/views/calculus/LimitsView.vue](src/views/calculus/LimitsView.vue)