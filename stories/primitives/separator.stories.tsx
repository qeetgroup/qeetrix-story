import { Separator } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Thin visual divider for separating sections of content — settings panels, profile pages, and sidebar navigation groups. Renders horizontal by default; pass `orientation="vertical"` for inline use between breadcrumb items or toolbar actions.',
      },
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
