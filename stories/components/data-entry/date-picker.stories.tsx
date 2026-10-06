import { CalendarIcon } from "@qeetrix/icons";
import {
  Button,
  DatePicker,
  datePickerTriggerVariants,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useFieldControl,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof DatePicker> = {
  title: "Components/Data Entry/DatePicker",
  component: DatePicker,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Single-date picker with an inline calendar popover — used for billing cycle start dates in qeet-pay, report cut-off dates in qeet-logs, and employee start dates in qeet-people. Pre-populate with `defaultValue` for edit forms; leave empty for creation flows.\n\nThe trigger is drawn as a field, not an outline button: it shares the input's boundary, height, focus recipe, placeholder colour and the invalid / warning / success edges a `Field` gives it. Bound the choosable days with `min` / `max`, strike out taken days with `unavailable`, start the week on Monday with `weekStartsOn={1}`, and opt an optional field into a Clear action with `clearable`. Inside a `Field` the trigger is named by the label *followed by* the selected date, and `name` submits a `yyyy-mm-dd` local calendar day.\n\nThe trigger recipe is exported as `datePickerTriggerVariants`. It has no variant axis — it is a single base class string — so it is not a styling knob on `DatePicker`; it is for a consumer composing their own chooser (a fiscal quarter, a billing month) that has to sit in the same form row.",
      },
    },
  },
  argTypes: {
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    weekStartsOn: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    locale: {
      control: "select",
      options: ["en-US", "en-GB", "en-IN", "hi-IN"],
    },
    placeholder: { control: "text" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty date picker for creation forms — the user selects a date from the calendar popover.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <DatePicker />
    </div>
  ),
};

export const Preselected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pre-populated date for edit forms, such as updating a billing cycle start or an employee start date.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <DatePicker defaultValue={new Date()} />
    </div>
  ),
};

export const PickDateInteraction: Story = {
  name: "Interaction: opening the calendar and picking a day",
  parameters: {
    docs: {
      description: {
        story:
          "Asserts the calendar opens and a chosen day lands in the field. The day is read from the rendered grid rather than hard-coded, so the test does not rot when the month rolls over.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <DatePicker />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));

    const grid = await screen.findByRole("grid");
    await waitFor(() => expect(grid).toBeVisible());

    // Take whatever day the grid offers rather than pinning a date — the calendar
    // opens on the current month, so a hard-coded day would break every month end.
    // Note the clickable day is a button *inside* the gridcell; clicking the cell
    // itself does nothing, which is easy to miss because the test still "runs".
    const days = within(grid)
      .getAllByRole("button")
      .filter(
        (day) => !day.hasAttribute("disabled") && /^\d+$/.test(day.textContent?.trim() ?? ""),
      );
    const chosen = days[Math.floor(days.length / 2)];
    const label = chosen.textContent?.trim();

    await userEvent.click(chosen);

    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
    await expect(canvas.getByRole("button")).toHaveTextContent(String(label));
  },
};

export const InField: Story = {
  name: "Interaction: named by its Field label and value",
  parameters: {
    docs: {
      description: {
        story:
          "A qeet-people joining date inside a `Field`. The trigger's accessible name is the label *followed by* the selected date, so the current value stays audible, and the Field's description and error reach it through `aria-describedby` and `aria-invalid` — the error also turns the field's boundary red. `locale` is pinned so the server and browser render the same text.",
      },
    },
  },
  render: () => (
    <Field className="w-72">
      <FieldLabel>Joining date</FieldLabel>
      <DatePicker locale="en-GB" defaultValue={new Date(2026, 7, 2)} name="joiningDate" />
      <FieldDescription>The first working day on the Bengaluru payroll.</FieldDescription>
      <FieldError>Joining date falls on a Sunday.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Joining date 2 Aug 2026" });
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
    await expect(trigger).toHaveAccessibleDescription(
      "The first working day on the Bengaluru payroll. Joining date falls on a Sunday.",
    );
  },
};

export const Bounds: Story = {
  name: "Interaction: min, max and unavailable days",
  parameters: {
    docs: {
      description: {
        story:
          "`min` and `max` bound the choosable window (inclusive, by calendar day) and stop month navigation at its edges; `unavailable` marks days that exist but cannot be picked — here weekends and an office holiday. Unavailable days are struck through in a sunken well and named “…, unavailable”, so the reason is not carried by colour. `weekStartsOn={1}` starts the grid on Monday, as Indian payroll calendars do. The test asserts the holiday is announced and refused, and a neighbouring working day can still be picked.",
      },
    },
  },
  render: () => (
    <Field className="w-72">
      <FieldLabel>Probation review</FieldLabel>
      <DatePicker
        locale="en-GB"
        defaultValue={new Date(2026, 7, 10)}
        min={new Date(2026, 7, 3)}
        max={new Date(2026, 7, 31)}
        unavailable={[{ dayOfWeek: [0, 6] }, new Date(2026, 7, 26)]}
        weekStartsOn={1}
      />
      <FieldDescription>
        Any working day in August 2026. 26 Aug is an office holiday.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^Probation review/ }));

    const grid = await screen.findByRole("grid");
    await waitFor(() => expect(grid).toBeVisible());

    const holiday = within(grid).getByRole("button", { name: /26 August 2026/ });
    await expect(holiday).toBeDisabled();
    await expect(holiday).toHaveAccessibleName(/, unavailable$/);

    await userEvent.click(within(grid).getByRole("button", { name: /27 August 2026/ }));

    await waitFor(() => expect(screen.queryByRole("grid")).not.toBeInTheDocument());
    await expect(
      canvas.getByRole("button", { name: "Probation review 27 Aug 2026" }),
    ).toBeInTheDocument();
  },
};

export const Clearable: Story = {
  name: "Interaction: Clear empties an optional date",
  parameters: {
    docs: {
      description: {
        story:
          "An optional qeet-pay contract end date. Re-picking the selected day confirms it rather than emptying the field, so clearing is explicit: `clearable` adds a Clear action to the popover while a value is set. The test asserts the trigger falls back to its placeholder and the submitted value — the hidden `name` input — is emptied with it.",
      },
    },
  },
  render: () => (
    <Field className="w-72">
      <FieldLabel>Contract end date</FieldLabel>
      <DatePicker
        locale="en-GB"
        defaultValue={new Date(2026, 11, 31)}
        clearable
        name="contractEnd"
        placeholder="No end date"
      />
      <FieldDescription>Leave empty for a rolling contract.</FieldDescription>
    </Field>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const submitted = canvasElement.querySelector<HTMLInputElement>('input[name="contractEnd"]');
    await expect(submitted).toHaveValue("2026-12-31");

    await userEvent.click(canvas.getByRole("button", { name: "Contract end date 31 Dec 2026" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a date" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Clear" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(
      canvas.getByRole("button", { name: "Contract end date No end date" }),
    ).toHaveAttribute("data-empty", "true");
    await expect(submitted).toHaveValue("");
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A locked billing cycle start in qeet-pay — the date is shown but cannot be opened once the first invoice has been issued.",
      },
    },
  },
  render: () => (
    <Field className="w-72">
      <FieldLabel>Billing cycle starts</FieldLabel>
      <DatePicker locale="en-GB" defaultValue={new Date(2026, 3, 1)} disabled />
      <FieldDescription>Fixed after the first invoice.</FieldDescription>
    </Field>
  ),
};

const GST_QUARTERS = [
  { id: "2026-q1", label: "Q1 FY27 · Apr–Jun 2026" },
  { id: "2026-q2", label: "Q2 FY27 · Jul–Sep 2026" },
  { id: "2026-q3", label: "Q3 FY27 · Oct–Dec 2026" },
  { id: "2026-q4", label: "Q4 FY27 · Jan–Mar 2027" },
];

/**
 * A chooser that is not a calendar, drawn with the DatePicker trigger recipe and wired into the
 * surrounding Field through `useFieldControl` — the same two pieces DatePicker itself uses.
 */
function GstQuarterPicker() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>();
  const valueId = React.useId();
  const field = useFieldControl({ contentLabelId: valueId });
  const selected = GST_QUARTERS.find((quarter) => quarter.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={field.id}
        aria-labelledby={field["aria-labelledby"]}
        aria-describedby={field["aria-describedby"]}
        data-placeholder={selected ? undefined : ""}
        className={datePickerTriggerVariants()}
      >
        <CalendarIcon aria-hidden />
        <span id={valueId} className="min-w-0 truncate">
          {selected?.label ?? "Pick a quarter"}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-1" aria-label="Choose a GST quarter">
        <div className="flex flex-col">
          {GST_QUARTERS.map((quarter) => (
            <Button
              key={quarter.id}
              variant="ghost"
              className="justify-start"
              aria-pressed={quarter.id === value}
              onClick={() => {
                setValue(quarter.id);
                setOpen(false);
              }}
            >
              {quarter.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const CustomTrigger: Story = {
  name: "Interaction: a custom chooser on the trigger recipe",
  parameters: {
    docs: {
      description: {
        story:
          "`datePickerTriggerVariants()` on a consumer's own `PopoverTrigger`: a GST return-quarter picker for qeet-pay that sits in the same form row as a real `DatePicker` — same height, boundary, focus and placeholder colour — without restating the recipe. `useFieldControl({ contentLabelId })` gives it the Field's label-plus-value name and description, as DatePicker does. The test asserts Escape dismisses the popover with focus back on the trigger, and a picked quarter becomes part of the trigger's name.",
      },
    },
  },
  render: () => (
    <div className="flex w-150 items-start gap-4">
      <Field>
        <FieldLabel>Invoice date</FieldLabel>
        <DatePicker locale="en-GB" defaultValue={new Date(2026, 7, 18)} />
      </Field>
      <Field>
        <FieldLabel>GST return period</FieldLabel>
        <GstQuarterPicker />
        <FieldDescription>Indian fiscal year, April to March.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "GST return period Pick a quarter" });
    await expect(trigger).toHaveAccessibleDescription("Indian fiscal year, April to March.");

    await userEvent.click(trigger);
    await screen.findByRole("dialog", { name: "Choose a GST quarter" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Choose a GST quarter" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Q2 FY27 · Jul–Sep 2026" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveAccessibleName("GST return period Q2 FY27 · Jul–Sep 2026");
  },
};
