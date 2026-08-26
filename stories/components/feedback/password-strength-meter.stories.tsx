import { PasswordStrengthMeter } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: "Components/Feedback/PasswordStrengthMeter",
  component: PasswordStrengthMeter,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "4-segment strength bar for Qeet ID password creation and recovery flows. Scores are 0–4 (empty → weak → fair → good → strong) using a built-in heuristic; pass a custom `score` prop to plug in zxcvbn or a server-side entropy check. Supports `feedback` strings for actionable hints and `hideLabel` for compact layouts.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof PasswordStrengthMeter>;

export const Weak: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Score 1 — a short, single-class password; shown during early typing in Qeet ID sign-up.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <PasswordStrengthMeter value="pass" />
    </div>
  ),
};

export const Strong: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Score 4 — long passphrase with mixed character classes; all four segments fill green.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <PasswordStrengthMeter value="C0rrect-Horse-Battery-Staple!" />
    </div>
  ),
};

export const WithFeedback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Fair password with actionable feedback hints — use `feedback` to surface guidance from a server-side entropy scorer.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <PasswordStrengthMeter
        value="Acme2024"
        feedback={[
          "Add a symbol (e.g. !, @, #) to strengthen it.",
          "Avoid predictable words like company names.",
        ]}
      />
    </div>
  ),
};
