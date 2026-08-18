/**
 * gen-llms.mjs — generate llms.txt + llms-full.txt for the Qeetrix docs site
 * (Gap 6 — AI-agent-ready docs; llmstxt.org convention).
 *
 * Reads the @qeetrix/ui barrel (export surface), the generated token summary,
 * and the narrative guides, then writes:
 *   .storybook/public/llms.txt      — concise index with links (for discovery)
 *   .storybook/public/llms-full.txt — guides + key docs concatenated (full ctx)
 *
 * staticDirs:["./public"] ships these at the docs-site root. Runs before
 * `storybook build` (see the docs `build` script) and via `bun run ... llms`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(DOCS, "node_modules/@qeetrix/ui");
const OUT = join(DOCS, ".storybook/public");
const SITE = "https://qeetrix.qeet.in"; // docs site origin (adjust if it moves)

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

// --- export surface from the barrel -----------------------------------------
const barrel = read(join(UI, "src/index.ts"));
const exportNames = new Set();
for (const m of barrel.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
  for (const raw of m[1].split(",")) {
    const spec = raw.trim().replace(/\s+as\s+/, " as ");
    if (!spec) continue;
    const name = spec.includes(" as ") ? spec.split(" as ")[1].trim() : spec;
    if (/^[A-Za-z_$][\w$]*$/.test(name)) exportNames.add(name);
  }
}
const components = readdirSync(join(UI, "src/components/ui"))
  .filter((f) => /\.tsx$/.test(f) && !/\.(test|stories)\.tsx$/.test(f))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

// --- token summary -----------------------------------------------------------
let tokenCount = 0;
try {
  const tokens = JSON.parse(read(join(UI, "src/styles/tokens.json")));
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

Authored as W3C DTCG JSON (\`packages/qeetrix-ui/tokens/**\`), compiled by Style Dictionary to
CSS custom properties (\`--qx-*\`) + JSON. Colour is OKLCH; every required text/surface
pair is held to WCAG-AA by a build gate. Brand = Qeet orange (\`#F26D0E\`). A Tokens
Studio / Figma export lives at \`packages/qeetrix-ui/tokens-studio/\`.

## Guides

${guides.length ? guides.map((g) => `- [${guideTitle(g)}](${SITE}/?path=/docs/guides-${g.replace(/\.mdx$/, "").toLowerCase()})`).join("\n") : "- (none yet)"}

## Reference

- Storybook workshop: ${SITE}
- Full component + token context: ${SITE}/llms-full.txt
- Architecture decisions: docs/adr/ · Accessibility/VPAT: docs/accessibility/
`;

// --- compose llms-full.txt ---------------------------------------------------
const parts = [llms, "\n\n---\n\n# Full context\n"];
for (const g of guides) {
  parts.push(`\n\n## Guide: ${guideTitle(g)}\n\n${read(join(guidesDir, g))}`);
}
for (const doc of ["docs/accessibility/README.md", "docs/adr/README.md", "CONTRIBUTING.md"]) {
  const body = read(join(ROOT, doc));
  if (body) parts.push(`\n\n## ${doc}\n\n${body}`);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "llms.txt"), llms);
writeFileSync(join(OUT, "llms-full.txt"), parts.join(""));

console.log(
  `✔ llms.txt (${components.length} components, ${guides.length} guides) + llms-full.txt → .storybook/public/`,
);
