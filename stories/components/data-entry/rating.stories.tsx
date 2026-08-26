import { Rating } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof Rating> = {
  title: "Components/Data Entry/Rating",
  component: Rating,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Star rating input and display component. Supports controlled interactive ratings, 0.5-increment half-star steps, read-only aggregate display, and three sizes (`sm`, `default`, `lg`). Use for user feedback forms, merchant review scores, and app store aggregate displays.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Rating>;

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: "Controlled rating for user feedback forms — value state is managed by the parent.",
      },
    },
  },
  render: (args) => {
    const [value, setValue] = React.useState(3);
    return (
      <div className="flex flex-col items-center gap-2">
        <Rating {...args} value={value} onChange={setValue} />
        <span className="text-sm text-muted-foreground">{value} / 5</span>
      </div>
    );
  },
};

export const HalfSteps: Story = {
  parameters: {
    docs: {
      description: {
        story: "Allows 0.5 increments for nuanced ratings.",
      },
    },
  },
  render: () => {
    const [value, setValue] = React.useState(2.5);
    return (
      <div className="flex flex-col items-center gap-2">
        <Rating value={value} onChange={setValue} allowHalf />
        <span className="text-sm text-muted-foreground">{value} / 5</span>
      </div>
    );
  },
};

export const ReadOnlyAggregate: Story = {
  parameters: {
    docs: {
      description: {
        story: "Display-only aggregate score from qeet-pay merchant reviews or app store ratings.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Rating value={4.3} allowHalf readOnly size="sm" />
      <span className="text-sm text-muted-foreground">4.3 (1,204)</span>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <Rating value={3.5} allowHalf readOnly size="sm" />
      <Rating value={3.5} allowHalf readOnly size="default" />
      <Rating value={3.5} allowHalf readOnly size="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A disabled rating prevents user interaction and renders the stars in a muted style to communicate the field is not editable in the current context.",
      },
    },
  },
  render: () => <Rating value={3} onChange={() => {}} disabled />,
};
