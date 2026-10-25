import { ArrowRightIcon } from "@qeetrix/icons/icons/arrow-right";
import { FingerprintPatternIcon } from "@qeetrix/icons/icons/fingerprint-pattern";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import {
  Box,
  Button,
  Checkbox,
  Field,
  Heading,
  Inline,
  Link,
  Separator,
  SkipLink,
  Stack,
  Text,
  TextField,
} from "@qeetrix/react";
import { Alert, Form, OTPInput, PasswordInput } from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, waitFor } from "storybook/test";

/**
 * A welcoming page, as qeetrix-react's sign-in tests build it: comfortable density, one 400px
 * column. The base font is set here because the library has no page-level text style.
 */
function WelcomePage({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box
      background="canvas"
      padding="xl"
      data-qx-density="comfortable"
      style={{
        minBlockSize: "100dvh",
        display: "grid",
        placeItems: "center",
        color: "var(--qx-color-text-default)",
        font: "var(--qx-typography-body-md)",
      }}
    >
      <SkipLink href="#sign-in" />
      <main id="sign-in" style={{ inlineSize: "min(400px, 100%)" }}>
        <Stack gap="xl">
          <Stack gap="xs">
            <Heading level={1} size="display-sm">
              {title}
            </Heading>
            <Text tone="subtle">{description}</Text>
          </Stack>
          {children}
        </Stack>
      </main>
    </Box>
  );
}

/** The "or" between the passkey path and the fallback. */
function Or() {
  return (
    <Inline gap="md" wrap={false}>
      <Separator decorative style={{ flex: 1 }} />
      <Text size="sm" tone="subtle">
        or
      </Text>
      <Separator decorative style={{ flex: 1 }} />
    </Inline>
  );
}

/** Field errors are worded as instructions. */
const passwordRequired = (value: unknown) => (value ? null : "Enter your password");

/** The password branch, for a device with no passkey. `rejected`: the server refused it. */
function PasswordStep({ rejected = false }: { rejected?: boolean }) {
  return (
    <WelcomePage title="Welcome back, Priya" description="priya@acme.in · Acme Pvt Ltd">
      {rejected && (
        <Alert tone="danger" title="We couldn't sign you in" announce="urgent">
          That email and password don't match. 2 attempts remain before this account is locked for
          15 minutes.
        </Alert>
      )}
      <Form aria-label="Sign in with a password" onFormSubmit={() => {}}>
        <Field label="Password" name="password" validate={passwordRequired}>
          <PasswordInput />
        </Field>
        <Inline gap="md" justify="between">
          <Checkbox label="Trust this device for 30 days" name="trust" defaultChecked />
          <Link href="#reset">Forgot password?</Link>
        </Inline>
        <Button type="submit" fullWidth size="lg">
          Sign in
        </Button>
      </Form>
      <Or />
      <Button variant="soft" icon={FingerprintPatternIcon} fullWidth size="lg">
        Use a passkey instead
      </Button>
    </WelcomePage>
  );
}

const CODE = "481726";

/** The second factor. A wrong code shows an urgent Alert and clears the slots. */
function TwoStep() {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return (
    <WelcomePage
      title="Check your authenticator"
      description="Enter the 6-digit code for priya@acme.in."
    >
      {failed && (
        <Alert tone="danger" title="That code didn't work" announce="urgent">
          Codes change every 30 seconds. Enter the newest one.
        </Alert>
      )}
      <Form
        aria-label="Two-step sign-in"
        onFormSubmit={(values) => {
          const ok = values.code === CODE;
          setFailed(!ok);
          if (!ok) setAttempt((n) => n + 1);
        }}
      >
        <Field label="Verification code" name="code" invalid={failed}>
          {/* A failed attempt clears the code: a new key remounts it empty. */}
          <OTPInput key={attempt} size="lg" />
        </Field>
        <Button type="submit" fullWidth size="lg" icon={ArrowRightIcon}>
          Verify
        </Button>
        <Link href="#recovery">Use a recovery code instead</Link>
      </Form>
    </WelcomePage>
  );
}

const meta: Meta = {
  title: "Patterns/Sign in",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 760 },
      description: { component: "Qeet ID sign-in, passkey first, with its second factor." },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Sign in",
  render: () => (
    <WelcomePage title="Sign in to Qeet" description="One account for every Qeet product.">
      <Form aria-label="Sign in" onFormSubmit={() => {}}>
        <TextField
          label="Work email"
          type="email"
          name="email"
          icon={MailIcon}
          placeholder="e.g. priya@acme.in"
          autoComplete="username webauthn"
          required
        />
        <Checkbox label="Keep me signed in" name="remember" />
        <Button type="submit" icon={FingerprintPatternIcon} fullWidth size="lg">
          Continue with passkey
        </Button>
      </Form>
      <Or />
      <Button variant="soft" icon={ArrowRightIcon} fullWidth size="lg">
        Use a password
      </Button>
      <Stack gap="xs" align="center">
        <Text size="sm">
          New to Qeet? <Link href="#sign-up">Create an account</Link>
        </Text>
        <Link href="#help" tone="subtle">
          <Text size="sm">Trouble signing in?</Text>
        </Link>
      </Stack>
    </WelcomePage>
  ),
};

export const TwoStepCode: Story = {
  name: "Two-step code",
  render: () => <TwoStep />,
};

export const CredentialsRejected: Story = {
  name: "Credentials rejected",
  render: () => <PasswordStep rejected />,
};

export const EmptyPasswordIsCaught: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: an empty password is caught",
  render: () => <PasswordStep />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    // The ErrorSummary takes focus, and its link goes to the field.
    const title = await canvas.findByText(/Fix these to continue/);
    await waitFor(() => expect(document.activeElement).toContainElement(title));
    await userEvent.click(canvas.getByRole("link", { name: "Enter your password" }));
    const password = canvas.getByLabelText("Password", { selector: "input" });
    await expect(password).toHaveFocus();
    await expect(password).toHaveAttribute("aria-invalid", "true");
  },
};

export const WrongCode: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: a wrong code fails the attempt",
  render: () => <TwoStep />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Verification code" }), "111111");
    await userEvent.click(canvas.getByRole("button", { name: "Verify" }));
    await expect(await canvas.findByRole("alert")).toHaveTextContent("That code didn't work");
    // The code is cleared and framed invalid.
    const first = canvas.getByRole("textbox", { name: "Verification code" });
    await expect(first).toHaveValue("");
    await expect(first).toHaveAttribute("aria-invalid", "true");
  },
};
