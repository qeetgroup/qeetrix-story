import { IconButton } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Copy, More, Search, Settings, Trash } from "@qeetrix/icons";

const meta: Meta<typeof IconButton> = {
  title: "Primitives/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An icon-only button that enforces an accessible `aria-label` at the TypeScript level — the prop is required and non-optional. Accepts any Qeetrix icon component via the `icon` prop. Three sizes: `icon-sm` (28 × 28 px), `icon` (32 × 32 px, default), and `icon-lg` (40 × 40 px). Follows the APG [button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Settings icon at the default `icon` size with `ghost` variant — the standard configuration for toolbar and action-menu triggers.",
      },
    },
  },
  render: () => <IconButton icon={Settings} aria-label="Open settings" />,
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`icon-sm` size (28 × 28 px) for compact toolbars and table-row inline actions such as copying an API key.",
      },
    },
  },
  render: () => <IconButton icon={Copy} aria-label="Copy API key" size="icon-sm" />,
};

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`icon-lg` size (40 × 40 px) for prominent single-action areas such as a global search trigger in the Qeet ID header.",
      },
    },
  },
  render: () => <IconButton icon={Search} aria-label="Search" size="icon-lg" />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four variants side by side — `ghost` (default) for toolbars; `outline` and `default` for more prominent action slots; `secondary` for neutral emphasis.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton icon={Bell} aria-label="Notifications (ghost)" variant="ghost" />
      <IconButton icon={Bell} aria-label="Notifications (outline)" variant="outline" />
      <IconButton icon={Bell} aria-label="Notifications (default)" variant="default" />
      <IconButton icon={Bell} aria-label="Notifications (secondary)" variant="secondary" />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state while a destructive confirmation dialog is open — prevents double-trigger of the delete action.",
      },
    },
  },
  render: () => <IconButton icon={Trash} aria-label="Delete workspace" disabled />,
};

export const Gallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Representative icons used across Qeet products: notification bell, copy, settings, overflow menu, and delete — each with a unique accessible label.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton icon={Bell} aria-label="Notifications" />
      <IconButton icon={Copy} aria-label="Copy to clipboard" />
      <IconButton icon={Settings} aria-label="Open settings" />
      <IconButton icon={More} aria-label="More options" />
      <IconButton icon={Trash} aria-label="Delete item" />
    </div>
  ),
};
