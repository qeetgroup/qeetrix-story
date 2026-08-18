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

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
  parameters: {
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
