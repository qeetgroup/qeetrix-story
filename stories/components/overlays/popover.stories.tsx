import { InfoIcon } from "@qeetrix/icons/icons/info";
import { ListFilterIcon } from "@qeetrix/icons/icons/list-filter";
import {
  Button,
  Checkbox,
  IconButton,
  Inline,
  Popover,
  PopoverClose,
  PopoverContent,
  type PopoverProps,
  PopoverTrigger,
  Stack,
  Text,
  TextField,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Popover> = {
  title: "Components/Overlays/Popover",
  component: Popover,
  subcomponents: { PopoverTrigger, PopoverContent, PopoverClose },
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
type Story = StoryObj<typeof Popover>;

/** A filter panel over the members table. */
function FilterPopover(props: Omit<PopoverProps, "children">) {
  return (
    <Popover {...props}>
      <PopoverTrigger
        render={
          <Button variant="soft" icon={ListFilterIcon}>
            Filter
          </Button>
        }
      />
      <PopoverContent title="Filter members" description="Show members who are:">
        <Stack gap="xs">
          <Checkbox label="Active" defaultChecked />
          <Checkbox label="Invited" defaultChecked />
          <Checkbox label="Suspended" />
        </Stack>
        <Inline justify="end" gap="sm">
          <PopoverClose
            render={
              <Button variant="ghost" size="sm">
                Clear
              </Button>
            }
          />
          <PopoverClose render={<Button size="sm">Apply</Button>} />
        </Inline>
      </PopoverContent>
    </Popover>
  );
}

/** An info button's popover: no title, so `aria-label` names it. */
function EnforcementPopover(props: Omit<PopoverProps, "children">) {
  return (
    <Popover {...props}>
      <PopoverTrigger
        render={<IconButton icon={InfoIcon} aria-label="About passkey enforcement" />}
      />
      <PopoverContent aria-label="About passkey enforcement" style={{ inlineSize: 320 }}>
        <Text>Members of Acme Pvt Ltd must sign in with a passkey.</Text>
      </PopoverContent>
    </Popover>
  );
}

export const Playground: Story = {
  render: (args) => <FilterPopover {...args} />,
};

export const Sides: Story = {
  render: (args) => (
    <Inline gap="md">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side} {...args}>
          <PopoverTrigger
            render={<Button variant="soft">{side[0].toUpperCase() + side.slice(1)}</Button>}
          />
          <PopoverContent title="Billing contact" side={side}>
            <Text>Ananya Iyer · billing@acme.in</Text>
          </PopoverContent>
        </Popover>
      ))}
    </Inline>
  ),
};

export const InlineEdit: Story = {
  name: "Inline edit",
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="soft">Edit endpoint</Button>} />
      <PopoverContent
        title="Webhook endpoint"
        description="Where Qeet ID delivers events."
        style={{ inlineSize: 360 }}
      >
        <TextField label="URL" type="url" defaultValue="https://api.acme.in/qeet/hooks" />
        <Inline justify="end" gap="sm">
          <PopoverClose
            render={
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            }
          />
          <PopoverClose render={<Button size="sm">Save</Button>} />
        </Inline>
      </PopoverContent>
    </Popover>
  ),
};

export const WithoutTitle: Story = {
  name: "Without title",
  parameters: {
    docs: {
      description: { story: "Without a `title`, name it with `aria-label` or `aria-labelledby`." },
    },
  },
  render: (args) => <EnforcementPopover {...args} />,
};

export const OpenCloseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: focus moves in, Escape returns it",
  render: (args) => <FilterPopover {...args} />,
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Filter" });
    await userEvent.click(trigger);

    // The popover portals to the end of <body>, outside the canvas.
    const popover = await screen.findByRole("dialog", { name: "Filter members" });
    await waitFor(() => expect(popover.contains(document.activeElement)).toBe(true));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

export const LabelledInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: labelled by its title, closed by an action",
  render: (args) => <FilterPopover {...args} />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Filter" });
    await userEvent.click(trigger);
    let popover = await screen.findByRole("dialog", { name: "Filter members" });
    await expect(popover).toHaveAccessibleDescription("Show members who are:");

    await userEvent.click(within(popover).getByRole("checkbox", { name: "Suspended" }));
    await userEvent.click(within(popover).getByRole("button", { name: "Apply" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await userEvent.click(trigger);
    popover = await screen.findByRole("dialog", { name: "Filter members" });
    await waitFor(() => expect(popover).toBeVisible());
  },
};

export const NameInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: named without a title",
  render: (args) => (
    <Inline gap="md">
      <EnforcementPopover {...args} />
      <Popover {...args}>
        <PopoverTrigger render={<Button variant="soft">Session details</Button>} />
        <PopoverContent aria-labelledby="session-device" style={{ inlineSize: 320 }}>
          <Stack gap="xs">
            <Text id="session-device" weight="semibold">
              Chrome on macOS
            </Text>
            <Text size="sm" tone="subtle">
              Bengaluru · signed in 2 minutes ago
            </Text>
          </Stack>
        </PopoverContent>
      </Popover>
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "About passkey enforcement" }));
    await expect(
      await screen.findByRole("dialog", { name: "About passkey enforcement" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole("button", { name: "Session details" }));
    const popover = await screen.findByRole("dialog", { name: "Chrome on macOS" });
    await waitFor(() => expect(popover).toBeVisible());
  },
};
