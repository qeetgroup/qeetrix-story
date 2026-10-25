import { Card, Inline, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { RangeCalendar } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

/** Pinned, so the grid and the tests never drift with the clock. */
const TODAY = "2026-10-25";

const isWeekend = (iso: string) => [0, 6].includes(new Date(`${iso}T00:00:00Z`).getUTCDay());

/** Gandhi Jayanti and Dussehra. */
const HOLIDAYS = new Set(["2026-10-02", "2026-10-20"]);

/** A date as the calendar reads it out: "Monday, 12 October 2026". */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));

/** The cell around a day, which carries `aria-selected` and the range part. */
const cell = (canvasElement: HTMLElement, iso: string) =>
  canvasElement.querySelector(`[data-date="${iso}"]`)?.closest("td") ?? null;

const meta: Meta<typeof RangeCalendar> = {
  title: "Components/Data Entry/RangeCalendar",
  component: RangeCalendar,
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
type Story = StoryObj<typeof RangeCalendar>;

export const Playground: Story = {
  args: { defaultValue: { start: "2026-10-12", end: "2026-10-23" } },
};

export const Limits: Story = {
  args: {
    min: "2026-10-05",
    max: "2026-11-20",
    isDateDisabled: (iso: string) => isWeekend(iso) || HOLIDAYS.has(iso),
    defaultValue: { start: "2026-10-15", end: "2026-10-23" },
  },
};

export const States: Story = {
  args: { defaultValue: { start: "2026-10-12", end: "2026-10-23" } },
  render: (args) => (
    <Inline gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text size="sm" tone="subtle">
          Disabled
        </Text>
        <RangeCalendar {...args} disabled />
      </Stack>
      <Stack gap="sm" align="start">
        <Text size="sm" tone="subtle">
          Read-only
        </Text>
        <RangeCalendar {...args} readOnly />
      </Stack>
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Card title="Request leave" level={3}>
        <Stack align="center">
          <RangeCalendar
            {...args}
            defaultValue={{ start: "2026-10-26", end: "2026-10-30" }}
            min={TODAY}
            isDateDisabled={(iso) => isWeekend(iso) || HOLIDAYS.has(iso)}
          />
        </Stack>
      </Card>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: { defaultValue: { start: "2026-10-12", end: "2026-10-23" } },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <RangeCalendar {...args} />
    </QeetrixProvider>
  ),
};

export const PickInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: pick a start, then an end",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-12") }));
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(
      canvas.getByText(/^Starts Monday.*Now choose the end date\.$/),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-15") }));
    await expect(args.onValueChange).toHaveBeenCalledWith({
      start: "2026-10-12",
      end: "2026-10-15",
    });
    await expect(cell(canvasElement, "2026-10-13")).toHaveAttribute("aria-selected", "true");
    await expect(cell(canvasElement, "2026-10-16")).not.toHaveAttribute("aria-selected");
  },
};

export const BackwardsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an end before the start swaps them",
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-20") }));
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-06") }));
    await expect(args.onValueChange).toHaveBeenCalledWith({
      start: "2026-10-06",
      end: "2026-10-20",
    });
  },
};

export const ReadOnlyInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: read-only keeps its range",
  args: { defaultValue: { start: "2026-10-12", end: "2026-10-23" }, readOnly: true },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-05") }));
    await userEvent.click(canvas.getByRole("button", { name: longDate("2026-10-07") }));
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(cell(canvasElement, "2026-10-06")).not.toHaveAttribute("aria-selected");
    await expect(cell(canvasElement, "2026-10-15")).toHaveAttribute("data-range", "middle");
  },
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: keyboard, and Escape undoes a half-chosen range",
  args: { defaultValue: { start: "2026-10-01", end: "2026-10-03" } },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    canvas.getByRole("button", { name: `Today, ${longDate(TODAY)}` }).focus();
    await userEvent.keyboard("{Enter}{ArrowRight}{ArrowRight}");
    await expect(cell(canvasElement, "2026-10-26")).toHaveAttribute("data-range", "middle");
    await userEvent.keyboard("{Escape}");
    await expect(cell(canvasElement, "2026-10-26")).not.toHaveAttribute("aria-selected");
    await expect(cell(canvasElement, "2026-10-02")).toHaveAttribute("data-range", "middle");
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
    await expect(args.onValueChange).toHaveBeenCalledWith({
      start: "2026-10-27",
      end: "2026-11-03",
    });
  },
};
