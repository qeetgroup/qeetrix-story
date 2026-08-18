import { Avatar, AvatarFallback, PresenceIndicator } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PresenceIndicator> = {
  title: "Primitives/PresenceIndicator",
  component: PresenceIndicator,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Real-time presence dot used in Qeet collaboration and chat surfaces. Four statuses — `online`, `away`, `busy`, `offline` — map to distinct colours; `online` supports an optional `pulse` animation. Compose it over an `Avatar` with `absolute` positioning for the classic badge layout.",
      },
    },
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["online", "away", "busy", "offline"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PresenceIndicator>;

export const Statuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All four presence states at `lg` size — matches the status legend shown in the qeet-people team directory.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      {(["online", "away", "busy", "offline"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <PresenceIndicator status={s} size="lg" />
          <span className="text-xs text-muted-foreground capitalize">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const OnAvatar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Composed over an `Avatar` using absolute positioning — the standard treatment for user list rows and direct-message headers.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      {(["online", "away", "busy", "offline"] as const).map((s) => (
        <div key={s} className="relative inline-block">
          <Avatar>
            <AvatarFallback>
              {s === "online" ? "AL" : s === "away" ? "GH" : s === "busy" ? "AT" : "KJ"}
            </AvatarFallback>
          </Avatar>
          <PresenceIndicator
            status={s}
            pulse={s === "online"}
            className="absolute end-0 bottom-0"
          />
        </div>
      ))}
    </div>
  ),
};
