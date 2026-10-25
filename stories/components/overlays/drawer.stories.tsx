import {
  Button,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  type DrawerProps,
  DrawerTrigger,
  Inline,
  QeetrixProvider,
  Stack,
  Text,
  TextField,
} from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Drawer> = {
  title: "Components/Overlays/Drawer",
  component: Drawer,
  subcomponents: { DrawerTrigger, DrawerContent, DrawerBody, DrawerFooter, DrawerClose },
  parameters: {
    qeetrix: qx({ category: "overlays", status: "stable" }),
    layout: "centered",
  },
  args: {
    onOpenChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

function EditMemberDrawer(props: Omit<DrawerProps, "children">) {
  return (
    <Drawer {...props}>
      <DrawerTrigger render={<Button variant="soft">Edit member</Button>} />
      <DrawerContent title="Edit member" description="Rahul Verma · Acme Pvt Ltd">
        <DrawerBody>
          <Stack gap="lg">
            <TextField label="Display name" defaultValue="Rahul Verma" />
            <TextField label="Work email" type="email" defaultValue="rahul.verma@acme.in" />
            <TextField label="Employee ID" defaultValue="ACME-0042" />
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Cancel</Button>} />
          <DrawerClose render={<Button>Save changes</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Playground: Story = {
  render: (args) => <EditMemberDrawer {...args} />,
};

export const Sides: Story = {
  render: (args) => (
    <Inline gap="md">
      <Drawer {...args} side="start">
        <DrawerTrigger render={<Button variant="soft">Filter members</Button>} />
        <DrawerContent title="Filter members" size="sm">
          <DrawerBody>
            <CheckboxGroup label="Status" defaultValue={["active", "invited"]}>
              <Checkbox value="active" label="Active" />
              <Checkbox value="invited" label="Invited" />
              <Checkbox value="suspended" label="Suspended" />
            </CheckboxGroup>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost">Clear</Button>} />
            <DrawerClose render={<Button>Apply</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <EditMemberDrawer {...args} side="end" />
    </Inline>
  ),
};

const SIZES = [
  { size: "sm", label: "Small", title: "Filter audit log" },
  { size: "md", label: "Medium", title: "Edit member" },
  { size: "lg", label: "Large", title: "Event details" },
] as const;

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md">
      {SIZES.map(({ size, label, title }) => (
        <Drawer key={size} {...args}>
          <DrawerTrigger render={<Button variant="soft">{label}</Button>} />
          <DrawerContent size={size} title={title} description="Rahul Verma · Acme Pvt Ltd">
            <DrawerBody>
              <Text>rahul.verma@acme.in</Text>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose render={<Button variant="ghost">Cancel</Button>} />
              <DrawerClose render={<Button>Done</Button>} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </Inline>
  ),
};

const LOG_ENTRY_FIELDS: Array<[string, string]> = [
  ["timestamp", "2026-10-07T02:14:09.481Z"],
  ["level", "ERROR"],
  ["service", "auth-service"],
  ["environment", "production"],
  ["region", "ap-south-1"],
  ["host", "auth-7f9c4d-2xk8q"],
  ["trace_id", "4bf92f3577b34da6a3ce929d0e0e4736"],
  ["span_id", "00f067aa0ba902b7"],
  ["tenant_id", "tnt_acme_01HZX3"],
  ["user_id", "usr_01J8K2M4PQ"],
  ["route", "POST /oauth/token"],
  ["status", "500"],
  ["duration_ms", "1874"],
  ["client_id", "qeet-pay-reconciler"],
  ["grant_type", "client_credentials"],
  ["error.type", "UpstreamTimeout"],
  ["error.message", "JWKS fetch timed out after 1500 ms"],
  ["upstream", "https://id.qeet.in/.well-known/jwks.json"],
  ["retry_count", "2"],
  ["release", "auth-service@4.18.2"],
  ["sdk", "qeet-logs-node 3.2.0"],
  ["ingested_at", "2026-10-07T02:14:09.902Z"],
];

/** More attributes than fit, so the body scrolls. */
function LogEntryDrawer(props: Omit<DrawerProps, "children">) {
  return (
    <Drawer {...props}>
      <DrawerTrigger render={<Button variant="soft">Inspect log entry</Button>} />
      <DrawerContent
        size="lg"
        title="JWKS fetch timed out"
        description="auth-service · production · 2 min ago"
      >
        <DrawerBody>
          <Stack gap="md">
            {LOG_ENTRY_FIELDS.map(([key, value]) => (
              <Stack key={key} gap="none">
                <Text size="sm" tone="subtle" mono>
                  {key}
                </Text>
                <Text mono>{value}</Text>
              </Stack>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost">Done</Button>} />
          <Button>Open trace</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const ScrollingBody: Story = {
  name: "Scrolling body",
  render: (args) => <LogEntryDrawer {...args} />,
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Drawer {...args}>
        <DrawerTrigger render={<Button variant="soft">सदस्य संपादित करें</Button>} />
        <DrawerContent title="सदस्य संपादित करें" description="राहुल वर्मा · Acme Pvt Ltd">
          <DrawerBody>
            <TextField label="नाम" defaultValue="राहुल वर्मा" />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<Button variant="ghost">रद्द करें</Button>} />
            <DrawerClose render={<Button>सहेजें</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </QeetrixProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "सदस्य संपादित करें" }));
    const drawer = await screen.findByRole("dialog", { name: "सदस्य संपादित करें" });
    await expect(within(drawer).getByRole("button", { name: "बंद करें" })).toBeInTheDocument();
  },
};

export const OpenCloseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus moves in, Escape returns it",
  render: (args) => <EditMemberDrawer {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Edit member" });
    await userEvent.click(trigger);

    // The drawer portals to the end of <body>, outside the canvas.
    const drawer = await screen.findByRole("dialog", { name: "Edit member" });
    await expect(drawer).toHaveAccessibleDescription("Rahul Verma · Acme Pvt Ltd");
    await waitFor(() =>
      expect(within(drawer).getByRole("textbox", { name: "Display name" })).toHaveFocus(),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

/** Clicks the scrim, outside the panel. */
const clickOutside = async (userEvent: { click: (element: Element) => Promise<void> }) => {
  const backdrop = document.querySelector("[data-slot=drawer-backdrop]");
  await expect(backdrop).not.toBeNull();
  await userEvent.click(backdrop as Element);
};

export const OutsideClickInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an outside click closes it",
  render: (args) => <EditMemberDrawer {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit member" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit member" });
    await waitFor(() => expect(drawer).toBeVisible());
    await clickOutside(userEvent);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  },
};

export const NotDismissibleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: not dismissible stays open until an action closes it",
  args: { dismissible: false },
  render: (args) => <EditMemberDrawer {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit member" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit member" });
    await waitFor(() => expect(drawer).toBeVisible());
    await expect(within(drawer).queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    await clickOutside(userEvent);
    await userEvent.keyboard("{Escape}");
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
    await expect(drawer).toBeVisible();
    await expect(drawer).not.toHaveAttribute("data-ending-style");

    await userEvent.click(within(drawer).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const StartSideInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: opens at the start edge",
  args: { side: "start" },
  render: (args) => <EditMemberDrawer {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit member" }));
    const drawer = await screen.findByRole("dialog", { name: "Edit member" });
    await waitFor(() => expect(Math.round(drawer.getBoundingClientRect().left)).toBe(0));
  },
};

export const BodyScrollInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the body scrolls, the footer stays",
  render: (args) => <LogEntryDrawer {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Inspect log entry" }));
    const drawer = await screen.findByRole("dialog", { name: "JWKS fetch timed out" });
    await waitFor(() => expect(drawer).toBeVisible());
    const body = drawer.querySelector<HTMLElement>("[data-slot=drawer-body]");
    await expect(body).not.toBeNull();
    await expect(body?.scrollHeight ?? 0).toBeGreaterThan(body?.clientHeight ?? 0);
    const done = within(drawer).getByRole("button", { name: "Done" });
    await waitFor(() =>
      expect(done.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        drawer.getBoundingClientRect().bottom,
      ),
    );
  },
};
