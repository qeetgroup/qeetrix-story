/// <reference types="vite/client" />
/**
 * The data behind Components/Overview. The component list comes from the package's exports
 * (every PascalCase function; a part joins its family by name, `DialogTrigger` → `Dialog`), and
 * each family's link from the component stories' own meta. Only the previews are written here.
 */
import { CopyIcon } from "@qeetrix/icons/icons/copy";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { TrashIcon } from "@qeetrix/icons/icons/trash";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import * as Stable from "@qeetrix/react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Field,
  Fieldset,
  Grid,
  Heading,
  IconButton,
  Inline,
  Input,
  Link,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Meter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PortalContainer,
  Progress,
  QeetrixProvider,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Skeleton,
  SkipLink,
  Slider,
  Spinner,
  Stack,
  Switch,
  Tab,
  Table,
  Tabs,
  TabsList,
  Text,
  Textarea,
  TextField,
  ToastProvider,
  Toggle,
  ToggleGroup,
  Tooltip,
  useToast,
  VisuallyHidden,
} from "@qeetrix/react";
import * as Experimental from "@qeetrix/react/experimental";
import {
  Alert,
  AppShell,
  AvatarGroup,
  AvatarItem,
  BarList,
  Breadcrumb,
  BreadcrumbItem,
  Calendar,
  ChartLegend,
  ChartTooltip,
  CheckItem,
  CheckList,
  Chip,
  ChipGroup,
  CodeBlock,
  CodeField,
  ColorField,
  ColorSwatchGroup,
  ColumnChart,
  Combobox,
  CommandPalette,
  Composer,
  Conversation,
  CopyButton,
  CopyField,
  DataState,
  DatePicker,
  DateRangePicker,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  ErrorSummary,
  FileUpload,
  FilterTags,
  FloatingPanel,
  Form,
  GraphCanvas,
  InstructionList,
  InstructionStep,
  Kbd,
  MultiEmailField,
  NumberField,
  OTPInput,
  PageHeader,
  Pagination,
  PasswordInput,
  ProportionalCircles,
  ProviderButton,
  ProviderButtonGroup,
  QRCode,
  RangeCalendar,
  RelativeTime,
  SearchField,
  ShareBar,
  ShowMore,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SiteHeader,
  SiteNav,
  SiteNavItem,
  SpanChart,
  Sparkline,
  Stat,
  StateRuler,
  StateRulerItem,
  StatGroup,
  Steps,
  ThemeSwitcher,
  Timeline,
  TimelineGroup,
  TimelineItem,
  Toolbar,
  ToolbarButton,
  TopBar,
  TopBarSearch,
  TopBarSwitcher,
  Treemap,
  TreeView,
  Turn,
  Workspace,
  WorkspaceMain,
  WorkspacePane,
} from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { ReactNode } from "react";
import { toId } from "storybook/internal/csf";

/* ── 1. The components, from the package's exports ───────────────────────────────────────────── */

export type Status = "stable" | "experimental";

export interface Family {
  /** The family's main component, e.g. `Dialog`. */
  name: string;
  /** Its other exported parts, e.g. `DialogTrigger`, `DialogContent`. */
  parts: string[];
  status: Status;
}

/** Parts whose names don't start with their family's, and a name that does but isn't a part. */
const FAMILY_OF: Record<string, string | null> = {
  Tab: "Tabs",
  // The same MenuContent and items, opened at the pointer.
  ContextMenu: "Menu",
  DescriptionItem: "DescriptionList",
  PageContent: "PageHeader",
  // `TextField` starts with `Text`, but it's Field + Input, its own component.
  TextField: null,
};

const isComponent = ([name, value]: [string, unknown]) =>
  /^[A-Z]/.test(name) && typeof value === "function";

/** Group one entry point's components into families. */
function familiesOf(entry: Record<string, unknown>, status: Status): Family[] {
  const names = Object.entries(entry)
    .filter(isComponent)
    .map(([name]) => name)
    .sort();
  /** The longest other component name this one extends: `MenuSubmenuTrigger` → `MenuSubmenu`. */
  const parentOf = (name: string): string | undefined => {
    if (name in FAMILY_OF) return FAMILY_OF[name] ?? undefined;
    return names
      .filter(
        (other) =>
          other !== name && name.startsWith(other) && /[A-Z]/.test(name[other.length] ?? ""),
      )
      .sort((a, b) => b.length - a.length)[0];
  };
  const rootOf = (name: string): string => {
    const parent = parentOf(name);
    return parent ? rootOf(parent) : name;
  };
  const families = new Map<string, Family>();
  for (const name of names) {
    const root = rootOf(name);
    const family = families.get(root) ?? { name: root, parts: [], status };
    if (root !== name) family.parts.push(name);
    families.set(root, family);
  }
  return [...families.values()];
}

export const FAMILIES: Family[] = [
  ...familiesOf(Stable, "stable"),
  ...familiesOf(Experimental, "experimental"),
];

/* ── 2. The links, from the component stories ────────────────────────────────────────────────── */

/** The stories' sources, read as text: nothing in them runs here. */
const SOURCES = import.meta.glob<string>("../components/**/*.stories.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

interface StoryEntry {
  title: string;
  /** The meta's `component` and `subcomponents`. */
  components: string[];
}

/** A story's meta, read from its source: the `Components/…` title, then its component(s). */
function readMeta(source: string): StoryEntry | null {
  const title = source.match(/\btitle:\s*"(Components\/[^"]+)"/);
  if (!title?.[1]) return null;
  const rest = source.slice(title.index);
  const component = rest.match(/\n\s+component:\s*([A-Z]\w*)/)?.[1];
  const subcomponents = rest.match(/\n\s+subcomponents:\s*\{([^}]*)\}/)?.[1] ?? "";
  return {
    title: title[1],
    components: [
      ...(component ? [component] : []),
      ...[...subcomponents.matchAll(/([A-Z]\w*)\s*(?:[,:}]|$)/g)].map((m) => m[1] as string),
    ],
  };
}

const STORIES = Object.values(SOURCES)
  .map(readMeta)
  .filter((entry): entry is StoryEntry => entry !== null);

/** The story that documents a family: one whose component, or a subcomponent, is a member. */
export function storyFor(family: Family): StoryEntry | undefined {
  const members = [family.name, ...family.parts];
  return (
    members.map((name) => STORIES.find((story) => story.components.includes(name))).find(Boolean) ??
    // A composite story with no `component`: matched by its title, e.g. "…/Sidebar".
    STORIES.find((story) =>
      members.includes(story.title.split("/").pop()?.replace(/\s/g, "") ?? ""),
    )
  );
}

/**
 * The story's docs page, as a link that opens in the workshop around this preview. Relative, so
 * it works from the dev server and from a static build in a subfolder alike.
 */
export const storyHref = (title: string) => `./?path=/docs/${toId(title, "docs")}`;

/* ── 3. The previews, one per family ─────────────────────────────────────────────────────────── */

export interface Preview {
  render: () => ReactNode;
  /**
   * Shrink a large component to fit the tile, laid out at `width` first. Previews are pictures:
   * they're inert and hidden from assistive technology, since each component's own story is
   * where it's used and tested.
   */
  zoom?: number;
  width?: number;
  height?: number;
}

const NOW_TREND = [1080, 1094, 1110, 1121, 1139, 1150, 1172, 1190, 1205, 1231, 1246, 1284];
const PEOPLE = [
  { name: "Priya Sharma" },
  { name: "Rahul Verma" },
  { name: "Ananya Iyer" },
  { name: "Karthik Reddy" },
  { name: "Meera Nair" },
];
const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];
const SECRET = "qs_live_9f2c7d1e4b8a6c3f";

function ToastDemo() {
  const toast = useToast();
  return (
    <Button
      variant="soft"
      onClick={() => toast.add({ title: "Invitation sent", description: "to rahul.verma@acme.in" })}
    >
      Send invitation
    </Button>
  );
}

function MiniTopBar() {
  return (
    <TopBar
      product="Qeet ID"
      href="#home"
      context={
        <>
          <TopBarSwitcher mark="AC" label="Acme Pvt Ltd" />
          <TopBarSwitcher status="success" label="Production" />
        </>
      }
      search={<TopBarSearch placeholder="Search or jump to…" shortcut={["⌘", "K"]} />}
      account={<Avatar name="Priya Sharma" size="sm" />}
    />
  );
}

function MiniSidebar() {
  return (
    <Sidebar label="Qeet ID">
      <SidebarGroup label="Directory">
        <SidebarItem label="Users" href="#users" icon={UsersIcon} badge="1,284" current />
        <SidebarItem label="Groups" href="#groups" badge="38" />
      </SidebarGroup>
    </Sidebar>
  );
}

function MiniPageHeader() {
  return (
    <PageHeader
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem href="#directory">Directory</BreadcrumbItem>
          <BreadcrumbItem current>Users</BreadcrumbItem>
        </Breadcrumb>
      }
      title="Users"
      count={1284}
      description="People who can sign in to Acme Pvt Ltd's applications."
      actions={<Button icon={PlusIcon}>Invite users</Button>}
      summary={
        <StatGroup>
          <Stat label="Total users" value={1284} note="+38 this week" tone="positive" />
          <Stat label="Passkey adoption" value="72%" note="+6 pts this month" tone="positive" />
          <Stat label="Pending invitations" value={64} note="9 expire this week" tone="warning" />
        </StatGroup>
      }
    />
  );
}

export const PREVIEWS: Record<string, Preview> = {
  /* Stable */
  Accordion: {
    width: 260,
    render: () => (
      <Accordion defaultValue={["sso"]}>
        <AccordionItem value="sso" title="Enterprise SSO">
          <Text size="sm">SAML and OIDC connections.</Text>
        </AccordionItem>
        <AccordionItem value="scim" title="Directory sync">
          <Text size="sm">SCIM from Azure AD.</Text>
        </AccordionItem>
      </Accordion>
    ),
  },
  Avatar: {
    render: () => (
      <Inline gap="sm">
        <Avatar name="Priya Sharma" size="sm" />
        <Avatar name="Rahul Verma" />
        <Avatar name="Ananya Iyer" size="lg" />
        <Avatar name="Acme Pvt Ltd" shape="square" size="lg" />
      </Inline>
    ),
  },
  Badge: {
    render: () => (
      <Inline gap="xs">
        <Badge tone="success">Active</Badge>
        <Badge tone="info">Invited</Badge>
        <Badge tone="danger" variant="solid">
          Blocked
        </Badge>
      </Inline>
    ),
  },
  Box: {
    render: () => (
      <Box padding="md" background="sunken" border="subtle" radius="surface">
        <Text size="sm">Acme Pvt Ltd · Enterprise plan</Text>
      </Box>
    ),
  },
  Button: {
    render: () => (
      <Inline gap="sm">
        <Button icon={PlusIcon}>Invite users</Button>
        <Button variant="soft">Export</Button>
      </Inline>
    ),
  },
  Card: {
    width: 260,
    render: () => (
      <Card
        title="Acme Pvt Ltd"
        level={4}
        description="Enterprise plan · ap-south-1"
        variant="subdued"
      >
        <Text size="sm">1,284 users · 12 applications</Text>
      </Card>
    ),
  },
  Checkbox: {
    render: () => (
      <CheckboxGroup label="Email me about" defaultValue={["security"]}>
        <Checkbox value="security" label="Security alerts" />
        <Checkbox value="product" label="Product updates" />
      </CheckboxGroup>
    ),
  },
  Collapsible: {
    width: 260,
    render: () => (
      <Collapsible defaultOpen>
        <CollapsibleTrigger render={<Button variant="ghost">Hide advanced settings</Button>} />
        <CollapsiblePanel>
          <Text size="sm">Token lifetime: 60 minutes</Text>
        </CollapsiblePanel>
      </Collapsible>
    ),
  },
  Dialog: {
    render: () => (
      <Dialog intent="danger">
        <DialogTrigger render={<Button variant="soft" tone="danger" icon={TrashIcon} />}>
          Delete user…
        </DialogTrigger>
        <DialogContent title="Delete Priya Sharma?">Their sessions end at once.</DialogContent>
      </Dialog>
    ),
  },
  Drawer: {
    render: () => (
      <Drawer>
        <DrawerTrigger render={<Button variant="soft" />}>Edit user</DrawerTrigger>
        <DrawerContent title="Priya Sharma">priya@acme.in</DrawerContent>
      </Drawer>
    ),
  },
  Field: {
    width: 260,
    render: () => (
      <Field label="Redirect URI" description="Must start with https://">
        <Input defaultValue="https://hr.acme.in/callback" />
      </Field>
    ),
  },
  Fieldset: {
    width: 260,
    render: () => (
      <Fieldset legend="Billing address">
        <TextField label="City" defaultValue="Bengaluru" />
      </Fieldset>
    ),
  },
  Grid: {
    width: 240,
    render: () => (
      <Grid columns={3} gap="xs">
        {["Users", "Groups", "Roles", "Apps", "Keys", "Logs"].map((label) => (
          <Box key={label} padding="sm" background="sunken" radius="sm">
            <Text size="sm">{label}</Text>
          </Box>
        ))}
      </Grid>
    ),
  },
  Heading: {
    render: () => (
      <Stack gap="xs">
        <Heading level={2} size="heading-md">
          Users
        </Heading>
        <Heading level={3} size="title-md">
          Pending invitations
        </Heading>
      </Stack>
    ),
  },
  IconButton: {
    render: () => (
      <Inline gap="xs">
        <IconButton icon={CopyIcon} aria-label="Copy user ID" tone="neutral" />
        <IconButton icon={PlusIcon} aria-label="Add" variant="soft" />
        <IconButton icon={TrashIcon} aria-label="Delete" tone="danger" />
      </Inline>
    ),
  },
  Inline: {
    render: () => (
      <Inline gap="sm">
        {["Engineering", "Finance", "Sales"].map((team) => (
          <Box key={team} paddingInline="sm" paddingBlock="xs" border="subtle" radius="sm">
            <Text size="sm">{team}</Text>
          </Box>
        ))}
      </Inline>
    ),
  },
  Input: {
    width: 260,
    render: () => (
      <Input icon={MailIcon} placeholder="e.g. priya@acme.in" aria-label="Work email" />
    ),
  },
  Link: {
    render: () => (
      <Text>
        <Link href="#audit">Audit logs</Link> ·{" "}
        <Link href="https://docs.qeet.in" external>
          Docs
        </Link>
      </Text>
    ),
  },
  Menu: {
    render: () => (
      <Menu>
        <MenuTrigger render={<Button variant="soft" />}>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem>Reset MFA</MenuItem>
        </MenuContent>
      </Menu>
    ),
  },
  Meter: {
    width: 240,
    render: () => <Meter label="Seats used" value={72} showValue />,
  },
  Popover: {
    render: () => (
      <Popover>
        <PopoverTrigger render={<Button variant="soft" />}>Session details</PopoverTrigger>
        <PopoverContent title="Chrome on macOS">Bengaluru · 2 minutes ago</PopoverContent>
      </Popover>
    ),
  },
  Progress: {
    width: 240,
    render: () => <Progress label="Importing users" value={64} showValue />,
  },
  QeetrixProvider: {
    zoom: 0.85,
    width: 300,
    render: () => (
      <QeetrixProvider locale="hi-IN" messages={hi}>
        <Pagination offset={0} pageSize={25} total={1284} onOffsetChange={() => {}} />
      </QeetrixProvider>
    ),
  },
  Radio: {
    render: () => (
      <RadioGroup label="Billing" defaultValue="yearly" orientation="horizontal">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </RadioGroup>
    ),
  },
  ScrollArea: {
    width: 220,
    render: () => (
      <ScrollArea style={{ blockSize: 96 }}>
        <Stack gap="xs">
          {PEOPLE.map((person) => (
            <Text key={person.name} size="sm">
              {person.name}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
    ),
  },
  Select: {
    width: 220,
    render: () => <Select aria-label="Role" items={ROLES} defaultValue="admin" />,
  },
  Separator: {
    width: 220,
    render: () => (
      <Stack gap="sm">
        <Text size="sm">Directory</Text>
        <Separator />
        <Text size="sm">Access</Text>
      </Stack>
    ),
  },
  Skeleton: {
    render: () => (
      <Inline gap="sm">
        <Skeleton variant="circle" />
        <Skeleton lines={2} style={{ inlineSize: 140 }} />
      </Inline>
    ),
  },
  SkipLink: {
    render: () => (
      <Inline gap="xs">
        {/* Hidden until focused, so the key that reveals it stands in. */}
        <SkipLink href="#main" />
        <Badge>Tab</Badge>
        <Text size="sm">Skip to main content</Text>
      </Inline>
    ),
  },
  Slider: {
    width: 240,
    render: () => (
      <Slider label="Session length (hours)" defaultValue={8} min={1} max={24} showValue />
    ),
  },
  Spinner: {
    render: () => (
      <Inline gap="md">
        <Spinner label="Loading" />
        <Spinner size="lg" tone="brand" label="Loading" />
      </Inline>
    ),
  },
  Stack: {
    width: 200,
    render: () => (
      <Stack gap="xs">
        {["Profile", "Security", "Notifications"].map((label) => (
          <Box key={label} padding="sm" background="sunken" radius="sm">
            <Text size="sm">{label}</Text>
          </Box>
        ))}
      </Stack>
    ),
  },
  Switch: {
    render: () => <Switch label="Require passkeys" description="For every admin" defaultChecked />,
  },
  Table: {
    zoom: 0.75,
    width: 360,
    render: () => (
      <Table
        label="Users"
        rows={PEOPLE.slice(0, 3)}
        rowId={(person) => person.name}
        rowLabel={(person) => person.name}
        columns={[
          { id: "name", header: "Name", cell: (person) => person.name },
          { id: "status", header: "Status", cell: () => <Badge tone="success">Active</Badge> },
        ]}
      />
    ),
  },
  Tabs: {
    render: () => (
      <Tabs defaultValue="all">
        <TabsList variant="contained">
          <Tab value="all">All users</Tab>
          <Tab value="invited" badge={9}>
            Invited
          </Tab>
        </TabsList>
      </Tabs>
    ),
  },
  Text: {
    render: () => (
      <Stack gap="xs">
        <Text weight="semibold">Priya Sharma</Text>
        <Text size="sm" tone="subtle">
          priya@acme.in
        </Text>
        <Text size="sm" mono>
          usr_01HZX9K2
        </Text>
      </Stack>
    ),
  },
  TextField: {
    width: 260,
    render: () => <TextField label="Work email" defaultValue="priya@acme.in" />,
  },
  Textarea: {
    width: 260,
    render: () => <Textarea aria-label="Note" defaultValue="Access approved by Rahul Verma." />,
  },
  ToastProvider: {
    render: () => (
      <ToastProvider>
        <ToastDemo />
      </ToastProvider>
    ),
  },
  Toggle: {
    render: () => (
      <ToggleGroup aria-label="Period" defaultValue={["30d"]}>
        <Toggle value="24h">24 hours</Toggle>
        <Toggle value="7d">7 days</Toggle>
        <Toggle value="30d">30 days</Toggle>
      </ToggleGroup>
    ),
  },
  Tooltip: {
    render: () => (
      <Tooltip content="Synced 4 minutes ago">
        <Button variant="ghost" tone="neutral">
          Azure AD
        </Button>
      </Tooltip>
    ),
  },
  VisuallyHidden: {
    render: () => (
      <Badge tone="success">
        On<VisuallyHidden>: two-step sign-in is required</VisuallyHidden>
      </Badge>
    ),
  },

  PortalContainer: {
    width: 240,
    render: () => (
      <PortalContainer container={null}>
        <Text size="sm" tone="subtle">
          Menus, popovers and dialogs open inside the container it names.
        </Text>
      </PortalContainer>
    ),
  },
  /* Experimental */
  Alert: {
    width: 250,
    render: () => (
      <Alert tone="warning" title="Trial ends in 3 days">
        Add a payment method.
      </Alert>
    ),
  },
  AppShell: {
    zoom: 0.2,
    width: 1040,
    height: 640,
    render: () => (
      <AppShell topBar={<MiniTopBar />} sidebar={<MiniSidebar />} mainId="catalog-main">
        <MiniPageHeader />
      </AppShell>
    ),
  },
  AvatarGroup: {
    render: () => <AvatarGroup people={PEOPLE} total={38} size="md" />,
  },
  AvatarItem: {
    render: () => <AvatarItem name="Priya Sharma" description="priya@acme.in" />,
  },
  Breadcrumb: {
    render: () => (
      <Breadcrumb>
        <BreadcrumbItem href="#directory">Directory</BreadcrumbItem>
        <BreadcrumbItem current>Users</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  Calendar: {
    zoom: 0.6,
    render: () => <Calendar defaultValue="2026-10-25" today="2026-10-25" />,
  },
  CodeBlock: {
    zoom: 0.85,
    width: 320,
    render: () => (
      <CodeBlock
        language="shell"
        wrap
        code={'curl https://api.qeet.in/v1/users \\\n  -H "Authorization: Bearer $QEET_KEY"'}
      />
    ),
  },
  Combobox: {
    width: 240,
    render: () => (
      <Combobox
        aria-label="Manager"
        items={PEOPLE.map((person) => ({ value: person.name, label: person.name }))}
        placeholder="e.g. Priya Sharma"
      />
    ),
  },
  CommandPalette: {
    render: () => (
      <>
        {/* Closed until its trigger or ⌘K opens it over the page. */}
        <CommandPalette groups={[]} onSelect={() => {}} hotkey={false} />
        <Button variant="soft" icon={SearchIcon}>
          Search or jump to…
        </Button>
      </>
    ),
  },
  CopyButton: {
    render: () => (
      <Inline gap="xs">
        <Text size="sm" mono>
          usr_01HZX9K2
        </Text>
        <CopyButton value="usr_01HZX9K2" label="Copy user ID" size="sm" />
      </Inline>
    ),
  },
  DataState: {
    zoom: 0.8,
    width: 320,
    render: () => <DataState error="failed" onRetry={() => {}} />,
  },
  DatePicker: {
    width: 220,
    render: () => <DatePicker aria-label="Start date" defaultValue="2026-10-25" />,
  },
  DateRangePicker: {
    width: 260,
    render: () => (
      <DateRangePicker
        aria-label="Period"
        defaultValue={{ start: "2026-10-01", end: "2026-10-25" }}
      />
    ),
  },
  DescriptionList: {
    width: 260,
    render: () => (
      <DescriptionList>
        <DescriptionItem term="Email">priya@acme.in</DescriptionItem>
        <DescriptionItem term="Role">Admin</DescriptionItem>
      </DescriptionList>
    ),
  },
  EmptyState: {
    zoom: 0.8,
    width: 320,
    render: () => (
      <EmptyState
        size="section"
        icon={UsersIcon}
        title="No users yet"
        description="Invite your team, or connect a directory."
      />
    ),
  },
  ErrorSummary: {
    zoom: 0.85,
    width: 300,
    render: () => (
      <ErrorSummary items={[{ message: "Enter a work email" }, { message: "Choose a role" }]} />
    ),
  },
  FileUpload: {
    zoom: 0.7,
    width: 360,
    render: () => (
      <FileUpload
        aria-label="Logo"
        hint="PNG or SVG, up to 1 MB"
        items={[{ id: "logo", name: "acme-logo.svg", size: 18432, status: "done" }]}
      />
    ),
  },
  FilterTags: {
    zoom: 0.9,
    width: 280,
    render: () => (
      <FilterTags
        filters={[
          { id: "status", label: "Status", value: "Active" },
          { id: "mfa", label: "MFA", value: "Passkey" },
        ]}
        onRemove={() => {}}
      />
    ),
  },
  Chip: {
    width: 280,
    render: () => (
      <ChipGroup label="Status" multiple defaultValue={["active"]}>
        <Chip value="active">Active</Chip>
        <Chip value="invited">Invited</Chip>
      </ChipGroup>
    ),
  },
  Form: {
    zoom: 0.85,
    width: 300,
    render: () => (
      <Form aria-label="Invite a user">
        <TextField label="Work email" name="email" defaultValue="rahul.verma@acme.in" />
        <Button type="submit">Send invitation</Button>
      </Form>
    ),
  },
  NumberField: {
    width: 180,
    render: () => <NumberField aria-label="Seats" defaultValue={25} min={1} />,
  },
  OTPInput: {
    // Six slots need about 280px at the default density: each is at least a control's height wide.
    zoom: 0.85,
    width: 290,
    // Named by a Field: OTPInput's own `aria-label` doesn't reach its first slot.
    render: () => (
      <Field label="Verification code">
        <OTPInput defaultValue="4817" />
      </Field>
    ),
  },
  PageHeader: {
    zoom: 0.3,
    width: 960,
    render: () => <MiniPageHeader />,
  },
  Pagination: {
    zoom: 0.85,
    width: 300,
    render: () => <Pagination offset={0} pageSize={25} total={1284} onOffsetChange={() => {}} />,
  },
  PasswordInput: {
    width: 260,
    render: () => (
      <PasswordInput aria-label="Client secret" autoComplete="off" defaultValue={SECRET} />
    ),
  },
  QRCode: {
    render: () => (
      <QRCode
        value="otpauth://totp/Qeet%20ID:priya@acme.in?secret=JBSWY3DPEHPK3PXP&issuer=Qeet%20ID"
        label="Scan to set up your authenticator"
        size={112}
      />
    ),
  },
  RangeCalendar: {
    zoom: 0.6,
    render: () => (
      <RangeCalendar defaultValue={{ start: "2026-10-12", end: "2026-10-18" }} today="2026-10-25" />
    ),
  },
  SearchField: {
    width: 260,
    render: () => <SearchField aria-label="Search users" placeholder="Search by name or email" />,
  },
  Sidebar: {
    zoom: 0.7,
    width: 256,
    height: 180,
    render: () => <MiniSidebar />,
  },
  Stat: {
    width: 260,
    render: () => (
      <StatGroup>
        <Stat
          label="Total users"
          value={1284}
          note="+38 this week"
          tone="positive"
          trend={NOW_TREND}
        />
      </StatGroup>
    ),
  },
  Steps: {
    zoom: 0.8,
    width: 340,
    render: () => (
      <Steps
        steps={[{ label: "Details" }, { label: "Connection" }, { label: "Review" }]}
        current={1}
      />
    ),
  },
  Timeline: {
    zoom: 0.85,
    width: 300,
    render: () => (
      <Timeline variant="compact">
        <TimelineGroup label="Today">
          <TimelineItem title="Signed in with a passkey" time="09:28" />
          <TimelineItem title="Failed sign-in" tone="danger" time="09:12" />
        </TimelineGroup>
      </Timeline>
    ),
  },
  TopBar: {
    zoom: 0.25,
    width: 1040,
    render: () => <MiniTopBar />,
  },
  TreeView: {
    width: 240,
    render: () => (
      <TreeView
        label="Organisations"
        defaultExpanded={["acme"]}
        items={[
          {
            id: "acme",
            label: "Acme Pvt Ltd",
            children: [
              { id: "eng", label: "Engineering" },
              { id: "fin", label: "Finance" },
            ],
          },
        ]}
      />
    ),
  },
  BarList: {
    width: 260,
    render: () => (
      <BarList
        aria-label="Sign-ins by method"
        items={[
          { id: "passkey", label: "Passkey", value: 812 },
          { id: "otp", label: "One-time code", value: 356 },
          { id: "password", label: "Password", value: 116 },
        ]}
      />
    ),
  },
  ChartLegend: {
    width: 240,
    render: () => (
      <ChartLegend
        items={[
          { label: "Successful", tone: "data" },
          { label: "Failed", tone: "negative" },
        ]}
      />
    ),
  },
  ChartTooltip: {
    width: 200,
    render: () => (
      <ChartTooltip
        title="12 Nov"
        items={[
          { label: "Successful", value: "1,204", tone: "data" },
          { label: "Failed", value: "38", tone: "negative" },
        ]}
      />
    ),
  },
  CheckItem: {
    width: 280,
    render: () => (
      <CheckList>
        <CheckItem title="Signing certificate" status="running" detail="Checking the expiry date" />
      </CheckList>
    ),
  },
  CheckList: {
    width: 280,
    render: () => (
      <CheckList>
        <CheckItem title="Metadata URL reachable" status="passed" />
        <CheckItem title="Signing certificate" status="failed" detail="Expired on 2 Nov 2026" />
      </CheckList>
    ),
  },
  CodeField: {
    width: 280,
    render: () => (
      <CodeField
        aria-label="Request body"
        language="json"
        rows={3}
        defaultValue={'{\n  "email": "priya@acme.in"\n}'}
      />
    ),
  },
  ColorField: {
    width: 260,
    render: () => <ColorField aria-label="Brand colour" defaultValue="#f26d0e" />,
  },
  ColorSwatchGroup: {
    width: 220,
    render: () => (
      <ColorSwatchGroup
        aria-label="Accent"
        defaultValue="ember"
        options={[
          { value: "ember", label: "Ember", color: "#f26d0e" },
          { value: "teal", label: "Teal", color: "#0f766e" },
          { value: "indigo", label: "Indigo", color: "#4338ca" },
        ]}
      />
    ),
  },
  ColumnChart: {
    width: 280,
    render: () => (
      <ColumnChart
        label="Sign-ins a day"
        height={96}
        series={[
          { label: "Successful", tone: "data" },
          { label: "Failed", tone: "negative" },
        ]}
        columns={[
          { id: "mon", label: "Mon", values: [120, 4] },
          { id: "tue", label: "Tue", values: [148, 9] },
          { id: "wed", label: "Wed", values: [131, 2] },
          { id: "thu", label: "Thu", values: [162, 6] },
          { id: "fri", label: "Fri", values: [139, 3] },
        ]}
      />
    ),
  },
  Composer: {
    width: 300,
    render: () => <Composer onSend={() => {}} placeholder="Ask about this tenant" />,
  },
  Conversation: {
    width: 320,
    render: () => (
      <Conversation>
        <Turn speaker="user">Who signed in from a new device today?</Turn>
        <Turn speaker="assistant" speakerName="Qeet AI">
          Two people: Priya Sharma and Rahul Verma.
        </Turn>
      </Conversation>
    ),
  },
  CopyField: {
    width: 260,
    render: () => <CopyField label="Client ID" value="qid_7f3k29d1" />,
  },
  FloatingPanel: {
    width: 300,
    render: () => (
      // A fixed panel; the box contains it, so it stays in the tile.
      <div style={{ position: "relative", contain: "layout paint", blockSize: 160 }}>
        <FloatingPanel
          title="Icon details"
          defaultOpen
          defaultPlace={{ start: 0, top: 0, width: 280, height: 150 }}
        >
          <Text size="sm">arrow-right · sharp, 16px</Text>
        </FloatingPanel>
      </div>
    ),
  },
  GraphCanvas: {
    zoom: 0.6,
    width: 420,
    height: 260,
    render: () => (
      <GraphCanvas
        aria-label="Who reaches Billing"
        nodes={[
          { id: "billing", label: "Billing" },
          { id: "finance", label: "Finance", parent: "billing", relation: "has access" },
          { id: "priya", label: "Priya Sharma", parent: "finance", relation: "member of" },
        ]}
      />
    ),
  },
  InstructionList: {
    width: 280,
    render: () => (
      <InstructionList>
        <InstructionStep title="Copy the metadata URL">Paste it into Okta.</InstructionStep>
        <InstructionStep title="Assign people">Only they can sign in.</InstructionStep>
      </InstructionList>
    ),
  },
  InstructionStep: {
    width: 280,
    render: () => (
      <InstructionList>
        <InstructionStep title="Add this record" value="TXT qeet-verify=7f3k29">
          At your DNS provider.
        </InstructionStep>
      </InstructionList>
    ),
  },
  Kbd: {
    width: 160,
    render: () => <Kbd keys="Mod+K" />,
  },
  MultiEmailField: {
    width: 280,
    render: () => (
      <MultiEmailField
        aria-label="Invite people"
        defaultValue={["priya@acme.in", "rahul@acme.in"]}
      />
    ),
  },
  ProportionalCircles: {
    width: 280,
    render: () => (
      <ProportionalCircles
        groups={[
          {
            id: "roles",
            label: "Roles",
            items: [
              { id: "owner", label: "Owner", value: 3 },
              { id: "admin", label: "Admin", value: 12 },
              { id: "member", label: "Member", value: 240 },
            ],
          },
        ]}
      />
    ),
  },
  ProviderButton: {
    width: 280,
    render: () => (
      <ProviderButtonGroup aria-label="Sign in with">
        <ProviderButton aria-label="Sign in with Google">Google</ProviderButton>
        <ProviderButton aria-label="Sign in with Microsoft">Microsoft</ProviderButton>
      </ProviderButtonGroup>
    ),
  },
  RelativeTime: {
    width: 180,
    render: () => (
      <RelativeTime
        date="2026-11-08T09:58:00Z"
        now={Date.parse("2026-11-08T10:00:00Z")}
        live={false}
      />
    ),
  },
  ShareBar: {
    width: 280,
    render: () => (
      <ShareBar
        label="Users by status"
        legend
        parts={[
          { id: "active", label: "Active", value: 1012, tone: "data" },
          { id: "invited", label: "Invited", value: 184, tone: "warning" },
          { id: "suspended", label: "Suspended", value: 88, tone: "negative" },
        ]}
      />
    ),
  },
  ShowMore: {
    width: 240,
    render: () => <ShowMore hasMore onMore={() => {}} />,
  },
  SiteHeader: {
    zoom: 0.35,
    width: 900,
    render: () => (
      <SiteHeader
        brand={<Text weight="semibold">Qeet</Text>}
        navigation={
          <SiteNav aria-label="Sections">
            <SiteNavItem label="Products" href="#products" />
            <SiteNavItem label="Pricing" href="#pricing" />
          </SiteNav>
        }
        action={<Button size="sm">Get started</Button>}
      />
    ),
  },
  SiteNav: {
    width: 260,
    render: () => (
      <SiteNav aria-label="Sections">
        <SiteNavItem label="Products" href="#products" current />
        <SiteNavItem label="Docs" href="#docs" />
      </SiteNav>
    ),
  },
  SpanChart: {
    width: 300,
    render: () => (
      <SpanChart
        aria-label="Sessions over the last week"
        from={Date.parse("2026-11-01T00:00:00Z")}
        to={Date.parse("2026-11-08T00:00:00Z")}
        rows={[
          {
            id: "mac",
            label: "MacBook",
            start: Date.parse("2026-11-02T00:00:00Z"),
            end: Date.parse("2026-11-07T00:00:00Z"),
            description: "2 to 7 Nov",
          },
          {
            id: "phone",
            label: "Pixel 9",
            start: Date.parse("2026-11-05T00:00:00Z"),
            end: Date.parse("2026-11-08T00:00:00Z"),
            description: "5 to 8 Nov",
          },
        ]}
      />
    ),
  },
  Sparkline: {
    width: 200,
    render: () => <Sparkline values={NOW_TREND} />,
  },
  StateRuler: {
    width: 320,
    render: () => (
      <StateRuler aria-label="Connection states">
        <StateRulerItem label="Draft" description="Not used to sign in" />
        <StateRulerItem label="On" description="Signs people in" current />
        <StateRulerItem label="Off" description="Kept, not used" />
      </StateRuler>
    ),
  },
  ThemeSwitcher: {
    width: 240,
    render: () => <ThemeSwitcher variant="segmented" defaultValue="system" />,
  },
  Toolbar: {
    width: 300,
    render: () => (
      <Toolbar aria-label="Icons" start={<Text size="sm">3 selected</Text>}>
        <ToolbarButton variant="ghost">Export</ToolbarButton>
      </Toolbar>
    ),
  },
  Treemap: {
    width: 280,
    render: () => (
      <Treemap
        aria-label="Users by department"
        nodes={[
          { id: "eng", label: "Engineering", value: 420 },
          { id: "fin", label: "Finance", value: 180 },
          { id: "ops", label: "Operations", value: 120 },
        ]}
      />
    ),
  },
  Turn: {
    width: 300,
    render: () => (
      <Turn speaker="assistant" speakerName="Qeet AI">
        Three people have no passkey yet.
      </Turn>
    ),
  },
  Workspace: {
    zoom: 0.5,
    width: 560,
    render: () => (
      <Workspace layout="list-main" style={{ blockSize: 200 }}>
        <WorkspacePane side="list" label="Icons">
          <Text size="sm">arrow-right</Text>
        </WorkspacePane>
        <WorkspaceMain aria-label="Preview">
          <Text size="sm">The chosen icon, at every size.</Text>
        </WorkspaceMain>
      </Workspace>
    ),
  },
};
