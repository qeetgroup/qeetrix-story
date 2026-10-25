import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatRelativeTime,
  Table,
  type TableColumn,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta = {
  title: "Components/Data Display/Format",
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "`formatNumber`, `formatCurrency`, `formatRelativeTime`, `formatDate` and `formatDateTime`: pure, server-safe `Intl` formatters that default to `en-IN` and India time.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

/** One call, and what it returns in each locale. */
interface Sample {
  call: string;
  run: (locale: string) => string;
}

const LOCALES = ["en-IN", "hi-IN"] as const;

const columns: TableColumn<Sample>[] = [
  {
    id: "call",
    header: "Call",
    cell: (row) => (
      <Text mono size="sm">
        {row.call}
      </Text>
    ),
  },
  ...LOCALES.map(
    (locale): TableColumn<Sample> => ({
      id: locale,
      header: locale,
      align: "end",
      numeric: true,
      width: 180,
      cell: (row) => row.run(locale),
    }),
  ),
];

function Samples({ label, rows }: { label: string; rows: Sample[] }) {
  return (
    <div style={{ inlineSize: 720 }}>
      <Table
        label={label}
        rows={rows}
        rowId={(row) => row.call}
        rowLabel={(row) => row.call}
        columns={columns}
      />
    </div>
  );
}

const NUMBERS: Sample[] = [
  { call: "formatNumber(1234567)", run: (l) => formatNumber(1234567, l) },
  {
    call: 'formatNumber(0.858, …, { style: "percent" })',
    run: (l) => formatNumber(0.858, l, { style: "percent" }),
  },
  {
    call: 'formatNumber(1840000, …, { notation: "compact" })',
    run: (l) => formatNumber(1840000, l, { notation: "compact" }),
  },
];

export const FormatNumber: Story = {
  name: "Numbers",
  render: () => <Samples label="formatNumber in en-IN and hi-IN" rows={NUMBERS} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("cell", { name: "12,34,567" })).toHaveLength(2);
  },
};

const AMOUNTS: Sample[] = [
  { call: 'formatCurrency(124500, "INR")', run: (l) => formatCurrency(124500, "INR", l) },
  {
    call: 'formatCurrency(124500, "INR", …, { maximumFractionDigits: 0 })',
    run: (l) => formatCurrency(124500, "INR", l, { maximumFractionDigits: 0 }),
  },
  { call: 'formatCurrency(18425000, "INR")', run: (l) => formatCurrency(18425000, "INR", l) },
  { call: 'formatCurrency(1999, "USD")', run: (l) => formatCurrency(1999, "USD", l) },
];

export const FormatCurrency: Story = {
  name: "Currency",
  render: () => <Samples label="formatCurrency in en-IN and hi-IN" rows={AMOUNTS} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("cell", { name: "₹1,24,500.00" })).toHaveLength(2);
  },
};

/** A fixed "now", so the times read the same in every run: 25 October 2026, 15:00 IST. */
const NOW = Date.UTC(2026, 9, 25, 9, 30);
const MINUTE = 60_000;
/** `formatRelativeTime(date, locale, now)` for a date this far from `now` (minus is the past). */
const at = (minutes: number, offset: string): Sample => ({
  call: `formatRelativeTime(now ${offset})`,
  run: (l) => formatRelativeTime(NOW + minutes * MINUTE, l, NOW),
});

const TIMES: Sample[] = [
  at(-2, "− 2 min"),
  at(-26 * 60, "− 26 h"),
  at(-12 * 24 * 60, "− 12 days"),
  at(3 * 24 * 60, "+ 3 days"),
];

export const FormatRelativeTime: Story = {
  name: "Relative time",
  render: () => <Samples label="formatRelativeTime in en-IN and hi-IN" rows={TIMES} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("cell", { name: "yesterday" })).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "कल" })).toBeVisible();
  },
};

const DATES: Sample[] = [
  { call: 'formatDate("2026-10-25")', run: (l) => formatDate("2026-10-25", l) },
  {
    call: 'formatDate("2026-10-25", …, { dateStyle: "long" })',
    run: (l) => formatDate("2026-10-25", l, { dateStyle: "long" }),
  },
  { call: "formatDateTime(now)", run: (l) => formatDateTime(NOW, l) },
  {
    call: 'formatDateTime(now, …, { timeZone: "UTC" })',
    run: (l) => formatDateTime(NOW, l, { timeZone: "UTC" }),
  },
];

export const FormatDate: Story = {
  name: "Dates",
  render: () => <Samples label="formatDate and formatDateTime in en-IN and hi-IN" rows={DATES} />,
  play: async ({ canvas }) => {
    // A moment shows in India's time by default: 09:30 UTC is 3:00 pm.
    await expect(canvas.getByRole("cell", { name: "25 Oct 2026, 3:00 pm" })).toBeVisible();
    await expect(canvas.getByRole("cell", { name: "25 Oct 2026, 9:30 am" })).toBeVisible();
  },
};
