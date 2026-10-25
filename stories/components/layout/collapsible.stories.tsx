import { ChevronDownIcon } from "@qeetrix/icons/icons/chevron-down";
import {
  Box,
  Button,
  Collapsible,
  CollapsiblePanel,
  type CollapsibleProps,
  CollapsibleTrigger,
  Inline,
  Stack,
  Text,
} from "@qeetrix/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

function Facts({ rows }: { rows: Array<[string, string]> }) {
  return (
    <Stack gap="sm">
      {rows.map(([term, value]) => (
        <Inline key={term} justify="between">
          <Text size="sm" tone="subtle">
            {term}
          </Text>
          <Text size="sm">{value}</Text>
        </Inline>
      ))}
    </Stack>
  );
}

function AdvancedSettings(props: CollapsibleProps) {
  return (
    <Collapsible {...props}>
      <Stack gap="sm" style={{ inlineSize: 320 }}>
        <div>
          <CollapsibleTrigger
            render={
              <Button variant="ghost" size="sm" icon={ChevronDownIcon}>
                Advanced settings
              </Button>
            }
          />
        </div>
        <CollapsiblePanel>
          <Box border="default" radius="control" padding="md">
            <Facts
              rows={[
                ["Token lifetime", "3,600 s"],
                ["Clock skew", "30 s"],
                ["Audience", "api.id.qeet.in"],
              ]}
            />
          </Box>
        </CollapsiblePanel>
      </Stack>
    </Collapsible>
  );
}

const meta: Meta<typeof Collapsible> = {
  title: "Components/Layout/Collapsible",
  component: Collapsible,
  subcomponents: { CollapsibleTrigger, CollapsiblePanel },
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
  },
  // These props come from Base UI, so the declarations give them no controls.
  args: {
    defaultOpen: false,
    disabled: false,
    onOpenChange: fn(),
  },
  render: (args) => <AdvancedSettings {...args} />,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <Inline gap="md" align="start">
      <Stack gap="sm">
        <Text size="sm" tone="subtle">
          Open
        </Text>
        <AdvancedSettings {...args} defaultOpen />
      </Stack>
      <Stack gap="sm">
        <Text size="sm" tone="subtle">
          Disabled
        </Text>
        <AdvancedSettings {...args} disabled />
      </Stack>
    </Inline>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: (args) => (
    <Box padding="lg" background="raised" border="default" radius="surface">
      <Collapsible {...args}>
        <Stack gap="md" style={{ inlineSize: 360 }}>
          <Stack gap="xs">
            <Text weight="semibold">https://api.acme.in/hooks/qeet-id</Text>
            <Text size="sm" tone="subtle">
              Last delivery 200 OK, 3 min ago
            </Text>
          </Stack>
          <CollapsiblePanel>
            <Facts
              rows={[
                ["Maximum attempts", "5"],
                ["Backoff", "Exponential"],
                ["Timeout", "10 s"],
              ]}
            />
          </CollapsiblePanel>
          <div>
            <CollapsibleTrigger
              render={
                <Button variant="soft" size="sm">
                  Retry policy
                </Button>
              }
            />
          </div>
        </Stack>
      </Collapsible>
    </Box>
  ),
};

export const ToggleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the trigger shows and hides the panel",
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Advanced settings" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByText("api.id.qeet.in")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(await canvas.findByText("api.id.qeet.in")).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());

    // The keyboard toggles it too.
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(canvas.queryByText("api.id.qeet.in")).not.toBeInTheDocument());
  },
};

export const DisabledInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: disabled ignores the trigger",
  args: { disabled: true },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Advanced settings" });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
