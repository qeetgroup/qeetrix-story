import { Slider, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const INR = { style: "currency", currency: "INR", maximumFractionDigits: 0 } as const;

const meta: Meta<typeof Slider> = {
  title: "Components/Data Entry/Slider",
  component: Slider,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
  },
  args: {
    label: "Discount",
    showValue: true,
    defaultValue: 0.1,
    min: 0,
    max: 0.5,
    step: 0.05,
    format: { style: "percent" },
    onValueChange: fn(),
  },
  // A Slider carries its own label and value header, so it needs no Field.
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Slider {...args} />
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Playground: Story = {};

export const Range: Story = {
  args: {
    label: "Invoice amount",
    defaultValue: [25000, 75000],
    min: 0,
    max: 100000,
    step: 5000,
    format: INR,
  },
};

export const States: Story = {
  render: () => (
    <Stack gap="xl" style={{ inlineSize: 360 }}>
      <Slider
        label="Seats"
        description="Billed at ₹240 per seat each month."
        showValue
        defaultValue={25}
        min={5}
        max={100}
        step={5}
      />
      <Slider
        label="Password length"
        error="Use at least 12 characters."
        showValue
        defaultValue={8}
        min={6}
        max={32}
      />
      <Slider
        label="Log retention"
        showValue
        defaultValue={30}
        min={7}
        max={90}
        format={{ style: "unit", unit: "day", unitDisplay: "long" }}
        disabled
      />
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="xl" style={{ inlineSize: 400 }}>
      <Slider
        label="Requests per minute"
        showValue
        defaultValue={600}
        min={60}
        max={3000}
        step={60}
        largeStep={600}
      />
      <Slider
        label="Session timeout"
        showValue
        defaultValue={30}
        min={5}
        max={120}
        step={5}
        format={{ style: "unit", unit: "minute", unitDisplay: "long" }}
      />
    </Stack>
  ),
};

export const ArrowKeys: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys step, Home and End jump",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const thumb = canvas.getByRole("slider", { name: "Discount" });
    await expect(thumb).toHaveAttribute("aria-valuenow", "0.1");
    await userEvent.tab();
    await expect(thumb).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(0.15, expect.anything());
    const value = canvasElement.querySelector("[data-slot=slider-value]");
    await expect(value).toHaveTextContent("15%");
    await userEvent.keyboard("{End}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0.5");
    await userEvent.keyboard("{Home}");
    await expect(thumb).toHaveAttribute("aria-valuenow", "0");
  },
};

export const RangeThumbs: Story = {
  ...Range,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: each range thumb moves on its own",
  play: async ({ args, canvas, userEvent }) => {
    const minimum = canvas.getByRole("slider", { name: "Invoice amount, minimum" });
    const maximum = canvas.getByRole("slider", { name: "Invoice amount, maximum" });
    await expect(minimum).toHaveAttribute("aria-valuenow", "25000");
    await expect(maximum).toHaveAttribute("aria-valuenow", "75000");
    await userEvent.tab();
    await expect(minimum).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith([30000, 75000], expect.anything());
    await userEvent.tab();
    await expect(maximum).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith([30000, 70000], expect.anything());
  },
};

export const StatesDescribe: Story = {
  ...States,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: description and error describe the slider",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("slider", { name: "Seats" })).toHaveAccessibleDescription(
      "Billed at ₹240 per seat each month.",
    );
    const length = canvas.getByRole("slider", { name: "Password length" });
    await expect(length).toHaveAttribute("aria-invalid", "true");
    await expect(length).toHaveAccessibleDescription("Use at least 12 characters.");
    await expect(canvas.getByRole("slider", { name: "Log retention" })).toBeDisabled();
  },
};

export const NamedWithoutLabel: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: aria-label names a slider with no visible label",
  args: { label: undefined, "aria-label": "Discount" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("slider", { name: "Discount" })).toBeVisible();
  },
};
