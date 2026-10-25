import { BanIcon } from "@qeetrix/icons/icons/ban";
import { CircleCheckIcon } from "@qeetrix/icons/icons/circle-check";
import { ClockIcon } from "@qeetrix/icons/icons/clock";
import {
  Badge,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  Inline,
  Stack,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Badge> = {
  title: "Components/Data Display/Badge",
  component: Badge,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
  },
  args: {
    children: "Active",
    tone: "success",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

const TONES: [BadgeTone, string][] = [
  ["neutral", "Draft"],
  ["brand", "Qeet Pro"],
  ["info", "Invited"],
  ["success", "Active"],
  ["warning", "Pending"],
  ["danger", "Blocked"],
];

const VARIANTS: [BadgeVariant, string][] = [
  ["subtle", "Subtle"],
  ["solid", "Solid"],
];

export const Variants: Story = {
  render: (args) => (
    <Stack gap="lg">
      {VARIANTS.map(([variant, caption]) => (
        <Stack key={variant} gap="xs">
          <Text size="sm" tone="subtle">
            {caption}
          </Text>
          <Inline gap="md">
            {TONES.map(([tone, label]) => (
              <Badge {...args} key={tone} tone={tone} variant={variant}>
                {label}
              </Badge>
            ))}
          </Inline>
        </Stack>
      ))}
    </Stack>
  ),
};

const SIZES: [BadgeSize, string][] = [
  ["md", "Medium"],
  ["sm", "Small"],
];

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="lg" align="end">
      {SIZES.map(([size, caption]) => (
        <Stack key={size} gap="xs" align="center">
          <Badge {...args} size={size} />
          <Text size="sm" tone="subtle">
            {caption}
          </Text>
        </Stack>
      ))}
    </Inline>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: (args) => (
    <Inline gap="md">
      <Badge {...args} tone="success" icon={CircleCheckIcon}>
        Verified
      </Badge>
      <Badge {...args} tone="warning" icon={ClockIcon}>
        Expires in 9 days
      </Badge>
      <Badge {...args} tone="danger" icon={BanIcon}>
        Suspended
      </Badge>
    </Inline>
  ),
};

const KEYS = [
  { id: "qid_live_4xKz…9Rp2", tone: "success", status: "Live" },
  { id: "qid_test_8bQm…1Lc7", tone: "info", status: "Test" },
  { id: "qid_live_7yHd…3Va9", tone: "neutral", status: "Revoked" },
] as const;

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <Stack gap="md" style={{ inlineSize: 320 }}>
      {KEYS.map((key) => (
        <Inline key={key.id} gap="md" justify="between">
          <Text mono size="sm">
            {key.id}
          </Text>
          <Badge {...args} tone={key.tone}>
            {key.status}
          </Badge>
        </Inline>
      ))}
    </Stack>
  ),
};
