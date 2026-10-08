import { FingerprintPatternIcon, MonitorSmartphoneIcon, QeetLogo } from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Callout,
  Card,
  CardContent,
  CardFooter,
  Checkbox,
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
  Label,
  Link,
  OTPInput,
  PasswordInput,
  Separator,
  Spinner,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { qx } from "../_contract";

/**
 * The hosted-login chrome every Qeet ID sign-in screen sits inside: mark, page
 * heading, card, legal footnote. Kept local to the pattern — the screen frame is
 * what product teams keep re-inventing, so it is shown rather than abstracted.
 */
function AuthScreen({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <QeetLogo aria-label="Qeet" height={36} className="dark:hidden" />
        <QeetLogo aria-label="Qeet" height={36} variant="dark" className="hidden dark:block" />
        <div className="flex flex-col gap-1">
          <Typography as="h1" variant="h4" className="font-heading">
            {title}
          </Typography>
          <Typography variant="muted">{description}</Typography>
        </div>
      </div>
      {children}
      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to the{" "}
        <Link href="#terms" size="sm">
          Qeet terms
        </Link>{" "}
        and{" "}
        <Link href="#privacy" size="sm">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}

/** The "or" rule between the passkey path and the email/password fallback. */
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">or</span>
      <Separator className="flex-1" />
    </div>
  );
}

const meta: Meta = {
  title: "Patterns/AuthenticationForm",
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component: [
          "**Sign-in to a Qeet product.** A hosted-login screen composed from `Card`, `Form`,",
          "`Field`, `PasswordInput`, `OTPInput` and `Alert` — passkey first, email + password as",
          "the fallback, with the four states a real auth screen has to render: idle, submitting,",
          "invalid input, and rejected credentials.",
          "",
          "**Use it** for `qeet-id-login`, for any product's own re-authentication step-up (Qeet Pay",
          "before a payout, Qeet People before a payroll run), and as the reference for how",
          "validation errors are surfaced: a `FormErrorSummary` at the top of the form *and* a",
          "`FieldError` on each control, never one without the other.",
          "",
          "**Do not use it** for signed-in identity UI — switching tenant, managing your own",
          "passkeys, or reviewing sessions all belong to `Patterns/AccountSettings`. Do not use it",
          "for consent/authorisation screens either: those show scopes and a client identity, which",
          "is a different pattern with different legal copy.",
          "",
          "**Accessibility notes that matter here.** The credential error is an `Alert`, so it is",
          "announced when it appears; the per-field errors are wired by `Field` (label, description",
          "and error all reach the control through generated `aria-*` ids); and `Form`'s",
          "`focusInvalidOnSubmit` moves focus to the first bad control so a keyboard user is not",
          "left at the submit button guessing.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The default Qeet ID sign-in. The passkey button is the primary action because Qeet ID is passkeys-first; the email field below it is the fallback for members whose device has no authenticator enrolled yet.",
      },
    },
  },
  render: () => (
    <AuthScreen
      title="Sign in to Qeet ID"
      description="Use a passkey, or continue with your work email."
    >
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full">
            <FingerprintPatternIcon />
            Continue with a passkey
          </Button>
          <OrDivider />
          <Form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Work email</FieldLabel>
                <FieldControl
                  render={
                    <Input
                      type="email"
                      autoComplete="username"
                      placeholder="ada.lovelace@acme.in"
                    />
                  }
                />
                <FieldDescription>
                  We&apos;ll send a one-time code if your organisation requires it.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <FormActions>
              <Button type="submit" variant="outline" className="w-full">
                Continue with email
              </Button>
            </FormActions>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <span>
            New to Qeet?{" "}
            <Link href="#signup" size="sm">
              Create an organisation
            </Link>
          </span>
        </CardFooter>
      </Card>
    </AuthScreen>
  ),
};

export const PasswordFallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The password branch, reached after an email is recognised but no passkey is registered for the device. `PasswordInput` supplies the show/hide toggle; the passkey route stays visible as a secondary button so the better credential is always one click away.",
      },
    },
  },
  render: () => (
    <AuthScreen title="Welcome back, Ada" description="ada.lovelace@acme.in · Acme Technologies">
      <Card>
        <CardContent>
          <Form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl
                  render={<PasswordInput autoComplete="current-password" placeholder="••••••••" />}
                />
              </Field>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="auth-trust-device" defaultChecked />
                  <Label htmlFor="auth-trust-device" className="text-sm font-normal">
                    Trust this device for 30 days
                  </Label>
                </div>
                <Link href="#reset" size="sm">
                  Forgot password?
                </Link>
              </div>
            </FieldGroup>
            <FormActions>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </FormActions>
          </Form>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full">
            <FingerprintPatternIcon />
            Use a passkey instead
          </Button>
        </CardContent>
      </Card>
    </AuthScreen>
  ),
};

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Client-side validation after a submit with an empty form. Every message appears twice on purpose — once in the `FormErrorSummary` (a skimmable list of links, useful when the form is long or the viewport is short) and once as a `FieldError` next to the control that caused it.",
      },
    },
  },
  render: () => {
    const [submitted, setSubmitted] = React.useState(true);
    const emailError = submitted ? "Enter the work email your organisation manages." : undefined;
    const passwordError = submitted ? "Enter your password." : undefined;

    return (
      <AuthScreen title="Sign in to Qeet ID" description="Check the highlighted fields and retry.">
        <Card>
          <CardContent>
            <Form
              noValidate
              focusInvalidOnSubmit
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <FormErrorSummary
                errors={[
                  ...(emailError ? [{ controlId: "auth-invalid-email", message: emailError }] : []),
                  ...(passwordError
                    ? [{ controlId: "auth-invalid-password", message: passwordError }]
                    : []),
                ]}
              />
              <FieldGroup>
                <Field invalid={Boolean(emailError)}>
                  <FieldLabel>Work email</FieldLabel>
                  <FieldControl
                    render={
                      <Input
                        id="auth-invalid-email"
                        type="email"
                        autoComplete="username"
                        aria-invalid={emailError != null}
                      />
                    }
                  />
                  {emailError ? <FieldError>{emailError}</FieldError> : null}
                </Field>
                <Field invalid={Boolean(passwordError)}>
                  <FieldLabel>Password</FieldLabel>
                  <FieldControl
                    render={
                      <PasswordInput
                        id="auth-invalid-password"
                        autoComplete="current-password"
                        aria-invalid={passwordError != null}
                      />
                    }
                  />
                  {passwordError ? <FieldError>{passwordError}</FieldError> : null}
                </Field>
              </FieldGroup>
              <FormActions>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </FormActions>
            </Form>
          </CardContent>
        </Card>
      </AuthScreen>
    );
  },
};

export const CredentialsRejected: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A server-side rejection. Unlike field validation this is one message about the attempt as a whole, so it belongs in an `Alert` above the form rather than on a control — and it deliberately does not say which of the two values was wrong. The remaining-attempts count comes from Qeet ID's lockout policy.",
      },
    },
  },
  render: () => (
    <AuthScreen title="Sign in to Qeet ID" description="ada.lovelace@acme.in · Acme Technologies">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Alert variant="danger">
            <AlertTitle>We couldn&apos;t sign you in</AlertTitle>
            <AlertDescription>
              That email and password combination is not recognised. 2 attempts remain before this
              account is locked for 15 minutes.
            </AlertDescription>
          </Alert>
          <Form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Work email</FieldLabel>
                <FieldControl
                  render={
                    <Input
                      type="email"
                      autoComplete="username"
                      defaultValue="ada.lovelace@acme.in"
                    />
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl render={<PasswordInput autoComplete="current-password" />} />
              </Field>
            </FieldGroup>
            <FormActions>
              <Button type="submit" className="w-full">
                Try again
              </Button>
            </FormActions>
          </Form>
        </CardContent>
      </Card>
    </AuthScreen>
  ),
};

export const Submitting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The in-flight state. Controls are disabled rather than removed so the layout does not shift, and the `Spinner` carries its own accessible label so the wait is announced instead of being a silent dead button.",
      },
    },
  },
  render: () => (
    <AuthScreen title="Sign in to Qeet ID" description="Verifying your credentials…">
      <Card>
        <CardContent>
          <Form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Work email</FieldLabel>
                <FieldControl
                  render={
                    <Input
                      type="email"
                      autoComplete="username"
                      defaultValue="ada.lovelace@acme.in"
                      disabled
                    />
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl
                  render={
                    <PasswordInput
                      autoComplete="current-password"
                      defaultValue="correct-horse-battery"
                      disabled
                    />
                  }
                />
              </Field>
            </FieldGroup>
            <FormActions>
              <Button type="submit" className="w-full" disabled>
                <Spinner size="sm" label="Signing in" className="text-current" />
                Signing in…
              </Button>
            </FormActions>
          </Form>
        </CardContent>
      </Card>
    </AuthScreen>
  ),
};

export const MfaChallenge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The second factor, shown after the password step when the tenant enforces MFA. `OTPInput` owns the six-box keyboard behaviour; the pattern's job is the surrounding copy — where the code came from, how long it lasts, and an escape hatch to a recovery code.",
      },
    },
  },
  render: () => (
    <AuthScreen
      title="Two-factor authentication"
      description="Enter the 6-digit code from your authenticator app."
    >
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel>Verification code</FieldLabel>
                <OTPInput length={6} />
                <FieldDescription>
                  Codes rotate every 30 seconds. Acme Technologies requires MFA for every admin
                  session.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <FormActions>
              <Button type="submit" className="w-full">
                Verify and continue
              </Button>
            </FormActions>
          </Form>
          <Callout variant="info" className="text-sm">
            Lost your device? Use one of the ten recovery codes issued when MFA was enabled, or ask
            an organisation owner to reset your second factor.
          </Callout>
        </CardContent>
      </Card>
    </AuthScreen>
  ),
};

export const CrossDevicePasskey: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The waiting screen while the WebAuthn ceremony runs on a phone. There is nothing to type here, so the whole card is status plus a way out — a cancel action and the password fallback. Without both, a failed hybrid transport strands the user on a screen that never resolves.",
      },
    },
  },
  render: () => (
    <AuthScreen
      title="Confirm on your phone"
      description="Scan the prompt on your other device to finish signing in."
    >
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <MonitorSmartphoneIcon size={24} />
          </span>
          <div className="flex flex-col gap-1">
            <Typography variant="small">Waiting for Ada&apos;s iPhone</Typography>
            <Typography variant="muted">
              Keep this tab open. The request expires in 2 minutes.
            </Typography>
          </div>
          <Spinner size="sm" label="Waiting for the passkey prompt" />
          <div className="flex w-full flex-col gap-2">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
            <Button variant="ghost" className="w-full">
              Use my password instead
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthScreen>
  ),
};
