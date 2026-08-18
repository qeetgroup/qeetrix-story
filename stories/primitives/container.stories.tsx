import { Container } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Container> = {
  title: "Primitives/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The canonical responsive page shell. It centers content, applies mobile-first gutters, and caps prose, standard content, or wide operational layouts without a custom grid engine.",
      },
    },
  },
  tags: ["autodocs"],
  args: { size: "content", gutters: true },
  argTypes: {
    size: { control: "select", options: ["prose", "content", "wide", "full"] },
    gutters: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: (args) => (
    <Container {...args} className="py-8">
      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <h2 className="font-heading text-xl font-semibold">Operational content</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Resize the canvas to see gutters expand at the shared Tailwind breakpoints while the
          content measure remains stable.
        </p>
      </div>
    </Container>
  ),
};

export const Measures: Story = {
  render: () => (
    <div className="space-y-6 py-8">
      {(["prose", "content", "wide", "full"] as const).map((size) => (
        <Container key={size} size={size}>
          <div className="rounded-lg border border-border bg-muted p-4 text-sm">
            <code>{size}</code>
          </div>
        </Container>
      ))}
    </div>
  ),
};
