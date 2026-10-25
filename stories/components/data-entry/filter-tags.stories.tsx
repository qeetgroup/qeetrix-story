import { QeetrixProvider, Stack } from "@qeetrix/react";
import { type AppliedFilter, FilterTags, SearchField } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

/** Filters applied to the Users list of Acme Pvt Ltd. */
const FILTERS: AppliedFilter[] = [
  { id: "status", label: "Status", value: "Active" },
  { id: "mfa", label: "MFA", value: "Passkey" },
  { id: "department", label: "Department", value: "Engineering, Finance" },
];

const meta: Meta<typeof FilterTags> = {
  title: "Components/Data Entry/FilterTags",
  component: FilterTags,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "padded",
  },
  args: {
    filters: FILTERS,
    summary: "412 of 1,284 users",
    onRemove: fn(),
    onClear: fn(),
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof FilterTags>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="lg">
      <FilterTags
        {...args}
        filters={[{ id: "status", label: "Status", value: "Suspended" }]}
        summary="18 of 1,284 users"
      />
      <FilterTags {...args} onClear={undefined} summary={undefined} />
      <FilterTags {...args} filters={[]} summary="1,284 users" />
    </Stack>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: {
    filters: [
      { id: "status", label: "स्थिति", value: "सक्रिय" },
      { id: "mfa", label: "MFA", value: "पासकी" },
    ],
    summary: "1,284 में से 412 उपयोगकर्ता",
  },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <FilterTags {...args} />
    </QeetrixProvider>
  ),
};

/** The Users screen's toolbar: a search field over the filters it holds. */
function UsersToolbar() {
  const [filters, setFilters] = useState(FILTERS);
  const search = useRef<HTMLInputElement>(null);
  return (
    <Stack gap="md" style={{ maxInlineSize: 720 }}>
      <div style={{ inlineSize: 360 }}>
        <SearchField ref={search} aria-label="Search users" placeholder="e.g. Priya Sharma" />
      </div>
      <FilterTags
        filters={filters}
        onRemove={(id) => setFilters((all) => all.filter((filter) => filter.id !== id))}
        onClear={() => setFilters([])}
        summary={
          filters.length === 0
            ? "1,284 users"
            : `${["412", "586", "903"][FILTERS.length - filters.length]} of 1,284 users`
        }
        returnFocusTo={search}
      />
    </Stack>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => <UsersToolbar />,
};

export const RemoveInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: remove moves focus to the next tag",
  render: () => <UsersToolbar />,
  play: async ({ canvas, userEvent }) => {
    const list = canvas.getByRole("list", { name: "Applied filters" });
    await expect(list).toBeVisible();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);

    await userEvent.click(canvas.getByRole("button", { name: "Remove filter Status: Active" }));
    await expect(canvas.getByRole("button", { name: "Remove filter MFA: Passkey" })).toHaveFocus();
    await expect(canvas.getByText("586 of 1,284 users")).toHaveAttribute("aria-live", "polite");

    await userEvent.keyboard("{Enter}");
    await expect(
      canvas.getByRole("button", { name: "Remove filter Department: Engineering, Finance" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toHaveFocus();
    await expect(canvas.getByText("1,284 users")).toBeVisible();
  },
};

export const ClearAllInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Clear all",
  render: () => <UsersToolbar />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Clear all" }));
    await expect(canvas.queryByRole("list")).not.toBeInTheDocument();
    await expect(canvas.getByRole("searchbox", { name: "Search users" })).toHaveFocus();
  },
};

export const CallbacksInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: onRemove gets the filter's id",
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Remove filter MFA: Passkey" }));
    await expect(args.onRemove).toHaveBeenCalledWith("mfa");
    await userEvent.click(canvas.getByRole("button", { name: "Clear all" }));
    await expect(args.onClear).toHaveBeenCalledOnce();
  },
};
