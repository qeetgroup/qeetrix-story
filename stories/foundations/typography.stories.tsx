import { Slider } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useState } from "react";
import { expect } from "storybook/test";

import { CopyToken, Group, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import {
  type DtcgTypography,
  format,
  formatType,
  ordered,
  type Token,
  tokens,
} from "./_foundation";
import "./_typography.css";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Qeet Sans for interface text, Noto Sans for Indic scripts, Fira Code for code. Each role sets its letter style on Qeet Sans's `GEOM` axis.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/** Custom properties for `_typography.css`: React's CSSProperties doesn't type them. */
const vars = (values: Record<string, string>) => values as CSSProperties;

/* ── Families ─────────────────────────────────────────────────────────────── */

/**
 * What the tokens can't say about each face, keyed by the first name in its stack. The axes are
 * the font files' own; Noto Sans isn't bundled, so its files are the app's or the system's.
 */
const FACES: Record<
  string,
  { glyph: string; use: string; sample: string; files: string; lang?: string }
> = {
  "Qeet Sans": {
    glyph: "Aa",
    use: "Interface text and headings",
    sample: "Priya Sharma signed in from Pune and paid ₹4,250",
    files: "Bundled · weight 400–700 · GEOM 0–100",
  },
  "Noto Sans": {
    glyph: "अआ",
    use: "Hindi and six more Indic scripts",
    sample: "पासकी से साइन इन करें",
    files: "Not bundled · the app or the system supplies it",
    lang: "hi",
  },
  "Fira Code": {
    glyph: "Aa",
    use: "Code, keys and identifiers",
    sample: "qid_live_8f2a · 0O 1lI",
    files: "Bundled · weight 300–700",
  },
};

/** The family tokens, one entry per stack: `sans` and `heading` share Qeet Sans's. */
const FAMILIES = Object.values(
  ordered(tokens("font.family"), ["sans", "heading", "indic", "mono"]).reduce<
    Record<string, { stack: string[]; items: Token[] }>
  >((byStack, item) => {
    const key = format(item.type, item.light);
    byStack[key] ??= { stack: item.light as string[], items: [] };
    byStack[key].items.push(item);
    return byStack;
  }, {}),
);

export const Families: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three faces, one per job. Each token names a full stack, so text shows while fonts load.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-typo-families">
        {FAMILIES.map(({ stack, items }) => {
          const name = stack[0] ?? "";
          const face = FACES[name];
          const family = vars({ "--qx-typo-family": `var(${items[0]?.cssVar})` });
          return (
            <article key={name} className="qx-typo-family" aria-label={name}>
              <div className="qx-typo-family-glyph" lang={face?.lang} style={family} aria-hidden>
                <span>{face?.glyph ?? "Aa"}</span>
              </div>
              <div className="qx-typo-family-head">
                <span className="qx-typo-family-name">{name}</span>
                {face && <span className="qx-typo-family-use">{face.use}</span>}
              </div>
              <p className="qx-typo-family-sample" lang={face?.lang} style={family}>
                {face?.sample ?? name}
              </p>
              <div className="qx-typo-family-foot">
                <div className="qx-chip-row">
                  {items.map((item) => (
                    <CopyToken key={item.path} value={item.cssVar} />
                  ))}
                </div>
                <code className="qx-typo-family-stack">{stack.join(", ")}</code>
                {face && <span className="qx-typo-family-files">{face.files}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </Specimen>
  ),
};

/* ── Geometry ─────────────────────────────────────────────────────────────── */

/** Each stop's name on the axis (the primitives' `base` and `geo`) and the roles that use it. */
const STOP: Record<string, { name: string; roles: string }> = {
  body: { name: "A11y", roles: "Body, label, code" },
  heading: { name: "Base", roles: "Heading, title" },
  display: { name: "Geo", roles: "Display" },
};

/** The geometry tokens along the axis, lowest first. */
const STOPS = tokens("font.geometry")
  .map((item) => ({ ...item, value: Number(item.light) }))
  .sort((a, b) => a.value - b.value);

const GEOMETRY_SAMPLE = "Ilya signed in to Qeet with a passkey";

function GeometrySpecimen() {
  const [geom, setGeom] = useState(STOPS.find((stop) => stop.name === "heading")?.value ?? 50);
  return (
    <Specimen>
      <div className="qx-typo-geom-stage">
        <p className="qx-typo-geom-sample" style={vars({ "--qx-typo-geom": String(geom) })}>
          {GEOMETRY_SAMPLE}
        </p>
      </div>
      <div className="qx-typo-geom-control">
        <Slider
          label="GEOM"
          showValue
          min={0}
          max={100}
          value={geom}
          onValueChange={(value) => setGeom(value as number)}
        />
        <div className="qx-typo-geom-stops">
          {STOPS.map((stop, index) => (
            <div
              key={stop.path}
              className="qx-typo-geom-stop"
              data-align={index === 0 ? "start" : index === STOPS.length - 1 ? "end" : "center"}
              data-active={stop.value === geom ? "" : undefined}
            >
              <span className="qx-typo-geom-stop-name">
                {STOP[stop.name]?.name ?? stop.name} · {stop.value}
              </span>
              <CopyToken value={stop.cssVar} />
              <span className="qx-typo-geom-stop-roles">{STOP[stop.name]?.roles}</span>
            </div>
          ))}
        </div>
      </div>
    </Specimen>
  );
}

export const Geometry: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "GEOM moves Qeet Sans from its most legible letters (0) to geometric ones (100). Drag to compare.",
      },
    },
  },
  render: () => <GeometrySpecimen />,
};

/* ── Type scale ───────────────────────────────────────────────────────────── */

/** The geometry token a role uses. The `font` shorthand can't carry it. */
function geometryOf(role: string): "display" | "heading" | "body" {
  if (role.startsWith("display")) return "display";
  if (role.startsWith("heading") || role.startsWith("title")) return "heading";
  return "body";
}

const SAMPLE: Record<string, string> = {
  display: "Welcome to Qeet ID",
  heading: "Users and groups",
  title: "Security keys",
  body: "Priya Sharma signed in with a passkey from Pune. Her session ends in 12 hours.",
  label: "Invite users",
  code: "qid_live_8f2a",
};

/** Largest first, so the page reads like a specimen sheet; a role added later still shows. */
const ROLE_ORDER = ["display", "heading", "title", "body", "label", "code"];
const SIZE_ORDER = ["lg", "md", "sm", "caps"];

const rank = (order: string[], key: string) =>
  order.includes(key) ? order.indexOf(key) : order.length;

const GROUPS = Object.entries(
  tokens("typography").reduce<Record<string, Token[]>>((byRole, item) => {
    const role = item.name.split(".")[0] ?? item.name;
    byRole[role] ??= [];
    byRole[role].push(item);
    return byRole;
  }, {}),
)
  .sort(([a], [b]) => rank(ROLE_ORDER, a) - rank(ROLE_ORDER, b))
  .map(([role, items]) => ({
    role,
    items: [...items].sort(
      (a, b) =>
        rank(SIZE_ORDER, a.name.split(".")[1] ?? "") - rank(SIZE_ORDER, b.name.split(".")[1] ?? ""),
    ),
  }));

const GEOMETRY = Object.fromEntries(STOPS.map((stop) => [stop.name, stop.value]));

/** "56/64 · 600", with the tracking where a role has any. */
function metaOf(value: DtcgTypography): string {
  const tracking = value.letterSpacing.value;
  return [
    formatType(value),
    String(value.fontWeight),
    tracking ? `+${tracking}${value.letterSpacing.unit}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

/** The group's face, and its GEOM where the face has the axis. */
function asideOf(role: string, items: Token[]): string {
  const face = (items[0]?.light as DtcgTypography | undefined)?.fontFamily[0] ?? "";
  return face === "Qeet Sans" ? `${face} · GEOM ${GEOMETRY[geometryOf(role)]}` : face;
}

const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const TypeScale: Story = {
  name: "Type scale",
  parameters: {
    docs: {
      description: {
        story:
          "Every role with its size, line height and weight. Each line height sits on the 4px grid.",
      },
    },
  },
  render: () => (
    <Specimen>
      {GROUPS.map(({ role, items }) => (
        <Group key={role} label={sentenceCase(role)} aside={asideOf(role, items)}>
          <SpecimenRows>
            {items.map((item) => (
              <SpecimenRow
                key={item.path}
                token={item.cssVar}
                meta={metaOf(item.light as DtcgTypography)}
              >
                <span
                  className="qx-typo-sample"
                  data-caps={item.name === "label.caps" ? "" : undefined}
                  style={vars({
                    "--qx-typo-role": `var(${item.cssVar})`,
                    "--qx-typo-tracking": `var(${item.cssVar}-letter-spacing)`,
                    "--qx-typo-geom": `var(--qx-font-geometry-${geometryOf(item.name)})`,
                  })}
                >
                  {item.name === "label.caps" ? "Directory" : (SAMPLE[role] ?? item.name)}
                </span>
              </SpecimenRow>
            ))}
          </SpecimenRows>
        </Group>
      ))}
    </Specimen>
  ),
};

/* ── Hidden test: the slider drives the axis ──────────────────────────────── */

export const InteractionGeometrySlider: Story = {
  name: "Interaction: the slider sets GEOM",
  tags: ["!dev", "!autodocs"],
  render: () => <GeometrySpecimen />,
  play: async ({ canvas, userEvent }) => {
    const sample = canvas.getByText(GEOMETRY_SAMPLE);
    const thumb = canvas.getByRole("slider", { name: "GEOM" });
    await expect(thumb).toHaveAttribute("aria-valuenow", "50");
    await userEvent.tab();
    await expect(thumb).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "100");
    await expect(getComputedStyle(sample).fontVariationSettings).toBe('"GEOM" 100');
  },
};
