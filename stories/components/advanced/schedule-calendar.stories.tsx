import { ScheduleCalendar } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof ScheduleCalendar> = {
  title: "Components/Advanced/ScheduleCalendar",
  component: ScheduleCalendar,
  parameters: {
    qeetrix: qx({ category: "advanced", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "A basic day/week/month agenda. Medium and larger viewports use compact calendar grids; narrow viewports switch to a full-label chronological agenda. It does not implement recurrence, resources, drag/resize, collision layout, or time-grid editing and must not be presented as an enterprise scheduler.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

const today = new Date();
const slot = (dayOffset: number, hour: number, hours = 1) => {
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + dayOffset,
    hour,
    0,
  );
  const end = new Date(start);
  end.setHours(hour + hours);
  return { start, end };
};

const events = [
  { id: "1", title: "Standup", ...slot(0, 9) },
  { id: "2", title: "Design review", ...slot(0, 14, 2) },
  { id: "3", title: "1:1 with Ada", ...slot(1, 11) },
  { id: "4", title: "Release cut", ...slot(3, 16) },
  { id: "5", title: "All-hands", allDay: true, ...slot(5, 0) },
];

export const Month: Story = { args: { events, defaultView: "month" } };
export const Week: Story = { args: { events, defaultView: "week" } };
export const Day: Story = { args: { events, defaultView: "day" } };
export const ResponsiveAgenda: Story = { args: { events, defaultView: "week" } };
