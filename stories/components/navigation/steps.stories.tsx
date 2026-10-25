import { Button, Card, Field, Inline, Input, QeetrixProvider, Stack, Text } from "@qeetrix/react";
import { Steps } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const ADD_APP = [
  { label: "Choose type" },
  { label: "Configure" },
  { label: "Assign users" },
  { label: "Review" },
];

const SAML = [
  { label: "Upload IdP metadata", description: "acme-idp-metadata.xml" },
  { label: "Map attributes", description: "Email, name and groups" },
  { label: "Test sign-in", description: "priya@acme.in" },
  { label: "Turn it on", description: "Everyone at acme.in" },
];

const meta: Meta<typeof Steps> = {
  title: "Components/Navigation/Steps",
  component: Steps,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "padded",
  },
  args: {
    steps: ADD_APP,
    current: 1,
    orientation: "horizontal",
  },
  render: (args) => (
    <div style={{ inlineSize: 640 }}>
      <Steps {...args} />
    </div>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Steps>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { steps: SAML, current: 2, orientation: "vertical" },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Steps {...args} />
    </div>
  ),
};

export const Narrow: Story = {
  parameters: {
    docs: { description: { story: "Under 24rem only the current step's label shows." } },
  },
  render: (args) => (
    <div style={{ inlineSize: 300 }}>
      <Steps {...args} />
    </div>
  ),
};

/** A wizard that moves on with Continue and back through its done steps. */
function AddApplication() {
  const [current, setCurrent] = useState(1);
  const done = current === ADD_APP.length;
  return (
    <div style={{ inlineSize: 560 }}>
      <Card
        title="Add an application"
        level={2}
        footer={
          <Inline gap="sm" justify="end">
            <Button
              variant="ghost"
              disabled={current === 0}
              onClick={() => setCurrent((step) => Math.max(0, step - 1))}
            >
              Back
            </Button>
            <Button
              disabled={done}
              onClick={() => setCurrent((step) => Math.min(ADD_APP.length, step + 1))}
            >
              {current === ADD_APP.length - 1 ? "Create application" : "Continue"}
            </Button>
          </Inline>
        }
      >
        <Stack gap="xl">
          <Steps steps={ADD_APP} current={current} onStepSelect={setCurrent} />
          {done ? (
            <Text>Payroll portal is ready.</Text>
          ) : (
            <Field label="Application name">
              <Input defaultValue="Payroll portal" />
            </Field>
          )}
        </Stack>
      </Card>
    </div>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => <AddApplication />,
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <div style={{ inlineSize: 640 }}>
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <Steps
          steps={[
            { label: "प्रकार चुनें" },
            { label: "सेटिंग" },
            { label: "उपयोगकर्ता जोड़ें" },
            { label: "समीक्षा" },
          ]}
          current={1}
        />
      </QeetrixProvider>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "प्रगति" })).toBeVisible();
    await expect(canvas.getAllByRole("listitem")[0]).toHaveTextContent("प्रकार चुनें, पूरा हुआ");
  },
};

export const SemanticsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the current step is marked, the rest say where they stand",
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "Progress" });
    await expect(list.tagName).toBe("OL");
    const [done, current, upcoming] = canvas.getAllByRole("listitem");
    await expect(current).toHaveAttribute("aria-current", "step");
    await expect(done).toHaveTextContent("Choose type, Completed");
    await expect(upcoming).toHaveTextContent(/Assign users, Not started$/);
    // Without onStepSelect, no step is a button.
    await expect(canvas.queryAllByRole("button")).toHaveLength(0);
  },
};

export const StepSelectInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: going back to a done step",
  render: () => <AddApplication />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    const items = () => canvas.getAllByRole("listitem");
    await expect(items()[3]).toHaveAttribute("aria-current", "step");

    // Done steps are buttons back to themselves; the current one and those ahead aren't.
    const configure = canvas.getByRole("button", { name: /^Configure/ });
    // Named once, with no space before the comma.
    await expect(configure).toHaveAccessibleName("Configure, Completed");
    await userEvent.click(configure);
    await expect(items()[1]).toHaveAttribute("aria-current", "step");
    await expect(canvas.queryByRole("button", { name: /Assign users/ })).toBeNull();
  },
};
