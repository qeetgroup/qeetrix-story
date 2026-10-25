import { Card, Grid, Inline, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { Calendar } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

/** Pinned, so the grid and the tests never drift with the clock. */
const TODAY = "2026-10-25";

const isWeekend = (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00Z`).getUTCDay());

/** Gandhi Jayanti and Dussehra. */
const HOLIDAYS = new Set(["2026-10-02", "2026-10-20"]);

/** A date as the calendar reads it out: "Tuesday, 20 October 2026". */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date;

const meta: Meta<typeof Calendar> = {
  title: "Components/Data Entry/Calendar",
  component: Calendar,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    today: TODAY,
    onValueChange: fn(),
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Playground: Story = {
  args: { defaultValue: "2026-10-14" },
};

export const Limits: Story = {
  args: {
    min: "2026-10-05",
    max: "2026-11-20",
    isDateDisabled: (iso: string) => isWeekend(iso) || HOLIDAYS.has(iso),
  },
};

export const WeekStart: Story = {
  name: "Week start",
  parameters: { layout: "padded" },
  render: (args) => (
    <Grid columns={{ base: 1, expanded: 3 }} gap="lg">
      {["en-IN", "en-US", "en-GB"].map((locale) => (
        // `align="start"`: a stretched Calendar widens its header but not its grid.
        <Stack key={locale} gap="sm" align="start">
          <Text size="sm" tone="subtle">
            {locale}
          </Text>
          <Calendar {...args} locale={locale} />
        </Stack>
      ))}
    </Grid>
  ),
};

export const States: Story = {
  render: (args) => (
    <Inline gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text size="sm" tone="subtle">
          Disabled
        </Text>
        <Calendar {...args} defaultValue="2026-10-14" disabled />
      </Stack>
      <Stack gap="sm" align="start">
        <Text size="sm" tone="subtle">
          Read-only
        </Text>
        <Calendar {...args} defaultValue="2026-10-14" readOnly />
      </Stack>
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Card title="Access review" level={3}>
        <Stack align="center">
          <Calendar
            {...args}
            defaultValue="2026-10-27"
            min={TODAY}
            max="2026-11-30"
            isDateDisabled={(iso) => isWeekend(iso) || HOLIDAYS.has(iso)}
          />
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultValue: "2026-10-14" },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Calendar {...args} />
    </QeetrixProvider>
  ),
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: arrow keys, Page Up and Page Down",
  play: async ({ args, canvas, userEvent }) => {
    const today = canvas.getByRole("button", { name: `Today, ${longDate(TODAY)}` });
    await expect(today).toHaveAttribute("tabindex", "0");
    today.focus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(focusedDate()).toBe("2026-10-26");
    await userEvent.keyboard("{ArrowDown}");
    await expect(focusedDate()).toBe("2026-11-02");
    await expect(canvas.getByRole("grid", { name: "November 2026" })).toBeVisible();
    await userEvent.keyboard("{PageDown}");
    await expect(focusedDate()).toBe("2026-12-02");
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    await expect(focusedDate()).toBe("2025-12-02");

    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2025-12-02");
  },
};

export const YearsAndMonthsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: years and months",
  args: { defaultValue: "2026-10-20" },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "October 2026, choose year" }));
    await userEvent.click(canvas.getByRole("button", { name: "Previous 10 years" }));
    await userEvent.click(canvas.getByRole("button", { name: "2016" }));
    await userEvent.click(canvas.getByRole("button", { name: "Mar" }));
    await expect(focusedDate()).toBe("2016-03-20");
    await userEvent.click(canvas.getByRole("button", { name: longDate("2016-03-15") }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("2016-03-15");

    await userEvent.click(canvas.getByRole("button", { name: "March 2016, choose year" }));
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("grid", { name: "March 2016" })).toBeVisible();
  },
};

export const ReadOnlyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: read-only ignores a click, but the months can be browsed",
  args: { defaultValue: "2026-10-14", readOnly: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("grid", { name: "October 2026" })).toHaveAttribute(
      "aria-readonly",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-12") }));
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(
      canvas.getByRole("button", { name: longDate("2026-10-14") }).closest("td"),
    ).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    await expect(canvas.getByRole("grid", { name: "November 2026" })).toBeVisible();
  },
};

export const DisabledInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: disabled chooses nothing and the month stays put",
  args: { defaultValue: "2026-10-14", disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByRole("grid", { name: "October 2026" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-12") }));
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Next month" }));
    await expect(canvas.getByRole("grid", { name: "October 2026" })).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: longDate("2026-10-14") }).closest("td"),
    ).toHaveAttribute("aria-selected", "true");
  },
};

export const LimitsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: disabled days can't be chosen",
  args: {
    min: "2026-10-05",
    max: "2026-10-30",
    isDateDisabled: (iso: string) => HOLIDAYS.has(iso),
  },
  play: async ({ args, canvas, userEvent }) => {
    const holiday = canvas.getByRole("button", { name: longDate("2026-10-20") });
    await expect(holiday).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(holiday);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole("button", { name: "Previous month" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-21") }));
    await expect(args.onValueChange).toHaveBeenCalledWith("2026-10-21");
  },
};
