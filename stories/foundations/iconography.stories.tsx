import type { IconProps } from "@qeetrix/icons";
import { BellIcon } from "@qeetrix/icons/icons/bell";
import { CheckIcon } from "@qeetrix/icons/icons/check";
import { ChevronDownIcon } from "@qeetrix/icons/icons/chevron-down";
import { CircleAlertIcon } from "@qeetrix/icons/icons/circle-alert";
import { CircleCheckIcon } from "@qeetrix/icons/icons/circle-check";
import { CopyIcon } from "@qeetrix/icons/icons/copy";
import { DownloadIcon } from "@qeetrix/icons/icons/download";
import { EllipsisIcon } from "@qeetrix/icons/icons/ellipsis";
import { FunnelIcon } from "@qeetrix/icons/icons/funnel";
import { HouseIcon } from "@qeetrix/icons/icons/house";
import { InfoIcon } from "@qeetrix/icons/icons/info";
import { KeyRoundIcon } from "@qeetrix/icons/icons/key-round";
import { LayoutDashboardIcon } from "@qeetrix/icons/icons/layout-dashboard";
import { LockIcon } from "@qeetrix/icons/icons/lock";
import { LogOutIcon } from "@qeetrix/icons/icons/log-out";
import { MailIcon } from "@qeetrix/icons/icons/mail";
import { PencilIcon } from "@qeetrix/icons/icons/pencil";
import { PlusIcon } from "@qeetrix/icons/icons/plus";
import { ScanFaceIcon } from "@qeetrix/icons/icons/scan-face";
import { SearchIcon } from "@qeetrix/icons/icons/search";
import { SettingsIcon } from "@qeetrix/icons/icons/settings";
import { ShieldCheckIcon } from "@qeetrix/icons/icons/shield-check";
import { StarIcon } from "@qeetrix/icons/icons/star";
import { TrashIcon } from "@qeetrix/icons/icons/trash";
import { TriangleAlertIcon } from "@qeetrix/icons/icons/triangle-alert";
import { UserIcon } from "@qeetrix/icons/icons/user";
import { UsersIcon } from "@qeetrix/icons/icons/users";
import {
  Badge,
  Button,
  IconButton,
  Input,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Select,
  Tab,
  Tabs,
  TabsList,
  Text,
  Toggle,
} from "@qeetrix/react";
import { ICON_SIZE, ICON_STROKE } from "@qeetrix/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { expect } from "storybook/test";

import { CopyToken, Group, Specimen, SpecimenRow, SpecimenRows } from "../_helpers";
import "./_iconography.css";

const meta: Meta = {
  title: "Foundations/Iconography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Icons from `@qeetrix/icons`, drawn on a 24-unit grid in round and sharp shapes. Components take one as `icon={PlusIcon}` and size it for you.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

type Outline = ComponentType<IconProps<"outline">>;
type Fillable = ComponentType<IconProps<"outline" | "filled">>;

/** The drawing grid, in units: every icon's viewBox is 24 × 24. */
const GRID = 24;

const SIZES = (Object.entries(ICON_SIZE) as Array<[keyof typeof ICON_SIZE, number]>).sort(
  (a, b) => a[1] - b[1],
);
const STROKES = (Object.entries(ICON_STROKE) as Array<[keyof typeof ICON_STROKE, number]>).sort(
  (a, b) => b[1] - a[1],
);

/**
 * An icon magnified on a pixel grid: the box is the size token times four, one square per pixel,
 * so the box and the stroke can be counted.
 */
function PixelGrid({ box, children }: { box: string; children: ReactNode }) {
  return (
    <span className="qx-ico-grid" style={{ "--qx-ico-box": box } as CSSProperties}>
      {children}
    </span>
  );
}

/** The same five icons in every row, so only the size or the stroke changes. */
const STRIP: Array<{ Icon: Outline; id: string }> = [
  { Icon: SettingsIcon, id: "settings" },
  { Icon: SearchIcon, id: "search" },
  { Icon: BellIcon, id: "bell" },
  { Icon: UsersIcon, id: "users" },
  { Icon: ShieldCheckIcon, id: "shield-check" },
];

/** One size or stroke: magnified on its grid, then the strip at actual size. */
function ScaleSample({ box, stroke }: { box: string; stroke?: string }) {
  const style = stroke ? { strokeWidth: stroke } : undefined;
  return (
    <div className="qx-ico-sample" aria-hidden="true">
      <span className="qx-ico-zoom">
        <PixelGrid box={box}>
          <SettingsIcon shape="sharp" size="100%" style={style} />
        </PixelGrid>
      </span>
      <span className="qx-ico-strip">
        {STRIP.map(({ Icon, id }) => (
          <Icon key={id} shape="sharp" size={box} style={style} />
        ))}
      </span>
    </div>
  );
}

/** The stroke a box draws: the regular stroke is in grid units, so it scales with the box. */
const renderedStroke = (px: number) => Number(((ICON_STROKE.regular * px) / GRID).toFixed(2));

/* ── Size and stroke ──────────────────────────────────────────────────────── */

export const Sizes: Story = {
  name: "Size and stroke",
  parameters: {
    docs: {
      description: {
        story:
          "Four box sizes and two stroke weights, magnified on the pixel grid, then actual size.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Group label="Sizes" aside="Magnified 4×: one square is one pixel">
        <SpecimenRows>
          {SIZES.map(([name, px]) => (
            <SpecimenRow
              key={name}
              token={`--qx-size-icon-${name}`}
              meta={
                <>
                  {px}px · ICON_SIZE.{name}
                  <span className="qx-ico-meta-line">stroke {renderedStroke(px)}px</span>
                </>
              }
            >
              <ScaleSample box={`var(--qx-size-icon-${name})`} />
            </SpecimenRow>
          ))}
        </SpecimenRows>
      </Group>
      <Group label="Stroke" aside="In grid units, so a stroke scales with its box">
        <SpecimenRows>
          {STROKES.map(([name, width]) => (
            <SpecimenRow
              key={name}
              token={`--qx-icon-stroke-${name}`}
              meta={`${width} · ICON_STROKE.${name}`}
            >
              <ScaleSample box="var(--qx-size-icon-lg)" stroke={`var(--qx-icon-stroke-${name})`} />
            </SpecimenRow>
          ))}
        </SpecimenRows>
      </Group>
    </Specimen>
  ),
};

/* ── Shapes ───────────────────────────────────────────────────────────────── */

/** Icons with a filled drawing, so every shape and variant exists. */
const SPECIMENS: Array<{ Icon: Fillable; id: string }> = [
  { Icon: StarIcon, id: "star" },
  { Icon: BellIcon, id: "bell" },
  { Icon: ShieldCheckIcon, id: "shield-check" },
  { Icon: KeyRoundIcon, id: "key-round" },
  { Icon: UsersIcon, id: "users" },
  { Icon: HouseIcon, id: "house" },
];

type Shape = "round" | "sharp";
type Variant = "outline" | "filled";

/** One drawing style: a magnified icon and the specimen set, captioned with its prop. */
function Plate({
  title,
  prop,
  note,
  Detail,
  shape,
  variant,
}: {
  title: string;
  prop: string;
  note: string;
  Detail: Fillable;
  shape: Shape;
  variant: Variant;
}) {
  return (
    <figure className="qx-ico-plate">
      <div className="qx-ico-plate-stage" aria-hidden="true">
        <PixelGrid box="var(--qx-size-icon-lg)">
          <Detail shape={shape} variant={variant} size="100%" />
        </PixelGrid>
        <span className="qx-ico-plate-set">
          {SPECIMENS.map(({ Icon, id }) => (
            <Icon key={id} shape={shape} variant={variant} size="var(--qx-size-icon-lg)" />
          ))}
        </span>
      </div>
      <figcaption className="qx-ico-plate-caption">
        <span className="qx-ico-plate-head">
          <span className="qx-ico-plate-title">{title}</span>
          <CopyToken value={prop} />
        </span>
        <span className="qx-ico-plate-note">{note}</span>
      </figcaption>
    </figure>
  );
}

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Every icon has both shapes. Components draw sharp; a filled drawing marks selection.",
      },
    },
  },
  render: () => (
    <Specimen>
      <Group label="Shape">
        <div className="qx-ico-plates">
          <Plate
            title="Round"
            prop='shape="round"'
            note="Lucide's round caps and joins. The default."
            Detail={KeyRoundIcon}
            shape="round"
            variant="outline"
          />
          <Plate
            title="Sharp"
            prop='shape="sharp"'
            note="Square caps, mitered joins, squared corners. What every component draws."
            Detail={KeyRoundIcon}
            shape="sharp"
            variant="outline"
          />
        </div>
      </Group>
      <Group label="Variant">
        <div className="qx-ico-plates">
          <Plate
            title="Outline"
            prop='variant="outline"'
            note="Every icon has one. The default."
            Detail={BellIcon}
            shape="sharp"
            variant="outline"
          />
          <Plate
            title="Filled"
            prop='variant="filled"'
            note="Only where a solid form means something: a selected tab, a pressed toggle."
            Detail={BellIcon}
            shape="sharp"
            variant="filled"
          />
        </div>
      </Group>
    </Specimen>
  ),
};

/* ── In components ────────────────────────────────────────────────────────── */

/**
 * A live component and the icon size it draws, read from the rendered `<svg>` rather than
 * written down, so the label can't drift from the library.
 */
function Demo({ name, children }: { name: string; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState<number>();
  useEffect(() => {
    const width = stage.current?.querySelector("svg")?.getAttribute("width");
    setPx(width ? Number(width) : undefined);
  }, []);
  const token = SIZES.find(([, value]) => value === px)?.[0];
  return (
    <div className="qx-ico-demo">
      <div ref={stage} className="qx-ico-demo-stage">
        {children}
      </div>
      <div className="qx-ico-demo-meta">
        <span className="qx-ico-demo-name">{name}</span>
        {px ? (
          <code className="qx-ico-demo-size">{token ? `${px}px · ${token}` : `${px}px`}</code>
        ) : null}
      </div>
    </div>
  );
}

export const InComponents: Story = {
  name: "In components",
  parameters: {
    docs: {
      description: {
        story:
          "Components size the icon for you: 16px in a control, 20px in a large one. Read live.",
      },
    },
  },
  render: () => (
    <Specimen>
      <div className="qx-ico-demos">
        <Demo name="Button">
          <Button icon={PlusIcon}>Invite users</Button>
        </Demo>
        <Demo name="Button, large">
          <Button size="lg" variant="soft" icon={KeyRoundIcon}>
            Rotate keys
          </Button>
        </Demo>
        <Demo name="IconButton">
          <IconButton icon={SettingsIcon} aria-label="Organisation settings" variant="soft" />
        </Demo>
        <Demo name="Input">
          <span className="qx-ico-demo-fill">
            <Input icon={SearchIcon} aria-label="Search users" placeholder="Search users" />
          </span>
        </Demo>
        <Demo name="Select">
          <span className="qx-ico-demo-fill">
            <Select
              aria-label="Role"
              items={[
                { value: "admin", label: "Admin" },
                { value: "member", label: "Member" },
              ]}
              defaultValue="member"
            />
          </span>
        </Demo>
        <Demo name="Menu">
          <Menu>
            <MenuTrigger
              render={
                <Button variant="soft" icon={ChevronDownIcon}>
                  Actions
                </Button>
              }
            />
            <MenuContent>
              <MenuItem icon={PencilIcon}>Rename</MenuItem>
              <MenuItem icon={CopyIcon}>Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem icon={TrashIcon} tone="danger">
                Delete
              </MenuItem>
            </MenuContent>
          </Menu>
        </Demo>
        <Demo name="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <Tab value="overview" icon={HouseIcon} filledWhenSelected>
                Home
              </Tab>
              <Tab value="users" icon={UsersIcon} filledWhenSelected>
                Users
              </Tab>
            </TabsList>
          </Tabs>
        </Demo>
        <Demo name="Toggle">
          <Toggle icon={StarIcon} filledWhenPressed defaultPressed aria-label="Favourite" />
          <Toggle icon={BellIcon} filledWhenPressed aria-label="Notifications" />
        </Demo>
        <Demo name="Badge">
          <Badge tone="success" icon={CircleCheckIcon}>
            Verified
          </Badge>
        </Demo>
      </div>
    </Specimen>
  ),
};

/* ── Common icons ─────────────────────────────────────────────────────────── */

type Tone = "info" | "success" | "warning" | "danger";

interface Glyph {
  Icon: Outline;
  id: string;
  /** Status icons paint their tone's icon colour, the way Toast draws them. */
  tone?: Tone;
}

const COMMON: Array<{ label: string; aside?: string; icons: Glyph[] }> = [
  {
    label: "Actions",
    icons: [
      { Icon: PlusIcon, id: "plus" },
      { Icon: PencilIcon, id: "pencil" },
      { Icon: CopyIcon, id: "copy" },
      { Icon: TrashIcon, id: "trash" },
      { Icon: DownloadIcon, id: "download" },
      { Icon: SearchIcon, id: "search" },
      { Icon: FunnelIcon, id: "funnel" },
      { Icon: EllipsisIcon, id: "ellipsis" },
    ],
  },
  {
    label: "Status",
    aside: "The tone icons Toast draws",
    icons: [
      { Icon: InfoIcon, id: "info", tone: "info" },
      { Icon: CircleCheckIcon, id: "circle-check", tone: "success" },
      { Icon: TriangleAlertIcon, id: "triangle-alert", tone: "warning" },
      { Icon: CircleAlertIcon, id: "circle-alert", tone: "danger" },
    ],
  },
  {
    label: "Identity and access",
    icons: [
      { Icon: UserIcon, id: "user" },
      { Icon: UsersIcon, id: "users" },
      { Icon: KeyRoundIcon, id: "key-round" },
      { Icon: LockIcon, id: "lock" },
      { Icon: ShieldCheckIcon, id: "shield-check" },
      { Icon: ScanFaceIcon, id: "scan-face" },
      { Icon: MailIcon, id: "mail" },
      { Icon: LogOutIcon, id: "log-out" },
    ],
  },
  {
    label: "Navigation",
    icons: [
      { Icon: HouseIcon, id: "house" },
      { Icon: LayoutDashboardIcon, id: "layout-dashboard" },
      { Icon: SettingsIcon, id: "settings" },
      { Icon: BellIcon, id: "bell" },
    ],
  },
];

/** `circle-check` → `CircleCheckIcon`: the export is the id in PascalCase plus `Icon`. */
const componentName = (id: string) =>
  `${id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}Icon`;

/** One icon: click the tile to copy its import statement. */
function GlyphTile({ Icon, id, tone }: Glyph) {
  const [copied, setCopied] = useState(false);
  const name = componentName(id);
  const statement = `import { ${name} } from "@qeetrix/icons/icons/${id}";`;
  const copy = () => {
    void navigator.clipboard?.writeText(statement).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <div className="qx-ico-tile">
      <span
        className="qx-ico-tile-well"
        style={tone ? { color: `var(--qx-color-icon-${tone})` } : undefined}
      >
        <Icon shape="sharp" size="var(--qx-size-icon-lg)" />
      </span>
      <span className="qx-ico-tile-meta">
        <span className="qx-ico-tile-name">
          {copied ? (
            <span role="status" className="qx-ico-tile-copied">
              <CheckIcon size={12} aria-hidden /> Copied
            </span>
          ) : (
            name
          )}
        </span>
        <code className="qx-ico-tile-id">{id}</code>
      </span>
      {/* Stretched over the whole tile, so the tile is one target. */}
      <button
        type="button"
        className="qx-ico-tile-hit"
        onClick={copy}
        title={statement}
        aria-label={`Copy the import for ${name}`}
      />
    </div>
  );
}

export const CommonIcons: Story = {
  name: "Common icons",
  parameters: {
    docs: {
      description: {
        story: "The icons consoles reach for most. Click one to copy its import.",
      },
    },
  },
  render: () => (
    <Specimen>
      {COMMON.map(({ label, aside, icons }) => (
        <Group key={label} label={label} aside={aside}>
          <div className="qx-ico-tiles">
            {icons.map((glyph) => (
              <GlyphTile key={glyph.id} {...glyph} />
            ))}
          </div>
        </Group>
      ))}
    </Specimen>
  ),
};

/* ── Hidden test: the stylesheet and the typed exports agree ──────────────── */

export const InteractionTokensMatch: Story = {
  name: "Interaction: tokens match the exports",
  tags: ["!dev", "!autodocs"],
  render: () => <Text size="sm">Checks the icon tokens against ICON_SIZE and ICON_STROKE.</Text>,
  play: async () => {
    const style = getComputedStyle(document.documentElement);
    for (const [name, px] of SIZES) {
      await expect(style.getPropertyValue(`--qx-size-icon-${name}`).trim()).toBe(`${px}px`);
    }
    for (const [name, width] of STROKES) {
      await expect(style.getPropertyValue(`--qx-icon-stroke-${name}`).trim()).toBe(`${width}`);
    }
  },
};
