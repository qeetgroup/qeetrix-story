/**
 * docgen.mjs — props tables for autodocs, read from @qeetrix/react's type declarations.
 *
 *   node scripts/docgen.mjs        → .storybook/docgen.json
 *
 * The workshop renders the published package, whose JavaScript carries no types, so
 * Storybook's own docgen (which reads source files it compiles) finds no props. The
 * package's `.d.ts` files do carry every prop with its JSDoc. This walks the root and
 * `experimental` entry points with the TypeScript compiler and writes, per component:
 * its description, the family folder it lives in, and its props as Storybook argTypes: its
 * own first, then those it takes from the Base UI part it wraps, grouped under "Base UI".
 * Inherited DOM attributes are left out, as every enterprise props table does. preview.ts hands them to
 * autodocs through `parameters.docs.extractArgTypes`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));
const pkgDir = dirname(require.resolve("@qeetrix/react/package.json"));
const entries = [join(pkgDir, "dist/index.d.ts"), join(pkgDir, "dist/experimental/index.d.ts")];
const OWN = `${join(pkgDir, "dist")}/`;
// Props a component takes straight from the Base UI part it wraps (Dialog's `open`, Meter's
// `value`) belong in its table too, grouped under "Base UI". Plumbing every part shares is not.
const BASE_UI = `${dirname(require.resolve("@base-ui/react/package.json"))}/`;
const PLUMBING = new Set(["className", "style", "render", "ref", "key"]);

const program = ts.createProgram(entries, {
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  target: ts.ScriptTarget.ES2022,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
});
const checker = program.getTypeChecker();
const FORMAT =
  ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

/**
 * JSDoc as a reader wants it: without the internal references to the specs and design
 * rules ("(07-components.md, C2)", "(design rules §7)"), which mean nothing outside the repo.
 */
const clean = (text) =>
  text
    .replace(/\s*\((?:[^()]*\.md\b[^()]*|design rules[^()]*|spec[^()]*)\)/gi, "")
    .replace(/\s+([.,;:])/g, "$1")
    // JSDoc wraps lines at 100 columns; a props table shouldn't.
    .replace(/([^\n])\n(?!\n)/g, "$1 ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
const docs = (symbol) => clean(ts.displayPartsToString(symbol.getDocumentationComment(checker)));
/** A component's summary: its first two sentences, or the first when two run long. */
const summary = (text) => {
  const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z`"“])/);
  const two = sentences.slice(0, 2).join(" ");
  return two.length <= 220 ? two : sentences[0];
};
/** The default the JSDoc states: "Default `md`." (house style), "Default 3.", or "`md` (default)". */
const defaultOf = (text) =>
  text.match(/Default:?\s*`([^`]+)`/)?.[1] ??
  // "Default 3." — a number or a word, without the sentence's full stop.
  text.match(/Default:?\s+(-?\d+(?:\.\d+)?|[A-Za-z][\w-]*)/)?.[1] ??
  // "`md` (default)" — the older phrasing some props still use.
  text.match(/`([^`]+)`[^`(]*\(default\)/)?.[1];

function argType(prop, at, category) {
  const description = docs(prop);
  const required = !(prop.flags & ts.SymbolFlags.Optional);
  const type = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, at));
  // The type as the declaration writes it (`ReactNode`, not its expansion), less `| undefined`.
  const written = prop.valueDeclaration?.type?.getText();
  const summary = (written ?? checker.typeToString(type, undefined, FORMAT))
    .replace(/\s*\|\s*undefined\b/g, "")
    .replace(/\s+/g, " ");
  const parts = type.isUnion() ? type.types : [type];
  const literals = parts.filter((t) => t.isStringLiteral()).map((t) => t.value);
  const isBoolean =
    parts.every((t) => t.flags & ts.TypeFlags.BooleanLiteral) || type.flags & ts.TypeFlags.Boolean;
  let sbType;
  let control;
  if (literals.length && literals.length === parts.length) {
    sbType = { name: "enum", value: literals };
    control = literals.length <= 4 ? "inline-radio" : "select";
  } else if (isBoolean) {
    sbType = { name: "boolean" };
    control = "boolean";
  } else if (type.flags & ts.TypeFlags.String) {
    sbType = { name: "string" };
    control = "text";
  } else if (type.flags & ts.TypeFlags.Number) {
    sbType = { name: "number" };
    control = "number";
  } else if (type.getCallSignatures().length) {
    sbType = { name: "function" };
    control = false;
  } else {
    sbType = { name: "other", value: summary };
    // ReactNode and friends take text from a control; anything else isn't editable there.
    control = parts.some((t) => t.flags & ts.TypeFlags.String) ? "text" : false;
  }
  const fallback = defaultOf(description);
  // An alias such as `ButtonVariant` says less than its values.
  const shown = sbType.name === "enum" ? literals.map((v) => `"${v}"`).join(" | ") : summary;
  return {
    name: prop.name,
    description,
    type: { ...sbType, required },
    table: {
      ...(category ? { category } : {}),
      type: { summary: shown },
      ...(fallback ? { defaultValue: { summary: fallback } } : {}),
    },
    control: control ? { type: control } : false,
    ...(sbType.name === "enum" ? { options: sbType.value } : {}),
  };
}

const out = {};
for (const entry of entries) {
  const module = checker.getSymbolAtLocation(program.getSourceFile(entry));
  for (const exported of checker.getExportsOfModule(module)) {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    const name = exported.name;
    if (!/^[A-Z]/.test(name) || !(symbol.flags & ts.SymbolFlags.Function)) continue;
    const decl = symbol.declarations?.[0];
    if (!decl) continue;
    const signature = checker.getTypeOfSymbolAtLocation(symbol, decl).getCallSignatures()[0];
    const param = signature?.getParameters()[0];
    const argTypes = {};
    if (param) {
      const props = checker.getTypeOfSymbolAtLocation(param, decl);
      for (const prop of checker.getPropertiesOfType(checker.getApparentType(props))) {
        const files = prop.getDeclarations()?.map((d) => d.getSourceFile().fileName) ?? [];
        // `render` is a documented feature of every part; the rest of the plumbing isn't news.
        if (PLUMBING.has(prop.name) && prop.name !== "render") continue;
        if (files.some((f) => f.startsWith(OWN))) argTypes[prop.name] = argType(prop, decl);
        else if (
          files.some((f) => f.includes("/@base-ui/react/") || f.startsWith(BASE_UI)) &&
          !PLUMBING.has(prop.name)
        )
          argTypes[prop.name] = argType(prop, decl, "Base UI");
      }
    }
    // Where it lives in the package: `button` or `experimental/date-picker`, for source links.
    const family = dirname(decl.getSourceFile().fileName.slice(OWN.length));
    out[name] = { description: summary(docs(symbol)), family, argTypes };
  }
}

const file = join(root, ".storybook/docgen.json");
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`);
console.log(`docgen: ${Object.keys(out).length} components → .storybook/docgen.json`);
