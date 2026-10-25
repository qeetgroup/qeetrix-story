import { Button, Card, Field, Input, QeetrixProvider, Stack } from "@qeetrix/react";
import { CopyButton, PasswordInput } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const CLIENT_SECRET = "qs_live_9f2c7d1e4b8a6035";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Data Entry/PasswordInput",
  component: PasswordInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    onVisibleChange: fn(),
  },
  render: (args) => (
    <Field label="Password" style={{ inlineSize: 360 }}>
      <PasswordInput {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Playground: Story = {
  args: { defaultValue: "correct horse battery" },
};

export const Secret: Story = {
  args: {
    autoComplete: "off",
    readOnly: true,
    defaultValue: CLIENT_SECRET,
    endAdornment: <CopyButton value={CLIENT_SECRET} label="Copy client secret" size="sm" />,
  },
  render: (args) => (
    <Field label="Client secret" style={{ inlineSize: 360 }}>
      <PasswordInput {...args} />
    </Field>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Shown">
        <PasswordInput {...args} defaultValue="correct horse battery" defaultVisible />
      </Field>
      <Field label="Password" error="That password isn't right.">
        <PasswordInput {...args} defaultValue="wrongpassword" />
      </Field>
      <Field label="Managed by SSO" disabled>
        <PasswordInput {...args} disabled />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card title="Sign in to Acme Pvt Ltd" level={3}>
        <form onSubmit={(event) => event.preventDefault()}>
          <Stack gap="lg">
            <Field label="Work email">
              <Input type="email" autoComplete="username" defaultValue="priya.sharma@acme.in" />
            </Field>
            <Field label="Password">
              <PasswordInput {...args} />
            </Field>
            <Button type="submit" variant="solid" fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="पासवर्ड" style={{ inlineSize: 360 }}>
        <PasswordInput {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const ToggleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: show and hide",
  args: { defaultValue: "correct horse" },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByLabelText("Password");
    const toggle = canvas.getByRole("button", { name: "Show password" });
    await expect(field).toHaveAttribute("type", "password");
    await expect(field).toHaveAttribute("autocomplete", "current-password");
    await expect(field).toHaveAttribute("spellcheck", "false");

    await userEvent.click(toggle);
    await expect(field).toHaveAttribute("type", "text");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveFocus();
    await expect(canvas.getByText("Password shown")).toBeInTheDocument();
    await expect(args.onVisibleChange).toHaveBeenLastCalledWith(true);

    await userEvent.keyboard("{Enter}");
    await expect(field).toHaveAttribute("type", "password");
    await expect(canvas.getByText("Password hidden")).toBeInTheDocument();
    await expect(args.onVisibleChange).toHaveBeenLastCalledWith(false);
  },
};

export const SubmitInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: hides again on submit",
  args: { defaultValue: "correct horse", defaultVisible: true },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()} style={{ inlineSize: 360 }}>
      <Stack gap="lg">
        <Field label="Password">
          <PasswordInput {...args} />
        </Field>
        <Button type="submit" variant="solid">
          Sign in
        </Button>
      </Stack>
    </form>
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText("Password");
    await expect(field).toHaveAttribute("type", "text");
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(field).toHaveAttribute("type", "password");
    await expect(canvas.getByRole("button", { name: "Show password" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};

export const CapsLockInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Caps Lock warning",
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText("Password");
    await userEvent.click(field);
    await userEvent.keyboard("{CapsLock}A");
    await expect(canvas.getByText("Caps Lock is on")).toBeVisible();
    await userEvent.keyboard("{CapsLock}b");
    await expect(canvas.queryByText("Caps Lock is on")).not.toBeInTheDocument();
  },
};
