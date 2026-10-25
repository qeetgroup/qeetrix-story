import { EyeIcon } from "@qeetrix/icons/icons/eye";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { WrenchIcon } from "@qeetrix/icons/icons/wrench";
import { Button, Inline, QeetrixProvider, Stack } from "@qeetrix/react";
import { Alert, AppShell, PageHeader } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Alert> = {
  title: "Components/Feedback/Alert",
  component: Alert,
  parameters: {
    qeetrix: qx({ category: "feedback", status: "experimental" }),
    layout: "padded",
  },
  tags: ["autodocs", "experimental"],
  args: {
    tone: "warning",
    title: "Directory sync is behind",
    children: "Users added in Azure AD in the last hour may be missing.",
  },
  render: (args) => (
    <div style={{ maxInlineSize: 640 }}>
      <Alert {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap="lg" style={{ maxInlineSize: 640 }}>
      <Alert tone="info" title="You're in Development">
        Sign-ins here don't reach production.
      </Alert>
      <Alert tone="success" title="Directory synced">
        1,284 users are up to date.
      </Alert>
      <Alert tone="warning" title="Directory sync is behind">
        Users added in the last hour may be missing.
      </Alert>
      <Alert tone="danger" title="Directory sync failed">
        Azure AD rejected the client secret.
      </Alert>
    </Stack>
  ),
};

export const WithActions: Story = {
  name: "With actions",
  render: () => (
    <Stack gap="lg" style={{ maxInlineSize: 640 }}>
      <Alert
        tone="danger"
        title="Directory sync failed"
        actions={
          <>
            <Button size="sm">Retry sync</Button>
            <Button size="sm" variant="ghost" tone="neutral">
              View details
            </Button>
          </>
        }
      >
        The last three attempts timed out.
      </Alert>
      <Alert tone="success" title="Directory synced" onDismiss={() => {}}>
        1,284 users are up to date.
      </Alert>
    </Stack>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: () => (
    <Stack gap="lg" style={{ maxInlineSize: 640 }}>
      <Alert tone="warning" icon={EyeIcon} title="You're viewing as Priya Sharma">
        Anything you change is done as her.
      </Alert>
      <Alert tone="info" icon={KeyRoundIcon} title="The signing key rotates in 7 days" />
    </Stack>
  ),
};

/** The three approved page banners: viewing as someone else, maintenance, a trial ending. */
function Banners({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <>
      <Alert
        variant="banner"
        tone="warning"
        icon={EyeIcon}
        title="You're viewing as Priya Sharma"
        actions={
          <Button size="sm" tone="neutral">
            Exit
          </Button>
        }
      >
        (priya@acme.in). Anything you change is done as her.
      </Alert>
      {onDismiss && (
        <Alert
          variant="banner"
          icon={WrenchIcon}
          title="Maintenance on Sunday 2 November, 01:00–02:00 IST."
          actions={
            <Button size="sm" variant="ghost" tone="neutral">
              Details
            </Button>
          }
          onDismiss={onDismiss}
        >
          Sign-in keeps working.
        </Alert>
      )}
      <Alert
        variant="banner"
        tone="danger"
        title="Your trial ends in 3 days."
        actions={<Button size="sm">Upgrade</Button>}
      >
        After that, new sign-ins stop.
      </Alert>
    </>
  );
}

export const PageBanner: Story = {
  name: "Page banner",
  parameters: {
    layout: "fullscreen",
    // AppShell is a whole page (100dvh): give it its own frame in the docs.
    docs: { story: { inline: false, iframeHeight: 300 } },
  },
  render: () => (
    <AppShell banners={<Banners onDismiss={() => {}} />}>
      <PageHeader
        title="Users"
        description="People who can sign in to Acme Pvt Ltd's applications."
        actions={<Button size="sm">Invite users</Button>}
      />
    </AppShell>
  ),
};

/** Shows an alert only once something happens, so it can be announced. */
function AnnounceDemo() {
  const [synced, setSynced] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <Stack gap="lg">
      <Inline gap="md">
        <Button size="sm" variant="soft" onClick={() => setSynced(true)}>
          Sync directory
        </Button>
        <Button size="sm" variant="soft" tone="danger" onClick={() => setFailed(true)}>
          Delete connection
        </Button>
      </Inline>
      {synced && (
        <Alert tone="success" announce="polite" title="Directory synced">
          1,284 users are up to date.
        </Alert>
      )}
      {failed && (
        <Alert tone="danger" announce="urgent" title="Couldn't delete the connection">
          3 applications still sign in through it.
        </Alert>
      )}
    </Stack>
  );
}

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Alert tone="danger" title="साइन-इन विफल" onDismiss={() => {}}>
        पासकी सत्यापित नहीं हो सकी।
      </Alert>
    </QeetrixProvider>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("button", { name: "खारिज करें" })).toBeVisible();
    await expect(canvasElement.querySelector("[data-slot=alert-title]")).toHaveTextContent(
      "त्रुटि: साइन-इन विफल",
    );
  },
};

export const DismissInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Dismiss runs onDismiss",
  args: {
    tone: "success",
    title: "Directory synced",
    children: "1,284 users are up to date.",
    onDismiss: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

export const AnnounceInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: announces only what appears",
  render: () => <AnnounceDemo />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.queryByRole("status")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Sync directory" }));
    await expect(await canvas.findByRole("status")).toHaveTextContent("Success: Directory synced");
    await userEvent.click(canvas.getByRole("button", { name: "Delete connection" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Error: Couldn't delete the connection",
    );
  },
};

export const ToneInWords: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: says its tone in words",
  args: { tone: "warning", icon: EyeIcon, title: "You're viewing as Priya Sharma" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=alert-title]")).toHaveTextContent(
      "Warning: You're viewing as Priya Sharma",
    );
  },
};

/** The page banners, with the maintenance one gone once it's dismissed. */
function DismissibleBanners({ onDismiss }: { onDismiss: () => void }) {
  const [shown, setShown] = useState(true);
  return (
    <Banners
      onDismiss={
        shown
          ? () => {
              onDismiss();
              setShown(false);
            }
          : undefined
      }
    />
  );
}

export const BannerDismissInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a page banner's Dismiss",
  args: { onDismiss: fn() },
  render: (args) => <DismissibleBanners onDismiss={args.onDismiss ?? (() => {})} />,
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText(/Maintenance on Sunday/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
    await expect(canvas.queryByText(/Maintenance on Sunday/)).toBeNull();
    await expect(canvas.getByRole("button", { name: "Upgrade" })).toBeVisible();
  },
};
