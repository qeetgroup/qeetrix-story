import { CodeBlock } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { expect } from "storybook/test";
import {
  ALERT_EMPHASES,
  ALERT_VARIANTS,
  BADGE_VARIANTS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  COMPONENT_NAMES,
  CONTROL_SIZES,
  ICON_BUTTON_SIZES,
  ICON_NAMES,
  type PlaygroundArgs,
  SHARED_CONTROLS,
  SPECS,
} from "./catalog";

/**
 * The workbench: preview on top, the JSX that produces it underneath.
 *
 * Both come from `SPECS[component]` and the same args, so the snippet is not a
 * hand-maintained caption — it is the configuration you just built, serialised.
 */
function Workbench(args: PlaygroundArgs) {
  const uid = useId();
  const spec = SPECS[args.component];
  const ignored = SHARED_CONTROLS.filter((control) => !spec.supports.includes(control));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex min-h-44 items-center justify-center rounded-xl border border-border bg-muted/30 p-8">
        {spec.render(args, `${args.component.toLowerCase()}-${uid}`)}
      </div>

      <p className="text-sm text-muted-foreground">{spec.summary}</p>

      {ignored.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Ignored for {args.component}:</span> {ignored.join(", ")} —
          the component has no such prop, so those controls change nothing here.
        </p>
      ) : null}

      {/* CodeBlock reveals its copy button on hover only; copying is the whole point of
          this page (and hover does not exist on touch), so it is pinned visible. */}
      <CodeBlock
        value={spec.code(args)}
        caption={`${args.component} — the code for the preview above`}
        className="[&>button]:opacity-100"
      />
    </div>
  );
}

const meta: Meta<PlaygroundArgs> = {
  title: "Playground",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Configure a component with the Controls panel and read the code you would write to get it. Pick a primitive, vary its variant, size, state, icon and content, then copy the generated JSX — imports included — straight into product code. Everything rendered here is a real `@qeetrix/ui` export with real props, so nothing you copy is a playground-only invention. Theme, density and direction stay on the toolbar: the playground inherits them rather than shadowing them with local args.",
      },
    },
  },
  argTypes: {
    component: {
      control: "select",
      options: COMPONENT_NAMES,
      description: "Which primitive to configure. The variant and size controls follow it.",
      table: { category: "Component" },
    },

    content: {
      control: "text",
      description:
        "Primary text — button label, badge text, alert title, card title, or the field label for Input, Select, Checkbox and Switch. For IconButton it becomes the required `aria-label`.",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description:
        "Secondary text — alert description, card description, or the placeholder for Input and Select.",
      table: { category: "Content" },
    },
    icon: {
      control: "select",
      options: ICON_NAMES,
      description:
        "A glyph from `@qeetrix/icons`. IconButton requires one, so `none` falls back to `SettingsIcon` there.",
      table: { category: "Content" },
    },
    iconPosition: {
      control: "inline-radio",
      options: ["start", "end"],
      description: "Button and Badge only — Alert always renders its icon in the leading column.",
      if: { arg: "icon", neq: "none" },
      table: { category: "Content" },
    },

    disabled: {
      control: "boolean",
      description: "Button, IconButton, Input, Select, Checkbox and Switch.",
      table: { category: "State" },
    },
    loading: {
      control: "boolean",
      description:
        "Button only here. Maps to Button's own `loading` prop — the spinner replaces a leading icon, and the button reports `aria-busy` without losing focus or colour.",
      table: { category: "State" },
    },
    checked: {
      control: "boolean",
      description: "Checkbox and Switch — seeds `defaultChecked`; the control stays interactive.",
      table: { category: "State" },
    },

    buttonVariant: {
      name: "variant",
      control: "select",
      options: BUTTON_VARIANTS,
      if: { arg: "component", eq: "Button" },
      table: { category: "Variant & size" },
    },
    buttonSize: {
      name: "size",
      control: "select",
      options: BUTTON_SIZES,
      if: { arg: "component", eq: "Button" },
      table: { category: "Variant & size" },
    },
    iconButtonVariant: {
      name: "variant",
      control: "select",
      options: BUTTON_VARIANTS,
      if: { arg: "component", eq: "IconButton" },
      table: { category: "Variant & size" },
    },
    iconButtonSize: {
      name: "size",
      control: "select",
      options: ICON_BUTTON_SIZES,
      if: { arg: "component", eq: "IconButton" },
      table: { category: "Variant & size" },
    },
    badgeVariant: {
      name: "variant",
      control: "select",
      options: BADGE_VARIANTS,
      if: { arg: "component", eq: "Badge" },
      table: { category: "Variant & size" },
    },
    alertVariant: {
      name: "variant",
      control: "select",
      options: ALERT_VARIANTS,
      if: { arg: "component", eq: "Alert" },
      table: { category: "Variant & size" },
    },
    alertEmphasis: {
      name: "emphasis",
      control: "inline-radio",
      options: ALERT_EMPHASES,
      description:
        "`strong` is a solid status fill for messages that must not be missed — use it sparingly. The neutral `default` variant has no strong form, so it looks the same either way.",
      if: { arg: "component", eq: "Alert" },
      table: { category: "Variant & size" },
    },
    selectSize: {
      name: "size",
      control: "inline-radio",
      options: CONTROL_SIZES,
      if: { arg: "component", eq: "Select" },
      table: { category: "Variant & size" },
    },
    switchSize: {
      name: "size",
      control: "inline-radio",
      options: CONTROL_SIZES,
      if: { arg: "component", eq: "Switch" },
      table: { category: "Variant & size" },
    },
    cardSize: {
      name: "size",
      control: "inline-radio",
      options: CONTROL_SIZES,
      if: { arg: "component", eq: "Card" },
      table: { category: "Variant & size" },
    },
  },
  args: {
    component: "Button",
    content: "Create API key",
    description: "Keys grant full access to your tenant.",
    icon: "none",
    iconPosition: "start",
    disabled: false,
    loading: false,
    checked: true,
    buttonVariant: "default",
    buttonSize: "default",
    iconButtonVariant: "ghost",
    iconButtonSize: "icon",
    badgeVariant: "default",
    alertVariant: "info",
    alertEmphasis: "subtle",
    selectSize: "default",
    switchSize: "default",
    cardSize: "default",
  },
  render: (args) => <Workbench {...args} />,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The playground itself. Open the Controls panel and start changing things — the preview
 * and the snippet move together.
 */
export const Playground: Story = {};

/**
 * Every component the picker offers, rendered from the same args at once. Two jobs: it is
 * the menu (so you can see what is on offer before choosing), and it is the smoke test —
 * every render path in the catalogue mounts and is axe-checked in one story.
 */
export const EveryComponent: Story = {
  name: "Every component",
  parameters: {
    docs: {
      description: {
        story:
          "The full picker, side by side. Changing the shared Content, State or Icon controls updates all nine at once — a quick way to see which components implement a given prop and which quietly ignore it.",
      },
    },
  },
  render: (args) => (
    <div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPONENT_NAMES.map((name) => (
        <section
          key={name}
          className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4"
        >
          <span className="text-xs font-medium text-muted-foreground">{name}</span>
          <div className="flex min-h-24 items-center justify-center">
            {SPECS[name].render({ ...args, component: name }, `every-${name.toLowerCase()}`)}
          </div>
        </section>
      ))}
    </div>
  ),
};

/**
 * The contract this page rests on: whatever the controls say, the snippet says the same
 * thing. If these two ever disagree, the playground is worse than useless — it is wrong.
 */
export const SnippetInteraction: Story = {
  name: "Interaction: the snippet tracks the controls",
  args: {
    component: "Button",
    content: "Delete user",
    buttonVariant: "destructive",
    buttonSize: "sm",
    icon: "TrashIcon",
  },
  play: async ({ args, canvas, canvasElement }) => {
    // The preview renders a real, reachable button — queried by role, not by test id.
    const preview = canvas.getByRole("button", { name: "Delete user" });
    await expect(preview).toBeInTheDocument();

    const code = canvasElement.querySelector("[data-slot=code-block] code")?.textContent ?? "";
    await expect(code).toContain('import { TrashIcon } from "@qeetrix/icons";');
    await expect(code).toContain('<Button variant="destructive" size="sm">');
    await expect(code).toContain("<TrashIcon />");
    await expect(code).toContain("Delete user");
    // Defaults stay out of the snippet: nobody should paste `iconPosition` into a Button.
    await expect(code).not.toContain("iconPosition");

    // The glyph carries no colour of its own: it must paint in the button's colour, so a
    // pasted snippet never needs a `color` prop to be visible on a filled variant.
    const glyph = preview.querySelector("svg");
    await expect(glyph && getComputedStyle(glyph).color).toBe(getComputedStyle(preview).color);

    // The copy affordance is the point of the page, so assert it is actually reachable.
    await expect(canvas.getByRole("button", { name: "Copy code" })).toBeInTheDocument();

    // Snippet generation is pure, so every catalogue entry can be checked here rather
    // than needing nine near-identical stories: each must render its own tag and import
    // it. This is what stops a new entry shipping code that does not compile.
    for (const name of COMPONENT_NAMES) {
      const generated = SPECS[name].code({ ...args, component: name });
      await expect(generated).toContain('from "@qeetrix/ui";');
      await expect(generated).toContain(`<${name}`);
    }

    // Alert's `emphasis` follows the same rule: the default `subtle` is never printed, and a
    // `strong` choice always is.
    const alert = { ...args, component: "Alert", alertVariant: "destructive" } as const;
    await expect(SPECS.Alert.code({ ...alert, alertEmphasis: "subtle" })).not.toContain("emphasis");
    await expect(SPECS.Alert.code({ ...alert, alertEmphasis: "strong" })).toContain(
      '<Alert variant="destructive" emphasis="strong">',
    );
  },
};
