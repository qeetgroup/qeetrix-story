import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

/**
 * Component testing for the Qeetrix workshop.
 *
 * Every story is a test: `storybookTest` turns each export in `stories/**` into a
 * Vitest case that mounts the component in a real Chromium page, fails on runtime
 * errors, runs any `play` function, and (via addon-a11y) runs axe over the result.
 *
 * Three things are worth knowing about this file:
 *
 * 1. It reuses `.storybook/main.ts` wholesale — the plugin applies our `viteFinal`,
 *    so the tests render the published @qeetrix/react from node_modules, exactly as
 *    the dev server and the static build do.
 * 2. There is deliberately no `.storybook/vitest.setup.ts`. Since Storybook 10.3 the
 *    addon applies preview annotations automatically; adding a setup file that calls
 *    `setProjectAnnotations` now double-applies them and logs a warning.
 * 3. Vitest 4 (not 3) is required: this repo is on Vite 8, which Vitest 3 does not
 *    support. Vitest 4 also moved browser providers into their own package, hence
 *    `@vitest/browser-playwright`.
 *
 * Runs headless Chromium only.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          await storybookTest({
            configDir: ".storybook",
            // Watch mode only: gives failures a clickable link into the running workshop.
            storybookScript: "bun run dev",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      // Which parts of the published @qeetrix/react the stories exercise. It lives in
      // node_modules, outside this repo, so v8 needs `allowExternal` to report on it.
      allowExternal: true,
      include: ["**/node_modules/@qeetrix/react/dist/**/*.js"],
      // Deliberately un-thresholded: this reports a number, it does not yet gate on
      // one. Targets belong to the component coverage-metrics work, not this file.
    },
  },
});
