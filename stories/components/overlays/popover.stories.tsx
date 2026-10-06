import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Popover> = {
  title: "Components/Overlays/Popover",
  component: Popover,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A non-modal floating panel anchored to a trigger element. Use it for quick inline edits, filter pickers, and contextual forms that don't need the full focus-trap of a `Dialog` — for example editing a webhook endpoint, adjusting a notification preference in qeet-notify, or picking date ranges in qeet-logs.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inline webhook endpoint editor — surfaces a small form anchored to the trigger without navigating away.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Edit webhook</Button>} />
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <PopoverTitle>Endpoint</PopoverTitle>
            <PopoverDescription>Where Qeet ID delivers event payloads.</PopoverDescription>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hook-url">URL</Label>
            <Input id="hook-url" defaultValue="https://api.acmeinc.io/qeet/hooks" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const OpenCloseInteraction: Story = {
  name: "Interaction: open and dismiss",
  parameters: {
    docs: {
      description: {
        story:
          "A popover holds focusable content, so it must be dismissable from the keyboard once opened — otherwise a keyboard user can enter it but not leave.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Edit webhook</Button>} />
      <PopoverContent>
        <PopoverTitle>Endpoint</PopoverTitle>
        <Label htmlFor="interaction-hook-url">URL</Label>
        <Input id="interaction-hook-url" defaultValue="https://api.acmeinc.io/qeet/hooks" />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit webhook" }));

    const url = await screen.findByLabelText("URL");
    await waitFor(() => expect(url).toBeVisible());

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByLabelText("URL")).not.toBeInTheDocument());
  },
};
