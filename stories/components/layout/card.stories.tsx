import {
  Badge,
  Button,
  Card,
  formatRelativeTime,
  Grid,
  Inline,
  Stack,
  Table,
  Text,
} from "@qeetrix/react";
import { DescriptionItem, DescriptionList } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/** A fixed "now", so relative times read the same in every run. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);
const minutesAgo = (n: number) => NOW - n * 60_000;

const SIGN_INS = [
  { id: "s1", name: "Priya Sharma", method: "Passkey", at: minutesAgo(2) },
  { id: "s2", name: "Rahul Verma", method: "Passkey", at: minutesAgo(18) },
  { id: "s3", name: "Ananya Iyer", method: "Authenticator", at: minutesAgo(64) },
];

function SignIns() {
  return (
    <Table
      label="Recent sign-ins"
      rows={SIGN_INS}
      rowId={(row) => row.id}
      rowLabel={(row) => row.name}
      columns={[
        { id: "name", header: "Name", cell: (row) => row.name },
        { id: "method", header: "Method", cell: (row) => row.method },
        {
          id: "at",
          header: "When",
          align: "end",
          cell: (row) => formatRelativeTime(row.at, "en-IN", NOW),
        },
      ]}
    />
  );
}

const meta: Meta<typeof Card> = {
  title: "Components/Layout/Card",
  component: Card,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
  },
  args: {
    title: "Create API key",
    level: 2,
    description: "Machine-to-machine access to Acme Pvt Ltd.",
    children: "Name the key so you can find it in the audit log.",
  },
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card {...args} />
    </div>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

const viewDocs = (
  <Button variant="ghost" size="sm">
    View docs
  </Button>
);

const createFooter = (
  <>
    <Button variant="ghost" size="sm">
      Cancel
    </Button>
    <Button size="sm">Create key</Button>
  </>
);

// The actions and footer start as the API key card's; type into their controls to replace them.
export const Playground: Story = {
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card {...args} actions={args.actions ?? viewDocs} footer={args.footer ?? createFooter} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 400 }}>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Default
        </Text>
        <Card title="Sign-in methods" level={2}>
          Passkeys first, then authenticator apps.
        </Card>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Subdued
        </Text>
        <Card variant="subdued" title="Usage this month" level={2}>
          48,210 sign-ins · 72% with a passkey
        </Card>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="subtle">
          Danger
        </Text>
        <Card
          tone="danger"
          title="Delete organisation"
          level={2}
          footer={
            <Button size="sm" tone="danger">
              Delete Acme Pvt Ltd
            </Button>
          }
        >
          Removes its 1,284 users and 12 applications. This can't be undone.
        </Card>
      </Stack>
    </Stack>
  ),
};

export const Untitled: Story = {
  args: {
    title: undefined,
    level: undefined,
    description: undefined,
    children: (
      <Inline justify="between">
        <Text tone="subtle">Next payout</Text>
        <Text size="lg" weight="semibold">
          ₹17,96,240
        </Text>
      </Inline>
    ),
  },
};

export const EdgeToEdge: Story = {
  name: "Edge to edge",
  parameters: {
    layout: "padded",
    docs: { description: { story: "A Table or a `rows` DescriptionList as the body." } },
  },
  render: () => (
    <Grid columns={{ base: 1, expanded: 2 }} gap="lg">
      <Card title="Recent sign-ins" level={2}>
        <SignIns />
      </Card>
      <Card title="Priya Sharma" level={2}>
        <DescriptionList>
          <DescriptionItem term="Email">priya@acme.in</DescriptionItem>
          <DescriptionItem term="Status">
            <Badge tone="success">Active</Badge>
          </DescriptionItem>
          <DescriptionItem term="MFA">Passkey</DescriptionItem>
        </DescriptionList>
      </Card>
    </Grid>
  ),
};

export const InContext: Story = {
  name: "In context",
  parameters: { layout: "padded" },
  render: () => (
    <Grid columns={{ base: 1, expanded: 3 }} gap="lg">
      <Card
        title="Collected"
        level={2}
        footer={
          <Button variant="ghost" size="sm">
            View payments
          </Button>
        }
      >
        <Text size="lg" weight="semibold">
          ₹18,42,600
        </Text>
      </Card>
      <Card
        title="Outstanding"
        level={2}
        footer={
          <Button variant="ghost" size="sm">
            View invoices
          </Button>
        }
      >
        <Inline gap="sm">
          <Text size="lg" weight="semibold">
            ₹3,18,200
          </Text>
          <Badge tone="warning">9 overdue</Badge>
        </Inline>
      </Card>
      <Card title="Next payout" level={2} footer={<Button size="sm">Withdraw</Button>}>
        <Text size="lg" weight="semibold">
          ₹17,96,240
        </Text>
      </Card>
    </Grid>
  ),
};

export const ArticleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: renders as an article",
  args: {
    render: <article />,
    title: "Passkeys are now the default",
    level: 3,
    description: "Qeet ID changelog · 21 Oct 2026",
    children: "New users are asked to add a passkey at their first sign-in.",
  },
  play: async ({ canvas }) => {
    const card = canvas.getByRole("article", { name: "Passkeys are now the default" });
    await expect(card).toBeVisible();
  },
};

export const RegionInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a titled card is a named region",
  args: { title: "Recent sign-ins", level: 2, description: undefined, children: <SignIns /> },
  play: async ({ canvas }) => {
    const region = canvas.getByRole("region", { name: "Recent sign-ins" });
    await expect(region.tagName).toBe("SECTION");
    await expect(canvas.getByRole("heading", { level: 2, name: "Recent sign-ins" })).toBeVisible();
  },
};
