import { Button, Field, FieldGroup, FieldLabel, Input } from "@qeetrix/ui";
import { SettingsLayout, SettingsSection } from "@qeetrix/ui/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Blocks/SettingsLayout",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A two-column settings page: a sticky title/description rail beside stacked `SettingsSection` cards, each with its own heading, body and footer actions. The standard pattern for account, workspace and security settings — including a conventional danger zone — across Qeet products.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <SettingsLayout title="Settings" description="Manage your account and workspace preferences.">
      <SettingsSection
        title="Profile"
        description="This information is shown to your team."
        footer={<Button size="sm">Save changes</Button>}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" defaultValue="Ada Lovelace" />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" defaultValue="ada@qeet.in" />
          </Field>
        </FieldGroup>
      </SettingsSection>

      <SettingsSection title="Danger zone" description="Irreversible and destructive actions.">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete this workspace and all of its data.
          </p>
          <Button variant="destructive" size="sm">
            Delete workspace
          </Button>
        </div>
      </SettingsSection>
    </SettingsLayout>
  ),
};
