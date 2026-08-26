import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta = {
  title: "Components/Navigation/Sidebar",
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The collapsible product sidebar used across all Qeet applications. Built on the shadcn Sidebar primitive, it composes `SidebarProvider`, `SidebarGroup`, and `SidebarMenu` into a responsive rail that collapses to an icon strip on narrower viewports. `SidebarTrigger` gives users manual control over the open/closed state.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="h-[28rem] w-full overflow-hidden rounded-lg border border-border">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-3 py-2 font-heading">Qeet ID</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {["Dashboard", "Connections", "Audit log", "API keys"].map((label) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton>{label}</SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-3 py-2 text-xs text-muted-foreground">v1.0</SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4">
          <SidebarTrigger />
          <p className="mt-4 text-sm text-muted-foreground">Main content area.</p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
