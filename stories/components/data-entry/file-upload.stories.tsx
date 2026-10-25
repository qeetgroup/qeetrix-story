import { Button, Card, Field, Inline, QeetrixProvider, Stack } from "@qeetrix/react";
import { FileUpload, type FileUploadItem } from "@qeetrix/react/experimental";
import { hi } from "@qeetrix/react/locales/hi";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const MB = 1_000_000;

/** SAML metadata files in each state the app can report. */
const ITEMS: FileUploadItem[] = [
  { id: "1", name: "acme-azure-ad-metadata.xml", size: 12_400, status: "done" },
  { id: "2", name: "acme-okta-metadata.xml", size: 15_800, status: "uploading", progress: 60 },
  {
    id: "3",
    name: "old-adfs-metadata.xml",
    size: 9_100,
    status: "error",
    error: "The signing certificate expired on 30/09/2026",
  },
];

/** A file of `bytes` zeros, as a person would pick from their desktop. */
const file = (name: string, bytes: number, type: string) =>
  new File([new Uint8Array(bytes)], name, { type });

/** Drop files on the zone, the same path a drag from the desktop takes. */
const drop = (canvasElement: HTMLElement, files: File[]) => {
  const data = new DataTransfer();
  for (const each of files) data.items.add(each);
  canvasElement
    .querySelector("[data-slot=file-upload-zone]")
    ?.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: data }));
};

const meta: Meta<typeof FileUpload> = {
  title: "Components/Data Entry/FileUpload",
  component: FileUpload,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "experimental" }),
    layout: "centered",
  },
  args: {
    accept: ".xml",
    maxSize: MB,
    onSelect: fn(),
    onRemove: fn(),
  },
  render: (args) => (
    <Field label="Identity provider metadata" style={{ inlineSize: 440 }}>
      <FileUpload {...args} />
    </Field>
  ),
  tags: ["autodocs", "experimental"],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Playground: Story = {};

export const WithItems: Story = {
  name: "With items",
  args: { items: ITEMS },
};

export const States: Story = {
  render: (args) => (
    <Stack gap="lg" style={{ inlineSize: 440 }}>
      <Field label="Identity provider metadata" error="Upload the metadata to continue.">
        <FileUpload {...args} />
      </Field>
      <Field label="Application logo" disabled>
        <FileUpload {...args} accept=".png,.svg" disabled />
      </Field>
    </Stack>
  ),
};

export const Hindi: Story = {
  tags: ["!dev", "!autodocs"],
  args: {
    // The app's own reason is the app's to translate; the statuses come from the pack.
    items: ITEMS.map((item) =>
      item.error ? { ...item, error: "साइनिंग सर्टिफ़िकेट 30/09/2026 को एक्सपायर हो गया" } : item,
    ),
  },
  render: (args) => (
    <QeetrixProvider locale="hi-IN" messages={hi}>
      <Field label="आइडेंटिटी प्रोवाइडर मेटाडेटा" style={{ inlineSize: 440 }}>
        <FileUpload {...args} />
      </Field>
    </QeetrixProvider>
  ),
};

/** Uploads each chosen file with simulated progress, as an app wires FileUpload to its API. */
function MetadataUpload() {
  const [items, setItems] = useState<FileUploadItem[]>([]);
  const next = useRef(0);

  // Each tick moves every upload on by a fifth; a finished one is reported as uploaded.
  useEffect(() => {
    if (!items.some((item) => item.status === "uploading")) return;
    const timer = setTimeout(() => {
      setItems((all) =>
        all.map((item) => {
          if (item.status !== "uploading") return item;
          const progress = Math.min((item.progress ?? 0) + 20, 100);
          return progress === 100 ? { ...item, progress, status: "done" } : { ...item, progress };
        }),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <div style={{ inlineSize: 440 }}>
      <Card
        title="Single sign-on"
        level={3}
        footer={
          <Inline justify="end">
            <Button variant="solid" disabled={!items.some((item) => item.status === "done")}>
              Continue
            </Button>
          </Inline>
        }
      >
        <Field label="Identity provider metadata">
          <FileUpload
            accept=".xml"
            maxSize={MB}
            items={items}
            onSelect={(files) => {
              const added = files.map((each) => {
                next.current += 1;
                return {
                  id: `upload-${next.current}`,
                  name: each.name,
                  size: each.size,
                  status: "uploading" as const,
                  progress: 0,
                };
              });
              setItems((all) => [...all, ...added]);
            }}
            onRemove={(id) => setItems((all) => all.filter((item) => item.id !== id))}
          />
        </Field>
      </Card>
    </div>
  );
}

export const InContext: Story = {
  name: "In context",
  render: () => <MetadataUpload />,
};

export const ChooseInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: files that pass go to onSelect",
  args: { multiple: true },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByLabelText("Identity provider metadata");
    await expect(input).toHaveAttribute("type", "file");
    await expect(input).toHaveAccessibleDescription("XML, up to 1 MB");

    await userEvent.upload(input, [
      file("acme-metadata.xml", 2_000, "application/xml"),
      file("acme-metadata-full.xml", 2 * MB, "application/xml"),
    ]);
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    const [chosen] = (args.onSelect as ReturnType<typeof fn>).mock.calls[0] as [File[]];
    await expect(chosen.map((each) => each.name)).toEqual(["acme-metadata.xml"]);
    await expect(canvas.getByText("Larger than 1 MB")).toBeVisible();
    await expect(canvas.getByText("Not uploaded")).toBeVisible();
  },
};

export const RejectInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: rejected files, and removing them",
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    drop(canvasElement, [
      file("acme-metadata.xml", 2_000, "application/xml"),
      file("notes.txt", 100, "text/plain"),
    ]);
    await waitFor(() => expect(canvas.getByText("Choose one file at a time")).toBeVisible());
    await expect(args.onSelect).toHaveBeenCalledTimes(1);

    drop(canvasElement, [file("notes.txt", 100, "text/plain")]);
    await waitFor(() => expect(canvas.getByText("Only XML files can be used here")).toBeVisible());

    await userEvent.click(canvas.getByRole("button", { name: "Remove notes.txt" }));
    await expect(canvas.queryByText("notes.txt")).not.toBeInTheDocument();
    await expect(canvas.getByLabelText("Identity provider metadata")).toHaveFocus();
  },
};

export const RemoveInteraction: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: remove an item",
  args: { items: ITEMS },
  play: async ({ args, canvas, userEvent }) => {
    await expect(
      canvas.getByRole("progressbar", { name: "Uploading acme-okta-metadata.xml" }),
    ).toHaveAttribute("aria-valuenow", "60");
    await userEvent.click(canvas.getByRole("button", { name: "Remove old-adfs-metadata.xml" }));
    await expect(args.onRemove).toHaveBeenCalledWith("3");
  },
};
