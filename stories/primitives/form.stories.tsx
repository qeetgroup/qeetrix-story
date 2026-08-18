import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Form,
  FormActions,
  FormErrorSummary,
  Input,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof Form> = {
  title: "Primitives/Form",
  component: Form,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A `<form>` wrapper that provides consistent spacing between `FieldGroup` sections and a `FormActions` footer for submit/cancel controls. Used as the container for Qeet ID sign-up, passkey registration, and organization onboarding flows.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form className="w-80" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel>Work email</FieldLabel>
          <FieldControl
            render={<Input type="email" placeholder="ada.lovelace@acme.com" />}
          />
          <FieldDescription>Used to log in and receive qeet-notify alerts.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldControl render={<Input type="password" />} />
          <FieldError>Password must be at least 12 characters.</FieldError>
        </Field>
      </FieldGroup>
      <FormActions>
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit">Create account</Button>
      </FormActions>
    </Form>
  ),
};

export const ValidationSummaryAndFocus: Story = {
  render: () => {
    const [submitted, setSubmitted] = React.useState(false);
    const emailError = submitted ? "Enter a valid work email" : undefined;
    const passwordError = submitted ? "Password must be at least 12 characters" : undefined;

    return (
      <Form
        className="w-96"
        noValidate
        focusInvalidOnSubmit
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <FormErrorSummary
          errors={[
            ...(emailError ? [{ controlId: "validation-email", message: emailError }] : []),
            ...(passwordError
              ? [{ controlId: "validation-password", message: passwordError }]
              : []),
          ]}
        />
        <FieldGroup>
          <Field invalid={Boolean(emailError)}>
            <FieldLabel>Work email</FieldLabel>
            <FieldControl
              render={<Input id="validation-email" type="email" aria-invalid={emailError != null} />}
            />
            <FieldDescription>Use the address managed by your organisation.</FieldDescription>
            {emailError && <FieldError>{emailError}</FieldError>}
          </Field>
          <Field invalid={Boolean(passwordError)}>
            <FieldLabel>Password</FieldLabel>
            <FieldControl
              render={
                <Input
                  id="validation-password"
                  type="password"
                  aria-invalid={passwordError != null}
                />
              }
            />
            {passwordError && <FieldError>{passwordError}</FieldError>}
          </Field>
        </FieldGroup>
        <FormActions>
          <Button type="submit">Create account</Button>
        </FormActions>
      </Form>
    );
  },
};
