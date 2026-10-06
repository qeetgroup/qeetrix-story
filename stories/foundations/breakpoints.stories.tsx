import { BREAKPOINTS, belowWidthQuery, Container, minWidthQuery, useMediaQuery } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Breakpoints",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Qeetrix does not invent a breakpoint scale — it uses Tailwind v4's default mobile-first ladder unchanged, and there is deliberately no `--qx-breakpoint-*` token family. The ladder is reachable three ways: as Tailwind variant prefixes (`md:`, `lg:`), as the `--breakpoint-*` theme variables Tailwind generates, and as the typed `BREAKPOINTS` constant with its `minWidthQuery` / `belowWidthQuery` helpers for the cases where layout has to be decided in JavaScript. Every rule is min-width: styles cascade upward from the smallest screen, so an unprefixed utility is the mobile case.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const ORDER = ["sm", "md", "lg", "xl", "2xl"] as const;

const GUIDANCE: Record<(typeof ORDER)[number], string> = {
  sm: "Large phones in landscape. The first point where two columns are honest.",
  md: "Tablets. Where the sidebar stops being a drawer — useIsMobile() flips here.",
  lg: "Small laptops. Persistent navigation, side-by-side detail panes.",
  xl: "Desktop. Wide operational layouts, tables with more visible columns.",
  "2xl": "Large desktop. Rarely needed; usually a max-width does the job better.",
};

/** One hook call per breakpoint, written out — hooks cannot be called in a loop. */
function useMatchedBreakpoints(): Record<(typeof ORDER)[number], boolean> {
  const sm = useMediaQuery(minWidthQuery("sm"));
  const md = useMediaQuery(minWidthQuery("md"));
  const lg = useMediaQuery(minWidthQuery("lg"));
  const xl = useMediaQuery(minWidthQuery("xl"));
  const xxl = useMediaQuery(minWidthQuery("2xl"));
  return { sm, md, lg, xl, "2xl": xxl };
}

function MatchBadge({ matched }: { matched: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        matched ? "bg-success-subtle text-success-text" : "bg-muted text-muted-foreground"
      }`}
    >
      {matched ? "matches" : "no match"}
    </span>
  );
}

function ScaleSpecimen() {
  const matched = useMatchedBreakpoints();
  const active = [...ORDER].reverse().find((name) => matched[name]) ?? "base";
  return (
    <Page>
      <Section title="The ladder">
        <Prose>
          Five min-width steps, unchanged from Tailwind v4. Below <Code>sm</Code> there is no prefix
          at all — that unprefixed state is the base case and every other step is an override
          layered on top of it.
        </Prose>
        <p className="text-sm text-foreground">
          This canvas currently sits at{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">{active}</code>. Resize the
          preview and the badges below update live.
        </p>
        <div className="flex flex-col gap-2">
          {ORDER.map((name) => (
            <div
              key={name}
              className="flex items-center gap-4 rounded-md border border-border px-3 py-2"
            >
              <code className="w-12 shrink-0 text-xs font-medium">{name}</code>
              <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
                {BREAKPOINTS[name]}px
              </span>
              <MatchBadge matched={matched[name]} />
              <span className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground sm:block">
                {GUIDANCE[name]}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Breakpoint tokens">
        <TokenTable
          caption="The responsive scale, in each of the three forms it is published in."
          columns={["Prefix", "Theme variable", "Pixels", "Min-width query"]}
          rows={ORDER.map((name) => ({
            token: `${name}:`,
            cells: [`--breakpoint-${name}`, `${BREAKPOINTS[name]}px`, minWidthQuery(name)],
          }))}
        />
        <Callout title="There is no --qx-breakpoint-* family">
          Every other scale in Qeetrix has authored tokens; this one does not, on purpose. The
          breakpoints come from Tailwind&rsquo;s default theme and{" "}
          <Code>@qeetrix/ui/styles.css</Code> does not override them, so <Code>BREAKPOINTS</Code> in
          TypeScript and <Code>--breakpoint-*</Code> in CSS are two views of the same upstream
          numbers rather than a Qeetrix token layer.
        </Callout>
      </Section>
    </Page>
  );
}

export const Scale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The five steps with a live match indicator. Resize the preview (or open the story in the canvas and drag) to watch the ladder resolve.",
      },
    },
  },
  render: () => <ScaleSpecimen />,
};

export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Layout is a CSS problem first. This grid never asks JavaScript what size the screen is — it stacks at the base case and gains columns at `sm`, `lg` and `xl`.",
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Prefixes, not measurements">
        <Prose>
          Reach for a variant prefix before a media query and a media query before a hook. CSS
          resolves before first paint, has no hydration mismatch, and costs nothing at runtime;{" "}
          <Code>useMediaQuery</Code> returns <Code>false</Code> during server rendering, so a layout
          built on it flashes.
        </Prose>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {["Identity", "Payments", "Notifications", "Logs", "People", "Insights"].map((cell) => (
            <div
              key={cell}
              className="rounded-lg border border-border bg-card p-4 text-sm text-card-foreground shadow-rest"
            >
              <p className="font-medium">{cell}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                1 column · 2 at sm · 3 at lg · 4 at xl
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Content width">
        <Prose>
          <Code>Container</Code> caps the measure rather than the viewport, and carries responsive
          gutters (<Code>px-4</Code>, <Code>sm:px-6</Code>, <Code>lg:px-8</Code>) so content never
          touches the edge of a small screen.
        </Prose>
        <div className="flex flex-col gap-3">
          {(
            [
              ["prose", "max-w-2xl · 42rem — long-form reading"],
              ["content", "max-w-4xl · 56rem — the default for standard pages"],
              ["wide", "max-w-6xl · 72rem — operational layouts and tables"],
              ["full", "max-w-none — the parent owns the width"],
            ] as const
          ).map(([size, note]) => (
            <Container
              key={size}
              size={size}
              gutters={false}
              className="rounded-md border border-dashed border-border bg-muted/40 p-3"
            >
              <code className="text-xs font-medium">size=&quot;{size}&quot;</code>
              <span className="ms-2 text-xs text-muted-foreground">{note}</span>
            </Container>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

export const BehaviouralAdaptation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The narrow case where JavaScript is the right tool: a component that swaps behaviour, not just styling. `useIsMobile()` is the shipped example — it is `useMediaQuery(belowWidthQuery("md"))`, and it is what decides whether a sidebar is persistent or a drawer.',
      },
    },
  },
  render: () => (
    <Page>
      <Section title="Querying from JavaScript">
        <Prose>
          <Code>minWidthQuery</Code> and <Code>belowWidthQuery</Code> build the query string from
          the same constant the utilities are generated from, so a hand-written{" "}
          <Code>(min-width: 768px)</Code> can never drift away from <Code>md:</Code>. Note the
          off-by-one: the below query stops one pixel short so the two never both match.
        </Prose>
        <TokenTable
          caption="Query helpers exported from @qeetrix/ui."
          columns={["Call", "Returns"]}
          rows={ORDER.flatMap((name) => [
            { token: `minWidthQuery("${name}")`, cells: [minWidthQuery(name)] },
            { token: `belowWidthQuery("${name}")`, cells: [belowWidthQuery(name)] },
          ])}
        />
      </Section>

      <Section title="Rules of thumb">
        <Callout title="Use CSS for layout, JavaScript for behaviour">
          If the answer is &ldquo;how many columns&rdquo; or &ldquo;is this visible&rdquo;, it is a
          variant prefix. If the answer changes which component renders, which element receives
          focus, or whether a list virtualises, it is <Code>useMediaQuery</Code>. And note that{" "}
          <Code>hidden</Code> is <Code>display: none</Code>: it takes the element out of the
          accessibility tree, but the component still mounts and still runs its effects — so when
          the two variants are genuinely different components, render one, not both.
        </Callout>
      </Section>
    </Page>
  ),
};
