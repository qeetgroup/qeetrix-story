import {
  Badge,
  Box,
  Button,
  Grid,
  Heading,
  Inline,
  Separator,
  type Space,
  Stack,
  type StackAlign,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const MEMBERS = [
  ["Priya Sharma", "Owner"],
  ["Rahul Verma", "Admin"],
  ["Ananya Iyer", "Member"],
] as const;

const meta: Meta<typeof Stack> = {
  title: "Components/Layout/Stack",
  component: Stack,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "padded",
  },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Stack {...args}>
        {MEMBERS.map(([name, role]) => (
          <Box key={name} padding="sm" background="raised" border="default" radius="control">
            <Text>
              {name} · {role}
            </Text>
          </Box>
        ))}
      </Stack>
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

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
    <Inline gap="md" wrap={false} align="start">
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

function Bar() {
  return (
    <Box
      background="brand"
      border="default"
      radius="sm"
      style={{ inlineSize: 160, blockSize: 12 }}
    />
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
    <Stack gap="lg">
      {SPACE.map(([value, token, size]) => (
        <ScaleRow key={value} value={value} token={token} size={size}>
          <Stack gap={value}>
            <Bar />
            <Bar />
          </Stack>
        </ScaleRow>
      ))}
    </Stack>
  ),
};

const ALIGNS: StackAlign[] = ["start", "center", "end", "stretch"];

export const Align: Story = {
  render: () => (
    <Grid columns={{ base: 1, medium: 4 }} gap="md">
      {ALIGNS.map((align) => (
        <Stack key={align} gap="sm">
          <Text size="sm" tone="subtle">
            {align}
          </Text>
          <Box border="default" radius="control" padding="sm">
            <Stack gap="xs" align={align}>
              {MEMBERS.map(([name]) => (
                <Box key={name} background="neutral" radius="sm" paddingInline="sm">
                  <Text size="sm">{name}</Text>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      ))}
    </Grid>
  ),
};

export const Justify: Story = {
  render: () => (
    <Grid columns={{ base: 1, medium: 4 }} gap="md">
      {(["start", "center", "end", "between"] as const).map((justify) => (
        <Stack key={justify} gap="sm">
          <Text size="sm" tone="subtle">
            {justify}
          </Text>
          <Box border="default" radius="control" padding="sm" style={{ blockSize: 160 }}>
            <Stack gap="xs" justify={justify} style={{ blockSize: "100%" }}>
              <Box background="neutral" radius="sm" paddingInline="sm">
                <Text size="sm">Signed in</Text>
              </Box>
              <Box background="neutral" radius="sm" paddingInline="sm">
                <Text size="sm">Signed out</Text>
              </Box>
            </Stack>
          </Box>
        </Stack>
      ))}
    </Grid>
  ),
};

function Method({ name, on, detail }: { name: string; on: boolean; detail: string }) {
  return (
    <Inline justify="between">
      <Stack gap="xs">
        <Inline gap="sm">
          <Heading level={3} size="title-sm">
            {name}
          </Heading>
          <Badge tone={on ? "success" : "neutral"}>{on ? "On" : "Off"}</Badge>
        </Inline>
        <Text size="sm" tone="subtle">
          {detail}
        </Text>
      </Stack>
      <Button variant="ghost" size="sm">
        {on ? "Configure" : "Turn on"}
      </Button>
    </Inline>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 480 }}>
      <Heading level={2} size="title-lg">
        Sign-in methods
      </Heading>
      <Method name="Passkeys" on detail="72% of users have one." />
      <Separator />
      <Method name="SMS codes" on={false} detail="₹0.18 per code." />
    </Stack>
  ),
};

export const ListInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: renders as a list",
  render: () => (
    <Stack render={<ul aria-label="Recent sign-ins" />} gap="sm">
      {["Priya Sharma", "Rahul Verma", "Ananya Iyer"].map((name) => (
        <li key={name}>
          <Text>{name}</Text>
        </li>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "Recent sign-ins" });
    await expect(list.querySelectorAll("li")).toHaveLength(3);
  },
};
