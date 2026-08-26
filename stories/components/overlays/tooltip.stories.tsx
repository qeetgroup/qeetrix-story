import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
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

export const HoverInteraction: Story = {
  name: "Interaction: hover reveals the tooltip",
  parameters: {
    docs: {
      description: {
        story:
          "Tooltips open on a delay, so the assertion polls for the content rather than checking immediately — a first-frame check would pass or fail depending on machine speed.",
      },
    },
  },
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Rotate key</Button>} />
        <TooltipContent>Rotates every 90 days</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Rotate key" });

    await userEvent.hover(trigger);

    const tip = await screen.findByText("Rotates every 90 days");
    await waitFor(() => expect(tip).toBeVisible());

    // Only the visual reveal is asserted, because that is all that currently works.
    //
    // KNOWN GAP: the tooltip is not associated with its trigger in the accessibility
    // tree. The popup renders no `role="tooltip"` and the trigger carries no
    // `aria-describedby`, so a screen-reader user hears "Rotate key" and never the
    // tooltip text — which is where the actual information lives. Fixing that belongs
    // in @qeetrix/ui's Tooltip, not here; when it lands, add:
    //     await expect(trigger).toHaveAccessibleDescription("Rotates every 90 days");
    // Note axe does not flag this, and the library's own jsdom test only checks that
    // the text exists in the DOM.
  },
};
