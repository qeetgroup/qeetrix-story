import {
  Button,
  Container,
  DensityProvider,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  NativeSelect,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Foundations/Density",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Density is opt-in. `DensityProvider` activates generated comfortable or compact variables for default-sized controls, field rhythm, and table rows. Explicit component sizes remain explicit overrides.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

function DensitySpecimen({ density }: { density: "comfortable" | "compact" }) {
  return (
    <DensityProvider density={density}>
      <section className="rounded-lg border border-border bg-card p-5 text-card-foreground">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-semibold capitalize">{density}</h2>
            <p className="text-sm text-muted-foreground">
              Controls and vertical rhythm share one generated mode.
            </p>
          </div>
          <Button>Save</Button>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${density}-name`}>Display name</FieldLabel>
            <Input id={`${density}-name`} defaultValue="Ada Lovelace" />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${density}-role`}>Role</FieldLabel>
            <NativeSelect id={`${density}-role`} defaultValue="admin">
              <option value="admin">Administrator</option>
              <option value="member">Member</option>
            </NativeSelect>
          </Field>
        </FieldGroup>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada Lovelace</TableCell>
              <TableCell>Administrator</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grace Hopper</TableCell>
              <TableCell>Member</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </DensityProvider>
  );
}

export const Comparison: Story = {
  render: () => (
    <Container size="wide" className="grid gap-6 py-8 lg:grid-cols-2">
      <DensitySpecimen density="comfortable" />
      <DensitySpecimen density="compact" />
    </Container>
  ),
};
