import { Button, Toaster, toast } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Toaster> = {
  title: "Components/Feedback/Toast",
  component: Toaster,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Ephemeral pop-up feedback for user-triggered actions — API key creation, passkey registration, webhook publish, or payment confirmation in qeet-pay. Mount `<Toaster />` once at app root, then call `toast()`, `toast.success()`, `toast.warning()`, `toast.error()`, or `toast.promise()` anywhere in the tree. Outcome toasts take their status colour — `success`, `warning` and `error` carry a 3px inline-start accent and a coloured title — while a bare `toast()` (info) stays a neutral message. Errors are announced assertively; errors, warnings and toasts with an action stay up for 10s instead of 5s. A failure the user must resolve belongs in an inline `Alert`, not a toast.",
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

/**
 * Fires one toast per status. `timeout: 0` keeps them up, so the status treatment can be
 * inspected (and screenshotted) instead of racing a 5–10s auto-dismiss.
 */
function showStatusToasts() {
  toast("Settings saved", { timeout: 0 });
  toast.success("Payout settled", {
    description: "₹4,82,310.50 was credited to HDFC ••4821.",
    timeout: 0,
  });
  toast.warning("Approaching log quota", {
    description: "qeet-logs has ingested 92% of today's event budget.",
    timeout: 0,
  });
  toast.error("Webhook delivery failed", {
    description: "Qeet Notify got a 503 from hooks.acme.com.",
    timeout: 0,
  });
}

export const StatusToasts: Story = {
  name: "Status toasts",
  parameters: {
    docs: {
      description: {
        story:
          "One toast per status, held open so the treatment can be compared: `success`, `warning` and `error` take the status colour on a 3px accent and on the title; the bare `toast()` info message stays neutral. Reach for a status toast to report the outcome of something the user just did — not for a failure they still have to fix. Rendered in its own frame in the docs so its `Toaster` does not double up with the one in the story above.",
      },
      // Every inline story on the docs page shares one module, so a second inline `<Toaster />`
      // would render every toast twice. An iframe gets its own toast manager.
      story: { inline: false, iframeHeight: "440px" },
    },
  },
  render: () => (
    <>
      <Button variant="outline" onClick={showStatusToasts}>
        Show status toasts
      </Button>
      {/* Base UI shows three toasts by default; this story compares all four. */}
      <Toaster limit={4} />
    </>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show status toasts" }));

    // Toasts are portalled to document.body — they are not in `canvas`.
    for (const title of ["Settings saved", "Payout settled", "Approaching log quota"]) {
      await waitFor(() => expect(screen.getByRole("dialog", { name: title })).toBeVisible());
    }
    // An error is high priority. Base UI keeps its alertdialog aria-hidden until focused and
    // announces it through a separate assertive live region instead — so assert both halves:
    // it is on screen in the viewport, and it interrupts.
    const viewport = screen.getByRole("region", { name: "Notifications" });
    await waitFor(() =>
      expect(within(viewport).getByText("Webhook delivery failed")).toBeVisible(),
    );
    await expect(screen.getByRole("alert")).toHaveTextContent("Webhook delivery failed");
  },
};
