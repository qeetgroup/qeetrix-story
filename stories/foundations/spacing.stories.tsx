import { LayoutGridIcon } from "@qeetrix/icons/icons/layout-grid";
import { ListIcon } from "@qeetrix/icons/icons/list";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { XIcon } from "@qeetrix/icons/icons/x";
import {
  Button,
  type ControlSize,
  Field,
  Fieldset,
  IconButton,
  Input,
  Select,
  Table,
  TextField,
  Toggle,
  ToggleGroup,
} from "@qeetrix/react";
import { BREAKPOINT, COMPONENT } from "@qeetrix/tokens";
import light from "@qeetrix/tokens/dtcg/light.tokens.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSyncExternalStore } from "react";

import { CopyToken, Group, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import {
  DENSITIES,
  type Density as DensityMode,
  type DtcgDimension,
  densityTokens,
  ordered,
  type Token,
  TokenTable,
  tokens,
} from "./_foundation";
import "./_spacing.css";

const meta: Meta = {
  title: "Foundations/Spacing",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Space on a 4px grid, near-square corners, control heights, three densities, the window size classes and fixed component widths.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/** Smallest first. */
const STEPS = ["xs", "sm", "md", "lg", "xl"];

/* ── Values ───────────────────────────────────────────────────────────────── */

const ROOT_FONT_SIZE = 16;

/** `1rem · 16px`, or `12px`. */
function dimension(value: unknown): string {
  const size = value as DtcgDimension | undefined;
  if (!size || typeof size !== "object") return "—";
  return size.unit === "rem"
    ? `${size.value}rem · ${size.value * ROOT_FONT_SIZE}px`
    : `${size.value}${size.unit}`;
}

/** What each density sets, keyed by CSS variable. */
const BY_DENSITY = new Map(densityTokens().map((item) => [item.cssVar, item.values]));

/** `1rem (16px)` from the density table, in this page's `1rem · 16px` form. */
const dense = (text: string) => text.replace(/ \((.+)\)$/, " · $1");

/** A token's value at a density: the density's own where it sets one, else the shared value. */
function valueAt(item: Token, density: DensityMode): string {
  const values = BY_DENSITY.get(item.cssVar);
  return values ? dense(values[density]) : dimension(item.light);
}

const isDensity = (value: string | null): value is DensityMode =>
  DENSITIES.includes(value as DensityMode);

/** The Density toolbar's value: it sets `data-qx-density` on the root element. */
function useDensity(): DensityMode {
  return useSyncExternalStore(
    (notify) => {
      const observer = new MutationObserver(notify);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-qx-density"],
      });
      return () => observer.disconnect();
    },
    () => {
      const value = document.documentElement.getAttribute("data-qx-density");
      return isDensity(value) ? value : "default";
    },
    () => "default",
  );
}

/** A bar exactly as long as the token, drawn in cells (4px by default) so the grid shows. */
function Bar({ cssVar, cell }: { cssVar: string; cell?: "rem" }) {
  return (
    <span
      aria-hidden="true"
      className="qx-spacing-bar"
      data-cell={cell}
      style={{ inlineSize: `var(${cssVar})` }}
    />
  );
}

/** A dimension line exactly as tall as the token, set beside the controls it measures. */
function Gauge({ cssVar }: { cssVar: string }) {
  return (
    <span aria-hidden="true" className="qx-spacing-gauge" style={{ blockSize: `var(${cssVar})` }} />
  );
}

/* ── Space ────────────────────────────────────────────────────────────────── */

const SPACE_GROUPS = [
  { group: "inset", note: "Padding inside a container" },
  { group: "gap", note: "Between siblings in a stack or row" },
  { group: "layout", note: "Between page regions" },
  { group: "form", note: "Between form fields, by density" },
];

function SpaceSpecimen() {
  const density = useDensity();
  return (
    <Specimen>
      <div className="qx-spacing-columns">
        {SPACE_GROUPS.map(({ group, note }) => (
          <Group key={group} label={group} aside={note}>
            <SpecimenRows>
              {ordered(tokens(`space.${group}`), STEPS).map((item) => (
                <SpecimenRow key={item.path} token={item.cssVar} meta={valueAt(item, density)}>
                  <Bar cssVar={item.cssVar} />
                </SpecimenRow>
              ))}
            </SpecimenRows>
          </Group>
        ))}
      </div>
    </Specimen>
  );
}

export const Space: Story = {
  parameters: {
    docs: {
      description: {
        story: "Every padding and gap is a step on the 4px grid; each cell of a bar is 4px.",
      },
    },
  },
  render: () => <SpaceSpecimen />,
};

/* ── Radius ───────────────────────────────────────────────────────────────── */

const RADII = ["none", "sm", "tooltip", "control", "surface", "overlay", "modal", "chip", "full"];

interface DtcgEntry {
  $description?: string;
  [child: string]: unknown;
}

/** A token's `$description` in the DTCG document, if it has one. */
function describe(path: string): string | undefined {
  let node: unknown = light;
  for (const key of path.split(".")) node = (node as Record<string, unknown> | undefined)?.[key];
  return (node as DtcgEntry | undefined)?.$description;
}

/** The radius tokens grouped by the corner they draw: roles that share a value share a tile. */
function corners(): Array<{ value: string; items: Token[] }> {
  const groups = new Map<string, Token[]>();
  for (const item of ordered(tokens("radius"), RADII)) {
    const value = dimension(item.light);
    groups.set(value, [...(groups.get(value) ?? []), item]);
  }
  return [...groups].map(([value, items]) => ({ value, items }));
}

export const Radius: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Four corner values, shared by role and drawn at 4×. Only people, choices and tags read round.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-spacing-corners">
        {corners().map(({ value, items }) => (
          <figure key={value} className="qx-spacing-corner">
            <div aria-hidden="true" className="qx-spacing-corner-frame">
              <span
                className="qx-spacing-corner-shape"
                style={{ borderRadius: `calc(var(${items[0]?.cssVar}) * 4)` }}
              />
              <span className="qx-spacing-corner-zoom">4×</span>
            </div>
            <figcaption className="qx-spacing-corner-caption">
              <span className="qx-spacing-corner-value">{value}</span>
              <ul className="qx-spacing-corner-tokens">
                {items.map((item) => {
                  const note = describe(item.path);
                  return (
                    <li key={item.path}>
                      <CopyToken value={item.cssVar} />
                      {note && <span className="qx-spacing-note">{note}</span>}
                    </li>
                  );
                })}
              </ul>
            </figcaption>
          </figure>
        ))}
      </div>
    </Specimen>
  ),
};

/* ── Control sizes ────────────────────────────────────────────────────────── */

const VIEWS = [
  { value: "list", label: "List", icon: ListIcon },
  { value: "grid", label: "Grid", icon: LayoutGridIcon },
];

const PLANS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const MEMBERS = [
  { id: "u1", name: "Priya Sharma", role: "Owner" },
  { id: "u2", name: "Rahul Verma", role: "Admin" },
];

type Member = (typeof MEMBERS)[number];

const MEMBER_COLUMNS = [
  { id: "name", header: "Name", cell: (member: Member) => member.name },
  { id: "role", header: "Role", cell: (member: Member) => member.role },
];

/** One of each sized control at a size. */
function Controls({ size }: { size: ControlSize }) {
  return (
    <>
      <Button size={size}>Save</Button>
      <IconButton size={size} variant="soft" icon={SettingsIcon} aria-label="Settings" />
      <ToggleGroup size={size} defaultValue={["list"]} aria-label={`View, ${size}`}>
        {VIEWS.map((view) => (
          <Toggle key={view.value} value={view.value} icon={view.icon} aria-label={view.label} />
        ))}
      </ToggleGroup>
    </>
  );
}

function ControlSizesSpecimen() {
  const density = useDensity();
  const controls = ordered(tokens("size.control"), STEPS);
  const [row] = tokens("size.row");
  const [target] = tokens("size.target");
  return (
    <Specimen>
      <Group label="Controls" aside="Fields are always lg">
        <SpecimenRows>
          {controls.map((item) => (
            <SpecimenRow key={item.path} token={item.cssVar} meta={valueAt(item, density)}>
              <div className="qx-spacing-controls">
                <Gauge cssVar={item.cssVar} />
                <Controls size={item.name as ControlSize} />
                {item.name === "lg" && (
                  <>
                    <Input
                      aria-label="Workspace name"
                      placeholder="Workspace"
                      className="qx-spacing-field"
                    />
                    <Select
                      aria-label="Billing plan"
                      items={PLANS}
                      defaultValue="monthly"
                      className="qx-spacing-field"
                    />
                  </>
                )}
              </div>
            </SpecimenRow>
          ))}
        </SpecimenRows>
      </Group>
      <Group label="Rows and targets">
        <SpecimenRows>
          {row && (
            <SpecimenRow token={row.cssVar} meta={valueAt(row, density)}>
              <div className="qx-spacing-controls" data-align="end">
                <Gauge cssVar={row.cssVar} />
                <Table
                  label="Members"
                  className="qx-spacing-table"
                  rows={MEMBERS}
                  rowId={(member) => member.id}
                  rowLabel={(member) => member.name}
                  columns={MEMBER_COLUMNS}
                />
              </div>
            </SpecimenRow>
          )}
          {target && (
            <SpecimenRow token={target.cssVar} meta={`${dimension(target.light)} · WCAG 2.5.8`}>
              <div className="qx-spacing-controls">
                <span aria-hidden="true" className="qx-spacing-target">
                  <XIcon shape="sharp" size="var(--qx-size-icon-sm)" />
                </span>
                <span className="qx-spacing-note">
                  The smallest pointer target any control may have
                </span>
              </div>
            </SpecimenRow>
          )}
        </SpecimenRows>
      </Group>
    </Specimen>
  );
}

export const ControlSizes: Story = {
  name: "Control sizes",
  parameters: {
    docs: {
      description: {
        story: "Real controls at each height. Heights and values follow the Density toolbar.",
      },
    },
  },
  render: () => <ControlSizesSpecimen />,
};

/* ── Density ──────────────────────────────────────────────────────────────── */

const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

/** The same small form, pinned to one density. */
function DensityPanel({ density }: { density: DensityMode }) {
  return (
    <Group label={density}>
      <div className="qx-spacing-panel" data-qx-density={density}>
        <Fieldset legend="Profile">
          <TextField label="Display name" defaultValue="Priya Sharma" />
          <Field label="Role">
            <Select items={ROLES} defaultValue="owner" />
          </Field>
        </Fieldset>
        <div className="qx-spacing-actions">
          <Button>Save</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
        <Table
          label={`Members, ${density}`}
          rows={MEMBERS}
          rowId={(member) => member.id}
          rowLabel={(member) => member.name}
          columns={MEMBER_COLUMNS}
        />
      </div>
    </Group>
  );
}

export const Density: Story = {
  parameters: {
    docs: {
      description: { story: "The same form at each density; each panel pins data-qx-density." },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-spacing-densities">
        {DENSITIES.map((density) => (
          <DensityPanel key={density} density={density} />
        ))}
      </div>
      <Group label="What each density sets">
        <TokenTable
          caption="The tokens each density sets"
          columns={["Token", ...DENSITIES]}
          rows={densityTokens().map((item) => ({
            token: item.cssVar,
            cells: DENSITIES.map((density) => dense(item.values[density])),
          }))}
        />
      </Group>
    </Specimen>
  ),
};

/* ── Breakpoints ──────────────────────────────────────────────────────────── */

type SizeClass = keyof typeof BREAKPOINT;

/** Window size classes from narrowest, each with the width it starts at. */
const CLASSES: Array<[SizeClass | "compact", number]> = [
  ["compact", 0],
  ...(Object.entries(BREAKPOINT) as Array<[SizeClass, number]>).sort((a, b) => a[1] - b[1]),
];

/** Where the ruler ends: past the widest threshold, so the last class has room. */
const RULER_END = 1920;

/** The window's width, live. */
function useWindowWidth(): number {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener("resize", notify);
      return () => window.removeEventListener("resize", notify);
    },
    () => window.innerWidth,
    () => 0,
  );
}

const share = (px: number) => `${(Math.min(px, RULER_END) / RULER_END) * 100}%`;

function Ruler() {
  const width = useWindowWidth();
  const current = CLASSES.filter(([, min]) => width >= min).pop()?.[0];
  return (
    <div className="qx-spacing-ruler">
      <ol
        aria-label="Window size classes"
        className="qx-spacing-bands"
        style={{
          gridTemplateColumns: CLASSES.map(
            ([, min], index) => `minmax(0, ${(CLASSES[index + 1]?.[1] ?? RULER_END) - min}fr)`,
          ).join(" "),
        }}
      >
        {CLASSES.map(([name, min], index) => {
          const next = CLASSES[index + 1]?.[1];
          return (
            <li
              key={name}
              className="qx-spacing-band"
              data-current={name === current ? "" : undefined}
            >
              <span className="qx-spacing-band-name">{name}</span>
              <code className="qx-spacing-band-range">
                {next ? `${min}–${next - 1}px` : `${min}px and up`}
              </code>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="qx-spacing-scale">
        {CLASSES.map(([name, min]) => (
          <span key={name} style={{ insetInlineStart: share(min) }}>
            {min}
          </span>
        ))}
      </div>
      {width > 0 && (
        <div
          className="qx-spacing-marker"
          data-flip={width / RULER_END > 0.8 ? "" : undefined}
          style={{ insetInlineStart: share(width) }}
        >
          <span>This window · {width}px</span>
        </div>
      )}
    </div>
  );
}

export const Breakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story: "Window size classes, to scale. The marker shows this window's width.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Ruler />
      <Group label="In code">
        <TokenTable
          caption="Window size classes in CSS and JavaScript"
          columns={["Class", "CSS", "JavaScript", "Grid key"]}
          rows={CLASSES.map(([name]) =>
            name === "compact"
              ? { token: name, cells: ["—", "—", "base"] }
              : {
                  token: name,
                  cells: [`@media (--qx-viewport-${name})`, `BREAKPOINT.${name}`, name],
                },
          )}
        />
      </Group>
    </Specimen>
  ),
};

/* ── Component sizes ──────────────────────────────────────────────────────── */

const camel = (segment: string) =>
  segment.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** A component token's name in the COMPONENT export, if the export has it. */
function exportOf(path: string): string | undefined {
  const keys = path.split(".").slice(1).map(camel);
  let node: unknown = COMPONENT;
  for (const key of keys) node = (node as Record<string, unknown> | undefined)?.[key];
  return typeof node === "string" ? `COMPONENT.${keys.join(".")}` : undefined;
}

/** `command-palette` → `Command palette`. */
const title = (name: string) => (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, " ");

/** The component tokens under the component they size, in the package's order. */
function byComponent(): Array<{ name: string; items: Token[] }> {
  const groups = new Map<string, Token[]>();
  for (const item of tokens("component")) {
    const name = item.path.split(".")[1] ?? item.path;
    groups.set(name, [...(groups.get(name) ?? []), item]);
  }
  return [...groups].map(([name, items]) => ({ name: title(name), items }));
}

export const ComponentSizes: Story = {
  name: "Component sizes",
  parameters: {
    docs: {
      description: {
        story: "Fixed geometry for a few components, drawn to scale and exported as COMPONENT.",
      },
    },
  },
  render: () => (
    <Specimen>
      {byComponent().map(({ name, items }) => (
        <Group key={name} label={name}>
          <div className="qx-spacing-components">
            <SpecimenRows>
              {items.map((item) => {
                const exported = exportOf(item.path);
                return (
                  <SpecimenRow
                    key={item.path}
                    token={item.cssVar}
                    meta={
                      <span className="qx-spacing-meta">
                        <span>{dimension(item.light)}</span>
                        {exported && <span>{exported}</span>}
                      </span>
                    }
                  >
                    <Bar cssVar={item.cssVar} cell="rem" />
                  </SpecimenRow>
                );
              })}
            </SpecimenRows>
          </div>
        </Group>
      ))}
    </Specimen>
  ),
};
