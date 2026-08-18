import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Surface container with `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter` slots. Available in `size="default"` (standard padding) and `size="sm"` (compact). Use for settings panels, confirmation dialogs, summary tiles, and detail drawers.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard API-key creation card. The footer uses `justify-end` to right-align the Cancel / Create action pair — a common pattern for destructive or irreversible operations.",
      },
    },
  },
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Create API key</CardTitle>
        <CardDescription>Keys grant full access to your tenant.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Name this key so you can recognise it later in the audit log.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Create</Button>
      </CardFooter>
    </Card>
  ),
};

export const SmallVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="sm"` compact variant — ideal for dense lists such as org-member summary tiles in a sidebar or a grid of recent invites.',
      },
    },
  },
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Ada Lovelace</CardTitle>
        <CardDescription>ada@acme.com · Owner</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Member since 12 Jan 2026 · Last active 2 hours ago
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`CardAction` renders in the top-right corner of the header, outside the title/description flow. Used here for a quick Disable toggle on a webhook endpoint — keeps the primary reading path uncluttered.",
      },
    },
  },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Webhook endpoint</CardTitle>
        <CardDescription>https://api.acme.com/hooks/qeet</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Disable
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>
          Subscribed events:{" "}
          <span className="text-foreground font-medium">user.created, session.ended</span>
        </p>
        <p>
          Last delivery: <span className="text-foreground font-medium">200 OK · 3 min ago</span>
        </p>
        <p>
          Signing secret: <span className="font-mono text-foreground">whsec_••••••••6f3a</span>
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost" size="sm">
          View delivery log
        </Button>
      </CardFooter>
    </Card>
  ),
};
