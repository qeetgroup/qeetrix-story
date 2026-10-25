import type { Preview } from "@storybook/react-vite";

import { ComponentDocs } from "./blocks/component-docs";
import { ThemedDocsContainer } from "./blocks/docs-container";
import { decorators, globalTypes, syncGlobalsFromChannel, viewportParameters } from "./decorators";
import docgen from "./docgen.json";
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

type Docgen = Record<string, { description: string; argTypes: Record<string, object> }>;
/** A component's entry in docgen.json (scripts/docgen.mjs), by its exported name. */
const docsFor = (component: unknown) => {
  const named = component as { displayName?: string; name?: string } | undefined;
  const name = named?.displayName ?? named?.name;
  return name ? (docgen as Docgen)[name] : undefined;
};

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    options: {
      // The sidebar in reading order: start here, learn the system, then the parts,
      // then how they compose.
      storySort: {
        order: [
          "Welcome",
          "Guides",
          ["Getting started", "Theming"],
          "Foundations",
          ["Colour", "Typography", "Spacing", "Elevation", "Motion", "Iconography", "Brand"],
          "Components",
          [
            "Overview",
            "Actions",
            "Forms",
            "Data Entry",
            "Data Display",
            "Feedback",
            "Overlays",
            "Navigation",
            "Layout",
            "Media",
            "Typography",
            "Utilities",
          ],
          "Patterns",
          // A console's own flow: sign in, the dashboard, people, then settings.
          [
            "Sign in",
            "Dashboard header",
            "Users table",
            "User detail",
            "Account settings",
            "Search",
          ],
        ],
      },
    },
    controls: { expanded: true, sort: "requiredFirst" },
    backgrounds: { disable: true },
    layout: "centered",
    docs: {
      // Autodocs pages adopt the shared brand theme (typography + accent) so the
      // docs read as Qeet product docs, not stock Storybook.
      theme: qeetrixTheme,
      // ...and switch to the dark docs theme with the Theme toolbar.
      container: ThemedDocsContainer,
      // One page layout for every component (blocks/component-docs.tsx): status,
      // import, playground, examples, accessibility, resources.
      page: ComponentDocs,
      // Props tables and descriptions from @qeetrix/react's type declarations: the
      // published JavaScript carries no types for Storybook's own docgen to read.
      extractArgTypes: (component: unknown) => docsFor(component)?.argTypes ?? null,
      extractComponentDescription: (component: unknown) => docsFor(component)?.description ?? null,
    },
    // Replaces Storybook's 28 stock devices with one per @qeetrix/react window size
    // class. See decorators/viewport.decorator.tsx.
    viewport: viewportParameters,
    a11y: {
      // Accessibility is a gate: any axe violation fails `bun run test`.
      test: "error",
      options: {
        rules: {
          // A story renders a single component into #storybook-root — not a full
          // document — so axe's "region" rule (every bit of page content must sit
          // inside a landmark like <main>/<nav>) is a false positive here: that's
          // the app shell's responsibility, not a primitive's.
          region: { enabled: false },
        },
      },
    },
  },
  globalTypes,
  decorators,
};

export default preview;
