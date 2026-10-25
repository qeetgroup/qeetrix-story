import { Badge, Card, Inline, Stack } from "@qeetrix/react";
import { AvatarItem } from "@qeetrix/react/experimental";
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

const meta: Meta<typeof AvatarItem> = {
  title: "Components/Media/AvatarItem",
  component: AvatarItem,
  parameters: {
    qeetrix: qx({ category: "media", status: "experimental" }),
    layout: "centered",
  },
  args: {
    name: "Priya Sharma",
    description: "priya@acme.in",
    size: "md",
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof AvatarItem>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="xl">
      <AvatarItem {...args} size="sm" description={undefined} />
      <AvatarItem {...args} size="md" />
      <AvatarItem {...args} size="lg" />
      <AvatarItem {...args} size="xl" />
    </Inline>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Inline gap="xl">
      <AvatarItem {...args} />
      <AvatarItem {...args} name="Acme Pvt Ltd" description="acme.in" shape="square" />
    </Inline>
  ),
};

const MEMBERS = [
  { name: "Priya Sharma", email: "priya@acme.in", role: "Owner", tone: "brand" },
  { name: "Rahul Verma", email: "rahul.verma@acme.in", role: "Admin", tone: "neutral", src: PHOTO },
  { name: "Karthik Reddy", email: "karthik.r@acme.in", role: "Invited", tone: "info" },
] as const;

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 400 }}>
      <Card title="Organisation admins" level={2}>
        <Stack gap="md">
          {MEMBERS.map((member) => (
            <Inline key={member.email} gap="md" justify="between" wrap={false}>
              <AvatarItem
                name={member.name}
                description={member.email}
                {...("src" in member ? { src: member.src } : {})}
              />
              <Badge tone={member.tone}>{member.role}</Badge>
            </Inline>
          ))}
        </Stack>
      </Card>
    </div>
  ),
};

export const AvatarHidden: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the name is read once",
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Priya Sharma")).toBeVisible();
    await expect(canvas.queryByRole("img")).toBeNull();
    const avatar = canvasElement.querySelector("[data-slot=avatar]");
    await expect(avatar).toHaveAttribute("aria-hidden", "true");
  },
};
