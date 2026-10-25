import { SearchIcon } from "@qeetrix/icons/icons/search";
import { Button, Card, Field, Inline, QeetrixProvider, Stack } from "@qeetrix/react";
import { Combobox, type ComboboxItem, type ComboboxProps } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

/** The value is the user ID; the label is what's typed against. */
const PEOPLE: ComboboxItem<string>[] = [
  { value: "usr_1", label: "Priya Sharma", description: "priya.sharma@acme.in" },
  { value: "usr_2", label: "Rahul Verma", description: "rahul.verma@acme.in" },
  { value: "usr_3", label: "Ananya Iyer", description: "ananya.iyer@acme.in" },
  { value: "usr_4", label: "Karthik Reddy", description: "Suspended", disabled: true },
  { value: "usr_5", label: "Meera Nair", description: "meera.nair@acme.in" },
  { value: "usr_6", label: "Arjun Mehta", description: "arjun.mehta@acme.in" },
  { value: "usr_7", label: "Divya Menon", description: "divya.menon@acme.in" },
];

const PERMISSIONS = [
  {
    label: "Directory",
    items: [
      { value: "users.read", label: "Read users" },
      { value: "users.write", label: "Manage users" },
      { value: "groups.write", label: "Manage groups" },
    ],
  },
  {
    label: "Security",
    items: [
      { value: "audit.read", label: "Read audit logs" },
      { value: "sessions.revoke", label: "Revoke sessions" },
      { value: "mfa.reset", label: "Reset MFA" },
    ],
  },
];

const meta: Meta<typeof Combobox> = {
  title: "Components/Data Entry/Combobox",
  component: Combobox,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    items: PEOPLE,
    placeholder: "e.g. Priya Sharma",
    onValueChange: fn(),
  },
  render: (args) => (
    <Field label="Owner" style={{ inlineSize: 360 }}>
      <Combobox {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Playground: Story = {};

/** Padded, so the list opens under the field; its own frame on the docs page. */
const ownFrame = { layout: "padded", docs: { story: { inline: false, height: "460px" } } };

/** A directory searched on a "server" that answers in 600ms, by name or email. */
function PeopleSearch(args: ComboboxProps<string>) {
  const [items, setItems] = useState(PEOPLE.slice(0, 4));
  const [loading, setLoading] = useState(false);
  const reply = useRef<number>(undefined);
  return (
    <Field label="Owner" style={{ inlineSize: 360 }}>
      <Combobox
        icon={SearchIcon}
        {...args}
        items={items}
        loading={loading}
        onSearch={(query) => {
          args.onSearch?.(query);
          setLoading(true);
          window.clearTimeout(reply.current);
          reply.current = window.setTimeout(() => {
            const text = query.toLowerCase();
            setItems(
              PEOPLE.filter((person) =>
                [person.label, person.description ?? ""].some((field) =>
                  field.toLowerCase().includes(text),
                ),
              ),
            );
            setLoading(false);
          }, 600);
        }}
      />
    </Field>
  );
}

export const ServerSearch: Story = {
  name: "Server search",
  parameters: ownFrame,
  args: { defaultOpen: true, placeholder: "e.g. priya@acme.in", onSearch: fn() },
  render: (args) => <PeopleSearch {...(args as ComboboxProps<string>)} />,
};

export const Groups: Story = {
  parameters: ownFrame,
  args: { items: PERMISSIONS, placeholder: "e.g. Read audit logs", defaultOpen: true },
  render: (args) => (
    <Field label="Permission" style={{ inlineSize: 360 }}>
      <Combobox {...args} />
    </Field>
  ),
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["usr_1", "usr_3"], placeholder: undefined },
  render: (args) => (
    <Field label="Members" style={{ inlineSize: 360 }}>
      <Combobox {...args} />
    </Field>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Owner" error="Choose an owner.">
        <Combobox {...args} />
      </Field>
      <Field label="Approver" disabled>
        <Combobox {...args} defaultValue="usr_2" disabled />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <Card
        title="Payroll admins"
        level={3}
        footer={
          <Inline justify="end" gap="sm">
            <Button variant="ghost">Cancel</Button>
            <Button variant="solid">Save group</Button>
          </Inline>
        }
      >
        <Stack gap="lg">
          <Field label="Owner">
            <Combobox items={PEOPLE} defaultValue="usr_1" />
          </Field>
          <Field label="Members">
            <Combobox items={PEOPLE} multiple defaultValue={["usr_2", "usr_3"]} />
          </Field>
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultValue: "usr_1", placeholder: "जैसे प्रिया शर्मा" },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="मालिक" style={{ inlineSize: 360 }}>
        <Combobox {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const FilterInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: type to filter, then choose",
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("combobox", { name: "Owner" });
    await userEvent.click(field);
    await userEvent.type(field, "rah");

    await waitFor(() => expect(screen.getByRole("option", { name: /Rahul Verma/ })).toBeVisible());
    await expect(screen.queryByRole("option", { name: /Priya Sharma/ })).not.toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(field).toHaveValue("Rahul Verma"));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("usr_2", expect.anything());
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  },
};

export const NoMatchesInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: nothing matches",
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("combobox", { name: "Owner" });
    await userEvent.type(field, "zzz");
    await waitFor(() => expect(screen.getByText("No matches")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("No matches")).not.toBeInTheDocument());
  },
};

export const ClearInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: clear the value",
  args: { defaultValue: "usr_1" },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("combobox", { name: "Owner" });
    await expect(field).toHaveValue("Priya Sharma");
    await userEvent.click(canvas.getByRole("button", { name: "Clear Owner" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
    await waitFor(() => expect(field).toHaveValue(""));
    await userEvent.keyboard("{Escape}");
  },
};

export const ServerSearchInteraction: Story = {
  ...ServerSearch,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: server search waits for a pause and shows the wait",
  args: { ...ServerSearch.args, defaultOpen: false },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("combobox", { name: "Owner" });
    await userEvent.click(field);
    await userEvent.type(field, "verma@");
    // Not per key: the search waits for typing to pause.
    await expect(args.onSearch).not.toHaveBeenCalledWith("verma@");
    await waitFor(() => expect(args.onSearch).toHaveBeenLastCalledWith("verma@"));
    await expect(await screen.findByText("Searching…")).toBeVisible();
    await expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");

    // Matched by email on the server, and shown as given: the label doesn't contain "verma@".
    await waitFor(() => expect(screen.queryByText("Searching…")).not.toBeInTheDocument());
    await expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      expect.stringContaining("Rahul Verma"),
    ]);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  },
};

export const MultipleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: add and remove pills",
  args: { multiple: true, defaultValue: ["usr_1", "usr_2"], placeholder: undefined },
  render: (args) => (
    <Field label="Members" style={{ inlineSize: 360 }}>
      <Combobox {...args} />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("combobox", { name: "Members" });
    await expect(field).toHaveAccessibleDescription(/^2 selected/);

    await userEvent.click(canvas.getByRole("button", { name: "Remove Priya Sharma" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["usr_2"], expect.anything());

    await userEvent.click(field);
    await userEvent.keyboard("{Backspace}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith([], expect.anything());

    await userEvent.type(field, "meera");
    await userEvent.click(await screen.findByRole("option", { name: /Meera Nair/ }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["usr_5"], expect.anything());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  },
};
