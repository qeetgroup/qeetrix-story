import { EyeIcon, EyeOffIcon, SearchIcon, XIcon } from "@qeetrix/icons";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { expect } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof InputGroup> = {
  title: "Components/Forms/InputGroup",
  component: InputGroup,
  parameters: {
    qeetrix: qx({ category: "forms", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'Composes an `InputGroupInput` with one or two `InputGroupAddon` elements to show inline prefixes or suffixes. Common uses include currency symbols for qeet-pay invoice amounts, `https://` prefixes for custom domain configuration in Qeet ID, and unit suffixes like `days` for token expiry settings. The group owns the border and every state (hover, focus, invalid, read-only, disabled), read from the input inside it.\n\nAddons come in two shapes: `variant="inline"` (the default) sits on the field surface for icons, symbols and units; `variant="segment"` is a divided, tinted cell for fixed text the user cannot change. Put actions — clear, copy, reveal — in an addon as `InputGroupButton`s: the addon tightens around them so the button sits flush, and the button defaults to `type="button"` so it never submits a form. Always give an `InputGroupButton` an `aria-label`.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Currency: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Invoice amount entry for qeet-pay — prefix shows currency symbol, suffix shows ISO code.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <InputGroup>
        <InputGroupAddon align="start">₹</InputGroupAddon>
        <InputGroupInput placeholder="0.00" inputMode="decimal" />
        <InputGroupAddon align="end">INR</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const UrlPrefix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Custom domain entry in Qeet ID — the protocol prefix is locked while the user types their subdomain. Fixed text like this is a `segment` addon, so it reads as part of the frame rather than as typed content.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="start" variant="segment">
          https://
        </InputGroupAddon>
        <InputGroupInput placeholder="login.acme.com" />
      </InputGroup>
    </div>
  ),
};

export const Units: Story = {
  parameters: {
    docs: {
      description: {
        story: "Token expiry configuration — numeric value with a time-unit suffix baked in.",
      },
    },
  },
  render: () => (
    <div className="w-56">
      <InputGroup>
        <InputGroupInput placeholder="90" inputMode="numeric" />
        <InputGroupAddon align="end">days</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const AddonVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`inline` (top) keeps a decorative icon on the writing surface, 8px from the text it introduces. `segment` (bottom) draws a tinted, divided cell on either side — here the fixed `https://` scheme and the `.qeet.in` suffix around a tenant subdomain — and rounds its own outer corners.",
      },
    },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <InputGroup>
        <InputGroupAddon align="start" variant="inline">
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput type="search" aria-label="Search members" placeholder="Search members" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="start" variant="segment">
          https://
        </InputGroupAddon>
        <InputGroupInput aria-label="Tenant subdomain" defaultValue="acme" />
        <InputGroupAddon align="end" variant="segment">
          .qeet.in
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

function ClearableSearch() {
  const [query, setQuery] = React.useState("ada@acme.com");
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="start">
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          type="search"
          aria-label="Search audit log"
          placeholder="Actor, IP or event ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <InputGroupAddon align="end">
            <InputGroupButton
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                // The button unmounts with the query, so focus would fall to <body>.
                inputRef.current?.focus();
              }}
            >
              <XIcon aria-hidden />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}

export const ClearButton: Story = {
  name: "Interaction: clear button empties the field",
  parameters: {
    docs: {
      description: {
        story:
          "An `InputGroupButton` in an end addon clears a qeet-logs audit search. The button only exists while there is something to clear, so the story hands focus back to the input — otherwise it falls to the page when the button unmounts. The test asserts the value is gone, the button with it, and focus is back in the field.",
      },
    },
  },
  render: () => <ClearableSearch />,
  play: async ({ canvas, userEvent }) => {
    const search = canvas.getByRole("searchbox", { name: "Search audit log" });
    await expect(search).toHaveValue("ada@acme.com");

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));

    await expect(search).toHaveValue("");
    await expect(search).toHaveFocus();
    await expect(canvas.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  },
};

function RevealableSecret() {
  const [revealed, setRevealed] = React.useState(false);
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput
          type={revealed ? "text" : "password"}
          aria-label="Client secret"
          readOnly
          defaultValue="qid_live_8f2c1a9b4e7d"
          className="font-mono"
        />
        <InputGroupAddon align="end">
          <InputGroupButton
            aria-label="Show client secret"
            aria-pressed={revealed}
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export const RevealButton: Story = {
  name: "Interaction: reveal button toggles the secret",
  parameters: {
    docs: {
      description: {
        story:
          "A Qeet ID OIDC client secret, masked until the reveal `InputGroupButton` is pressed. The button is a toggle — one stable name with `aria-pressed` — rather than a label that flips between Show and Hide, so a screen reader hears the state change instead of a different control.",
      },
    },
  },
  render: () => <RevealableSecret />,
  play: async ({ canvas, userEvent }) => {
    const secret = canvas.getByLabelText("Client secret");
    const toggle = canvas.getByRole("button", { name: "Show client secret" });
    await expect(secret).toHaveAttribute("type", "password");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    // Never a submit button, even inside a form.
    await expect(toggle).toHaveAttribute("type", "button");

    await userEvent.click(toggle);
    await expect(secret).toHaveAttribute("type", "text");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(toggle);
    await expect(secret).toHaveAttribute("type", "password");
  },
};
