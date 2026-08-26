import { Input, Label } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof Label> = {
  title: "Components/Forms/Label",
  component: Label,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "An accessible `<label>` element that links to its control via `htmlFor`. Always pair with an `Input`, `Select`, or other form primitive — never use a bare placeholder as a substitute for a label.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="client-id">Client ID</Label>
      <Input id="client-id" defaultValue="qid_acme_8f2c1a9b" readOnly />
    </div>
  ),
};
