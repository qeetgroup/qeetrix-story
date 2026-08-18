import { Input, Label } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  parameters: {
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
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only API key display — the value is selectable but not editable.",
      },
    },
  },
  args: { defaultValue: "qid_live_8f2c1a9b3e47d056", disabled: true },
};
