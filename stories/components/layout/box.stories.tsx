import {
  Box,
  type BoxBackground,
  type BoxBorder,
  type BoxRadius,
  Grid,
  Heading,
  Inline,
  type Inset,
  Stack,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Box> = {
  title: "Components/Layout/Box",
  component: Box,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
  },
  args: {
    padding: "lg",
    background: "raised",
    border: "default",
    radius: "surface",
    children: "Acme Pvt Ltd · Growth plan",
  },
  // Box sets no type, so its text goes in a Text, as it would in a product.
  render: ({ children, ...args }) => (
    <Box {...args}>
      <Text>{children}</Text>
    </Box>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Box>;

/** A token-scale row: value, token, size, specimen. */
function ScaleRow({
  value,
  token,
  size,
  children,
}: Record<"value" | "token" | "size", string> & {
  children: ReactNode;
}) {
  return (
    <Inline gap="md" wrap={false}>
      <Text mono size="sm" style={{ inlineSize: 64, flex: "none" }}>
        {value}
      </Text>
      <Text mono size="sm" tone="subtle" style={{ inlineSize: 200, flex: "none" }}>
        {token}
      </Text>
      <Text size="sm" tone="subtle" style={{ inlineSize: 48, flex: "none" }}>
        {size}
      </Text>
      {children}
    </Inline>
  );
}

export const Playground: Story = {};

const INSETS: Array<[Inset, string, string]> = [
  ["none", "—", "0"],
  ["xs", "--qx-space-inset-xs", "4px"],
  ["sm", "--qx-space-inset-sm", "8px"],
  ["md", "--qx-space-inset-md", "12px"],
  ["lg", "--qx-space-inset-lg", "16px"],
  ["xl", "--qx-space-inset-xl", "24px"],
];

export const Padding: Story = {
  render: () => (
    <Stack gap="sm">
      {INSETS.map(([value, token, size]) => (
        <ScaleRow key={value} value={value} token={token} size={size}>
          <Box padding={value} border="default" radius="control">
            <Box background="brand" radius="sm" style={{ inlineSize: 48, blockSize: 16 }} />
          </Box>
        </ScaleRow>
      ))}
    </Stack>
  ),
};

const BACKGROUNDS: Array<[BoxBackground, string]> = [
  ["canvas", "--qx-color-surface-canvas"],
  ["default", "--qx-color-surface-default"],
  ["raised", "--qx-color-surface-raised"],
  ["sunken", "--qx-color-surface-sunken"],
  ["overlay", "--qx-color-surface-overlay"],
  ["inverse", "--qx-color-surface-inverse"],
  ["neutral", "--qx-color-bg-neutral-subtle"],
  ["brand", "--qx-color-bg-brand-subtle"],
  ["selected", "--qx-color-bg-selected"],
];

export const Backgrounds: Story = {
  render: () => (
    <Grid columns={{ base: 1, medium: 3 }} gap="md">
      {BACKGROUNDS.map(([value, token]) => (
        <Box key={value} background={value} border="subtle" radius="surface" padding="lg">
          <Stack gap="xs">
            <Text weight="semibold">{value}</Text>
            <Text mono size="sm">
              {token}
            </Text>
          </Stack>
        </Box>
      ))}
    </Grid>
  ),
};

const BORDERS: Array<[BoxBorder, string]> = [
  ["none", "—"],
  ["subtle", "--qx-color-border-subtle"],
  ["default", "--qx-color-border-default"],
  ["strong", "--qx-color-border-strong"],
];

export const Borders: Story = {
  render: () => (
    <Stack gap="sm">
      {BORDERS.map(([value, token]) => (
        <ScaleRow key={value} value={value} token={token} size={value === "none" ? "0" : "1px"}>
          <Box
            border={value}
            radius="control"
            background="raised"
            style={{ inlineSize: 160, blockSize: 40 }}
          />
        </ScaleRow>
      ))}
    </Stack>
  ),
};

const RADII: Array<[BoxRadius, string, string]> = [
  ["none", "--qx-radius-none", "0"],
  ["sm", "--qx-radius-sm", "2px"],
  ["control", "--qx-radius-control", "4px"],
  ["surface", "--qx-radius-surface", "4px"],
  ["overlay", "--qx-radius-overlay", "4px"],
  ["modal", "--qx-radius-modal", "4px"],
  ["chip", "--qx-radius-chip", "9999px"],
  ["full", "--qx-radius-full", "9999px"],
];

export const Radius: Story = {
  render: () => (
    <Stack gap="sm">
      {RADII.map(([value, token, size]) => (
        <ScaleRow key={value} value={value} token={token} size={size}>
          <Box
            radius={value}
            border="strong"
            background="neutral"
            style={{ inlineSize: 96, blockSize: 40 }}
          />
        </ScaleRow>
      ))}
    </Stack>
  ),
};

export const RenderInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: renders another element",
  render: () => (
    <Box
      render={<section aria-labelledby="plan-title" />}
      padding="lg"
      background="raised"
      border="default"
      radius="surface"
    >
      <Heading level={3} size="title-md" id="plan-title">
        Growth plan
      </Heading>
    </Box>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole("region", { name: "Growth plan" });
    await expect(region.tagName).toBe("SECTION");
  },
};
