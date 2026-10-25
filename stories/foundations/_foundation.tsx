/**
 * Shared building blocks for the Foundations pages: the token data, read from @qeetrix/tokens, and
 * the table pieces the pages are built from (styled in `../_specimens.css`).
 *
 * Every specimen list on these pages is generated from the package's own DTCG documents, so a page
 * cannot drift from what ships: add a token to @qeetrix/tokens and it appears here; rename one and
 * the page follows. `dtcg/light.tokens.json` and `dtcg/dark.tokens.json` are the resolved documents
 * (every token for one colour scheme at default density, references kept), and the density mode
 * files say what each density changes. Swatches still paint from the live CSS variables, so what
 * you see is the stylesheet; the DTCG supplies names and the numbers in the labels.
 *
 * Underscore-prefixed, so Storybook's `*.stories.@(ts|tsx)` glob never picks it up as a story.
 */

import dark from "@qeetrix/tokens/dtcg/dark.tokens.json";
import light from "@qeetrix/tokens/dtcg/light.tokens.json";
import comfortable from "@qeetrix/tokens/dtcg/tokens/modes/density/comfortable.tokens.json";
import compact from "@qeetrix/tokens/dtcg/tokens/modes/density/compact.tokens.json";
import densityDefault from "@qeetrix/tokens/dtcg/tokens/modes/density/default.tokens.json";
import type { ReactNode } from "react";

/* ── DTCG ─────────────────────────────────────────────────────────────────── */

/** A DTCG group or token: `$`-keys are metadata, every other key is a child. */
interface DtcgNode {
  $type?: string;
  $value?: unknown;
  $description?: string;
  $extensions?: Record<string, Record<string, unknown>>;
  [child: string]: unknown;
}

const LIGHT = light as unknown as DtcgNode;
const DARK = dark as unknown as DtcgNode;

export type Scheme = "light" | "dark";
export type Density = "compact" | "default" | "comfortable";

const DOCS: Record<Scheme, DtcgNode> = { light: LIGHT, dark: DARK };

export interface DtcgColor {
  colorSpace: string;
  components: [number, number, number];
  hex: string;
  alpha?: number;
}

export interface DtcgDimension {
  value: number;
  unit: "px" | "rem";
}

export interface DtcgShadowLayer {
  color: DtcgColor;
  offsetX: DtcgDimension;
  offsetY: DtcgDimension;
  blur: DtcgDimension;
  spread: DtcgDimension;
  inset?: boolean;
}

export interface DtcgTypography {
  fontFamily: string[];
  fontSize: DtcgDimension;
  fontWeight: number;
  letterSpacing: DtcgDimension;
  lineHeight: number;
}

/** One token, resolved in both colour schemes. */
export interface Token {
  /** The DTCG path: `color.text.default`. */
  path: string;
  /** The path after the group it was listed under: `default` for `tokens("color.text")`. */
  name: string;
  /** The CSS variable: `--qx-color-text-default`. */
  cssVar: string;
  type: string;
  light: unknown;
  dark: unknown;
  /** Marked `tenantOverridable`: one of the tokens `brandTheme()` may change. */
  tenant: boolean;
}

const isGroupKey = (key: string) => !key.startsWith("$");

function at(doc: DtcgNode, path: string): DtcgNode | undefined {
  let node: unknown = doc;
  for (const key of path.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[key];
  }
  return node as DtcgNode | undefined;
}

const isReference = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("{") && value.endsWith("}");

/** Follows `{path}` references to a value; `chain` holds every alias on the way. */
export function resolve(scheme: Scheme, path: string): { value: unknown; chain: string[] } {
  const doc = DOCS[scheme];
  const chain: string[] = [];
  let node = at(doc, path);
  while (node && isReference(node.$value) && chain.length < 8) {
    const next = node.$value.slice(1, -1);
    chain.push(next);
    node = at(doc, next);
  }
  return { value: node?.$value, chain };
}

/** Every leaf token under a node, with the `$type` it inherits. */
function leaves(
  node: DtcgNode,
  path: string[],
  type?: string,
): Array<{ path: string; type: string }> {
  const ownType = node.$type ?? type ?? "";
  if ("$value" in node) return [{ path: path.join("."), type: ownType }];
  return Object.entries(node)
    .filter(([key, child]) => isGroupKey(key) && typeof child === "object" && child !== null)
    .flatMap(([key, child]) => leaves(child as DtcgNode, [...path, key], ownType));
}

export const cssVarOf = (path: string) => `--qx-${path.split(".").join("-")}`;

/**
 * The tokens under a group, in the order the package declares them, resolved for light and dark.
 * `tokens("color.text")` lists `--qx-color-text-*`.
 */
export function tokens(group: string): Token[] {
  const node = at(LIGHT, group);
  if (!node) return [];
  return leaves(node, group.split(".")).map(({ path, type }) => {
    const extension = at(LIGHT, path)?.$extensions?.["in.qeet.qeetrix"];
    return {
      path,
      name: path.slice(group.length + 1) || path.split(".").pop() || path,
      cssVar: cssVarOf(path),
      type,
      light: resolve("light", path).value,
      dark: resolve("dark", path).value,
      tenant: extension?.tenantOverridable === true,
    };
  });
}

/**
 * Tokens in a reading order: the names in `order` first, in that order, then any others in the
 * package's order, so a token added later still shows up.
 */
export function ordered(items: Token[], order: string[]): Token[] {
  const rank = (item: Token) => {
    const index = order.indexOf(item.name);
    return index === -1 ? order.length : index;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

/** One token by path. */
export function token(path: string): Token {
  const found = tokens(path.split(".").slice(0, -1).join(".")).find((t) => t.path === path);
  if (!found) throw new Error(`@qeetrix/tokens has no ${path}`);
  return found;
}

/** Every token in the resolved light document, primitives included, as `{ path, type }`. */
export function allTokens(): Array<{ path: string; type: string }> {
  return leaves(LIGHT, []);
}

/** A primitive ramp's steps with their hex: `ramp("qeet")`. Primitives are DTCG-only. */
export function ramp(name: string): Array<{ step: string; hex: string }> {
  const node = at(LIGHT, `primitive.color.${name}`);
  if (!node) return [];
  return Object.entries(node)
    .filter(([key]) => isGroupKey(key))
    .map(([step, child]) => ({ step, hex: ((child as DtcgNode).$value as DtcgColor).hex }))
    .sort((a, b) => Number(a.step) - Number(b.step));
}

/* ── Density ──────────────────────────────────────────────────────────────── */

const DENSITY_DOCS: Record<Density, DtcgNode> = {
  compact: compact as unknown as DtcgNode,
  default: densityDefault as unknown as DtcgNode,
  comfortable: comfortable as unknown as DtcgNode,
};

export const DENSITIES: Density[] = ["compact", "default", "comfortable"];

/** What each density sets: the paths in the density mode files, with each mode's value. */
export function densityTokens(): Array<{
  path: string;
  cssVar: string;
  values: Record<Density, string>;
}> {
  const paths = leaves(DENSITY_DOCS.default, []).map((leaf) => leaf.path);
  return paths.map((path) => {
    const values = {} as Record<Density, string>;
    for (const density of DENSITIES) {
      let value = at(DENSITY_DOCS[density], path)?.$value;
      // A mode value may alias a primitive, which lives in the foundation set.
      let hops = 0;
      while (isReference(value) && hops++ < 8) value = at(LIGHT, value.slice(1, -1))?.$value;
      values[density] = formatDimension(value as DtcgDimension);
    }
    return { path, cssVar: cssVarOf(path), values };
  });
}

/* ── Formatting ───────────────────────────────────────────────────────────── */

const ROOT_FONT_SIZE = 16;

const toPx = (dimension: DtcgDimension) =>
  dimension.unit === "rem" ? dimension.value * ROOT_FONT_SIZE : dimension.value;

/** `1rem (16px)`, or `2px`. */
function formatDimension(dimension: DtcgDimension | undefined): string {
  if (!dimension || typeof dimension !== "object") return "—";
  if (dimension.unit === "rem") return `${dimension.value}rem (${toPx(dimension)}px)`;
  return `${dimension.value}${dimension.unit}`;
}

/** `#d04800`, or `#040404 / 6%` for a translucent colour. */
function formatColor(color: DtcgColor | undefined): string {
  if (!color?.hex) return "—";
  const alpha = color.alpha ?? 1;
  return alpha < 1 ? `${color.hex} / ${Math.round(alpha * 100)}%` : color.hex;
}

const formatCurve = (points: number[]) =>
  points.join(",") === "0,0,1,1" ? "linear" : `cubic-bezier(${points.join(", ")})`;

const formatLayer = (layer: DtcgShadowLayer) =>
  [
    layer.inset ? "inset" : "",
    `${toPx(layer.offsetX)}px ${toPx(layer.offsetY)}px ${toPx(layer.blur)}px ${toPx(layer.spread)}px`,
    formatColor(layer.color),
  ]
    .filter(Boolean)
    .join(" ");

/** Font size / line height in px, the way the type scale is talked about: `56/64`. */
export function formatType(value: DtcgTypography): string {
  const size = toPx(value.fontSize);
  return `${size}/${Math.round(size * value.lineHeight)}`;
}

/** Any resolved value, as one readable string. */
export function format(type: string, value: unknown): string {
  if (value === undefined || value === null) return "—";
  switch (type) {
    case "color":
      return formatColor(value as DtcgColor);
    case "dimension":
      return formatDimension(value as DtcgDimension);
    case "duration": {
      const duration = value as { value: number; unit: string };
      return `${duration.value}${duration.unit}`;
    }
    case "cubicBezier":
      return formatCurve(value as number[]);
    case "fontFamily":
      return (value as string[]).join(", ");
    case "typography": {
      const typography = value as DtcgTypography;
      return `${typography.fontWeight} · ${formatType(typography)}`;
    }
    case "shadow":
      return (value as DtcgShadowLayer[]).map(formatLayer).join(", ");
    default:
      return String(value);
  }
}

/* ── Contrast ─────────────────────────────────────────────────────────────── */

function luminance(hex: string): number {
  const digits = hex.replace("#", "");
  const channel = (index: number) => {
    const value = Number.parseInt(digits.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** The WCAG 2.2 contrast ratio between two opaque hex colours. */
export function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** A token's hex in one scheme. */
export const hexOf = (path: string, scheme: Scheme) =>
  (resolve(scheme, path).value as DtcgColor | undefined)?.hex ?? "#000000";

/* ── Tables ───────────────────────────────────────────────────────────────── */

export interface TokenRow {
  /** The token: the row header, small and monospace. */
  token: string;
  /** One cell per column after the first. */
  cells: ReactNode[];
}

/**
 * A token family as a compact table: the row header is the token, the other columns its values.
 * The caption names the table for assistive technology only; the story's title says it on screen.
 */
export function TokenTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: TokenRow[];
}) {
  return (
    <div className="qx-ftable-wrap">
      <table className="qx-ftable">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.token}>
              <th scope="row">{row.token}</th>
              {row.cells.map((cell, index) => (
                <td key={`${row.token}:${columns[index + 1] ?? index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A colour value in a table: a small chip and the hex. The chip paints the DTCG hex rather than
 * the CSS variable, so the light and dark columns each show their own scheme's value.
 */
export function ColorValue({ color }: { color: unknown }) {
  const value = color as DtcgColor | undefined;
  return (
    <span className="qx-color-value">
      <span aria-hidden="true" style={{ background: value?.hex, opacity: value?.alpha ?? 1 }} />
      {formatColor(value)}
    </span>
  );
}
