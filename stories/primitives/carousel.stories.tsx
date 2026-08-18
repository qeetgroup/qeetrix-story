import {
  AspectRatio,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@qeetrix/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Carousel> = {
  title: "Primitives/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A touch- and keyboard-accessible embla-powered carousel. Use it on qeet.in landing pages for testimonial sliders or feature walkthroughs, and in qeet-docs for multi-step screenshot sequences. `orientation` supports both horizontal and vertical layouts; `opts.loop` enables infinite looping.",
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
