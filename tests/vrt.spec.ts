import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

/**
 * One snapshot per story × theme, enumerated from the built Storybook index
 * (same source as scripts/shoot.mjs). Baselines live in
 * tests/vrt.spec.ts-snapshots/ — commit only baselines generated in CI's Linux
 * container. Scope with VRT_GREP (substring match on story id).
 */
const STATIC = join(dirname(fileURLToPath(import.meta.url)), "../storybook-static");
const index = JSON.parse(readFileSync(join(STATIC, "index.json"), "utf8"));
const grep = process.env.VRT_GREP?.toLowerCase();

const stories = Object.values(index.entries)
  .filter((e) => e.type === "story")
  .filter((s) => (grep ? s.id.toLowerCase().includes(grep) : true));

for (const theme of ["light", "dark"]) {
  test.describe(theme, () => {
    for (const story of stories) {
      test(story.id, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`, {
          waitUntil: "networkidle",
        });
        await page.waitForTimeout(300); // settle fonts
        await expect(page).toHaveScreenshot(`${story.id}-${theme}.png`, {
          fullPage: true,
        });
      });
    }
  });
}
