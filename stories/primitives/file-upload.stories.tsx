import {
  Dropzone,
  FileList,
  type FileRejection,
  FileUploadItem,
  type FileUploadStatus,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof Dropzone> = {
  title: "Primitives/FileUpload",
  component: Dropzone,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A drag-and-drop file dropzone (`Dropzone`) paired with `FileList` and `FileUploadItem` to show per-file upload progress and status. Used in Qeet ID for organization logo uploads, qeet-people for document attachments (offer letters, ID proofs), and qeet-pay for GST invoice imports.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Organization logo upload for a Qeet ID tenant — accepts images and PDFs up to 5 MB.",
      },
    },
  },
  args: { accept: "image/*,.pdf", maxSize: 5 * 1024 * 1024 },
  render: (args) => (
    <div className="max-w-md">
      <Dropzone {...args} onDrop={(a, r) => console.log("accepted", a, "rejected", r)} />
    </div>
  ),
};

export const SingleFile: Story = {
  parameters: {
    docs: {
      description: {
        story: "Single GST invoice import for qeet-pay — restricted to PDF, up to 10 MB.",
      },
    },
  },
  args: { multiple: false, accept: ".pdf", maxSize: 10 * 1024 * 1024 },
  render: (args) => (
    <div className="max-w-md">
      <Dropzone {...args} />
    </div>
  ),
};

export const ItemStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "All three `FileUploadItem` statuses — `success`, `uploading`, and `error` — as seen in a qeet-people document upload queue.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <FileList>
        <FileUploadItem
          file={{
            name: "grace-hopper-offer-letter.pdf",
            size: 2_400_000,
            type: "application/pdf",
          }}
          status="success"
          onRemove={() => {}}
        />
        <FileUploadItem
          file={{
            name: "ada-lovelace-passport.png",
            size: 840_000,
            type: "image/png",
          }}
          status="uploading"
          progress={62}
        />
        <FileUploadItem
          file={{
            name: "acme-gst-invoice-jun26.zip",
            size: 90_000_000,
            type: "application/zip",
          }}
          status="error"
          error="Larger than 5 MB — split into individual PDFs."
          onRemove={() => {}}
        />
      </FileList>
    </div>
  ),
};

type Row = {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number;
  status: FileUploadStatus;
};

export const Managed: Story = {
  render: () => {
    const [rows, setRows] = React.useState<Row[]>([]);
    const [rejections, setRejections] = React.useState<FileRejection[]>([]);

    function add(accepted: File[], rejected: FileRejection[]) {
      setRejections(rejected);
      const next = accepted.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: "uploading" as FileUploadStatus,
      }));
      setRows((prev) => [...prev, ...next]);
      // Simulate an upload that fills the progress bar then resolves.
      next.forEach((row) => {
        const timer = setInterval(() => {
          setRows((prev) =>
            prev.map((r) => {
              if (r.id !== row.id) return r;
              const progress = Math.min(r.progress + 20, 100);
              return {
                ...r,
                progress,
                status: progress === 100 ? "success" : "uploading",
              };
            }),
          );
        }, 400);
        setTimeout(() => clearInterval(timer), 2400);
      });
    }

    return (
      <div className="flex max-w-md flex-col gap-3">
        <Dropzone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={5} onDrop={add} />
        {rejections.length > 0 && (
          <ul className="text-xs text-destructive">
            {rejections.map((r) => (
              <li key={`${r.file.name}-${r.reason}`}>{r.message}</li>
            ))}
          </ul>
        )}
        {rows.length > 0 && (
          <FileList>
            {rows.map((r) => (
              <FileUploadItem
                key={r.id}
                file={r.file}
                previewUrl={r.previewUrl}
                progress={r.progress}
                status={r.status}
                onRemove={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
              />
            ))}
          </FileList>
        )}
      </div>
    );
  },
};
