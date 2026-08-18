import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof NavigationMenu> = {
  title: "Primitives/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal navigation bar with optional flyout panels for grouped links. Use it in top-level product headers — the Qeet marketing site's `Products`, `Docs`, and `Pricing` nav, or the multi-product switcher across Qeet ID, qeet-logs, and qeet-notify.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Qeet marketing site header nav — Products flyout lists each platform with a brief description, Docs links directly.",
      },
    },
  },
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[320px] gap-1">
              <NavigationMenuLink href="#">
                <div className="font-medium">Qeet ID</div>
                <p className="text-muted-foreground">
                  Passkeys-first identity & access management.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">qeet-logs</div>
                <p className="text-muted-foreground">Privacy-first, multi-tenant log management.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">qeet-notify</div>
                <p className="text-muted-foreground">Multi-channel notification delivery.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
