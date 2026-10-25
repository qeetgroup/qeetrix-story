import { Card, Field, QeetrixProvider, Stack } from "@qeetrix/react";
import { DatePicker } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/** Pinned, so the placeholder, the calendar and the tests never drift. */
const TODAY = "2026-10-25";

const isWeekend = (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00Z`).getUTCDay());

/** A date as the calendar reads it out: "Wednesday, 21 October 2026" */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date;

const meta: Meta<typeof DatePicker> = {
  title: "Components/Data Entry/DatePicker",
  component: DatePicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    today: TODAY,
    onValueChange: fn(),
  },
  render: (args) => (
    <Field label="Joining date" style={{ inlineSize: 360 }}>
      <DatePicker {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {
  args: { defaultValue: "2026-10-20" },
};

export const Open: Story = {
  // Padded, so the popover opens under the field; its own frame on the docs page.
  parameters: { layout: "padded", docs: { story: { inline: false, height: "460px" } } },
  args: { defaultValue: "2026-10-20" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose date for Joining date" }));
    await screen.findByRole("dialog", { name: "Choose date for Joining date" });
    await waitFor(() => expect(focusedDate()).toBe("2026-10-20"));
  },
};

export const Limits: Story = {
  args: {
    min: "2026-11-01",
    max: "2026-12-31",
    isDateDisabled: isWeekend,
    defaultValue: "2026-11-12",
  },
  render: (args) => (
    <Field label="Probation review" style={{ inlineSize: 360 }}>
      <DatePicker {...args} />
    </Field>
  ),
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Joining date" error="18/10/2026 is a Sunday.">
        <DatePicker {...args} defaultValue="2026-10-18" />
      </Field>
      <Field label="Billing starts" disabled>
        <DatePicker {...args} defaultValue="2026-04-01" disabled />
      </Field>
      <Field label="Account created">
        <DatePicker {...args} defaultValue="2026-10-01" readOnly />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card title="Employment" level={3}>
        <Stack gap="lg">
          <Field label="Joining date">
            <DatePicker {...args} defaultValue="2026-10-20" />
          </Field>
          <Field label="Last working day" optional>
            <DatePicker {...args} min="2026-10-20" />
          </Field>
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="जॉइनिंग की तारीख़" optional style={{ inlineSize: 360 }}>
        <DatePicker {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const TypingInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing in en-IN order",
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Joining date" });
    await expect(field).toHaveAttribute("placeholder", "e.g. 31/12/2026");

    await userEvent.type(field, "5-3-26");
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-03-05");
    await expect(field).toHaveValue("05/03/2026");

    await userEvent.clear(field);
    await userEvent.type(field, "25.10.2026{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-10-25");
    await expect(field).toHaveValue("25/10/2026");
  },
};

export const InvalidTextInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: text that isn't a date",
  render: (args) => (
    <Field label="Joining date" validationMode="onBlur" style={{ inlineSize: 360 }}>
      <DatePicker {...args} defaultValue="2026-10-20" />
    </Field>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Joining date" });
    await userEvent.clear(field);
    await userEvent.type(field, "31/02/2026");
    await userEvent.tab();
    await expect(field).toHaveValue("31/02/2026");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Enter a date like 31/12/2026")).toBeVisible();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);

    await userEvent.clear(field);
    await userEvent.type(field, "28/02/2026");
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-02-28");
    await expect(field).not.toHaveAttribute("aria-invalid");
  },
};

export const LimitsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typed dates outside min and max",
  args: { min: "2026-11-01", max: "2026-12-31", isDateDisabled: isWeekend },
  render: (args) => (
    <Field label="Probation review" validationMode="onBlur" style={{ inlineSize: 360 }}>
      <DatePicker {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Probation review" });
    const cases = [
      ["25/10/2026", "Choose 01/11/2026 or later"],
      ["05/01/2027", "Choose 31/12/2026 or earlier"],
      ["14/11/2026", "14/11/2026 isn't available"],
    ] as const;
    for (const [typed, message] of cases) {
      await userEvent.clear(field);
      await userEvent.type(field, typed);
      await userEvent.tab();
      await expect(field).toHaveAttribute("aria-invalid", "true");
      await expect(canvas.getByText(message)).toBeVisible();
    }
  },
};

export const CalendarInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: choose from the calendar",
  args: { defaultValue: "2026-10-20" },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Choose date for Joining date" });
    await userEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: "Choose date for Joining date" });
    await waitFor(() => expect(focusedDate()).toBe("2026-10-20"));

    await userEvent.keyboard("{ArrowRight}");
    await expect(
      within(dialog).getByRole("button", { name: longDate("2026-10-21") }),
    ).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(canvas.getByRole("textbox", { name: "Joining date" })).toHaveValue("21/10/2026");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2026-10-21");
    await waitFor(() => expect(button).toHaveFocus());
  },
};

export const AltDownInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Alt+Down opens, Escape closes",
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Joining date" });
    await userEvent.click(field);
    await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
    await screen.findByRole("dialog", { name: "Choose date for Joining date" });
    await waitFor(() => expect(focusedDate()).toBe(TODAY));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(field).toHaveFocus());
    await expect(field).toHaveValue("");
  },
};
