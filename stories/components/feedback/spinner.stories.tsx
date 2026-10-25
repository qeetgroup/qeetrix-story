import { Button, Inline, Spinner, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Spinner> = {
  title: "Components/Feedback/Spinner",
  component: Spinner,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
  },
  argTypes: {
    // `default` is a deprecated alias of `neutral`: keep it out of the control.
    tone: { options: ["neutral", "brand"] },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Inline gap="md">
      <Spinner size="lg" tone="neutral" label="Loading users" />
      <Spinner size="lg" tone="brand" label="Loading applications" />
    </Inline>
  ),
};

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
  { size: "lg", label: "Large" },
  { size: "xl", label: "Extra large" },
] as const;

export const Sizes: Story = {
  render: () => (
    <Inline gap="lg" align="end">
      {SIZES.map(({ size, label }) => (
        <Stack key={size} gap="sm" align="center">
          <Spinner size={size} label={`Loading, ${label.toLowerCase()}`} />
          <Text size="sm" tone="subtle">
            {label}
          </Text>
        </Stack>
      ))}
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="lg" align="center">
      <Inline gap="sm" role="status">
        <Spinner decorative />
        <Text>Waiting for your passkey…</Text>
      </Inline>
      <Button loading>Saving…</Button>
    </Stack>
  ),
};

export const StatusInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: announced as a status named Loading",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  },
};

export const DecorativeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: decorative is hidden",
  render: () => (
    <Inline gap="sm" role="status">
      <Spinner decorative />
      <Text>Waiting for your passkey…</Text>
    </Inline>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=spinner]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(canvas.getByRole("status")).toHaveTextContent("Waiting for your passkey…");
  },
};
