import { Button, Card, Field, Inline, QeetrixProvider, Stack } from "@qeetrix/react";
import { DateRangePicker } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

/** Pinned, so the placeholder, the calendar and the tests never drift. */
const TODAY = "2026-10-25";

/** Gandhi Jayanti and Dussehra. */
const HOLIDAYS = new Set(["2026-10-02", "2026-10-20"]);

/** A date as the calendar reads it out: "Monday, 5 October 2026" */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date;

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/Data Entry/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    today: TODAY,
    onValueChange: fn(),
  },
  render: (args) => (
    <Field label="Audit period" style={{ inlineSize: 360 }}>
      <DateRangePicker {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Playground: Story = {
  args: { defaultValue: { start: "2026-10-01", end: "2026-10-25" } },
};

export const Open: Story = {
  // Padded, so the popover opens under the field; its own frame on the docs page.
  parameters: { layout: "padded", docs: { story: { inline: false, height: "460px" } } },
  args: { defaultValue: { start: "2026-10-12", end: "2026-10-21" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose dates for Audit period" }));
    await screen.findByRole("dialog", { name: "Choose dates for Audit period" });
    await waitFor(() => expect(focusedDate()).toBe("2026-10-12"));
  },
};

/** Sign-in reports: ready-made ranges by name, up to today. */
const REPORTS = ["today", "last7Days", "last30Days", "thisMonth", "lastMonth"] as const;

export const Presets: Story = {
  // Opens with its play, so the quick ranges show beside the calendar; its own frame on the docs page.
  parameters: { layout: "padded", docs: { story: { inline: false, height: "460px" } } },
  args: {
    presets: REPORTS,
    max: TODAY,
    defaultValue: { start: "2026-10-19", end: "2026-10-25" },
  },
  render: (args) => (
    <Field label="Sign-ins" style={{ inlineSize: 360 }}>
      <DateRangePicker {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose dates for Sign-ins" }));
    await screen.findByRole("group", { name: "Quick ranges" });
  },
};

export const Limits: Story = {
  args: {
    min: "2026-01-01",
    max: TODAY,
    isDateDisabled: (iso: string) => HOLIDAYS.has(iso),
    defaultValue: { start: "2026-10-05", end: "2026-10-16" },
  },
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 360 }}>
      <Field label="Audit period" error="Exports are limited to 90 days.">
        <DateRangePicker {...args} defaultValue={{ start: "2026-01-01", end: "2026-10-25" }} />
      </Field>
      <Field label="Financial year" disabled>
        <DateRangePicker
          {...args}
          defaultValue={{ start: "2026-04-01", end: "2027-03-31" }}
          disabled
        />
      </Field>
      <Field label="Trial period">
        <DateRangePicker
          {...args}
          defaultValue={{ start: "2026-09-01", end: "2026-09-30" }}
          readOnly
        />
      </Field>
    </Stack>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 400 }}>
      <Card
        title="Export audit log"
        level={3}
        footer={
          <Inline justify="end">
            <Button variant="solid">Export CSV</Button>
          </Inline>
        }
      >
        <Field label="Period">
          <DateRangePicker
            {...args}
            max={TODAY}
            startName="from"
            endName="to"
            defaultValue={{ start: "2026-10-19", end: "2026-10-25" }}
          />
        </Field>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="छुट्टी की तारीख़ें" optional style={{ inlineSize: 360 }}>
        <DateRangePicker {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

export const TypingInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: typing a range",
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Audit period" });
    await expect(field).toHaveAttribute("placeholder", "e.g. 01/12/2026 – 31/12/2026");

    await userEvent.type(field, "1-10-26 - 25-10-26");
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: "2026-10-01",
      end: "2026-10-25",
    });
    await expect(field).toHaveValue("01/10/2026 – 25/10/2026");

    await userEvent.clear(field);
    await userEvent.type(field, "31.10.2026 20.10.2026{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: "2026-10-20",
      end: "2026-10-31",
    });
    await expect(field).toHaveValue("20/10/2026 – 31/10/2026");
  },
};

export const InvalidTextInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: text that isn't a range",
  args: { max: TODAY },
  render: (args) => (
    <Field label="Audit period" validationMode="onBlur" style={{ inlineSize: 360 }}>
      <DateRangePicker {...args} />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Audit period" });
    const cases = [
      ["01/10/2026", "Enter dates like 01/12/2026 – 31/12/2026"],
      ["01/10/2026 – 30/10/2026", "Choose 25/10/2026 or earlier"],
    ] as const;
    for (const [typed, message] of cases) {
      await userEvent.clear(field);
      await userEvent.type(field, typed);
      await userEvent.tab();
      await expect(field).toHaveValue(typed);
      await expect(field).toHaveAttribute("aria-invalid", "true");
      await expect(canvas.getByText(message)).toBeVisible();
    }
  },
};

export const CalendarInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: pick both ends",
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Choose dates for Audit period" });
    await userEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: "Choose dates for Audit period" });
    await waitFor(() => expect(focusedDate()).toBe(TODAY));

    await userEvent.click(within(dialog).getByRole("button", { name: longDate("2026-10-05") }));
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: longDate("2026-10-09") }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(canvas.getByRole("textbox", { name: "Audit period" })).toHaveValue(
      "05/10/2026 – 09/10/2026",
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: "2026-10-05",
      end: "2026-10-09",
    });
    await waitFor(() => expect(button).toHaveFocus());
  },
};

export const PresetInteraction: Story = {
  ...Presets,
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a preset sets the range and closes",
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Choose dates for Sign-ins" });
    await userEvent.click(button);
    const group = await screen.findByRole("group", { name: "Quick ranges" });
    await expect(
      within(group)
        .getAllByRole("button")
        .map((preset) => preset.textContent),
    ).toEqual(["Today", "Last 7 days", "Last 30 days", "This month", "Last month"]);

    await userEvent.click(within(group).getByRole("button", { name: "Last 30 days" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: "2026-09-26",
      end: "2026-10-25",
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(canvas.getByRole("textbox", { name: "Sign-ins" })).toHaveValue(
      "26/09/2026 – 25/10/2026",
    );
    await waitFor(() => expect(button).toHaveFocus());

    // "This month" runs past today: it's cut to max.
    await userEvent.click(button);
    await userEvent.click(await screen.findByRole("button", { name: "This month" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: "2026-10-01",
      end: "2026-10-25",
    });
  },
};

export const EscapeInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Escape undoes, then closes",
  args: { defaultValue: { start: "2026-09-14", end: "2026-09-18" } },
  play: async ({ args, canvas, userEvent }) => {
    const field = canvas.getByRole("textbox", { name: "Audit period" });
    await userEvent.click(field);
    await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
    const dialog = await screen.findByRole("dialog", { name: "Choose dates for Audit period" });
    await waitFor(() => expect(focusedDate()).toBe("2026-09-14"));

    await userEvent.keyboard("{ArrowRight}{Enter}{Escape}");
    await expect(dialog).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(field).toHaveFocus());
    await expect(field).toHaveValue("14/09/2026 – 18/09/2026");
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};
