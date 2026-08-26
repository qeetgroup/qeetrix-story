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
import { expect, screen, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/Navigation/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    qeetrix: qx({ category: "navigation", status: "stable" }),
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

export const OpenSubmenuInteraction: Story = {
  name: "Interaction: opening a submenu",
  parameters: {
    // Both rules fire only while the submenu is open.
    //  - aria-hidden-focus: Base UI renders `<span aria-hidden tabindex="0"
    //    data-base-ui-focus-guard>` sentinels to wrap focus around the trapped region.
    //    Being simultaneously hidden and focusable is the whole point of a focus guard,
    //    so this is axe disagreeing with a deliberate upstream pattern, not a defect.
    //  - landmark-unique: the open popup contributes a second unnamed `nav` landmark;
    //    naming it belongs in @qeetrix/ui.
    a11y: {
      options: {
        rules: {
          "aria-hidden-focus": { enabled: false },
          "landmark-unique": { enabled: false },
        },
      },
    },
    docs: {
      description: {
        story:
          "The trigger owns a disclosure state, so `aria-expanded` must track the panel. A menu that opens visually without updating that attribute tells assistive technology the opposite of what is on screen.",
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
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">qeet-logs</div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Products" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const link = await screen.findByText("Qeet ID");
    await waitFor(() => expect(link).toBeVisible());
  },
};
