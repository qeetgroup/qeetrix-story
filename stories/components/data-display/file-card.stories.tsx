import { DownloadIcon } from "@qeetrix/icons";
import { Button, FileCard } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof FileCard> = {
  title: "Components/Data Display/FileCard",
  component: FileCard,
  parameters: {
    qeetrix: qx({ category: "data-display", status: "stable" }),
    layout: "padded",
    docs: {
      description: {
        component:
          "Thumbnail card representing an uploaded file — used in qeet-pay invoice attachments and any Qeet document-management surface. Displays a `FileTypeIcon`, filename, size, an optional `meta` label (e.g. uploader name), and a composable `actions` slot for download or delete buttons. The `selected` prop highlights the card for multi-select flows.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileCard>;

const action = (
  <Button variant="ghost" size="icon-sm" aria-label="Download">
    <DownloadIcon />
  </Button>
);

export const Grid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Six-card grid as it appears on a qeet-pay invoice — the last card is highlighted with `selected` to indicate it is queued for bulk download.",
      },
    },
  },
  render: () => (
    <div className="grid w-[36rem] grid-cols-3 gap-3">
      <FileCard name="Q3_Invoice.pdf" size="2.4 MB" meta="Ada Lovelace" actions={action} />
      <FileCard name="company_logo.png" size="820 KB" meta="Grace Hopper" actions={action} />
      <FileCard name="onboarding.mp4" size="18 MB" meta="Alan Turing" actions={action} />
      <FileCard name="payroll_June.xlsx" size="64 KB" meta="Katherine Johnson" actions={action} />
      <FileCard name="webhook_handler.ts" size="3 KB" meta="Margaret Hamilton" actions={action} />
      <FileCard name="release_assets.zip" size="44 MB" meta="Ops" selected actions={action} />
    </div>
  ),
};
