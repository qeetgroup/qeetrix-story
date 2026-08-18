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

const meta: Meta<typeof Menubar> = {
  title: "Primitives/Menubar",
  component: Menubar,
  parameters: {
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
