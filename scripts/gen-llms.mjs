/**
 * gen-llms.mjs — generate llms.txt + llms-full.txt for the Qeetrix docs site
 * (Gap 6 — AI-agent-ready docs; llmstxt.org convention).
 *
 * Reads the @qeetrix/ui component tree, the generated token summary, and the
 * narrative guides, then writes:
 *   .storybook/public/llms.txt      — concise index with links (for discovery)
 *   .storybook/public/llms-full.txt — guides + key docs concatenated (full ctx)
 *
 * staticDirs:["./public"] ships these at the docs-site root. Runs before
 * `storybook build` (see the docs `build` script) and via `bun run llms`.
 *
 * SOURCE OF TRUTH for the component list + token count: the sibling ../qeetrix-ui
 * checkout, NOT node_modules. The published @qeetrix/ui tarball ships only dist/ —
 * no src/, no tokens.json — so nothing this script reads is in node_modules. The
 * workshop already renders that sibling source (see the alias block in
 * `.storybook/main.ts`, reused by `vitest.config.ts`), so resolving it the same way
 * here keeps one convention: the docs describe exactly what the workshop renders.
 * Prose sources (guides, docs/, CONTRIBUTING.md) come from this repo.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(DOCS, ".storybook/public");
const SITE = "https://qeetrix.qeet.in"; // docs site origin (adjust if it moves)

/** Absolute path inside the sibling @qeetrix/ui checkout — mirrors `.storybook/main.ts`. */
const ui = (p) => fileURLToPath(new URL(`../../qeetrix-ui/${p}`, import.meta.url));

const UI_COMPONENTS = ui("src/components");

if (!existsSync(UI_COMPONENTS)) {
  console.error(
    `✖ gen-llms: @qeetrix/ui source not found at ${UI_COMPONENTS}\n` +
      "  This workshop resolves @qeetrix/ui from a sibling checkout, not from node_modules\n" +
      "  (the published tarball ships dist/ only). Clone it next to this repo:\n" +
      "    git clone https://github.com/qeetgroup/qeetrix-ui.git ../qeetrix-ui\n" +
      "  See the alias block in .storybook/main.ts — `storybook build` needs it too.",
  );
  process.exit(1);
}

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

// --- component modules -------------------------------------------------------
// Components are organised component-first: src/components/<Family>/<module>.tsx
// (e.g. Button/{button,button-group,icon-button,…}.tsx). A family is a directory,
// so recurse one level and collect the kebab-case module files. `index.ts` is the
// family barrel and `__tests__/` holds specs — neither is a component.
const components = readdirSync(UI_COMPONENTS, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== "__tests__")
  .flatMap((family) =>
    readdirSync(join(UI_COMPONENTS, family.name))
      .filter((f) => /\.tsx$/.test(f) && !/\.(test|spec|stories)\.tsx$/.test(f))
      .map((f) => f.replace(/\.tsx$/, "")),
  )
  .sort();

// --- token summary -----------------------------------------------------------
let tokenCount = 0;
try {
  const tokens = JSON.parse(read(ui("src/styles/tokens.json")));
  tokenCount = (JSON.stringify(tokens.light).match(/"[^"]+":\s*"/g) || []).length;
} catch {
  // tokens.json not generated yet — leave count at 0
}

// --- guides ------------------------------------------------------------------
const guidesDir = join(DOCS, "stories/guides");
const guides = existsSync(guidesDir)
  ? readdirSync(guidesDir)
      .filter((f) => f.endsWith(".mdx"))
      .sort()
  : [];
const guideTitle = (f) =>
  f
    .replace(/\.mdx$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// --- compose llms.txt --------------------------------------------------------
const llms = `# Qeetrix (@qeetrix/ui)

> Qeetrix is Qeet Group's shared design system: one published npm package
> (\`@qeetrix/ui\`) of ${components.length} accessible, token-driven React components built on
> Base UI + Tailwind v4, with W3C-DTCG design tokens (OKLCH, WCAG-AA gated) and a
> Qeet-orange brand. It powers Qeet ID, qeet-docs, qeet-notify and qeet-logs.

## Install

- \`bun add @qeetrix/ui react react-dom\`
- Import the stylesheet once: \`@import "@qeetrix/ui/styles.css";\`
- Import components from the barrel: \`import { Button, Card } from "@qeetrix/ui";\`
- Light/dark via the \`.dark\` class (managed by \`ThemeProvider\`).

## Import surfaces

- \`@qeetrix/ui\` — components, blocks re-exports, hooks, \`cn\`
- \`@qeetrix/ui/styles.css\` — tokens + fonts + base layer (side-effect import)
- \`@qeetrix/ui/tokens.css\` — raw \`--qx-*\` custom properties · \`@qeetrix/ui/tokens.json\`
- \`@qeetrix/ui/brand\` — QeetLogo + brand icons · \`@qeetrix/ui/blocks\` — composed patterns

## Components (${components.length})

${components.map((c) => `- ${c}`).join("\n")}

## Design tokens (~${tokenCount} per theme)

Authored as W3C DTCG JSON (\`qeetrix-ui/src/tokens/**\`), compiled by Style Dictionary to
CSS custom properties (\`--qx-*\`) + JSON. Colour is OKLCH; every required text/surface
pair is held to WCAG-AA by a build gate. Brand = Qeet orange (\`#F26D0E\`).

## Guides

${guides.length ? guides.map((g) => `- [${guideTitle(g)}](${SITE}/?path=/docs/guides-${g.replace(/\.mdx$/, "").toLowerCase()})`).join("\n") : "- (none yet)"}

## Reference

- Storybook workshop: ${SITE}
- Full component + token context: ${SITE}/llms-full.txt
- Workshop docs: \`docs/\` · Contributing: \`CONTRIBUTING.md\` · Source: github.com/qeetgroup/qeetrix-ui
`;

// --- compose llms-full.txt ---------------------------------------------------
// Everything concatenated here is checked into THIS repo, so the full-context file
// can never drift against an unrelated checkout: the narrative guides, then the
// long-form docs. `docs/` is enumerated rather than listed so adding a doc ships it
// automatically instead of silently missing it.
const docsDir = join(DOCS, "docs");
const longDocs = [
  ...(existsSync(docsDir)
    ? readdirSync(docsDir)
        .filter((f) => f.endsWith(".md"))
        .sort()
        .map((f) => `docs/${f}`)
    : []),
  "CONTRIBUTING.md",
];

const parts = [llms, "\n\n---\n\n# Full context\n"];
for (const g of guides) {
  parts.push(`\n\n## Guide: ${guideTitle(g)}\n\n${read(join(guidesDir, g))}`);
}
for (const doc of longDocs) {
  const body = read(join(DOCS, doc));
  if (body) parts.push(`\n\n## ${doc}\n\n${body}`);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "llms.txt"), llms);
writeFileSync(join(OUT, "llms-full.txt"), parts.join(""));

console.log(
  `✔ llms.txt (${components.length} components, ${guides.length} guides) + llms-full.txt → .storybook/public/`,
);
