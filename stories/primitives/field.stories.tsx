import {
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Field> = {
  title: "Primitives/Field",
  component: Field,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composes a `FieldLabel`, `FieldControl`, optional `FieldDescription`, and optional `FieldError` around a form control. `FieldControl` opts into generated and merged ARIA relationships; direct controls remain supported when callers own IDs. Use `FieldSet` + `FieldLegend` to group related fields.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Tenant settings</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>Display name</FieldLabel>
          <FieldControl render={<Input placeholder="Acme Inc." />} />
          <FieldDescription>Shown on the hosted Qeet ID login screen.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
