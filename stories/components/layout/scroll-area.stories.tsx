import { ScrollArea, Separator } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/Layout/Scroll Area",
  component: ScrollArea,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Cross-browser scrollable container with a styled, always-visible-on-hover scrollbar — ideal for audit-event feeds in qeet-logs, member lists in qeet-people, and notification histories in qeet-notify. Supports both vertical and horizontal scrolling; set a fixed `height` or `width` to constrain the scroll viewport.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const TAGS = Array.from({ length: 40 }, (_, i) => `audit-event-${1000 + i}`);

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Vertical scroll area listing 40 audit events — the styled scrollbar appears on hover.",
      },
    },
  },
  render: () => (
    <ScrollArea className="h-56 w-64 rounded-lg border">
      <div className="p-3">
        <div className="text-sm font-medium">Recent audit events</div>
        {TAGS.map((tag) => (
          <div key={tag}>
            <div className="py-1.5 text-sm text-muted-foreground">{tag}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal scroll area for wide content such as a time-series chart thumbnail strip or a media carousel.",
      },
    },
  },
  render: () => (
    <ScrollArea className="w-72 rounded-lg border whitespace-nowrap">
      <div className="flex gap-3 p-3">
        {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className="flex size-24 shrink-0 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground"
          >
            {n}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
