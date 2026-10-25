import { Card, Field, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { SearchField } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const USERS = [
  { name: "Priya Sharma", email: "priya.sharma@acme.in" },
  { name: "Rahul Verma", email: "rahul.verma@acme.in" },
  { name: "Ananya Iyer", email: "ananya.iyer@acme.in" },
  { name: "Meera Nair", email: "meera.nair@acme.in" },
];

const meta: Meta<typeof SearchField> = {
  title: "Components/Data Entry/SearchField",
  component: SearchField,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    "aria-label": "Search users",
    placeholder: "e.g. Priya Sharma",
    onValueChange: fn(),
    onSearch: fn(),
  },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <SearchField {...args} />
    </div>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Playground: Story = {};

export const States: Story = {
  args: { "aria-label": undefined },
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Search users">
        <SearchField {...args} defaultValue="priya" />
      </Field>
      <Field label="Search groups" disabled>
        <SearchField {...args} defaultValue="payroll" disabled />
      </Field>
      <Field label="Saved search">
        <SearchField {...args} defaultValue="status:active" readOnly />
      </Field>
    </Stack>
  ),
};

/** Searched once typing pauses, as a server-searched list would be. */
function UserSearch() {
  const [query, setQuery] = useState("");
  const matches = USERS.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div style={{ inlineSize: 400 }}>
      <Card title="Users" level={3}>
        <Stack gap="lg">
          <SearchField
            aria-label="Search users"
            placeholder="e.g. Priya Sharma"
            onSearch={setQuery}
          />
          <Stack gap="sm" render={<ul />} style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {matches.map((user) => (
              <Stack key={user.email} gap="none" render={<li />}>
                <Text weight="medium">{user.name}</Text>
                <Text size="sm" tone="subtle">
                  {user.email}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => <UserSearch />,
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultValue: "प्रिया", "aria-label": "उपयोगकर्ता खोजें", placeholder: "जैसे प्रिया शर्मा" },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <div style={{ inlineSize: 360 }}>
        <SearchField {...args} />
      </div>
    </QeetrixProvider>
  ),
};

export const DebounceInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: searches once typing pauses",
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole("searchbox", { name: "Search users" });
    await expect(canvas.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    await userEvent.type(box, "pri");
    await expect(args.onValueChange).toHaveBeenCalledTimes(3);
    await expect(args.onSearch).not.toHaveBeenCalled();
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledWith("pri"));
    await expect(args.onSearch).toHaveBeenCalledTimes(1);
  },
};

export const EnterAndClearInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: 'Interaction: Enter searches at once, Clear searches ""',
  args: { searchDelay: 60_000 },
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole("searchbox", { name: "Search users" });
    await userEvent.type(box, "rahul{Enter}");
    await expect(args.onSearch).toHaveBeenLastCalledWith("rahul");

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(args.onSearch).toHaveBeenLastCalledWith("");
    await expect(box).toHaveValue("");
    await expect(box).toHaveFocus();
  },
};

export const EscapeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Escape clears first",
  args: { defaultValue: "ananya" },
  play: async ({ args, canvas, userEvent }) => {
    // Stands in for a dialog around the field, listening for the Escape it lets through.
    const outer = fn();
    const listen = (event: KeyboardEvent) => event.key === "Escape" && outer();
    document.addEventListener("keydown", listen);
    try {
      const box = canvas.getByRole("searchbox", { name: "Search users" });
      await userEvent.click(box);
      await userEvent.keyboard("{Escape}");
      await expect(box).toHaveValue("");
      await expect(args.onSearch).toHaveBeenLastCalledWith("");
      await expect(outer).not.toHaveBeenCalled();

      await userEvent.keyboard("{Escape}");
      await expect(outer).toHaveBeenCalledOnce();
    } finally {
      document.removeEventListener("keydown", listen);
    }
  },
};
