import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ContextMenu> = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A menu triggered by right-click (or long-press on touch) on a target region. Use it to expose contextual actions on data rows, log entries, and file cards — keeping the primary UI clean while giving power users fast access to operations like copying an audit event ID, muting a qeet-notify channel, or deleting a log stream.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Right-click a log entry row to access copy, inspect, and delete actions without leaving the log stream view.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Right-click a log entry
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Copy event ID <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Open in inspector <ContextMenuShortcut>⌘↵</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>JSON</ContextMenuItem>
            <ContextMenuItem>CSV</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete event</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
