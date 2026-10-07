import { Separator } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Separator> = {
  title: "Components/Layout/Separator",
  component: Separator,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Thin visual divider for separating sections of content — settings panels, profile pages, and sidebar navigation groups. Renders horizontal by default; pass `orientation="vertical"` for inline use between breadcrumb items or toolbar actions.\n\nTwo weights, one hierarchy: `variant="default"` (the border role) divides sections, groups and toolbars; `variant="muted"` (the subtle border role, one step quieter) divides items *inside* a section — list rows, menu entries, card metadata. Both are decorative by design; a separator supports grouping that spacing and headings already express. The classes are exported as `separatorVariants` for composing the same rule onto another element.',
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal rule between settings sections — Account and Security panels in Qeet ID.",
      },
    },
  },
  render: () => (
    <div className="w-72 text-sm">
      <p>Account</p>
      <Separator className="my-3" />
      <p>Security</p>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Vertical separator for inline use between breadcrumb segments or toolbar action groups.",
      },
    },
  },
  render: () => (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Dashboard</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
      <Separator orientation="vertical" />
      <span>API Keys</span>
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Both weights in one Qeet ID settings panel: the `default` rule divides the Sessions section from the Passkeys section, and `muted` rules divide the rows inside each section — a default rule there would draw more lines than the content needs.",
      },
    },
  },
  render: () => (
    <div className="w-80 text-sm">
      <p className="font-medium">Sessions</p>
      <div className="mt-1 flex flex-col text-muted-foreground">
        <p className="py-2">MacBook Pro · Bengaluru · now</p>
        <Separator variant="muted" />
        <p className="py-2">Pixel 9 · Bengaluru · 2 h ago</p>
      </div>
      <Separator className="my-3" />
      <p className="font-medium">Passkeys</p>
      <div className="mt-1 flex flex-col text-muted-foreground">
        <p className="py-2">iCloud Keychain · added 12 Jan 2026</p>
        <Separator variant="muted" />
        <p className="py-2">YubiKey 5C · added 3 Mar 2026</p>
      </div>
    </div>
  ),
};
