import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Components/Layout/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Drag-to-resize panel layout built on `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle`. Use it for split-pane interfaces — log viewer with a detail drawer, code editor with an inline console, or a master-detail layout in qeet-people. Pass `defaultSize` and `minSize` as percentage strings to control panel proportions.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal split with a sidebar and main content pane — drag the handle to redistribute space.",
      },
    },
  },
  render: () => (
    <div className="h-64 w-xl overflow-hidden rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          defaultSize="35%"
          minSize="20%"
          className="flex items-center justify-center p-4 text-sm text-muted-foreground"
        >
          Sidebar
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="65%" className="flex items-center justify-center p-4 text-sm">
          Content
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Vertical split for a code editor above a live console — resize to give more room to whichever pane needs it.",
      },
    },
  },
  render: () => (
    <div className="h-72 w-96 overflow-hidden rounded-lg border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="50%" className="flex items-center justify-center p-4 text-sm">
          Editor
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize="50%"
          className="flex items-center justify-center p-4 text-sm text-muted-foreground"
        >
          Console
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
