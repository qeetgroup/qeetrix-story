import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import {
  Badge,
  type BadgeTone,
  Box,
  Button,
  Heading,
  Inline,
  type InlineAlign,
  type Space,
  Stack,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const STATUSES: Array<[string, BadgeTone]> = [
  ["Active", "success"],
  ["Invited", "info"],
  ["Suspended", "warning"],
  ["Blocked", "danger"],
  ["Directory synced", "neutral"],
];

const statuses = STATUSES.map(([label, tone]) => (
  <Badge key={label} tone={tone}>
    {label}
  </Badge>
));

const meta: Meta<typeof Inline> = {
  title: "Components/Layout/Inline",
  component: Inline,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
  },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Inline {...args}>{statuses}</Inline>
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Inline>;

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

function Tile() {
  return (
    <Box
      background="brand"
      border="default"
      radius="sm"
      style={{ inlineSize: 32, blockSize: 24 }}
    />
  );
}

/** A small subtle label for a comparison row. */
function Label({ children }: { children: ReactNode }) {
  return (
    <Text size="sm" tone="subtle" style={{ inlineSize: 72, flex: "none" }}>
      {children}
    </Text>
  );
}

export const Playground: Story = {};

const SPACE: Array<[Space, string, string]> = [
  ["none", "—", "0"],
  ["xs", "--qx-space-gap-xs", "4px"],
  ["sm", "--qx-space-gap-sm", "8px"],
  ["md", "--qx-space-gap-md", "12px"],
  ["lg", "--qx-space-gap-lg", "16px"],
  ["xl", "--qx-space-gap-xl", "24px"],
  ["2xl", "--qx-space-layout-md", "32px"],
  ["3xl", "--qx-space-layout-lg", "48px"],
  ["4xl", "--qx-space-layout-xl", "64px"],
];

export const GapScale: Story = {
  name: "Gap scale",
  render: () => (
    <Stack gap="sm">
      {SPACE.map(([value, token, size]) => (
        <ScaleRow key={value} value={value} token={token} size={size}>
          <Inline gap={value} wrap={false}>
            <Tile />
            <Tile />
            <Tile />
          </Inline>
        </ScaleRow>
      ))}
    </Stack>
  ),
};

const ALIGNS: InlineAlign[] = ["start", "center", "end", "baseline", "stretch"];

export const Align: Story = {
  render: () => (
    <Stack gap="md">
      {ALIGNS.map((align) => (
        <Inline key={align} gap="md" wrap={false}>
          <Label>{align}</Label>
          <Box border="subtle" radius="control" paddingInline="sm" style={{ inlineSize: 320 }}>
            <Inline align={align} gap="sm" style={{ minBlockSize: 56 }}>
              <Heading level={3} size="title-lg">
                Users
              </Heading>
              <Text tone="subtle">1,284</Text>
              <Box background="neutral" radius="sm" paddingInline="sm">
                <Text size="sm">Synced</Text>
              </Box>
            </Inline>
          </Box>
        </Inline>
      ))}
    </Stack>
  ),
};

export const Wrap: Story = {
  render: () => (
    <Stack gap="md">
      {[true, false].map((wrap) => (
        <Inline key={String(wrap)} gap="md" wrap={false} align="start">
          <Label>{wrap ? "Wrap" : "No wrap"}</Label>
          <Box border="subtle" radius="control" padding="sm" style={{ inlineSize: 280 }}>
            <Inline wrap={wrap}>{statuses}</Inline>
          </Box>
        </Inline>
      ))}
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Inline justify="between" style={{ inlineSize: 600 }}>
      <Inline gap="sm" align="baseline">
        <Heading level={2} size="title-lg">
          Users
        </Heading>
        <Text tone="subtle">1,284</Text>
      </Inline>
      <Inline gap="sm">
        <Button variant="soft" icon={DownloadIcon}>
          Export
        </Button>
        <Button icon={PlusIcon}>Invite users</Button>
      </Inline>
    </Inline>
  ),
};

export const ListInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: renders as a list",
  render: () => (
    <Inline render={<ul aria-label="Applied filters" />} gap="xs">
      {["Status: Active", "MFA: Passkey", "Department: Engineering"].map((filter) => (
        <li key={filter}>
          <Box background="neutral" radius="chip" paddingInline="sm" paddingBlock="xs">
            <Text size="sm">{filter}</Text>
          </Box>
        </li>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "Applied filters" });
    await expect(list.querySelectorAll("li")).toHaveLength(3);
  },
};
