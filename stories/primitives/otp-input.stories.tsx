import { OTPInput } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof OTPInput> = {
  title: "Primitives/OTPInput",
  component: OTPInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A fully-controlled sequence of single-digit boxes for entering TOTP or email magic-link codes. The `length` prop sets the number of digits (default 6). Used on the Qeet ID MFA verification screen and the passkey fallback flow.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Six-digit TOTP code entry on the Qeet ID MFA screen — auto-advances focus on each keypress.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <OTPInput value={value} onChange={setValue} length={6} aria-label="MFA verification code" />
    );
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Disabled state shown while the server is verifying a previously submitted code.",
      },
    },
  },
  render: () => (
    <OTPInput
      value="483921"
      onChange={() => {}}
      length={6}
      disabled
      aria-label="MFA verification code"
    />
  ),
};
