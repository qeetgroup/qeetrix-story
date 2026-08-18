/**
 * Visual QA screenshotter for the Qeetrix Storybook.
 *
 *   bun run --filter @qeetrix/docs build      # produce storybook-static first
 *   node apps/qeetrix-story/scripts/shoot.mjs                # shoot every story (light + dark)
 *   node apps/qeetrix-story/scripts/shoot.mjs button alert   # only stories whose id matches a term
 *
 * Output: apps/qeetrix-story/screenshots/{light,dark}/<story-id>.png
 * Serves storybook-static over http (Storybook's iframe needs real requests),
 * then drives headless Chromium via Playwright, toggling the `theme` global.
 */

import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile as read } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "storybook-static");
const OUT = join(ROOT, "screenshots");
const PORT = Number(process.env.SHOOT_PORT ?? 6177);
const filters = process.argv.slice(2).map((s) => s.toLowerCase());

if (!existsSync(STATIC)) {
  console.error("✗ storybook-static not found. Run `bun run --filter @qeetrix/docs build` first.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = join(STATIC, url === "/" ? "/index.html" : url);
    if (!existsSync(file)) file = join(STATIC, "/iframe.html"); // SPA-ish fallback
    res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
    createReadStream(file).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end("not found");
  }
});

await new Promise((r) => server.listen(PORT, r));

const index = JSON.parse(await read(join(STATIC, "index.json"), "utf8"));
let stories = Object.values(index.entries).filter((e) => e.type === "story");
if (filters.length) {
  stories = stories.filter((s) => filters.some((f) => s.id.toLowerCase().includes(f)));
}
console.log(`Shooting ${stories.length} stories × 2 themes on :${PORT}`);

await mkdir(join(OUT, "light"), { recursive: true });
await mkdir(join(OUT, "dark"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 900, height: 640 },
  deviceScaleFactor: 2,
});

for (const story of stories) {
  for (const theme of ["light", "dark"]) {
    const url = `http://localhost:${PORT}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(450); // settle fonts + enter animations
      await page.screenshot({ path: join(OUT, theme, `${story.id}.png`) });
    } catch (err) {
      console.warn(`  ! ${theme} ${story.id}: ${err.message}`);
    }
  }
  process.stdout.write(".");
}

console.log("\n✔ Screenshots → apps/qeetrix-story/screenshots/{light,dark}/");
await browser.close();
server.close();
