import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { Inline, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { Chip, ChipGroup, type SelectableChipProps } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<SelectableChipProps> = {
  title: "Components/Data Entry/Chip",
  component: Chip,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "An interactive or removable tag. Selectable, it turns on and off (a checkbox, or a radio in a one-value ChipGroup); removable, it's a choice already made with a Remove button. A static status is a Badge; a whole applied-filters bar is FilterTags.",
      },
    },
  },
  args: {
    children: "Unread",
    size: "md",
    onCheckedChange: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<SelectableChipProps>;

export const Playground: Story = {};

export const Selectable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Chosen, a chip takes the selected tint, a 2px Ember edge and a check before its label, so the choice never rests on colour. An icon takes the check's place.",
      },
    },
  },
  render: () => (
    <Inline gap="sm">
      <Chip>Unread</Chip>
      <Chip defaultChecked>Flagged</Chip>
      <Chip icon={KeyRoundIcon} defaultChecked>
        Passkey
      </Chip>
      <Chip disabled>Archived</Chip>
    </Inline>
  ),
};

/** Applied filters on the Users list, each removed by its own button. */
function AppliedFilters() {
  const [filters, setFilters] = useState(["Status: Active", "MFA: Passkey", "Department: Finance"]);
  return (
    <Inline gap="sm">
      {filters.map((filter) => (
        <Chip
          key={filter}
          onRemove={() => setFilters((all) => all.filter((each) => each !== filter))}
        >
          {filter}
        </Chip>
      ))}
    </Inline>
  );
}

export const Removable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A static label ending in a "Remove {label}" button. Removing the chip, and moving focus to the next, is the page\'s.',
      },
    },
  },
  render: () => <AppliedFilters />,
};

export const OneValue: Story = {
  name: "One value",
  parameters: {
    docs: {
      description: {
        story:
          "A ChipGroup chooses one value: the chips are radios, one tab stop, the arrow keys move the choice.",
      },
    },
  },
  render: () => (
    <ChipGroup label="Sign-in method" defaultValue="passkey">
      <Chip value="passkey">Passkey</Chip>
      <Chip value="otp">One-time code</Chip>
      <Chip value="password">Password</Chip>
    </ChipGroup>
  ),
};

export const Several: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With `multiple`, any number of values: each chip is a checkbox, and `value` the array of chosen ones.",
      },
    },
  },
  render: () => (
    <ChipGroup label="Status" multiple defaultValue={["active", "invited"]}>
      <Chip value="active">Active</Chip>
      <Chip value="invited">Invited</Chip>
      <Chip value="suspended">Suspended</Chip>
      <Chip value="deleted">Deleted</Chip>
    </ChipGroup>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`sm` for a filter row over a list, `md` (the default), and `lg`, the fields' height.",
      },
    },
  },
  render: () => (
    <Stack gap="md">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Inline key={size} gap="sm" align="center">
          <Text size="sm" tone="subtle" style={{ inlineSize: 32 }}>
            {size}
          </Text>
          <Chip size={size} defaultChecked>
            Active
          </Chip>
          <Chip size={size}>Invited</Chip>
          <Chip size={size} onRemove={() => {}}>
            MFA: Passkey
          </Chip>
        </Inline>
      ))}
    </Stack>
  ),
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <ChipGroup label="الحالة" multiple defaultValue={["active"]}>
        <Chip value="active">نشط</Chip>
        <Chip value="invited">مدعو</Chip>
        <Chip value="suspended">موقوف</Chip>
      </ChipGroup>
    </div>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Inline gap="sm">
        <Chip defaultChecked>सक्रिय</Chip>
        <Chip onRemove={() => {}}>स्थिति: सक्रिय</Chip>
      </Inline>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "स्थिति: सक्रिय हटाएँ" })).toBeVisible();
  },
};

export const ToggleInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a selectable chip turns on and off",
  play: async ({ args, canvas, userEvent }) => {
    const chip = canvas.getByRole("checkbox", { name: "Unread" });
    await expect(chip).not.toBeChecked();
    await userEvent.click(chip);
    await expect(chip).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.keyboard(" ");
    await expect(chip).not.toBeChecked();
  },
};

export const OneValueInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: one value, the arrow keys move the choice",
  render: OneValue.render,
  play: async ({ canvas, userEvent }) => {
    const passkey = canvas.getByRole("radio", { name: "Passkey" });
    await expect(passkey).toBeChecked();
    await userEvent.click(passkey);
    await userEvent.keyboard("{ArrowRight}");
    const otp = canvas.getByRole("radio", { name: "One-time code" });
    await expect(otp).toHaveFocus();
    await expect(otp).toBeChecked();
    await expect(passkey).not.toBeChecked();
  },
};

export const RemoveInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: Remove takes the chip away",
  render: () => <AppliedFilters />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Remove MFA: Passkey" }));
    await expect(canvas.queryByText("MFA: Passkey")).not.toBeInTheDocument();
    await expect(canvas.getByText("Status: Active")).toBeVisible();
  },
};
