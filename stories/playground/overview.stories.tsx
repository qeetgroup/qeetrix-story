import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Overview } from "./_overview";
import { FAMILIES } from "./catalog";

/**
 * The tests behind Components/Overview (overview.mdx). Every story here is hidden: the page itself
 * is the MDX doc, and this file only checks it.
 */
const meta: Meta = {
  title: "Internal/Overview",
  parameters: { layout: "padded" },
  tags: ["!autodocs"],
  render: () => <Overview />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EveryExportHasATile: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: every export has a tile and a preview",
  play: async ({ canvas, canvasElement }) => {
    // Families come from the package's exports, so a new export adds a tile by itself; one with
    // no preview in catalog.tsx fails here.
    await expect(canvasElement.querySelectorAll("[data-family]")).toHaveLength(FAMILIES.length);
    await expect(canvasElement.querySelectorAll("[data-preview]")).toHaveLength(FAMILIES.length);
    for (const family of FAMILIES) {
      await expect(canvas.getByRole("heading", { level: 3, name: family.name })).toBeVisible();
    }
    // Every link opens a component's docs page in the workshop around this frame.
    for (const link of canvas.getAllByRole("link")) {
      await expect(link).toHaveAttribute("href", expect.stringMatching(/^\.\/\?path=\/docs\//));
      await expect(link).toHaveAttribute("target", "_top");
    }
  },
};

export const SearchAndStatus: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Interaction: search and status narrow the tiles",
  play: async ({ canvas, canvasElement, userEvent }) => {
    const tiles = () => [...canvasElement.querySelectorAll<HTMLElement>("[data-family]")];
    const search = canvas.getByRole("searchbox", { name: "Find a component" });
    // A part's name finds its family: DialogTrigger is a Dialog part.
    await userEvent.type(search, "dialogtrigger");
    await waitFor(() => expect(tiles().map((tile) => tile.dataset.family)).toEqual(["Dialog"]));
    await userEvent.clear(search);

    await userEvent.click(canvas.getByRole("button", { name: "Experimental" }));
    await waitFor(() => expect(tiles().length).toBeLessThan(FAMILIES.length));
    const experimental = FAMILIES.filter((family) => family.status === "experimental");
    await expect(tiles()).toHaveLength(experimental.length);

    await userEvent.type(search, "zzz");
    await expect(await canvas.findByText("No components match")).toBeVisible();
  },
};
