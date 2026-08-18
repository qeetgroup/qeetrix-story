import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react";

const meta: Meta<typeof Toolbar> = {
  title: "Primitives/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal strip of icon or text buttons grouped into logical sections with separators. Built for rich-text editors, query builders, and data-table action bars — for example the formatting toolbar in qeet-notify's email template editor or the filter/column controls above a Qeet ID Members table.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Rich-text formatting toolbar for the qeet-notify email template editor — bold, italic, underline, and alignment controls.",
      },
    },
  },
  render: () => (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline">
          <UnderlineIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left">
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center">
          <AlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Align right">
          <AlignRightIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
};
