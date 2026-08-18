import {
  StatusPill,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Semantic HTML table with Qeetrix styling. Compose `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption` to build data-dense views such as member lists, audit logs, and API-key management screens.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Table>;

const members = [
  {
    name: "Ada Lovelace",
    email: "ada@acme.com",
    role: "Owner",
    status: "active",
  },
  {
    name: "Alan Turing",
    email: "alan@acme.com",
    role: "Admin",
    status: "active",
  },
  {
    name: "Grace Hopper",
    email: "grace@acme.com",
    role: "Member",
    status: "pending",
  },
  {
    name: "Katherine Johnson",
    email: "katherine@acme.com",
    role: "Member",
    status: "revoked",
  },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A four-column member list showing Name, Email, Role, and Status. `StatusPill` is used to render the status badge inside each row.",
      },
    },
  },
  render: () => (
    <Table className="w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(({ name, email, role, status }) => (
          <TableRow key={email}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>
              <StatusPill status={status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates `TableCaption` (rendered below the table by default) and `TableFooter` for summary rows such as seat totals. Useful on billing or usage screens.",
      },
    },
  },
  render: () => (
    <Table className="w-[640px]">
      <TableCaption>Organisation members — Acme Corp · acme.qeet.in</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(({ name, email, role, status }) => (
          <TableRow key={email}>
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell>{email}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>
              <StatusPill status={status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="font-medium">
            Total seats used
          </TableCell>
          <TableCell>4 / 10</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
