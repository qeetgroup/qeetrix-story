import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import {
  Button,
  Field,
  Fieldset,
  Input,
  QeetrixProvider,
  Select,
  Stack,
  TextField,
} from "@qeetrix/react";
import { ErrorSummary, Form, type FormProps } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

/** A `validate` that asks for a value, worded as an instruction (GOV.UK). */
const required = (message: string) => (value: unknown) => (value ? null : message);

const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

/** Invite a user to Acme Pvt Ltd: two required TextFields, a role and the submit. */
function InviteFields() {
  return (
    <>
      <TextField
        label="Full name"
        name="name"
        validate={required("Enter the person's name")}
        placeholder="e.g. Priya Sharma"
      />
      <TextField
        label="Work email"
        name="email"
        type="email"
        validate={required("Enter a work email")}
        placeholder="e.g. priya@acme.in"
      />
      <Field label="Role" name="role">
        <Select items={ROLES} defaultValue="member" />
      </Field>
      <Button type="submit" size="lg" fullWidth icon={ArrowRightIcon}>
        Send invitation
      </Button>
    </>
  );
}

const meta: Meta<typeof Form> = {
  title: "Components/Forms/Form",
  component: Form,
  subcomponents: { ErrorSummary },
  parameters: {
    qeetrix: qx({ category: "forms", status: "experimental" }),
    layout: "centered",
  },
  args: {
    "aria-label": "Invite a user",
    onFormSubmit: fn(),
  },
  render: (args) => (
    <Form {...args} style={{ inlineSize: 400 }}>
      <InviteFields />
    </Form>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Playground: Story = {};

export const ErrorSummaryStory: Story = {
  name: "Error summary",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 400 }}>
      {/* autoFocus off here: on a docs page it would take focus and scroll to itself. */}
      <ErrorSummary
        autoFocus={false}
        items={[
          { id: "summary-name", message: "Enter the person's name" },
          { id: "summary-email", message: "Enter a work email" },
        ]}
      />
      <TextField id="summary-name" label="Full name" error="Enter the person's name" />
      <TextField id="summary-email" label="Work email" type="email" error="Enter a work email" />
    </Stack>
  ),
};

/** Company details in two Fieldset sections. */
function CompanyFields() {
  return (
    <>
      <Fieldset legend="Company">
        <Field label="Legal name" name="legalName" validate={required("Enter the legal name")}>
          <Input placeholder="e.g. Acme Private Limited" />
        </Field>
        <Field
          label="GSTIN"
          name="gstin"
          validate={(value) =>
            typeof value === "string" && value.length === 15
              ? null
              : "Enter a GSTIN with 15 characters"
          }
        >
          <Input />
        </Field>
      </Fieldset>
      <Fieldset legend="Billing contact">
        <Field label="Name" name="contactName" validate={required("Enter the contact's name")}>
          <Input placeholder="e.g. Rahul Verma" />
        </Field>
        <Field label="Email" name="contactEmail" validate={required("Enter the contact's email")}>
          <Input type="email" placeholder="e.g. finance@acme.in" />
        </Field>
      </Fieldset>
      <Button type="submit" size="lg" fullWidth>
        Save company
      </Button>
    </>
  );
}

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <Form {...args} aria-label="Company details" style={{ inlineSize: 400 }}>
      <CompanyFields />
    </Form>
  ),
};

/** A form that sends, then hears back from the server that the address is taken. */
function ServerCheck(props: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Form
      {...props}
      errors={errors}
      onFormSubmit={(values, details) => {
        props.onFormSubmit?.(values, details);
        setErrors({ email: `${String(values.email)} is already a member of Acme Pvt Ltd` });
      }}
      style={{ inlineSize: 400 }}
    >
      <InviteFields />
    </Form>
  );
}

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Stack gap="lg" style={{ inlineSize: 400 }}>
        <ErrorSummary
          items={[
            { id: "hi-name", message: "व्यक्ति का नाम दर्ज करें" },
            { id: "hi-email", message: "कार्य ईमेल दर्ज करें" },
          ]}
        />
        <Field label="पूरा नाम" error="व्यक्ति का नाम दर्ज करें">
          <Input id="hi-name" />
        </Field>
        <Field label="कार्य ईमेल" error="कार्य ईमेल दर्ज करें">
          <Input id="hi-email" type="email" />
        </Field>
      </Stack>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("जारी रखने के लिए इन्हें ठीक करें")).toBeVisible();
  },
};

/** The summary: the Alert holding the "Fix these to continue" title. */
const findSummary = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const summary = canvasElement.querySelector<HTMLElement>(".qx-error-summary");
    if (!summary) throw new Error("No error summary yet");
    return summary;
  });

export const FailedSubmit: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a failed submit lists the problems and takes focus",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    const summary = await findSummary(canvasElement);
    await expect(summary).toHaveTextContent("Fix these to continue");
    const links = [...summary.querySelectorAll("a")].map((link) => link.textContent);
    // Worded exactly as each field's own error, in page order.
    await expect(links).toEqual(["Enter the person's name", "Enter a work email"]);
    await waitFor(() => expect(summary).toHaveFocus());
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(args.onFormSubmit).not.toHaveBeenCalled();
  },
};

export const SummaryLink: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a summary link focuses its field",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    await findSummary(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "Enter a work email" }));
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveFocus();
  },
};

export const SummaryTakesFocus: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: ErrorSummary takes focus and links to its fields",
  render: () => (
    <Stack gap="lg" style={{ inlineSize: 400 }}>
      <ErrorSummary
        headingLevel={3}
        items={[
          { id: "focus-name", message: "Enter the person's name" },
          { id: "focus-email", message: "Enter a work email" },
        ]}
      />
      <TextField id="focus-name" label="Full name" error="Enter the person's name" />
      <TextField id="focus-email" label="Work email" type="email" error="Enter a work email" />
    </Stack>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const summary = await findSummary(canvasElement);
    await waitFor(() => expect(summary).toHaveFocus());
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Fix these to continue" }),
    ).toBeVisible();
    const link = canvas.getByRole("link", { name: "Enter a work email" });
    await expect(link).toHaveAttribute("href", "#focus-email");
    await userEvent.click(link);
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveFocus();
  },
};

export const ValidSubmit: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a valid submit sends the values and clears the summary",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    await findSummary(canvasElement);
    await userEvent.type(canvas.getByRole("textbox", { name: "Full name" }), "Priya Sharma");
    await userEvent.type(canvas.getByRole("textbox", { name: "Work email" }), "priya@acme.in");
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    await waitFor(() => expect(args.onFormSubmit).toHaveBeenCalledOnce());
    await expect(args.onFormSubmit).toHaveBeenCalledWith(
      { name: "Priya Sharma", email: "priya@acme.in", role: "member" },
      expect.anything(),
    );
    await waitFor(() => expect(canvasElement.querySelector(".qx-error-summary")).toBeNull());
  },
};

export const ServerErrorsArrive: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: server errors arrive after a submit",
  render: (args) => <ServerCheck {...args} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Full name" }), "Priya Sharma");
    await userEvent.type(canvas.getByRole("textbox", { name: "Work email" }), "priya@acme.in");
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    const summary = await findSummary(canvasElement);
    const message = "priya@acme.in is already a member of Acme Pvt Ltd";
    await waitFor(() => expect(summary.querySelector("a")).toHaveTextContent(message));
    // The field shows it too.
    await expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveAccessibleDescription(
      new RegExp(`${message}$`),
    );
  },
};

export const NoSummary: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: without a summary, errors stay at the fields",
  args: { summary: false },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Send invitation" }));
    await waitFor(() =>
      expect(canvas.getByRole("textbox", { name: "Work email" })).toHaveAccessibleDescription(
        /Enter a work email$/,
      ),
    );
    await expect(canvasElement.querySelector(".qx-error-summary")).toBeNull();
  },
};

export const SectionsInOrder: Story = {
  ...InContext,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the summary lists every section's problems in order",
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "GSTIN" }), "29ABCDE1234");
    await userEvent.click(canvas.getByRole("button", { name: "Save company" }));
    const summary = await findSummary(canvasElement);
    const links = [...summary.querySelectorAll("a")].map((link) => link.textContent);
    await expect(links).toEqual([
      "Enter the legal name",
      "Enter a GSTIN with 15 characters",
      "Enter the contact's name",
      "Enter the contact's email",
    ]);
  },
};
