import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { Button, Inline, Stack } from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

// The reference story file: copy it when adding a component. The props table and controls
// come from @qeetrix/react's type declarations (scripts/docgen.mjs), so argTypes only add
// what a declaration can't say. Visible stories are few and show; hidden tests assert.
const meta: Meta<typeof Button> = {
  title: "Components/Actions/Button",
  component: Button,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
  },
  args: {
    children: "Create invoice",
    onClick: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md">
      {(["brand", "danger", "neutral"] as const).map((tone) => (
        <Inline key={tone} gap="md">
          <Button {...args} tone={tone} variant="solid">
            {tone === "danger" ? "Delete user" : "Save changes"}
          </Button>
          <Button {...args} tone={tone} variant="soft">
            {tone === "danger" ? "Revoke key" : "Preview"}
          </Button>
          <Button {...args} tone={tone} variant="ghost">
            {tone === "danger" ? "Remove" : "Cancel"}
          </Button>
        </Inline>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline gap="md" align="center">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </Inline>
  ),
};

export const WithIcon: Story = {
  name: "With icon",
  render: (args) => (
    <Inline gap="md">
      <Button {...args} icon={PlusIcon}>
        Invite users
      </Button>
      <Button {...args} variant="soft" icon={ArrowRightIcon}>
        Continue
      </Button>
    </Inline>
  ),
};

export const States: Story = {
  render: (args) => (
    <Inline gap="md">
      <Button {...args} loading icon={PlusIcon}>
        Saving…
      </Button>
      <Button {...args} disabled>
        Create invoice
      </Button>
      <Button {...args} variant="soft" disabled>
        Preview
      </Button>
    </Inline>
  ),
};

/**
 * Reference interaction test — copy this shape when a component has behaviour worth
 * asserting. It runs as a Vitest case in headless Chromium under `bun run test`, and is
 * tagged out of the sidebar and the docs page. Query by role and accessible name.
 */
export const ClickInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: click runs onClick",
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Create invoice" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const LoadingIgnoresClicks: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: loading ignores clicks",
  args: { loading: true },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Create invoice" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
