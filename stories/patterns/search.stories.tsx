import { ClockIcon, KeyRoundIcon, ReceiptIcon, SearchIcon, UserIcon } from "@qeetrix/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Chip,
  DataState,
  EmptyState,
  Highlight,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  KbdGroup,
  Link,
  Typography,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect, waitFor } from "storybook/test";
import { qx } from "../_contract";

type ResultGroup = "People" | "API keys" | "Billing";

interface Result {
  id: string;
  group: ResultGroup;
  title: string;
  detail: string;
  product: string;
}

const RESULTS: Result[] = [
  {
    id: "usr_01",
    group: "People",
    title: "Ada Lovelace",
    detail: "ada.lovelace@acme.in · Owner · signed in 2 minutes ago",
    product: "Qeet ID",
  },
  {
    id: "usr_02",
    group: "People",
    title: "Adaeze Okafor",
    detail: "adaeze.okafor@acme.in · Member · invited 3 days ago",
    product: "Qeet ID",
  },
  {
    id: "emp_44",
    group: "People",
    title: "Ada Lovelace — employment record",
    detail: "EMP-0044 · Engineering · Bengaluru · joined 14 Jan 2025",
    product: "Qeet People",
  },
  {
    id: "key_7",
    group: "API keys",
    title: "ada-cli-local",
    detail: "qk_test_9f2b…41ac · created by Ada Lovelace · last used yesterday",
    product: "Qeet ID",
  },
  {
    id: "key_9",
    group: "API keys",
    title: "adapter-webhook-signing",
    detail: "qk_live_1c07…88de · rotates automatically every 90 days",
    product: "Qeet Notify",
  },
  {
    id: "inv_412",
    group: "Billing",
    title: "INV-2026-0412",
    detail: "₹1,24,500 incl. 18% GST · settled 12 Mar 2026 · raised against Ada Lovelace",
    product: "Qeet Pay",
  },
];

const GROUP_ICON = {
  People: UserIcon,
  "API keys": KeyRoundIcon,
  Billing: ReceiptIcon,
} as const;

const RECENT = [
  "status:suspended",
  "ada.lovelace@acme.in",
  "INV-2026-04",
  "product:qeet-logs level:error",
];

const GROUP_ORDER: ResultGroup[] = ["People", "API keys", "Billing"];

function matches(result: Result, query: string) {
  const haystack = `${result.title} ${result.detail} ${result.product}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function SearchField({
  value,
  onValueChange,
  ...rest
}: {
  value: string;
  onValueChange?: (next: string) => void;
  disabled?: boolean;
}) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label="Search people, API keys and invoices"
        placeholder="Search Qeet…"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        {...rest}
      />
      <InputGroupAddon align="end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}

function ResultRow({ result, query }: { result: Result; query: string }) {
  return (
    <li>
      <Link
        href={`#${result.id}`}
        variant="muted"
        underline="none"
        className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-muted/40"
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">
            <Highlight query={query}>{result.title}</Highlight>
          </span>
          <span className="truncate text-xs text-muted-foreground">
            <Highlight query={query}>{result.detail}</Highlight>
          </span>
        </span>
        <Badge variant="muted" className="shrink-0">
          {result.product}
        </Badge>
      </Link>
    </li>
  );
}

function ResultGroups({ query, results }: { query: string; results: Result[] }) {
  return (
    <div className="flex flex-col gap-4">
      {GROUP_ORDER.map((group) => {
        const rows = results.filter((result) => result.group === group);
        if (rows.length === 0) return null;
        const GroupIcon = GROUP_ICON[group];
        const headingId = `search-group-${group.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <section key={group} aria-labelledby={headingId}>
            <Typography
              as="h3"
              variant="muted"
              id={headingId}
              className="flex items-center gap-1.5 px-4 pb-1 text-xs font-medium tracking-wide uppercase"
            >
              <GroupIcon className="size-3.5" />
              {group}
            </Typography>
            <ul className="flex flex-col">
              {rows.map((result) => (
                <ResultRow key={result.id} result={result} query={query} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Hints() {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <KbdGroup>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </KbdGroup>
        to move
      </span>
      <span className="flex items-center gap-1">
        <Kbd>↵</Kbd>
        to open
      </span>
      <span className="flex items-center gap-1">
        <Kbd>Esc</Kbd>
        to dismiss
      </span>
    </span>
  );
}

function SearchPanel({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-xl">
      {children}
      <CardFooter className="justify-between">
        <Hints />
        <Link href="#advanced" size="sm">
          Advanced search
        </Link>
      </CardFooter>
    </Card>
  );
}

const meta: Meta = {
  title: "Patterns/Search",
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component: [
          "**Search across a product, with its four states.** A labelled field, grouped results with",
          "the matched substring highlighted, an idle state made of recent queries, a no-results",
          "state that suggests a way forward, and a loading state.",
          "",
          "**Use it** for the ⌘K surface in any Qeet console and for a dedicated `/search` route. The",
          "grouping is deliberate: one query crosses products — a person is a Qeet ID member *and* a",
          "Qeet People employment record — so results are grouped by kind and tagged with the",
          "product that owns them, rather than flattened into one ranked list where a member and an",
          "invoice look identical.",
          "",
          "**Do not use it** to filter a table. A table already has a search box scoped to its rows",
          "(`Patterns/DataTableToolbar`), and a global palette that quietly filters the page behind",
          "it is the most confusing version of both. Do not use it for a picker either — choosing",
          "one value to put into a form is `Combobox` or `Autocomplete`, which return a value;",
          "search *navigates*. And do not open it with fewer than ~50 searchable records.",
          "",
          "**Accessibility notes.** The field carries an `aria-label` — the magnifier is decorative",
          'and a placeholder is not a name. The result count is a `role="status"` live region so',
          "typing announces “6 results” without stealing focus. Groups are `section`s labelled by",
          "their own heading, so a screen reader can jump between “People” and “Billing”. And",
          "`Highlight` wraps matches in `<mark>`, which is emphasis on top of the text, not instead",
          "of it — the result is still readable if the highlight is not perceived.",
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
          "A query with hits in three groups. `Highlight` marks the matched substring in both the title and the supporting line, so it is obvious *why* “adapter-webhook-signing” came back for “ada”.",
      },
    },
  },
  render: () => {
    const query = "ada";
    const results = RESULTS.filter((result) => matches(result, query));
    return (
      <SearchPanel>
        <CardHeader>
          <SearchField value={query} />
        </CardHeader>
        <CardContent className="px-0">
          <p role="status" className="px-4 pb-3 text-xs text-muted-foreground">
            {results.length} results for “{query}” across Qeet ID, Qeet Notify, Qeet Pay and Qeet
            People
          </p>
          <ResultGroups query={query} results={results} />
        </CardContent>
      </SearchPanel>
    );
  },
};

export const Idle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Opened, nothing typed. Recent queries are the highest-value thing to show here — most searches are repeats — and they double as a syntax lesson: seeing `status:suspended` teaches the filter grammar better than a help link.",
      },
    },
  },
  render: () => (
    <SearchPanel>
      <CardHeader>
        <SearchField value="" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4">
        <section aria-labelledby="search-recent-heading" className="flex flex-col gap-2">
          <Typography
            as="h3"
            variant="muted"
            id="search-recent-heading"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase"
          >
            <ClockIcon className="size-3.5" />
            Recent searches
          </Typography>
          <ul className="flex flex-col gap-1">
            {RECENT.map((entry) => (
              <li key={entry}>
                <Link
                  href={`#recent-${entry}`}
                  variant="muted"
                  underline="none"
                  className="block rounded-md px-2 py-1.5 font-mono text-sm hover:bg-muted/40"
                >
                  {entry}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="search-scope-heading" className="flex flex-col gap-2">
          <Typography
            as="h3"
            variant="muted"
            id="search-scope-heading"
            className="text-xs font-medium tracking-wide uppercase"
          >
            Searching in
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Chip size="sm">Qeet ID</Chip>
            <Chip size="sm">Qeet Notify</Chip>
            <Chip size="sm">Qeet Pay</Chip>
            <Chip size="sm">Qeet People</Chip>
          </div>
        </section>
      </CardContent>
    </SearchPanel>
  ),
};

export const NoResults: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Nothing matched. The state repeats the query back, explains what search actually covers, and offers the two ways out — widen the scope, or create the thing that is missing. “No results found” on its own leaves the user unsure whether they mistyped or the record does not exist.",
      },
    },
  },
  render: () => (
    <SearchPanel>
      <CardHeader>
        <SearchField value="dorothy vaughan" />
      </CardHeader>
      <CardContent className="px-0">
        <p role="status" className="px-4 pb-1 text-xs text-muted-foreground">
          0 results for “dorothy vaughan”
        </p>
        <EmptyState
          icon={SearchIcon}
          title="Nothing matched “dorothy vaughan”"
          description="Search covers people, API keys and invoices in this tenant. Archived records and other tenants are excluded — widen the scope, or invite them."
          action={
            <>
              <Button variant="outline" size="sm">
                Include archived
              </Button>
              <Button size="sm">Invite a member</Button>
            </>
          }
        />
      </CardContent>
    </SearchPanel>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The query is in flight. The field keeps its value and stays focusable so the user can keep typing — replacing the whole panel with a spinner throws away the keystroke they were mid-way through.",
      },
    },
  },
  render: () => (
    <SearchPanel>
      <CardHeader>
        <SearchField value="ada" />
      </CardHeader>
      <CardContent className="px-0">
        <p role="status" className="px-4 text-xs text-muted-foreground">
          Searching for “ada”…
        </p>
        <DataState isLoading skeletonRows={4} skeletonHeight="h-10">
          <ResultGroups query="ada" results={RESULTS} />
        </DataState>
      </CardContent>
    </SearchPanel>
  ),
};

export const TypeToSearch: Story = {
  name: "Interaction: typing narrows the results",
  parameters: {
    docs: {
      description: {
        story:
          "Typing has to update three things together: the list, the live count, and the highlight. This types a query that narrows six records to one and asserts the count region reports it — a result list that changes while an unchanged “6 results” sits above it is a bug screen readers hit first.",
      },
    },
  },
  render: () => {
    const [query, setQuery] = React.useState("");
    const results = query.trim() === "" ? RESULTS : RESULTS.filter((r) => matches(r, query));
    return (
      <SearchPanel>
        <CardHeader>
          <SearchField value={query} onValueChange={setQuery} />
        </CardHeader>
        <CardContent className="px-0">
          <p role="status" className="px-4 pb-3 text-xs text-muted-foreground">
            {results.length} results
          </p>
          <ResultGroups query={query} results={results} />
        </CardContent>
      </SearchPanel>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const field = canvas.getByRole("searchbox", {
      name: "Search people, API keys and invoices",
    });

    await expect(canvas.getByRole("status")).toHaveTextContent("6 results");

    await userEvent.type(field, "INV-2026");

    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("1 results"));
    await expect(canvas.getByRole("link", { name: /INV-2026-0412/ })).toBeVisible();
  },
};
