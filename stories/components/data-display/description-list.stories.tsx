import { Badge, Card, QeetrixProvider, Text } from "@qeetrix/react";
import { CopyButton, DescriptionItem, DescriptionList } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof DescriptionList> = {
  title: "Components/Data Display/DescriptionList",
  component: DescriptionList,
  subcomponents: { DescriptionItem },
  parameters: {
    qeetrix: qx({ category: "data-display", status: "experimental" }),
    layout: "padded",
  },
  args: {
    layout: "rows",
    columns: 2,
  },
  // The docs table can't offer a control for a 1 | 2 | 3 | 4 union.
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3, 4] },
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ inlineSize: 480 }}>
      <DescriptionList {...args}>
        <DescriptionItem term="Email">
          priya@acme.in
          <CopyButton value="priya@acme.in" label="Copy email" size="sm" />
        </DescriptionItem>
        <DescriptionItem term="Status">
          <Badge tone="success">Active</Badge>
        </DescriptionItem>
        <DescriptionItem term="Groups">
          <Badge>Engineering</Badge>
          <Badge>Admins</Badge>
        </DescriptionItem>
        <DescriptionItem term="Manager" />
        <DescriptionItem term="Last sign-in">2 minutes ago · Bengaluru</DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const Columns: Story = {
  render: () => (
    <div style={{ inlineSize: 640 }}>
      <DescriptionList layout="columns" columns={4}>
        <DescriptionItem term="Sessions">3 active</DescriptionItem>
        <DescriptionItem term="MFA">Passkey</DescriptionItem>
        <DescriptionItem term="Applications">12</DescriptionItem>
        <DescriptionItem term="Source">Azure AD</DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const InContext: Story = {
  name: "In context",
  render: () => (
    <div style={{ inlineSize: 480 }}>
      <Card title="Production backend" level={2}>
        <DescriptionList>
          <DescriptionItem term="Key ID">
            <Text mono>kid_8f2c1a9b</Text>
            <CopyButton value="kid_8f2c1a9b" label="Copy key ID" size="sm" />
          </DescriptionItem>
          <DescriptionItem term="Scopes">read:users write:sessions</DescriptionItem>
          <DescriptionItem term="Last used">2 minutes ago</DescriptionItem>
          <DescriptionItem term="Expires" />
          <DescriptionItem term="Status">
            <Badge tone="success">Live</Badge>
          </DescriptionItem>
        </DescriptionList>
      </Card>
    </div>
  ),
};

export const EmptyValue: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an empty value reads Not set",
  render: () => (
    <DescriptionList>
      <DescriptionItem term="Manager" />
      <DescriptionItem term="Department">Engineering</DescriptionItem>
    </DescriptionList>
  ),
  play: async ({ canvas }) => {
    const manager = canvas.getAllByRole("definition")[0];
    await expect(manager).toHaveTextContent("—Not set");
    await expect(manager?.querySelector("[aria-hidden]")).toHaveTextContent("—");
  },
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <div style={{ inlineSize: 480 }}>
        <DescriptionList>
          <DescriptionItem term="ईमेल">priya@acme.in</DescriptionItem>
          <DescriptionItem term="स्थिति">
            <Badge tone="success">सक्रिय</Badge>
          </DescriptionItem>
          <DescriptionItem term="प्रबंधक" />
        </DescriptionList>
      </div>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("definition")[2]).toHaveTextContent("—सेट नहीं है");
  },
};
