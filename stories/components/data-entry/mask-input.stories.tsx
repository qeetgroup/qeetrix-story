import { Label, MaskInput } from "@qeetrix/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { qx } from "../../_contract";

const meta: Meta<typeof MaskInput> = {
  title: "Components/Data Entry/MaskInput",
  component: MaskInput,
  parameters: {
    qeetrix: qx({ category: "data-entry", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A single `<Input>` that formats user input according to a declarative mask string. Mask characters: `#` = digit (0–9), `A` = letter (a–z A–Z), `*` = alphanumeric — any other character is treated as a literal that is auto-inserted and non-editable. Supports **controlled** mode (`value` + `onValueChange`) and **uncontrolled** mode (`defaultValue`). `onValueChange` receives both the raw accepted-characters string and the formatted display value. `inputMode` is inferred automatically — `"numeric"` when all input slots are `#`, `"text"` otherwise.',
      },
    },
  },
  argTypes: {
    mask: {
      control: "text",
      description:
        "The mask string. `#` = digit, `A` = alpha, `*` = alphanumeric, other = literal.",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MaskInput>;

export const Phone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "US phone number — digits auto-inserted into `+1 (###) ###-####`. Used on the Qeet People employee profile and Qeet Notify sender-verification screens.",
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="phone">Phone number</Label>
      <MaskInput id="phone" mask="+1 (###) ###-####" aria-label="US phone number" />
    </div>
  ),
};

export const CreditCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '16-digit card number formatted in four groups of four — used in Qeet Pay\'s payment method entry form. `inputMode` is inferred as `"numeric"` automatically.',
      },
    },
  },
  render: () => (
    <div className="flex w-56 flex-col gap-2">
      <Label htmlFor="card-number">Card number</Label>
      <MaskInput id="card-number" mask="####-####-####-####" aria-label="Credit card number" />
    </div>
  ),
};

export const DateMask: Story = {
  name: "Date",
  parameters: {
    docs: {
      description: {
        story:
          "Date of birth in `DD/MM/YYYY` format with an explicit placeholder — fires `onValueChange` with the raw digit string and the formatted value on each keystroke.",
      },
    },
  },
  render: () => (
    <div className="flex w-44 flex-col gap-2">
      <Label htmlFor="dob">Date of birth</Label>
      <MaskInput id="dob" mask="##/##/####" placeholder="DD/MM/YYYY" aria-label="Date of birth" />
    </div>
  ),
};

export const IBAN: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "IBAN entry — `A` slots accept letters only (country code); `#` slots accept digits (check digits + BBAN). Used in Qeet Pay's bank-account verification flow.",
      },
    },
  },
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="iban">IBAN</Label>
      <MaskInput id="iban" mask="AA## #### ####" aria-label="International bank account number" />
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode — the parent owns `value` via `onValueChange`. The raw digit string and the formatted display value are both exposed so you can validate or store whichever form you need.",
      },
    },
  },
  render: () => {
    const [formatted, setFormatted] = useState("");
    const [raw, setRaw] = useState("");
    return (
      <div className="flex w-64 flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone-controlled">Phone number</Label>
          <MaskInput
            id="phone-controlled"
            mask="+1 (###) ###-####"
            value={formatted}
            onValueChange={(r, fmt) => {
              setRaw(r);
              setFormatted(fmt);
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Raw digits: <span className="font-mono text-foreground">{raw || "—"}</span>
        </p>
      </div>
    );
  },
};
