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

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
  parameters: {
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
