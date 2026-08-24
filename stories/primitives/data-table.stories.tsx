import {
  Button,
  type ColumnDef,
  DataTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  StatusPill,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Add, Trash } from "@qeetrix/icons";
import * as React from "react";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: string;
  logins: number;
};

const data: Member[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@acme.com",
    role: "Owner",
    status: "active",
    logins: 1280,
  },
  {
    id: "2",
    name: "Alan Turing",
    email: "alan@acme.com",
    role: "Admin",
    status: "active",
    logins: 942,
  },
  {
    id: "3",
    name: "Grace Hopper",
    email: "grace@acme.com",
    role: "Admin",
    status: "active",
    logins: 877,
  },
  {
    id: "4",
    name: "Katherine Johnson",
    email: "katherine@acme.com",
    role: "Member",
    status: "pending",
    logins: 12,
  },
  {
    id: "5",
    name: "Margaret Hamilton",
    email: "margaret@acme.com",
    role: "Member",
    status: "active",
    logins: 433,
  },
  {
    id: "6",
    name: "Dorothy Vaughan",
    email: "dorothy@acme.com",
    role: "Member",
    status: "suspended",
    logins: 0,
  },
  {
    id: "7",
    name: "Annie Easley",
    email: "annie@acme.com",
    role: "Member",
    status: "active",
    logins: 211,
  },
  {
    id: "8",
    name: "Mary Jackson",
    email: "mary@acme.com",
    role: "Member",
    status: "active",
    logins: 188,
  },
  {
    id: "9",
    name: "Radia Perlman",
    email: "radia@acme.com",
    role: "Admin",
    status: "active",
    logins: 654,
  },
  {
    id: "10",
    name: "Barbara Liskov",
    email: "barbara@acme.com",
    role: "Member",
    status: "pending",
    logins: 4,
  },
  {
    id: "11",
    name: "Shafi Goldwasser",
    email: "shafi@acme.com",
    role: "Member",
    status: "active",
    logins: 97,
  },
  {
    id: "12",
    name: "Frances Allen",
    email: "frances@acme.com",
    role: "Member",
    status: "archived",
    logins: 23,
  },
];

const columns: ColumnDef<Member>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusPill status={row.getValue("status")} />,
  },
  {
    accessorKey: "logins",
    header: "Logins",
    cell: ({ row }) => (
      <span className="tabular-nums">{(row.getValue("logins") as number).toLocaleString()}</span>
    ),
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Primitives/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A full-featured data grid built on TanStack Table v8. Ships with pagination, column sorting, global search, faceted filters, row selection, bulk actions, column resizing and pinning, density control, CSV export, expandable sub-rows, and opt-in virtualisation for large datasets. Use it as the primary table primitive on Qeet ID member management, audit-log, and API-key screens.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => <DataTable columns={columns} data={data} pageSize={5} />,
};

export const WithSelectionAndActions: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={data}
      pageSize={5}
      enableRowSelection
      searchPlaceholder="Search members…"
      toolbarActions={
        <Button size="sm">
          <Add /> New member
        </Button>
      }
      bulkActions={(rows) => (
        <Button variant="destructive" size="sm">
          <Trash /> Delete {rows.length}
        </Button>
      )}
    />
  ),
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} />,
};

// Faceted filters require the column to filter on an array of values.
const facetColumns: ColumnDef<Member>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role", filterFn: "arrIncludesSome" },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "arrIncludesSome",
    cell: ({ row }) => <StatusPill status={row.getValue("status")} />,
  },
];

export const ResizableAndPinnable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={data}
      pageSize={0}
      maxHeight={320}
      enableColumnResizing
      enablePinning
    />
  ),
};

export const FacetedFilters: Story = {
  render: () => (
    <DataTable
      columns={facetColumns}
      data={data}
      pageSize={8}
      facetedFilters={[
        {
          columnId: "role",
          title: "Role",
          options: [
            { label: "Owner", value: "Owner" },
            { label: "Admin", value: "Admin" },
            { label: "Member", value: "Member" },
          ],
        },
        { columnId: "status", title: "Status" },
      ]}
    />
  ),
};

export const Expandable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={data}
      pageSize={6}
      enableExpanding
      getRowCanExpand={() => true}
      renderSubComponent={(row) => (
        <div className="p-4 text-sm">
          <p className="font-medium">{row.original.name}</p>
          <p className="text-muted-foreground">
            {row.original.email} · {row.original.role} · {row.original.logins.toLocaleString()}{" "}
            logins
          </p>
        </div>
      )}
    />
  ),
};

export const DensityAndExport: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={data}
      pageSize={8}
      enableDensity
      defaultDensity="compact"
      enableExport
      exportFilename="members.csv"
      persistKey="members-demo"
    />
  ),
};

const bigData: Member[] = Array.from({ length: 5000 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@acme.com`,
  role: i % 7 === 0 ? "Admin" : "Member",
  status: ["active", "pending", "suspended"][i % 3],
  logins: (i * 37) % 2000,
}));

export const Virtualized: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={bigData}
      enableVirtualization
      maxHeight={420}
      searchPlaceholder="Search 5,000 rows…"
    />
  ),
};

export const ManualServerState: Story = {
  render: () => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 3,
    });
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const filtered = data.filter((member) =>
      `${member.name} ${member.email} ${member.role}`
        .toLowerCase()
        .includes(globalFilter.toLowerCase()),
    );
    const sorted = [...filtered].sort((left, right) => {
      const rule = sorting[0];
      if (!rule) return 0;
      const leftValue = String(left[rule.id as keyof Member]);
      const rightValue = String(right[rule.id as keyof Member]);
      return leftValue.localeCompare(rightValue) * (rule.desc ? -1 : 1);
    });
    const start = pagination.pageIndex * pagination.pageSize;
    const page = sorted.slice(start, start + pagination.pageSize);

    return (
      <DataTable
        columns={columns}
        data={page}
        pageSize={pagination.pageSize}
        enableRowSelection
        manualSorting
        manualFiltering
        manualPagination
        rowCount={filtered.length}
        getRowId={(member) => member.id}
        state={{ sorting, globalFilter, pagination, rowSelection }}
        onSortingChange={(updater) => {
          setSorting(updater);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onGlobalFilterChange={(updater) => {
          setGlobalFilter(updater);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onPaginationChange={setPagination}
        onRowSelectionChange={setRowSelection}
        searchPlaceholder="Search server data…"
      />
    );
  },
};
