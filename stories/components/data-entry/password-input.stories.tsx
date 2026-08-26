import { Label, PasswordInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Data Entry/PasswordInput",
  component: PasswordInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A password `<input>` with an optional show/hide visibility toggle. Toggle state is managed internally — the eye icon flips between `EyeIcon` and `EyeOffIcon` on click. Pass `showToggle={false}` to remove the toggle entirely. Used on Qeet ID's sign-in, password-reset, and account-creation screens. Follows the APG [show-password button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).",
      },
    },
  },
  argTypes: {
    showToggle: {
      control: "boolean",
      description: "Show or hide the visibility toggle button. Defaults to `true`.",
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard password field with the show/hide toggle — clicking the eye icon reveals the typed characters in plain text.",
      },
    },
  },
  args: { placeholder: "Enter your password", className: "w-72" },
};

export const WithoutToggle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`showToggle={false}` — suitable for confirm-password fields where revealing the text is less valuable than keeping the two fields visually symmetric.",
      },
    },
  },
  args: {
    showToggle: false,
    placeholder: "Confirm password",
    className: "w-72",
  },
};

export const InField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrapped in a labelled field via `htmlFor` — the pattern used on the Qeet ID sign-in page. The `aria-controls` inside the toggle refers to the input's `id` for assistive technology.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="signin-password">Password</Label>
      <PasswordInput id="signin-password" placeholder="Enter your password" />
    </div>
  ),
};

export const InFieldPair: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "New-password + confirm-password pair used on the Qeet ID account creation and password-reset screens. The confirmation field omits the toggle to keep the layout compact.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">New password</Label>
        <PasswordInput id="new-password" placeholder="Min. 12 characters" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <PasswordInput id="confirm-password" placeholder="Re-enter password" showToggle={false} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Disabled while SSO is the active sign-in method — the password field is locked until the SSO connection is deactivated in Qeet ID.",
      },
    },
  },
  args: { disabled: true, placeholder: "Managed via SSO", className: "w-72" },
};
