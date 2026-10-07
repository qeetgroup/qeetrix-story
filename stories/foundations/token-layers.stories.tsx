import {
  Button,
  CHART_COLOR,
  COMPONENT,
  Container,
  DURATION,
  SHADOW,
  STATE_OPACITY,
  Z_INDEX,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Foundations/Token Layers",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Beyond colour, the semantic layer covers interaction state, component layout, chart, elevation and stacking roles. Typed values (`CHART_COLOR`, `COMPONENT`, `DURATION`, `SHADOW`, `STATE_OPACITY`, `Z_INDEX`) are generated from the same DTCG source as the runtime CSS, so a value read in JavaScript cannot drift from the one the stylesheet paints.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const chartSeries = Object.entries(CHART_COLOR).filter(([key]) => key.startsWith("series"));

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-t border-border py-2 first:border-t-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm text-foreground">{value}</dd>
    </div>
  );
}

export const Overview: Story = {
  render: () => (
    <Container data-slot="token-layer-specimen" size="wide" className="space-y-10 py-8">
      <section>
        <h2 className="font-heading text-xl font-semibold">Semantic chart palette</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Eight categorical roles adapt to light and dark themes. Grid, axis, reference, positive,
          negative, and warning roles are separate from series identity.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {chartSeries.map(([name, color], index) => (
            <div key={name} className="overflow-hidden rounded-md border border-border bg-card">
              <span
                data-chart-series={index + 1}
                className="block h-14"
                style={{ background: color }}
              />
              <span className="block px-2 py-1.5 font-mono text-xs text-muted-foreground">
                series {index + 1}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(["grid", "axis", "reference", "positive", "negative", "warning"] as const).map(
            (role) => (
              <div key={role} className="rounded-md border border-border bg-card p-2">
                <span
                  className="block h-2 rounded-full"
                  style={{ background: CHART_COLOR[role] }}
                />
                <span className="mt-2 block font-mono text-xs text-muted-foreground">{role}</span>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-base font-semibold">State</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Disabled utilities resolve through one authored opacity token. The primary button is the
            exception — it turns neutral instead of fading — so the specimen is an outline one.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="outline" disabled>
              Unavailable
            </Button>
            <code className="font-mono text-xs text-muted-foreground">
              {STATE_OPACITY.disabled}
            </code>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-base font-semibold">Component layout</h2>
          <dl className="mt-3">
            <Metric label="sidebar.default" value={COMPONENT.sidebar.width.default} />
            <Metric label="sidebar.mobile" value={COMPONENT.sidebar.width.mobile} />
            <Metric label="tour.cardWidth" value={COMPONENT.tour.cardWidth} />
            <Metric label="tour.offset" value={COMPONENT.tour.offset} />
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-base font-semibold">Runtime parity</h2>
          <dl className="mt-3">
            <Metric label="duration.standard" value={`${DURATION.standard}ms`} />
            <Metric label="z.toast" value={Z_INDEX.toast} />
            <Metric label="z.tour" value={Z_INDEX.tour} />
            <Metric label="shadow.insetSubtle" value={SHADOW.insetSubtle} />
          </dl>
        </div>
      </section>
    </Container>
  ),
};
