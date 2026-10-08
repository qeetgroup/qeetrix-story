/**
 * setup-ui.mjs — make the sibling @qeetrix/ui source checkout ready to render.
 *
 * The workshop renders `../qeetrix-ui/src` (see the alias block in `.storybook/main.ts`), not
 * node_modules. Where that checkout is missing — a Vercel build, a fresh clone — this clones
 * qeetgroup/qeetrix-ui at the release tag of the @qeetrix/ui version bun.lock installs, the
 * same tag the GitHub workflows check out, so the stories render the API the type check reads.
 * An existing checkout is used as it is: locally it is usually a branch being worked on.
 * Either way it then installs the checkout's dependencies and builds its generated tokens
 * (tokens.css, tokens.json, lib/token-values.ts are gitignored there).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI = join(ROOT, "..", "qeetrix-ui");
const REPO = "https://github.com/qeetgroup/qeetrix-ui.git";

const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: "inherit" });

const locked = readFileSync(join(ROOT, "bun.lock"), "utf8").match(
  /"@qeetrix\/ui@(\d+\.\d+\.\d+)"/,
)?.[1];
if (!locked) {
  console.error("✖ setup-ui: bun.lock does not resolve @qeetrix/ui.");
  process.exit(1);
}

if (existsSync(join(UI, "src"))) {
  console.log(`setup-ui: using the existing checkout at ${UI}.`);
} else {
  console.log(`setup-ui: cloning qeetrix-ui v${locked} into ${UI}.`);
  run(
    "git",
    [
      "-c",
      "advice.detachedHead=false",
      "clone",
      "--quiet",
      "--depth",
      "1",
      "--branch",
      `v${locked}`,
      REPO,
      UI,
    ],
    ROOT,
  );
}

// CI and Vercel set CI; a local checkout may be mid-change, so it installs normally there.
run("bun", ["install", ...(process.env.CI ? ["--frozen-lockfile"] : [])], UI);
run("bun", ["run", "build:tokens"], UI);
