import { FloatingWindow } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof FloatingWindow> = {
  title: "Primitives/FloatingWindow",
  component: FloatingWindow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A draggable, non-modal floating panel (`role=dialog`, `aria-modal=false`) that does not trap focus or block the page. Use it for contextual help overlays in qeet-docs, detachable log-detail inspectors in qeet-logs, or an in-context AI assistant widget — anywhere the user needs a secondary view without leaving their current context.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FloatingWindow>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drag by the header bar to reposition — the window stays within viewport bounds automatically.",
      },
    },
  },
  render: () => (
    <div className="relative h-80">
      <FloatingWindow title="Log inspector" defaultPosition={{ x: 40, y: 40 }} onClose={() => {}}>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">2026-06-14T08:32:11Z</p>
          <p className="text-sm font-semibold text-destructive">ERROR auth.middleware</p>
          <p className="text-sm text-muted-foreground">
            Token signature invalid — expected RS256, received none. Request id:{" "}
            <code className="rounded bg-muted px-1 font-mono text-xs">req_01j2xq8vknfa3pm7</code>
          </p>
        </div>
      </FloatingWindow>
    </div>
  ),
};

export const NoCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Omit `onClose` for persistent widgets that should not be dismissed — e.g. a live qeet-logs tail view pinned to the corner.",
      },
    },
  },
  render: () => (
    <div className="relative h-80">
      <FloatingWindow title="Live log tail" defaultPosition={{ x: 40, y: 40 }} width={280}>
        <p className="font-mono text-xs text-muted-foreground">
          [08:32:14] auth: passkey assertion ok — user_01j2xq
          <br />
          [08:32:15] billing: invoice INV-0044 paid ₹4,872
          <br />
          [08:32:16] notify: webhook delivered (200 OK)
        </p>
      </FloatingWindow>
    </div>
  ),
};
