import { Card, Inline, QeetrixProvider, Stack, Table, Text } from "@qeetrix/react";
import { AvatarGroup, type AvatarGroupPerson } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const PEOPLE: AvatarGroupPerson[] = [
  "Priya Sharma",
  "Rahul Verma",
  "Ananya Iyer",
  "Karthik Reddy",
  "Meera Nair",
  "Arjun Mehta",
  "Sneha Kulkarni",
].map((name) => ({ name }));

/** The list as this browser's Intl writes it: engines differ on the serial comma. */
const list = (locale: string, items: string[]) =>
  new Intl.ListFormat(locale, { type: "conjunction" }).format(items);

const meta: Meta<typeof AvatarGroup> = {
  title: "Components/Media/AvatarGroup",
  component: AvatarGroup,
  parameters: {
    qeetrix: qx({ category: "media", status: "experimental" }),
    layout: "centered",
  },
  args: {
    people: PEOPLE,
    total: 412,
    max: 3,
    size: "sm",
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap="lg" align="start">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <AvatarGroup {...args} key={size} size={size} />
      ))}
    </Stack>
  ),
};

export const Max: Story = {
  render: (args) => (
    <Stack gap="lg" align="start">
      <Inline gap="md">
        <AvatarGroup {...args} max={5} total={38} size="md" />
        <Text size="sm" tone="subtle">
          max 5
        </Text>
      </Inline>
      <Inline gap="md">
        <AvatarGroup {...args} people={PEOPLE.slice(0, 4)} total={undefined} size="md" />
        <Text size="sm" tone="subtle">
          4 people, max 3
        </Text>
      </Inline>
    </Stack>
  ),
};

const ORGANISATIONS: AvatarGroupPerson[] = [
  "Acme Pvt Ltd",
  "Bharat Foods",
  "Coastal Labs",
  "Deccan Logistics",
  "Everest Fintech",
].map((name) => ({ name }));

export const Shapes: Story = {
  render: (args) => (
    <Stack gap="lg" align="start">
      <Inline gap="md">
        <AvatarGroup {...args} size="md" />
        <Text size="sm" tone="subtle">
          Circle
        </Text>
      </Inline>
      <Inline gap="md">
        <AvatarGroup
          {...args}
          people={ORGANISATIONS}
          total={undefined}
          shape="square"
          size="md"
          messages={{ label: "{count} organisations: {names}" }}
        />
        <Text size="sm" tone="subtle">
          Square
        </Text>
      </Inline>
    </Stack>
  ),
};

const GROUPS = [
  { name: "Engineering", people: PEOPLE, total: 412 },
  { name: "Admins", people: PEOPLE.slice(1, 3), total: 2 },
  { name: "Finance", people: PEOPLE.slice(3), total: 74 },
];

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 480 }}>
      <Card>
        <Table
          label="Groups"
          rows={GROUPS}
          rowId={(group) => group.name}
          rowLabel={(group) => group.name}
          columns={[
            { id: "name", header: "Group", cell: (group) => group.name },
            {
              id: "members",
              header: "Members",
              cell: (group) => <AvatarGroup people={group.people} total={group.total} />,
            },
          ]}
        />
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { total: 1284 },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <AvatarGroup {...args} />
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("img");
    await expect(group.getAttribute("aria-label")).toMatch(/^1,284 लोग: /);
    await expect(group.getAttribute("aria-label")).toContain("1,281 और");
  },
};

export const NamedInFull: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one image, named in full",
  play: async ({ canvas }) => {
    const group = canvas.getByRole("img");
    await expect(group).toHaveAccessibleName(
      `412 people: ${list("en-IN", ["Priya Sharma", "Rahul Verma", "Ananya Iyer", "409 more"])}`,
    );
    await expect(canvas.getByText("+409")).toBeVisible();
  },
};
