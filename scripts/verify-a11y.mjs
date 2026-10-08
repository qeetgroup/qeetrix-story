/**
 * Colour-contrast report.
 *
 * `color-contrast` is excluded from the accessibility gate in `.storybook/preview.ts`
 * because every current violation traces to one semantic-token decision in
 * `@qeetrix/ui` rather than to anything a story can fix. Excluding it from the gate
 * must not make it invisible, so this reports the live number instead.
 *
 * Deliberately **never fails** — it is a measurement, not a gate. Re-enable the rule
 * in the gate once the tokens are corrected, and this script stops being needed.
 *
 * Runs axe with only `color-contrast` enabled, scoped to `#storybook-root` so the
 * numbers stay comparable to what the Vitest a11y run would report.
 *
 *   bun run verify:a11y                 # light theme (the recorded baseline)
 *   A11Y_THEME=dark bun run verify:a11y # dark is a separate risk surface
 *   A11Y_GREP=button bun run verify:a11y
 */
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "storybook-static");
const AXE = join(ROOT, "node_modules/axe-core/axe.min.js");
const PORT = Number(process.env.A11Y_PORT ?? 6180);
const THEME = process.env.A11Y_THEME ?? "light";
const GREP = process.env.A11Y_GREP?.toLowerCase();

if (!existsSync(STATIC)) {
  console.error("storybook-static is missing. Run `bunx storybook build` first.");
  process.exit(1);
}

const TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".mjs": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(request.url?.split("?")[0] ?? "/");
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  let file = join(STATIC, safePath === "/" ? "index.html" : safePath);
  if (!existsSync(file)) file = join(STATIC, "iframe.html");
  response.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

// Same enumeration source as scripts/shoot.mjs.
const index = JSON.parse(readFileSync(join(STATIC, "index.json"), "utf8"));
const stories = Object.values(index.entries)
  .filter((entry) => entry.type === "story")
  .filter((story) => (GREP ? story.id.toLowerCase().includes(GREP) : true));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

/** violations keyed by "foreground on background", so repeat offenders group up. */
const pairs = new Map();
const failingStories = [];
let total = 0;

try {
  let scanned = 0;
  for (const story of stories) {
    // Progress goes to stderr so the report on stdout stays pipeable. Without this the
    // script looks hung: a full pass is 400+ page loads and several minutes.
    scanned += 1;
    if (scanned % 25 === 0 || scanned === stories.length) {
      process.stderr.write(`  scanned ${scanned}/${stories.length}\n`);
    }

    await page.goto(
      `http://127.0.0.1:${PORT}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${THEME}`,
      { waitUntil: "domcontentloaded", timeout: 20_000 },
    );
    // Contrast needs fonts and CSS settled, but waiting for full network idle on every
    // story costs minutes across 400+ of them and some stories never reach it. Give it
    // a bounded chance and move on — a late-loading webfont changes glyph shapes, not
    // the computed colours axe measures.
    await page.waitForLoadState("networkidle", { timeout: 2_000 }).catch(() => {});
    await page.addScriptTag({ path: AXE });

    const violations = await page.evaluate(async () => {
      const result = await window.axe.run("#storybook-root", {
        runOnly: { type: "rule", values: ["color-contrast"] },
      });
      return result.violations.flatMap((violation) =>
        violation.nodes.map((node) => node.any[0]?.data ?? {}),
      );
    });

    if (violations.length === 0) continue;

    failingStories.push({ id: story.id, count: violations.length });
    total += violations.length;

    for (const data of violations) {
      const key = `${data.fgColor} on ${data.bgColor}`;
      const existing = pairs.get(key) ?? { count: 0, ratio: data.contrastRatio, key };
      existing.count += 1;
      // Keep the worst ratio seen for this pair.
      if (typeof data.contrastRatio === "number") {
        existing.ratio = Math.min(existing.ratio ?? Infinity, data.contrastRatio);
      }
      pairs.set(key, existing);
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

console.log(`\nColour contrast — ${THEME} theme, ${stories.length} stories\n`);

if (total === 0) {
  console.log("  no violations");
  console.log("\n  The gate can now re-enable `color-contrast` in .storybook/preview.ts.");
} else {
  console.log(`  ${total} violations across ${failingStories.length} stories\n`);

  console.log("  Worst colour pairings (fix these tokens, not the stories):\n");
  for (const pair of [...pairs.values()].sort((a, b) => b.count - a.count).slice(0, 10)) {
    const ratio = typeof pair.ratio === "number" ? pair.ratio.toFixed(2) : "?";
    console.log(`    ${String(pair.count).padStart(3)}×  ${ratio.padStart(5)}:1  ${pair.key}`);
  }

  console.log("\n  Most affected stories:\n");
  for (const story of failingStories.sort((a, b) => b.count - a.count).slice(0, 10)) {
    console.log(`    ${String(story.count).padStart(3)}×  ${story.id}`);
  }

  console.log("\n  WCAG 2.2 AA requires 4.5:1 for normal text, 3:1 for large text.");
  console.log("  These are @qeetrix/ui token values — do not patch them from this repo.");
}
