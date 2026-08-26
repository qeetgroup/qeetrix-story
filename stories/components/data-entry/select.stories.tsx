import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Select> = {
  title: "Components/Data Entry/Select",
  component: Select,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A dropdown that lets users pick one option from a list. Supports grouped options via `SelectGroup` + `SelectLabel`, and a `size` prop (`"sm"` | `"default"`). Used in Qeet ID for region and MFA-method selection, and in qeet-logs for log retention tier and data-center routing.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Data-residency region picker for a Qeet ID tenant — options are grouped by continent.",
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-56" aria-label="Data region">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="ap-south-1">Mumbai (ap-south-1)</SelectItem>
          <SelectItem value="ap-southeast-1">Singapore (ap-southeast-1)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="eu-west-1">Ireland (eu-west-1)</SelectItem>
          <SelectItem value="eu-central-1">Frankfurt (eu-central-1)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="us-east-1">N. Virginia (us-east-1)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Compact `sm` trigger for dense table-row controls, e.g. changing a member's role in the Qeet ID org panel.",
      },
    },
  },
  render: () => (
    <Select defaultValue="member">
      <SelectTrigger size="sm" className="w-36" aria-label="Member role">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const SelectInteraction: Story = {
  name: "Interaction: choosing an option",
  parameters: {
    docs: {
      description: {
        story:
          "The listbox is portalled and the trigger displays the chosen label, so this asserts the full round trip: open, pick, close, and the trigger reflecting the selection.",
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-56" aria-label="Data region">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ap-south-1">Mumbai (ap-south-1)</SelectItem>
        <SelectItem value="eu-west-1">Ireland (eu-west-1)</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Data region" });

    await userEvent.click(trigger);

    const option = await screen.findByRole("option", { name: "Mumbai (ap-south-1)" });
    await waitFor(() => expect(option).toBeVisible());

    await userEvent.click(option);

    await waitFor(() => expect(trigger).toHaveTextContent("Mumbai (ap-south-1)"));
  },
};
