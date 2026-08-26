import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Storybook 10 workshop for the Qeetrix design system.
 * Controls / actions / viewport / docs are built into core in SB10, so only
 * a11y and themes are added explicitly. Tailwind v4 is wired via its Vite plugin.
 */

/** Absolute path inside the @qeetrix/ui package. */
const ui = (p: string) =>
  fileURLToPath(new URL(`../../qeetrix-ui/${p}`, import.meta.url));


const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
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
      { find: /^@qeetrix\/ui\/styles\.css$/, replacement: ui("src/styles/index.css") },
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
    cfg.resolve = {
      ...cfg.resolve,
      alias: [...sourceAliases, ...existingArray],
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
