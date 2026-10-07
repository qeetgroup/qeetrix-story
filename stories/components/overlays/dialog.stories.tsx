import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  DialogBody,
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
  Label,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";
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
          "A modal dialog that overlays the page and traps focus until dismissed. Use it for forms and confirmations that require user input before continuing — editing a profile, creating an API key, or configuring an SSO connection in Qeet ID. For irreversible destructive actions, prefer `AlertDialog` instead.\n\nCompose it as `DialogHeader` → `DialogBody` → `DialogFooter`. `DialogBody` is the scrolling region: long content scrolls inside it while the header and footer stay pinned, so the primary action never scrolls out of reach. `DialogContent` takes a `size` — `sm`, `default`, `lg`, `xl` or `full` — that steps the max width on the container scale and always leaves a 1rem gutter; `full` fills the viewport for dense working surfaces.",
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
          "Standard form dialog — edit display name and save, with Cancel and Save actions in the footer. The field sits in `DialogBody`, the slot for everything between the header and the footer.",
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
        <DialogBody>
          <Field>
            <FieldLabel htmlFor="dialog-name">Display name</FieldLabel>
            <Input id="dialog-name" defaultValue="Ada Lovelace" />
          </Field>
        </DialogBody>
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

const DIALOG_SIZES = [
  {
    size: "sm",
    title: "Sign out everywhere?",
    description: "Ends all 4 active Qeet ID sessions. Each device will ask for a passkey again.",
  },
  {
    size: "default",
    title: "Edit profile",
    description: "Update your display name and contact email.",
  },
  {
    size: "lg",
    title: "Create API key",
    description:
      "Choose scopes and an expiry for a machine-to-machine key on the Acme Inc. tenant.",
  },
  {
    size: "xl",
    title: "Map SAML attributes",
    description: "Match Okta assertion attributes to Qeet ID profile fields, side by side.",
  },
  {
    size: "full",
    title: "Review settlement batch",
    description:
      "Reconcile 1,284 qeet-pay transactions for 6 Oct 2026 before the payout is released.",
  },
] as const;

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`size` on `DialogContent` steps the max width on the container scale — `sm` (24rem) for a one-line confirmation, `default` (32rem) for a short form, `lg` (42rem) and `xl` (56rem) for richer forms and side-by-side mappings, and `full` for dense working surfaces such as a settlement table or a policy editor. Every size keeps a 1rem gutter, so none of them touches the edges of a phone.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {DIALOG_SIZES.map(({ size, title, description }) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline">{`size="${size}"`}</Button>} />
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <DialogClose render={<Button>Continue</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

const API_KEY_SCOPES: Array<[string, string]> = [
  ["openid", "Confirm the caller's identity with Qeet ID."],
  ["profile", "Read names, avatars and locales."],
  ["email", "Read primary email addresses and their verification state."],
  ["offline_access", "Refresh tokens without a user present."],
  ["id.users:read", "List members of the Acme Inc. organisation."],
  ["id.users:write", "Invite, suspend and remove members."],
  ["id.roles:read", "Read role assignments and permission sets."],
  ["id.sessions:read", "See active sessions and the devices they are on."],
  ["id.sessions:revoke", "Sign members out of individual sessions."],
  ["id.audit:read", "Read the Qeet ID audit trail."],
  ["pay.invoices:read", "List and download GST invoices."],
  ["pay.invoices:write", "Create, edit and void draft invoices."],
  ["pay.payouts:read", "See settlement batches and payout status."],
  ["pay.refunds:write", "Issue full and partial refunds."],
  ["pay.webhooks:manage", "Register and rotate qeet-pay webhook endpoints."],
  ["logs.events:read", "Query qeet-logs events for this tenant."],
  ["logs.streams:write", "Create, pause and delete log streams."],
  ["logs.alerts:manage", "Create alert rules and mute notifications."],
  ["notify.templates:read", "Read email and SMS templates."],
  ["notify.messages:send", "Send transactional notifications on the tenant's behalf."],
  ["people.directory:read", "Read the employee directory and reporting lines."],
  ["people.payroll:read", "Read payslips and salary structures."],
];

/**
 * A form long enough to overflow the dialog at any common viewport height, so the body has to
 * scroll — shared by the docs story and its interaction test.
 */
function CreateApiKeyDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Create API key</Button>} />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Keys authenticate machine-to-machine requests to the Acme Inc. tenant. Grant only the
            scopes the integration needs.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="api-key-name">Key name</FieldLabel>
            <Input id="api-key-name" defaultValue="qeet-pay reconciler" />
          </Field>
          <CheckboxGroup aria-label="Scopes" defaultValue={["openid", "pay.payouts:read"]}>
            {API_KEY_SCOPES.map(([scope, detail]) => (
              <div key={scope} className="flex items-start gap-2">
                <Checkbox
                  id={`api-key-scope-${scope}`}
                  value={scope}
                  aria-describedby={`api-key-scope-${scope}-detail`}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={`api-key-scope-${scope}`} className="font-mono text-xs">
                    {scope}
                  </Label>
                  <p id={`api-key-scope-${scope}-detail`} className="text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </CheckboxGroup>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Create key</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const WithBody: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`DialogBody` is the scrolling region between the header and the footer. With 22 scopes the form is taller than the viewport: the body scrolls while the title and the Create key action stay pinned. It bleeds to the dialog edges so the scrollbar sits at the border, and keeps 4px of block padding so a focused field's ring is never clipped. Without `DialogBody` the whole dialog scrolls instead — still bounded, but the primary action scrolls away.",
      },
    },
  },
  render: () => <CreateApiKeyDialog />,
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

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

export const BodyScrollInteraction: Story = {
  name: "Interaction: body scrolls, footer stays",
  parameters: {
    docs: {
      description: {
        story:
          "The point of `DialogBody` is that the primary action stays reachable however long the content is. Moving focus to the last scope scrolls the body, not the dialog, and the footer action must still sit inside the dialog's visible box afterwards.",
      },
    },
  },
  render: () => <CreateApiKeyDialog />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Create API key" }));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toBeVisible());

    const lastScope = within(dialog).getByRole("checkbox", { name: "people.payroll:read" });
    const body = lastScope.closest<HTMLElement>('[data-slot="dialog-body"]');
    await expect(body).not.toBeNull();
    // The content really overflows — otherwise the rest of this test would pass vacuously.
    await expect(body?.scrollHeight ?? 0).toBeGreaterThan(body?.clientHeight ?? 0);

    // Focusing the last field scrolls its nearest scroll container into place.
    lastScope.focus();
    await waitFor(() => expect(body?.scrollTop ?? 0).toBeGreaterThan(0));

    // The dialog itself did not scroll, and the primary action is still inside it.
    await expect(dialog.scrollTop).toBe(0);
    const create = within(dialog).getByRole("button", { name: "Create key" });
    await expect(create.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      dialog.getBoundingClientRect().bottom,
    );

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};
