import {
  Button,
  Card,
  Checkbox,
  Inline,
  Input,
  Link,
  Stack,
  Switch,
  Tab,
  Tabs,
  TabsList,
  Text,
  TextField,
  Toggle,
  ToggleGroup,
} from "@qeetrix/react";
import { Alert } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { CopyToken, Group, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import {
  type DtcgColor,
  type DtcgDimension,
  type DtcgShadowLayer,
  format,
  ordered,
  type Token,
  tokens,
} from "./_foundation";
import "./_elevation.css";

const meta: Meta = {
  title: "Foundations/Elevation",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shadows for floating layers, ruled borders, the stacking order, opacity and the focus ring.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/** Custom properties for a specimen's geometry, typed for React's style prop. */
const vars = (values: Record<string, string | number>) => values as CSSProperties;

/* ── Shadows ──────────────────────────────────────────────────────────────── */

const SHADOWS = ordered(tokens("shadow"), ["inset", "raised", "raised-hover", "overlay", "modal"]);

/** What each shadow is for (the @qeetrix/tokens README), and who reads it where a component does. */
const SHADOW_USE: Record<string, { use: string; note: string }> = {
  inset: { use: "Wells", note: "Sunken into the page" },
  raised: { use: "Cards", note: "At rest. Hover to lift" },
  "raised-hover": { use: "Cards", note: "Under the pointer" },
  overlay: { use: "Menus", note: "Popover, Select, Toast" },
  modal: { use: "Dialogs", note: "Dialog, Drawer" },
};

const px = (dimension: DtcgDimension) =>
  dimension.unit === "rem" ? dimension.value * 16 : dimension.value;

/** The layer that gives a shadow its height, the softest one: `y 12 · blur 24`. */
function lift(value: unknown): string {
  const layers = value as DtcgShadowLayer[];
  const main = layers.reduce((a, b) => (px(b.blur) > px(a.blur) ? b : a));
  return `${main.inset ? "inset · " : ""}y ${px(main.offsetY)} · blur ${px(main.blur)}`;
}

export const Shadows: Story = {
  parameters: {
    docs: {
      description: {
        story: "Floating layers only. Each pairs a tight contact shadow with a soft ambient one.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Group label="Lowest to highest" aside="Each name copies its --qx-shadow-* variable">
        <div className="qx-elev-stage qx-elev-shadows">
          {SHADOWS.map((item) => (
            <figure key={item.path} className="qx-elev-shadow">
              <div
                className="qx-elev-shadow-tile"
                data-shadow={item.name}
                style={vars({ "--shadow": `var(${item.cssVar})` })}
              >
                <span className="qx-elev-shadow-use">
                  {SHADOW_USE[item.name]?.use ?? item.name}
                </span>
                <span className="qx-elev-shadow-note">{SHADOW_USE[item.name]?.note}</span>
              </div>
              <figcaption className="qx-elev-caption">
                <CopyToken value={item.cssVar} label={item.name} />
                {/* The numbers of the scheme on screen, like the shadow above them. */}
                <span className="qx-elev-numbers">
                  <span data-scheme="light">{lift(item.light)}</span>
                  <span data-scheme="dark">{lift(item.dark)}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Group>
    </Specimen>
  ),
};

/* ── Borders ──────────────────────────────────────────────────────────────── */

const BORDERS = ordered(tokens("border.width"), ["default", "strong", "accent"]);

/** Each width on the edges that use it, in real components. */
const BORDER_USE: Record<string, { use: string; sample: ReactNode }> = {
  default: {
    use: "Cards, fields, table rules",
    sample: (
      <Card
        className="qx-elev-sample"
        footer={
          <Button size="sm" variant="soft">
            Manage
          </Button>
        }
      >
        <Stack gap="xs">
          <Text weight="medium">Acme Pvt Ltd</Text>
          <Text size="sm" tone="subtle">
            48 members · 3 admins
          </Text>
        </Stack>
      </Card>
    ),
  },
  strong: {
    use: "Tab baselines, menu highlights",
    sample: (
      <Tabs defaultValue="users" className="qx-elev-sample">
        <TabsList>
          <Tab value="users">Users</Tab>
          <Tab value="groups">Groups</Tab>
          <Tab value="roles">Roles</Tab>
        </TabsList>
      </Tabs>
    ),
  },
  accent: {
    use: "Alerts, dialogs, the current item",
    sample: (
      <Alert className="qx-elev-sample" title="Directory sync paused">
        People added in Okta appear once it resumes.
      </Alert>
    ),
  },
};

export const Borders: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three widths: hairline rules, emphasis lines, and the accent bar on the current item.",
      },
    },
  },
  render: () => (
    <Specimen>
      <SpecimenRows>
        {BORDERS.map((item) => (
          <SpecimenRow
            key={item.path}
            token={item.cssVar}
            meta={
              <>
                <span className="qx-elev-rule-meta">
                  <span className="qx-elev-rule" style={{ blockSize: `var(${item.cssVar})` }} />
                  {format(item.type, item.light)}
                </span>
                <span className="qx-elev-use">{BORDER_USE[item.name]?.use}</span>
              </>
            }
          >
            {BORDER_USE[item.name]?.sample}
          </SpecimenRow>
        ))}
      </SpecimenRows>
    </Specimen>
  ),
};

/* ── Layers ───────────────────────────────────────────────────────────────── */

/** Front to back, the way the stack reads from the top of the illustration. */
const LADDER = tokens("z").sort((a, b) => Number(b.light) - Number(a.light));

/** The @qeetrix/react components that read each rung, from the published stylesheet. */
const READ_BY: Record<string, string> = {
  "skip-link": "SkipLink",
  spotlight: "Guided tours",
  tooltip: "Tooltip",
  toast: "ToastProvider",
  popover: "Popover, Menu, Select, Combobox",
  modal: "Dialog, Drawer, CommandPalette",
  overlay: "Dialog and Drawer backdrops",
  dropdown: "No component yet",
  sticky: "Table header, AppShell",
  base: "Page content",
};

type View = "exploded" | "composed";

/**
 * One rung as a plane of a console screen, drawn in projection. Each plane stacks by its own
 * z-index token: the DOM lists them front to back, so z-index alone puts them in order.
 */
function Plane({ item, rung }: { item: Token; rung: number }) {
  return (
    <div
      className="qx-elev-plane"
      data-layer={item.name}
      style={{ ...vars({ "--rung": rung }), zIndex: `var(${item.cssVar})` }}
    >
      <span className="qx-elev-plane-el" />
      {item.name === "base" && (
        <>
          <span className="qx-elev-page-line" />
          <span className="qx-elev-page-line" />
          <span className="qx-elev-page-line" />
        </>
      )}
    </div>
  );
}

function LayersSpecimen() {
  const [view, setView] = useState<View>("exploded");
  return (
    <Specimen>
      <div className="qx-elev-stage qx-elev-layers" data-view={view}>
        <div className="qx-elev-layers-bar">
          <ToggleGroup
            aria-label="View"
            size="sm"
            value={[view]}
            onValueChange={(value) => {
              const next = value[0] as View | undefined;
              if (next) setView(next);
            }}
          >
            <Toggle value="exploded">Exploded</Toggle>
            <Toggle value="composed">Composed</Toggle>
          </ToggleGroup>
        </div>
        <div className="qx-elev-scene" style={vars({ "--rungs": LADDER.length })}>
          <ol className="qx-elev-legend" aria-label="Stacking order, front to back">
            {LADDER.map((item, index) => (
              <li key={item.path} style={vars({ "--rung": LADDER.length - 1 - index })}>
                <span className="qx-elev-legend-text">
                  <span className="qx-elev-legend-token">
                    <CopyToken value={item.cssVar} />
                    <code>{String(item.light)}</code>
                  </span>
                  <span className="qx-elev-legend-note">{READ_BY[item.name] ?? "—"}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="qx-elev-planes" aria-hidden="true">
            {LADDER.map((item, index) => (
              <Plane key={item.path} item={item} rung={LADDER.length - 1 - index} />
            ))}
          </div>
        </div>
      </div>
    </Specimen>
  );
}

export const Layers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "From the top layer down. Popovers sit above modals, so one opened from a dialog shows.",
      },
    },
  },
  render: () => <LayersSpecimen />,
};

/* ── Opacity ──────────────────────────────────────────────────────────────── */

/**
 * An illustration with no disabled colour of its own: what the opacity token is for. Painted with
 * dataviz roles, as a stand-in for a product image.
 */
function Illustration({ overlay }: { overlay?: string }) {
  return (
    <svg viewBox="0 0 160 72" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="72" fill="var(--qx-color-bg-info-subtle)" />
      <circle cx="44" cy="36" r="16" fill="var(--qx-color-dataviz-categorical-1)" />
      <rect x="72" y="26" width="52" height="7" fill="var(--qx-color-dataviz-categorical-3)" />
      <rect x="72" y="40" width="34" height="7" fill="var(--qx-color-dataviz-categorical-2)" />
      {overlay && <rect width="160" height="72" fill={`var(${overlay})`} />}
    </svg>
  );
}

function Tile({
  name,
  token,
  value,
  faded,
  children,
}: {
  name: string;
  token?: string;
  value: string;
  faded?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className="qx-elev-tile">
      <div className="qx-elev-tile-sample" data-faded={faded ? "" : undefined}>
        {children}
      </div>
      <figcaption className="qx-elev-caption">
        <span className="qx-elev-tile-name">{name}</span>
        {token && <CopyToken value={token} />}
        <span className="qx-elev-numbers">{value}</span>
      </figcaption>
    </figure>
  );
}

const OPACITY = tokens("opacity");
const STATE_LAYERS = [...tokens("color.overlay"), ...tokens("color.selection")];

/** An alpha as a percentage: light, then dark when it differs. */
function alpha(item: Token): string {
  const percent = (color: unknown) => `${Math.round(((color as DtcgColor).alpha ?? 1) * 100)}%`;
  const [light, dark] = [percent(item.light), percent(item.dark)];
  return light === dark ? light : `${light} · ${dark}`;
}

const sentence = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

export const Opacity: Story = {
  parameters: {
    docs: {
      description: {
        story: "One opacity, for content with no disabled colour of its own, and the state layers.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Group label="Opacity">
        <div className="qx-elev-tiles">
          <Tile name="At rest" value="100%">
            <Illustration />
          </Tile>
          {OPACITY.map((item) => (
            <Tile
              key={item.path}
              name={sentence(item.name)}
              token={item.cssVar}
              value={`${Math.round(Number(item.light) * 100)}%`}
              faded
            >
              <Illustration />
            </Tile>
          ))}
        </div>
      </Group>
      <Group label="State layers" aside="Light · dark">
        <div className="qx-elev-tiles">
          {STATE_LAYERS.map((item) => (
            <Tile
              key={item.path}
              name={sentence(item.name)}
              token={item.cssVar}
              value={alpha(item)}
            >
              {item.name === "selection" ? (
                <span className="qx-elev-selection">
                  Priya <mark>Sharma</mark>
                </span>
              ) : (
                <Illustration overlay={item.cssVar} />
              )}
            </Tile>
          ))}
        </div>
      </Group>
    </Specimen>
  ),
};

/* ── Focus ring ───────────────────────────────────────────────────────────── */

/**
 * One callout on the zoomed edge: the token, its value, and a bracket over the span it measures
 * (or a dot on the thing it names). `from` and `to` are positions across the figure.
 */
function Callout({
  token,
  value,
  from,
  to,
  top,
  point = false,
}: {
  token: string;
  value?: string;
  from: string;
  to: string;
  top: string;
  point?: boolean;
}) {
  return (
    <div
      className="qx-elev-callout"
      data-point={point ? "" : undefined}
      style={vars({ "--from": from, "--to": to, "--top": top })}
    >
      <span className="qx-elev-callout-label">
        <CopyToken value={token} />
        {value && <code>{value}</code>}
      </span>
      <span className="qx-elev-callout-lead" />
      <span className="qx-elev-callout-mark" />
    </div>
  );
}

const FOCUS_RING = tokens("focus.ring");
const RING = format("dimension", FOCUS_RING.find((item) => item.name === "width")?.light);
const OFFSET = format("dimension", FOCUS_RING.find((item) => item.name === "offset")?.light);

export const FocusRing: Story = {
  name: "Focus ring",
  parameters: {
    docs: {
      description: {
        story:
          "2px in the focus colour: inside the edge of filled controls, 2px outside small ones.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-elev-split">
        <Group label="Inside the edge" aside="Buttons, fields, tabs">
          <div className="qx-elev-zoom" data-ring="inside">
            <span className="qx-elev-zoom-control" />
            <Callout
              token="--qx-focus-ring-width"
              value={RING}
              from="var(--edge)"
              to="calc(var(--edge) + var(--ring))"
              top="4.75rem"
            />
            <Callout
              token="--qx-color-border-focus"
              from="calc(var(--edge) + var(--ring) / 2)"
              to="calc(var(--edge) + var(--ring) / 2)"
              top="7rem"
              point
            />
          </div>
          {/* A picture of focus: the rings are drawn statically, so the controls are inert. */}
          <div className="qx-elev-focus-live" data-ring="inside" inert>
            <Button>Invite users</Button>
            <Input aria-label="Search members" placeholder="Search members" />
          </div>
        </Group>
        <Group label="Outside the edge" aside="Checkboxes, links, switches">
          <div className="qx-elev-zoom" data-ring="outside">
            <span className="qx-elev-zoom-control" />
            <Callout
              token="--qx-focus-ring-offset"
              value={OFFSET}
              from="calc(var(--edge) - var(--gap))"
              to="var(--edge)"
              top="4.75rem"
            />
            <Callout
              token="--qx-focus-ring-width"
              value={RING}
              from="calc(var(--edge) - var(--gap) - var(--ring))"
              to="calc(var(--edge) - var(--gap))"
              top="7rem"
            />
          </div>
          <div className="qx-elev-focus-live" data-ring="outside" inert>
            <Checkbox label="Remember this device" defaultChecked />
            <Link href="#audit-log">View the audit log</Link>
          </div>
        </Group>
      </div>
    </Specimen>
  ),
};

/* ── Hidden test: real controls take focus in DOM order ───────────────────── */

export const InteractionFocusOrder: Story = {
  name: "Interaction: focus order",
  tags: ["!dev", "!autodocs"],
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Inline gap="md">
        <Button>Invite users</Button>
        <Button variant="soft">Export</Button>
      </Inline>
      <TextField label="Work email" type="email" placeholder="e.g. priya.sharma@acme.in" />
      <Checkbox label="Remember this device" />
      <Switch label="Security alerts" />
      <Link href="#audit-log">View the audit log</Link>
      <Text size="sm" tone="subtle">
        Acme Pvt Ltd
      </Text>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Invite users" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Export" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveFocus();
  },
};
