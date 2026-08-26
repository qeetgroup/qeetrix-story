import { Input, Label } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Input> = {
  title: "Components/Data Entry/Input",
  component: Input,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A single-line text input that covers the full range of HTML `<input>` types. Used across Qeet ID login flows, qeet-people profile fields, and API key entry screens. Pair with `Label` and `Field` for accessible, validated forms.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "ada.lovelace@globex.com" },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="work-email">Work email</Label>
      <Input id="work-email" type="email" placeholder="grace.hopper@acme.com" />
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Applies `aria-invalid` to trigger the error ring — used when server-side validation fails (e.g. email already registered in Qeet ID).",
      },
    },
  },
  args: { "aria-invalid": true, defaultValue: "not-an-email", "aria-label": "Work email" },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only API key display — the value is selectable but not editable.",
      },
    },
  },
  args: { defaultValue: "qid_live_8f2c1a9b3e47d056", disabled: true, "aria-label": "API key" },
};

export const TypeInteraction: Story = {
  name: "Interaction: typing a value",
  parameters: {
    docs: {
      description: {
        story:
          "Found by its label rather than a selector, which means the assertion only passes while the label is correctly associated with the field.",
      },
    },
  },
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="interaction-email">Work email</Label>
      <Input id="interaction-email" type="email" placeholder="grace.hopper@acme.com" />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByLabelText("Work email");

    await userEvent.type(field, "ada@globex.com");

    await expect(field).toHaveValue("ada@globex.com");
  },
};
