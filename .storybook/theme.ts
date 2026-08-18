import { create } from "storybook/theming";

/**
 * Branded Storybook themes for the workshop *chrome* (sidebar / toolbars, via
 * manager.ts) and the autodocs pages (preview.ts `docs.theme`). Two variants —
 * light + dark — so the chrome follows the Theme toolbar toggle in lockstep with
 * the preview (manager.ts subscribes to the theme global and swaps between them).
 *
 * Typography mirrors the Qeetrix design tokens — Cal Sans Text for body, Cal Sans
 * Display for headings — and the accent is the Qeet brand orange. Keeping it here
 * in one place means the docs site reads as one product, not stock Storybook.
 */

const brand = {
  brandTitle: "Qeetrix",
  brandUrl: "https://qeet.in",
  brandTarget: "_self",

  // Qeet brand orange — primary actions, selected states, highlights.
  colorPrimary: "#F26D0E",
  colorSecondary: "#EA580C",

  // Typography — Cal Sans family from the design token layer.
  fontBase: '"Cal Sans Text", "Cal Sans UI", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',

  barSelectedColor: "#F26D0E",
  barHoverColor: "#EA580C",
} as const;

/** Light chrome — warm-neutral surfaces, warm ink. */
export const qeetrixThemeLight = create({
  ...brand,
  base: "light",
  brandImage: "/qeet-logo.svg",

  appBg: "#F4F2EE",
  appContentBg: "#F9F8F5",
  appPreviewBg: "#FFFFFF",
  appBorderColor: "#DDD9D2",
  appBorderRadius: 14,

  textColor: "#17150D",
  textMutedColor: "#7A786E",
  textInverseColor: "#FFFFFF",

  barBg: "#FFFFFF",
  barTextColor: "#7A786E",

  inputBg: "#FFFFFF",
  inputBorder: "#DAD6CF",
  inputTextColor: "#17150D",
  inputBorderRadius: 10,
});

/**
 * Default export used where a single static theme is expected (preview.ts
 * `docs.theme`, and the manager's boot theme in manager.ts). Autodocs typography is
 * driven by the DS tokens in styles.css, so this light base is only a fallback for
 * chrome the CSS doesn't reach.
 *
 * NB: Storybook applies the manager theme *once* at boot — `addons.setConfig({ theme })`
 * does not hot-swap a mounted manager — so the sidebar/toolbar can't follow the Theme
 * toggle by swapping theme objects. manager.ts instead toggles a `.qx-chrome-dark`
 * class on the manager document, and manager-head.html restyles the chrome under it.
 */
export const qeetrixTheme = qeetrixThemeLight;
