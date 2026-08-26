import { DatePicker } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
          "Single-date picker with an inline calendar popover — used for billing cycle start dates in qeet-pay, report cut-off dates in qeet-logs, and employee start dates in qeet-people. Pre-populate with `defaultValue` for edit forms; leave empty for creation flows.",
      },
    },
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
