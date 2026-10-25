import { Button, Card, Progress, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Progress> = {
  title: "Components/Feedback/Progress",
  component: Progress,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Uploading invoices.csv",
    showValue: true,
    value: 40,
  },
  argTypes: {
    // `value` comes from Base UI's Progress, which the generated props table doesn't reach.
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 320 }}>
      <Progress label="Uploading invoices.csv" showValue value={40} />
      <Progress label="Importing customers" value={null} />
      <Progress label="Uploaded invoices.csv" showValue value={100} tone="success" />
      <Progress label="Couldn't upload payroll-oct.csv" showValue value={72} tone="danger" />
    </Stack>
  ),
};

export const ValueFormat: Story = {
  name: "Value format",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 320 }}>
      <Progress label="Records imported" showValue value={1360} max={2000} />
      <Progress
        label="Records imported"
        showValue
        value={1360}
        max={2000}
        format={{ maximumFractionDigits: 0 }}
      />
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Card
      style={{ inlineSize: 400 }}
      title="Importing users"
      level={2}
      description="acme-employees-oct.csv"
      footer={
        <Button variant="ghost" tone="neutral" size="sm">
          Cancel import
        </Button>
      }
    >
      <Stack gap="sm">
        <Progress aria-label="Users imported" value={1360} max={2000} />
        <Text role="status" size="sm" tone="subtle">
          1,360 of 2,000 users
        </Text>
      </Stack>
    </Card>
  ),
};

export const ValueInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a named progressbar with its value",
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Uploading invoices.csv" });
    await expect(bar).toHaveAttribute("aria-valuenow", "40");
    await expect(canvas.getByText("40%")).toBeVisible();
  },
};

export const IndeterminateInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: indeterminate has no value",
  args: { label: "Importing customers", value: null, showValue: false },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar", { name: "Importing customers" });
    await expect(bar).not.toHaveAttribute("aria-valuenow");
  },
};
