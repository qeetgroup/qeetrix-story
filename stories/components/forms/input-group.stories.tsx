import { InputGroup, InputGroupAddon, InputGroupInput } from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
          "Composes an `InputGroupInput` with one or two `InputGroupAddon` elements to show inline prefixes or suffixes. Common uses include currency symbols for qeet-pay invoice amounts, `https://` prefixes for custom domain configuration in Qeet ID, and unit suffixes like `days` for token expiry settings.",
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
          "Custom domain entry in Qeet ID — the protocol prefix is locked while the user types their subdomain.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="start">https://</InputGroupAddon>
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
