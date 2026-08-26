import { OTPInput } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof OTPInput> = {
  title: "Components/Data Entry/OTPInput",
  component: OTPInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
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

export const TypeInteraction: Story = {
  name: "Interaction: entering a code",
  parameters: {
    docs: {
      description: {
        story:
          "Each keypress advances focus to the next field, so typing a full code exercises the focus-hopping logic rather than a single input.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="flex flex-col items-center gap-3">
        <OTPInput value={value} onChange={setValue} length={6} aria-label="MFA verification code" />
        <output className="text-sm text-muted-foreground">Entered: {value}</output>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const fields = canvas.getAllByRole("textbox");
    await expect(fields).toHaveLength(6);

    await userEvent.click(fields[0]);
    await userEvent.keyboard("482913");

    await waitFor(() => expect(canvas.getByText("Entered: 482913")).toBeVisible());
  },
};
