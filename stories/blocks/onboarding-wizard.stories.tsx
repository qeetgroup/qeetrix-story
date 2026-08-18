import { Field, FieldGroup, FieldLabel, Input } from "@qeetrix/ui";
import { OnboardingWizard } from "@qeetrix/ui/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof OnboardingWizard> = {
  title: "Blocks/OnboardingWizard",
  component: OnboardingWizard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A guided multi-step flow with a progress header and back / next controls. Pass an array of `steps` (label, description, content) and an `onComplete` handler — ideal for first-run setup such as creating a workspace and inviting a team in Qeet ID or qeet-people.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof OnboardingWizard>;

export const Default: Story = {
  render: () => {
    const [done, setDone] = React.useState(false);
    return (
      <div className="mx-auto max-w-2xl">
        <OnboardingWizard
          onComplete={() => setDone(true)}
          steps={[
            {
              label: "Account",
              description: "Your details",
              content: (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="w-name">Name</FieldLabel>
                    <Input id="w-name" placeholder="Ada Lovelace" />
                  </Field>
                </FieldGroup>
              ),
            },
            {
              label: "Workspace",
              description: "Name it",
              content: (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="w-org">Workspace name</FieldLabel>
                    <Input id="w-org" placeholder="Acme Inc." />
                  </Field>
                </FieldGroup>
              ),
            },
            {
              label: "Invite",
              description: "Your team",
              content: done ? (
                <p className="text-sm text-emerald-600">All set — onboarding complete!</p>
              ) : (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="w-invite">Teammate emails</FieldLabel>
                    <Input id="w-invite" placeholder="comma,separated@emails.com" />
                  </Field>
                </FieldGroup>
              ),
            },
          ]}
        />
      </div>
    );
  },
};
