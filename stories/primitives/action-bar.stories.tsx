import { ActionBar, ActionBarItem, ActionBarSeparator, Badge, Checkbox } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof ActionBar> = {
  title: "Primitives/ActionBar",
  component: ActionBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'A floating bottom toolbar that surfaces bulk actions when one or more table rows are selected. The bar animates up from the bottom of the viewport when `open` is `true` and slides away when `false`. Compose `ActionBarItem` for buttons, `ActionBarSeparator` for dividers. Pass `selectionCount` and `onClearSelection` to render the built-in selection pill. Follows the WAI-ARIA Toolbar pattern (`role="toolbar"`).',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ActionBar>;

// ---------------------------------------------------------------------------
// Shared sample data
// ---------------------------------------------------------------------------

const MEMBERS = [
  { id: "1", name: "Ada Lovelace", role: "Admin", status: "Active" },
  { id: "2", name: "Grace Hopper", role: "Member", status: "Active" },
  { id: "3", name: "Alan Turing", role: "Viewer", status: "Suspended" },
  { id: "4", name: "Dennis Ritchie", role: "Member", status: "Active" },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Select members in the table to reveal the ActionBar with bulk actions — assign role, export, and remove.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = React.useState<Set<string>>(new Set());

    function toggle(id: string) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }

    return (
      <div className="relative min-h-[420px] w-full max-w-2xl">
        {/* Simple member table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="w-8 pb-2 pr-3" />
              <th className="pb-2 pr-4 font-medium">Name</th>
              <th className="pb-2 pr-4 font-medium">Role</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m) => (
              <tr
                key={m.id}
                className="border-b last:border-0 hover:bg-muted/40 cursor-pointer"
                onClick={() => toggle(m.id)}
              >
                <td className="py-2.5 pr-3">
                  <Checkbox
                    checked={selected.has(m.id)}
                    onCheckedChange={() => toggle(m.id)}
                    aria-label={`Select ${m.name}`}
                  />
                </td>
                <td className="py-2.5 pr-4 font-medium">{m.name}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">{m.role}</td>
                <td className="py-2.5">
                  <Badge variant={m.status === "Active" ? "default" : "secondary"}>
                    {m.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ActionBar
          open={selected.size > 0}
          selectionCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
        >
          <ActionBarItem>Assign role</ActionBarItem>
          <ActionBarItem>Export</ActionBarItem>
          <ActionBarSeparator />
          <ActionBarItem variant="destructive">Remove</ActionBarItem>
        </ActionBar>
      </div>
    );
  },
};

export const Open: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ActionBar with `open` forced to `true` — shows the bar with 3 selected log entries and audit-log-specific actions.",
      },
    },
  },
  render: () => (
    <div className="relative min-h-64 w-full max-w-lg">
      <p className="text-sm text-muted-foreground mb-4">Audit log results — 3 entries selected.</p>
      <ActionBar open selectionCount={3} onClearSelection={() => undefined}>
        <ActionBarItem>Download JSON</ActionBarItem>
        <ActionBarItem>Copy IDs</ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem>Archive</ActionBarItem>
      </ActionBar>
    </div>
  ),
};

export const NoSelectionPill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ActionBar without `selectionCount` — the selection pill is hidden; only the action buttons are shown.",
      },
    },
  },
  render: () => (
    <div className="relative min-h-48 w-full max-w-sm">
      <ActionBar open>
        <ActionBarItem>Mark as read</ActionBarItem>
        <ActionBarItem>Snooze</ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem variant="destructive">Delete</ActionBarItem>
      </ActionBar>
    </div>
  ),
};

export const ClosedFocusContract: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A closed ActionBar remains mounted for its exit transition but is inert, so sequential focus moves directly from Before to After.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-48 flex-col items-start gap-3">
      <button type="button" className="rounded-md border px-3 py-2 text-sm">
        Before
      </button>
      <ActionBar open={false}>
        <ActionBarItem>Hidden action</ActionBarItem>
      </ActionBar>
      <button type="button" className="rounded-md border px-3 py-2 text-sm">
        After
      </button>
    </div>
  ),
};
