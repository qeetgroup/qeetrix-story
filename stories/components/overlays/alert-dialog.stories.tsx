import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, waitForElementToBeRemoved } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/Overlays/AlertDialog",
  component: AlertDialog,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog that interrupts the user to confirm a destructive or irreversible action. Unlike `Dialog`, it cannot be dismissed by clicking the backdrop — both `AlertDialogCancel` and `AlertDialogAction` must be explicit. Use it wherever the consequence is hard to undo: revoking API keys, deleting members, or cancelling a Qeet Pay subscription.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Confirm before revoking an API key — the action button inherits destructive styling by default.",
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Revoke key</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
          <AlertDialogDescription>
            Applications using <code>qid_live_8f2c…</code> will immediately lose access. This cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Revoke</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const RemoveMember: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Removing a member from an organisation — a common Qeet ID admin action requiring explicit confirmation.",
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Remove member</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Grace Hopper from Acme Inc.?</AlertDialogTitle>
          <AlertDialogDescription>
            Their active sessions will be terminated and all role assignments revoked. They can be
            re-invited later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Remove member</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const CancelInteraction: Story = {
  name: "Interaction: cancelling a destructive action",
  parameters: {
    docs: {
      description: {
        story:
          "The confirmation exists to make the destructive action escapable, so Cancel is the path worth asserting. It must dismiss the dialog and leave the trigger untouched.",
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Revoke key</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this API key?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Revoke</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Revoke key" }));

    const dialog = await screen.findByRole("alertdialog");
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitForElementToBeRemoved(() => screen.queryByRole("alertdialog"));
    await expect(canvas.getByRole("button", { name: "Revoke key" })).toBeVisible();
  },
};
