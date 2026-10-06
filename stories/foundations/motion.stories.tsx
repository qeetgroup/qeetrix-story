import { Button, DURATION, EASING, transition, usePrefersReducedMotion } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Page, Section } from "../_helpers";
import { Callout, Code, Prose, TokenTable } from "./_foundation";

const meta: Meta = {
  title: "Foundations/Motion",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Motion is a two-layer vocabulary. A primitive scale (`--qx-duration-*`, `--qx-easing-*`) holds the raw timings; a semantic layer (`--qx-motion-duration-*`, `--qx-motion-easing-*`) names the role a component should reach for — `normal` rather than `200ms`, `enter` rather than `cubic-bezier(0, 0, 0.2, 1)`. The roles are Tailwind utilities too — `duration-fast`, `ease-enter` — so a class list names its timing, and the same values ship as typed constants (`DURATION`, `EASING`, `transition()`) for motion that has to be driven from JavaScript. Reduced motion is handled once, globally: `@qeetrix/ui/styles.css` collapses every transition and animation to `--qx-motion-reduced-duration` under `prefers-reduced-motion`, so a component only needs its own handling when it animates somewhere CSS cannot reach.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/* ── Token data ───────────────────────────────────────────────────────────── */

/** Semantic duration roles — `--qx-motion-duration-*`, each aliasing a primitive step. */
const DURATION_ROLES = [
  {
    role: "instant",
    cssVar: "--qx-motion-duration-instant",
    ms: DURATION.instant,
    alias: "instant",
  },
  { role: "fast", cssVar: "--qx-motion-duration-fast", ms: DURATION.fast, alias: "fast" },
  {
    role: "normal",
    cssVar: "--qx-motion-duration-normal",
    ms: DURATION.standard,
    alias: "standard",
  },
  { role: "slow", cssVar: "--qx-motion-duration-slow", ms: DURATION.slow, alias: "slow" },
  {
    role: "deliberate",
    cssVar: "--qx-motion-duration-deliberate",
    ms: DURATION.deliberate,
    alias: "deliberate",
  },
] as const;

/** Semantic easing roles — `--qx-motion-easing-*`, with the primitive curve behind each. */
const EASING_ROLES = [
  {
    role: "standard",
    cssVar: "--qx-motion-easing-standard",
    alias: "EASING.standard",
    curve: EASING.standard,
  },
  {
    role: "enter",
    cssVar: "--qx-motion-easing-enter",
    alias: "EASING.decelerate",
    curve: EASING.decelerate,
  },
  {
    role: "exit",
    cssVar: "--qx-motion-easing-exit",
    alias: "EASING.accelerate",
    curve: EASING.accelerate,
  },
  {
    role: "emphasized",
    cssVar: "--qx-motion-easing-emphasized",
    alias: "EASING.sharp",
    curve: EASING.sharp,
  },
  {
    role: "linear",
    cssVar: "--qx-motion-easing-linear",
    alias: "EASING.linear",
    curve: EASING.linear,
  },
] as const;

/** Control points of a `cubic-bezier(...)` value; `linear` reads as (0,0) → (1,1). */
function controlPoints(curve: string): [number, number, number, number] {
  const match = curve.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return [0, 0, 1, 1];
  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 1, parts[3] ?? 1];
}

/** The curve plotted in a 100×100 box, y flipped so progress runs upward. */
function CurvePlot({ curve }: { curve: string }) {
  const [x1, y1, x2, y2] = controlPoints(curve);
  const path = `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
  return (
    <svg
      viewBox="-10 -10 120 120"
      className="size-24 shrink-0 rounded-md border border-border bg-muted text-foreground"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0,100 L100,0"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A dot that slides the width of its track — the transition itself is the specimen. */
function Track({
  playing,
  duration,
  easing,
}: {
  playing: boolean;
  duration: string;
  easing: string;
}) {
  return (
    <div className="relative h-6 w-full min-w-32 rounded-full bg-muted">
      <span
        className="absolute top-0 size-6 rounded-full bg-primary"
        style={{
          left: playing ? "calc(100% - 1.5rem)" : "0px",
          transitionProperty: "left",
          transitionDuration: duration,
          transitionTimingFunction: easing,
        }}
      />
    </div>
  );
}

/* ── Duration ─────────────────────────────────────────────────────────────── */

function DurationSpecimen() {
  const [playing, setPlaying] = useState(false);
  return (
    <Page>
      <Section title="Duration">
        <Prose>
          Five semantic roles cover every transition in the library. <Code>instant</Code> is a real
          token rather than a placeholder: it is what a state flip uses when any perceptible delay
          would read as lag, and it is also what the reduced-motion scale collapses to.
        </Prose>
        <div>
          <Button onClick={() => setPlaying((value) => !value)}>
            {playing ? "Return to start" : "Play durations"}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {DURATION_ROLES.map((role) => (
            <div key={role.role} className="flex items-center gap-4">
              <code className="w-24 shrink-0 text-xs text-muted-foreground">{role.role}</code>
              <span className="w-14 shrink-0 font-mono text-xs">{role.ms}ms</span>
              <Track
                playing={playing}
                duration={`var(${role.cssVar})`}
                easing="var(--qx-motion-easing-standard)"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Semantic duration tokens">
        <TokenTable
          caption="--qx-motion-duration-* — the roles components consume."
          columns={["Role", "CSS variable", "Value", "Primitive it aliases"]}
          rows={DURATION_ROLES.map((role) => ({
            token: role.role,
            cells: [role.cssVar, `${role.ms}ms`, `--qx-duration-${role.alias}`],
          }))}
        />
      </Section>

      <Section title="Primitive duration scale">
        <Prose>
          The raw ladder carries two steps the semantic layer does not expose — <Code>micro</Code>{" "}
          and <Code>linger</Code>. They exist so the semantic roles have room to grow. Reach for a
          semantic role first; drop to a primitive only when no role fits.
        </Prose>
        <TokenTable
          caption="--qx-duration-* — also published as the typed DURATION constant."
          columns={["Typed constant", "CSS variable", "Value"]}
          rows={Object.entries(DURATION).map(([name, ms]) => ({
            token: `DURATION.${name}`,
            cells: [`--qx-duration-${name}`, `${ms}ms`],
          }))}
        />
      </Section>
    </Page>
  );
}

export const Duration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The duration ladder, animated. Every dot travels the same distance under the same easing, so only `transition-duration` differs and the roles can be compared directly.",
      },
    },
  },
  render: () => <DurationSpecimen />,
};

/* ── Easing ───────────────────────────────────────────────────────────────── */

function EasingSpecimen() {
  const [playing, setPlaying] = useState(false);
  return (
    <Page>
      <Section title="Easing">
        <Prose>
          Curves are named for the job, not the shape. <Code>enter</Code> decelerates into place —
          the right feel for something arriving. <Code>exit</Code> accelerates away, because
          something leaving does not need to be watched. <Code>standard</Code> is the symmetric
          default for anything that stays on screen, and <Code>emphasized</Code> is the sharpest
          curve, for movement that should read as decisive.
        </Prose>
        <div>
          <Button onClick={() => setPlaying((value) => !value)}>
            {playing ? "Return to start" : "Play easings"}
          </Button>
        </div>
        <div className="flex flex-col gap-5">
          {EASING_ROLES.map((easing) => (
            <div key={easing.role} className="flex items-center gap-4">
              <CurvePlot curve={easing.curve} />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-sm font-medium">{easing.role}</span>
                <code className="truncate text-[10px] text-muted-foreground">{easing.curve}</code>
                <Track
                  playing={playing}
                  duration="var(--qx-motion-duration-deliberate)"
                  easing={`var(${easing.cssVar})`}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Semantic easing tokens">
        <TokenTable
          caption="--qx-motion-easing-* — each aliases a primitive curve exported as EASING."
          columns={["Role", "CSS variable", "Typed alias", "Curve"]}
          rows={EASING_ROLES.map((easing) => ({
            token: easing.role,
            cells: [easing.cssVar, easing.alias, easing.curve],
          }))}
        />
      </Section>
    </Page>
  );
}

export const Easing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Each curve plotted against a linear reference, next to a dot moving under it. All five run at `--qx-motion-duration-deliberate` so the shape, not the length, is what differs.",
      },
    },
  },
  render: () => <EasingSpecimen />,
};

/* ── Tailwind utilities ───────────────────────────────────────────────────── */

/**
 * Written out as whole class strings, never assembled: Tailwind finds utilities by scanning
 * source text, so `duration-${role}` would compile to nothing and the specimen would prove the
 * opposite of what it claims.
 */
const UTILITY_TRACKS = [
  { utility: "duration-fast", className: "duration-fast" },
  { utility: "duration-normal", className: "duration-normal" },
  { utility: "duration-slow", className: "duration-slow" },
  { utility: "duration-deliberate", className: "duration-deliberate" },
] as const;

const EASE_UTILITIES = [
  { utility: "ease-standard", role: "--qx-motion-easing-standard", legacy: "" },
  { utility: "ease-enter", role: "--qx-motion-easing-enter", legacy: "ease-decelerate" },
  { utility: "ease-exit", role: "--qx-motion-easing-exit", legacy: "ease-accelerate" },
  { utility: "ease-emphasized", role: "--qx-motion-easing-emphasized", legacy: "ease-sharp" },
] as const;

function UtilitiesSpecimen() {
  const [playing, setPlaying] = useState(false);
  return (
    <Page>
      <Section title="Named timings as classes">
        <Prose>
          The <Code>@theme</Code> block in <Code>@qeetrix/ui/styles.css</Code> maps the motion roles
          onto Tailwind&rsquo;s <Code>duration-*</Code> and <Code>ease-*</Code> namespaces, so a
          transition says what it is rather than how many milliseconds it takes. Component source
          reads like this — the Button&rsquo;s own transition is{" "}
          <Code>duration-fast ease-standard</Code>.
        </Prose>
        <div>
          <Button onClick={() => setPlaying((value) => !value)}>
            {playing ? "Return to start" : "Play utilities"}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {UTILITY_TRACKS.map((track) => (
            <div key={track.utility} className="flex items-center gap-4">
              <code className="w-36 shrink-0 text-xs text-muted-foreground">
                {track.utility} ease-enter
              </code>
              <div className="relative h-6 w-full min-w-32 rounded-full bg-muted">
                {/* Timing comes only from the utility classes — no inline transition style. */}
                <span
                  className={`absolute top-0 size-6 rounded-full bg-primary transition-[left] ease-enter ${track.className}`}
                  style={{ left: playing ? "calc(100% - 1.5rem)" : "0px" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Duration utilities">
        <TokenTable
          caption="duration-* — the @theme variable each class reads, and the semantic token behind it."
          columns={["Utility", "@theme variable", "Semantic token", "Value"]}
          rows={DURATION_ROLES.map((role) => ({
            token: `duration-${role.role}`,
            cells: [`--transition-duration-${role.role}`, role.cssVar, `${role.ms}ms`],
          }))}
        />
        <Callout title="Why the variables are called --transition-duration-*">
          Tailwind v4&rsquo;s <Code>duration-*</Code> utility reads the{" "}
          <Code>--transition-duration-*</Code> theme namespace. Defining only{" "}
          <Code>--duration-fast</Code> leaves <Code>duration-fast</Code> compiling to nothing, and
          the transition silently falls back to the browser default — the class is in the markup and
          has no effect. Both names are defined: <Code>--transition-duration-*</Code> makes the
          utilities exist, and <Code>--duration-*</Code> stays as a plain variable for anything that
          already reads it.
        </Callout>
      </Section>

      <Section title="Easing utilities">
        <TokenTable
          caption="ease-* — the semantic role names, and the original names that still resolve to the same curves."
          columns={["Utility", "Resolves to", "Compatibility alias"]}
          rows={EASE_UTILITIES.map((ease) => ({
            token: ease.utility,
            cells: [ease.role, ease.legacy || "—"],
          }))}
        />
        <Callout title="ease-decelerate, ease-accelerate and ease-sharp still resolve">
          They are the original primitive names, kept for compatibility, and they point at exactly
          the same curves as <Code>ease-enter</Code>, <Code>ease-exit</Code> and{" "}
          <Code>ease-emphasized</Code>. New code should use the semantic names: they read as intent,
          the old ones as mechanics.
        </Callout>
      </Section>
    </Page>
  );
}

export const Utilities: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The Tailwind classes generated from the motion roles. The dots here are timed by `duration-*` and `ease-enter` classes alone, so the specimen fails visibly if a utility stops compiling.",
      },
    },
  },
  render: () => <UtilitiesSpecimen />,
};

/* ── Enter / exit ─────────────────────────────────────────────────────────── */

function EnterExitSpecimen() {
  const [open, setOpen] = useState(true);
  return (
    <Page>
      <Section title="Enter and exit are not the same motion">
        <Prose>
          An arriving surface decelerates so the eye can land on it; a leaving surface accelerates
          so it gets out of the way. That asymmetry is why <Code>enter</Code> and <Code>exit</Code>{" "}
          are separate roles rather than one shared curve. Here the panel enters at{" "}
          <Code>normal</Code> and leaves at <Code>fast</Code>, because nobody needs to watch
          something disappear.
        </Prose>
        <div>
          <Button onClick={() => setOpen((value) => !value)}>
            {open ? "Dismiss panel" : "Show panel"}
          </Button>
        </div>
        <div className="min-h-28">
          <div
            className="max-w-md rounded-lg border border-border bg-card p-4 text-sm text-card-foreground shadow-popover"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0) scale(1)" : "translateY(-0.5rem) scale(0.97)",
              transitionProperty: "opacity, transform",
              transitionDuration: open
                ? "var(--qx-motion-duration-normal)"
                : "var(--qx-motion-duration-fast)",
              transitionTimingFunction: open
                ? "var(--qx-motion-easing-enter)"
                : "var(--qx-motion-easing-exit)",
            }}
          >
            <p className="font-medium text-foreground">Session expires in 5 minutes</p>
            <p className="mt-1 text-muted-foreground">
              Entering on the enter curve; leaving on the exit curve.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Composing a transition from JavaScript">
        <Prose>
          <Code>transition()</Code> builds a CSS transition string from the same tokens, for the
          cases where the value has to be computed. <Code>useMotion()</Code> wraps it and returns{" "}
          <Code>&quot;none&quot;</Code> when the user prefers reduced motion, so JavaScript-driven
          motion opts out the same way CSS does.
        </Prose>
        <TokenTable
          caption="transition(properties, options) and the string it produces."
          columns={["Call", "Result"]}
          rows={[
            { token: 'transition("opacity")', cells: [transition("opacity")] },
            {
              token: 'transition("transform", { duration: "fast", easing: "decelerate" })',
              cells: [transition("transform", { duration: "fast", easing: "decelerate" })],
            },
            {
              token: 'transition(["opacity", "transform"], { duration: "slow" })',
              cells: [transition(["opacity", "transform"], { duration: "slow" })],
            },
          ]}
        />
      </Section>
    </Page>
  );
}

export const EnterAndExit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The enter/exit pairing, and the typed `transition()` helper that produces the same values for motion driven outside CSS.",
      },
    },
  },
  render: () => <EnterExitSpecimen />,
};

/* ── Reduced motion ───────────────────────────────────────────────────────── */

function ReducedMotionSpecimen() {
  const reduced = usePrefersReducedMotion();
  return (
    <Page>
      <Section title="Reduced motion">
        <Prose>
          <Code>prefers-reduced-motion</Code> is honoured once, for everything, in the host-global
          base layer of <Code>@qeetrix/ui/styles.css</Code> — not per component, which is how a
          library ends up with half of it respecting the preference. Every transition duration and
          animation duration collapses to <Code>--qx-motion-reduced-duration</Code>, animations run
          exactly once, and <Code>scroll-behavior</Code> drops to <Code>auto</Code>.
        </Prose>
        <Callout title="Why transitions collapse to almost zero, and animations to zero">
          For transitions the base layer writes{" "}
          <Code>max(var(--qx-motion-reduced-duration), 0.01ms)</Code> rather than a flat{" "}
          <Code>0s</Code>: Base UI waits for <Code>transitionend</Code> before unmounting an
          overlay, and a transition that never starts never ends — which would leave the overlay
          mounted forever. Animations take the token as-is, with no floor. Base UI waits for them
          through <Code>getAnimations().finished</Code>, which a zero-length animation satisfies at
          once, and a floor overrode Base UI&rsquo;s own inline <Code>animation-duration: 0s</Code>{" "}
          on an accordion panel that opens on mount.
        </Callout>
        <TokenTable
          caption="--qx-motion-reduced-* — what motion collapses to."
          columns={["Token", "Value", "Note"]}
          rows={[
            {
              token: "--qx-motion-reduced-duration",
              cells: ["0ms", "transitions clamp it to 0.01ms; animations and delays use it as-is"],
            },
            {
              token: "--qx-motion-reduced-easing",
              cells: ["linear", "irrelevant at zero duration; predictable for in-flight runs"],
            },
          ]}
        />
      </Section>

      <Section title="Live preference">
        <Prose>
          Read here from <Code>usePrefersReducedMotion()</Code>, which subscribes to the media query
          rather than sampling it once. Use it only for motion CSS cannot reach — a spring driven in
          JavaScript, a canvas animation, an auto-advancing carousel. Anything animated with a CSS
          transition is already covered.
        </Prose>
        <p className="text-sm text-foreground">
          This browser currently reports{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
            {reduced ? "prefers-reduced-motion: reduce" : "prefers-reduced-motion: no-preference"}
          </code>
          .
        </p>
      </Section>
    </Page>
  );
}

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "How the library collapses motion when the operating system asks it to, and the hook to reach for when CSS cannot see the animation.",
      },
    },
  },
  render: () => <ReducedMotionSpecimen />,
};
