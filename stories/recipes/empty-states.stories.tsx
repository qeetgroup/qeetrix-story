import { Add, ClipboardTick, FilterRemove, Notification, SearchNormal } from "@qeetrix/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Field,
  FieldControl,
  FieldLabel,
  Input,
  Link,
  Separator,
  VisuallyHidden,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../_contract";

/**
 * Three states that render almost identically and mean entirely different things.
 * Told apart by what the user did to get here, not by what the list contains.
 */
const meta: Meta = {
  title: "Recipes/EmptyStates",
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "“No rows” is not one state. It is at least three, and they need different copy, different",
          "actions and different tone:",
          "",
          "| | The user has… | Tone | Primary action |",
          "| --- | --- | --- | --- |",
          "| **First run** | never had data here | teaching | create the first one |",
          "| **No results** | asked a question with no answer | corrective | undo the filter |",
          "| **Cleared** | finished the work | congratulatory | *none* |",
          "",
          "Shipping the wrong one is how a product ends up telling a payroll manager to “Create your",
          "first leave request!” on a queue she has just finished approving. The test is simple: would",
          "this copy still be true if the list had 400 rows yesterday?",
          "",
          "All three build on the `EmptyState` primitive — the difference is entirely in what you pass",
          "to `title`, `description` and `action`.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const FirstRun: Story = {
  name: "First run — never had data",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the surface has genuinely never held data for this tenant. This is",
          "the one empty state that earns a prominent call to action and explanatory copy: the user",
          "does not yet know what a Qeet Notify channel *is*, so the empty state is the documentation.",
          "Pair the primary action with a low-commitment second option (docs, a sample, an import) for",
          "people who are evaluating rather than building.",
          "",
          "**Do not reach for this when** the list is empty because of a filter, a search, or work the",
          "user just completed. Onboarding copy shown to an experienced user reads as a product that",
          "does not know who it is talking to — and “Add your first channel” on a filtered view is",
          "simply false.",
          "",
          "**Accessibility.** Nothing exotic here, and that is the point: real heading text in `title`,",
          'a real `<button>` in `action`, and no `role="status"` — a first-run state is the page\'s',
          "content, not an update to it.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Channels</CardTitle>
        <CardDescription>
          Where Qeet Notify delivers alerts for the <strong>acme-prod</strong> workspace.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <EmptyState
          icon={Notification}
          title="No channels yet"
          description="A channel is a destination — email, SMS, Slack or a webhook. Add one and Qeet Notify will start routing alerts to it within a minute."
          action={
            <>
              <Button>
                <Add aria-hidden="true" />
                Add channel
              </Button>
              <Button variant="outline">Import from Slack</Button>
            </>
          }
        >
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure where to start? <Link href="#channel-setup-guide">Read the setup guide</Link>.
          </p>
        </EmptyState>
      </CardContent>
    </Card>
  ),
};

export const NoResults: Story = {
  name: "No results — the query matched nothing",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** data exists but the user's question excluded all of it. Three rules",
          "make the difference between a helpful and an infuriating version:",
          "",
          "1. **Keep the controls on screen.** The search box and the active filters stay exactly where",
          "   they were — removing them strands the user with no way to change the question.",
          '2. **Echo the query verbatim.** Seeing `"qeet-pay-prod"` quoted back is how a user spots',
          "   their own typo without re-reading the input.",
          "3. **The action undoes, it does not create.** “Clear filters”, not “Create log stream”.",
          "",
          "**Do not reach for this when** the filter is a default the user never chose — that is a",
          "first-run state wearing a filter's clothes, and the fix is to widen the default, not to",
          "explain the empty result.",
          "",
          '**Accessibility.** The result count lives in a `role="status"` region so a screen-reader',
          "user learns the search returned nothing without moving focus. The search input keeps a real",
          "`<label>` — a magnifying-glass placeholder is not a label.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Log streams</CardTitle>
        <CardDescription>Qeet Logs · acme-prod · last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <Field className="flex-1 basis-56">
            <FieldLabel>Search streams</FieldLabel>
            <FieldControl
              render={<Input type="search" defaultValue="qeet-pay-prod" autoComplete="off" />}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <Badge variant="secondary">severity: error</Badge>
            <Badge variant="secondary">region: ap-south-1</Badge>
            <Button variant="outline" size="sm">
              <FilterRemove aria-hidden="true" />
              Clear filters
            </Button>
          </div>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          0 of 47 streams match your filters.
        </p>
        <EmptyState
          icon={SearchNormal}
          title="No streams match “qeet-pay-prod”"
          description="47 streams exist in this workspace, but none of them match this search combined with severity “error” in ap-south-1. Try a shorter term, or drop one filter."
          action={
            <Button variant="outline">
              <FilterRemove aria-hidden="true" />
              Clear all filters
            </Button>
          }
        />
      </CardContent>
    </Card>
  ),
};

export const Cleared: Story = {
  name: "Cleared — the work is done",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the list is empty because the user emptied it. An approvals queue at",
          "zero is an achievement, and the state should say so and then get out of the way. There is no",
          "primary action, because the correct next step is to leave — offer at most a quiet route to",
          "history or to the thing they would naturally do next.",
          "",
          "**Do not reach for this when** you cannot tell the difference between “cleared” and “never",
          "had any”. If the backend does not tell you whether the queue was ever non-empty, do not",
          "guess: a congratulatory message shown to a brand-new tenant is worse than a neutral one.",
          "The cheapest signal is usually a lifetime count on the collection.",
          "",
          "**Accessibility.** When the last item disappears in response to a user action, the",
          'transition needs announcing — the visible congratulation goes in a `role="status"` region',
          "so it is spoken rather than silently replacing the row that was just approved.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Leave approvals</CardTitle>
        <CardDescription>Qeet People · Engineering · you are the approver</CardDescription>
      </CardHeader>
      <CardContent>
        <div role="status">
          <EmptyState
            icon={ClipboardTick}
            title="All caught up"
            description="You approved the last 6 requests this morning. Nothing is waiting on you."
            action={
              <Button variant="ghost">
                <ClipboardTick aria-hidden="true" />
                View approval history
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  ),
};

export const SideBySide: Story = {
  name: "Side by side",
  parameters: {
    docs: {
      description: {
        story: [
          "The same component, the same list, three different truths. Read left to right and notice",
          "that the *only* thing that changes is copy and action — which is exactly why these get",
          "confused in code review, and exactly why the distinction is worth naming in the ticket.",
          "",
          "A useful shorthand when you are wiring a list up:",
          "",
          "```ts",
          "if (isFiltered) return <NoResults />;      // the query is the cause",
          "if (lifetimeCount === 0) return <FirstRun />; // never had data",
          "return <Cleared />;                        // had data, now doesn't",
          "```",
          "",
          "Order matters: check the filter first, because a filtered view of a brand-new tenant is",
          "still a no-results state, not an onboarding moment.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>First run</CardTitle>
          <CardDescription>Teach, then invite.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Notification}
            title="No channels yet"
            description="Add a destination and Qeet Notify starts routing alerts to it."
            action={
              <Button size="sm">
                <Add aria-hidden="true" />
                Add channel
              </Button>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No results</CardTitle>
          <CardDescription>Correct, then offer an undo.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={SearchNormal}
            title="No matches for “qeet-pay-prod”"
            description="47 streams exist — none match this search with these filters."
            action={
              <Button size="sm" variant="outline">
                <FilterRemove aria-hidden="true" />
                Clear filters
              </Button>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cleared</CardTitle>
          <CardDescription>Acknowledge, then step aside.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ClipboardTick}
            title="All caught up"
            description="You approved the last 6 requests this morning."
          />
        </CardContent>
      </Card>
    </div>
  ),
};

export const InsideACompactList: Story = {
  name: "Compact placement",
  parameters: {
    docs: {
      description: {
        story: [
          "Not every empty state deserves a full panel. Inside a sidebar, a popover, or a dashboard",
          "tile, the centred icon-and-title treatment eats the whole surface and reads as an error.",
          "Drop the icon, drop the action, and let one muted line do the work — the surrounding chrome",
          "already says what the list is.",
          "",
          "**Do not reach for this when** the empty list is the main content of the page. A compact",
          "line in the middle of an otherwise blank route looks like a rendering failure, which is the",
          "opposite of reassuring.",
          "",
          "**Accessibility.** Even a one-liner needs to be announced when it replaces content the user",
          'just changed, so the compact variant keeps its `role="status"` region. The visually hidden',
          "text names the list, because “None” on its own tells a screen-reader user nothing.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent sign-ins</CardTitle>
          <CardDescription>Qeet ID · last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p role="status" className="py-6 text-center text-sm text-muted-foreground">
            <VisuallyHidden>Recent sign-ins: </VisuallyHidden>
            No sign-ins in this period.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expiring API keys</CardTitle>
          <CardDescription>Qeet ID · next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p role="status" className="py-6 text-center text-sm text-muted-foreground">
            <VisuallyHidden>Expiring API keys: </VisuallyHidden>
            None expiring soon.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};
