import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression testing (Gap 11). Serves storybook-static and compares each
 * story (× light/dark) against committed baselines. Baselines are OS/font
 * sensitive — generate/update them in the Linux Playwright container (see
 * .github/workflows/vrt.yml and tests/README.md), never from a dev machine.
 */
const PORT = Number(process.env.VRT_PORT ?? 6178);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  expect: {
    // small tolerance for anti-aliasing; animations frozen for determinism.
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 900, height: 640 },
    deviceScaleFactor: 2,
  },
  webServer: {
    command: "node tests/serve-static.mjs",
    url: `http://localhost:${PORT}/index.json`,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
    env: { VRT_PORT: String(PORT) },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
