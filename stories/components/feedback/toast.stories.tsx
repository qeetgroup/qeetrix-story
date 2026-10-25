import {
  Button,
  Inline,
  QeetrixProvider,
  type ToastOptions,
  ToastProvider,
  useToast,
} from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof ToastProvider> = {
  title: "Components/Feedback/Toast",
  component: ToastProvider,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "centered",
  },
  argTypes: {
    // Each story supplies the app inside the provider.
    children: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

/** A button that shows one toast through `useToast`, which needs a ToastProvider above it. */
function ShowToast({ label, options }: { label: string; options: ToastOptions }) {
  const toast = useToast();
  return (
    <Button variant="soft" onClick={() => toast.add(options)}>
      {label}
    </Button>
  );
}

/** The toasts rendered at the end of <body>, outside the canvas. */
const toasts = () => [...document.querySelectorAll<HTMLElement>("[data-slot=toast]")];

const undo = fn();

export const Playground: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <ShowToast
        label="Send invite"
        options={{
          title: "Invite sent",
          description: "Ananya Iyer will get an email at ananya.iyer@acme.in.",
          tone: "success",
        }}
      />
    </ToastProvider>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Inline gap="md">
        <ShowToast
          label="Info"
          options={{ title: "Export started", description: "We'll email you the CSV file." }}
        />
        <ShowToast
          label="Success"
          options={{
            title: "Payout settled",
            description: "₹4,82,310.50 was credited to HDFC ••4821.",
            tone: "success",
          }}
        />
        <ShowToast
          label="Warning"
          options={{
            title: "Approaching log quota",
            description: "Qeet Logs has used 92% of today's event budget.",
            tone: "warning",
          }}
        />
        <ShowToast
          label="Danger"
          options={{
            title: "Webhook delivery failed",
            description: "hooks.acme.in returned 503.",
            tone: "danger",
          }}
        />
      </Inline>
    </ToastProvider>
  ),
};

export const WithAction: Story = {
  name: "With action",
  render: (args) => (
    <ToastProvider {...args}>
      <ShowToast
        label="Remove member"
        options={{
          title: "Rahul Verma removed",
          description: "Their sessions in Acme Pvt Ltd have ended.",
          tone: "warning",
          action: { label: "Undo", onClick: undo },
        }}
      />
    </ToastProvider>
  ),
};

function GenerateInvoice() {
  const toast = useToast();
  const generate = () =>
    toast.promise(
      new Promise<string>((resolve) => setTimeout(() => resolve("INV-2026-0042"), 1500)),
      {
        loading: { title: "Generating GST invoice…" },
        success: (number) => ({
          title: `Invoice ${number} sent`,
          description: "To billing@acme.in",
        }),
        error: { title: "Couldn't generate the invoice" },
      },
    );
  return (
    <Button variant="soft" onClick={generate}>
      Generate invoice
    </Button>
  );
}

/** A promise that rejects: the loading toast ends as danger. */
function SettlePayout() {
  const toast = useToast();
  const settle = () =>
    toast
      .promise(
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error("HDFC gateway timeout")), 1500),
        ),
        {
          loading: { title: "Settling ₹4,82,310.50…" },
          success: { title: "Payout settled" },
          error: {
            title: "Payout failed",
            description: "HDFC Bank didn't respond. Nothing was debited.",
          },
        },
      )
      // The toast reports the failure; nothing else needs the rejection.
      .catch(() => {});
  return (
    <Button variant="soft" onClick={settle}>
      Settle payout
    </Button>
  );
}

export const PromiseToast: Story = {
  name: "Promise",
  render: (args) => (
    <ToastProvider {...args}>
      <Inline gap="md">
        <GenerateInvoice />
        <SettlePayout />
      </Inline>
    </ToastProvider>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <ToastProvider {...args}>
        <ShowToast
          label="आमंत्रण भेजें"
          options={{
            title: "आमंत्रण भेजा गया",
            description: "अनन्या अय्यर को ईमेल मिलेगा।",
            tone: "success",
          }}
        />
      </ToastProvider>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "आमंत्रण भेजें" }));
    const region = await screen.findByRole("region", { name: /सूचनाएँ/ });
    await waitFor(() => expect(within(region).getByText("आमंत्रण भेजा गया")).toBeVisible());
    // The Dismiss button joins the accessibility tree once the toast is hovered or focused.
    await userEvent.hover(toasts()[0]);
    await expect(within(region).getByRole("button", { name: "खारिज करें" })).toBeInTheDocument();
  },
};

export const ShowInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: shows in the Notifications region",
  render: Playground.render,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Send invite" }));
    const region = await screen.findByRole("region", { name: /Notifications/ });
    await waitFor(() => expect(within(region).getByText("Invite sent")).toBeVisible());
    await expect(toasts()[0]).toHaveAttribute("data-tone", "success");

    // The Dismiss button joins the accessibility tree once the toast is hovered or focused.
    await userEvent.hover(toasts()[0]);
    await userEvent.click(within(region).getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(toasts()).toHaveLength(0));
  },
};

export const ActionInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the action runs",
  render: WithAction.render,
  play: async ({ canvas, userEvent }) => {
    undo.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Remove member" }));
    const region = await screen.findByRole("region", { name: /Notifications/ });
    await userEvent.click(await within(region).findByRole("button", { name: "Undo" }));
    await expect(undo).toHaveBeenCalledOnce();
  },
};

export const TonesInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: every tone, and danger stays",
  args: { limit: 4, timeout: 1000 },
  render: Tones.render,
  play: async ({ canvas, userEvent }) => {
    for (const name of ["Info", "Success", "Warning", "Danger"]) {
      await userEvent.click(canvas.getByRole("button", { name }));
    }
    await waitFor(() => expect(toasts()).toHaveLength(4));
    await expect(toasts().map((toast) => toast.dataset.tone)).toEqual(
      expect.arrayContaining(["info", "success", "warning", "danger"]),
    );
    await waitFor(() => expect(toasts()).toHaveLength(1), { timeout: 4000 });
    await expect(toasts()[0]).toHaveTextContent("Webhook delivery failed");
  },
};

export const PromiseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a promise shows a spinner, then success",
  render: PromiseToast.render,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Generate invoice" }));
    await waitFor(() => expect(toasts()).toHaveLength(1));
    const toast = toasts()[0];
    await expect(toast).toHaveAttribute("data-loading");
    await expect(toast).toHaveTextContent("Generating GST invoice…");
    await expect(toast.querySelector("[data-slot=spinner]")).not.toBeNull();

    await waitFor(() => expect(toasts()[0]).toHaveTextContent("Invoice INV-2026-0042 sent"), {
      timeout: 3000,
    });
    await expect(toasts()[0]).not.toHaveAttribute("data-loading");
    await expect(toasts()[0]).toHaveAttribute("data-tone", "success");
    await expect(toasts()[0].querySelector("[data-slot=spinner]")).toBeNull();
  },
};

export const RejectedInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a rejected promise ends as danger",
  render: PromiseToast.render,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Settle payout" }));
    await waitFor(() => expect(toasts()[0]).toHaveAttribute("data-loading"));
    await waitFor(() => expect(toasts()[0]).toHaveTextContent("Payout failed"), {
      timeout: 3000,
    });
    await expect(toasts()[0]).toHaveAttribute("data-tone", "danger");
    await expect(toasts()[0]).not.toHaveAttribute("data-loading");
  },
};
