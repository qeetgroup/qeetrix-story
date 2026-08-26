import { Button, Portal } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Portal> = {
  title: "Components/Utilities/Portal",
  component: Portal,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Renders its children into `document.body` (or a custom `container` element) via `React.createPortal`. Mounting is deferred to the client to avoid SSR hydration mismatches. Use `Portal` for custom overlay patterns — floating annotations, live-region announcements, or editor-layer elements — that are not covered by the higher-level `Dialog`, `Drawer`, or `Sheet` primitives. The rendered subtree still inherits your CSS custom properties so Qeetrix tokens (colours, radius, etc.) apply correctly.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Portal>;

function PortalDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen((v) => !v)}>
        {open ? "Remove portal content" : "Render into document.body"}
      </Button>
      <p className="text-xs text-muted-foreground max-w-xs text-center">
        When active, the floating banner below is mounted directly on{" "}
        <code className="bg-muted px-1 rounded">document.body</code> — outside this component's DOM
        subtree. Inspect the DOM to confirm.
      </p>
      {open && (
        <Portal>
          <div
            role="status"
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg text-sm"
          >
            <span className="size-2 rounded-full bg-green-500" aria-hidden />
            <span className="font-medium text-foreground">Portal mounted on document.body</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </Portal>
      )}
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click the button to portal a floating banner into `document.body`. The banner sits outside the story's DOM subtree — confirm by opening DevTools and inspecting the bottom of `<body>`.",
      },
    },
  },
  render: () => <PortalDemo />,
};

function CustomContainerDemo() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 w-80">
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        {open ? "Remove from container" : "Render into custom container"}
      </Button>
      <div
        ref={containerRef}
        className="relative min-h-24 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground"
      >
        Custom container target
        {open && containerRef.current && (
          <Portal container={containerRef.current}>
            <div className="mt-6 rounded-md bg-background border px-3 py-2 text-sm font-medium text-foreground shadow-sm">
              Content portalled into the dashed box above
            </div>
          </Portal>
        )}
      </div>
    </div>
  );
}

export const CustomContainer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass a custom `container` ref to portal content into a specific DOM node rather than `document.body`. Useful for layering UI inside scoped scroll containers or editor canvases.",
      },
    },
  },
  render: () => <CustomContainerDemo />,
};
