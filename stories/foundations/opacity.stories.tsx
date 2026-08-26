import { Button, Input, Label, STATE_OPACITY } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Opacity",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Qeetrix authors exactly one opacity token — `--qx-state-opacity-disabled` — and that is on purpose. There is no `--qx-opacity-*` ramp, because a ramp would invite transparency to become a way of expressing hierarchy, and a design system already has better tools for that: a `muted-foreground` colour role reads more reliably than 60% of a foreground one, and survives being layered over an unexpected background. Where transparency is genuinely the right answer, Qeetrix reaches for an alpha-carrying colour (`--qx-color-overlay-scrim`) or Tailwind's `/<alpha>` modifier, not the `opacity` property.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const DisabledState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The single authored token, and the two Tailwind names it is published under. Every disabled control in the library resolves through it, so unavailability looks identical across components.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="One token">
        <Prose>
          <Code>--qx-state-opacity-disabled</Code> is {STATE_OPACITY.disabled} — enough to read as
          unavailable, not so little that the label becomes unreadable for someone who needs to know
          what the control they cannot use would have done.
        </Prose>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col gap-2">
            <Button>Enabled</Button>
            <span className="text-xs text-muted-foreground">full opacity</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button disabled>Disabled</Button>
            <span className="text-xs text-muted-foreground">disabled:opacity-disabled</span>
          </div>
          <div className="flex w-56 flex-col gap-1.5">
            <Label htmlFor="opacity-demo-input">Organisation domain</Label>
            <Input id="opacity-demo-input" defaultValue="qeet.in" disabled />
            <span className="text-xs text-muted-foreground">same token, different component</span>
          </div>
        </div>
        <TokenTable
          caption="The opacity token and the names it is reachable by."
          columns={["Name", "Resolves to", "Where it comes from"]}
          rows={[
            {
              token: "--qx-state-opacity-disabled",
              cells: [String(STATE_OPACITY.disabled), "tokens/semantic/state.json"],
            },
            {
              token: "STATE_OPACITY.disabled",
              cells: [String(STATE_OPACITY.disabled), "typed export from @qeetrix/ui"],
            },
            {
              token: "--opacity-disabled",
              cells: ["var(--qx-state-opacity-disabled)", "@theme mapping in styles.css"],
            },
            {
              token: "--opacity-50",
              cells: ["var(--qx-state-opacity-disabled)", "@theme mapping in styles.css"],
            },
          ]}
        />
        <Callout title="opacity-50 is not 50% any more">
          The <Code>@theme</Code> block redefines Tailwind&rsquo;s <Code>--opacity-50</Code> to
          point at the token. Today the two happen to be the same number; the point is that if the
          disabled treatment is ever retuned, every existing <Code>opacity-50</Code> moves with it
          instead of being left behind.
        </Callout>
      </Section>

      <Section title="Opacity is never the only signal">
        <Prose>
          A dimmed control still has to be a disabled control. Every Qeetrix component pairs the
          opacity with the native <Code>disabled</Code> attribute or{" "}
          <Code>aria-disabled=&quot;true&quot;</Code>, plus <Code>pointer-events-none</Code> —
          because assistive technology cannot see 50% of anything, and a screen reader user needs
          the state announced, not implied.
        </Prose>
      </Section>
    </Page>
  ),
};

export const AlphaVersusOpacity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`opacity` fades an element and everything inside it, and quietly creates a stacking context. An alpha-carrying colour fades only the thing you named. They are not interchangeable.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Two ways to be see-through">
        <Prose>
          On the left, <Code>opacity-50</Code> on the card — the border, the heading and the body
          copy all fade with it, and the element becomes its own stacking context, so anything
          inside it can no longer be layered against the rest of the page. On the right,{" "}
          <Code>bg-primary/10</Code> tints only the background; the text stays at full strength.
        </Prose>
        <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-primary p-4 opacity-50">
            <p className="font-medium text-primary-foreground">opacity-50</p>
            <p className="mt-1 text-sm text-primary-foreground">
              The whole subtree is faded, text included.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-primary/10 p-4">
            <p className="font-medium text-foreground">bg-primary/10</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Only the fill is transparent. Text is untouched.
            </p>
          </div>
        </div>
      </Section>

      <Section title="The alpha modifier">
        <Prose>
          Any colour utility takes a <Code>/</Code> suffix, and the suffix may be a number or a name
          from the <Code>--opacity-*</Code> namespace. That second form is how the library keeps its
          state treatments token-driven: the Button&rsquo;s focus ring is literally{" "}
          <Code>focus-visible:ring-ring/disabled</Code>, which is the ring colour at the disabled
          opacity.
        </Prose>
        <TokenTable
          caption="Alpha modifier forms seen in @qeetrix/ui component source."
          columns={["Utility", "Meaning"]}
          rows={[
            { token: "ring-ring/disabled", cells: ["ring colour at --opacity-disabled"] },
            { token: "bg-destructive/10", cells: ["destructive at 10% — tinted danger surfaces"] },
            { token: "ring-foreground/10", cells: ["the hairline ring on popovers and menus"] },
            { token: "bg-black/10", cells: ["the Sheet backdrop"] },
            {
              token: "border-destructive/disabled",
              cells: ["invalid border at the disabled opacity, dark theme only"],
            },
          ]}
        />
      </Section>
    </Page>
  ),
};

export const Scrims: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The dimming layer behind a modal surface. Note that the transparency lives in the colour, not in an `opacity` property — a scrim that used `opacity` would fade the dialog sitting on top of it.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Scrim tokens">
        <Prose>
          <Code>--qx-color-overlay-scrim</Code> is <Code>oklch(0 0 0 / 40%)</Code> — black with the
          alpha baked in, identical in light and dark. It stays constant across themes on purpose: a
          scrim&rsquo;s job is to suppress what is behind it, and that job does not change when the
          page gets darker.
        </Prose>
        <div className="relative isolate h-52 max-w-2xl overflow-hidden rounded-xl border border-border">
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-3">
            {["Members", "Sessions", "Devices", "Policies", "Audit", "Keys"].map((cell) => (
              <div
                key={cell}
                className="rounded-lg border border-border bg-card p-2 text-xs text-card-foreground"
              >
                {cell}
              </div>
            ))}
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "var(--qx-color-overlay-scrim)" }}
          />
          <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-modal">
            <p className="text-sm font-medium">Revoke all sessions?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The surface is fully opaque. Only the scrim is transparent.
            </p>
          </div>
        </div>
        <TokenTable
          caption="Transparency that is carried by a colour rather than an opacity property."
          columns={["Token", "Value", "Used by"]}
          rows={[
            {
              token: "--qx-color-overlay-scrim",
              cells: ["oklch(0 0 0 / 40%)", "the scrim role, identical in both themes"],
            },
            {
              token: "--qx-component-dialog-scrim",
              cells: ["var(--qx-color-overlay-scrim)", "Dialog backdrop"],
            },
            {
              token: "--qx-component-card-ring",
              cells: [
                "color-mix(in oklab, var(--qx-color-text-primary) 10%, transparent)",
                "Card hairline",
              ],
            },
          ]}
        />
        <Callout title="Forced colors replaces scrims wholesale">
          Under <Code>forced-colors: active</Code> the dialog, alert-dialog, sheet and tour
          backdrops are all repainted to <Code>Canvas</Code> at <Code>opacity: 0.75</Code>. It is
          the one place the library reaches for the <Code>opacity</Code> property deliberately — the
          system palette has no semi-transparent colour to reach for instead.
        </Callout>
      </Section>
    </Page>
  ),
};
