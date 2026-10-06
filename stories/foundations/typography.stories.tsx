import tokens from "@qeetrix/ui/tokens.json";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The Qeetrix type system is the Qeet family in three optical cuts — Qeet Display for headlines, Qeet Text for body copy, Qeet UI for interface labels — plus Fira Code for code, over a twelve-step size scale from `display-lg` down to `micro` (`--qx-font-size-*`). On top of the scale sit semantic type roles (`--qx-typography-<role>-*`), each bundling family, size, weight, line height and tracking, so a component says what a piece of text *is* rather than picking a step off the ramp. Tailwind exposes the roles as `text-display` … `text-code`.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/** Largest first, so the page reads like a specimen sheet. Sizes are read from tokens.json. */
const SCALE = [
  "display-lg",
  "display",
  "title",
  "heading-lg",
  "heading",
  "heading-sm",
  "body-lg",
  "body",
  "body-sm",
  "body-xs",
  "caption",
  "micro",
] as const satisfies ReadonlyArray<keyof typeof tokens.light.font.size>;

const FONT_SIZE = tokens.light.font.size;

export const TypeScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The four families and the raw size scale. Reach for a type role (below) before a step: the scale is what roles are built from.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Families">
        <div className="flex flex-col gap-2">
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl">
            Qeet Display — headlines
          </p>
          <p style={{ fontFamily: "var(--font-sans)" }} className="text-lg">
            Qeet Text — body copy and long-form reading.
          </p>
          <p style={{ fontFamily: "var(--font-ui)" }} className="text-sm">
            Qeet UI — buttons, labels, menus, small interface text.
          </p>
          <p style={{ fontFamily: "var(--font-mono)" }} className="text-sm">
            Fira Code — code, keys, IDs and secrets: qid_live_8f2a·0O·1lI
          </p>
        </div>
        <Callout title="Indic scripts have their own stack">
          <Code>--qx-font-family-indic</Code> is Noto Sans across eight Indic scripts, paired with{" "}
          <Code>--qx-font-line-height-indic</Code> (1.75): conjuncts and vowel signs need more
          vertical room than Latin, and the Qeet faces do not cover them.
        </Callout>
      </Section>
      <Section title="Type scale">
        <Prose>
          The scale is a primitive: <Code>--qx-font-size-*</Code> ships in{" "}
          <Code>@qeetrix/ui/tokens.css</Code>, not in <Code>styles.css</Code>. What the runtime
          stylesheet carries are the roles built from it, which is one more reason components name a
          role.
        </Prose>
        <div className="flex flex-col gap-3">
          {SCALE.map((step) => (
            <div key={step} className="flex items-baseline gap-4 border-b border-border pb-3">
              <code className="w-28 shrink-0 text-xs text-muted-foreground">{step}</code>
              <span className="w-16 shrink-0 text-xs text-muted-foreground">{FONT_SIZE[step]}</span>
              <span
                style={{ fontSize: `var(--qx-font-size-${step})` }}
                className="font-heading truncate"
              >
                Authenticate with Qeet
              </span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

type TypeRole = keyof typeof tokens.light.typography;

const ROLES: Array<{ role: TypeRole; sample: string; use: string }> = [
  {
    role: "display",
    sample: "Identity for every Qeet product",
    use: "Hero and landing headlines.",
  },
  { role: "title", sample: "Members", use: "The page title — one per screen." },
  { role: "heading", sample: "Security keys", use: "Section headings inside a page or card." },
  {
    role: "body",
    sample: "Ada Lovelace signed in with a passkey from Pune.",
    use: "Running text and descriptions.",
  },
  { role: "label", sample: "Organisation slug", use: "Form labels, buttons, menu items." },
  {
    role: "label-compact",
    sample: "Filter by role",
    use: "Labels in dense chrome: toolbars, small buttons.",
  },
  { role: "caption", sample: "Last rotated 3 days ago", use: "Help text and metadata." },
  { role: "micro", sample: "Beta", use: "Badges and counters — the smallest step on the scale." },
  { role: "code", sample: "qid_live_8f2a", use: "Inline code, keys and identifiers." },
];

/** The family token names its face; the table shows which one without repeating the stack. */
function faceOf(family: string) {
  return family.split(",")[0].replaceAll('"', "");
}

export const Roles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The semantic type roles, each rendered with all five of its tokens. The `text-<role>` utility sets size and line height together; family, weight and tracking are the role's other tokens.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Type roles">
        <Prose>
          A role is a decision, not a size: &ldquo;a title looks like this&rdquo;. Components that
          name the role rather than assembling a family, a step and a weight stay consistent with
          each other, and the whole product can be retuned by moving a role.
        </Prose>
        <div className="flex flex-col gap-4">
          {ROLES.map(({ role, sample }) => (
            <div key={role} className="flex items-baseline gap-4 border-b border-border pb-3">
              <code className="w-28 shrink-0 text-xs text-muted-foreground">text-{role}</code>
              <span
                className="min-w-0 truncate"
                style={{
                  fontFamily: `var(--qx-typography-${role}-font-family)`,
                  fontSize: `var(--qx-typography-${role}-font-size)`,
                  fontWeight: `var(--qx-typography-${role}-font-weight)`,
                  lineHeight: `var(--qx-typography-${role}-line-height)`,
                  letterSpacing: `var(--qx-typography-${role}-letter-spacing)`,
                }}
              >
                {sample}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Role tokens">
        <TokenTable
          caption="--qx-typography-<role>-* — resolved values, and what each role is for."
          columns={["Role", "Face", "Size", "Weight", "Line height", "Tracking", "Use"]}
          rows={ROLES.map(({ role, use }) => {
            const value = tokens.light.typography[role];
            return {
              token: role,
              cells: [
                faceOf(value["font-family"]),
                value["font-size"],
                value["font-weight"],
                value["line-height"],
                value["letter-spacing"],
                <span key={role} className="font-sans">
                  {use}
                </span>,
              ],
            };
          })}
        />
        <Callout title="text-label is not text-sm">
          The role utilities live beside Tailwind&rsquo;s own <Code>text-sm</Code>…
          <Code>text-4xl</Code>, which are untouched. Those are steps; <Code>text-label</Code> is a
          meaning — 13px today against <Code>text-sm</Code>&rsquo;s 14px — and only the role moves
          when the label decision is retuned.
        </Callout>
      </Section>
    </Page>
  ),
};
