import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Menubar> = {
  title: "Components/Navigation/Menubar",
  component: Menubar,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal bar of trigger menus — the desktop application equivalent of a native menu bar. Use it in rich tooling surfaces like the qeet-logs query editor or the Qeet ID admin rule builder where multiple top-level command groups need to be always visible.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Query editor menubar for qeet-logs — groups stream, query, and view actions into top-level menus with keyboard shortcuts.",
      },
    },
  },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Stream</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New stream <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open saved query… <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Export results <MenubarShortcut>⌘⇧E</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Query</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Run <MenubarShortcut>⌘↵</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Format SQL</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Toggle sidebar <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const OpenMenuInteraction: Story = {
  name: "Interaction: opening a menubar menu",
  parameters: {
    docs: {
      description: {
        story:
          "A menubar is a single tab stop containing several menus. This asserts a trigger opens its own menu and that Escape returns the user to the bar rather than stranding them inside it.",
      },
    },
  },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Stream</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New stream</MenubarItem>
          <MenubarItem>Open saved query…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("menuitem", { name: "Stream" });

    await userEvent.click(trigger);

    const item = await screen.findByRole("menuitem", { name: "New stream" });
    await waitFor(() => expect(item).toBeVisible());

    await userEvent.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: "New stream" })).not.toBeInTheDocument(),
    );
  },
};
