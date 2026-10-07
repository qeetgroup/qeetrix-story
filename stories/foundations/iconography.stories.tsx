import {
  BellIcon,
  CheckIcon,
  LockIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "@qeetrix/icons";
import { Button, ICON_SIZE, ICON_STROKE, Icon } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType, SVGProps } from "react";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Iconography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Two token families carry iconography: `--qx-icon-size-*` (14 / 16 / 20 / 24px) and `--qx-icon-stroke-*` (1.5 / 2). Both are published as the typed `ICON_SIZE` and `ICON_STROKE` constants, and the `<Icon>` wrapper is how a component consumes them. The sizes are even numbers on a 24px grid so a glyph centres exactly inside a control instead of landing on a half pixel; the two stroke weights exist so a large icon does not read heavier than the text beside it. Everything else about an icon — whether it has a name, whether it is announced at all — is an accessibility decision, and it is the one the wrapper makes you state.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const SIZES = [
  { name: "xs", px: ICON_SIZE.xs, use: "Badges, inline code, table cell affordances." },
  { name: "sm", px: ICON_SIZE.sm, use: "Compact rows, small buttons, dense chrome." },
  { name: "md", px: ICON_SIZE.md, use: "The default. Body copy and button labels." },
  { name: "lg", px: ICON_SIZE.lg, use: "Standalone icon buttons and primary navigation." },
] as const;

/**
 * A Qeetrix glyph sized — and optionally stroked — from its CSS token. Each icon renders a
 * fixed 24×24 `<svg>` with `width`/`height`/`stroke-width` presentation attributes, and CSS
 * outranks presentation attributes — so this is the token doing the work, live, rather than
 * a number copied out of it. Colour needs no help: the icons paint with `currentColor`.
 */
type GlyphComponent = ComponentType<SVGProps<SVGSVGElement>>;

function Glyph({
  icon: Cmp,
  sizeVar,
  strokeVar,
}: {
  icon: GlyphComponent;
  sizeVar: string;
  strokeVar?: string;
}) {
  return (
    <Cmp
      aria-hidden="true"
      focusable="false"
      style={{
        width: `var(${sizeVar})`,
        height: `var(${sizeVar})`,
        ...(strokeVar ? { strokeWidth: `var(${strokeVar})` } : null),
      }}
    />
  );
}

export const Sizing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The four-step size scale, each glyph sized directly from `--qx-icon-size-*` so the specimen is the token rather than a copy of it.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Size scale">
        <Prose>
          Four steps, all even, all divisors of the 24px artwork grid. Pick the step that matches
          the text the icon sits next to — an icon that is larger than its label reads as the
          subject of the row rather than a modifier on it.
        </Prose>
        <div className="flex flex-wrap items-end gap-10">
          {SIZES.map((size) => (
            <div key={size.name} className="flex flex-col items-center gap-3">
              <Glyph icon={SettingsIcon} sizeVar={`--qx-icon-size-${size.name}`} />
              <code className="text-xs text-muted-foreground">
                {size.name} · {size.px}px
              </code>
            </div>
          ))}
        </div>
        <TokenTable
          caption="--qx-icon-size-* — also exported as the typed ICON_SIZE constant."
          columns={["Token", "CSS variable", "Value", "Where it belongs"]}
          rows={SIZES.map((size) => ({
            token: `ICON_SIZE.${size.name}`,
            cells: [
              `--qx-icon-size-${size.name}`,
              `${size.px}px`,
              <span key={size.name} className="font-sans">
                {size.use}
              </span>,
            ],
          }))}
        />
      </Section>

      <Section title="Stroke weight">
        <Prose>
          <Code>&lt;Icon&gt;</Code> forwards the stroke token to the glyph as{" "}
          <Code>strokeWidth</Code>. <Code>regular</Code> is the default and matches the weight of UI
          text; <Code>thin</Code> is for display-scale icons in hero headings and large stat tiles,
          where a 2px stroke starts to look heavy.
        </Prose>
        <div className="flex flex-wrap items-center gap-10">
          {(Object.entries(ICON_STROKE) as Array<[keyof typeof ICON_STROKE, number]>).map(
            ([name, width]) => (
              <div key={name} className="flex flex-col items-center gap-3">
                <Glyph
                  icon={SearchIcon}
                  sizeVar="--qx-icon-size-lg"
                  strokeVar={`--qx-icon-stroke-${name}`}
                />
                <code className="text-xs text-muted-foreground">
                  {name} · {width}
                </code>
              </div>
            ),
          )}
        </div>
        <TokenTable
          caption="--qx-icon-stroke-* — also exported as the typed ICON_STROKE constant."
          columns={["Token", "CSS variable", "Value"]}
          rows={(Object.entries(ICON_STROKE) as Array<[string, number]>).map(([name, width]) => ({
            token: `ICON_STROKE.${name}`,
            cells: [`--qx-icon-stroke-${name}`, String(width)],
          }))}
        />
        <Callout title="Stroke is measured in the 24-unit grid, not in pixels">
          Every <Code>@qeetrix/icons</Code> glyph is drawn on a 24×24 <Code>viewBox</Code>, so{" "}
          <Code>strokeWidth</Code> scales with the icon: <Code>regular</Code> is a true 2px at{" "}
          <Code>lg</Code> (24px) but about 1.2px at <Code>xs</Code> (14px). That is what keeps a
          small glyph from closing up into a blob — pick the stroke for the size the icon is{" "}
          <em>designed</em> at, and let it scale.
        </Callout>
      </Section>
    </Page>
  ),
};

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Icons sit on the text they annotate, not beside it. The rules that make that hold across line heights, wrapping and translation.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Optical alignment">
        <Prose>
          An icon in a row of text is centred on the text&rsquo;s line box, not on its baseline — a
          glyph has no descender to sit on. <Code>flex</Code> plus <Code>items-center</Code> is the
          whole technique, and it survives the label wrapping onto a second line where a hand-tuned{" "}
          <Code>vertical-align</Code> would not.
        </Prose>
        <div className="flex max-w-md flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
          {[
            { icon: UserIcon, label: "Ada Lovelace" },
            { icon: LockIcon, label: "Passkey required" },
            { icon: BellIcon, label: "Notify me when this session expires" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2 text-sm">
              <Glyph icon={row.icon} sizeVar="--qx-icon-size-sm" />
              <span>{row.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icons never shrink">
        <Prose>
          <Code>&lt;Icon&gt;</Code> applies <Code>shrink-0</Code> unconditionally. Inside a flex row
          a squeezed icon is the first thing to distort, and a 20px glyph compressed to 14 by a long
          label is worse than the label truncating — which is what should happen instead.
        </Prose>
        <div className="flex w-64 items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm text-card-foreground">
          <Glyph icon={SearchIcon} sizeVar="--qx-icon-size-md" />
          <span className="truncate">
            A deliberately long label that has to truncate rather than crush the icon
          </span>
        </div>
      </Section>

      <Section title="Inside controls">
        <Prose>
          Button sizes its own icons — the variant carries{" "}
          <Code>[&amp;_svg:not([class*=&apos;size-&apos;])]:size-4</Code>, so a bare glyph lands at
          16px and anything with an explicit size class is left alone. Do not fight it with a
          wrapper; pass the size class on the icon itself if you need a different step.
        </Prose>
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <CheckIcon aria-hidden="true" />
            Approve request
          </Button>
          <Button variant="outline">
            <SettingsIcon aria-hidden="true" />
            Settings
          </Button>
          <Button variant="destructive">
            <TrashIcon aria-hidden="true" />
            Delete
          </Button>
        </div>
      </Section>
    </Page>
  ),
};

export const DecorativeVersusMeaningful: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The only iconography decision that can fail an audit. `<Icon>` defaults to decorative and makes the meaningful case explicit, because the failure mode of the opposite default is silent.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Decorative by default">
        <Prose>
          An icon next to a visible label adds nothing for a screen reader — announcing it produces
          &ldquo;lock, Passkey required&rdquo;, which is noise. <Code>&lt;Icon&gt;</Code> therefore
          renders <Code>aria-hidden=&quot;true&quot;</Code> unless you give it a <Code>title</Code>,
          at which point it becomes <Code>role=&quot;img&quot;</Code> with an{" "}
          <Code>aria-label</Code>. Getting this backwards is invisible in a screenshot and obvious
          in a screen reader, which is exactly why the default is the safe one.
        </Prose>
        <div className="flex max-w-lg flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground">
          <div className="flex items-center gap-3 text-sm">
            <Icon icon={LockIcon} title="Locked" className="size-5" />
            <div>
              <p className="font-medium">Meaningful</p>
              <p className="text-xs text-muted-foreground">
                title=&quot;Locked&quot; → role=&quot;img&quot;, aria-label=&quot;Locked&quot;. The
                icon is the only thing carrying the state.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Icon icon={BellIcon} className="size-5" />
            <div>
              <p className="font-medium">Decorative</p>
              <p className="text-xs text-muted-foreground">
                No title → aria-hidden. The text beside it already says everything.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Which one is it?">
        <TokenTable
          caption="Deciding whether an icon needs a name."
          columns={["Situation", "Treatment"]}
          rows={[
            {
              token: "Icon beside a visible label",
              cells: ["Decorative — no title. The label is the accessible name."],
            },
            {
              token: "Icon-only button",
              cells: [
                "Name the button, not the icon. IconButton takes the label; the glyph stays hidden.",
              ],
            },
            {
              token: "Icon as the only status indicator",
              cells: ["Meaningful — pass title, and never rely on the icon's colour alone."],
            },
            {
              token: "Icon repeating adjacent text",
              cells: ["Decorative. Two announcements of the same fact is worse than one."],
            },
            {
              token: "Purely ornamental illustration",
              cells: ["Decorative, always."],
            },
          ]}
        />
        <Callout title="An icon-only control is a labelling problem, not an icon problem">
          The accessible name belongs on the interactive element. Putting it on the glyph inside a
          button produces a control whose name comes from a child that should not have been in the
          accessibility tree at all — and if the icon is ever swapped for text, the name vanishes
          with it.
        </Callout>
      </Section>
    </Page>
  ),
};
