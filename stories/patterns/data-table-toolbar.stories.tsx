import {
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TrashIcon,
  UserPenIcon,
} from "@qeetrix/icons";
import {
  type ActiveFilter,
  Button,
  Checkbox,
  DataState,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FilterBar,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusPill,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, waitFor } from "storybook/test";
import { qx } from "../_contract";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: string;
  lastActive: string;
}

const MEMBERS: Member[] = [
  {
    id: "usr_01",
    name: "Ada Lovelace",
    email: "ada.lovelace@acme.in",
    role: "Owner",
    status: "active",
    lastActive: "2 minutes ago",
  },
  {
    id: "usr_02",
    name: "Rukmini Iyer",
    email: "rukmini.iyer@acme.in",
    role: "Admin",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "usr_03",
    name: "Farhan Qureshi",
    email: "farhan.qureshi@acme.in",
    role: "Admin",
    status: "active",
    lastActive: "Yesterday",
  },
  {
    id: "usr_04",
    name: "Meera Nair",
    email: "meera.nair@acme.in",
    role: "Member",
    status: "pending",
    lastActive: "Never — invite sent 3 days ago",
  },
  {
    id: "usr_05",
    name: "Jonas Weber",
    email: "jonas.weber@acme.de",
    role: "Member",
    status: "suspended",
    lastActive: "27 days ago",
  },
];

/**
 * The search box. A visible magnifier in an addon plus an `aria-label` on the
 * input — a placeholder is not a label, and this control has no visible one.
 */
function SearchField({
  value = "",
  onValueChange,
}: {
  value?: string;
  onValueChange?: (next: string) => void;
}) {
  return (
    <InputGroup className="w-full sm:w-72">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label="Search members by name or email"
        placeholder="Search members…"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
    </InputGroup>
  );
}

function ColumnsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <SlidersHorizontalIcon />
            Columns
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Email</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Role</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Last active</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MembersTable({
  rows,
  selected,
  onToggle,
  onToggleAll,
}: {
  rows: Member[];
  selected?: string[];
  onToggle?: (id: string) => void;
  onToggleAll?: (next: boolean) => void;
}) {
  const selectable = Boolean(onToggle);
  const selectedIds = selected ?? [];
  const allSelected = selectable && rows.length > 0 && selectedIds.length === rows.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Table aria-label="Members of Acme Technologies">
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select every member on this page"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(next) => onToggleAll?.(Boolean(next))}
              />
            </TableHead>
          ) : null}
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((member) => (
          <TableRow key={member.id} data-selected={selectedIds.includes(member.id) || undefined}>
            {selectable ? (
              <TableCell>
                <Checkbox
                  aria-label={`Select ${member.name}`}
                  checked={selectedIds.includes(member.id)}
                  onCheckedChange={() => onToggle?.(member.id)}
                />
              </TableCell>
            ) : null}
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell className="text-muted-foreground">{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>
              <StatusPill status={member.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Typography as="h2" variant="small" className="font-heading text-base">
          Members
        </Typography>
        <Typography variant="muted">
          Everyone with access to the Acme Technologies tenant in Qeet ID.
        </Typography>
      </div>
      {children}
    </div>
  );
}

const meta: Meta = {
  title: "Patterns/DataTableToolbar",
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "**The strip above a table.** Search, filters, column visibility, export and the primary",
          "create action on one row; the selection toolbar that replaces it once rows are ticked;",
          "and the empty / loading states the table underneath can land in.",
          "",
          "**Reading order is the whole point.** Left to right: *narrow the set* (search, filters),",
          "then *change the view* (columns, density), then *act on the set* (export, create). Teams",
          "that scatter these end up with an Export button next to a search box, and users cannot",
          "tell which controls change what they see from which change their data.",
          "",
          "**Use it** above every index screen: Qeet ID members and API keys, Qeet Logs saved",
          "queries, Qeet Pay invoices, Qeet People employees. `DataTable` ships its own toolbar and",
          "is the right answer when the built-in one fits — this pattern is the reference for when",
          "it does not, and for the plain `Table` case.",
          "",
          "**Do not use it** for fewer than ~10 rows that fit on screen: a search box over eight",
          "items is furniture. Do not put destructive bulk actions in the resting toolbar either —",
          "they belong in the selection toolbar, scoped to an explicit selection, so “Remove” can",
          "never be a mis-click that means *everyone*.",
          "",
          "**Accessibility notes.** The search input has an `aria-label` because a placeholder is",
          "not a name; the select-all checkbox goes `indeterminate` on a partial selection rather",
          "than lying about being unchecked; every row checkbox names its row, so a screen reader",
          "hears “Select Meera Nair”, not the fifth of five identical “Select”s; and the selection",
          'toolbar is a real `role="toolbar"` with a name, so it is reachable as one unit.',
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The resting toolbar. Search and the two facet selects narrow the set; Columns changes the view; Export and Invite act. `Pagination` closes the table so the row count is never a mystery.",
      },
    },
  },
  render: () => (
    <Shell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchField />
          <Select defaultValue="all">
            <SelectTrigger size="sm" className="w-32" aria-label="Filter by role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger size="sm" className="w-36" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ColumnsMenu />
          <Button variant="outline" size="sm">
            <DownloadIcon />
            Export CSV
          </Button>
          <Button size="sm">
            <PlusIcon />
            Invite member
          </Button>
        </div>
      </div>
      <MembersTable rows={MEMBERS} />
      <Pagination hasNext itemsOnPage={MEMBERS.length} pageSize={5} total={128} />
    </Shell>
  ),
};

export const WithActiveFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Filters applied. `FilterBar` renders each one as a removable chip with a **Clear all** escape hatch, and the count above the table restates the result in words — “5 of 128 members” is the difference between a filtered table and one that looks broken.",
      },
    },
  },
  render: () => {
    const [filters, setFilters] = React.useState<ActiveFilter[]>([
      { field: "role", operator: "is", value: "admin" },
      { field: "status", operator: "is not", value: "suspended" },
    ]);
    const rows = MEMBERS.filter((member) => member.role === "Admin");

    return (
      <Shell>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SearchField />
            <Button size="sm">
              <PlusIcon />
              Invite member
            </Button>
          </div>
          <FilterBar
            fields={[
              {
                key: "role",
                label: "Role",
                options: [
                  { label: "Owner", value: "owner" },
                  { label: "Admin", value: "admin" },
                  { label: "Member", value: "member" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
                  { label: "Suspended", value: "suspended" },
                ],
              },
              { key: "email", label: "Email" },
            ]}
            value={filters}
            onValueChange={setFilters}
          />
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{rows.length}</span> of 128
            members.
          </p>
        </div>
        <MembersTable rows={rows} />
      </Shell>
    );
  },
};

export const BulkSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Rows selected. The selection toolbar takes the place of the search row — same position, different job — and states the count in words so “Remove” is never ambiguous about its blast radius. Destructive actions sit last, behind a separator.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(["usr_02", "usr_03"]);

    return (
      <Shell>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 p-2">
          <span className="ps-1 text-sm font-medium tabular-nums">
            {selected.length} of {MEMBERS.length} members selected
          </span>
          <Toolbar
            aria-label="Bulk actions for the selected members"
            className="border-0 bg-transparent"
          >
            <ToolbarButton>
              <UserPenIcon />
              Change role
            </ToolbarButton>
            <ToolbarButton>
              <DownloadIcon />
              Export selected
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <TrashIcon />
              Remove from tenant
            </ToolbarButton>
            <ToolbarButton onClick={() => setSelected([])}>Clear</ToolbarButton>
          </Toolbar>
        </div>
        <MembersTable
          rows={MEMBERS}
          selected={selected}
          onToggle={(id) =>
            setSelected((current) =>
              current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
            )
          }
          onToggleAll={(next) => setSelected(next ? MEMBERS.map((member) => member.id) : [])}
        />
      </Shell>
    );
  },
};

export const NoResults: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A search that matched nothing. The toolbar stays put — removing it would strand the user with no way to undo the query — and the empty state repeats the term back and offers the one action that fixes it.",
      },
    },
  },
  render: () => (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SearchField value="dorothy@acme" />
        <Button size="sm">
          <PlusIcon />
          Invite member
        </Button>
      </div>
      <div className="rounded-lg border border-border">
        <EmptyState
          icon={SearchIcon}
          title="No members match “dorothy@acme”"
          description="Search covers name and email only. Suspended members are hidden by the Status filter — clear it to include them."
          action={
            <>
              <Button variant="outline" size="sm">
                Clear search
              </Button>
              <Button size="sm">
                <PlusIcon />
                Invite dorothy@acme
              </Button>
            </>
          }
        />
      </div>
    </Shell>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The first fetch. The toolbar renders immediately and disabled — its controls are known before the data is — while `DataState` holds the table's space with skeleton rows.",
      },
    },
  },
  render: () => (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InputGroup className="w-full opacity-60 sm:w-72">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search members by name or email"
            placeholder="Search members…"
            disabled
          />
        </InputGroup>
        <Button size="sm" disabled>
          <PlusIcon />
          Invite member
        </Button>
      </div>
      <div className="rounded-lg border border-border">
        <DataState isLoading skeletonRows={5} skeletonHeight="h-9">
          <MembersTable rows={MEMBERS} />
        </DataState>
      </div>
    </Shell>
  ),
};

export const SelectAllInteraction: Story = {
  name: "Interaction: select all rows",
  parameters: {
    docs: {
      description: {
        story:
          "Ticking the header checkbox has to do two things: select every row on the page, and tell the user how many that was. This asserts both, and that a single row toggle drops the header checkbox into its mixed state instead of silently unticking.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState<string[]>([]);

    return (
      <Shell>
        <p className="text-sm text-muted-foreground" data-testid="selection-summary">
          {selected.length} of {MEMBERS.length} members selected
        </p>
        <MembersTable
          rows={MEMBERS}
          selected={selected}
          onToggle={(id) =>
            setSelected((current) =>
              current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
            )
          }
          onToggleAll={(next) => setSelected(next ? MEMBERS.map((member) => member.id) : [])}
        />
      </Shell>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", {
      name: "Select every member on this page",
    });

    await userEvent.click(selectAll);
    await waitFor(() =>
      expect(canvas.getByTestId("selection-summary")).toHaveTextContent("5 of 5 members selected"),
    );

    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Meera Nair" }));
    await waitFor(() => expect(selectAll).toHaveAttribute("aria-checked", "mixed"));
  },
};
