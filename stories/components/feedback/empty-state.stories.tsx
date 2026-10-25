import { CircleAlertIcon } from "@qeetrix/icons/icons/circle-alert";
import { FunnelXIcon } from "@qeetrix/icons/icons/funnel-x";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { SearchXIcon } from "@qeetrix/icons/icons/search-x";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import { Button, Card, Grid, Link, Stack, Table, Text } from "@qeetrix/react";
import { EmptyState, SearchField } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof EmptyState> = {
  title: "Components/Feedback/EmptyState",
  component: EmptyState,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "experimental" }),
    layout: "padded",
  },
  tags: ["autodocs", "experimental"],
  args: {
    icon: UsersIcon,
    title: "No users yet",
    description: "Invite your team, or connect a directory to sync them.",
    actions: <Button icon={PlusIcon}>Invite users</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Grid columns={{ base: 1, expanded: 3 }} gap="lg" align="start">
      <EmptyState
        size="section"
        icon={KeyRoundIcon}
        title="No API keys yet"
        description="Create a key to call the Management API."
        actions={<Button icon={PlusIcon}>Create API key</Button>}
      >
        <Link href="#api-keys">About API keys</Link>
      </EmptyState>
      <EmptyState
        size="section"
        icon={SearchXIcon}
        title="No users match “priya.s”"
        description="Check the spelling, or search by email."
        actions={
          <Button variant="soft" icon={FunnelXIcon}>
            Clear search
          </Button>
        }
      />
      <EmptyState
        size="section"
        tone="danger"
        icon={CircleAlertIcon}
        title="Couldn't load API keys"
        description="Your keys are safe. Try again in a moment."
        actions={<Button variant="soft">Try again</Button>}
      />
    </Grid>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Grid columns={{ base: 1, expanded: 2 }} gap="lg" align="start">
      {(["page", "section"] as const).map((size) => (
        <Stack key={size} gap="sm">
          <Text size="sm" tone="subtle">
            {size === "page" ? "Page" : "Section"}
          </Text>
          <EmptyState
            size={size}
            icon={UsersIcon}
            title="No users yet"
            description="Invite your team to get started."
            actions={<Button icon={PlusIcon}>Invite users</Button>}
          />
        </Stack>
      ))}
    </Grid>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <Card>
      <Table
        label="Users"
        rows={[] as { name: string; email: string }[]}
        rowId={(user) => user.email}
        rowLabel={(user) => user.name}
        toolbar={
          <SearchField
            aria-label="Search users"
            placeholder="Search by name, email or ID"
            style={{ inlineSize: 300 }}
          />
        }
        columns={[
          { id: "name", header: "Name", cell: (user) => user.name },
          { id: "email", header: "Email", cell: (user) => user.email },
          { id: "status", header: "Status", cell: () => "Active" },
        ]}
        empty={
          <EmptyState
            size="section"
            icon={UsersIcon}
            title="No users yet"
            description="Invite your team, or connect a directory to sync them."
            actions={<Button icon={PlusIcon}>Invite users</Button>}
          />
        }
      />
    </Card>
  ),
};

export const HeadingInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: level makes the title a heading",
  args: { level: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "No users yet" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Invite users" })).toBeVisible();
  },
};

export const DecorativeIcon: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the icon is decorative",
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.queryByRole("heading")).toBeNull();
  },
};

export const FooterInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: children render under the actions",
  args: { children: "Or import users from a CSV file." },
  play: async ({ canvas, canvasElement }) => {
    const footer = canvasElement.querySelector("[data-slot=empty-state-footer]");
    await expect(footer).toHaveTextContent("Or import users from a CSV file.");
    await expect(footer).toBeVisible();
    const actions = canvas.getByRole("button", { name: "Invite users" });
    await expect(
      actions.compareDocumentPosition(footer as Node) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};
