import { Button, Card, Field, Inline, QeetrixProvider, Stack } from "@qeetrix/react";
import { NumberField } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof NumberField> = {
  title: "Components/Data Entry/NumberField",
  component: NumberField,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    defaultValue: 30,
    min: 5,
    max: 1440,
    endAdornment: "minutes",
    onValueChange: fn(),
  },
  render: (args) => (
    <Field label="Session timeout" style={{ inlineSize: 360 }}>
      <NumberField {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Playground: Story = {};

export const Formats: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Monthly active users">
        <NumberField defaultValue={1284000} min={0} />
      </Field>
      <Field label="Monthly fee">
        <NumberField
          defaultValue={124500}
          min={0}
          steppers={false}
          format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
        />
      </Field>
      <Field label="GST rate">
        <NumberField
          defaultValue={0.18}
          min={0}
          max={0.28}
          step={0.01}
          format={{ style: "percent" }}
        />
      </Field>
    </Stack>
  ),
};

export const WithUnits: Story = {
  name: "With units",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Plan price">
        <NumberField
          defaultValue={4999}
          min={0}
          step={100}
          startAdornment="₹"
          endAdornment="/ month"
        />
      </Field>
      <Field label="Keep audit logs for">
        <NumberField defaultValue={90} min={30} max={365} endAdornment="days" />
      </Field>
    </Stack>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Session timeout" error="At least 5 minutes.">
        <NumberField {...args} defaultValue={2} />
      </Field>
      <Field label="Idle timeout" disabled>
        <NumberField {...args} disabled />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 400 }}>
      <Card
        title="Sign-in protection"
        level={3}
        footer={
          <Inline justify="end">
            <Button variant="solid">Save changes</Button>
          </Inline>
        }
      >
        <Stack gap="lg">
          <Field label="Lock after">
            <NumberField defaultValue={5} min={3} max={10} endAdornment="attempts" />
          </Field>
          <Field label="Lock for">
            <NumberField defaultValue={15} min={5} max={1440} step={5} endAdornment="minutes" />
          </Field>
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { endAdornment: "मिनट" },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="सेशन टाइमआउट" style={{ inlineSize: 360 }}>
        <NumberField {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys, Shift, Home and End",
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Session timeout" });
    await expect(field).toHaveAttribute("aria-roledescription", "Number field");
    await userEvent.click(field);

    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(31, expect.anything());
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(41, expect.anything());
    await userEvent.keyboard("{Home}");
    await expect(field).toHaveValue("5");
    await userEvent.keyboard("{End}");
    await expect(field).toHaveValue("1,440");
  },
};

export const SteppersInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: steppers stop at min and max",
  args: { defaultValue: 2, min: 1, max: 3, endAdornment: "admins" },
  render: (args) => (
    <Field label="Required approvers" style={{ inlineSize: 360 }}>
      <NumberField {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const increase = canvas.getByRole("button", { name: "Increase" });
    const decrease = canvas.getByRole("button", { name: "Decrease" });

    await userEvent.click(increase);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(3, expect.anything());
    await expect(increase).toHaveAttribute("data-disabled");

    await userEvent.click(decrease);
    await userEvent.click(decrease);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1, expect.anything());
    await expect(decrease).toHaveAttribute("data-disabled");
  },
};

export const TypingInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing formats on blur",
  args: { defaultValue: undefined, min: 0, max: undefined, endAdornment: "users" },
  render: (args) => (
    <Field label="Monthly active users" style={{ inlineSize: 360 }}>
      <NumberField {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Monthly active users" });
    await userEvent.type(field, "1284000");
    await userEvent.tab();
    await expect(field).toHaveValue("12,84,000");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1284000, expect.anything());
  },
};
