import { ReceiptTextIcon } from "@qeetrix/icons";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  VisuallyHidden,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../_contract";

/**
 * Three loading affordances, one decision — kept in one file so the choice is
 * visible rather than re-litigated per screen.
 */
const meta: Meta = {
  title: "Recipes/LoadingStates",
  parameters: {
    qeetrix: qx({ category: "feedback", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component: [
          "**Skeleton, spinner or progress?** Pick by what you know about the wait, not by what looks",
          "nicest:",
          "",
          "- **Skeleton** — you know the *shape* of the result and the wait is short. It reserves the",
          "  final layout, so nothing jumps when data lands.",
          "- **Spinner** — you do *not* know the shape (a passkey ceremony, an upstream webhook), or the",
          "  busy region is too small for a skeleton to read as anything but noise.",
          "- **Progress** — you know how far along you are, from a real denominator. Never from a guess.",
          "",
          "The accessibility half matters as much as the visual half: a region that silently swaps",
          "placeholder for content is the single most common loading bug. Exactly one live region owns",
          'the announcement (`role="status"`), the placeholder graphics are `aria-hidden`, and the',
          "container carries `aria-busy` while the request is in flight.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const INVOICES = [
  { id: "QP-2026-0841", customer: "Ravi Textiles Pvt Ltd", gst: "₹4,320.00", total: "₹28,320.00" },
  { id: "QP-2026-0842", customer: "Neelam Logistics LLP", gst: "₹1,890.00", total: "₹12,390.00" },
  { id: "QP-2026-0843", customer: "Sundar Foods Pvt Ltd", gst: "₹9,000.00", total: "₹59,000.00" },
];

const SKELETON_ROWS = ["row-a", "row-b", "row-c"];

function InvoiceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-end">GST</TableHead>
          <TableHead className="text-end">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell className="text-end tabular-nums">{invoice.gst}</TableCell>
            <TableCell className="text-end tabular-nums">{invoice.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * The skeleton mirrors the real table: same four columns, same row height, same
 * header. That is the whole point — swap it for `<InvoiceTable />` and nothing moves.
 */
function InvoiceTableSkeleton() {
  return (
    <div role="status" aria-busy="true" className="w-full">
      <VisuallyHidden>Loading invoices for August 2026</VisuallyHidden>
      <div aria-hidden="true" className="w-full">
        <div className="flex h-10 items-center gap-4 border-b px-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        {SKELETON_ROWS.map((key) => (
          <div key={key} className="flex h-12 items-center gap-4 border-b px-3 last:border-0">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 flex-1" />
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const SkeletonForKnownShape: Story = {
  name: "Skeleton — known shape",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** you already know what the response looks like — a Qeet Pay invoice",
          "table always has four columns and roughly a page of rows — and the wait is short (under",
          "~2 s). The placeholder holds the layout open so the page does not lurch when data arrives.",
          "",
          "**Do not reach for this when** the result may be empty (a skeleton promises rows that never",
          "come — you will flash three fake rows and then an empty state), when the wait is long enough",
          "that a shimmering page starts to look broken, or when you would have to invent a shape you",
          "do not actually know.",
          "",
          "**Accessibility.** The skeleton block is `aria-hidden` — it carries no information — and the",
          'wrapper is the single `role="status"` that says *what* is loading. `aria-busy` on the same',
          "wrapper tells assistive tech the content is provisional.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Loading</CardTitle>
          <CardDescription>What the user sees while the request is in flight.</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTableSkeleton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Loaded</CardTitle>
          <CardDescription>
            Same columns, same row height — the swap costs zero layout shift.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable />
        </CardContent>
      </Card>
    </div>
  ),
};

export const SpinnerForUnknownShape: Story = {
  name: "Spinner — unknown shape",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** you cannot honestly draw the result. A Qeet ID passkey ceremony is",
          "waiting on the authenticator, not on your API: it may finish in 300 ms, it may finish when",
          "the user finds their security key, and what comes back is a redirect rather than a layout.",
          "A spinner claims nothing except *we are waiting*.",
          "",
          "**Do not reach for this when** you could have drawn a skeleton — a spinner over a region",
          "that will become a table is a missed opportunity and guarantees a layout shift. Also avoid",
          "full-page spinners on navigations that are usually instant; they add a perceived delay that",
          "was not there.",
          "",
          '**Accessibility.** `Spinner` labels itself (`role="status"` plus an accessible name), so',
          "when it sits inside a status region that already announces the wait, mark the glyph",
          "`aria-hidden` — otherwise the user hears “Loading. Waiting for your passkey.” The live",
          "region owns the announcement; the glyph is decoration.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-sm">
      <CardContent>
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <Spinner size="lg" aria-hidden="true" />
          <p className="font-heading text-sm font-medium">Waiting for your passkey…</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Touch your security key, or approve the prompt on the device you registered with Qeet
            ID.
          </p>
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="sm">
            Use a recovery code instead
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const ProgressForKnownDuration: Story = {
  name: "Progress — known denominator",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** you have a real numerator and denominator the server can vouch for.",
          "A Qeet People payroll import knows it is on record 1,360 of 2,000, so the bar is a fact and",
          "the remaining time is a reasonable inference. Long, resumable jobs earn a progress bar",
          "because it is the only affordance that answers “should I wait or come back?”.",
          "",
          "**Do not reach for this when** the percentage is invented. A bar that sprints to 90% and",
          "then sits there teaches users that your progress bars lie, and they will distrust the honest",
          "ones. If you only know the job started, use a spinner — or `Progress value={null}` for the",
          "indeterminate track, which claims motion without claiming a position.",
          "",
          "**Accessibility.** `Progress` needs an `aria-label`; the numeric detail belongs in a",
          "*separate*, coarse live region. Announce milestones (every 25%, or on phase change), never",
          "every tick — a bar that re-announces 60 times is unusable with a screen reader on.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Importing employee records</CardTitle>
        <CardDescription>august-2026-payroll.csv · Qeet People · started 14:02 IST</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress value={68} aria-label="Employee record import" />
        <div className="flex items-baseline justify-between text-sm">
          <p role="status" className="text-foreground">
            1,360 of 2,000 records imported
          </p>
          <p className="tabular-nums text-muted-foreground">68% · about 40 s left</p>
        </div>
        <p className="text-sm text-muted-foreground">
          You can close this page — the import continues on the server and you will get a Qeet
          Notify email when it finishes.
        </p>
      </CardContent>
    </Card>
  ),
};

export const BusyAction: Story = {
  name: "Busy action — scope the wait to the control",
  parameters: {
    docs: {
      description: {
        story: [
          "**Reach for this when** exactly one control started the work. Sending a Qeet Notify test",
          "message should not grey out the channel list, the sidebar, or anything the user might",
          "reasonably want to read while they wait. Scope the busy state to the button and leave the",
          "rest of the page alive.",
          "",
          "**Do not reach for this when** the result invalidates the surrounding view — if the action",
          "rewrites the list underneath it, a busy button plus stale rows is a lie. Put the loading",
          "state on whatever is about to change.",
          "",
          "**Accessibility.** A `disabled` button is removed from the tab order and its changed label",
          'is not announced, so the busy state needs its own `role="status"` line. Keep the button\'s',
          "accessible name stable (“Send test notification”) and let the status region carry the",
          "transient text — renaming a control mid-interaction is disorienting.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>#alerts-payments</CardTitle>
        <CardDescription>Slack channel · Qeet Notify · connected 12 Aug 2026</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled aria-busy="true">
            <Spinner size="sm" aria-hidden="true" />
            Send test notification
          </Button>
          <Button variant="outline">Edit routing rules</Button>
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          Sending a test notification to #alerts-payments…
        </p>
      </CardContent>
    </Card>
  ),
};

export const ChoosingBetweenThem: Story = {
  name: "Choosing between them",
  parameters: {
    docs: {
      description: {
        story: [
          "The decision compressed to one screen. Read it top to bottom and stop at the first true row:",
          "",
          "1. Do I know how far along the job is, from the server? → **Progress**.",
          "2. Do I know the shape of what will render here? → **Skeleton**.",
          "3. Otherwise → **Spinner**.",
          "",
          "Two rules that survive all three: never show a loading state for under ~200 ms (the flash is",
          "worse than the wait), and never leave one up for more than ~10 s without escalating to a",
          "message that explains what is slow and offers a way out.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Skeleton</CardTitle>
          <CardDescription>Known shape · short wait</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div role="status" aria-busy="true">
            <VisuallyHidden>Loading recent invoices</VisuallyHidden>
            <div aria-hidden="true" className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Qeet Pay invoice list, Qeet Logs event stream, Qeet People roster — anywhere the layout
            is already decided.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spinner</CardTitle>
          <CardDescription>Unknown shape · unknown length</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div role="status" className="flex h-[3.75rem] items-center justify-center">
            <Spinner aria-hidden="true" />
            <VisuallyHidden>Verifying passkey</VisuallyHidden>
          </div>
          <p className="text-sm text-muted-foreground">
            Passkey ceremonies, third-party redirects, “we asked the bank and are waiting” — results
            you cannot draw in advance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Real denominator · long job</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex h-[3.75rem] items-center">
            <Progress value={42} aria-label="Example bulk import progress" />
          </div>
          <p className="text-sm text-muted-foreground">
            Bulk imports, payroll runs, log re-indexing — jobs long enough that the user needs to
            decide whether to wait.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const EmptyAfterLoading: Story = {
  name: "The skeleton trap — empty results",
  parameters: {
    docs: {
      description: {
        story: [
          "The failure mode worth internalising. Three shimmering rows resolve into “no invoices”, and",
          "the user has been shown a promise the data could not keep. If a query can plausibly return",
          "nothing — a filtered list, a new tenant, a search — either use a spinner, or make sure the",
          "empty state that follows is a deliberate design rather than a collapse to zero height.",
          "",
          "The fix is not to remove the skeleton everywhere; it is to know which of your lists can be",
          "empty. See **Recipes/EmptyStates** for what should render on the other side of this wait.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Invoices · GSTIN 29AABCU9603R1ZJ</CardTitle>
        <CardDescription>Filtered to “overdue · &gt; ₹1,00,000”</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <InvoiceTableSkeleton />
        <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
          <ReceiptTextIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-foreground" />
          <p className="text-sm text-muted-foreground">
            …resolves to zero rows. Three fake rows, then nothing — the skeleton was the wrong tool
            for a filter that can legitimately match nothing.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
};
