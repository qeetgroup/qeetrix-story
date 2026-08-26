import { Key, Monitor, ShieldTick } from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  DataState,
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Form,
  FormActions,
  Input,
  Label,
  NativeSelect,
  PageHeader,
  SecurityItem,
  Separator,
  Spinner,
  Switch,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { qx } from "../_contract";

/** One settings section: a heading, a sentence of context, and its controls. */
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <Typography as="h2" variant="small" className="font-heading text-base">
          {title}
        </Typography>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * A switch row. The description is wired to the control with `aria-describedby`
 * rather than left as loose text, so screen-reader users get the same caveat
 * sighted users read before flipping it.
 */
function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        aria-describedby={`${id}-hint`}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="mt-1"
      />
    </div>
  );
}

function ProfileFields({ disabled }: { disabled?: boolean }) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Full name</FieldLabel>
        <FieldControl render={<Input defaultValue="Ada Lovelace" disabled={disabled} />} />
      </Field>
      <Field>
        <FieldLabel>Work email</FieldLabel>
        <FieldControl
          render={<Input type="email" defaultValue="ada.lovelace@acme.in" disabled readOnly />}
        />
        <FieldDescription>
          Provisioned by SCIM from Acme&apos;s directory — change it there, not here.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Job title</FieldLabel>
        <FieldControl render={<Input defaultValue="Principal Engineer" disabled={disabled} />} />
      </Field>
    </FieldGroup>
  );
}

function LocaleFields({ disabled }: { disabled?: boolean }) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Time zone</FieldLabel>
        <FieldControl
          render={
            <NativeSelect defaultValue="Asia/Kolkata" disabled={disabled}>
              <option value="Asia/Kolkata">(GMT+05:30) India Standard Time</option>
              <option value="Asia/Singapore">(GMT+08:00) Singapore</option>
              <option value="Europe/London">(GMT+00:00) London</option>
              <option value="America/New_York">(GMT−05:00) New York</option>
            </NativeSelect>
          }
        />
        <FieldDescription>
          Used for audit-log timestamps and Qeet People attendance windows.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Date format</FieldLabel>
        <FieldControl
          render={
            <NativeSelect defaultValue="dd-mm-yyyy" disabled={disabled}>
              <option value="dd-mm-yyyy">31-03-2026</option>
              <option value="yyyy-mm-dd">2026-03-31</option>
              <option value="mm-dd-yyyy">03-31-2026</option>
            </NativeSelect>
          }
        />
      </Field>
    </FieldGroup>
  );
}

const meta: Meta = {
  title: "Patterns/AccountSettings",
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "**A settings page that saves explicitly.** `PageHeader` for the title and trail, one",
          "`Card` per section, `Field`-wrapped controls inside each, and a single save/cancel row",
          "that governs the whole page. The states below are the ones a real settings screen has to",
          "render: pristine, dirty, in-flight, rejected, and still loading.",
          "",
          "**Use it** for any *self-service* account or preference screen — Qeet ID profile, Qeet",
          "Logs retention preferences, Qeet Notify channel defaults, Qeet People payroll",
          "preferences. The load-bearing decision is the *explicit save*: several related values",
          "change together, so they are staged and committed as one.",
          "",
          "**Do not use it** when each control takes effect on its own — a row of independent",
          "feature toggles should apply immediately and confirm with a toast, and a save button",
          "there just invents a transaction that does not exist. Also do not use it for",
          "administering *other* people (member and role management is a table pattern — see",
          "`Patterns/DataTableToolbar`), or for anything destructive: deleting an organisation needs",
          "a confirmation dialog, not a Save button.",
          "",
          "**Composition notes.** Section headings are real `h2`s under the `PageHeader`'s `h1`, and",
          "`SecurityItem` contributes `h3`s below them, so the page has a sane outline. Every switch",
          "description is attached with `aria-describedby` rather than floating next to the control.",
          "Fields that a directory owns (`Work email`) are disabled *and* explain who owns them —",
          "a disabled control with no explanation is the most common complaint about settings pages.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The resting state. Nothing has changed yet, so **Save changes** is disabled — the page is honest that there is nothing to commit rather than offering a button that would be a no-op.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#qeet-id">Qeet ID</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Account settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        title="Account settings"
        description="How you appear across Qeet ID, Qeet Logs, Qeet Notify, Qeet Pay and Qeet People."
      />
      <Form onSubmit={(event) => event.preventDefault()}>
        <SettingsSection
          title="Profile"
          description="Shown to everyone in Acme Technologies and recorded against every audit event."
        >
          <ProfileFields />
        </SettingsSection>
        <SettingsSection
          title="Locale and formatting"
          description="Applies to every Qeet product you open with this account."
        >
          <LocaleFields />
        </SettingsSection>
        <SettingsSection
          title="Email notifications"
          description="Delivered by Qeet Notify to ada.lovelace@acme.in."
        >
          <div className="divide-y divide-border">
            <ToggleRow
              id="settings-digest"
              label="Weekly summary"
              description="One email each Monday with sign-in anomalies and expiring API keys."
              defaultChecked
            />
            <ToggleRow
              id="settings-product"
              label="Product updates"
              description="New Qeet releases and deprecation notices. Roughly monthly."
            />
            <ToggleRow
              id="settings-security"
              label="Security alerts"
              description="New device sign-ins and passkey changes. Required by your organisation."
              defaultChecked
              disabled
            />
          </div>
        </SettingsSection>
        <FormActions>
          <Button type="button" variant="ghost" disabled>
            Cancel
          </Button>
          <Button type="submit" disabled>
            Save changes
          </Button>
        </FormActions>
      </Form>
    </div>
  ),
};

export const UnsavedChanges: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The dirty state, after editing the job title and switching time zone. The action row wakes up and a `Callout` names exactly what is pending — a generic “you have unsaved changes” tells the user nothing they did not already know.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        title="Account settings"
        description="How you appear across Qeet ID, Qeet Logs, Qeet Notify, Qeet Pay and Qeet People."
      />
      <Form onSubmit={(event) => event.preventDefault()}>
        <Callout variant="warning">
          2 unsaved changes: <strong>Job title</strong> and <strong>Time zone</strong>. They take
          effect for every Qeet product once you save.
        </Callout>
        <SettingsSection
          title="Profile"
          description="Shown to everyone in Acme Technologies and recorded against every audit event."
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Full name</FieldLabel>
              <FieldControl render={<Input defaultValue="Ada Lovelace" />} />
            </Field>
            <Field>
              <FieldLabel>Job title</FieldLabel>
              <FieldControl render={<Input defaultValue="Distinguished Engineer" />} />
              <FieldDescription>Changed from “Principal Engineer”.</FieldDescription>
            </Field>
          </FieldGroup>
        </SettingsSection>
        <SettingsSection
          title="Locale and formatting"
          description="Applies to every Qeet product you open with this account."
        >
          <LocaleFields />
        </SettingsSection>
        <FormActions>
          <Button type="button" variant="ghost">
            Discard changes
          </Button>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>
    </div>
  ),
};

export const Saving: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In flight. Controls are disabled instead of unmounted so nothing reflows, and the submit button carries a labelled `Spinner` so the wait is announced rather than merely drawn.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader title="Account settings" description="Saving your changes…" />
      <Form onSubmit={(event) => event.preventDefault()}>
        <SettingsSection
          title="Profile"
          description="Shown to everyone in Acme Technologies and recorded against every audit event."
        >
          <ProfileFields disabled />
        </SettingsSection>
        <FormActions>
          <Button type="button" variant="ghost" disabled>
            Cancel
          </Button>
          <Button type="submit" disabled>
            <Spinner size="sm" label="Saving" className="text-current" />
            Saving…
          </Button>
        </FormActions>
      </Form>
    </div>
  ),
};

export const SaveFailed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The server rejected the save. The `Alert` sits above the sections it applies to, says which field the server objected to and why, and — critically — the edits are still in the form. Wiping a user's input on a failed save is the fastest way to lose their trust.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader title="Account settings" description="Your changes were not saved." />
      <Form onSubmit={(event) => event.preventDefault()}>
        <Alert variant="danger">
          <AlertTitle>Couldn&apos;t save your profile</AlertTitle>
          <AlertDescription>
            Acme Technologies enforces SCIM-managed display names, so Qeet ID rejected the change to
            <strong> Full name</strong>. Your other edits are still here — remove that one and save
            again, or ask an owner to relax the policy.
          </AlertDescription>
        </Alert>
        <SettingsSection
          title="Profile"
          description="Shown to everyone in Acme Technologies and recorded against every audit event."
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Full name</FieldLabel>
              <FieldControl render={<Input defaultValue="A. Lovelace" aria-invalid="true" />} />
              <FieldDescription>Directory value: Ada Lovelace.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Job title</FieldLabel>
              <FieldControl render={<Input defaultValue="Distinguished Engineer" />} />
            </Field>
          </FieldGroup>
        </SettingsSection>
        <FormActions>
          <Button type="button" variant="ghost">
            Discard changes
          </Button>
          <Button type="submit">Save changes</Button>
        </FormActions>
      </Form>
    </div>
  ),
};

export const SecuritySection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The security half of the same page. These rows are not form fields — each one is its own object with its own lifecycle, so `SecurityItem` gives each an `h3`, a status and its own action instead of pooling them under one Save button.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        title="Account settings"
        description="How you appear across Qeet ID, Qeet Logs, Qeet Notify, Qeet Pay and Qeet People."
      />
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Typography as="h2" variant="small" className="font-heading text-base">
            Sign-in and security
          </Typography>
          <Typography variant="muted">
            Each item applies the moment you change it — there is nothing to save here.
          </Typography>
        </div>
        <SecurityItem
          icon={<Key color="currentColor" />}
          title="Passkeys"
          description="Phishing-resistant sign-in bound to your devices."
          status="active"
          details={[
            { label: "Registered", value: "2 devices" },
            { label: "Last used", value: "Today at 09:14 IST · MacBook Pro" },
          ]}
          actions={
            <Button variant="outline" size="sm">
              Manage
            </Button>
          }
        />
        <SecurityItem
          icon={<ShieldTick color="currentColor" />}
          title="Two-factor authentication"
          description="Required for every admin session in Acme Technologies."
          status="enabled"
          details={[
            { label: "Method", value: "Authenticator app (TOTP)" },
            { label: "Recovery codes", value: "8 of 10 unused" },
          ]}
          actions={
            <Button variant="outline" size="sm">
              Regenerate codes
            </Button>
          }
        />
        <SecurityItem
          icon={<Monitor color="currentColor" />}
          title="Active sessions"
          description="Signing out revokes the refresh token immediately across every Qeet product."
          status="pending"
          details={[
            { label: "This device", value: "Chrome on macOS · Bengaluru" },
            { label: "Other", value: "2 sessions, oldest 6 days" },
          ]}
          actions={
            <Button variant="destructive" size="sm">
              Sign out others
            </Button>
          }
        />
        <Separator />
        <Callout variant="info">
          Session and passkey changes are written to the Qeet Logs audit stream and cannot be
          deleted.
        </Callout>
      </section>
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "First paint, before the profile resolves. `DataState` renders skeleton rows shaped roughly like the form that replaces them, so the page does not jump when the data lands. The header is real because its content is already known from the route.",
      },
    },
  },
  render: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        title="Account settings"
        description="How you appear across Qeet ID, Qeet Logs, Qeet Notify, Qeet Pay and Qeet People."
      />
      <Card>
        <CardHeader>
          <Typography as="h2" variant="small" className="font-heading text-base">
            Profile
          </Typography>
          <CardDescription>Loading your profile from Qeet ID…</CardDescription>
        </CardHeader>
        <CardContent>
          <DataState isLoading skeletonRows={4} skeletonHeight="h-9" className="p-0">
            <ProfileFields />
          </DataState>
        </CardContent>
      </Card>
    </div>
  ),
};
