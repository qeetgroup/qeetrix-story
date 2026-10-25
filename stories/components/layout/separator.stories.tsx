import { Box, Heading, Inline, Separator, type SeparatorTone, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Separator> = {
  title: "Components/Layout/Separator",
  component: Separator,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
  },
  render: (args) => (
    <Stack gap="md" style={{ inlineSize: 320 }}>
      <Text>Account</Text>
      <Separator {...args} />
      <Text>Security</Text>
    </Stack>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Inline gap="md" align="stretch">
      <Text>Users</Text>
      <Separator {...args} />
      <Text>Groups</Text>
      <Separator {...args} />
      <Text>API keys</Text>
    </Inline>
  ),
};

const TONES: SeparatorTone[] = ["subtle", "default", "strong"];

export const Tones: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 320 }}>
      {TONES.map((tone) => (
        <Stack key={tone} gap="sm">
          <Text size="sm" tone="subtle">
            {tone}
          </Text>
          <Separator tone={tone} />
        </Stack>
      ))}
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Box padding="lg" background="raised" border="default" radius="surface">
      <Stack gap="md" style={{ inlineSize: 320 }}>
        <Stack gap="sm">
          <Heading level={3} size="title-sm">
            Sessions
          </Heading>
          <Text size="sm">MacBook Pro · Bengaluru · now</Text>
          <Separator />
          <Text size="sm">Pixel 9 · Mumbai · 2 hours ago</Text>
        </Stack>
        <Separator tone="default" />
        <Stack gap="sm">
          <Heading level={3} size="title-sm">
            Passkeys
          </Heading>
          <Text size="sm">iCloud Keychain · 12 Jan 2026</Text>
          <Separator />
          <Text size="sm">YubiKey 5C · 3 Mar 2026</Text>
        </Stack>
      </Stack>
    </Box>
  ),
};

export const RoleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: decorative lines leave the accessibility tree",
  render: () => (
    <Stack gap="md" style={{ inlineSize: 320 }}>
      <Text>Account</Text>
      <Separator />
      <Text>Security</Text>
      <Separator decorative />
      <Text>Notifications</Text>
    </Stack>
  ),
  play: async ({ canvas }) => {
    // Only the first separator is announced; the decorative one is role="none".
    await expect(canvas.getAllByRole("separator")).toHaveLength(1);
  },
};
