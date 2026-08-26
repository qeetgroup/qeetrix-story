/**
 * Verifies the Qeetrix story contract (see stories/_contract.ts).
 *
 * Static: parses each story file with Storybook's own CSF tooling — no build, no
 * browser, runs in milliseconds. Regex is not an option here, because several story
 * files contain fixture data with its own `title:` / `parameters:` keys that a
 * naive match picks up instead of the real meta.
 *
 * Two tiers of output, deliberately:
 *
 *   ERRORS  — contract violations. Fail the run. These are things an author can fix
 *             immediately by editing the file in front of them.
 *   REPORT  — measured coverage. Never fails. These are the numbers that tell you
 *             what the library does not yet have, and they shrink as later items
 *             land. Measured here rather than declared in the files themselves, so
 *             they cannot go stale.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { babelParse, loadCsf } from "storybook/internal/csf-tools";

const STORIES = "stories";
const COMPONENTS = join(STORIES, "components");

/**
 * Read the allowed vocabularies straight out of the TypeScript union types rather
 * than duplicating them here — otherwise the contract and its validator drift, and
 * the validator silently starts accepting values the type rejects.
 */
function readVocabularies() {
  const ast = babelParse(readFileSync(join(STORIES, "_contract.ts"), "utf-8"));
  const vocab = {};
  for (const node of ast.program.body) {
    const decl = node.type === "ExportNamedDeclaration" ? node.declaration : node;
    if (decl?.type !== "TSTypeAliasDeclaration") continue;
    if (decl.typeAnnotation.type !== "TSUnionType") continue;
    vocab[decl.id.name] = decl.typeAnnotation.types
      .filter((t) => t.type === "TSLiteralType" && t.literal.type === "StringLiteral")
      .map((t) => t.literal.value);
  }
  return vocab;
}

const vocab = readVocabularies();
const CATEGORIES = vocab.QeetrixCategory ?? [];
const STATUSES = vocab.QeetrixStatus ?? [];

if (!CATEGORIES.length || !STATUSES.length) {
  console.error("FAIL could not read the contract vocabularies from stories/_contract.ts");
  process.exit(1);
}

/** Pull the literal `qeetrix: qx({ ... })` block out of the meta's parameters AST. */
function readContract(csf) {
  const params = csf._metaAnnotations?.parameters;
  if (params?.type !== "ObjectExpression") return null;

  const prop = params.properties.find(
    (p) => p.type === "ObjectProperty" && (p.key.name ?? p.key.value) === "qeetrix",
  );
  if (!prop) return null;

  // Authors write `qx({ ... })`; unwrap the call to reach the object literal.
  const object = prop.value.type === "CallExpression" ? prop.value.arguments[0] : prop.value;
  if (object?.type !== "ObjectExpression") return null;

  const contract = {};
  for (const p of object.properties) {
    if (p.type !== "ObjectProperty") continue;
    if (p.value.type !== "StringLiteral") continue;
    contract[p.key.name ?? p.key.value] = p.value.value;
  }
  return contract;
}

/**
 * Whether the meta carries prose documentation (`docs.description.component`).
 *
 * Composite stories legitimately have no single `component` — Chart documents
 * ChartContainer/ChartTooltip, Sidebar documents SidebarProvider/SidebarGroup/… —
 * so there is no props table to generate. Those stories carry a written description
 * instead, and that is what makes them documented.
 */
function hasProseDescription(csf) {
  const params = csf._metaAnnotations?.parameters;
  if (params?.type !== "ObjectExpression") return false;

  const get = (object, key) =>
    object?.properties?.find(
      (p) => p.type === "ObjectProperty" && (p.key.name ?? p.key.value) === key,
    )?.value;

  const description = get(get(params, "docs"), "description");
  const component = get(description, "component");
  return component?.type === "StringLiteral" || component?.type === "TemplateLiteral";
}

function parse(dir, file) {
  const path = join(dir, file);
  const code = readFileSync(path, "utf-8");
  return { path, csf: loadCsf(code, { fileName: path, makeTitle: (t) => t }).parse() };
}

const storyFiles = (dir) => readdirSync(dir).filter((f) => f.endsWith(".stories.tsx"));

/** Component stories live one level deeper now: stories/components/<category>/*.stories.tsx */
const componentStoryFiles = () =>
  readdirSync(COMPONENTS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const dir = join(COMPONENTS, entry.name);
      return storyFiles(dir).map((file) => ({ dir, file }));
    });

const errors = [];
const warnings = [];

// ── Component stories: the full contract applies ────────────────────────────────
const components = [];
for (const { dir, file } of componentStoryFiles()) {
  const { path, csf } = parse(dir, file);
  const title = csf.meta?.title;
  const contract = readContract(csf);

  if (!title) errors.push(`${path}: meta is missing a title`);
  if (!csf.meta?.tags?.includes("autodocs"))
    errors.push(`${path}: meta is missing the autodocs tag`);

  // Documented one way or the other: a `component` gives autodocs a props table, a
  // prose description covers the composite stories that have no single component.
  const composite = !csf.meta?.component;
  if (composite && !hasProseDescription(csf)) {
    errors.push(`${path}: undocumented — needs a meta component or a docs description`);
  }

  if (!contract) {
    errors.push(`${path}: no parameters.qeetrix contract — add qx({ category, status })`);
  } else {
    if (!contract.category) errors.push(`${path}: contract is missing "category"`);
    else if (!CATEGORIES.includes(contract.category))
      errors.push(`${path}: unknown category "${contract.category}"`);

    if (!contract.status) errors.push(`${path}: contract is missing "status"`);
    else if (!STATUSES.includes(contract.status))
      errors.push(`${path}: unknown status "${contract.status}"`);
  }

  // Warning, not an error: fixing it changes the story id, which is a call to make
  // deliberately rather than a side effect of a metadata check.
  const name = title?.split("/").slice(1).join("/");
  if (name && /\s/.test(name)) warnings.push(`${path}: title "${title}" contains a space`);

  components.push({
    path,
    title,
    composite,
    category: contract?.category,
    status: contract?.status,
    stories: csf.stories.length,
    interactive: csf.stories.some((s) => s.tags?.includes("play-fn")),
  });
}

// ── Everything that is not a component story ────────────────────────────────────
// Foundations and brand are galleries with no `component`; patterns, recipes and the
// playground are compositions rather than library surface. None of them owns a slot
// in the component inventory, so the contract is not required — but every one still
// has to carry a title, or it lands in the sidebar unnamed.
const DOC_DIRS = [STORIES, "brand", "foundations", "patterns", "recipes", "playground"];
const docs = [];
for (const name of DOC_DIRS) {
  const dir = name === STORIES ? STORIES : join(STORIES, name);
  if (!existsSync(dir)) continue;
  for (const file of storyFiles(dir)) {
    const { path, csf } = parse(dir, file);
    if (!csf.meta?.title) errors.push(`${path}: meta is missing a title`);
    docs.push(path);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────────
const tally = (key) =>
  Object.entries(
    components.reduce((acc, c) => {
      const k = c[key] ?? "(unset)";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

const pct = (n, total) => (total === 0 ? "n/a" : `${Math.round((n / total) * 100)}%`);
const totalStories = components.reduce((n, c) => n + c.stories, 0);

/**
 * Interaction coverage is only meaningful against components that can be interacted
 * with. A Separator or a Skeleton has no behaviour to assert, so counting it in the
 * denominator produces a number that can never reach 100% and therefore never means
 * anything. These four categories are the ones with behaviour.
 */
const INTERACTIVE_CATEGORIES = ["actions", "overlays", "navigation", "data-entry"];
const interactiveComponents = components.filter((c) => INTERACTIVE_CATEGORIES.includes(c.category));
const covered = interactiveComponents.filter((c) => c.interactive);

console.log(
  `\nQeetrix story contract — ${components.length} components, ${docs.length} doc pages\n`,
);

for (const [category, count] of tally("category")) {
  console.log(`  ${String(count).padStart(3)}  ${category}`);
}
console.log();
for (const [status, count] of tally("status")) {
  console.log(`  ${String(count).padStart(3)}  ${status}`);
}

console.log(`\nCoverage (measured, not declared)\n`);
console.log(`  stories               ${totalStories}`);
console.log(
  `  interaction tests     ${covered.length}/${interactiveComponents.length} interactive components ` +
    `(${pct(covered.length, interactiveComponents.length)})`,
);

for (const category of INTERACTIVE_CATEGORIES) {
  const inCategory = interactiveComponents.filter((c) => c.category === category);
  const done = inCategory.filter((c) => c.interactive);
  const todo = inCategory
    .filter((c) => !c.interactive)
    .map((c) => c.title?.split("/").pop())
    .sort();

  console.log(
    `\n  ${category.padEnd(11)} ${String(done.length).padStart(2)}/${String(inCategory.length).padEnd(3)} ${pct(done.length, inCategory.length).padStart(4)}`,
  );
  if (todo.length) console.log(`    uncovered: ${todo.join(", ")}`);
}

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})\n`);
  for (const w of warnings) console.log(`  ${w}`);
}

console.log();

if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.error(`\n${errors.length} contract violation(s)`);
  process.exit(1);
}

const composites = components.filter((c) => c.composite).length;
console.log(`PASS ${components.length} components declare a valid category and status`);
console.log(
  `PASS ${components.length} components are documented and tagged autodocs ` +
    `(${components.length - composites} with a props table, ${composites} composite)`,
);
console.log(`PASS ${docs.length} documentation stories have titles`);
