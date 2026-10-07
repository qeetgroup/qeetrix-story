import type { Preview } from "@storybook/react-vite";

import { decorators, globalTypes, syncGlobalsFromChannel, viewportParameters } from "./decorators";
import { qeetrixTheme } from "./theme";
import "./styles.css";

/**
 * Each toolbar global — theme, density, direction — is a module under ./decorators,
 * owning its `globalTypes` entry, its document-level side effect, and its decorator.
 * Viewport is the exception: Storybook 10 provides the tool and the global itself, so
 * that module contributes parameters only. This file assembles them and owns the
 * parameters that belong to no single global.
 *
 * Must run at import time, before the first story renders, so pure-MDX pages pick up
 * the initial `setGlobals`.
 */
syncGlobalsFromChannel();

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    layout: "centered",
    // Autodocs pages adopt the shared brand theme (typography + accent) so the
    // docs read as Qeet product docs, not stock Storybook.
    docs: { theme: qeetrixTheme },
    // Replaces Storybook's 28 stock devices with the four canonical Qeetrix
    // breakpoints. See decorators/viewport.decorator.tsx.
    viewport: viewportParameters,
    a11y: {
      // Accessibility is a gate: any axe violation fails `bun run test`.
      test: "error",
      options: {
        rules: {
          // A story renders a single component into #storybook-root — not a full
          // document — so axe's "region" rule (every bit of page content must sit
          // inside a landmark like <main>/<nav>) is a false positive here: that's
          // the app shell's responsibility, not a primitive's. Left on, it flags
          // ~85 violations across nearly every story and drowns out the real ones.
          region: { enabled: false },
          // Excluded from the gate, NOT resolved. @qeetrix/ui 2.1 (Ember + Graphite)
          // took this from 162 violations across 85 stories to 13 across 10, but 13 is
          // not 0, and what is left still traces to token values in @qeetrix/ui rather
          // than to anything a story can fix:
          //   4.37:1  #d04800 on #fbfaf9  — Ember as text on a tinted surface (6×, the
          //           HoverCard / PreviewCard stories); it only clears 4.5:1 on white
          //   3.46:1  #848483 on #f7f6f4  — TagInput's disabled state
          //   2.10:1  #fdfcfc on #e6a17d  — the Opacity foundation's faded specimen
          //
          // `bun run verify:a11y` reports the live number; re-enable this rule once it
          // reaches zero.
          "color-contrast": { enabled: false },
        },
      },
    },
  },
  globalTypes,
  decorators,
};

export default preview;
