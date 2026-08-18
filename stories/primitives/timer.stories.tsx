import { Badge, formatTime, Timer, useTimer } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof Timer> = {
  title: "Primitives/Timer",
  component: Timer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A countdown or stopwatch display with optional Start/Pause and Reset controls. Two display formats: `mm:ss` folds hours into minutes; `hh:mm:ss` always shows hours. The `useTimer` hook exposes the raw timer state for custom UIs, and the `formatTime` helper converts raw seconds to either format string. Use Timer for TOTP code expiry countdowns in Qeet ID, session-idle warnings in any Qeet product, and elapsed-time display in Qeet Logs search result headers.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Timer>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Stopwatch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Stopwatch mode — measures elapsed time. Press Start to begin, Pause to freeze, Reset to return to 00:00.",
      },
    },
  },
  render: () => <Timer mode="stopwatch" aria-label="Elapsed time stopwatch" />,
};

export const Countdown: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "30-second TOTP countdown — mimics the OTP expiry indicator shown in Qeet ID's authenticator setup screen.",
      },
    },
  },
  render: () => {
    const [expired, setExpired] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        {expired && <Badge variant="destructive">Code expired — generate a new one</Badge>}
        <Timer
          mode="countdown"
          initialSeconds={30}
          aria-label="TOTP expiry countdown"
          onComplete={() => setExpired(true)}
          key={expired ? "expired" : "active"}
        />
        {expired && (
          <button
            type="button"
            className="text-xs text-primary underline underline-offset-2"
            onClick={() => setExpired(false)}
          >
            Reset demo
          </button>
        )}
      </div>
    );
  },
};

export const HhMmSsFormat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "hh:mm:ss format — used for long-running operations such as background data export jobs in Qeet Logs.",
      },
    },
  },
  render: () => <Timer mode="stopwatch" format="hh:mm:ss" aria-label="Job elapsed time" />,
};

export const NoControls: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`showControls={false}` with `autoStart` — a read-only display driven by the parent, e.g. a session-idle warning banner that begins counting the moment it mounts.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/40">
      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
        Your session will expire in
      </p>
      <Timer
        mode="countdown"
        initialSeconds={300}
        autoStart
        showControls={false}
        aria-label="Session idle countdown"
      />
      <p className="text-xs text-yellow-700 dark:text-yellow-300">
        Move your mouse or press any key to extend.
      </p>
    </div>
  ),
};

export const CustomUseTimer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Using the `useTimer` hook directly to build a fully custom UI — a TOTP progress ring that ticks down 30 seconds alongside a formatted label.",
      },
    },
  },
  render: () => {
    const TOTAL = 30;
    const { remaining, isRunning, toggle, reset } = useTimer({
      mode: "countdown",
      initialSeconds: TOTAL,
    });

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = (remaining / TOTAL) * circumference;
    const isUrgent = remaining <= 10;

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <svg width={72} height={72} className="-rotate-90" aria-hidden="true">
            <circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              className="text-muted/30"
            />
            <circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              strokeWidth={4}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className={
                isUrgent
                  ? "stroke-destructive transition-all duration-1000"
                  : "stroke-primary transition-all duration-1000"
              }
            />
          </svg>
          <span
            role="timer"
            aria-label="TOTP code expiry"
            aria-live="off"
            className={`absolute font-mono text-sm font-semibold tabular-nums ${isUrgent ? "text-destructive" : ""}`}
          >
            {formatTime(remaining, "mm:ss")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded border px-3 py-1 text-xs font-medium"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded border px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};
