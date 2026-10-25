import { Card, Meter, QeetrixProvider, Stack } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Meter> = {
  title: "Components/Data Display/Meter",
  component: Meter,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Storage used",
    value: 68,
    showValue: true,
    tone: "brand",
  },
  // value, min, max and format come from Base UI's Meter, which the props table doesn't list.
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    format: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="lg">
      <Meter {...args} label="Seats used" value={36} tone="brand" />
      <Meter {...args} label="Audit log storage" value={52} tone="neutral" />
      <Meter {...args} label="Emails sent" value={41} tone="info" />
      <Meter {...args} label="Uptime" value={99.9} tone="success" />
      <Meter {...args} label="SMS credits used" value={84} tone="warning" />
      <Meter {...args} label="API quota used" value={97} tone="danger" />
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <Card title="Plan usage" level={2}>
      <Stack gap="lg">
        <Meter {...args} label="Members" value={47} max={100} format={{ style: "decimal" }} />
        <Meter {...args} label="Monthly active users" value={27_400} max={50_000} />
        <Meter {...args} label="Log retention" value={73} tone="warning" />
      </Stack>
    </Card>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: {
    label: "उपयोग की गई स्टोरेज",
    value: 1_28_400,
    max: 2_00_000,
    format: { style: "decimal" },
  },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Meter {...args} />
    </QeetrixProvider>
  ),
};

export const NamedMeter: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a named meter with its value",
  play: async ({ canvas }) => {
    const meter = canvas.getByRole("meter", { name: "Storage used" });
    await expect(meter).toHaveAttribute("aria-valuenow", "68");
    await expect(canvas.getByText("68%")).toBeVisible();
  },
};
