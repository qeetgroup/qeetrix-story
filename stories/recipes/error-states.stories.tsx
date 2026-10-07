import { ArrowLeftIcon, CloudOffIcon, RefreshCwIcon, TriangleAlertIcon } from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
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
import { qx } from "../_contract";

/**
 * Errors sorted by blast radius: the field, the section, the page. Picking the
 * wrong size is what turns one failed widget into a blank screen.
 */
const meta: Meta = {
  title: "Recipes/ErrorStates",
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "**Size the error to the damage.** One question decides the treatment: *how much of this",
          "page is still trustworthy?*",
          "",
          "- **The field is wrong** → an inline `FieldError` next to the control. Everything else works.",
          "- **One section failed** → an `Alert` inside that section, with a retry that retries only it.",
          "- **The route failed** → a full-page error with a correlation id and a way out.",
          "",
          "Two things every error owes the user regardless of size: **what to do next** (retry, fix,",
          "leave) and **something to quote** if the answer is “contact support”. A message that says",
          "only “Something went wrong” fails both tests.",
          "",
          '**Accessibility.** `Alert`, `FieldError` and `FormErrorSummary` already carry `role="alert"`',
          "— so do not add another one around them, or the message is announced twice. Never wrap the",
          "whole page in a live region “just in case”: a live region that contains the entire route",
          "re-reads the route.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const InlineFieldError: Story = {
  name: "Inline — the field",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the user can fix the problem without leaving the control. A GSTIN",
          "with 14 characters instead of 15 is a typo, and the only useful place to say so is beside",
          "the input. Say what is wrong *and* what right looks like — “Enter a 15-character GSTIN”",
          "beats “Invalid GSTIN”, which merely repeats that the form is unhappy.",
          "",
          "**Do not reach for this when** the failure is not the user's: a 500 from the GST validation",
          "service is not a field error, and dressing it as one tells the user to fix something they",
          "cannot. That belongs one level up, as a section error on the form.",
          "",
          "**Accessibility.** `Field` wires `aria-describedby` and `aria-errormessage` from the control",
          'to `FieldError` automatically, and `FieldError` is a `role="alert"`, so a message appearing',
          "after blur is announced. Set `aria-invalid` on the input — colour alone is not a state.",
          "",
          "**Never move a field error into a toast.** It disappears, it is nowhere near the control,",
          "and it is unreachable once dismissed.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Billing identity</CardTitle>
        <CardDescription>Qeet Pay · used on every GST invoice you issue.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field invalid>
            <FieldLabel>GSTIN</FieldLabel>
            <FieldControl
              render={
                <Input
                  defaultValue="29AABCU9603R1Z"
                  aria-invalid
                  autoComplete="off"
                  className="font-mono"
                />
              }
            />
            <FieldDescription>
              15 characters: 2 state digits, 10-character PAN, 3 more.
            </FieldDescription>
            <FieldError>
              Enter a 15-character GSTIN — this one has 14. Check the last character on your
              registration certificate.
            </FieldError>
          </Field>
          <Field>
            <FieldLabel>Registered legal name</FieldLabel>
            <FieldControl render={<Input defaultValue="Ravi Textiles Private Limited" />} />
            <FieldDescription>Must match the name on the GST certificate exactly.</FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  ),
};

export const SectionError: Story = {
  name: "Section — one panel failed",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** one region of a working page could not load. The Qeet Logs overview",
          "renders four panels from four queries; when the aggregation service times out, exactly one",
          "panel should say so. The rest of the page keeps its data, the user keeps their scroll",
          "position, and the retry re-runs one query rather than remounting the route.",
          "",
          "**Do not reach for this when** the failed section is the reason the page exists — an error",
          "card floating in an otherwise empty route is a full-page error with extra steps.",
          "",
          '**Accessibility.** `Alert` is already `role="alert"`; put the retry control *inside* it so',
          "the announcement and the remedy are one region rather than two. Keep the panel's heading",
          "visible — a screen-reader user landing on the alert needs to know which panel failed, and",
          "“Top error sources” in the card header is what tells them.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Events ingested</CardTitle>
          <CardDescription>Qeet Logs · last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-3xl font-semibold tabular-nums">12,481,903</p>
          <p className="text-sm text-muted-foreground">+4.2% vs. previous day</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top error sources</CardTitle>
          <CardDescription>Qeet Logs · last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <TriangleAlertIcon aria-hidden="true" />
            <AlertTitle>Couldn’t load error sources</AlertTitle>
            <AlertDescription>
              <p>The aggregation service timed out after 10 s. Other panels are unaffected.</p>
              <Button variant="outline" size="sm" className="mt-3">
                <RefreshCwIcon aria-hidden="true" />
                Retry this panel
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FullPageError: Story = {
  name: "Full page — nothing is trustworthy",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the request that makes the route meaningful failed, so there is",
          "nothing honest left to render. Four things belong here and nothing else: a plain-language",
          "cause, a retry, a way out that is not the browser back button, and a **correlation id**.",
          "The id is the whole reason this state is not a shrug — it turns “it broke” into a Qeet Logs",
          "query, and it is the only part of the screen a support engineer will ask for.",
          "",
          "**Do not reach for this when** part of the page loaded. Blanking a working sidebar and a",
          "loaded header because one query failed throws away context the user was relying on — see",
          "the section variant above.",
          "",
          "**Never show a stack trace.** It leaks internals, it is unreadable, and the id is strictly",
          "more useful to everyone involved.",
          "",
          "**Accessibility.** Because this replaces the route's content rather than annotating it, the",
          'container is the `role="alert"` — one region, announced once, containing both the',
          "explanation and the actions.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div role="alert" className="mx-auto max-w-xl">
      <EmptyState
        icon={CloudOffIcon}
        title="We couldn’t load your organisation"
        description="Qeet ID is reachable but returned an error for acme-prod. Your data is safe — this page just can’t show it right now."
        action={
          <>
            <Button>
              <RefreshCwIcon aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline">
              <ArrowLeftIcon aria-hidden="true" />
              Back to dashboard
            </Button>
          </>
        }
      />
      <p className="text-center text-sm text-muted-foreground">
        Quote this if you contact support:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          req_01K4V8N2QF7Z
        </code>
      </p>
    </div>
  ),
};

export const RetryThatEscalates: Story = {
  name: "Retry — and what happens when it keeps failing",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the failure might be transient — which is most of them. A retry",
          "button is cheap and resolves the majority of network blips without a support ticket.",
          "",
          "**But a retry button that never changes is a trap.** Press it three times against a hard",
          "outage and the product has said nothing new while implying the user is doing it wrong.",
          "Escalate: after the second or third attempt, change the copy to admit the problem is not",
          "going away, and swap the primary action from *retry* to *route out* — a status page, a",
          "support contact, the correlation id.",
          "",
          "**Do not reach for this when** the operation is not idempotent. “Retry” on a payment capture",
          "or an invoice submission must go through the same idempotency key as the original request,",
          "or the button is a double-charge waiting to happen.",
          "",
          '**Accessibility.** The failure stays inside one `role="alert"` that updates in place, so',
          "each new attempt is re-announced without a second region appearing. Keep the button's",
          "accessible name stable across attempts — the attempt count belongs in the message, not in",
          'the control\'s name. The in-flight moment between press and answer is a `role="status"`; see',
          "**Recipes/LoadingStates → Busy action**.",
          "",
          "*Try it: press “Try again”. The third failure changes both the copy and the actions.*",
        ].join("\n"),
      },
    },
  },
  render: () => {
    const [attempts, setAttempts] = React.useState(1);
    const exhausted = attempts >= 3;

    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Payout schedule</CardTitle>
          <CardDescription>Qeet Pay · settlement account ending 4417</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Alert variant="destructive">
            <TriangleAlertIcon aria-hidden="true" />
            <AlertTitle>
              {exhausted ? "Still failing — this one is on us" : "Couldn’t load payout schedule"}
            </AlertTitle>
            <AlertDescription>
              {exhausted ? (
                <p>
                  Three attempts, three failures. The settlement service looks genuinely down rather
                  than flaky — retrying again is unlikely to help.
                </p>
              ) : (
                <p>
                  The settlement service did not respond in time. This is usually temporary.
                  {attempts > 1 ? ` Failed ${attempts} times so far.` : null}
                </p>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
          {exhausted ? (
            <>
              <Button>Check Qeet status page</Button>
              <Button variant="outline">Contact support</Button>
            </>
          ) : (
            <Button onClick={() => setAttempts((n) => n + 1)}>
              <RefreshCwIcon aria-hidden="true" />
              Try again
            </Button>
          )}
          <p className="w-full text-xs text-muted-foreground">
            Correlation id: <code className="font-mono text-foreground">req_01K4V8N2QF7Z</code>
          </p>
        </CardFooter>
      </Card>
    );
  },
};

export const SubmitTimeErrors: Story = {
  name: "Submit time — summary plus inline",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** a submit is rejected with more than one problem. You need *both*",
          "treatments and they do different jobs: the summary at the top of the form answers “how bad",
          "is it and where do I start?”, and the inline errors answer “what is wrong with *this*",
          "field?”. Shipping only the summary makes the user hunt; shipping only inline errors hides",
          "the count and, on a long form, hides the errors themselves below the fold.",
          "",
          "**Do not reach for this when** there is one error and it is visible on screen — a summary",
          "for a single visible field is ceremony.",
          "",
          "**Accessibility.** `FormErrorSummary` renders links to each invalid control, so the summary",
          "is a navigation aid rather than a recap. `focusInvalidOnSubmit` on `Form` moves focus to the",
          "first invalid control after the submit handler runs, which is what makes a keyboard-only",
          "submit recoverable. Validate on submit and on blur — validating on every keystroke announces",
          "an error while the user is still mid-word.",
          "",
          "*Try it: press “Save employee” with the fields as they are.*",
        ].join("\n"),
      },
    },
  },
  render: () => {
    const [submitted, setSubmitted] = React.useState(false);
    const panError = submitted ? "Enter a 10-character PAN, e.g. AABCU9603R." : undefined;
    const uanError = submitted ? "UAN must be 12 digits — this one has 11." : undefined;

    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Add employee</CardTitle>
          <CardDescription>
            Qeet People · statutory details are required for payroll.
          </CardDescription>
        </CardHeader>
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
                ...(panError ? [{ controlId: "employee-pan", message: panError }] : []),
                ...(uanError ? [{ controlId: "employee-uan", message: uanError }] : []),
              ]}
            />
            <FieldGroup>
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <FieldControl render={<Input defaultValue="Ananya Krishnan" />} />
              </Field>
              <Field invalid={Boolean(panError)}>
                <FieldLabel>PAN</FieldLabel>
                <FieldControl
                  render={
                    <Input
                      id="employee-pan"
                      defaultValue="AABCU9603"
                      aria-invalid={panError != null}
                      autoComplete="off"
                      className="font-mono"
                    />
                  }
                />
                <FieldDescription>
                  Permanent Account Number, as issued by the IT department.
                </FieldDescription>
                {panError ? <FieldError>{panError}</FieldError> : null}
              </Field>
              <Field invalid={Boolean(uanError)}>
                <FieldLabel>UAN</FieldLabel>
                <FieldControl
                  render={
                    <Input
                      id="employee-uan"
                      defaultValue="10123456789"
                      aria-invalid={uanError != null}
                      autoComplete="off"
                      className="font-mono"
                    />
                  }
                />
                <FieldDescription>Universal Account Number for EPF contributions.</FieldDescription>
                {uanError ? <FieldError>{uanError}</FieldError> : null}
              </Field>
            </FieldGroup>
            <FormActions>
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save employee</Button>
            </FormActions>
          </Form>
        </CardContent>
      </Card>
    );
  },
};
