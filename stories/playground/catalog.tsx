/**
 * The Playground catalogue — one entry per component the picker offers.
 *
 * Each entry pairs a live `render` with a `code` that generates the equivalent JSX from
 * the *same* args, so the snippet under the preview cannot drift away from the thing it
 * claims to describe. Adding a component to the playground is one entry here plus its
 * variant/size options in the story's `argTypes`.
 *
 * Two rules keep the generated code worth copying:
 *
 *   1. Only real `@qeetrix/ui` exports are rendered — no local wrappers, no props that
 *      do not exist. What you paste into a product compiles unchanged.
 *   2. Props left at their default are omitted from the snippet. `<Button>Save</Button>`
 *      is the honest output for a default button; `variant="default" size="default"` is
 *      noise a reviewer has to read past.
 */

import { BellIcon, CopyIcon, PlusIcon, SearchIcon, SettingsIcon, TrashIcon } from "@qeetrix/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  IconButton,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@qeetrix/ui";
import type { ComponentType, ReactNode } from "react";

/* ── Vocabularies ─────────────────────────────────────────────────────────────── */

/**
 * The icons the `icon` control offers, keyed by their exported name — so a spec can
 * print `<TrashIcon />` and the matching `@qeetrix/icons` import without a second lookup.
 */
export const ICONS = {
  none: null,
  PlusIcon,
  BellIcon,
  CopyIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
} satisfies Record<string, ComponentType<{ className?: string }> | null>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * The curated set. Nine components chosen to cover every axis the playground drives —
 * variant (Button, Badge, Alert), emphasis (Alert), size (Button, IconButton, Switch, Select, Card),
 * disabled (the five form controls), icon slots (Button, IconButton, Badge, Alert),
 * and label/description content (all of them). Overlays such as Dialog are deliberately
 * absent: their interesting state is "open", which a preview tile cannot show without
 * taking over the page.
 */
export const COMPONENT_NAMES = [
  "Button",
  "IconButton",
  "Badge",
  "Alert",
  "Input",
  "Select",
  "Checkbox",
  "Switch",
  "Card",
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

export const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;
export const BUTTON_SIZES = ["default", "xs", "sm", "lg"] as const;
export const ICON_BUTTON_SIZES = ["icon-sm", "icon", "icon-lg"] as const;
/** Ordered as the source groups them: the solid fill, the tints, then the graphite variants. */
export const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "brand",
  "info",
  "success",
  "warning",
  "destructive",
  "muted",
] as const;
/** `danger` is an accepted alias of `destructive` on Alert; one spelling is enough here. */
export const ALERT_VARIANTS = ["default", "info", "success", "warning", "destructive"] as const;
/** `subtle` is the default; `strong` is the solid status fill for messages that must not be missed. */
export const ALERT_EMPHASES = ["subtle", "strong"] as const;
/** The shared control scale — Select's trigger, Switch and Card all speak it. */
export const CONTROL_SIZES = ["default", "sm"] as const;

/** Controls every component sees, whether or not it implements them. */
export const SHARED_CONTROLS = [
  "content",
  "description",
  "icon",
  "disabled",
  "loading",
  "checked",
] as const;

export type SharedControl = (typeof SHARED_CONTROLS)[number];

export interface PlaygroundArgs {
  component: ComponentName;
  content: string;
  description: string;
  icon: IconName;
  iconPosition: "start" | "end";
  disabled: boolean;
  loading: boolean;
  checked: boolean;
  buttonVariant: (typeof BUTTON_VARIANTS)[number];
  buttonSize: (typeof BUTTON_SIZES)[number];
  iconButtonVariant: (typeof BUTTON_VARIANTS)[number];
  iconButtonSize: (typeof ICON_BUTTON_SIZES)[number];
  badgeVariant: (typeof BADGE_VARIANTS)[number];
  alertVariant: (typeof ALERT_VARIANTS)[number];
  alertEmphasis: (typeof ALERT_EMPHASES)[number];
  selectSize: (typeof CONTROL_SIZES)[number];
  switchSize: (typeof CONTROL_SIZES)[number];
  cardSize: (typeof CONTROL_SIZES)[number];
}

export interface ComponentSpec {
  /** One line on what the component is for, and anything surprising about its API. */
  summary: string;
  /** Which of the shared controls this component actually implements. */
  supports: readonly SharedControl[];
  /** The live preview. `id` is unique per render, for label ↔ control association. */
  render: (args: PlaygroundArgs, id: string) => ReactNode;
  /** The same thing as copyable JSX, imports included. */
  code: (args: PlaygroundArgs) => string;
}

/* ── Snippet plumbing ─────────────────────────────────────────────────────────── */

type Attr = [name: string, value: string | boolean | undefined];

/**
 * Serialises JSX attributes. `undefined`, `false` and `""` drop out entirely — that is
 * how "left at its default" becomes "absent from the snippet". A value containing a
 * double quote is emitted as a string expression rather than a broken attribute.
 */
function attrs(list: Attr[]): string {
  return list
    .map(([name, value]) => {
      if (value === undefined || value === false || value === "") return "";
      if (value === true) return ` ${name}`;
      // Already an expression (`icon={TrashIcon}`) — pass it through unquoted.
      if (value.startsWith("{") && value.endsWith("}")) return ` ${name}=${value}`;
      return ` ${name}=${value.includes('"') ? `{${JSON.stringify(value)}}` : `"${value}"`}`;
    })
    .join("");
}

/** JSX text cannot hold `<`, `>`, `{` or `}`; those fall back to a string expression. */
function text(value: string): string {
  return /[<>{}]/.test(value) ? `{${JSON.stringify(value)}}` : value;
}

const indent = (lines: string[]): string =>
  lines
    .flatMap((line) => line.split("\n"))
    .map((line) => `  ${line}`)
    .join("\n");

/** `<Name attrs>children</Name>`, or a self-closing tag when there are no children. */
function element(name: string, attributes: string, children: string[]): string {
  const kids = children.filter((child) => child !== "");
  if (kids.length === 0) return `<${name}${attributes} />`;
  return `<${name}${attributes}>\n${indent(kids)}\n</${name}>`;
}

const unique = (names: string[]): string => [...new Set(names)].sort().join(", ");

/** Prepends the imports the snippet needs, in the order Biome would sort them. */
function snippet(uiExports: string[], iconExports: string[], jsx: string): string {
  const lines: string[] = [];
  lines.push(`import { ${unique(uiExports)} } from "@qeetrix/ui";`);
  if (iconExports.length > 0)
    lines.push(`import { ${unique(iconExports)} } from "@qeetrix/icons";`);
  return `${lines.join("\n")}\n\n${jsx}`;
}

/** A readable `id` for the snippet; the live preview uses React's `useId` instead. */
const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "field";

/** Every label must resolve to something: an empty accessible name is an axe failure. */
const labelOf = (args: PlaygroundArgs): string => args.content.trim() || "Label";

const FIELD = "flex w-72 flex-col gap-2";

const ROLES: Array<[value: string, label: string]> = [
  ["owner", "Owner"],
  ["admin", "Admin"],
  ["member", "Member"],
  ["viewer", "Viewer"],
];

/* ── The catalogue ────────────────────────────────────────────────────────────── */

export const SPECS: Record<ComponentName, ComponentSpec> = {
  Button: {
    summary:
      "The action primitive — `variant` carries intent, `size` matches the density around it. `loading` is a prop: the spinner takes the leading icon's slot, the button sets `aria-busy` and stays focusable, and it keeps its colour, because busy is not unavailable.",
    supports: ["content", "icon", "disabled", "loading"],
    render: (a) => {
      const Glyph = ICONS[a.icon];
      const glyph = Glyph ? <Glyph /> : null;
      return (
        <Button
          variant={a.buttonVariant}
          size={a.buttonSize}
          disabled={a.disabled}
          loading={a.loading}
        >
          {a.iconPosition === "start" ? glyph : null}
          {a.content}
          {a.iconPosition === "end" ? glyph : null}
        </Button>
      );
    },
    code: (a) => {
      const glyph = a.icon !== "none" ? a.icon : null;
      return snippet(
        ["Button"],
        glyph ? [glyph] : [],
        element(
          "Button",
          attrs([
            ["variant", a.buttonVariant === "default" ? undefined : a.buttonVariant],
            ["size", a.buttonSize === "default" ? undefined : a.buttonSize],
            ["disabled", a.disabled],
            ["loading", a.loading],
          ]),
          [
            glyph && a.iconPosition === "start" ? `<${glyph} />` : "",
            text(a.content),
            glyph && a.iconPosition === "end" ? `<${glyph} />` : "",
          ],
        ),
      );
    },
  },

  IconButton: {
    summary:
      "Icon-only button whose `aria-label` is required by TypeScript — the Content control becomes that name. Sizes are square (`icon-sm` / `icon` / `icon-lg`) and the default variant is `ghost`. Pass the icon component itself to `icon`; the button renders and sizes the glyph.",
    supports: ["content", "icon", "disabled"],
    render: (a) => (
      <IconButton
        icon={ICONS[a.icon] ?? SettingsIcon}
        aria-label={a.content.trim() || "Open settings"}
        variant={a.iconButtonVariant}
        size={a.iconButtonSize}
        disabled={a.disabled}
      />
    ),
    code: (a) => {
      const glyph = a.icon === "none" ? "SettingsIcon" : a.icon;
      return snippet(
        ["IconButton"],
        [glyph],
        element(
          "IconButton",
          attrs([
            ["icon", `{${glyph}}`],
            ["aria-label", a.content.trim() || "Open settings"],
            ["variant", a.iconButtonVariant === "ghost" ? undefined : a.iconButtonVariant],
            ["size", a.iconButtonSize === "icon" ? undefined : a.iconButtonSize],
            ["disabled", a.disabled],
          ]),
          [],
        ),
      );
    },
  },

  Badge: {
    summary:
      "A static status marker, not a control — it has no size, disabled or pressed state. Three kinds: the solid `default` (use sparingly), quiet tints (`brand`, `info` and the statuses) and graphite (`secondary`, `outline`, `muted`). Reach for Chip when the thing needs to be dismissible.",
    supports: ["content", "icon"],
    render: (a) => {
      const Glyph = ICONS[a.icon];
      const glyph = Glyph ? <Glyph /> : null;
      return (
        <Badge variant={a.badgeVariant}>
          {a.iconPosition === "start" ? glyph : null}
          {a.content}
          {a.iconPosition === "end" ? glyph : null}
        </Badge>
      );
    },
    code: (a) => {
      const glyph = a.icon === "none" ? null : a.icon;
      // Badge sizes a direct svg child to 12px itself, so the glyph needs no class of its own.
      const tag = glyph ? `<${glyph} />` : "";
      return snippet(
        ["Badge"],
        glyph ? [glyph] : [],
        element(
          "Badge",
          attrs([["variant", a.badgeVariant === "default" ? undefined : a.badgeVariant]]),
          [
            a.iconPosition === "start" ? tag : "",
            text(a.content),
            a.iconPosition === "end" ? tag : "",
          ],
        ),
      );
    },
  },

  Alert: {
    summary:
      'Inline, page-level feedback. The icon is always the first child — the component\'s grid reserves a column for it — so the icon-position control does not apply here. `emphasis="strong"` turns a status variant into a solid fill for messages that must not be missed; the neutral `default` variant has no strong form.',
    supports: ["content", "description", "icon"],
    render: (a) => {
      const Glyph = ICONS[a.icon];
      return (
        <Alert variant={a.alertVariant} emphasis={a.alertEmphasis} className="w-full max-w-md">
          {Glyph ? <Glyph /> : null}
          <AlertTitle>{a.content}</AlertTitle>
          {a.description ? <AlertDescription>{a.description}</AlertDescription> : null}
        </Alert>
      );
    },
    code: (a) => {
      const glyph = a.icon === "none" ? null : a.icon;
      // Only import what the snippet actually renders — an unused import is a lint
      // error in the product repo it gets pasted into.
      return snippet(
        a.description ? ["Alert", "AlertDescription", "AlertTitle"] : ["Alert", "AlertTitle"],
        glyph ? [glyph] : [],
        element(
          "Alert",
          attrs([
            ["variant", a.alertVariant === "default" ? undefined : a.alertVariant],
            ["emphasis", a.alertEmphasis === "subtle" ? undefined : a.alertEmphasis],
          ]),
          [
            glyph ? `<${glyph} />` : "",
            element("AlertTitle", "", [text(a.content)]),
            a.description ? element("AlertDescription", "", [text(a.description)]) : "",
          ],
        ),
      );
    },
  },

  Input: {
    summary:
      "A styled native input — it has no variant or size prop, because its height follows the global density mode. Always pair it with a Label: an input with no accessible name is an axe failure, not a style choice.",
    supports: ["content", "description", "disabled"],
    render: (a, id) => (
      <div className={FIELD}>
        <Label htmlFor={id}>{labelOf(a)}</Label>
        <Input id={id} placeholder={a.description} disabled={a.disabled} />
      </div>
    ),
    code: (a) => {
      const id = slug(labelOf(a));
      return snippet(
        ["Input", "Label"],
        [],
        element("div", attrs([["className", FIELD]]), [
          element("Label", attrs([["htmlFor", id]]), [text(labelOf(a))]),
          element(
            "Input",
            attrs([
              ["id", id],
              ["placeholder", a.description],
              ["disabled", a.disabled],
            ]),
            [],
          ),
        ]),
      );
    },
  },

  Select: {
    summary:
      "A composed listbox: Select owns the value, SelectTrigger the control surface, SelectContent the popup. `size` lives on the trigger, `disabled` on the root.",
    supports: ["content", "description", "disabled"],
    render: (a, id) => (
      <div className={FIELD}>
        <Label htmlFor={id}>{labelOf(a)}</Label>
        <Select disabled={a.disabled}>
          <SelectTrigger id={id} size={a.selectSize} className="w-full">
            <SelectValue placeholder={a.description || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    code: (a) => {
      const id = slug(labelOf(a));
      return snippet(
        ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue", "Label"],
        [],
        element("div", attrs([["className", FIELD]]), [
          element("Label", attrs([["htmlFor", id]]), [text(labelOf(a))]),
          element("Select", attrs([["disabled", a.disabled]]), [
            element(
              "SelectTrigger",
              attrs([
                ["id", id],
                ["size", a.selectSize === "default" ? undefined : a.selectSize],
                ["className", "w-full"],
              ]),
              [
                element(
                  "SelectValue",
                  attrs([["placeholder", a.description || "Select an option"]]),
                  [],
                ),
              ],
            ),
            element(
              "SelectContent",
              "",
              ROLES.map(([value, label]) => `<SelectItem value="${value}">${label}</SelectItem>`),
            ),
          ]),
        ]),
      );
    },
  },

  Checkbox: {
    summary:
      'A Base UI checkbox rendered as a button with `role="checkbox"` — a `<Label htmlFor>` still names it, because a button is a labelable element. It also takes an `indeterminate` state for parent rows.',
    supports: ["content", "disabled", "checked"],
    render: (a, id) => (
      // Keyed on the arg so flipping the control re-seeds the uncontrolled state, while
      // clicking the checkbox itself still works normally.
      <div className="flex items-center gap-2" key={String(a.checked)}>
        <Checkbox id={id} defaultChecked={a.checked} disabled={a.disabled} />
        <Label htmlFor={id}>{labelOf(a)}</Label>
      </div>
    ),
    code: (a) => {
      const id = slug(labelOf(a));
      return snippet(
        ["Checkbox", "Label"],
        [],
        element("div", attrs([["className", "flex items-center gap-2"]]), [
          element(
            "Checkbox",
            attrs([
              ["id", id],
              ["defaultChecked", a.checked],
              ["disabled", a.disabled],
            ]),
            [],
          ),
          element("Label", attrs([["htmlFor", id]]), [text(labelOf(a))]),
        ]),
      );
    },
  },

  Switch: {
    summary:
      "For settings that apply the moment they are flipped — no Save button. Two sizes, `sm` and `default`; anything more granular is the density mode's job.",
    supports: ["content", "disabled", "checked"],
    render: (a, id) => (
      <div className="flex items-center gap-2" key={String(a.checked)}>
        <Switch id={id} size={a.switchSize} defaultChecked={a.checked} disabled={a.disabled} />
        <Label htmlFor={id}>{labelOf(a)}</Label>
      </div>
    ),
    code: (a) => {
      const id = slug(labelOf(a));
      return snippet(
        ["Label", "Switch"],
        [],
        element("div", attrs([["className", "flex items-center gap-2"]]), [
          element(
            "Switch",
            attrs([
              ["id", id],
              ["size", a.switchSize === "default" ? undefined : a.switchSize],
              ["defaultChecked", a.checked],
              ["disabled", a.disabled],
            ]),
            [],
          ),
          element("Label", attrs([["htmlFor", id]]), [text(labelOf(a))]),
        ]),
      );
    },
  },

  Card: {
    summary:
      "A surface, not a control: `size` selects the padding scale rather than the width, which you set yourself. CardHeader/CardTitle/CardDescription are the header slots; CardContent and CardFooter complete the set.",
    supports: ["content", "description"],
    render: (a) => (
      <Card size={a.cardSize} className="w-80">
        <CardHeader>
          <CardTitle>{a.content}</CardTitle>
          {a.description ? <CardDescription>{a.description}</CardDescription> : null}
        </CardHeader>
      </Card>
    ),
    code: (a) =>
      snippet(
        a.description
          ? ["Card", "CardDescription", "CardHeader", "CardTitle"]
          : ["Card", "CardHeader", "CardTitle"],
        [],
        element(
          "Card",
          attrs([
            ["size", a.cardSize === "default" ? undefined : a.cardSize],
            ["className", "w-80"],
          ]),
          [
            element("CardHeader", "", [
              element("CardTitle", "", [text(a.content)]),
              a.description ? element("CardDescription", "", [text(a.description)]) : "",
            ]),
          ],
        ),
      ),
  },
};
