import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Storybook 10 workshop for the Qeetrix design system.
 * Controls / actions / viewport / docs are built into core in SB10, so only
 * a11y, themes and vitest are added explicitly. Tailwind v4 is wired via its Vite
 * plugin. `addon-vitest` powers the Testing widget in the sidebar; the run itself
 * is configured in `vitest.config.ts`.
 */

/** Absolute path inside the @qeetrix/ui package. */
const ui = (p: string) => fileURLToPath(new URL(`../../qeetrix-ui/${p}`, import.meta.url));

/**
 * The icons-only half of the @qeetrix/icons root barrel. The real root is two lines —
 * `export *` from the icon index and from the logo index — and the logo half is ~7,400
 * brand logos (~78 MB of data-URI modules). Vite pre-bundles a dependency's whole root, so
 * a cold start through the real root took ~50 s and ~2.8 GB here, for logos the workshop
 * never renders. Stories still write `import { TrashIcon } from "@qeetrix/icons"`, and
 * TypeScript still checks that against the published types; only the bundler is pointed at
 * the icon index. A story that imports a `*Logo` will fail to resolve — by design: brand
 * logos belong to the icons package's own docs, not to this workshop.
 *
 * Temporary: this is only needed while the workshop is pinned to @qeetrix/icons 1.0.10. From 2.0
 * the package drops the third-party logos and its root carries just `QeetLogo` and
 * `QeetWordmarkLogo`, so after upgrading, delete `iconIndex` and its alias below.
 */
const iconIndex = join(
  dirname(createRequire(import.meta.url).resolve("@qeetrix/icons/package.json")),
  "dist/generated/icon-index.js",
);

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
  core: { disableTelemetry: true },
  staticDirs: ["./public"],
  async viteFinal(cfg) {
    cfg.plugins ??= [];
    cfg.plugins.push(tailwindcss());

    // Resolve @qeetrix/ui from SOURCE so the workshop never depends on the built
    // `dist/` (which `tsc --watch` dev output can leave with unresolved `@/`
    // aliases) and gets live HMR. Order matters: specific subpaths must precede
    // the bare package; `@/` maps the ui package's own internal path alias
    // (apps/docs itself never uses `@/`).
    // Anchored regexes: CSS/JSON subpaths map to their (renamed) source files; a
    // generic rule maps every other subpath (brand, blocks, components/*, lib/*,
    // hooks/*, fonts/*) to src/<subpath>; the bare specifier maps to the barrel.
    const src = ui("src");
    const sourceAliases = [
      // styles.css is the full entry — core (index.css) plus the host-global base layer, which
      // carries the reduced-motion collapse and the forced-colors remapping. index.css alone is
      // the opt-out "core" entry; aliasing to it would hide both accessibility guarantees.
      { find: /^@qeetrix\/ui\/styles\.css$/, replacement: ui("src/styles/styles.css") },
      {
        find: /^@qeetrix\/ui\/tokens\.css$/,
        replacement: ui("src/styles/tokens.raw.css"),
      },
      {
        find: /^@qeetrix\/ui\/qeetrix\.css$/,
        replacement: ui("src/styles/tokens.css"),
      },
      {
        find: /^@qeetrix\/ui\/tokens\.json$/,
        replacement: ui("src/styles/tokens.json"),
      },
      { find: /^@qeetrix\/ui\/(.+)$/, replacement: `${src}/$1` },
      { find: /^@qeetrix\/ui$/, replacement: ui("src/index.ts") },
      { find: /^@qeetrix\/icons$/, replacement: iconIndex },
      { find: /^@\/(.+)$/, replacement: `${src}/$1` },
    ];
    const existing = cfg.resolve?.alias;
    const existingArray = Array.isArray(existing)
      ? existing
      : existing
        ? Object.entries(existing).map(([find, replacement]) => ({
            find,
            replacement: replacement as string,
          }))
        : [];
    // Because the aliases above pull @qeetrix/ui from a sibling checkout, anything
    // that package imports (React itself, and Base UI's hooks) resolves against
    // ../qeetrix-ui/node_modules — a second physical copy of React, even though the
    // versions match. Two copies means two dispatchers, so the first hook call in a
    // Base UI component throws "Cannot read properties of null (reading 'useRef')".
    // The dev server hides this by pre-bundling everything into one optimized copy;
    // Vitest's browser mode does not, so it must be deduped explicitly. Shared here
    // rather than in vitest.config.ts so dev, build and test resolve identically.
    cfg.resolve = {
      ...cfg.resolve,
      alias: [...sourceAliases, ...existingArray],
      dedupe: [...(cfg.resolve?.dedupe ?? []), "react", "react-dom"],
    };

    // Allow Vite's dev server to serve files from outside the default project root.
    // Setting fs.allow explicitly replaces Vite's workspace-root discovery, so we
    // must re-add the Storybook project root alongside the qeetrix-ui sibling.
    const projectRoot = fileURLToPath(new URL("..", import.meta.url));
    cfg.server = {
      ...cfg.server,
      fs: {
        ...cfg.server?.fs,
        allow: [...(cfg.server?.fs?.allow ?? []), projectRoot, ui("")],
      },
    };

    return cfg;
  },
};

export default config;
