import { InfoIcon } from "@qeetrix/icons/icons/info";
import { PlayIcon } from "@qeetrix/icons/icons/play";
import { TriangleAlertIcon } from "@qeetrix/icons/icons/triangle-alert";
import { XIcon } from "@qeetrix/icons/icons/x";
import { Badge, Button, IconButton, Switch, Text } from "@qeetrix/react";
import { DURATION, EASING, SPRING } from "@qeetrix/tokens";
import light from "@qeetrix/tokens/dtcg/light.tokens.json";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type CSSProperties, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { expect } from "storybook/test";

import { CopyToken, Group, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import { format, ordered, type Token, TokenTable, token, tokens } from "./_foundation";
import "./_motion.css";

const meta: Meta = {
  title: "Foundations/Motion",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Quick, productive motion: nothing runs past 400ms, and every duration is 0ms under reduced motion.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

/* ── Shared ───────────────────────────────────────────────────────────────── */

const DURATIONS = tokens("motion.duration").sort(
  (a, b) =>
    (DURATION[a.name as keyof typeof DURATION] ?? 0) -
    (DURATION[b.name as keyof typeof DURATION] ?? 0),
);

/** Reading order: the everyday curve, the enter and exit pair, then the rest. */
const EASINGS = ordered(tokens("motion.easing"), [
  "standard",
  "enter",
  "exit",
  "emphasized",
  "linear",
]);

/** A token's `$description` in the package's DTCG document: what it is for. */
function usage(path: string): string | undefined {
  let node: unknown = light;
  for (const key of path.split(".")) node = (node as Record<string, unknown> | undefined)?.[key];
  return (node as { $description?: string } | undefined)?.$description;
}

/** How many times slower Slow motion plays. A multiple of the token, so reduced motion still wins. */
const SLOW = 4;

/** The custom properties a demo's CSS reads (`--qx-*` is left to the package's own tokens). */
const demoVars = (vars: Record<string, string | number>) =>
  Object.fromEntries(
    Object.entries(vars).map(([key, value]) => [`--motion-${key}`, value]),
  ) as CSSProperties;

const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(REDUCED);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/**
 * The toolbar each demo puts in its group's head: Play replays it, Slow motion stretches it, and a
 * badge says why nothing moves while the system asks for reduced motion.
 */
function Controls({
  onPlay,
  slow,
  onSlowChange,
}: {
  onPlay: () => void;
  slow: boolean;
  onSlowChange: (slow: boolean) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <span className="qx-motion-controls">
      {reduced && (
        <Badge tone="info" size="sm" icon={InfoIcon}>
          Reduced motion: 0ms
        </Badge>
      )}
      <Switch label="Slow motion" checked={slow} onCheckedChange={(on) => onSlowChange(on)} />
      <Button variant="soft" size="sm" icon={PlayIcon} onClick={onPlay}>
        Play
      </Button>
    </span>
  );
}

/* ── Duration ─────────────────────────────────────────────────────────────── */

/**
 * A dot that crosses its rail in one duration, with a trail filling in behind it. A new `run`
 * remounts the moving parts, which restarts their animation from the start.
 */
function Track({ run, cssVar, slow }: { run: number; cssVar: string; slow: boolean }) {
  return (
    <span
      className="qx-motion-track"
      data-run={run > 0 ? "" : undefined}
      style={demoVars({ duration: `calc(var(${cssVar}) * ${slow ? SLOW : 1})` })}
      aria-hidden="true"
    >
      <span key={`trail-${run}`} className="qx-motion-trail" />
      <span key={`dot-${run}`} className="qx-motion-dot" />
    </span>
  );
}

function DurationSpecimen() {
  const [run, setRun] = useState(0);
  const [slow, setSlow] = useState(false);
  return (
    <Specimen>
      <Group
        label="Scale"
        aside={
          <Controls
            onPlay={() => setRun((count) => count + 1)}
            slow={slow}
            onSlowChange={setSlow}
          />
        }
      >
        <SpecimenRows>
          {DURATIONS.map((item) => (
            <SpecimenRow
              key={item.path}
              token={item.cssVar}
              meta={`${format(item.type, item.light)} · DURATION.${item.name}`}
            >
              <span className="qx-motion-lane">
                <Track run={run} cssVar={item.cssVar} slow={slow} />
                <span className="qx-motion-note">
                  {usage(item.path) ?? "No motion: the change is immediate."}
                </span>
              </span>
            </SpecimenRow>
          ))}
        </SpecimenRows>
      </Group>
    </Specimen>
  );
}

export const Duration: Story = {
  parameters: {
    docs: {
      description: {
        story: "How long a change takes, scaled to how much moves. Play runs every step at once.",
      },
    },
  },
  render: () => <DurationSpecimen />,
};

/* ── Easing ───────────────────────────────────────────────────────────────── */

/**
 * The curve on a 100 × 100 plot, time running right and progress up, with its control handles. On
 * Play a dot traces it: its group moves through time linearly while the dot rises on the curve
 * itself, so together they draw the shape. The rail on the right is the progress alone, the way the
 * property changes on screen.
 */
function CurvePlot({ points, run }: { points: number[]; run: number }) {
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = points;
  const p1 = [x1 * 100, 100 - y1 * 100] as const;
  const p2 = [x2 * 100, 100 - y2 * 100] as const;
  const linear = x1 === y1 && x2 === y2;
  return (
    <svg
      className="qx-motion-plot"
      viewBox="-6 -6 136 112"
      data-run={run > 0 ? "" : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <g className="qx-motion-plot-grid">
        <rect x="0" y="0" width="100" height="100" />
        {[25, 50, 75].map((at) => (
          <g key={at}>
            <line x1={at} y1="0" x2={at} y2="100" />
            <line x1="0" y1={at} x2="100" y2={at} />
          </g>
        ))}
      </g>
      <line className="qx-motion-plot-diagonal" x1="0" y1="100" x2="100" y2="0" />
      {!linear && (
        <g className="qx-motion-plot-handles">
          <line x1="0" y1="100" x2={p1[0]} y2={p1[1]} />
          <line x1="100" y1="0" x2={p2[0]} y2={p2[1]} />
          <circle cx={p1[0]} cy={p1[1]} r="2.25" />
          <circle cx={p2[0]} cy={p2[1]} r="2.25" />
        </g>
      )}
      <path
        className="qx-motion-plot-curve"
        d={`M0,100 C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} 100,0`}
      />
      <line className="qx-motion-plot-rail" x1="120" y1="0" x2="120" y2="100" />
      <g key={`time-${run}`} className="qx-motion-plot-time">
        <rect className="qx-motion-plot-dot" x="-3.5" y="96.5" width="7" height="7" rx="1" />
      </g>
      <rect
        key={`rail-${run}`}
        className="qx-motion-plot-dot"
        x="116.5"
        y="96.5"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  );
}

function CurveCard({ item, run }: { item: Token; run: number }) {
  const note = usage(item.path);
  return (
    <div className="qx-motion-curve" style={demoVars({ easing: `var(${item.cssVar})` })}>
      <div className="qx-motion-plot-frame">
        <CurvePlot points={item.light as number[]} run={run} />
      </div>
      <div className="qx-motion-curve-meta">
        <span className="qx-motion-curve-name">{item.name}</span>
        <CopyToken value={item.cssVar} />
        <code className="qx-motion-curve-value">{EASING[item.name as keyof typeof EASING]}</code>
        {note && <span className="qx-motion-note">{note}</span>}
      </div>
    </div>
  );
}

function EasingSpecimen() {
  const [run, setRun] = useState(0);
  const [slow, setSlow] = useState(false);
  return (
    <Specimen>
      <Group
        label="Curves"
        aside={
          <Controls
            onPlay={() => setRun((count) => count + 1)}
            slow={slow}
            onSlowChange={setSlow}
          />
        }
      >
        <div className="qx-motion-curves" style={demoVars({ slow: slow ? SLOW : 1 })}>
          {EASINGS.map((item) => (
            <CurveCard key={item.path} item={item} run={run} />
          ))}
        </div>
      </Group>
    </Specimen>
  );
}

export const Easing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "How a change speeds up and slows down. All share one duration, so only the shape differs.",
      },
    },
  },
  render: () => <EasingSpecimen />,
};

/* ── Enter and exit ───────────────────────────────────────────────────────── */

const PHASES = [
  {
    phase: "enter",
    label: "Enter",
    duration: token("motion.duration.normal"),
    easing: token("motion.easing.enter"),
    note: "Fades in and rises 4px, slowing to rest.",
  },
  {
    phase: "exit",
    label: "Exit",
    duration: token("motion.duration.fast"),
    easing: token("motion.easing.exit"),
    note: "Fades out and drops 4px, speeding away.",
  },
] as const;

type Phase = (typeof PHASES)[number]["phase"];

/** How long the toast stays away, after its exit, before Play brings it back. */
const HOLD = 700;

/**
 * A toast drawn with @qeetrix/react's own toast styling, so what moves is the component's motion,
 * not a copy of it. Base UI marks a leaving toast `data-ending-style`: the demo sets the same
 * attribute to dismiss it, and removes it to run the toast's enter transition.
 */
function EnterExitSpecimen() {
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [slow, setSlow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const enter = () => {
    setOpen(true);
    setPhase("enter");
  };
  const exit = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
    setPhase("exit");
  };
  const play = () => {
    window.clearTimeout(timer.current);
    if (!open) return enter();
    exit();
    timer.current = window.setTimeout(enter, DURATION.fast * (slow ? SLOW : 1) + HOLD);
  };

  return (
    <Specimen>
      <Group label="Toast" aside={<Controls onPlay={play} slow={slow} onSlowChange={setSlow} />}>
        <div className="qx-motion-enter">
          <div
            className="qx-motion-stage"
            data-slow={slow ? "" : undefined}
            style={demoVars({ slow: SLOW })}
          >
            <span className="qx-motion-stage-page" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <div
              className="qx-toast qx-motion-toast"
              data-slot="toast"
              data-tone="warning"
              data-ending-style={open ? undefined : ""}
              inert={!open}
            >
              <TriangleAlertIcon
                shape="sharp"
                size={18}
                aria-hidden
                className="qx-toast-icon"
                data-slot="toast-icon"
              />
              <div className="qx-toast-content" data-slot="toast-content">
                <div className="qx-toast-title" data-slot="toast-title">
                  Session expires in 5 minutes
                </div>
                <div className="qx-toast-description" data-slot="toast-description">
                  Save your changes to keep them.
                </div>
              </div>
              <IconButton
                icon={XIcon}
                aria-label="Dismiss notification"
                size="sm"
                tone="neutral"
                tooltip={false}
                onClick={exit}
              />
            </div>
          </div>
          <div className="qx-motion-phases">
            {PHASES.map((item) => (
              <div
                key={item.phase}
                className="qx-motion-phase"
                data-active={phase === item.phase ? "" : undefined}
              >
                <span className="qx-motion-phase-head">
                  <span className="qx-specimen-label">{item.label}</span>
                  <code>{format(item.duration.type, item.duration.light)}</code>
                </span>
                <CopyToken value={item.duration.cssVar} />
                <CopyToken value={item.easing.cssVar} />
                <span className="qx-motion-note">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      </Group>
    </Specimen>
  );
}

export const EnterAndExit: Story = {
  name: "Enter and exit",
  parameters: {
    docs: {
      description: {
        story:
          "A toast arrives at normal and decelerates; it leaves one step faster and accelerates.",
      },
    },
  },
  render: () => <EnterExitSpecimen />,
};

/* ── Springs ──────────────────────────────────────────────────────────────── */

/** The peak overshoot of a mass-1 spring: none when it is critically damped or more. */
function overshoot(dampingRatio: number): string {
  if (dampingRatio >= 1) return "None";
  const peak = Math.exp((-dampingRatio * Math.PI) / Math.sqrt(1 - dampingRatio ** 2));
  return `${(peak * 100).toFixed(2)}%`;
}

export const Springs: Story = {
  parameters: {
    docs: {
      description: { story: "For native platforms; the web uses durations and curves." },
    },
  },
  render: () => (
    <Specimen>
      <TokenTable
        caption="Springs"
        columns={["Export", "Stiffness", "Damping ratio", "Overshoot", "SwiftUI response"]}
        rows={Object.entries(SPRING).map(([name, spring]) => ({
          token: `SPRING.${name}`,
          cells: [
            String(spring.stiffness),
            String(spring.dampingRatio),
            overshoot(spring.dampingRatio),
            `${((2 * Math.PI) / Math.sqrt(spring.stiffness)).toFixed(3)}s`,
          ],
        }))}
      />
    </Specimen>
  ),
};

/* ── Hidden test: the typed exports and the stylesheet agree ──────────────── */

export const InteractionExportsMatchCss: Story = {
  name: "Interaction: DURATION and EASING match the CSS",
  tags: ["!dev", "!autodocs"],
  render: () => <Text size="sm">Checks the typed exports against the loaded stylesheet.</Text>,
  play: async () => {
    const style = getComputedStyle(document.documentElement);
    const css = (name: string) => style.getPropertyValue(`--qx-motion-${name}`).trim();
    const reduced = window.matchMedia(REDUCED).matches;
    for (const [name, ms] of Object.entries(DURATION)) {
      await expect(css(`duration-${name}`)).toBe(reduced ? "0ms" : `${ms}ms`);
    }
    for (const [name, curve] of Object.entries(EASING)) {
      await expect(css(`easing-${name}`)).toBe(curve);
    }
  },
};
