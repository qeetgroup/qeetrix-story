import { Button, Tour, useTour } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Tour> = {
  title: "Components/Overlays/Tour",
  component: Tour,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "A step-by-step guided product onboarding overlay. `Tour` spotlights a target DOM element (CSS selector) and displays a floating card with a title, body content, and Prev / Next / Done navigation. Supports both controlled (`open`) and uncontrolled (`defaultOpen`) modes, plus the `useTour` hook for fully programmatic control. A semi-transparent backdrop dims the page and dismisses the tour on click. Keyboard shortcuts: Escape to dismiss, ArrowRight to advance, ArrowLeft to go back.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Tour>;

// ---------------------------------------------------------------------------
// Shared step definitions
// ---------------------------------------------------------------------------

const ONBOARDING_STEPS = [
  {
    target: "[data-tour='search']",
    title: "Global search",
    content:
      "Press ⌘K to instantly find users, organisations, and audit events across your entire Qeet ID tenant.",
    placement: "bottom" as const,
  },
  {
    target: "[data-tour='org']",
    title: "Organisation switcher",
    content:
      "Switch between multiple tenants without logging out. Each tenant has its own members, policies, and passkey settings.",
    placement: "right" as const,
  },
  {
    target: "[data-tour='audit']",
    title: "Audit log",
    content:
      "Every sign-in, role change, and passkey event is recorded here. Filter by actor, resource type, or date range — then export to JSON or CSV.",
    placement: "top" as const,
  },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three-step onboarding tour started via `useTour`. Click Start tour to begin, then navigate with the Prev / Next buttons or arrow keys.",
      },
    },
  },
  render: () => {
    const tour = useTour(ONBOARDING_STEPS, {
      onComplete: () => alert("Tour complete!"),
      onDismiss: () => alert("Tour dismissed."),
    });

    return (
      <div className="flex min-h-64 flex-col gap-6 p-4">
        {/* Landmark elements the tour targets */}
        <div className="flex items-center gap-4">
          <button
            data-tour="search"
            className="flex h-9 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground"
            type="button"
          >
            Search…
            <kbd className="rounded bg-muted px-1 font-mono text-xs">⌘K</kbd>
          </button>
          <button
            data-tour="org"
            className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium"
            type="button"
          >
            Acme Inc.
            <span className="text-muted-foreground">▾</span>
          </button>
        </div>

        <div
          data-tour="audit"
          className="flex items-center justify-between rounded-lg border p-3 text-sm"
        >
          <span className="font-medium">Audit log</span>
          <span className="text-muted-foreground">1,284 events</span>
        </div>

        <Button onClick={tour.start} variant="outline" className="w-fit" disabled={tour.isOpen}>
          Start tour
        </Button>

        <Tour
          steps={ONBOARDING_STEPS}
          open={tour.isOpen}
          onOpenChange={(v) => {
            if (!v) tour.stop();
          }}
          onComplete={() => alert("Tour complete!")}
          onDismiss={() => tour.stop()}
        />
      </div>
    );
  },
};

export const DefaultOpen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tour started automatically via `defaultOpen` — useful for new-user onboarding triggered immediately after first login.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-64 flex-col gap-6 p-4">
      <div className="flex items-center gap-4">
        <button
          data-tour="search"
          className="flex h-9 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground"
          type="button"
        >
          Search…
          <kbd className="rounded bg-muted px-1 font-mono text-xs">⌘K</kbd>
        </button>
        <button
          data-tour="org"
          className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium"
          type="button"
        >
          Acme Inc.
          <span className="text-muted-foreground">▾</span>
        </button>
      </div>

      <div
        data-tour="audit"
        className="flex items-center justify-between rounded-lg border p-3 text-sm"
      >
        <span className="font-medium">Audit log</span>
        <span className="text-muted-foreground">1,284 events</span>
      </div>

      <Tour
        steps={ONBOARDING_STEPS}
        defaultOpen
        onComplete={() => undefined}
        onDismiss={() => undefined}
      />
    </div>
  ),
};

export const SingleStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A single-step tour — the Done button appears immediately, making it suitable for simple feature callouts.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex min-h-48 flex-col items-start gap-4 p-4">
        <button
          data-tour="new-feature"
          className="rounded-md border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          type="button"
        >
          Export to CSV
        </button>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show what is new
        </Button>

        <Tour
          steps={[
            {
              target: "[data-tour='new-feature']",
              title: "New — CSV export",
              content:
                "Export any filtered view of your audit log to CSV in one click. The file is signed and ready for your compliance team.",
              placement: "bottom",
            },
          ]}
          open={open}
          onOpenChange={setOpen}
          onComplete={() => setOpen(false)}
          onDismiss={() => setOpen(false)}
        />
      </div>
    );
  },
};
