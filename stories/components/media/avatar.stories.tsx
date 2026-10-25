import { Avatar, type AvatarSize, Inline, Stack, Text } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/**
 * A stand-in photo. Stories run offline, so there's no remote image; its colours are a picture's,
 * not the interface's, so they're literal rather than tokens.
 */
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#d8c3a5"/><circle cx="32" cy="25" r="12" fill="#8d5b3e"/><path d="M8 64c2-15 12-22 24-22s22 7 24 22z" fill="#3d5a80"/></svg>',
)}`;

const meta: Meta<typeof Avatar> = {
  title: "Components/Media/Avatar",
  component: Avatar,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "centered",
  },
  args: {
    name: "Priya Sharma",
    size: "md",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};

const SIZES: [AvatarSize, string][] = [
  ["sm", "Small"],
  ["md", "Medium"],
  ["lg", "Large"],
  ["xl", "Extra large"],
];

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="lg" align="end">
      {SIZES.map(([size, caption]) => (
        <Stack key={size} gap="xs" align="center">
          <Avatar {...args} size={size} />
          <Text size="sm" tone="subtle">
            {caption}
          </Text>
        </Stack>
      ))}
    </Inline>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Inline gap="lg" align="end">
      <Stack gap="xs" align="center">
        <Avatar {...args} size="lg" />
        <Text size="sm" tone="subtle">
          Circle
        </Text>
      </Stack>
      <Stack gap="xs" align="center">
        <Avatar {...args} name="Acme Pvt Ltd" shape="square" size="lg" />
        <Text size="sm" tone="subtle">
          Square
        </Text>
      </Stack>
    </Inline>
  ),
};

export const ImageOrInitials: Story = {
  name: "Image or initials",
  render: (args) => (
    <Inline gap="md">
      <Avatar {...args} src={PHOTO} size="lg" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} name="Karthik" size="lg" />
      <Avatar {...args} name="प्रिया शर्मा" size="lg" />
    </Inline>
  ),
};

export const NamedImage: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: named by the person, showing initials",
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole("img", { name: "Priya Sharma" });
    await expect(avatar).toHaveTextContent("PS");
  },
};

export const BrokenImage: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a photo that fails falls back to initials",
  // A photo that can't decode: it fails at once, offline, with no request to wait on.
  args: { src: "data:image/png;base64,AAAA", size: "lg" },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole("img", { name: "Priya Sharma" });
    await expect(avatar).toHaveTextContent("PS");
    await expect(avatar.querySelector("img")).toBeNull();
  },
};
