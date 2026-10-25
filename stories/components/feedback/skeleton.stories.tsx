import { Avatar, Card, Inline, Skeleton, Stack, Text, VisuallyHidden } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Feedback/Skeleton",
  component: Skeleton,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { variant: "text" },
  render: (args) => (
    <div style={{ inlineSize: 280 }}>
      <Skeleton {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {};

const VARIANTS = [
  { label: "text", props: { variant: "text" } },
  { label: "paragraph", props: { lines: 3 } },
  { label: "block", props: { variant: "block" } },
  { label: "circle", props: { variant: "circle" } },
] as const;

export const Variants: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 280 }}>
      {VARIANTS.map(({ label, props }) => (
        <Stack key={label} gap="sm">
          <Text size="sm" tone="subtle">
            {label}
          </Text>
          <Skeleton {...props} />
        </Stack>
      ))}
    </Stack>
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
          <Skeleton variant="circle" size={size} />
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
    <Card title="Profile" level={2} style={{ inlineSize: 360 }}>
      <Stack gap="md" aria-busy="true">
        <VisuallyHidden>
          <Text role="status">Loading Priya Sharma's profile</Text>
        </VisuallyHidden>
        <Inline gap="sm" wrap={false}>
          <Skeleton variant="circle" size="lg" />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton style={{ inlineSize: "55%" }} />
            <Skeleton style={{ inlineSize: "35%" }} />
          </Stack>
        </Inline>
        <Skeleton variant="block" />
      </Stack>
    </Card>
  ),
};

export const HiddenInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: hidden from assistive technology",
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector("[data-slot=skeleton]");
    await expect(skeleton).toHaveAttribute("aria-hidden", "true");
  },
};

export const LinesInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: lines draws a paragraph, the last line shorter",
  args: { lines: 3 },
  play: async ({ canvasElement }) => {
    const paragraph = canvasElement.querySelector("[data-slot=skeleton-lines]");
    await expect(paragraph).toHaveAttribute("aria-hidden", "true");
    const lines = [...(paragraph?.querySelectorAll<HTMLElement>("[data-slot=skeleton]") ?? [])];
    await expect(lines).toHaveLength(3);
    const width = (line: HTMLElement) => line.getBoundingClientRect().width;
    await expect(width(lines[2])).toBeLessThan(width(lines[0]));
  },
};

export const AvatarSizeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: circles match Avatar's sizes",
  render: () => (
    <Stack gap="sm">
      {SIZES.map(({ size }) => (
        <Inline key={size} gap="sm" data-row={size}>
          <Avatar name="Priya Sharma" size={size} />
          <Skeleton variant="circle" size={size} />
        </Inline>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    for (const { size } of SIZES) {
      const row = canvasElement.querySelector(`[data-row=${size}]`);
      const avatar = row?.querySelector("[data-slot=avatar]")?.getBoundingClientRect();
      const circle = row?.querySelector("[data-slot=skeleton]")?.getBoundingClientRect();
      await expect(avatar?.width).toBeGreaterThan(0);
      await expect(circle?.width).toBe(avatar?.width);
      await expect(circle?.height).toBe(avatar?.height);
    }
  },
};
