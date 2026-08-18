import { Button, Toaster, toast } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Toaster> = {
  title: "Primitives/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Ephemeral pop-up feedback for user-triggered actions — API key creation, passkey registration, webhook publish, or payment confirmation in qeet-pay. Mount `<Toaster />` once at app root, then call `toast()`, `toast.success()`, `toast.warning()`, `toast.error()`, or `toast.promise()` anywhere in the tree.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Click any button to fire the corresponding toast variant — `Toaster` must be mounted once at app root.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Settings saved")}>
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("API key created", {
            description: "Copy it now — it won't be shown again.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Approaching quota", {
            description: "You've used 80% of your monthly budget.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Couldn't save changes", {
            description: "The server returned a 500. Please retry.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1800)), {
            loading: "Publishing release…",
            success: "Release published",
            error: "Publish failed",
          })
        }
      >
        Promise
      </Button>
      <Toaster />
    </div>
  ),
};
