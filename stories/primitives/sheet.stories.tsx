import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A slide-in panel anchored to an edge of the viewport — right by default, but supports `top`, `right`, `bottom`, and `left` via the `side` prop on `SheetContent`. Use it for detail views, inline editing, and filter drawers that don't warrant a full-page navigation: inspecting a SAML connection, editing a Qeet ID webhook, or reviewing a qeet-logs stream config.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Right-anchored panel (default) — used in Qeet ID to inspect and edit a SAML connection without leaving the Connections list.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">View connection</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Okta SAML — Acme Inc.</SheetTitle>
          <SheetDescription>
            Inspect and edit this SAML connection. Changes take effect immediately.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Left-anchored sheet via `side="left"` — useful for secondary navigation panels or app sidebars on mobile breakpoints.',
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open navigation</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Qeet ID</SheetTitle>
          <SheetDescription>Jump to any section.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
