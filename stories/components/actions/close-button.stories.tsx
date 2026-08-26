import { CloseButton } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof CloseButton> = {
  title: "Components/Actions/CloseButton",
  component: CloseButton,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A standalone dismiss button rendered as an icon-only `<button>` with a built-in `X` icon. Use inside Dialogs, Sheets, Notifications, and Alerts. Defaults to `ghost` variant and `icon-sm` size with an accessible label of "Close". The `aria-label` prop must be overridden when the dismiss target needs a more specific description.',
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["icon-sm", "icon"],
      description:
        "`icon-sm` (28 × 28 px) for inline use; `icon` (32 × 32 px) for Sheet and Dialog headers.",
    },
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description:
        "Visual treatment — `ghost` is the standard choice; `destructive` for error banners.",
    },
    disabled: { control: "boolean" },
    "aria-label": { control: "text" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default `ghost`/`icon-sm` close button with an accessible label of "Close" — drop directly into any Dialog or Sheet header.',
      },
    },
  },
};

export const CustomLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Override `aria-label` when the dismiss target needs a more specific description — screen-reader users hear the full intent rather than just "Close".',
      },
    },
  },
  args: { "aria-label": "Close notification" },
};

export const SizeIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`icon` size (32 × 32 px) for Sheet and full-screen Dialog headers where a larger tap target improves touch usability.",
      },
    },
  },
  args: { size: "icon" },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled while an async operation is in flight — prevents double-dismissal during API calls such as revoking a Qeet ID session.",
      },
    },
  },
  args: { disabled: true },
};

export const DestructiveVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`destructive` variant for error alert banners where closing the banner implies acknowledging a critical failure.",
      },
    },
  },
  args: { variant: "destructive" },
};
