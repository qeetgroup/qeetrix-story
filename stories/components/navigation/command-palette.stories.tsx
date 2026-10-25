import { AppWindowIcon } from "@qeetrix/icons/icons/app-window";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { ScrollTextIcon } from "@qeetrix/icons/icons/scroll-text";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { UserPlusIcon } from "@qeetrix/icons/icons/user-plus";
import { Button, QeetrixProvider } from "@qeetrix/react";
import {
  type CommandGroup,
  CommandPalette,
  type CommandPaletteProps,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const GROUPS: CommandGroup[] = [
  {
    label: "Users",
    items: [
      {
        value: "usr_1",
        label: "Priya Sharma",
        description: "priya@acme.in · Engineering",
        avatar: { name: "Priya Sharma" },
      },
      {
        value: "usr_2",
        label: "Priyanka Rao",
        description: "priyanka@acme.in · Finance",
        avatar: { name: "Priyanka Rao" },
      },
      {
        value: "usr_3",
        label: "Rahul Verma",
        description: "rahul.verma@acme.in · Finance",
        avatar: { name: "Rahul Verma" },
      },
    ],
  },
  {
    label: "Applications",
    items: [
      { value: "app_1", label: "Payroll portal", meta: "OIDC", icon: AppWindowIcon },
      { value: "app_2", label: "Priority support desk", meta: "SAML", icon: AppWindowIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        value: "set_1",
        label: "Two-step sign-in",
        meta: "Security › Policies",
        icon: ShieldCheckIcon,
        keywords: ["MFA", "2FA", "OTP"],
      },
      {
        value: "set_2",
        label: "Signing keys",
        meta: "Developers",
        icon: KeyRoundIcon,
        keywords: ["JWKS", "rotate"],
      },
      { value: "set_3", label: "Audit log retention", meta: "Monitoring", icon: ScrollTextIcon },
    ],
  },
  {
    label: "Actions",
    items: [
      { value: "act_1", label: "Invite users", icon: UserPlusIcon, shortcut: ["I"] },
      { value: "act_2", label: "Organisation settings", icon: SettingsIcon, shortcut: ["G", "S"] },
      {
        value: "act_3",
        label: "Export audit log",
        description: "Needs the Auditor role",
        icon: DownloadIcon,
        disabled: true,
      },
    ],
  },
];

/** A console's search button, wired to the palette as a TopBarSearch would be. */
function Console(args: CommandPaletteProps) {
  const [open, setOpen] = useState(args.open ?? args.defaultOpen ?? false);
  return (
    <>
      <Button
        variant="soft"
        icon={SearchIcon}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
      >
        Search or jump to
      </Button>
      <CommandPalette
        {...args}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          args.onOpenChange?.(next);
        }}
      />
    </>
  );
}

type Canvas = ReturnType<typeof within>;

/** Opens the palette from the console's button and returns its search box. */
async function openPalette(
  canvas: Canvas,
  canvasElement: HTMLElement,
  userEvent: { click: (element: Element) => Promise<void> },
) {
  await userEvent.click(canvas.getByRole("button", { name: "Search or jump to" }));
  const body = within(canvasElement.ownerDocument.body);
  return { body, box: await body.findByRole("combobox", { name: "Search or jump to" }) };
}

const meta: Meta<typeof CommandPalette> = {
  title: "Components/Navigation/CommandPalette",
  component: CommandPalette,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "centered",
  },
  args: {
    groups: GROUPS,
    onSelect: fn(),
    onOpenChange: fn(),
    hotkey: true,
  },
  argTypes: {
    groups: { control: false },
  },
  render: (args) => <Console {...args} />,
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

/** Click the button, or press ⌘K / Ctrl+K. */
export const Playground: Story = {};

export const Open: Story = {
  name: "Grouped results",
  // Open from the start: a frame of its own in the docs, so the modal doesn't cover the page.
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  args: { defaultOpen: true },
};

export const Loading: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 240 } } },
  args: { defaultOpen: true, loading: true, groups: [], onQueryChange: fn() },
};

export const FilterInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: results filter as you type",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { body, box } = await openPalette(canvas, canvasElement, userEvent);
    await userEvent.type(box, "pri");
    await expect(await body.findByRole("option", { name: /Priority support desk/ })).toBeVisible();
    await expect(body.queryByRole("option", { name: /Rahul Verma/ })).toBeNull();
  },
};

export const NoResultsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: no results says so",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { body, box } = await openPalette(canvas, canvasElement, userEvent);
    await userEvent.type(box, "gstin");
    await expect(await body.findByRole("status")).toHaveTextContent("No results for “gstin”");
  },
};

const DIRECTORY = [
  "Aarav Mehta",
  "Ananya Iyer",
  "Arjun Nair",
  "Kavya Menon",
  "Meera Joshi",
  "Priya Sharma",
  "Rahul Verma",
  "Rohan Gupta",
  "Sneha Reddy",
  "Vikram Rao",
];

/** The app searches its own directory, as a server would, 600ms after each change. */
function ServerSearch(args: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<CommandGroup[]>([]);
  useEffect(() => {
    if (!query.trim()) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const people = DIRECTORY.filter((name) => name.toLowerCase().includes(q));
      setGroups([
        {
          label: "Users",
          items: people.map((name) => ({
            value: name,
            label: name,
            description: `${name.split(" ")[0]?.toLowerCase()}@acme.in`,
            avatar: { name },
          })),
        },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <Console
      {...args}
      groups={groups}
      loading={loading}
      onQueryChange={(next) => {
        setQuery(next);
        args.onQueryChange?.(next);
      }}
    />
  );
}

export const ServerInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the app searches on the server",
  args: { onQueryChange: fn() },
  render: (args) => <ServerSearch {...args} />,
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const { body, box } = await openPalette(canvas, canvasElement, userEvent);
    await userEvent.type(box, "ra");
    await expect(args.onQueryChange).toHaveBeenLastCalledWith("ra");
    await expect(await body.findByRole("status")).toHaveTextContent("Searching…");
    await expect(await body.findByRole("option", { name: /Rahul Verma/ })).toBeVisible();
  },
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultOpen: true },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Console {...args} />
    </QeetrixProvider>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole("dialog", { name: "खोजें या सीधे जाएँ" })).toBeVisible());
    await expect(body.getByRole("combobox")).toHaveAttribute("placeholder", "खोजें या सीधे जाएँ…");
  },
};

export const HotkeyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: ⌘K opens it, Escape closes it",
  play: async ({ args, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    // It fades in: wait for the end of the opening transition.
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Search or jump to" })).toBeVisible(),
    );
    await expect(body.getByRole("combobox", { name: "Search or jump to" })).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);

    await userEvent.keyboard("{Control>}k{/Control}");
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Search or jump to" })).toBeVisible(),
    );
  },
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrows move, Enter opens, focus returns",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Search or jump to" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");

    await userEvent.type(body.getByRole("combobox", { name: "Search or jump to" }), "pri");
    await expect(body.getByRole("option", { name: /Priya Sharma/ })).toHaveAttribute(
      "data-highlighted",
    );
    await userEvent.keyboard("{ArrowDown}");
    await expect(body.getByRole("option", { name: /Priyanka Rao/ })).toHaveAttribute(
      "data-highlighted",
    );
    await userEvent.keyboard("{Enter}");

    await expect(args.onSelect).toHaveBeenCalledOnce();
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "usr_2" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const KeywordInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: keywords find a setting, clicks open it",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const { body, box } = await openPalette(canvas, canvasElement, userEvent);
    await userEvent.type(box, "mfa");
    const option = body.getByRole("option", { name: /Two-step sign-in/ });
    await expect(body.queryByRole("option", { name: /Signing keys/ })).toBeNull();

    await userEvent.click(option);
    await expect(args.onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "set_1" }));
  },
};
