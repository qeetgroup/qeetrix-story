import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DirectionProvider,
  Input,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof DirectionProvider> = {
  title: "Components/Utilities/DirectionProvider",
  component: DirectionProvider,
  parameters: {
    qeetrix: qx({ category: "utilities", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Sets the text direction context (`ltr` / `rtl`) for all Radix UI and Base UI primitives in its subtree. Wrap your app shell or a specific page region with `DirectionProvider` when supporting right-to-left locales — Qeet products target Arabic, Hebrew, and Urdu markets in addition to English and Hindi.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DirectionProvider>;

/**
 * `label` distinguishes the two copies rendered by the SideBySide story. Breadcrumb
 * renders a `nav` landmark with a default accessible name, so two of them on one page
 * are indistinguishable to a screen reader unless each is named. The component spreads
 * `props` after its own `aria-label`, so passing one here wins.
 */
function Demo({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb aria-label={label}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Qeet ID</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Organisation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Security settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Input placeholder="Search members…" />
      <div className="flex gap-2">
        <Button variant="outline">Discard</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

export const SideBySide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "LTR and RTL layouts side-by-side — notice how the breadcrumb separator, input text alignment, and button order mirror correctly under RTL.",
      },
    },
  },
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <DirectionProvider direction="ltr">
        <p className="mb-2 text-xs font-medium text-muted-foreground">LTR (English / Hindi)</p>
        <Demo label="Breadcrumb (LTR)" />
      </DirectionProvider>
      <DirectionProvider direction="rtl">
        <p className="mb-2 text-xs font-medium text-muted-foreground">RTL (Arabic / Hebrew)</p>
        <Demo label="Breadcrumb (RTL)" />
      </DirectionProvider>
    </div>
  ),
};
