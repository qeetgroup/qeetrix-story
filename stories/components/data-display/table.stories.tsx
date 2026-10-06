import { KeyRoundIcon, PlusIcon } from "@qeetrix/icons";
import {
  Button,
  Checkbox,
  EmptyState,
  Link,
  StatusPill,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Table> = {
  title: "Components/Data Display/Table",
  component: Table,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Semantic HTML table with Qeetrix styling. Compose `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption` to build data-dense views such as member lists, audit logs, and API-key management screens.\n\nThe header and footer are a quiet filled band; body rows get hairline separators, a hover wash, and — for `data-state="selected"` — the brand-subtle tint plus a 2px inline-start bar, so selection is carried by shape as well as colour. `TableEmpty` is the full-width “nothing to show” row (pass the visible column count as `colSpan`); it never takes the hover wash. For long lists, cap the scroll container with `containerClassName` and set `sticky` on `TableHeader` to keep the column names in view.',
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

export const WithEmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`TableEmpty` in place of the rows when a filter matches nothing. Keep the header, so the reader still sees what the table would hold, and say why it is empty in one sentence. `colSpan` is the table's visible column count.",
      },
    },
  },
  render: () => (
    <Table className="w-[640px]">
      <TableCaption>Members matching “contractor” · Acme Corp</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={4}>
          No members match “contractor”. Clear the filter to see all 4 members.
        </TableEmpty>
      </TableBody>
    </Table>
  ),
};

export const EmptyWithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A first-use Qeet ID API-key list. When there is a next step to offer, put a small `EmptyState` with its action inside `TableEmpty` rather than a sentence.",
      },
    },
  },
  render: () => (
    <Table className="w-[640px]">
      <TableHeader>
        <TableRow>
          <TableHead>Key name</TableHead>
          <TableHead>Key ID</TableHead>
          <TableHead>Last used</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={4} className="p-0">
          <EmptyState
            size="sm"
            variant="first-use"
            icon={KeyRoundIcon}
            title="No API keys yet"
            description="Create a key to call the Qeet ID Management API from your backend."
            action={
              <Button size="sm">
                <PlusIcon aria-hidden />
                Create API key
              </Button>
            }
          />
        </TableEmpty>
      </TableBody>
    </Table>
  ),
};

const ingestionSources = [
  { source: "payments-api", region: "ap-south-1", events: 1_284_310, status: "live" },
  { source: "checkout-web", region: "ap-south-1", events: 942_118, status: "live" },
  { source: "payouts-worker", region: "ap-south-1", events: 311_402, status: "live" },
  { source: "gst-invoicer", region: "ap-south-2", events: 208_977, status: "degraded" },
  { source: "id-hosted-login", region: "ap-south-1", events: 187_645, status: "live" },
  { source: "id-token-service", region: "ap-south-1", events: 176_090, status: "live" },
  { source: "notify-email", region: "eu-west-1", events: 98_221, status: "live" },
  { source: "notify-sms", region: "ap-south-1", events: 87_506, status: "live" },
  { source: "people-payroll", region: "ap-south-1", events: 41_380, status: "scheduled" },
  { source: "people-attendance", region: "ap-south-1", events: 36_914, status: "live" },
  { source: "legacy-cron", region: "us-east-1", events: 0, status: "down" },
  { source: "staging-mirror", region: "ap-south-1", events: 0, status: "archived" },
];

export const StickyHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "qeet-logs ingestion sources in a height-capped container. `containerClassName` sets the cap on the scrolling wrapper and `sticky` keeps the header band — opaque, with its rule drawn inside the cells — in view while the rows scroll under it. A capped container is a scroll region, and a keyboard user can only scroll it by tabbing to something inside it: here each source links to its log stream. `Table` does not forward `tabIndex` or a name to its container, so a capped table with no focusable cells is not keyboard-scrollable.",
      },
    },
  },
  render: () => (
    <Table
      className="w-[640px]"
      containerClassName="max-h-72 rounded-(--qx-corner-surface) border border-border"
    >
      <TableCaption>Ingestion sources · last 24 hours</TableCaption>
      <TableHeader sticky>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Region</TableHead>
          <TableHead className="text-end">Events</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingestionSources.map(({ source, region, events, status }) => (
          <TableRow key={source}>
            <TableCell className="font-mono text-xs">
              <Link href={`#source-${source}`}>{source}</Link>
            </TableCell>
            <TableCell>{region}</TableCell>
            <TableCell className="text-end">{events.toLocaleString("en-IN")}</TableCell>
            <TableCell>
              <StatusPill status={status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

function SelectableMembers() {
  const [selected, setSelected] = React.useState<Set<string>>(
    () => new Set(["alan@acme.com", "grace@acme.com"]),
  );
  const toggle = (email: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(email);
      else next.delete(email);
      return next;
    });

  return (
    <Table className="w-[640px]">
      <TableCaption>{selected.size} of 4 members selected</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <span className="sr-only">Select</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(({ name, email, role, status }) => (
          <TableRow key={email} data-state={selected.has(email) ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${name}`}
                checked={selected.has(email)}
                onCheckedChange={(checked) => toggle(email, checked)}
              />
            </TableCell>
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
  );
}

export const SelectedRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Rows with `data-state="selected"` take the brand-subtle tint and a 2px inline-start bar on their first cell; under forced colours the bar becomes the system Highlight. The checkbox is still the control and the source of truth — the row styling only mirrors it.',
      },
    },
  },
  render: () => <SelectableMembers />,
};
