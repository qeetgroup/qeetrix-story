import { Button, Card, Field, Link, QeetrixProvider, Stack } from "@qeetrix/react";
import { OTPInput } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

/** The slots, in order: the first named by the Field, the rest "Character 2 of 6" and so on. */
const slots = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLInputElement>("[data-slot=otp-input-slot]"),
];

const meta: Meta<typeof OTPInput> = {
  title: "Components/Data Entry/OTPInput",
  component: OTPInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    onValueChange: fn(),
    onValueComplete: fn(),
  },
  render: (args) => (
    <Field label="Verification code" style={{ inlineSize: 360 }}>
      <OTPInput {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Medium">
        <OTPInput {...args} size="md" defaultValue="4817" />
      </Field>
      <Field label="Large">
        <OTPInput {...args} size="lg" defaultValue="4817" />
      </Field>
    </Stack>
  ),
};

export const Groups: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 440 }}>
      <Field label="Verification code">
        <OTPInput {...args} groups={[3, 3]} defaultValue="482913" />
      </Field>
      <Field label="Recovery code">
        <OTPInput {...args} length={8} groups={[4, 4]} validationType="alphanumeric" />
      </Field>
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Verification code" error="That code has expired.">
        <OTPInput {...args} defaultValue="482913" />
      </Field>
      <Field label="Verifying" disabled>
        <OTPInput {...args} defaultValue="482913" disabled />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card title="Two-step verification" level={3}>
        <Stack gap="lg">
          <Field label="Code sent to +91 98xxx xx210">
            <OTPInput {...args} size="lg" />
          </Field>
          <Button variant="solid" fullWidth>
            Verify and sign in
          </Button>
          <Link href="#recovery">Use a recovery code</Link>
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="सत्यापन कोड" style={{ inlineSize: 360 }}>
        <OTPInput {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const TypingInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing moves on, digits only",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const first = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(first).toHaveAttribute("autocomplete", "one-time-code");
    await expect(canvas.getByRole("textbox", { name: "Character 2 of 6" })).toBeVisible();

    await userEvent.click(first);
    await userEvent.keyboard("48a2913");
    await waitFor(() =>
      expect(args.onValueComplete).toHaveBeenCalledWith("482913", expect.anything()),
    );
    await expect(
      slots(canvasElement)
        .map((slot) => slot.value)
        .join(""),
    ).toBe("482913");
  },
};

export const NamedWithoutField: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: aria-label names a code with no Field",
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <OTPInput {...args} aria-label="Verification code" length={4} />
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Verification code" });
    await expect(group).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Verification code" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "Character 4 of 4" })).toBeVisible();
  },
};

export const BackspaceInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Backspace moves back",
  args: { defaultValue: "4817" },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const fifth = canvas.getByRole("textbox", { name: "Character 5 of 6" });
    await userEvent.click(fifth);
    await userEvent.keyboard("{Backspace}");
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenLastCalledWith("481", expect.anything()),
    );
    await expect(canvas.getByRole("textbox", { name: "Character 4 of 6" })).toHaveFocus();
    await expect(slots(canvasElement)[3]).toHaveValue("");
  },
};

export const PasteInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one paste fills every slot",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("textbox", { name: "Verification code" }));
    await userEvent.paste("654 321");
    await waitFor(() =>
      expect(
        slots(canvasElement)
          .map((slot) => slot.value)
          .join(""),
      ).toBe("654321"),
    );
    await expect(args.onValueComplete).toHaveBeenCalledWith("654321", expect.anything());
  },
};
