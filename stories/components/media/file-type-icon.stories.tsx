import { FileTypeIcon } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { qx } from "../../_contract";

const meta: Meta<typeof FileTypeIcon> = {
  title: "Components/Media/FileTypeIcon",
  component: FileTypeIcon,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          "Extension-aware file icon used in qeet-pay attachment surfaces and any Qeet file-picker. Pass a filename or bare extension to `type` and the component derives the appropriate icon — PDF, image, video, audio, spreadsheet, code, archive, or a generic fallback for unknown types.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileTypeIcon>;

const TYPES = [
  "invoice_Q3.pdf",
  "company_logo.png",
  "onboarding_demo.mp4",
  "meeting_notes.mp3",
  "payroll_June.csv",
  "webhook_handler.ts",
  "release_assets.zip",
  "policy_draft.txt",
  "contract.unknown",
];

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full extension matrix — PDF, image, video, audio, CSV, TypeScript, ZIP, plain text, and the generic fallback for unrecognised file types.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {TYPES.map((t) => (
        <div key={t} className="flex flex-col items-center gap-1">
          <FileTypeIcon type={t} className="size-7" />
          <code className="text-xs text-muted-foreground">{t.split(".").pop()}</code>
        </div>
      ))}
    </div>
  ),
};
