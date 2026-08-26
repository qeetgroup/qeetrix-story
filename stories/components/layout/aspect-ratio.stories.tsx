import { AspectRatio } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof AspectRatio> = {
  title: "Components/Layout/AspectRatio",
  component: AspectRatio,
  parameters: {
    qeetrix: qx({ category: "layout", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Constrains its child to a fixed width-to-height ratio using CSS `padding-top` hack — prevents layout shift while images or embedded charts load. Use it for product-screenshot thumbnails in qeet-docs, chart cells in qeet-logs dashboards, or org-logo placeholders in Qeet ID's branding settings.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "number" }, description: "Width / height ratio" },
  },
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

const Fill = ({ label }: { label: string }) => (
  <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <Fill label="16 / 9" />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <div className="w-64">
      <AspectRatio {...args}>
        <Fill label="1 / 1" />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <div className="w-56">
      <AspectRatio {...args}>
        <Fill label="3 / 4" />
      </AspectRatio>
    </div>
  ),
};

export const WithImage: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args} className="rounded-md border">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
          alt="Sample"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};
