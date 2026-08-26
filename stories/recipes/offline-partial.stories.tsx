import { Clock, Danger, RefreshSquare, WifiSquare } from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Banner,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  IconButton,
  PageHeader,
  Separator,
  StatusPill,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../_contract";

/**
 * The three states a networked product spends more time in than anyone plans for:
 * offline, stale, and partly broken. None of them is "loading" and none is "error".
 */
const meta: Meta = {
  title: "Recipes/OfflinePartial",
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "Most products model two network states — working and broken — and then meet reality, where",
          "the interesting states are in between. A field supervisor marking attendance on Qeet People",
          "in a basement, a Qeet Logs dashboard where one of five queries timed out, a Qeet Pay page",
          "showing numbers from six minutes ago: none of these is a loading state and none is an error",
          "page.",
          "",
          "The rule that covers all three: **degrade, never blank**. Correct-but-old data with a",
          "timestamp is more useful than a spinner, and far more useful than an empty screen. What you",
          "owe the user is an honest label on what they are looking at, and a way to find out more.",
          "",
          "Three specific mistakes worth naming:",
          "",
          "- Announcing a connection loss with a **toast**. Toasts leave; the condition does not.",
          "- Showing a stale number **without a timestamp**. Now it is just a wrong number.",
          "- Failing the **whole page** because one panel failed. You threw away four working panels.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const SHIFTS = [
  { id: "sh-1", name: "Ananya Krishnan", inAt: "09:02", outAt: "18:11", synced: true },
  { id: "sh-2", name: "Vikram Rao", inAt: "09:14", outAt: "17:58", synced: false },
  { id: "sh-3", name: "Priya Menon", inAt: "09:31", outAt: "—", synced: false },
];

export const OfflineBanner: Story = {
  name: "Offline — a banner, not a toast",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: [
          "**Reach for this when** connectivity is lost and the product can still do useful work. A",
          "banner is the right shape because the condition is *persistent*: it stays until the network",
          "returns, it does not steal focus, and it does not block the content underneath. Say three",
          "things and stop — that you are offline, what still works, and what happens to the work in",
          "progress.",
          "",
          "**Do not reach for this when** the outage is momentary or invisible to the user. A banner",
          "that flickers on every subway tunnel trains people to ignore banners. Debounce it (a few",
          "seconds) and drop it the moment the connection is back.",
          "",
          "**Never use a modal.** Blocking the UI is the one response that guarantees the user cannot",
          "do the offline-capable work you built for exactly this situation.",
          "",
          '**Accessibility.** `role="status"` (polite), never `alert` — losing signal is not urgent',
          "enough to interrupt whatever a screen-reader user is reading. Because `Banner` renders a",
          "`<section>` and spreads props, the role lands on the element that also holds the text, so",
          "the whole message is announced as one unit.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex flex-col">
      <Banner variant="warning" role="status">
        <WifiSquare aria-hidden="true" className="size-4 shrink-0" />
        <span>
          You’re offline. Attendance you record now is saved on this device and will sync
          automatically when the connection returns.
        </span>
      </Banner>
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Attendance · 26 August 2026"
          description="Qeet People · Site 4, Hosur Road · shift supervisor view"
          actions={<Button>Mark attendance</Button>}
        />
        <Card>
          <CardHeader>
            <CardTitle>Today’s shifts</CardTitle>
            <CardDescription>
              Everything below still works offline — recording, editing and reviewing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>In</TableHead>
                  <TableHead>Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SHIFTS.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.name}</TableCell>
                    <TableCell className="tabular-nums">{shift.inAt}</TableCell>
                    <TableCell className="tabular-nums">{shift.outAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const StaleData: Story = {
  name: "Stale — keep the data, date the data",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** the last successful response is still on screen and a refresh has",
          "failed or is overdue. The numbers are not wrong, they are *old* — and old numbers with a",
          "timestamp beat no numbers every time. Two elements make this honest: a visible age (“14:02",
          "· 6 minutes ago”, not “recently”) and a manual refresh the user can reach.",
          "",
          "**Do not reach for this when** acting on stale data is dangerous. A settlement balance a",
          "user is about to pay out from should refuse to be stale: block the action, do not just",
          "label the number. Staleness is a display concern until money or safety depends on it, and",
          "then it is a guard.",
          "",
          "**Never silently replace stale content with a spinner** on a background refresh. The user",
          "loses information they already had in exchange for nothing.",
          "",
          '**Accessibility.** The staleness notice is a `role="status"` region so a background refresh',
          "failure is announced without interrupting; the refresh control is a labelled `IconButton`",
          "rather than a bare glyph, because “refresh what?” is a real question when you cannot see the",
          "card it sits in.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Settlement balance</CardTitle>
        <CardDescription>Qeet Pay · account ending 4417</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-heading text-3xl font-semibold tabular-nums">₹18,42,905.00</p>
        <div
          role="status"
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <StatusPill kind="warning">Stale</StatusPill>
          <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
          <span>Last updated 14:02 IST — 6 minutes ago. Auto-refresh failed twice.</span>
          <IconButton
            icon={RefreshSquare}
            aria-label="Refresh settlement balance"
            variant="ghost"
            size="icon-sm"
          />
        </div>
        <Separator />
        <Alert variant="warning">
          <Danger aria-hidden="true" />
          <AlertTitle>Payouts are paused while this figure is stale</AlertTitle>
          <AlertDescription>
            <p>
              Qeet Pay will not schedule a payout against a balance it cannot confirm. Refresh to
              re-enable the action.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button disabled>Schedule payout</Button>
      </CardFooter>
    </Card>
  ),
};

export const PartialFailure: Story = {
  name: "Partial failure — count what’s missing",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** a page assembles independent queries and some of them failed. Report",
          "it **twice, deliberately**: once at the top as a count (“1 of 4 panels couldn’t load”), so a",
          "user scanning a dashboard knows the picture is incomplete before they draw a conclusion from",
          "it; and once in place, so they know *which* number is missing rather than which number is",
          "zero.",
          "",
          "The count is the part teams skip, and it is the part that matters. A missing panel is easy",
          "to miss on a busy dashboard — and a dashboard that quietly under-reports is worse than one",
          "that refuses to load.",
          "",
          "**Do not reach for this when** the panels are not independent. If three tiles are three",
          "views of one query, one failure means all three are wrong, and they should fail together",
          "rather than showing two plausible-looking numbers.",
          "",
          '**Accessibility.** The summary is one `role="alert"` at the top; the failed tile carries its',
          "own alert with its own retry. Working tiles stay completely silent — an aria-live region per",
          "tile turns a dashboard into a monologue.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Alert variant="warning">
        <Danger aria-hidden="true" />
        <AlertTitle>1 of 4 panels couldn’t load</AlertTitle>
        <AlertDescription>
          <p>
            Totals below exclude failed-webhook data, so the delivery rate is optimistic. The other
            three panels are complete.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications sent</CardTitle>
            <CardDescription>Qeet Notify · last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold tabular-nums">184,220</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery rate</CardTitle>
            <CardDescription>Qeet Notify · last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="font-heading text-2xl font-semibold tabular-nums">99.1%</p>
            <Badge variant="warning">Excludes webhook failures</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average latency</CardTitle>
            <CardDescription>Qeet Notify · last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-semibold tabular-nums">412 ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed webhooks</CardTitle>
            <CardDescription>Qeet Notify · last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Danger aria-hidden="true" />
              <AlertTitle>Panel unavailable</AlertTitle>
              <AlertDescription>
                <p>The webhook index is rebuilding. Expected back within 10 minutes.</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <RefreshSquare aria-hidden="true" />
                  Retry this panel
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const QueuedWrites: Story = {
  name: "Queued writes — provisional, and visibly so",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** you accept writes you have not yet persisted. Optimistic UI is the",
          "right call for a supervisor marking attendance with no signal — but the row must *look*",
          "provisional. A per-row status plus a queue count in the footer is enough: the user can see",
          "which entries are real, how many are outstanding, and that nothing has been lost.",
          "",
          "**Do not reach for this when** the write can fail for reasons the user must resolve — a",
          "duplicate invoice number, a closed payroll period. Queuing a write that will be rejected on",
          "sync just moves the error somewhere the user is no longer looking.",
          "",
          "**Never show queued writes as complete.** A green tick on an unsynced row is a lie the",
          "product will have to retract, usually at the worst moment.",
          "",
          "**Accessibility.** Per-row state is text (`StatusPill` renders its label), not colour alone;",
          'the queue total sits in a `role="status"` region so it is announced as entries are added,',
          "and the row itself stays a plain table row rather than a live region.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Attendance queue</CardTitle>
        <CardDescription>Qeet People · Site 4, Hosur Road · offline since 14:06</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>In</TableHead>
              <TableHead>Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SHIFTS.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.name}</TableCell>
                <TableCell className="tabular-nums">{shift.inAt}</TableCell>
                <TableCell className="tabular-nums">{shift.outAt}</TableCell>
                <TableCell>
                  {shift.synced ? (
                    <StatusPill kind="success">Synced</StatusPill>
                  ) : (
                    <StatusPill kind="warning">Pending sync</StatusPill>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p role="status" className="text-sm text-muted-foreground">
          2 changes queued on this device. They’ll sync automatically when you’re back online.
        </p>
        <Button variant="outline" size="sm">
          <RefreshSquare aria-hidden="true" />
          Try syncing now
        </Button>
      </CardFooter>
    </Card>
  ),
};
