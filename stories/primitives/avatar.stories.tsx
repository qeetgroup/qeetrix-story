import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Circular user avatar built on Radix UI. Renders an `AvatarImage` when a URL is available; falls back to `AvatarFallback` (initials or icon) when the image fails to load or no src is provided. Compose multiple avatars inside `AvatarGroup` for member-stack UIs.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Fallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fallback state — shown when an image URL is empty or fails to load. Initials are derived from the user\'s display name (here "AL" for Ada Lovelace). This is the render path for users who have not uploaded a profile photo.',
      },
    },
  },
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`AvatarGroup` stacks avatars with a negative margin overlap — used on org-member summaries, PR reviewer lists, and shared-workspace indicators. Initials shown: AL (Ada Lovelace), GH (Grace Hopper), KJ (Katherine Johnson).",
      },
    },
  },
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KJ</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
