import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLabel,
  Input,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, waitForElementToBeRemoved } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Dialog> = {
  title: "Components/Overlays/Dialog",
  component: Dialog,
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog that overlays the page and traps focus until dismissed. Use it for forms and confirmations that require user input before continuing — editing a profile, creating an API key, or configuring an SSO connection in Qeet ID. For irreversible destructive actions, prefer `AlertDialog` instead.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard form dialog — edit display name and save, with Cancel and Save actions in the footer.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your account details. Changes are saved immediately.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dialog-name">Display name</FieldLabel>
          <Input id="dialog-name" defaultValue="Ada Lovelace" />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`showCloseButton={false}` removes the corner ✕ — force the user to make an explicit choice via the footer action.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No corner close</DialogTitle>
          <DialogDescription>
            Dismiss via the footer action, the backdrop, or the Escape key.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button>Got it</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OpenCloseInteraction: Story = {
  name: "Interaction: open, escape, close",
  parameters: {
    docs: {
      description: {
        story:
          "Dismissal is the part of a dialog most likely to break silently. Escape must close it, because a dialog that traps focus and cannot be dismissed by keyboard is a trap in the literal sense.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your account details.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));

    // Dialog content is portalled to document.body, so it is outside `canvas`.
    // It also mounts at opacity 0 and animates in, so visibility has to be polled
    // rather than asserted on the first frame — jsdom would never surface this.
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.keyboard("{Escape}");

    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  },
};
