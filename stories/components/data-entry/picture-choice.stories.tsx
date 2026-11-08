import { Stack, Text } from "@qeetrix/react";
import {
  PictureChoice,
  PictureChoiceGroup,
  type PictureChoiceGroupProps,
} from "@qeetrix/react/experimental";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { qx } from "../../_contract";

/** A head and shoulders on a coloured ground, as an inline SVG: no image files. */
const portrait = (ground: string, skin: string, top: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${ground}"/><circle cx="32" cy="25" r="12" fill="${skin}"/><path d="M8 64c2-15 12-22 24-22s22 7 24 22z" fill="${top}"/></svg>`,
  )}`;

const AVATARS = [
  { value: "sand", label: "Sand", src: portrait("#d8c3a5", "#8d5b3e", "#3d5a80") },
  { value: "sky", label: "Sky", src: portrait("#bcd4e6", "#c68642", "#1d3557") },
  { value: "leaf", label: "Leaf", src: portrait("#c7dbb5", "#f1c27d", "#2d6a4f") },
  { value: "rose", label: "Rose", src: portrait("#efc3ca", "#7a4a2e", "#6d2e46") },
  { value: "dusk", label: "Dusk", src: portrait("#cdb4db", "#e0ac69", "#3c096c") },
  { value: "stone", label: "Stone", src: portrait("#d6d3d1", "#a1665e", "#44403c") },
] as const;

const BACKGROUNDS = [
  { value: "teal", label: "Teal", color: "#0f766e" },
  { value: "sand", label: "Sand", color: "#e7d8b9" },
  { value: "plum", label: "Plum", color: "#6b2d5c" },
  { value: "slate", label: "Slate", color: "#334155" },
] as const;

const meta: Meta<PictureChoiceGroupProps> = {
  title: "Components/Data Entry/PictureChoice",
  component: PictureChoiceGroup,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "One choice among pictures or colour swatches: an avatar, a background, a sticker. A radio group: Tab reaches the chosen picture, the arrow keys move and choose, and every option is named by its required label (the picture itself is decoration).",
      },
    },
  },
  args: {
    "aria-label": "Avatar",
    columns: 3,
    shape: "round",
    size: "md",
    defaultValue: "sand",
    onValueChange: fn(),
  },
  argTypes: {
    shape: { control: "inline-radio", options: ["round", "square"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
    columns: { control: { type: "number", min: 1, max: 6 } },
  },
  render: (args) => (
    <PictureChoiceGroup {...args}>
      {AVATARS.map((avatar) => (
        <PictureChoice key={avatar.value} {...avatar} />
      ))}
    </PictureChoiceGroup>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<PictureChoiceGroupProps>;

export const Playground: Story = {};

export const Avatars: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Round, for people, in a grid of `columns`. Chosen, a picture takes a 2px Ember ring set off from it by the surface, and a tick on an Ember disc at its corner, so the choice isn't told by colour alone.",
      },
    },
  },
  args: { columns: 3 },
};

export const Backgrounds: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Square, for anything else. `color` makes an option a swatch: any CSS colour, or a token's variable. Without `columns` the options sit in a row that wraps.",
      },
    },
  },
  render: () => (
    <PictureChoiceGroup aria-label="Background" shape="square" defaultValue="teal">
      {BACKGROUNDS.map((background) => (
        <PictureChoice key={background.value} {...background} />
      ))}
    </PictureChoiceGroup>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "`md` (48px, the default) and `lg` (64px), for a screen given to the choice.",
      },
    },
  },
  render: () => (
    <Stack gap="lg">
      {(["md", "lg"] as const).map((size) => (
        <Stack key={size} gap="xs">
          <Text size="sm" tone="subtle">
            {size}
          </Text>
          <PictureChoiceGroup aria-label={`Avatar, ${size}`} size={size} defaultValue="sky">
            {AVATARS.slice(0, 4).map((avatar) => (
              <PictureChoice key={avatar.value} {...avatar} />
            ))}
          </PictureChoiceGroup>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Unavailable: Story = {
  parameters: {
    docs: {
      description: {
        story: "One option, or the whole group with `disabled`, can be unavailable.",
      },
    },
  },
  render: () => (
    <PictureChoiceGroup aria-label="Avatar" defaultValue="sand">
      {AVATARS.slice(0, 4).map((avatar) => (
        <PictureChoice key={avatar.value} {...avatar} disabled={avatar.value === "leaf"} />
      ))}
    </PictureChoiceGroup>
  ),
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <PictureChoiceGroup aria-label="الصورة الرمزية" columns={3} defaultValue="sand">
        {AVATARS.map((avatar) => (
          <PictureChoice key={avatar.value} {...avatar} />
        ))}
      </PictureChoiceGroup>
    </div>
  ),
};

export const ChooseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: the arrow keys move and choose",
  play: async ({ args, canvas, userEvent }) => {
    const group = canvas.getByRole("radiogroup", { name: "Avatar" });
    await expect(group).toBeVisible();
    const sand = canvas.getByRole("radio", { name: "Sand" });
    await expect(sand).toBeChecked();
    await userEvent.click(sand);
    await userEvent.keyboard("{ArrowRight}");
    const sky = canvas.getByRole("radio", { name: "Sky" });
    await expect(sky).toHaveFocus();
    await expect(sky).toBeChecked();
    await expect(sand).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("sky", expect.anything());
  },
};

export const NamedInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: every option is named by its label",
  render: Backgrounds.render,
  play: async ({ canvas }) => {
    for (const background of BACKGROUNDS) {
      await expect(canvas.getByRole("radio", { name: background.label })).toBeVisible();
    }
  },
};
