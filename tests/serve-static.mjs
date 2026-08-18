/**
 * Minimal static server for storybook-static, used by the VRT Playwright config
 * (Gap 11). Mirrors the server in scripts/shoot.mjs. Port via VRT_PORT (6178).
 */

import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const STATIC = join(dirname(fileURLToPath(import.meta.url)), "../storybook-static");
const PORT = Number(process.env.VRT_PORT ?? 6178);

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

if (!existsSync(STATIC)) {
  console.error("✗ storybook-static not found. Run `bun run --filter @qeetrix/docs build` first.");
  process.exit(1);
}

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let file = join(STATIC, url === "/" ? "/index.html" : url);
  if (!existsSync(file)) file = join(STATIC, "/iframe.html");
  res.setHeader("Content-Type", TYPES[extname(file)] ?? "application/octet-stream");
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving storybook-static on :${PORT}`));
