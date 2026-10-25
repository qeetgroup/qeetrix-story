import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import {
  Badge,
  Button,
  Card,
  formatCurrency,
  Stack,
  Tab,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  Text,
  TextField,
} from "@qeetrix/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageContent,
  PageHeader,
  PageHeaderBack,
  Stat,
  StatGroup,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

/**
 * The console's router link, in miniature: like a router's `Link`, it handles the click itself.
 * Storybook sends a plain link to the parent frame, which would leave Storybook.
 */
function RouterLink({ href, onClick, ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    />
  );
}

const routerLink = <RouterLink />;

const usersBreadcrumb = (
  <Breadcrumb>
    <BreadcrumbItem href="#directory" render={routerLink}>
      Directory
    </BreadcrumbItem>
    <BreadcrumbItem current>Users</BreadcrumbItem>
  </Breadcrumb>
);

const usersActions = (
  <>
    <Button variant="soft" icon={DownloadIcon}>
      Export
    </Button>
    <Button icon={PlusIcon}>Invite users</Button>
  </>
);

const usersSummary = (
  <StatGroup>
    <Stat
      label="Total users"
      value={1284}
      note="+38 this week"
      tone="positive"
      trend={[1080, 1110, 1139, 1172, 1205, 1246, 1284]}
    />
    <Stat
      label="Passkey adoption"
      value="72%"
      note="+6 pts this month"
      tone="positive"
      trend={[41, 47, 53, 58, 63, 69, 72]}
    />
    <Stat
      label="Pending invitations"
      value={64}
      note="9 expire this week"
      tone="warning"
      trend={[30, 31, 38, 52, 55, 61, 64]}
    />
  </StatGroup>
);

const usersTabs = (
  <TabsList>
    <Tab value="all">All users</Tab>
    <Tab value="invitations">Invitations</Tab>
    <Tab value="blocked">Blocked</Tab>
  </TabsList>
);

const meta: Meta<typeof PageHeader> = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  subcomponents: { PageContent, PageHeaderBack },
  parameters: {
    qeetrix: qx({ category: "layout", status: "experimental" }),
    layout: "fullscreen",
  },
  args: {
    title: "Users",
    description: "People who can sign in to Acme Pvt Ltd's applications.",
  },
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// The breadcrumb, status and actions start as the Users page's; type to replace them.
export const Playground: Story = {
  args: { count: 1284 },
  render: (args) => (
    <PageHeader
      {...args}
      breadcrumb={args.breadcrumb ?? usersBreadcrumb}
      status={args.status ?? <Badge tone="success">Directory synced</Badge>}
      actions={args.actions ?? usersActions}
    />
  ),
};

export const Minimal: Story = {};

export const WithSummary: Story = {
  name: "With summary",
  args: { breadcrumb: usersBreadcrumb, actions: usersActions, summary: usersSummary },
};

const withTabs: Story["render"] = (args) => (
  <Tabs defaultValue="all">
    <PageHeader {...args} />
  </Tabs>
);

export const WithTabs: Story = {
  name: "With tabs",
  args: { breadcrumb: usersBreadcrumb, actions: usersActions, tabs: usersTabs },
  render: withTabs,
};

export const DetailPage: Story = {
  name: "Detail page",
  render: () => (
    <>
      <PageHeader
        back={
          <PageHeaderBack href="#users" render={routerLink}>
            Users
          </PageHeaderBack>
        }
        title="Priya Sharma"
        status={<Badge tone="success">Active</Badge>}
        description="priya@acme.in · Engineering"
        actions={<Button variant="soft">Reset password</Button>}
      />
      <PageContent width="narrow">
        <Card title="Profile" level={2} footer={<Button size="sm">Save changes</Button>}>
          <Stack gap="md">
            <TextField label="Full name" defaultValue="Priya Sharma" />
            <TextField label="Work email" defaultValue="priya@acme.in" />
          </Stack>
        </Card>
      </PageContent>
    </>
  ),
};

const INVOICES = [
  { id: "INV-2026-0412", customer: "Bharat Logistics", amount: 124500, status: "Paid" },
  { id: "INV-2026-0411", customer: "Nilgiri Foods", amount: 58999, status: "Due" },
  { id: "INV-2026-0409", customer: "Konkan Textiles", amount: 212000, status: "Overdue" },
] as const;

const INVOICE_TONE = { Paid: "success", Due: "info", Overdue: "danger" } as const;
const rupees = (amount: number) =>
  formatCurrency(amount, "INR", "en-IN", { maximumFractionDigits: 0 });

export const InContext: Story = {
  name: "In context",
  render: () => (
    <>
      <PageHeader
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem href="#invoices" render={routerLink}>
              Invoices
            </BreadcrumbItem>
            <BreadcrumbItem current>Sent</BreadcrumbItem>
          </Breadcrumb>
        }
        title="Sent invoices"
        count={312}
        actions={<Button icon={PlusIcon}>New invoice</Button>}
      />
      <PageContent>
        <Card>
          <Table
            label="Sent invoices"
            rows={INVOICES}
            rowId={(row) => row.id}
            rowLabel={(row) => row.id}
            columns={[
              { id: "invoice", header: "Invoice", cell: (row) => row.id },
              { id: "customer", header: "Customer", cell: (row) => row.customer },
              {
                id: "status",
                header: "Status",
                cell: (row) => <Badge tone={INVOICE_TONE[row.status]}>{row.status}</Badge>,
              },
              { id: "amount", header: "Amount", numeric: true, cell: (row) => rupees(row.amount) },
            ]}
          />
        </Card>
      </PageContent>
    </>
  ),
};

const COMPLETE = {
  breadcrumb: usersBreadcrumb,
  count: 1284,
  actions: usersActions,
  summary: usersSummary,
  tabs: usersTabs,
};

export const NarrowWindow: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Test: narrow window",
  globals: { viewport: { value: "mobile", isRotated: false } },
  args: COMPLETE,
  render: withTabs,
};

export const TabsInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the header's tabs switch the page",
  args: COMPLETE,
  render: (args) => (
    <Tabs defaultValue="all">
      <PageHeader {...args} />
      <PageContent>
        <TabsPanel value="all">
          <Text>1,284 users at Acme Pvt Ltd.</Text>
        </TabsPanel>
        <TabsPanel value="invitations">
          <Text>64 invitations are waiting, 9 of them expire this week.</Text>
        </TabsPanel>
        <TabsPanel value="blocked">
          <Text>3 users are blocked.</Text>
        </TabsPanel>
      </PageContent>
    </Tabs>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const title = canvas.getByRole("heading", { level: 1, name: "Users" });
    await expect(title).toBeVisible();
    await expect(canvas.getByText("1,284 users at Acme Pvt Ltd.")).toBeVisible();

    // The first tab's label sits on the title's gutter; the tabs' rule runs edge to edge.
    const header = canvasElement.querySelector("[data-slot=page-header]") as HTMLElement;
    const list = canvas.getByRole("tablist");
    const label = list.querySelector("[data-slot=tab-label]") as HTMLElement;
    const left = (element: Element) => element.getBoundingClientRect().left;
    await expect(Math.abs(left(label) - left(title))).toBeLessThanOrEqual(1);
    await expect(Math.abs(left(list) - left(header))).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(list.getBoundingClientRect().right - header.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(1);

    await userEvent.click(canvas.getByRole("tab", { name: "Invitations" }));
    await expect(canvas.getByRole("tab", { name: "Invitations" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(canvas.getByText(/64 invitations are waiting/)).toBeVisible();
  },
};

export const BackInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the back link names its page",
  render: DetailPage.render,
  play: async ({ canvas }) => {
    const back = canvas.getByRole("link", { name: "Back to Users" });
    await expect(back).toHaveAttribute("href", "#users");
    await expect(back).toHaveTextContent("Users");
    // Above the title, its arrow on the title's start edge.
    const title = canvas.getByRole("heading", { level: 1, name: "Priya Sharma" });
    const arrow = back.querySelector("svg") as SVGElement;
    await expect(back.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      title.getBoundingClientRect().top,
    );
    await expect(
      Math.abs(arrow.getBoundingClientRect().left - title.getBoundingClientRect().left),
    ).toBeLessThanOrEqual(1);
  },
};
