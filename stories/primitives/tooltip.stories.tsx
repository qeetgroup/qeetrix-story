import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A short informational label that appears on hover or focus. Use it to clarify icon-only controls, expose keyboard shortcuts, and surface contextual hints — for example explaining what a passkey rotation policy does or why a setting is locked for Viewer-role users.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Tooltip on an action button explaining the auto-rotation policy for API keys.",
      },
    },
  },
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Rotate key</Button>} />
        <TooltipContent>Rotates every 90 days — current key expires 2026-09-15</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const BottomSide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip anchored below the trigger via `side="bottom"` — useful beneath icon-only toolbar buttons.',
      },
    },
  },
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon">
              ⌘K
            </Button>
          }
        />
        <TooltipContent side="bottom">Open command palette</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
