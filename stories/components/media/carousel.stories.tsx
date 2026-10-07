import {
  AspectRatio,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { qx } from "../../_contract";

const meta: Meta<typeof Carousel> = {
  title: "Components/Media/Carousel",
  component: Carousel,
  parameters: {
    qeetrix: qx({ category: "media", status: "stable" }),
    layout: "centered",
    docs: {
      description: {
        component:
          'A touch- and keyboard-accessible embla-powered carousel. Use it on qeet.in landing pages for testimonial sliders or feature walkthroughs, and in qeet-docs for multi-step screenshot sequences. `orientation` supports both horizontal and vertical layouts; `opts.loop` enables infinite looping.\n\n`CarouselPrevious` / `CarouselNext` on their own float as round buttons outside the slides\' edges, which assumes the page has room either side. Wrap them in `CarouselControls` and they render in a row beneath the slides instead, so the carousel fits a card, a narrow panel or a drawer. `CarouselIndicators` renders one button per scroll snap, the current one marked `aria-current` and drawn as a wider pill; it is a single tab stop, and while focus is on it the arrow keys move both the slide and the focus. A move the user asks for is announced politely ("2 of 5"); a drag or an autoplay tick is not.',
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Carousel>;

const STEPS = [
  {
    label: "Create org",
    detail: "Set a slug and display name — takes 10 seconds.",
  },
  {
    label: "Invite members",
    detail: "Send email invitations or share a join link.",
  },
  { label: "Assign roles", detail: "Owner · Admin · Member · Billing Admin." },
  {
    label: "Enable passkeys",
    detail: "One toggle in Security → Authentication policy.",
  },
  { label: "Go live", detail: "Point your app at id.qeet.in and you're done." },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A looping step-by-step walkthrough — well-suited for onboarding flows in qeet-docs or in-app setup wizards.",
      },
    },
  },
  render: () => (
    <Carousel className="w-72" opts={{ loop: true }}>
      <CarouselContent>
        {STEPS.map((step, i) => (
          <CarouselItem key={step.label}>
            <Card>
              <CardContent className="flex aspect-square flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="text-4xl font-bold tabular-nums">{i + 1}</span>
                <span className="text-base font-semibold">{step.label}</span>
                <span className="text-sm text-muted-foreground">{step.detail}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

const PLANS = [
  "Starter",
  "Growth",
  "Business",
  "Enterprise",
  "Team",
  "Developer",
  "Agency",
  "Custom",
];

export const MultiPerView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three-up layout for pricing plan tiles or feature category cards — `basis-1/3` shows three items at once.",
      },
    },
  },
  render: () => (
    <Carousel className="w-96" opts={{ align: "start" }}>
      <CarouselContent>
        {PLANS.map((plan) => (
          <CarouselItem key={plan} className="basis-1/3">
            <div className="flex h-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
              {plan}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <Carousel className="w-80">
      <CarouselContent>
        {[
          "1469474968028-56623f02e42e",
          "1500530855697-b586d89ba3ee",
          "1465146344425-f00d5f5c8f07",
        ].map((id) => (
          <CarouselItem key={id}>
            <AspectRatio ratio={16 / 9} className="rounded-md border">
              <img
                src={`https://images.unsplash.com/photo-${id}?w=640&q=80`}
                alt=""
                className="size-full object-cover"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Carousel orientation="vertical" className="h-64" opts={{ loop: true }}>
      <CarouselContent className="h-64">
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n} className="basis-1/2">
            <div className="flex h-full items-center justify-center rounded-md bg-muted text-2xl font-medium">
              {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/** The in-flow layout: Previous, the indicators and Next in one row under the slides. */
function SetupStepsCarousel() {
  return (
    <Carousel className="w-72" aria-label="Qeet ID setup steps">
      <CarouselContent>
        {STEPS.map((step, i) => (
          <CarouselItem key={step.label}>
            <Card>
              <CardContent className="flex aspect-square flex-col items-center justify-center gap-2 p-6 text-center">
                <span className="text-4xl font-bold tabular-nums">{i + 1}</span>
                <span className="text-base font-semibold">{step.label}</span>
                <span className="text-sm text-muted-foreground">{step.detail}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls>
        <CarouselPrevious />
        <CarouselIndicators aria-label="Choose a step" />
        <CarouselNext />
      </CarouselControls>
    </Carousel>
  );
}

export const WithControls: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`CarouselControls` puts Previous, `CarouselIndicators` and Next in a row beneath the slides, so nothing hangs outside the carousel\'s box — the layout for a card or a narrow onboarding panel. The current indicator is a wider brand pill, so shape and not hue alone carries "current", and each indicator keeps a 24px target however small the visible mark.',
      },
    },
  },
  render: () => <SetupStepsCarousel />,
};

export const IndicatorsInteraction: Story = {
  name: "Interaction: indicators pick a slide",
  parameters: {
    docs: {
      description: {
        story:
          "Indicators are a picker, not a row of tab stops: clicking one moves `aria-current` to it, and with focus on the indicators the arrow keys move the slide and carry focus to the new current indicator. Next goes `aria-disabled` at the last step but stays focusable, so pressing it never drops focus to the page.",
      },
    },
  },
  render: () => <SetupStepsCarousel />,
  play: async ({ canvas, userEvent }) => {
    const indicator = (n: number) => canvas.getByRole("button", { name: `${n} of 5` });

    await waitFor(() => expect(indicator(1)).toHaveAttribute("aria-current", "true"));

    await userEvent.click(indicator(3));
    await waitFor(() => expect(indicator(3)).toHaveAttribute("aria-current", "true"));
    await expect(indicator(1)).not.toHaveAttribute("aria-current");

    // Arrow keys from an indicator move the slide, and focus follows the current indicator.
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(indicator(4)).toHaveAttribute("aria-current", "true"));
    await waitFor(() => expect(indicator(4)).toHaveFocus());

    await userEvent.click(indicator(5));
    const next = canvas.getByRole("button", { name: "Next slide" });
    await waitFor(() => expect(next).toHaveAttribute("aria-disabled", "true"));
  },
};
