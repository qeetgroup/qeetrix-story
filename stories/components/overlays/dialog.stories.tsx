import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  type DialogProps,
  DialogTrigger,
  Inline,
  QeetrixProvider,
  Stack,
  Text,
  TextField,
} from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Dialog> = {
  title: "Components/Overlays/Dialog",
  component: Dialog,
  subcomponents: { DialogTrigger, DialogContent, DialogBody, DialogFooter, DialogClose },
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
  },
  args: {
    onOpenChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

function EditProfileDialog(props: Omit<DialogProps, "children">) {
  return (
    <Dialog {...props}>
      <DialogTrigger render={<Button variant="soft">Edit profile</Button>} />
      <DialogContent
        title="Edit profile"
        description="Members of Acme Pvt Ltd see this name and email."
      >
        <DialogBody>
          <Stack gap="lg">
            <TextField label="Display name" defaultValue="Priya Sharma" />
            <TextField label="Work email" type="email" defaultValue="priya.sharma@acme.in" />
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevokeKeyDialog(props: Omit<DialogProps, "children">) {
  return (
    <Dialog intent="danger" {...props}>
      <DialogTrigger render={<Button tone="danger">Revoke key</Button>} />
      <DialogContent
        title="Revoke this API key?"
        description="The qeet-pay reconciler stops working at once. This can't be undone."
        size="sm"
      >
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button tone="danger">Revoke key</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WarningDialog(props: Omit<DialogProps, "children">) {
  return (
    <Dialog {...props} intent="warning">
      <DialogTrigger render={<Button variant="soft">Turn off enforcement</Button>} />
      <DialogContent
        title="Turn off passkey enforcement?"
        description="Members will be able to sign in with a password again."
      >
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Turn off</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SIZES = [
  { size: "sm", label: "Small", title: "Sign out everywhere?" },
  { size: "md", label: "Medium", title: "Invite a member" },
  { size: "lg", label: "Large", title: "Map SAML attributes" },
  { size: "xl", label: "Extra large", title: "Compare role permissions" },
  { size: "fullscreen", label: "Full screen", title: "Review user import" },
] as const;

const API_KEY_SCOPES: Array<[string, string]> = [
  ["openid", "Confirm the caller's identity with Qeet ID."],
  ["profile", "Read names, avatars and locales."],
  ["email", "Read primary email addresses and whether they are verified."],
  ["offline_access", "Refresh tokens without a user present."],
  ["id.users:read", "List members of Acme Pvt Ltd."],
  ["id.users:write", "Invite, suspend and remove members."],
  ["id.roles:read", "Read role assignments and permission sets."],
  ["id.sessions:read", "See active sessions and the devices they are on."],
  ["id.sessions:revoke", "Sign members out of individual sessions."],
  ["id.audit:read", "Read the Qeet ID audit trail."],
  ["pay.invoices:read", "List and download GST invoices."],
  ["pay.invoices:write", "Create, edit and void draft invoices."],
  ["pay.payouts:read", "See settlement batches and payout status."],
  ["pay.refunds:write", "Issue full and partial refunds."],
  ["logs.events:read", "Query Qeet Logs events for this tenant."],
  ["notify.messages:send", "Send transactional notifications for the tenant."],
  ["people.directory:read", "Read the employee directory and reporting lines."],
  ["people.payroll:read", "Read payslips and salary structures."],
];

/** Taller than the viewport, so the body scrolls. */
function CreateApiKeyDialog(props: Omit<DialogProps, "children">) {
  return (
    <Dialog {...props}>
      <DialogTrigger render={<Button>Create API key</Button>} />
      <DialogContent
        size="lg"
        title="Create API key"
        description="Grant only the scopes the integration needs."
      >
        <DialogBody>
          <Stack gap="xl">
            <TextField label="Key name" defaultValue="qeet-pay reconciler" />
            <CheckboxGroup label="Scopes" defaultValue={["openid", "pay.payouts:read"]}>
              {API_KEY_SCOPES.map(([scope, detail]) => (
                <Checkbox key={scope} value={scope} label={scope} description={detail} />
              ))}
            </CheckboxGroup>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <DialogClose render={<Button>Create key</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Playground: Story = {
  render: (args) => <EditProfileDialog {...args} />,
};

export const Intents: Story = {
  render: (args) => (
    <Inline gap="md">
      <EditProfileDialog {...args} />
      <WarningDialog {...args} />
      <RevokeKeyDialog {...args} />
    </Inline>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md">
      {SIZES.map(({ size, label, title }) => (
        <Dialog key={size} {...args}>
          <DialogTrigger render={<Button variant="soft">{label}</Button>} />
          <DialogContent size={size} title={title} description="Acme Pvt Ltd · Qeet ID">
            {size === "fullscreen" && (
              <DialogBody>
                <Text>acme-employees-oct.csv · 2,000 users</Text>
              </DialogBody>
            )}
            <DialogFooter>
              <DialogClose render={<Button variant="ghost">Cancel</Button>} />
              <DialogClose render={<Button>Continue</Button>} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </Inline>
  ),
};

export const ScrollingBody: Story = {
  name: "Scrolling body",
  render: (args) => <CreateApiKeyDialog {...args} />,
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Dialog {...args}>
        <DialogTrigger render={<Button variant="soft">प्रोफ़ाइल संपादित करें</Button>} />
        <DialogContent title="प्रोफ़ाइल संपादित करें" description="Acme Pvt Ltd के सदस्य यह नाम देखते हैं।">
          <DialogBody>
            <TextField label="नाम" defaultValue="प्रिया शर्मा" />
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost">रद्द करें</Button>} />
            <DialogClose render={<Button>सहेजें</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "प्रोफ़ाइल संपादित करें" }));
    const dialog = await screen.findByRole("dialog", { name: "प्रोफ़ाइल संपादित करें" });
    await expect(within(dialog).getByRole("button", { name: "बंद करें" })).toBeInTheDocument();
  },
};

export const OpenCloseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus moves in, Escape returns it",
  render: (args) => <EditProfileDialog {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" });
    await userEvent.click(trigger);

    // The dialog portals to the end of <body>, outside the canvas.
    const dialog = await screen.findByRole("dialog", { name: "Edit profile" });
    await expect(dialog).toHaveAccessibleDescription(
      "Members of Acme Pvt Ltd see this name and email.",
    );
    await waitFor(() =>
      expect(within(dialog).getByRole("textbox", { name: "Display name" })).toHaveFocus(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const DangerInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: danger ignores Escape, focus starts on Cancel",
  render: (args) => <RevokeKeyDialog {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Revoke key" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Revoke this API key?" });
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus(),
    );
    await expect(within(dialog).queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    // The dismissal is cancelled before it reaches onOpenChange, so the dialog never starts closing.
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog).not.toHaveAttribute("data-ending-style");
    // Left open so the accessibility check runs over the alert dialog itself.
  },
};

export const BodyScrollInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the body scrolls, the footer stays",
  render: (args) => <CreateApiKeyDialog {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Create API key" }));
    const dialog = await screen.findByRole("dialog", { name: "Create API key" });
    await waitFor(() => expect(dialog).toBeVisible());

    const lastScope = within(dialog).getByRole("checkbox", { name: /people\.payroll:read/ });
    const body = lastScope.closest<HTMLElement>("[data-slot=dialog-body]");
    await expect(body).not.toBeNull();
    // The content really overflows; otherwise the rest would pass vacuously.
    await expect(body?.scrollHeight ?? 0).toBeGreaterThan(body?.clientHeight ?? 0);

    lastScope.focus();
    await waitFor(() => expect(body?.scrollTop ?? 0).toBeGreaterThan(0));
    await expect(dialog.scrollTop).toBe(0);
    const create = within(dialog).getByRole("button", { name: "Create key" });
    await expect(create.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      dialog.getBoundingClientRect().bottom,
    );
    // Left open so the accessibility check runs over the open dialog.
  },
};

export const ActionCloseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an action closes it",
  render: (args) => <EditProfileDialog {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Edit profile" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};
