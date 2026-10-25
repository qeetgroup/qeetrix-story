import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { Badge, Button, QeetrixProvider } from "@qeetrix/react";
import { Breadcrumb, BreadcrumbItem, PageHeader } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
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

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem },
  parameters: {
    qeetrix: qx({ category: "navigation", status: "experimental" }),
    layout: "centered",
  },
  args: {
    label: "Breadcrumb",
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#directory" render={routerLink}>
        Directory
      </BreadcrumbItem>
      <BreadcrumbItem href="#users" render={routerLink}>
        Users
      </BreadcrumbItem>
      <BreadcrumbItem current>Priya Sharma</BreadcrumbItem>
    </Breadcrumb>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Playground: Story = {};

export const LongLabels: Story = {
  name: "Long labels",
  parameters: {
    docs: {
      description: { story: "Labels over 240px truncate and keep their text as a `title`." },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#applications" render={routerLink}>
        Applications
      </BreadcrumbItem>
      <BreadcrumbItem href="#payroll" render={routerLink}>
        Payroll portal for Acme Pvt Ltd employees
      </BreadcrumbItem>
      <BreadcrumbItem current>Sessions and devices from the last ninety days</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const InContext: Story = {
  name: "In context",
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <PageHeader
      breadcrumb={
        <Breadcrumb {...args}>
          <BreadcrumbItem href="#directory" render={routerLink}>
            Directory
          </BreadcrumbItem>
          <BreadcrumbItem href="#users" render={routerLink}>
            Users
          </BreadcrumbItem>
          <BreadcrumbItem current>Rahul Verma</BreadcrumbItem>
        </Breadcrumb>
      }
      title="Rahul Verma"
      status={<Badge tone="success">Active</Badge>}
      actions={<Button icon={PlusIcon}>Add to group</Button>}
    />
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  render: () => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      {/* Server-safe: the landmark's name comes from `label`, not from the provider. */}
      <Breadcrumb label={hi.breadcrumb.label}>
        <BreadcrumbItem href="#directory" render={routerLink}>
          डायरेक्टरी
        </BreadcrumbItem>
        <BreadcrumbItem href="#users" render={routerLink}>
          उपयोगकर्ता
        </BreadcrumbItem>
        <BreadcrumbItem current>प्रिया शर्मा</BreadcrumbItem>
      </Breadcrumb>
    </QeetrixProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "पेज का पथ" })).toBeVisible();
  },
};

export const KeyboardInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: links in the Tab order, the current page is text",
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
    await expect(nav.querySelector("ol")).not.toBeNull();

    const current = canvas.getByText("Priya Sharma");
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(canvas.queryByRole("link", { name: "Priya Sharma" })).toBeNull();

    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Directory" })).toHaveFocus();
    await userEvent.tab();
    const users = canvas.getByRole("link", { name: "Users" });
    await expect(users).toHaveFocus();
    await expect(users).toHaveAttribute("href", "#users");
  },
};

export const TruncationInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: long labels truncate and keep their text",
  render: LongLabels.render,
  play: async ({ canvas }) => {
    const current = canvas.getByText(/Sessions and devices/);
    await expect(current.getBoundingClientRect().width).toBeLessThanOrEqual(240);
    await expect(current).toHaveAttribute(
      "title",
      "Sessions and devices from the last ninety days",
    );
  },
};

export const AriaLabelInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: aria-label renames the landmark",
  args: { "aria-label": "Path to Priya Sharma" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Path to Priya Sharma" })).toBeVisible();
    await expect(canvas.queryByRole("navigation", { name: "Breadcrumb" })).toBeNull();
  },
};
