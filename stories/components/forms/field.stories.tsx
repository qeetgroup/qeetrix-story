import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSuccess,
  FieldWarning,
  Input,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Field> = {
  title: "Components/Forms/Field",
  component: Field,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Composes a `FieldLabel`, `FieldControl`, optional `FieldDescription`, and an optional status message around a form control. `FieldControl` opts into generated and merged ARIA relationships; direct controls remain supported when callers own IDs. Use `FieldSet` + `FieldLegend` to group related fields.\n\nThree message parts carry the `tone` axis — `FieldError` (blocking, `role="alert"`), `FieldWarning` (a non-blocking caution, `role="status"`) and `FieldSuccess` (a check the user was waiting on passed, `role="status"`). Each joins the control\'s `aria-describedby` and leads with a status icon, so tone never rests on colour alone. The Field derives one status from them and writes it to `data-status`: an error wins over a warning, a warning over a success. Only an error sets `aria-invalid`.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
    invalid: { control: "boolean" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Tenant settings</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <FieldControl render={<Input placeholder="Acme Inc." />} />
          <FieldDescription>Shown on the hosted Qeet ID login screen.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three message tones side by side. `FieldError` blocks the submit and marks the control `aria-invalid`; `FieldWarning` is a caution the user may proceed past — an unusually large qeet-pay refund; `FieldSuccess` confirms an asynchronous check — a subdomain is free. Reach for `FieldSuccess` only when the user is waiting on a check, not to decorate every valid field. Each part renders nothing when it has no children, so it can stay mounted and be fed conditionally.",
      },
    },
  },
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel>Admin email</FieldLabel>
        <FieldControl render={<Input type="email" defaultValue="ada@acme" />} />
        <FieldError>Enter a full email address, like ada@acme.com.</FieldError>
      </Field>
      <Field>
        <FieldLabel>Refund amount (₹)</FieldLabel>
        <FieldControl render={<Input inputMode="decimal" defaultValue="48,000" />} />
        <FieldWarning>
          This is six times the order's usual refund. qeet-pay will hold it for review.
        </FieldWarning>
      </Field>
      <Field>
        <FieldLabel>Tenant subdomain</FieldLabel>
        <FieldControl render={<Input defaultValue="acme" />} />
        <FieldSuccess>acme.qeet.in is available.</FieldSuccess>
      </Field>
    </FieldGroup>
  ),
};

export const StatusPrecedence: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When a Field holds more than one message, the boundary takes the most severe — error, then warning, then success — while every message stays in `aria-describedby`. Here the password fails the policy, so the field is invalid even though the breach check passed.",
      },
    },
  },
  render: () => (
    <Field className="w-80">
      <FieldLabel>New password</FieldLabel>
      <FieldControl render={<Input type="password" defaultValue="qeet2026" />} />
      <FieldError>Use at least 12 characters.</FieldError>
      <FieldSuccess>Not found in known breaches.</FieldSuccess>
    </Field>
  ),
};

export const MessageRelationships: Story = {
  name: "Interaction: messages describe the control",
  parameters: {
    docs: {
      description: {
        story:
          "Asserts what breaks silently: each message is announced as part of the control's description, only the error makes the control invalid, and warnings and successes are polite `status` regions rather than alerts.",
      },
    },
  },
  render: () => (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel>Billing contact</FieldLabel>
        <FieldControl render={<Input type="email" defaultValue="finance@" />} />
        <FieldError>Enter a full email address.</FieldError>
      </Field>
      <Field>
        <FieldLabel>Invite email</FieldLabel>
        <FieldControl render={<Input type="email" defaultValue="grace@gmail.com" />} />
        <FieldDescription>Members sign in with Qeet ID.</FieldDescription>
        <FieldWarning>This address is outside acme.com.</FieldWarning>
      </Field>
      <Field>
        <FieldLabel>Workspace handle</FieldLabel>
        <FieldControl render={<Input defaultValue="acme-hr" />} />
        <FieldSuccess>@acme-hr is available.</FieldSuccess>
      </Field>
    </FieldGroup>
  ),
  play: async ({ canvas }) => {
    const billing = canvas.getByRole("textbox", { name: "Billing contact" });
    await expect(billing).toHaveAttribute("aria-invalid", "true");
    await expect(billing).toHaveAccessibleDescription("Enter a full email address.");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter a full email address.");

    const invite = canvas.getByRole("textbox", { name: "Invite email" });
    await expect(invite).not.toHaveAttribute("aria-invalid");
    await expect(invite).toHaveAccessibleDescription(
      "Members sign in with Qeet ID. This address is outside acme.com.",
    );

    const handle = canvas.getByRole("textbox", { name: "Workspace handle" });
    await expect(handle).not.toHaveAttribute("aria-invalid");
    await expect(handle).toHaveAccessibleDescription("@acme-hr is available.");

    const statuses = canvas.getAllByRole("status").map((status) => status.textContent);
    await expect(statuses).toEqual(["This address is outside acme.com.", "@acme-hr is available."]);
  },
};
