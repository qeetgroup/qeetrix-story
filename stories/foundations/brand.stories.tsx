import { QeetLogo, QeetWordmarkLogo } from "@qeetrix/icons";
import { BuildingComplexIcon } from "@qeetrix/icons/icons/building-complex";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { MonitorSmartphoneIcon } from "@qeetrix/icons/icons/monitor-smartphone";
import { PlugIcon } from "@qeetrix/icons/icons/plug";
import { RefreshCwIcon } from "@qeetrix/icons/icons/refresh-cw";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { StarIcon } from "@qeetrix/icons/icons/star";
import { UserGroupIcon } from "@qeetrix/icons/icons/user-group";
import { WebhookIcon } from "@qeetrix/icons/icons/webhook";
import {
  Badge,
  Button,
  Link,
  Switch,
  Text,
  TextField,
  Toggle,
  ToggleGroup,
  VisuallyHidden,
} from "@qeetrix/react";
import { CopyButton } from "@qeetrix/react/experimental";
import { type BrandTheme, brandTheme, TENANT_TOKENS, type TenantToken } from "@qeetrix/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useId, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { CopyToken, Group, Ramp, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import {
  contrast,
  type DtcgColor,
  hexOf,
  ramp,
  resolve,
  type Scheme,
  type Token,
  tokens,
} from "./_foundation";
import "./_brand.css";

const meta: Meta = {
  title: "Foundations/Brand",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The Qeet logo, the brand orange and the roles it feeds, a tenant's own colour through `brandTheme()`, and the identity icons.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const SCHEMES: Scheme[] = ["light", "dark"];
const schemeName = (scheme: Scheme) => (scheme === "light" ? "Light" : "Dark");

/** Custom properties as a style object; React sets each with setProperty. */
const asStyle = (vars: Record<string, string>) => vars as unknown as CSSProperties;

/* ── Logo ─────────────────────────────────────────────────────────────────── */

/** Clear space on every side: a quarter of the logo's height. */
const clearOf = (height: number) => asStyle({ "--qx-brand-clear": `${height / 4}px` });

function LogoTile({
  scheme,
  name,
  code,
  label,
  height,
  children,
}: {
  scheme: Scheme;
  name: string;
  /** The JSX to copy. */
  code: string;
  /** What the copy button shows. */
  label: string;
  height: number;
  children: ReactNode;
}) {
  return (
    <div className="qx-brand-logo">
      <div className="qx-brand-stage" data-qx-color-scheme={scheme}>
        <span className="qx-brand-clear" style={clearOf(height)}>
          {children}
        </span>
      </div>
      <div className="qx-brand-caption">
        <span className="qx-brand-caption-name">{name}</span>
        <CopyToken value={code} label={label} />
      </div>
    </div>
  );
}

const MARK = 80;
const WORDMARK = 36;

const WORDMARKS = [
  ["plain", "light", "Plain, on light"],
  ["plain-dark", "dark", "Plain, on dark"],
  ["default", "light", "Tile, on light"],
  ["dark", "dark", "Tile, on dark"],
] as const;

/** The logo at each size it may be drawn, the minimum first. */
function Ladder({ sizes, children }: { sizes: number[]; children: (height: number) => ReactNode }) {
  return (
    <div className="qx-brand-ladder">
      {sizes.map((size, index) => (
        <div key={size} className="qx-brand-rung" data-min={index === 0 ? "" : undefined}>
          {children(size)}
          <span className="qx-brand-rung-size">
            {size}px{index === 0 ? " · min" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

export const Logo: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "QeetLogo and QeetWordmarkLogo, from @qeetrix/icons. Pick the file drawn for the background.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Group label="Mark" aside="Hatched: clear space, a quarter of the logo's height">
        <div className="qx-brand-logos">
          <LogoTile
            scheme="light"
            name="On light"
            code="<QeetLogo />"
            label="<QeetLogo />"
            height={MARK}
          >
            <QeetLogo height={MARK} />
          </LogoTile>
          <LogoTile
            scheme="dark"
            name="On dark"
            code={'<QeetLogo variant="dark" />'}
            label={'variant="dark"'}
            height={MARK}
          >
            <QeetLogo variant="dark" height={MARK} />
          </LogoTile>
        </div>
      </Group>
      <Group label="Wordmark">
        <div className="qx-brand-logos" data-columns="4">
          {WORDMARKS.map(([variant, scheme, name]) => (
            <LogoTile
              key={variant}
              scheme={scheme}
              name={name}
              code={`<QeetWordmarkLogo variant="${variant}" />`}
              label={`variant="${variant}"`}
              height={WORDMARK}
            >
              <QeetWordmarkLogo variant={variant} height={WORDMARK} />
            </LogoTile>
          ))}
        </div>
      </Group>
      <Group label="Minimum size" aside="Below the wordmark's minimum, use the mark">
        <SpecimenRows>
          <SpecimenRow token="QeetLogo" meta="16px min · 24px default">
            <Ladder sizes={[16, 24, 32, 48]}>
              {(height) => (
                <>
                  <QeetLogo height={height} className="qx-brand-on-light" />
                  <QeetLogo variant="dark" height={height} className="qx-brand-on-dark" />
                </>
              )}
            </Ladder>
          </SpecimenRow>
          <SpecimenRow token="QeetWordmarkLogo" meta="20px min, plain">
            <Ladder sizes={[20, 24, 32, 48]}>
              {(height) => (
                <>
                  <QeetWordmarkLogo variant="plain" height={height} className="qx-brand-on-light" />
                  <QeetWordmarkLogo
                    variant="plain-dark"
                    height={height}
                    className="qx-brand-on-dark"
                  />
                </>
              )}
            </Ladder>
          </SpecimenRow>
        </SpecimenRows>
      </Group>
    </Specimen>
  ),
};

/* ── Colour maths: brandTheme() returns oklch(), the DTCG authors in it ───── */

/** A DTCG colour as CSS, in the space it is authored in. */
const cssOf = (color: DtcgColor) => {
  const [l, c, h] = color.components;
  const alpha = color.alpha ?? 1;
  return `oklch(${l} ${c} ${h}${alpha < 1 ? ` / ${alpha}` : ""})`;
};

const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/;

/** `oklch(l c h / a)` as sRGB channels from 0 to 1, linear or gamma-encoded, and its alpha. */
function channels(css: string, encoded = false): { rgb: number[]; alpha: number } {
  const match = OKLCH.exec(css);
  if (!match) return { rgb: [0, 0, 0], alpha: 1 };
  const [l, c, h] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  ].map((u) => Math.min(1, Math.max(0, u)));
  const encode = (u: number) => (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055);
  return {
    rgb: encoded ? linear.map(encode) : linear,
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

/** The WCAG 2.2 contrast ratio of two opaque `oklch()` colours. */
function ratio(a: string, b: string): number {
  const luminance = (css: string) => {
    const [r = 0, g = 0, bl = 0] = channels(css).rgb;
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [high = 1, low = 1] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** `#1a6fe0`, or `#1a6fe0 / 20%` for a translucent colour. */
function hexOfCss(css: string): string {
  const { rgb, alpha } = channels(css, true);
  const hex = `#${rgb
    .map((u) =>
      Math.round(u * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
  return alpha < 1 ? `${hex} / ${Math.round(alpha * 100)}%` : hex;
}

/** `#rgb` or `#rrggbb` as `#rrggbb`, or null. */
function sixDigit(input: string): string | null {
  const hex = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(hex)) return `#${[...hex].map((digit) => digit + digit).join("")}`;
  return /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : null;
}

/* ── Brand colour ─────────────────────────────────────────────────────────── */

const QEET = ramp("qeet");
const QEET_STEP = new Map(QEET.map(({ step, hex }) => [hex, `qeet.${step}`]));
/** qeet.500 is a primitive, not a CSS variable: painted from the DTCG hex, as reference. */
const QEET_ORANGE = QEET.find((step) => step.step === "500")?.hex ?? "";
const WHITE = hexOf("color.text.on-brand", "light");
const EMBER = hexOf("color.bg.brand.bold", "light");

/** The brand roles: exactly the tokens a tenant may override, in brandTheme()'s order. */
const COLOR = tokens("color");
const BRAND = TENANT_TOKENS.map((cssVar) => COLOR.find((token) => token.cssVar === cssVar)).filter(
  (token): token is Token => token !== undefined,
);

const BRAND_GROUPS: Array<{ label: string; match: RegExp }> = [
  { label: "Fills", match: /^bg\.brand\./ },
  { label: "Selection", match: /^(bg\.selected|selection)/ },
  { label: "Text", match: /^text\./ },
  { label: "Icons and edges", match: /^(icon|border)\./ },
];

const USE: Record<string, string> = {
  "bg.brand.bold": "The primary action: buttons, switches, checkboxes",
  "bg.brand.bold-hover": "Hover on the brand fill",
  "bg.brand.bold-pressed": "Pressed on the brand fill",
  "bg.brand.subtle": "Brand badges and a ghost button's hover",
  "bg.brand.subtle-hover": "Hover on the brand tint",
  "bg.brand.subtle-pressed": "Pressed on the brand tint",
  "bg.selected": "Selected rows and items",
  "bg.selected-hover": "Hover on a selected row",
  selection: "Selected text: the brand colour at 20%",
  "text.brand": "Brand-coloured text",
  "text.link": "Links",
  "text.link-hover": "Links on hover",
  "text.on-brand": "Labels on the brand fill",
  "icon.brand": "Brand icons",
  "icon.on-brand": "Icons on the brand fill",
  "border.brand": "Brand outlines",
  "border.focus": "The focus frame",
  "border.selected": "The edge of a selected item",
};

type Kind = "fill" | "text" | "icon" | "border" | "overlay";

const kindOf = (token: Token): Kind => {
  const group = token.name.split(".")[0];
  if (group === "text") return "text";
  if (group === "icon") return "icon";
  if (group === "border") return "border";
  if (group === "selection") return "overlay";
  return "fill";
};

/** One scheme's half of a preview: the role as it's used, painted with the colour given. */
function Half({
  kind,
  scheme,
  value,
  ground,
}: {
  kind: Kind;
  scheme: Scheme;
  value: string;
  /** What an on-colour sits on: the brand fill. */
  ground?: string;
}) {
  if (kind === "text" || kind === "icon")
    return (
      <span
        data-qx-color-scheme={scheme}
        className="qx-brand-tone-half"
        style={{ color: value, background: ground }}
      >
        {kind === "text" ? "Aa" : <StarIcon size={16} aria-hidden />}
      </span>
    );
  if (kind === "border")
    return (
      <span data-qx-color-scheme={scheme} className="qx-brand-tone-half">
        <i className="qx-brand-tone-edge" style={{ borderColor: value }} />
      </span>
    );
  return (
    <span
      data-qx-color-scheme={scheme}
      className="qx-brand-tone-half"
      // A translucent colour is drawn over its scheme's default surface, as in product.
      style={{
        background: `linear-gradient(${value}, ${value}), var(--qx-color-surface-default)`,
      }}
    />
  );
}

/** Light half, then dark half: a tenant's values when given, else the token's own variable. */
function Preview({ token, values }: { token: Token; values?: BrandTheme }) {
  const kind = kindOf(token);
  const onBrand = token.name.endsWith("on-brand");
  const paint = (scheme: Scheme, cssVar: string) =>
    values ? values[scheme][cssVar as TenantToken] : `var(${cssVar})`;
  return (
    <span className="qx-brand-tone" aria-hidden="true">
      {SCHEMES.map((scheme) => (
        <Half
          key={scheme}
          kind={kind}
          scheme={scheme}
          value={paint(scheme, token.cssVar)}
          ground={onBrand ? paint(scheme, "--qx-color-bg-brand-bold") : undefined}
        />
      ))}
    </span>
  );
}

/** A value's chip, pinned to its scheme: a translucent colour sits on that scheme's surface. */
function Chip({ css, scheme }: { css: string; scheme: Scheme }) {
  return (
    <i
      data-qx-color-scheme={scheme}
      style={{ background: `linear-gradient(${css}, ${css}), var(--qx-color-surface-default)` }}
    />
  );
}

/**
 * A Qeet value: its chip and the ramp step it takes, with the hex as its title (the ramp above
 * shows it); a value computed off the ramp shows its hex.
 */
function StepValue({ token, scheme }: { token: Token; scheme: Scheme }) {
  const { value, chain } = resolve(scheme, token.path);
  const color = value as DtcgColor;
  const alias = chain.at(-1);
  const alpha = color.alpha ?? 1;
  const step = alias?.startsWith("primitive.color.")
    ? alias.slice("primitive.color.".length)
    : QEET_STEP.get(color.hex);
  return (
    <span className="qx-brand-value" title={color.hex}>
      <Chip css={cssOf(color)} scheme={scheme} />
      {step ?? color.hex}
      {alpha < 1 ? ` / ${Math.round(alpha * 100)}%` : ""}
    </span>
  );
}

/** A computed value: its chip and hex; the exact `oklch()` is its title. */
function CssValue({ css, scheme }: { css: string; scheme: Scheme }) {
  return (
    <span className="qx-brand-value" title={css}>
      <Chip css={css} scheme={scheme} />
      {hexOfCss(css)}
    </span>
  );
}

/**
 * The brand roles as aligned rows: preview, name and token, what it's for, then its light and
 * dark values. With `values`, a tenant's colours instead of Qeet's, and no use column.
 */
function RoleList({ caption, values }: { caption: string; values?: BrandTheme }) {
  return (
    <div className="qx-brand-tokens-wrap">
      <table className="qx-brand-tokens">
        <caption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <VisuallyHidden>Preview</VisuallyHidden>
            </th>
            <th scope="col">Token</th>
            {!values && (
              <th scope="col" className="qx-brand-tokens-usage">
                Use it for
              </th>
            )}
            <th scope="col">Light</th>
            <th scope="col">Dark</th>
          </tr>
        </thead>
        {BRAND_GROUPS.map(({ label, match }) => (
          <tbody key={label}>
            <tr className="qx-brand-tokens-group">
              <th scope="colgroup" colSpan={values ? 4 : 5}>
                {label}
              </th>
            </tr>
            {BRAND.filter((token) => match.test(token.name)).map((token) => (
              <tr key={token.path}>
                <td>
                  <Preview token={token} values={values} />
                </td>
                <th scope="row">
                  <span className="qx-brand-tokens-token">
                    <span className="qx-brand-tokens-name">{token.name}</span>
                    <CopyToken value={token.cssVar} />
                  </span>
                </th>
                {!values && <td className="qx-brand-tokens-usage">{USE[token.name]}</td>}
                {SCHEMES.map((scheme) => (
                  <td key={scheme}>
                    {values ? (
                      <CssValue css={values[scheme][token.cssVar as TenantToken]} scheme={scheme} />
                    ) : (
                      <StepValue token={token} scheme={scheme} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function Orange({
  background,
  name,
  note,
  copy,
  label,
  verdict,
}: {
  background: string;
  name: string;
  note: string;
  copy: string;
  label: string;
  verdict: ReactNode;
}) {
  return (
    <figure className="qx-brand-hero">
      <div className="qx-brand-hero-tile" style={{ background }}>
        <span className="qx-brand-hero-aa" aria-hidden="true">
          Aa
        </span>
      </div>
      <figcaption className="qx-brand-hero-meta">
        <span className="qx-brand-hero-name">
          {name}
          {verdict}
        </span>
        <span className="qx-brand-hero-note">{note}</span>
        <CopyToken value={copy} label={label} />
      </figcaption>
    </figure>
  );
}

const onWhite = (hex: string) => `${contrast(WHITE, hex).toFixed(2)}:1`;

export const BrandColour: Story = {
  name: "Brand colour",
  parameters: {
    docs: {
      description: {
        story:
          "Qeet orange is the logo's colour; Ember, qeet.600, fills actions and feeds every brand role.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-brand-heroes">
        <Orange
          background={QEET_ORANGE}
          name="Qeet orange"
          note="The logo's colour. White on it is for large type and marks only."
          copy={QEET_ORANGE}
          label={`qeet.500 · ${QEET_ORANGE}`}
          verdict={
            <Badge tone="warning" size="sm">
              {onWhite(QEET_ORANGE)} large text
            </Badge>
          }
        />
        <Orange
          background="var(--qx-color-bg-brand-bold)"
          name="Ember"
          note="The action colour: buttons, switches, the selected item. Labels on it pass AA."
          copy="--qx-color-bg-brand-bold"
          label={`--qx-color-bg-brand-bold · qeet.600 · ${EMBER}`}
          verdict={
            <Badge tone="success" size="sm">
              {onWhite(EMBER)} AA
            </Badge>
          }
        />
      </div>
      <Group
        label="Qeet ramp"
        aside="primitive.color.qeet: in the DTCG files, never a CSS variable"
      >
        <Ramp name="qeet" steps={QEET} />
      </Group>
      <Group label="Brand roles" aside={`${BRAND.length} tokens, each on a step of the ramp`}>
        <RoleList caption="The brand roles and the qeet step each takes" />
      </Group>
    </Specimen>
  ),
};

/* ── Tenant theme ─────────────────────────────────────────────────────────── */

const DEFAULT_TENANT = "#1a73e8";

/** Brand colours a tenant might bring, covering each rule brandTheme() applies: domain data. */
const PRESETS = [
  { name: "Blue", hex: "#1a73e8" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Yellow", hex: "#facc15" },
];

/** Qeet's own brand values, shaped like brandTheme()'s: what an invalid colour leaves in place. */
const QEET_THEME = Object.fromEntries(
  SCHEMES.map((scheme) => [
    scheme,
    Object.fromEntries(BRAND.map((token) => [token.cssVar, cssOf(token[scheme] as DtcgColor)])),
  ]),
) as unknown as BrandTheme;

/** A surface from the DTCG, as CSS. */
const surface = (path: string, scheme: Scheme) => cssOf(resolve(scheme, path).value as DtcgColor);

interface Check {
  name: string;
  fg: TenantToken;
  /** A tenant token, or a surface's DTCG path. */
  bg: string;
  minimum: number;
  kind: "text" | "ring";
}

/** Pairs brandTheme() guarantees, each with its WCAG minimum (1.4.3 text, 1.4.11 the ring). */
const CHECKS: Check[] = [
  {
    name: "Label on fill",
    fg: "--qx-color-text-on-brand",
    bg: "--qx-color-bg-brand-bold",
    minimum: 4.5,
    kind: "text",
  },
  {
    name: "Label on hover",
    fg: "--qx-color-text-on-brand",
    bg: "--qx-color-bg-brand-bold-hover",
    minimum: 4.5,
    kind: "text",
  },
  {
    name: "Brand text on tint",
    fg: "--qx-color-text-brand",
    bg: "--qx-color-bg-brand-subtle",
    minimum: 4.5,
    kind: "text",
  },
  {
    name: "Link on surface",
    fg: "--qx-color-text-link",
    bg: "color.surface.default",
    minimum: 4.5,
    kind: "text",
  },
  {
    name: "Focus on canvas",
    fg: "--qx-color-border-focus",
    bg: "color.surface.canvas",
    minimum: 3,
    kind: "ring",
  },
  {
    name: "Focus on selected",
    fg: "--qx-color-border-focus",
    bg: "--qx-color-bg-selected",
    minimum: 3,
    kind: "ring",
  },
];

const shortName = (name: string) => name.replace(/^(--qx-color-|color\.)/, "").replaceAll(".", "-");

function ContrastCheck({ check, values }: { check: Check; values: BrandTheme }) {
  const pairs = SCHEMES.map((scheme) => {
    const fg = values[scheme][check.fg];
    const bg = check.bg.startsWith("--")
      ? values[scheme][check.bg as TenantToken]
      : surface(check.bg, scheme);
    return { scheme, fg, bg, value: ratio(fg, bg) };
  });
  return (
    <div className="qx-brand-check">
      <div className="qx-brand-check-tile" aria-hidden="true">
        {pairs.map(({ scheme, fg, bg, value }) => (
          <span
            key={scheme}
            data-qx-color-scheme={scheme}
            data-fail={value < check.minimum ? "" : undefined}
            className="qx-brand-check-half"
            style={check.kind === "text" ? { background: bg, color: fg } : { background: bg }}
          >
            {check.kind === "text" ? (
              <span className="qx-brand-check-aa">Aa</span>
            ) : (
              <i className="qx-brand-check-ring" style={{ outlineColor: fg }} />
            )}
            <span className="qx-brand-check-ratio">
              {value.toFixed(2)}
              {value < check.minimum ? " ✕" : ""}
            </span>
          </span>
        ))}
      </div>
      <div className="qx-brand-check-meta">
        <span className="qx-brand-check-head">
          <span className="qx-brand-check-name">{check.name}</span>
          <span className="qx-brand-check-min">min {check.minimum}:1</span>
        </span>
        <code className="qx-brand-check-pair">
          {shortName(check.fg)} on {shortName(check.bg)}
        </code>
        <VisuallyHidden>
          {pairs.map(({ scheme, value }) => `${scheme} ${value.toFixed(2)}:1`).join(", ")}
        </VisuallyHidden>
      </div>
    </div>
  );
}

/** What brandTheme() did with the colour, in one line. */
function verdict(input: string, theme: BrandTheme | null): string {
  if (!theme) return "Not a colour yet, so Qeet's own brand stays.";
  if (theme.light["--qx-color-text-on-brand"] !== "oklch(1 0 0)")
    return "A light colour: labels on it turn near-black, as white would fall below 4.5:1.";
  const fill = hexOfCss(theme.light["--qx-color-bg-brand-bold"]);
  const given = sixDigit(input) ?? fill;
  const channel = (hex: string, at: number) => Number.parseInt(hex.slice(at, at + 2), 16);
  const moved = [1, 3, 5].some((at) => Math.abs(channel(fill, at) - channel(given, at)) > 1);
  return moved
    ? `White labels, on ${fill}: the colour darkened until white reaches 4.5:1.`
    : "White labels, on the colour as given.";
}

function themeFor(hex: string): { theme: BrandTheme | null; error?: string } {
  try {
    return { theme: brandTheme(hex.trim()) };
  } catch {
    return { theme: null, error: "Enter a colour as #rgb or #rrggbb, e.g. #1a73e8." };
  }
}

const declarations = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");

/** The stylesheet an app would render after tokens.css, as the tokens README shows. */
const cssFor = (theme: BrandTheme) =>
  `:root,\n[data-qx-color-scheme="light"] {\n${declarations(theme.light)}\n}\n\n[data-qx-color-scheme="dark"] {\n${declarations(theme.dark)}\n}\n`;

/** A hosted sign-in in one scheme, with the tenant's variables on its root. */
function TenantPane({ scheme, theme }: { scheme: Scheme; theme: BrandTheme | null }) {
  return (
    <div
      data-qx-color-scheme={scheme}
      data-testid={`tenant-${scheme}`}
      style={theme ? asStyle(theme[scheme]) : undefined}
      className="qx-brand-pane"
    >
      <div className="qx-brand-pane-head">
        <span className="qx-brand-monogram" aria-hidden="true">
          A
        </span>
        <span className="qx-brand-pane-org">Acme Pvt Ltd</span>
        <span className="qx-brand-pane-scheme">{schemeName(scheme)}</span>
      </div>
      <span className="qx-brand-pane-title">
        <Text size="lg" weight="semibold">
          Sign in
        </Text>
        <Badge tone="brand">SSO</Badge>
      </span>
      <Switch label="Remember this device" defaultChecked />
      <Button fullWidth>Continue with a passkey</Button>
      <Link href="#recovery" onClick={(event) => event.preventDefault()}>
        Use a recovery code
      </Link>
    </div>
  );
}

function TenantThemeSpecimen() {
  const [hex, setHex] = useState(DEFAULT_TENANT);
  const [picked, setPicked] = useState(DEFAULT_TENANT);
  const { theme, error } = themeFor(hex);
  const values = theme ?? QEET_THEME;
  const update = (next: string) => {
    setHex(next);
    const valid = sixDigit(next);
    if (valid) setPicked(valid);
  };
  const preset = PRESETS.find((item) => item.hex === sixDigit(hex));
  const presetsLabel = useId();
  return (
    <Specimen>
      <div className="qx-brand-controls">
        <TextField
          className="qx-brand-field"
          label="Tenant colour"
          value={hex}
          onValueChange={(value) => update(value)}
          invalid={Boolean(error)}
          error={error}
          spellCheck={false}
          startAdornment={
            <input
              type="color"
              className="qx-brand-picker"
              value={picked}
              aria-label="Pick a colour"
              onChange={(event) => update(event.target.value)}
            />
          }
        />
        <div className="qx-brand-presets">
          <span id={presetsLabel} className="qx-brand-presets-label">
            Presets
          </span>
          <div className="qx-brand-presets-row">
            <ToggleGroup
              aria-labelledby={presetsLabel}
              variant="separate"
              size="sm"
              value={preset ? [preset.hex] : []}
              onValueChange={(next) => {
                if (next[0]) update(next[0]);
              }}
            >
              {PRESETS.map((item) => (
                <Toggle key={item.hex} value={item.hex}>
                  {/* A tenant's colour, shown as it is: the dot is the data. */}
                  <span
                    className="qx-brand-dot"
                    style={{ background: item.hex }}
                    aria-hidden="true"
                  />
                  {item.name}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>
      <Group label="Preview" aside={verdict(hex, theme)}>
        <div className="qx-brand-panes">
          {SCHEMES.map((scheme) => (
            <TenantPane key={scheme} scheme={scheme} theme={theme} />
          ))}
        </div>
      </Group>
      <Group label="Contrast it guarantees" aside="WCAG 2.2, computed from the values below">
        <div className="qx-brand-checks">
          {CHECKS.map((check) => (
            <ContrastCheck key={check.name} check={check} values={values} />
          ))}
        </div>
      </Group>
      <Group
        label={`The ${TENANT_TOKENS.length} tokens it returns`}
        aside={
          <CopyButton value={theme ? cssFor(theme) : ""} disabled={!theme} size="sm" variant="soft">
            Copy CSS
          </CopyButton>
        }
      >
        <RoleList
          caption="The tenant tokens brandTheme() returned, light and dark"
          values={values}
        />
      </Group>
    </Specimen>
  );
}

export const TenantTheme: Story = {
  name: "Tenant theme",
  parameters: {
    docs: {
      description: {
        story:
          "brandTheme(hex) turns one colour into the 18 brand tokens for light and dark, each pair AA.",
      },
    },
  },
  render: () => <TenantThemeSpecimen />,
};

/* ── Identity icons ───────────────────────────────────────────────────────── */

const ICONS = [
  [FingerprintPatternIcon, "fingerprint-pattern", "FingerprintPatternIcon", "Passkey"],
  [ShieldCheckIcon, "shield-check", "ShieldCheckIcon", "MFA"],
  [PlugIcon, "plug", "PlugIcon", "SAML / OIDC"],
  [RefreshCwIcon, "refresh-cw", "RefreshCwIcon", "SCIM sync"],
  [UserGroupIcon, "user-group", "UserGroupIcon", "Directory"],
  [BuildingComplexIcon, "building-complex", "BuildingComplexIcon", "Tenant"],
  [KeyRoundIcon, "key-round", "KeyRoundIcon", "API key"],
  [WebhookIcon, "webhook", "WebhookIcon", "Webhook"],
  [ScrollTextIcon, "scroll-text", "ScrollTextIcon", "Audit log"],
  [MonitorSmartphoneIcon, "monitor-smartphone", "MonitorSmartphoneIcon", "Cross-device"],
] as const;

export const IdentityIcons: Story = {
  name: "Identity icons",
  parameters: {
    docs: {
      description: {
        story: "One icon per Qeet ID concept, in the sharp shape. Click a name to copy its import.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-brand-icons">
        {ICONS.map(([Icon, file, component, concept]) => (
          <div key={file} className="qx-brand-icon">
            <span className="qx-brand-icon-well">
              <Icon shape="sharp" size={24} aria-hidden />
            </span>
            <span className="qx-brand-icon-name">{concept}</span>
            <CopyToken
              value={`import { ${component} } from "@qeetrix/icons/icons/${file}";`}
              label={file}
            />
          </div>
        ))}
      </div>
    </Specimen>
  ),
};

/* ── Hidden tests ─────────────────────────────────────────────────────────── */

export const InteractionTenantTheme: Story = {
  name: "Interaction: re-theme and reject bad input",
  tags: ["!dev", "!autodocs"],
  render: () => <TenantThemeSpecimen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: /Tenant colour/ });
    const light = canvas.getByTestId("tenant-light");
    const brandFill = () => light.style.getPropertyValue("--qx-color-bg-brand-bold");

    await expect(brandFill()).toBe(brandTheme(DEFAULT_TENANT).light["--qx-color-bg-brand-bold"]);

    await userEvent.clear(field);
    await userEvent.type(field, "#0f9d58");
    await expect(brandFill()).toBe(brandTheme("#0f9d58").light["--qx-color-bg-brand-bold"]);

    await userEvent.clear(field);
    await userEvent.type(field, "green");
    await expect(canvas.getByText(/Enter a colour as #rgb or #rrggbb/)).toBeVisible();
    await expect(brandFill()).toBe("");
  },
};

/** The tokens the DTCG marks tenant-overridable are exactly the ones brandTheme() returns. */
export const InteractionTenantTokens: Story = {
  name: "Interaction: tenant tokens match",
  tags: ["!dev", "!autodocs"],
  render: () => <Text size="sm">{TENANT_TOKENS.length} tenant tokens</Text>,
  play: async () => {
    const flagged = tokens("color")
      .filter((item) => item.tenant)
      .map((item) => item.cssVar);
    await expect([...flagged].sort()).toEqual([...TENANT_TOKENS].sort());
    await expect(Object.keys(brandTheme(DEFAULT_TENANT).light).sort()).toEqual(
      [...TENANT_TOKENS].sort(),
    );
  },
};
