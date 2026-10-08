import { fileURLToPath } from "node:url";
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
 *    so `@qeetrix/ui` resolves to the sibling `../qeetrix-ui/src` here exactly as it
 *    does in the dev server. Tests exercise the same source the workshop renders.
 * 2. There is deliberately no `.storybook/vitest.setup.ts`. Since Storybook 10.3 the
 *    addon applies preview annotations automatically; adding a setup file that calls
 *    `setProjectAnnotations` now double-applies them and logs a warning.
 * 3. Vitest 4 (not 3) is required: this repo is on Vite 8, which Vitest 3 does not
 *    support. Vitest 4 also moved browser providers into their own package, hence
 *    `@vitest/browser-playwright`.
 *
 * Runs headless Chromium only.
 */
/** The @qeetrix/ui source this workshop renders — a sibling checkout, not a dependency. */
const uiSrc = fileURLToPath(new URL("../qeetrix-ui/src", import.meta.url));

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
      // The interesting question is which @qeetrix/ui components the stories
      // actually exercise, and that source lives outside this repo (see the alias
      // block in .storybook/main.ts), so v8 needs `allowExternal` to report on it.
      allowExternal: true,
      include: [`${uiSrc}/**/*.{ts,tsx}`],
      exclude: ["**/*.stories.tsx", "**/__tests__/**", "**/*.d.ts"],
      // Deliberately un-thresholded: this reports a number, it does not yet gate on
      // one. Targets belong to the component coverage-metrics work, not this file.
    },
  },
});
