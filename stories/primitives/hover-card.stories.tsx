import { Avatar, AvatarFallback, HoverCard, HoverCardContent, HoverCardTrigger } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A rich preview card that opens on hover, providing contextual information without navigating away. Use it for user mentions, organisation references, and resource previews — for example showing a member's role and last active time in Qeet ID's audit log or a people record in qeet-people.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Member preview card — hover a user mention in the audit log to see their role and organisation.",
      },
    },
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        Ada Lovelace
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">Ada Lovelace</p>
            <p className="text-sm text-muted-foreground">
              Admin · Acme Inc. · Last active 3 min ago
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const OrgPreview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Organisation preview — hover an org reference anywhere in Qeet ID to see its member count and plan.",
      },
    },
  },
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline">
        Globex Corp
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>GX</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">Globex Corp</p>
            <p className="text-sm text-muted-foreground">
              48 members · Pro plan · Created Jan 2025
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
