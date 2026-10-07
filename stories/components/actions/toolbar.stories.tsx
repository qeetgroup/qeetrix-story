import {
  BoldIcon,
  DownloadIcon,
  ItalicIcon,
  ListFilterIcon,
  PlusIcon,
  TextAlignCenterIcon,
  TextAlignEndIcon,
  TextAlignStartIcon,
  UnderlineIcon,
} from "@qeetrix/icons";
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Actions/Toolbar",
  component: Toolbar,
  parameters: {
    qeetrix: qx({ category: "actions", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal strip of icon or text buttons grouped into logical sections with separators. Built for rich-text editors, query builders, and data-table action bars — for example the formatting toolbar in qeet-notify's email template editor or the filter/column controls above a Qeet ID Members table.\n\n`variant=\"default\"` is a bordered strip (an editor's formatting bar); `variant=\"ghost\"` has no chrome, for a table header, a card header or a page's action row where the surface it sits on is the frame. `ToolbarSpacer` pushes everything after it to the inline end — filters at the start, actions at the end. Items are Buttons in everything but their part: `ToolbarButton` is ghost by default and takes Button's `variant` and `size` for the one emphasised action. The toolbar is one tab stop; arrow keys move between items and wrap, and Home / End jump to the first and last item.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
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
          <TextAlignStartIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center">
          <TextAlignCenterIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Align right">
          <TextAlignEndIcon />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="default"` draws the bordered strip, with items inset 4px and corners concentric to it. `variant="ghost"` drops the chrome entirely — the same items sitting directly on the surface below.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["default", "ghost"] as const).map((variant) => (
        <Toolbar key={variant} variant={variant} aria-label={`Formatting (${variant})`}>
          <ToolbarGroup>
            <ToolbarButton size="icon" aria-label="Bold">
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Italic">
              <ItalicIcon />
            </ToolbarButton>
            <ToolbarButton size="icon" aria-label="Underline">
              <UnderlineIcon />
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarButton>Insert variable</ToolbarButton>
        </Toolbar>
      ))}
    </div>
  ),
};

/** The table-header layout: filters at the start, actions pushed to the end by the spacer. */
function MembersTableToolbar() {
  return (
    <Toolbar variant="ghost" aria-label="Members table" className="w-xl">
      <ToolbarButton>
        <ListFilterIcon /> Filter
      </ToolbarButton>
      <ToolbarButton>Role: Any</ToolbarButton>
      <ToolbarSpacer />
      <ToolbarButton variant="outline">
        <DownloadIcon /> Export CSV
      </ToolbarButton>
      <ToolbarButton variant="default">
        <PlusIcon /> Invite member
      </ToolbarButton>
    </Toolbar>
  );
}

export const WithSpacer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ToolbarSpacer` above a Qeet ID Members table, in a `ghost` toolbar: Filter and Role sit at the inline start, Export and Invite at the inline end. The spacer is presentational — `aria-hidden`, no focus. `Invite member` is the one emphasised item (`variant="default"`); `Export CSV` is `outline`.',
      },
    },
  },
  render: () => <MembersTableToolbar />,
};

export const KeyboardInteraction: Story = {
  name: "Interaction: arrow keys, Home and End",
  parameters: {
    docs: {
      description: {
        story:
          "A toolbar is a single tab stop with roving focus. The test tabs in, walks the items with the arrow keys (wrapping past the end), and jumps with End and Home — and confirms the spacer is never a stop, because End lands on the last real action.",
      },
    },
  },
  render: () => <MembersTableToolbar />,
  play: async ({ canvas, userEvent }) => {
    const filter = canvas.getByRole("button", { name: "Filter" });
    const role = canvas.getByRole("button", { name: "Role: Any" });
    const exportCsv = canvas.getByRole("button", { name: "Export CSV" });
    const invite = canvas.getByRole("button", { name: "Invite member" });

    await userEvent.tab();
    await expect(filter).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(role).toHaveFocus();
    // The spacer sits between Role and Export but is not an item.
    await userEvent.keyboard("{ArrowRight}");
    await expect(exportCsv).toHaveFocus();

    await userEvent.keyboard("{End}");
    await expect(invite).toHaveFocus();
    // Arrow keys wrap at either end.
    await userEvent.keyboard("{ArrowRight}");
    await expect(filter).toHaveFocus();

    await userEvent.keyboard("{End}");
    await userEvent.keyboard("{Home}");
    await expect(filter).toHaveFocus();
  },
};
