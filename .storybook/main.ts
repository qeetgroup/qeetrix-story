import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Storybook 10 workshop for @qeetrix/react, the Qeetrix design system.
 *
 * It renders the *published* packages, `@qeetrix/react` and `@qeetrix/tokens` from
 * npm, exactly as a Qeet product installs them: what you see here is what ships.
 * Controls, actions, viewport and docs are built into core in SB10, so only a11y,
 * themes and vitest are added. Tailwind v4 styles the workshop's own chrome
 * (foundation specimens, helpers); components never need it.
 *
 * Props tables come from the package's type declarations: `scripts/docgen.mjs`
 * reads them into `.storybook/docgen.json`, which preview.tsx hands to autodocs.
 * Storybook's own docgen only sees source files it compiles, and a dependency's
 * JavaScript carries no types.
 */
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  // The brand faces for the workshop chrome (manager-head.html), served from the
  // tokens package rather than copied in, so they always match what apps load.
  staticDirs: ["./public", { from: "../node_modules/@qeetrix/tokens/dist/fonts", to: "/fonts" }],
  async viteFinal(cfg) {
    cfg.plugins ??= [];
    cfg.plugins.push(tailwindcss());
    // Pre-bundle the design system up front. Discovered mid-run instead, Vite reloads the
    // page, which fails the first Vitest run after a new import ("Vite unexpectedly
    // reloaded a test"). Icons are one module each, so they're globbed.
    cfg.optimizeDeps = {
      ...cfg.optimizeDeps,
      include: [
        ...(cfg.optimizeDeps?.include ?? []),
        "@qeetrix/react",
        "@qeetrix/react/experimental",
        "@qeetrix/react/locales/hi",
        "@qeetrix/tokens",
        "@qeetrix/icons/icons/*",
      ],
    };
    cfg.resolve = {
      ...cfg.resolve,
      // One React for the stories, Base UI and @qeetrix/react, in dev, build and
      // Vitest's browser mode alike.
      dedupe: [...(cfg.resolve?.dedupe ?? []), "react", "react-dom"],
    };
    return cfg;
  },
};

export default config;
