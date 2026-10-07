import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Overlays/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A floating menu anchored to a trigger — the standard choice for action menus on table rows, avatar buttons, and resource cards. Supports labels, separators, sub-menus, keyboard shortcuts, and a `destructive` item variant for irreversible actions like deleting a webhook or revoking a session in Qeet ID.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Account menu — triggered from the avatar in the Qeet ID top nav with profile, settings, and sign-out actions.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Ada Lovelace</Button>} />
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>ada@acmeinc.io</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>API keys</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const MemberRowActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Row-level action menu for a member in the Qeet ID Members table — uses the `destructive` variant for the remove action.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm">
            ···
          </Button>
        }
      />
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Change role</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Remove member</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const OpenSelectInteraction: Story = {
  name: "Interaction: open, select, close",
  parameters: {
    docs: {
      description: {
        story:
          "Choosing an item must also dismiss the menu. A menu that stays open after selection is a common regression, and one that renders correctly in a screenshot.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Ada Lovelace</Button>} />
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>API keys</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Ada Lovelace" }));

    const menu = await screen.findByRole("menu");
    await waitFor(() => expect(menu).toBeVisible());
    await expect(screen.getAllByRole("menuitem")).toHaveLength(3);

    await userEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  },
};
