import { Button } from "@qeetrix/ui";
import tokens from "@qeetrix/ui/tokens.json";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid, Page, Ramp, Section, Swatch } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

/**
 * Colour foundations. Every swatch is painted from a live CSS variable, so it follows the Theme
 * toolbar (light / dark); only the ramp value labels are read from tokens.json.
 */
const meta: Meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Qeetrix colour system is three layers. Raw `--qx-color-*` primitives hold the values: the **Graphite** neutral ramp, the **Qeet** brand ramp, the status ramps and the Tailwind palette. Semantic foundation roles, `--qx-color-<group>-<role>` (surface, text, border, action, feedback, data), say what a colour is *for* and are redeclared per theme. The shadcn bridge (`--background`, `--primary`, `--border`, …) is what most components actually paint with, and every bridge variable points at a role. Components consume roles and the bridge, never primitives, so light, dark and forced colours change without a component edit. There are two oranges: `#F26D0E` (`qeet-500`) is the Qeet brand colour, for identity, the logo and accents. Primary actions use **Qeet Ember** `#D04800` (`qeet-600`) with white text (4.55:1, WCAG AA), because the brand orange carries white at only 3.0:1. Neutrals are Graphite, near-neutral by design: a whisper of warmth at the light end, achromatic at the dark end, so dark mode is a neutral near-black rather than a warm charcoal.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

// Full Tailwind v4 palette, shipped as raw --qx-color-<name>-<step> primitives.
const PALETTE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const PALETTES = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "stone",
] as const;

const STATUS_RAMPS = ["success", "warning", "info", "danger"] as const;

type PrimitiveRamp =
  | "graphite"
  | "qeet"
  | "neutral"
  | (typeof STATUS_RAMPS)[number]
  | (typeof PALETTES)[number];

/**
 * Resolved primitive ramps, for the value labels under each ramp tile. Primitives do not change
 * with the theme, so the light entry is the whole story.
 *
 * Narrowed by annotation, not by a cast. TypeScript infers tokens.json exactly, and `light.color`
 * is not one shape: the ramps are flat step → value maps, but the semantic groups sit beside them
 * and nest (`data.categorical` is an object), so a blanket `Record<string, Record<string, string>>`
 * is false — which is what tsc rejected. Naming the ramps this page reads keeps each lookup checked
 * against what the token build emits: a ramp that is renamed or dropped fails typecheck instead of
 * rendering blank labels.
 */
const RAMPS: Record<PrimitiveRamp, Record<string, string>> = tokens.light.color;

const GRAPHITE_STEPS = [
  0, 25, 50, 100, 150, 200, 300, 400, 450, 500, 600, 700, 750, 800, 825, 875, 900, 925, 950, 975,
  1000,
];
const QEET_STEPS = [50, 100, 150, 200, 300, 400, 500, 550, 600, 700, 800, 900, 950];
const NEUTRAL_STEPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 1000];

/** The shadcn bridge — the unprefixed variables most component classes resolve through. */
const BRIDGE: Array<[string, string]> = [
  ["--background", "background"],
  ["--foreground", "foreground"],
  ["--card", "card"],
  ["--popover", "popover"],
  ["--primary", "primary"],
  ["--primary-foreground", "primary-foreground"],
  ["--secondary", "secondary"],
  ["--muted", "muted"],
  ["--muted-foreground", "muted-foreground"],
  ["--accent", "accent"],
  ["--border", "border"],
  ["--input", "input"],
  ["--ring", "ring"],
];

const STATUS: Array<[string, string]> = [
  ["--success", "success"],
  ["--warning", "warning"],
  ["--info", "info"],
  ["--destructive", "destructive"],
];

const DATA = Array.from(
  { length: 8 },
  (_, index) => [`--chart-${index + 1}`, `series-${index + 1}`] as [string, string],
);

export const All: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The bridge variables components paint with, then every primitive ramp behind them: Graphite, Qeet, the four status ramps, the legacy neutral ramp and the Tailwind palette. The semantic roles in between have a story per group below.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Bridge (shadcn / Base UI runtime vars)">
        <Prose>
          The vocabulary most component classes are written in — <Code>bg-card</Code>,{" "}
          <Code>text-muted-foreground</Code>, <Code>border-input</Code>. Each variable is a pointer
          to a semantic role, never to a primitive, so the contrast gate measures exactly what is on
          screen. <Code>--input</Code> and <Code>--border</Code> are deliberately different: an
          input&rsquo;s edge has to identify a control at 3:1, a card&rsquo;s edge only has to be
          there.
        </Prose>
        <Grid>
          {BRIDGE.map(([v, n]) => (
            <Swatch key={v} varName={v} name={n} />
          ))}
        </Grid>
      </Section>
      <Section title="Status (bridge — theme-aware)">
        <Grid>
          {STATUS.map(([v, n]) => (
            <Swatch key={v} varName={v} name={n} />
          ))}
        </Grid>
      </Section>
      <Section title="Data visualization (bridge — theme-aware)">
        <Grid>
          {DATA.map(([v, n]) => (
            <Swatch key={v} varName={v} name={n} />
          ))}
        </Grid>
      </Section>

      <Section title="Graphite — the neutral foundation (primitive)">
        <Prose>
          Every grey in the system. Near-neutral on purpose: chroma never exceeds 0.003, a whisper
          of warmth at the light end so white surfaces are not clinical, and effectively achromatic
          at the dark end, where any warm chroma reads as brown. Dark mode is built from{" "}
          <Code>950</Code> (the page, <Code>#0e0d0d</Code>) and <Code>925</Code> (cards,{" "}
          <Code>#131312</Code>). The half-steps (<Code>25</Code>, <Code>450</Code>, <Code>825</Code>
          …) exist because a surface ladder needs smaller increments than a palette does.
        </Prose>
        <Ramp name="graphite" steps={GRAPHITE_STEPS} values={RAMPS.graphite} />
      </Section>

      <Section title="Qeet — the brand ramp (primitive)">
        <Prose>
          Qeet&rsquo;s own ramp, not an alias of Tailwind orange. <Code>500</Code> is{" "}
          <Code>#F26D0E</Code> exactly — the brand colour. <Code>600</Code> is Qeet Ember,{" "}
          <Code>#D04800</Code>, the action orange. <Code>700</Code> is the step that reads as text
          on light surfaces and <Code>400</Code> on dark ones. Past <Code>500</Code> the hue turns
          toward red (47° → 32°) rather than only darkening, so the deep steps stay ember instead of
          going brown.
        </Prose>
        <Ramp name="qeet" steps={QEET_STEPS} values={RAMPS.qeet} columns={QEET_STEPS.length} />
        <Callout title="brand-* is an alias of qeet-*">
          <Code>--qx-color-brand-&lt;step&gt;</Code> resolves to the same value as{" "}
          <Code>--qx-color-qeet-&lt;step&gt;</Code> for all thirteen steps. It is kept for code that
          already says <Code>brand</Code>; the semantic roles reference the Qeet ramp directly.
        </Callout>
      </Section>

      <Section title="Status ramps (primitive)">
        <Prose>
          Four complete ramps on one shared lightness ladder, so the same step means the same thing
          across them: <Code>700</Code> is the first step that passes AA as text on light surfaces,{" "}
          <Code>400</Code> on dark ones. Danger is kept clearly redder and warning clearly yellower
          than Qeet orange, so neither status ever reads as a brand accent.
        </Prose>
        <div className="flex flex-col gap-5">
          {STATUS_RAMPS.map((ramp) => (
            <Ramp key={ramp} name={ramp} steps={PALETTE_STEPS} values={RAMPS[ramp]} />
          ))}
        </div>
      </Section>

      <Section title="Reserved accent ramps (placeholders)">
        <Prose>
          <Code>accent</Code> and <Code>passkey</Code> are names held for palettes that are not yet
          ratified (OD-DS-03). Until they are, both alias the neutral ramp, so these swatches are
          grey by design rather than by mistake.
        </Prose>
        <Grid>
          {["accent", "passkey"].map((ramp) => (
            <Swatch key={ramp} varName={`--qx-color-${ramp}-500`} name={`${ramp}-500`} />
          ))}
        </Grid>
      </Section>

      <Section title="Neutral ramp (legacy primitive)">
        <Prose>
          Pure achromatic grey (chroma 0), the neutral from before Graphite. It is still published
          for code that reads <Code>--qx-color-neutral-*</Code>, but no semantic role uses it any
          more — reach for a surface, text or border role instead.
        </Prose>
        <Grid>
          {NEUTRAL_STEPS.map((s) => (
            <Swatch key={s} varName={`--qx-color-neutral-${s}`} name={`neutral-${s}`} />
          ))}
        </Grid>
      </Section>

      <Section title="Palette (Tailwind v4 — raw --qx-color-* primitives)">
        <div className="flex flex-col gap-5">
          {PALETTES.map((p) => (
            <Ramp key={p} name={p} steps={PALETTE_STEPS} values={RAMPS[p]} />
          ))}
        </div>
        <Callout title="Primitives are not in styles.css">
          The ramps ship only in <Code>@qeetrix/ui/tokens.css</Code>. <Code>styles.css</Code>{" "}
          carries the semantic and component layers, so <Code>var(--qx-color-graphite-500)</Code> in
          product code resolves to nothing unless that file is imported too. The workshop imports it
          so these swatches can render; an application should name a role instead.
        </Callout>
      </Section>
    </Page>
  ),
};

/* ── Semantic foundation roles ───────────────────────────────────────────── */

interface Role {
  /** The row label: the role name inside its group. */
  role: string;
  cssVar: string;
  /** How a component reaches it from Tailwind. A bridge utility is listed after a dedicated one. */
  utility: string;
  use: string;
}

/** `--qx-color-<group>-<role>` rows from compact [role, utility, use] tuples. */
function roles(group: string, entries: Array<[string, string, string]>): Role[] {
  return entries.map(([role, utility, use]) => ({
    role,
    cssVar: `--qx-color-${group}-${role}`,
    utility,
    use,
  }));
}

/** Swatches for the theme-reactive look, a table for the utility and the intent. */
function RoleReference({ caption, items }: { caption: string; items: Role[] }) {
  return (
    <>
      <Grid>
        {items.map((item) => (
          <Swatch key={item.cssVar} varName={item.cssVar} name={item.role} />
        ))}
      </Grid>
      <TokenTable
        caption={caption}
        columns={["Role", "CSS variable", "Tailwind utility", "What it is for"]}
        rows={items.map((item) => ({
          token: item.role,
          cells: [
            item.cssVar,
            item.utility,
            <span key={item.cssVar} className="font-sans">
              {item.use}
            </span>,
          ],
        }))}
      />
    </>
  );
}

const SURFACE = roles("surface", [
  [
    "canvas",
    "bg-canvas · bg-background",
    "The page. Light is graphite-25, an off-white with a whisper of warmth so white cards read as cards without heavy borders; dark is neutral near-black (#0e0d0d).",
  ],
  [
    "default",
    "bg-surface · bg-card",
    "Cards and panels — the surface most content sits on. White in light; #131312 in dark, one step above the page.",
  ],
  [
    "elevated",
    "bg-surface-elevated",
    "A surface raised above default. In dark mode it is a Graphite step lighter, because a shadow barely reads on near-black.",
  ],
  [
    "overlay",
    "bg-surface-overlay · bg-popover",
    "Popovers, menus and dialogs. In dark mode the step above elevated, so an overlay separates by luminance first and shadow second.",
  ],
  [
    "sunken",
    "bg-surface-sunken",
    "Wells below the surface: a code block, an inset track, a recessed filter panel.",
  ],
  [
    "subtle",
    "bg-surface-subtle · bg-muted",
    "Quiet fills that are not interactive — a card footer, a header band.",
  ],
  [
    "interactive",
    "bg-surface-interactive · bg-secondary",
    "The resting fill of a neutral control, such as the secondary button.",
  ],
  [
    "interactive-hover",
    "bg-surface-interactive-hover",
    "One step along the ladder on hover — the same step for secondary, outline and ghost buttons.",
  ],
  ["interactive-active", "bg-surface-interactive-active", "The next step, on press."],
  [
    "brand-subtle",
    "bg-brand-subtle · bg-sidebar-selected",
    "The Qeet selected state: the current nav item, an active filter, a chosen row. A restrained Qeet tint in light; in dark a neutral 7% lift, because orange at dark-mode lightness reads as brown.",
  ],
  ["brand-subtle-hover", "bg-brand-subtle-hover", "A selected item under the pointer."],
  ["brand-subtle-active", "bg-brand-subtle-active", "A selected item being pressed."],
  [
    "rail",
    "bg-sidebar",
    "Navigation rails. Matches subtle in light; in dark it sits below the page, so the rail recedes.",
  ],
  [
    "inverse",
    "— (var only)",
    "Chrome that has to read against the page: the tooltip, the calendar's today marker.",
  ],
]);

const TEXT = roles("text", [
  ["primary", "text-foreground", "Body copy and headings."],
  [
    "secondary",
    "— (var only)",
    "Supporting copy one step quieter: alert descriptions, avatar initials, keyboard hints.",
  ],
  [
    "tertiary",
    "text-muted-foreground",
    "Metadata and captions. Muted, but still held to 4.5:1 on every surface.",
  ],
  [
    "placeholder",
    "via --qx-component-input-placeholder",
    "Placeholder text is real text: 4.5:1 on the field, not dimmed to disabled.",
  ],
  [
    "disabled",
    "— (var only)",
    "The label of an unavailable control. WCAG exempts inactive controls, so this is the one text role not held to 4.5:1.",
  ],
  ["inverse", "— (var only)", "Text on surface-inverse — the tooltip label."],
  [
    "brand",
    "text-brand",
    "Qeet-coloured text and icons: qeet-700 in light, qeet-400 in dark. The AA text step, not the 500 fill.",
  ],
  [
    "link",
    "text-link",
    "Links. Not action.primary on purpose: a link has no fill behind it, so it has to reach 4.5:1 against the page by itself.",
  ],
  [
    "link-hover",
    "hover:text-link-hover",
    "A link under the pointer: one step further from the page — deeper in light, lighter in dark.",
  ],
  ["success", "text-success-text", "Status text on the page, a card, or its own subtle surface."],
  ["warning", "text-warning-text", "As above — 4.5:1 on all three."],
  ["danger", "text-destructive-text", "As above. Field errors and destructive button labels."],
  ["info", "text-info-text", "As above."],
  [
    "on-brand",
    "text-primary-foreground",
    "The white label on the Ember action fill: 4.55:1 at rest, more on hover and press. White in both themes.",
  ],
  [
    "on-subtle",
    "text-secondary-foreground · text-accent-foreground",
    "Text on the interactive and brand-subtle fills.",
  ],
  [
    "on-feedback",
    "text-success-foreground (…)",
    "The label on a base status fill: white in light, near-black in dark, where the status colours are light.",
  ],
  [
    "on-feedback-strong",
    "text-on-feedback-strong",
    "The white label on the error, success and info strong fills, in both themes.",
  ],
  [
    "on-warning-strong",
    "text-on-warning-strong",
    "The near-black label on warning-strong — the hazard convention, because white on amber is unreadable.",
  ],
]);

const BORDER = roles("border", [
  [
    "default",
    "border-border",
    "Decorative edges: card outlines and dividers. Not for identifying a control — that is control.",
  ],
  ["subtle", "border-border-subtle", "Divisions inside a surface that already has an edge."],
  [
    "strong",
    "border-border-strong",
    "An edge that has to hold against a busy background; the outline button's border.",
  ],
  [
    "control",
    "border-control · border-input",
    "The boundary that identifies an interactive control — inputs, selects, checkboxes, radios, switch tracks. ≥3:1 against every surface it sits on (WCAG 1.4.11).",
  ],
  ["control-hover", "border-control-hover", "A control boundary under the pointer."],
  [
    "focused",
    "— (var only)",
    "The focus hue as a border colour. The focus indicator itself is --ring, drawn by the focus-ring utilities.",
  ],
  ["hover", "— (var only)", "Kept for compatibility; the same value as control-hover."],
  [
    "brand",
    "border-border-brand · bg-border-brand",
    "A Qeet indicator that has to be seen without a fill: the active-navigation bar, a selected tab's underline. ≥3:1 on every surface.",
  ],
  ["danger", "— (bridge --destructive-border)", "Error edge."],
  ["success", "— (bridge --success-border)", "Status edges for subtle status surfaces."],
  ["warning", "— (bridge --warning-border)", "As above. Never the only signal of status."],
  ["info", "— (bridge --info-border)", "As above."],
]);

const ACTION = roles("action", [
  [
    "primary",
    "bg-primary",
    "Qeet Ember (#D04800, qeet-600): filled primary actions and checked controls, in both themes, always with a white label.",
  ],
  [
    "primary-hover",
    "via --qx-component-button-primary-background-hover",
    "Ember mixed halfway toward qeet-700.",
  ],
  ["primary-active", "via --qx-component-button-primary-background-active", "qeet-700, on press."],
]);

const STATUSES = [
  {
    status: "success",
    utility: "success",
    strong:
      "A confirmation that must not be missed — a payout released, a service restored. The 700 step with a white label (text-on-feedback-strong), in both themes.",
  },
  {
    status: "warning",
    utility: "warning",
    strong:
      "A warning that must not be missed — ingestion paused, a key about to expire. Amber 400 with a near-black label (text-on-warning-strong), in both themes.",
  },
  {
    status: "error",
    utility: "destructive",
    strong:
      "An error that must not be missed — a blocking failure, an account suspension. The 700 step with a white label (text-on-feedback-strong), in both themes.",
  },
  {
    status: "info",
    utility: "info",
    strong:
      "A notice that must not be missed — a policy that takes effect today. The 700 step with a white label (text-on-feedback-strong), in both themes.",
  },
] as const;

const FEEDBACK = STATUSES.flatMap(({ status, utility, strong }) =>
  roles("feedback", [
    [
      status,
      `bg-${utility} · text-${utility}`,
      "The status colour itself, as the bridge publishes it: status icons, and solid fills with an on-feedback label.",
    ],
    [
      `${status}-subtle`,
      `bg-${utility}-subtle`,
      "The default status surface — alerts, inline messages, status badges. The matching text role holds 4.5:1 on it.",
    ],
    [`${status}-strong`, `bg-${utility}-strong`, strong],
  ]),
);

const SERIES_HUES = ["blue", "teal", "Qeet", "violet", "pink", "lime", "sky", "graphite"];

const DATA_ROLES: Role[] = [
  ...SERIES_HUES.map((hue, index) => ({
    role: `categorical-${index + 1}`,
    cssVar: `--qx-color-data-categorical-${index + 1}`,
    utility: `bg-chart-${index + 1} · fill-chart-${index + 1}`,
    use: `Series ${index + 1} — ${hue}.`,
  })),
  ...roles("data", [
    ["grid", "stroke-chart-grid", "Gridlines. Quiet on purpose; the data is the point."],
    ["axis", "fill-chart-axis", "Axis labels and ticks — 3:1 on the surface."],
    ["reference", "stroke-chart-reference", "Targets and thresholds."],
    ["positive", "text-chart-positive", "A favourable change."],
    ["negative", "text-chart-negative", "A regression."],
    ["warning", "text-chart-warning", "A value approaching a limit."],
  ]),
];

const SPECIALIST: Role[] = [
  {
    role: "focus.ring",
    cssVar: "--qx-color-focus-ring",
    utility: "outline-ring · focus-ring",
    use: "The focus indicator colour, 3:1 on every surface; published to Tailwind as --ring. See Foundations/Focus.",
  },
  {
    role: "overlay.scrim",
    cssVar: "--qx-color-overlay-scrim",
    utility: "via --qx-component-dialog-scrim",
    use: "The dim behind dialogs, sheets and the tour: near-black at 40% in light, 62% in dark.",
  },
  {
    role: "selection.background",
    cssVar: "--qx-color-selection-background",
    utility: "::selection (base layer)",
    use: "Selected text: a Qeet tint that keeps the selected text at 4.5:1.",
  },
  {
    role: "rating.filled",
    cssVar: "--qx-color-rating-filled",
    utility: "fill-rating-filled",
    use: "The filled part of a rating icon. The value is how much of each icon is filled, not the hue.",
  },
  ...["key", "string", "number", "literal", "punctuation", "comment"].map((part) => ({
    role: `syntax.${part}`,
    cssVar: `--qx-color-syntax-${part}`,
    utility: `text-syntax-${part}`,
    use: "CodeBlock and JSONTree only.",
  })),
];

/** A labelled region of the surface specimen, so each role is named where it is used. */
function SurfaceLabel({ children }: { children: string }) {
  return <code className="block font-mono text-[10px] text-muted-foreground">{children}</code>;
}

export const SurfaceRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-surface-*`: the planes a screen is built from, from the page up to the overlay, plus the interactive ladder and the Qeet selected state. Switch the theme to see dark mode separate surfaces by luminance rather than by shadow.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Surface roles">
        <Prose>
          Surfaces are a ladder, not a palette. Light mode keeps them close — white cards on an
          off-white page — and lets the shadow do the separating; dark mode steps each plane up one
          Graphite shade, because a shadow on near-black is nearly invisible. A component that names
          its role gets both behaviours for free.
        </Prose>
        <RoleReference
          caption="--qx-color-surface-* — each role, the utility that paints it, and what it is for."
          items={SURFACE}
        />
      </Section>

      <Section title="Surfaces in place">
        <Prose>
          A Qeet ID members screen, reduced to its planes. The selected rail item pairs the{" "}
          <Code>brand-subtle</Code> tint with a <Code>border-brand</Code> bar, so selection never
          depends on telling two pale colours apart.
        </Prose>
        <div className="grid max-w-3xl grid-cols-[11rem_1fr] overflow-hidden rounded-xl border border-border bg-canvas">
          <div className="flex flex-col gap-1 border-e border-border bg-sidebar p-2 text-sm">
            <SurfaceLabel>rail</SurfaceLabel>
            <span className="rounded-md px-2 py-1.5 text-foreground">Overview</span>
            <span className="relative rounded-md bg-brand-subtle px-2 py-1.5 font-medium text-foreground before:absolute before:inset-y-1.5 before:inset-s-0 before:w-0.5 before:rounded-full before:bg-border-brand">
              Members
            </span>
            <span className="rounded-md px-2 py-1.5 text-foreground">Sessions</span>
            <SurfaceLabel>brand-subtle + border-brand</SurfaceLabel>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <SurfaceLabel>canvas</SurfaceLabel>
            <div className="rounded-lg border border-border bg-surface p-3 shadow-rest">
              <SurfaceLabel>default</SurfaceLabel>
              <p className="mt-1 text-sm font-medium text-foreground">Ada Lovelace</p>
              <p className="text-xs text-muted-foreground">Owner · signed in 2 minutes ago</p>
              <div className="mt-2 rounded-md bg-surface-sunken px-2 py-1.5 font-mono text-xs text-foreground">
                qid_live_••••8f2a
              </div>
              <SurfaceLabel>sunken</SurfaceLabel>
            </div>
            <div className="w-60 rounded-lg border border-border bg-surface-overlay p-1.5 text-sm shadow-popover">
              <SurfaceLabel>overlay</SurfaceLabel>
              <span className="mt-1 block rounded-md px-2 py-1 text-foreground">Change role</span>
              <span className="block rounded-md bg-surface-interactive-hover px-2 py-1 text-foreground">
                Revoke sessions
              </span>
              <SurfaceLabel>interactive-hover</SurfaceLabel>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  ),
};

export const TextRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-text-*`: reading text, status text, brand and link text, and the `on-*` labels that are only correct on the fill they are named for.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Text roles">
        <Prose>
          Every text role that carries information is held to 4.5:1 against every surface it can
          land on, by a contrast test in <Code>@qeetrix/ui</Code> — including <Code>tertiary</Code>{" "}
          and <Code>placeholder</Code>, which in many systems are dimmed below it. The{" "}
          <Code>on-*</Code> roles are the opposite case: each one is correct only on the fill in its
          name, and wrong everywhere else.
        </Prose>
        <RoleReference
          caption="--qx-color-text-* — each role, the utility that paints it, and what it is for."
          items={TEXT}
        />
      </Section>

      <Section title="On-colours on their fills">
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <span className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
            on-brand · Authenticate with Qeet
          </span>
          <span className="rounded-md bg-destructive-strong px-3 py-1.5 text-on-feedback-strong">
            on-feedback-strong · Account suspended
          </span>
          <span className="rounded-md bg-warning-strong px-3 py-1.5 text-on-warning-strong">
            on-warning-strong · Ingestion paused
          </span>
          <span className="rounded-md bg-brand-subtle px-3 py-1.5 text-secondary-foreground">
            on-subtle · Members
          </span>
          <span
            className="rounded-md px-3 py-1.5"
            style={{
              background: "var(--qx-color-surface-inverse)",
              color: "var(--qx-color-text-inverse)",
            }}
          >
            inverse · Copied to clipboard
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Brand and link text sit on the page with no fill:{" "}
          <span className="text-brand">Qeet ID</span> ·{" "}
          <span className="text-link underline underline-offset-4">View the audit log</span>.
        </p>
      </Section>
    </Page>
  ),
};

export const BorderRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-border-*`: decorative edges, the control boundary that identifies an input, the Qeet indicator, and status edges. Widths, line styles and corners are on Foundations/Borders.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Border roles">
        <Prose>
          The split that matters is <Code>default</Code> versus <Code>control</Code>. A card edge is
          decoration and can be faint; an input edge is how a user finds the field, so it has to
          reach 3:1 against the surface (WCAG 1.4.11). That is why <Code>--input</Code> no longer
          shares a value with <Code>--border</Code>.
        </Prose>
        <RoleReference
          caption="--qx-color-border-* — each role, the utility that paints it, and what it is for."
          items={BORDER}
        />
      </Section>
    </Page>
  ),
};

/**
 * A brand-orange specimen. The only text on the fill is a 24px "Aa", which is large text and so
 * measured against the 3:1 bar: the brand tile passes it, which is exactly the point — the
 * ratio, and everything at body size, sits outside the fill where it is not being demonstrated.
 */
function Orange({
  cssVar,
  title,
  hex,
  ratio,
  children,
}: {
  cssVar: string;
  title: string;
  hex: string;
  ratio: string;
  children: string;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        className="flex h-28 items-end rounded-xl p-4 text-white"
        style={{ background: `var(${cssVar})` }}
      >
        <span className="font-heading text-2xl font-semibold">Aa</span>
      </div>
      <figcaption className="flex flex-col gap-0.5 text-sm">
        <span className="font-medium text-foreground">
          {title} · <code className="font-mono">{hex}</code>
        </span>
        <code className="font-mono text-xs text-muted-foreground">{cssVar}</code>
        <span className="text-muted-foreground">
          White on it: <span className="font-mono text-foreground">{ratio}</span>. {children}
        </span>
      </figcaption>
    </figure>
  );
}

export const ActionRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-action-*` and the two oranges. `#F26D0E` is the brand; Qeet Ember `#D04800` is the one that fills a button, because only Ember carries a white label at AA.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Two oranges: brand and action">
        <Prose>
          A white label on <Code>#F26D0E</Code> measures 3.0:1 — enough for large type, not for a
          button label. Rather than darken the brand, the system splits the job: the brand orange
          stays the colour of identity, and filled actions move one step deeper to Ember, the
          deepest shade that keeps the orange vivid while carrying white at 4.55:1. It is the same
          fill in both themes, so a primary action reads the same everywhere.
        </Prose>
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Orange cssVar="--qx-color-qeet-500" title="Qeet brand" hex="#F26D0E" ratio="3.0:1">
            Identity, the logo, accents and illustration. Never an action fill.
          </Orange>
          <Orange
            cssVar="--qx-color-action-primary"
            title="Qeet Ember"
            hex="#D04800"
            ratio="4.55:1"
          >
            Primary buttons and checked controls, always with a white label.
          </Orange>
        </div>
      </Section>

      <Section title="Action roles">
        <RoleReference
          caption="--qx-color-action-* — the filled primary action and its states."
          items={ACTION}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Authenticate with Qeet</Button>
          <Button disabled>Authenticate with Qeet</Button>
        </div>
        <Callout title="Disabled is neutral, not faded orange">
          A disabled primary button drops to the neutral interactive fill with the disabled text
          role. Half an ember over near-black reads as brown, and an action that is unavailable
          should not carry the loudest colour on the screen.
        </Callout>
      </Section>
    </Page>
  ),
};

export const FeedbackRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-feedback-*` in three strengths per status: the base colour, the `-subtle` surface that is the everyday default, and the `-strong` fill for the message that must not be missed.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Feedback roles">
        <Prose>
          Reach for <Code>-subtle</Code> first: a tinted surface with the matching status text is
          how alerts, inline messages and badges are built. <Code>-strong</Code> is a solid fill
          that does not change with the theme — use it sparingly, for the one message on a screen
          that has to interrupt. In dark mode the subtle surfaces are translucent tints of the
          status hue, so they read the same on a card, a popover or the page.
        </Prose>
        <RoleReference
          caption="--qx-color-feedback-* — base, subtle and strong for each status."
          items={FEEDBACK}
        />
      </Section>

      <Section title="Subtle and strong, in place">
        <div className="grid max-w-3xl gap-2">
          <p className="rounded-lg bg-success-subtle px-3 py-2 text-sm text-success-text">
            Payment captured — ₹4,999 settled to HDFC ••4242.
          </p>
          <p className="rounded-lg bg-warning-subtle px-3 py-2 text-sm text-warning-text">
            The production signing key expires in 7 days.
          </p>
          <p className="rounded-lg bg-destructive-subtle px-3 py-2 text-sm text-destructive-text">
            Webhook endpoint failed 12 deliveries.
          </p>
          <p className="rounded-lg bg-info-subtle px-3 py-2 text-sm text-info-text">
            Log retention changes to 30 days on 1 November.
          </p>
          <p className="rounded-lg bg-destructive-strong px-3 py-2 text-sm font-medium text-on-feedback-strong">
            Account suspended after repeated failed passkey challenges.
          </p>
          <p className="rounded-lg bg-warning-strong px-3 py-2 text-sm font-medium text-on-warning-strong">
            Read-only mode: log ingestion is paused for maintenance.
          </p>
        </div>
        <Callout title="Warning-strong breaks the pattern on purpose">
          Error, success and info strong fills are the 700 step with a white label. Warning is amber
          400 with a near-black label — the hazard convention — because white on amber is unreadable
          and a dark amber reads as brown.
        </Callout>
      </Section>
    </Page>
  ),
};

export const DataRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`--qx-color-data-*`: eight categorical series and the six structural roles a chart needs, independent of application chrome. The bridge publishes them as `--chart-*`.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Data roles">
        <Prose>
          The eight series keep one hue order in both themes — blue, teal, Qeet, violet, pink, lime,
          sky, graphite — and alternate lightness, so neighbouring series stay separable under the
          common colour-vision deficiencies. Gridlines, axes and meaning (positive, negative,
          warning) are separate roles, so a chart never borrows a series colour to say
          &ldquo;bad&rdquo;.
        </Prose>
        <RoleReference
          caption="--qx-color-data-* — series identity and chart structure."
          items={DATA_ROLES}
        />
        <Callout title="Series colour survives forced colors">
          Under <Code>forced-colors: active</Code> charts opt out of colour adjustment, because
          eight series remapped to system colours become one series. The non-colour alternative is{" "}
          <Code>ChartDataTable</Code>, which every chart is expected to render.
        </Callout>
      </Section>
    </Page>
  ),
};

export const SpecialistRoles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single-purpose roles — focus, scrim, text selection, rating and code syntax. Each has exactly one job, which is why they are not folded into the general groups.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Specialist roles">
        <Prose>
          Syntax colours are a vocabulary of their own rather than reuses of the status roles: in a
          highlighter the hue <em>is</em> the information, and a string should not look like a
          success message.
        </Prose>
        <RoleReference
          caption="Focus, overlay, selection, rating and syntax roles."
          items={SPECIALIST}
        />
      </Section>
    </Page>
  ),
};
