import {
  Badge,
  Button,
  Inline,
  Link,
  Stack,
  Table,
  type TableColumn,
  Text,
  VisuallyHidden,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/Utilities/VisuallyHidden",
  component: VisuallyHidden,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "centered",
  },
  args: {
    children: "for Priya Sharma",
  },
  // On its own it shows nothing: here it finishes a link that reads "Edit" on screen.
  render: (args) => (
    <Link href="#users/priya">
      Edit <VisuallyHidden {...args} />
    </Link>
  ),
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

/** Shows "Edit"; read as "Edit for Priya Sharma". */
export const Playground: Story = {};

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const MEMBERS: Member[] = [
  { id: "usr_1", name: "Priya Sharma", email: "priya@acme.in", role: "Owner" },
  { id: "usr_2", name: "Rahul Verma", email: "rahul.verma@acme.in", role: "Admin" },
  { id: "usr_3", name: "Ananya Iyer", email: "ananya.iyer@acme.in", role: "Member" },
];

const COLUMNS: TableColumn<Member>[] = [
  { id: "name", header: "Name", cell: (member) => member.name },
  { id: "email", header: "Email", cell: (member) => member.email },
  { id: "role", header: "Role", cell: (member) => <Badge>{member.role}</Badge> },
  {
    id: "edit",
    header: <VisuallyHidden>Edit</VisuallyHidden>,
    align: "end",
    cell: (member) => (
      <Link href={`#users/${member.id}`}>
        Edit<VisuallyHidden> {member.name}</VisuallyHidden>
      </Link>
    ),
  },
];

function Members() {
  return (
    <div style={{ inlineSize: 640 }}>
      <Table
        label="Members"
        rows={MEMBERS}
        rowId={(member) => member.id}
        rowLabel={(member) => member.name}
        columns={COLUMNS}
      />
    </div>
  );
}

export const InContext: Story = {
  name: "In context",
  parameters: {
    docs: { description: { story: 'Each "Edit" is read with its row\'s name.' } },
  },
  render: () => <Members />,
};

/** Selecting rows updates a hidden live region, so the count is announced as it changes. */
function SelectionAnnouncer() {
  const [count, setCount] = useState(0);
  return (
    <Stack gap="sm" align="start">
      <Inline gap="sm">
        <Button variant="soft" onClick={() => setCount((n) => n + 1)}>
          Select a user
        </Button>
        <Button variant="ghost" onClick={() => setCount(0)}>
          Clear
        </Button>
      </Inline>
      <Text tone="subtle">{count === 0 ? "No users selected" : `${count} selected`}</Text>
      <VisuallyHidden role="status">
        {count === 0 ? "" : `${count} ${count === 1 ? "user" : "users"} selected`}
      </VisuallyHidden>
    </Stack>
  );
}

export const NameInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: hidden text names the control, and takes no space",
  render: () => <Members />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("link", { name: "Edit Rahul Verma" })).toHaveAttribute(
      "href",
      "#users/usr_2",
    );
    const hidden = canvasElement.querySelector("[data-slot=visually-hidden]") as HTMLElement;
    await expect(hidden.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    // Clipped, never display: none, so it stays in the accessibility tree.
    await expect(getComputedStyle(hidden).display).not.toBe("none");
  },
};

export const AnnounceInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the status announces the count",
  render: () => <SelectionAnnouncer />,
  play: async ({ canvas, userEvent }) => {
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("");
    await userEvent.click(canvas.getByRole("button", { name: "Select a user" }));
    await userEvent.click(canvas.getByRole("button", { name: "Select a user" }));
    await expect(status).toHaveTextContent("2 users selected");
  },
};

export const DescriptionInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a hidden description reaches the button",
  render: () => (
    <Stack gap="xs" align="start">
      <Button variant="soft" tone="danger" aria-describedby="passkey-warning">
        Remove passkey
      </Button>
      <VisuallyHidden id="passkey-warning">
        This is Priya Sharma's only passkey. Removing it signs her out on every device.
      </VisuallyHidden>
    </Stack>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Remove passkey" }),
    ).toHaveAccessibleDescription(/only passkey/);
  },
};
