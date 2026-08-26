import * as Icons from "@qeetrix/icons";
import type { IconVariant, QeetrixIconProps } from "@qeetrix/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";

// ── Static category map ─────────────────────────────────────────────────────
// Generated from dist/icons/index.d.ts export paths (category = first path segment).

const ICON_CATEGORIES: Record<string, string> = {
  ArrowBack: "arrows", ArrowCircleDown: "arrows", ArrowCircleLeft: "arrows", ArrowCircleRight: "arrows", ArrowCircleUp: "arrows", ArrowDownAlt: "arrows", ArrowDownFilled: "arrows", ArrowDownShort: "arrows", ArrowDown: "arrows", ArrowForward: "arrows", ArrowLeftAlt: "arrows", ArrowLeftFilled: "arrows", ArrowLeftShort: "arrows", ArrowLeft: "arrows", ArrowRightAlt: "arrows", ArrowRightFilled: "arrows", ArrowRightShort: "arrows", ArrowRight: "arrows", ArrowSquareDown: "arrows", ArrowSquareLeft: "arrows", ArrowSquareRight: "arrows", ArrowSquareUp: "arrows", ArrowSquare: "arrows", ArrowTransferVertical: "arrows", ArrowTransfer: "arrows", ArrowUpAlt: "arrows", ArrowUpFilled: "arrows", ArrowUpShort: "arrows", ArrowUp: "arrows", Arrow: "arrows", ArrowsSwapHorizontal: "arrows", ArrowsSwapVertical: "arrows", ArrowsSwap: "arrows", ConvertArrow: "arrows", ExportCircleRight: "arrows", ExportCircle: "arrows", ExportRight: "arrows", ExportUp: "arrows", ImportCircleLeft: "arrows", ImportCircle: "arrows", ImportDown: "arrows", ImportLeft: "arrows", ProgrammingArrow: "arrows", ProgrammingArrows: "arrows", ReceiveSquareAlt: "arrows", ReceiveSquare: "arrows", RecoveryConvert: "arrows", RedoArrow: "arrows", RefreshArrowAlt: "arrows", RefreshArrow: "arrows", RefreshCircle: "arrows", RefreshLeft: "arrows", RefreshRight: "arrows", RefreshSquare: "arrows", RotateLeft: "arrows", RotateRight: "arrows", SendAlt: "arrows", SendSquareAlt: "arrows", SendSquare: "arrows", Send: "arrows", SwapHorizontalAlt: "arrows", SwapHorizontalBox: "arrows", SwapHorizontal: "arrows", UndoArrow: "arrows",
  Bubble: "communication", CallAdd: "communication", CallCalling: "communication", CallIncoming: "communication", CallMinus: "communication", CallOutgoing: "communication", CallReceived: "communication", CallRemove: "communication", CallSlash: "communication", Call: "communication", Chatbox: "communication", DirectDown: "communication", DirectInbox: "communication", DirectLeft: "communication", DirectNormal: "communication", DirectNotification: "communication", DirectRight: "communication", DirectSend: "communication", DirectUp: "communication", Direct: "communication", DirectboxDefault: "communication", DirectboxNotif: "communication", DirectboxReceive: "communication", DirectboxSend: "communication", MessageAddAlt: "communication", MessageAdd: "communication", MessageBubble: "communication", MessageCircle: "communication", MessageEdit: "communication", MessageFavorite: "communication", MessageMinus: "communication", MessageNotif: "communication", MessageProgramming: "communication", MessageQuestion: "communication", MessageRemove: "communication", MessageSearch: "communication", MessageSquare: "communication", MessageTextAlt: "communication", MessageText: "communication", MessageTick: "communication", MessageTime: "communication", Messages2: "communication", MessagesBubbles2: "communication", Messages: "communication", Messenger: "communication", Microphone2: "communication", MicrophoneSlashAlt: "communication", MicrophoneSlash: "communication", Microphone: "communication", SmsEdit: "communication", SmsNotification: "communication", SmsSearch: "communication", SmsStar: "communication", SmsTracking: "communication", Sms: "communication", VoiceCircle: "communication", VoiceSquare: "communication", Whatsapp: "communication",
  AaveAave: "crypto", AnkrAnkr: "crypto", AugurRep: "crypto", AutonioNiox: "crypto", AvalancheAvax: "crypto", BinanceCoinBnb: "crypto", BinanceUsdBusd: "crypto", BitcoinBtc: "crypto", BitcoinCard: "crypto", BitcoinConvert: "crypto", BitcoinRefresh: "crypto", BuyCrypto: "crypto", CardanoAda: "crypto", CeloCelo: "crypto", CelsiusCel: "crypto", ChainlinkLink: "crypto", CivicCvc: "crypto", DaiDai: "crypto", DashDashNavigationControlSpeedTransportationRoute: "crypto", DashDash: "crypto", DecredDcr: "crypto", DentDent: "crypto", DentDentalCareToothbrushOralHygieneCheckupSmile: "crypto", EducareEkt: "crypto", EmercoinEmc: "crypto", EnjinCoinEnj: "crypto", EosEos: "crypto", EthereumClassicEtc: "crypto", EthereumEth: "crypto", Ethereum: "crypto", FtxTokenFtt: "crypto", HarmonyOne: "crypto", HederaHashgraphHbar: "crypto", HexHex: "crypto", HuobiTokenHt: "crypto", IconIcx: "crypto", IostIost: "crypto", KyberNetworkKnc: "crypto", LitecoinLtc: "crypto", Litecoin: "crypto", MakerMkr: "crypto", MoneroXmr: "crypto", NebulasNas: "crypto", NemXem: "crypto", NexoNexo: "crypto", OceanProtocolOcean: "crypto", OkApp: "crypto", OkbOkb: "crypto", OntologyKnowledgeStructureConceptMapRelationshipDataModel: "crypto", OntologyKnowledgeStructureConceptMapSemanticsInformation: "crypto", PolkadotDot: "crypto", PolygonMatic: "crypto", PolyswarmNct: "crypto", QuantQnt: "crypto", SiacoinSc: "crypto", SolanaSol: "crypto", StacksStx: "crypto", StellarXlm: "crypto", TenxPay: "crypto", TetherUsdt: "crypto", TheGraphGrt: "crypto", ThetaTheta: "crypto", ThorchainRune: "crypto", TrontronTrx: "crypto", UsdCoinUsdc: "crypto", VelasVlx: "crypto", VibeVibe: "crypto", WanchainWanAlt: "crypto", WanchainWan: "crypto", XrpXrp: "crypto", ZelZel: "crypto",
  Activity: "data", ChartBar: "data", ChartFail: "data", ChartRing: "data", ChartSquare: "data", ChartSuccess: "data", Chart: "data", DataAlt: "data", Data: "data", Diagram: "data", FavoriteChart: "data", Graph: "data", PresentationChart: "data", PresentionChart: "data", RankingAlt: "data", Ranking: "data", StatusUp: "data", Status: "data", TrendDown: "data", TrendUp: "data",
  Bezier: "design", BlendAlt: "design", Blend: "design", Blur: "design", BrushSquare: "design", Brush: "design", BucketCircle: "design", BucketSquare: "design", Bucket: "design", ColorSwatch: "design", Colorfilter: "design", ColorsSquare: "design", Component: "design", Convert3dCube: "design", ConvertshapeAlt: "design", Convertshape: "design", Crop: "design", Cube3dScan: "design", Cube3d: "design", Designtools: "design", FigmaCircle: "design", Figma: "design", Framer: "design", Illustrator: "design", Magicpen: "design", MainComponent: "design", MaskAlt: "design", MaskSplit: "design", Mask: "design", PaintBrushAlt: "design", PaintBrush: "design", PaintRoller: "design", Paintbucket: "design", PathAlt: "design", PathSquare: "design", Path: "design", PenAdd: "design", PenClose: "design", PenRemove: "design", PenToolAlt: "design", PenTool: "design", Photoshop: "design", Rotate3d: "design", RulerPen: "design", Ruler: "design", Square3d: "design", Square3side: "design", Triangle: "design", Xd: "design",
  Airpod: "devices", Airpods: "devices", Autobrightness: "devices", Battery2bars: "devices", BatteryCharging: "devices", BatteryDisable: "devices", BatteryEmptyAlt: "devices", BatteryEmpty: "devices", BatteryFull: "devices", BluetoothAlt: "devices", BluetoothCircle: "devices", BluetoothRectangle: "devices", Bluetooth: "devices", Cd: "devices", Computing: "devices", CpuCharge: "devices", CpuSetting: "devices", Cpu: "devices", Devices: "devices", DriverAlt: "devices", DriverRefresh: "devices", Driver: "devices", ExternalDrive: "devices", Gameboy: "devices", LampCharge: "devices", LampOn: "devices", LampSlash: "devices", Lamp: "devices", MobileProgramming: "devices", Mobile: "devices", MonitorMobile: "devices", MonitorRecorder: "devices", Monitor: "devices", MouseCircle: "devices", MouseSquare: "devices", Mouse: "devices", PrinterSlash: "devices", Printer: "devices", RamAlt: "devices", Ram: "devices", SimcardAlt: "devices", SimcardSquare: "devices", Simcard: "devices", SmartHome: "devices", WifiSquare: "devices", Wifi: "devices", Windows: "devices", Xiaomi: "devices",
  AlignBottom: "editing", AlignHorizontally: "editing", AlignLeftAlt: "editing", AlignLeft: "editing", AlignRight: "editing", AlignTopAlt: "editing", AlignTop: "editing", AlignVertically: "editing", CopySuccess: "editing", Copy: "editing", EditAlt: "editing", Edit: "editing", Eraser: "editing", Firstline: "editing", FormatCircle: "editing", FormatSquare: "editing", Layer: "editing", MathSymbol: "editing", Mirror: "editing", Paragraphspacing: "editing", Pharagraphspacing: "editing", QuoteDownCircle: "editing", QuoteDownSquare: "editing", QuoteDown: "editing", QuoteUpCircle: "editing", QuoteUpSquare: "editing", QuoteUp: "editing", Scissor: "editing", Size: "editing", Smallcaps: "editing", Subtitle: "editing", TextBlock: "editing", TextBold: "editing", TextItalic: "editing", TextUnderline: "editing", Text: "editing", TextalignCenter: "editing", TextalignJustifycenter: "editing", TextalignJustifyleft: "editing", TextalignJustifyright: "editing", TextalignLeft: "editing", TextalignRight: "editing", Translate: "editing",
  ArchiveAdd: "files", ArchiveBook: "files", ArchiveMinus: "files", ArchiveSlash: "files", ArchiveTick: "files", Archive: "files", AttachCircle: "files", AttachSquare: "files", BookOpen: "files", BookSaved: "files", BookSquare: "files", Book: "files", BookmarkAlt: "files", Bookmark: "files", ClipboardClose: "files", ClipboardExport: "files", ClipboardImport: "files", ClipboardText: "files", ClipboardTick: "files", Clipboard: "files", DocumentCloud: "files", DocumentCodeAlt: "files", DocumentCode: "files", DocumentCopy: "files", DocumentDownload: "files", DocumentFavorite: "files", DocumentFilter: "files", DocumentForward: "files", DocumentLike: "files", DocumentNormal: "files", DocumentPrevious: "files", DocumentSketch: "files", DocumentTextAlt: "files", DocumentText: "files", DocumentUpload: "files", Document: "files", Dropbox: "files", FolderAdd: "files", FolderAlt: "files", FolderCloud: "files", FolderConnection: "files", FolderCross: "files", FolderFavorite: "files", FolderMinus: "files", FolderOpen: "files", Folder: "files", NoteAdd: "files", NoteAlt: "files", NoteFavorite: "files", NoteLines: "files", NoteRemove: "files", NoteSquare: "files", NoteText: "files", Note: "files", PaperAlt: "files", Paper: "files", PaperclipAlt: "files", Paperclip: "files", SaveAdd: "files", SaveAlt: "files", SaveMinus: "files", SaveRemove: "files", Stickynote: "files", TaskSquare: "files", Task: "files", TrashSquare: "files", Trash: "files",
  Bank: "finance", Bill: "finance", BuildingBank: "finance", Cards: "finance", CoinAlt: "finance", Coin: "finance", ConvertCard: "finance", Courthouse: "finance", DiscountCircle: "finance", DiscountShape: "finance", DollarCircle: "finance", DollarSquare: "finance", EmptyWalletAdd: "finance", EmptyWalletChange: "finance", EmptyWalletRemove: "finance", EmptyWalletTick: "finance", EmptyWalletTime: "finance", EmptyWallet: "finance", MoneyAdd: "finance", MoneyAlt: "finance", MoneyChange: "finance", MoneyCircle: "finance", MoneyForbidden: "finance", MoneyReceive: "finance", MoneyRemove: "finance", MoneySendAlt: "finance", MoneySend: "finance", MoneyTick: "finance", MoneyTime: "finance", Money: "finance", Moneys: "finance", Paypal: "finance", PercentageCircle: "finance", PercentageSquare: "finance", ReceiptAdd: "finance", ReceiptAlt: "finance", ReceiptDiscountAlt: "finance", ReceiptDiscount: "finance", ReceiptEdit: "finance", ReceiptItem: "finance", ReceiptListAlt: "finance", ReceiptList: "finance", ReceiptMinus: "finance", ReceiptSearch: "finance", ReceiptSquare: "finance", ReceiptText: "finance", Receipt: "finance", Trade: "finance", TransactionMinus: "finance", WalletAddAlt: "finance", WalletAdd: "finance", WalletAlt: "finance", WalletCheck: "finance", WalletCircle: "finance", WalletMinus: "finance", WalletMoney: "finance", WalletRemove: "finance", WalletRound: "finance", WalletSearch: "finance", Wallet: "finance",
  AddCircle: "interface", AddItem: "interface", AddSquare: "interface", Add: "interface", AiAc: "interface", AiAdd: "interface", AiAntenna: "interface", AiCommentary: "interface", AiFuelTank: "interface", AiHeartSquare: "interface", AiHomepage: "interface", AiHospital: "interface", AiHousing: "interface", AiLandscape: "interface", AiLoveletter: "interface", AiRecordVideo: "interface", AiSandTimer: "interface", AiSendMessage: "interface", AiShapeTriangle: "interface", AiSyringe: "interface", AiTagPrice: "interface", AiTools: "interface", AiUsers: "interface", AiWaterCycle: "interface", AiWeight: "interface", Airdrop: "interface", Aquarius: "interface", Award: "interface", Barcode: "interface", BellAlt: "interface", Bell: "interface", BoxAdd: "interface", BoxAlt: "interface", BoxRemove: "interface", BoxSearch: "interface", BoxTick: "interface", BoxTime: "interface", Box: "interface", BriefcaseCross: "interface", BriefcaseTick: "interface", BriefcaseTimer: "interface", Briefcase: "interface", Broom: "interface", BuildingOffice: "interface", BuildingTower: "interface", Building: "interface", BuildingsAlt: "interface", Buildings: "interface", Calculator: "interface", CandleAlt: "interface", Candle: "interface", CategoryAlt: "interface", Category: "interface", Check: "interface", CloseCircle: "interface", CloseSquare: "interface", CodeAlt: "interface", CodeCircle: "interface", Code: "interface", Coffee: "interface", CommandSquare: "interface", Command: "interface", ConversationBox: "interface", Copyright: "interface", CreativeCommons: "interface", CrownAlt: "interface", Crown: "interface", Cup: "interface", Danger: "interface", DeviceMessage: "interface", Diamonds: "interface", Discover: "interface", Dislike: "interface", DotsMore: "interface", EmojiHappy: "interface", EmojiNormal: "interface", EmojiSad: "interface", EnhancePrize: "interface", EyeSlash: "interface", Eye: "interface", FilterAdd: "interface", FilterEdit: "interface", FilterRemove: "interface", FilterSearch: "interface", FilterSquare: "interface", FilterTick: "interface", Filter: "interface", FlagAlt: "interface", Flag: "interface", Forbidden2: "interface", Forbidden: "interface", Game: "interface", GeminiAlt: "interface", Gemini: "interface", Glass: "interface", GridAdd: "interface", GridAlt: "interface", GridBlocks: "interface", GridDots: "interface", GridEdit: "interface", GridEqual: "interface", GridEraser: "interface", GridLarge: "interface", GridLock: "interface", GridMini: "interface", GridMixed: "interface", GridSmall: "interface", GridWide: "interface", Grid: "interface", Grids4: "interface", Happy: "interface", Happyemoji: "interface", HashtagDown: "interface", HashtagUp: "interface", Hashtag: "interface", Health: "interface", HeartAdd: "interface", HeartCircle: "interface", HeartEdit: "interface", HeartRemove: "interface", HeartSearch: "interface", HeartSlash: "interface", HeartTick: "interface", Heart: "interface", HierarchyAlt: "interface", HierarchySquareAlt: "interface", HierarchySquareTree: "interface", HierarchySquare: "interface", HierarchyTree: "interface", Hierarchy: "interface", HomeAlt: "interface", HomeHashtag: "interface", HomeSimple: "interface", HomeTrendDown: "interface", HomeTrendUp: "interface", HomeWifi: "interface", Home: "interface", Hospital: "interface", House2: "interface", House: "interface", InfoCircle: "interface", Information: "interface", Judge: "interface", LanguageCircle: "interface", LanguageSquare: "interface", LayoutAdjust: "interface", LeftBarGrid: "interface", LeftSidebarGrid: "interface", Level: "interface", Lifebuoy: "interface", LikeAlt: "interface", LikeDislike: "interface", LikeShapes: "interface", LikeTag: "interface", Like: "interface", LinkAlt: "interface", LinkChain: "interface", LinkCircle: "interface", LinkSquareAlt: "interface", LinkSquare: "interface", Link: "interface", LoginAlt: "interface", Login: "interface", LogoutAlt: "interface", Logout: "interface", Lovely: "interface", MagicStar: "interface", MagicWand: "interface", Magic: "interface", MaximizeAlt: "interface", MaximizeCircle: "interface", MaximizeCrop: "interface", MaximizeFrame: "interface", Maximize: "interface", MedalStar: "interface", Medal: "interface", MenuBoard: "interface", Menu: "interface", Milk: "interface", MinusCircle: "interface", MinusSquare: "interface", Minus: "interface", MoreCircle: "interface", MoreSquare: "interface", More: "interface", NotificationAlt: "interface", NotificationBing: "interface", NotificationCircle: "interface", NotificationFavorite: "interface", NotificationStatus: "interface", Notification: "interface", OmegaCircle: "interface", OmegaSquare: "interface", Pet: "interface", PictureFrame: "interface", RadarAlt: "interface", Radar: "interface", Received: "interface", Reserve: "interface", RowHorizontal: "interface", RowVertical: "interface", Sagittarius: "interface", ScanBarcode: "interface", Scan: "interface", Scanner: "interface", Scanning: "interface", Scroll: "interface", SearchFavoriteAlt: "interface", SearchFavorite: "interface", SearchNormal: "interface", SearchStatusAlt: "interface", SearchStatus: "interface", SearchZoomInAlt: "interface", SearchZoomIn: "interface", SearchZoomOutAlt: "interface", SearchZoomOut: "interface", Search: "interface", ServingDome: "interface", SettingAlt: "interface", SettingCircle: "interface", SettingSliders: "interface", SettingSquare: "interface", Setting: "interface", Settings: "interface", ShapesAlt: "interface", Shapes: "interface", Share: "interface", SidebarBottom: "interface", SidebarLeft: "interface", SidebarRight: "interface", SidebarTop: "interface", Slash: "interface", SliderHorizontalAlt: "interface", SliderHorizontal: "interface", SliderVerticalAlt: "interface", SliderVertical: "interface", Slider: "interface", SmartCursor: "interface", Smileys: "interface", Sort: "interface", Speedometer: "interface", StarAlt: "interface", StarCircle: "interface", StarFilled: "interface", StarFive: "interface", StarSlash: "interface", Star: "interface", Stars: "interface", Sticker: "interface", Story: "interface", Support24h: "interface", TagAlt: "interface", TagCross: "interface", TagRight: "interface", TagUser: "interface", Tag: "interface", Telescope: "interface", TickCircle: "interface", TickSquare: "interface", ToggleOffCircle: "interface", ToggleOff: "interface", ToggleOnCircle: "interface", ToggleOn: "interface", TopBottomGrid: "interface", Unlimited: "interface", Verify: "interface", WarningAlt: "interface", Weight: "interface", Zoom: "interface",
  GlobalEdit: "location", GlobalRefresh: "location", GlobalSearch: "location", Global: "location", GpsSlash: "location", Gps: "location", LocationAdd: "location", LocationCross: "location", LocationMinus: "location", LocationSlash: "location", LocationTick: "location", Location: "location", MapAlt: "location", Map: "location", RouteSquare: "location", RoutingAlt: "location", Routing: "location", Signpost: "location",
  AudioSquare: "media", Backward10Seconds: "media", Backward15Seconds: "media", Backward5Seconds: "media", BackwardItem: "media", Backward: "media", CameraSlash: "media", Camera: "media", Forward10Seconds: "media", Forward15Seconds: "media", Forward5Seconds: "media", ForwardItem: "media", Forward: "media", GalleryAdd: "media", GalleryEdit: "media", GalleryExport: "media", GalleryFavorite: "media", GalleryImport: "media", GalleryRemove: "media", GallerySlash: "media", GalleryTick: "media", Gallery: "media", Headphone: "media", Headphones: "media", Image: "media", MiniMusicSquare: "media", MirroringScreen: "media", MusicCircle: "media", MusicDashboard: "media", MusicFilter: "media", MusicLibraryAlt: "media", MusicPlay: "media", MusicPlaylist: "media", MusicSquareAdd: "media", MusicSquareRemove: "media", MusicSquareSearch: "media", MusicSquare: "media", Music: "media", MusicalNoteAi: "media", Musicnote: "media", Next: "media", PauseCircle: "media", Pause: "media", PlayAdd: "media", PlayCircleAlt: "media", PlayCircle: "media", PlayRemove: "media", Play: "media", Previous: "media", Radio: "media", RecordCircle: "media", Record: "media", RepeatArrow: "media", RepeatCircle: "media", RepeateMusic: "media", RepeateOne: "media", Screenmirroring: "media", Shuffle: "media", Sound: "media", Speaker: "media", Spotify: "media", StopCircle: "media", Stop: "media", Twitch: "media", VideoAdd: "media", VideoCircle: "media", VideoHorizontal: "media", VideoOctagon: "media", VideoPlay: "media", VideoRemove: "media", VideoSlash: "media", VideoSquare: "media", VideoTick: "media", VideoTime: "media", VideoVertical: "media", Video: "media", VolumeCross: "media", VolumeHigh: "media", VolumeLowAlt: "media", VolumeLow: "media", VolumeMute: "media", VolumeSlash: "media", VolumeUp: "media",
  Birds: "nature", CloudAdd: "nature", CloudChange: "nature", CloudConnection: "nature", CloudCross: "nature", CloudDrizzle: "nature", CloudFog: "nature", CloudLightning: "nature", CloudMinus: "nature", CloudNotif: "nature", CloudPlus: "nature", CloudRemove: "nature", CloudSnow: "nature", CloudSunny: "nature", Cloud: "nature", Deer: "nature", Drop: "nature", Electricity: "nature", FireAlt: "nature", FireGlow: "nature", Fire: "nature", FireworksAlt: "nature", FireworksBurst: "nature", FireworksSparkle: "nature", Fireworks: "nature", FlashCircle: "nature", FlashSlash: "nature", Flash: "nature", Moon: "nature", SnowBurst: "nature", SnowCircle: "nature", SnowCross: "nature", SnowCrystal: "nature", SnowDot: "nature", SnowDrift: "nature", SnowFall: "nature", SnowFlurry: "nature", SnowGem: "nature", SnowIce: "nature", SnowRing: "nature", SnowSpin: "nature", SnowStar: "nature", Snow: "nature", Snowflake: "nature", SunFog: "nature", Sun: "nature", TreeAlt: "nature", TreePine: "nature", Tree: "nature", Wind2: "nature", Wind: "nature",
  EnhanceUserAi: "people", Man: "people", People: "people", Personalcard: "people", ProfileAdd: "people", ProfileCircle: "people", ProfileDelete: "people", ProfilePair: "people", ProfileRemove: "people", ProfileTick: "people", Profile: "people", Teacher: "people", UserAdd: "people", UserCircleAdd: "people", UserEdit: "people", UserHexagon: "people", UserMinus: "people", UserRemove: "people", UserSearch: "people", UserSquare: "people", UserTag: "people", UserTick: "people", User: "people", Woman: "people",
  AngelAlt: "seasonal", Angel: "seasonal", BallBaseball: "seasonal", BallBasketball: "seasonal", BallBilliards: "seasonal", BallBowling: "seasonal", BallCricket: "seasonal", BallDodgeball: "seasonal", BallFieldHockey: "seasonal", BallFootball: "seasonal", BallGolf: "seasonal", BallHandball: "seasonal", BallHurling: "seasonal", BallKabaddi: "seasonal", BallLacrosse: "seasonal", BallPadel: "seasonal", BallPetanque: "seasonal", BallPolo: "seasonal", BallRacquetball: "seasonal", BallRugby: "seasonal", BallShuttlecock: "seasonal", BallSoccer: "seasonal", BallSquash: "seasonal", BallTableTennis: "seasonal", BallTennis: "seasonal", BallVolleyball: "seasonal", BallWaterPolo: "seasonal", Balloon: "seasonal", BookingSnow: "seasonal", Cake4: "seasonal", Cake: "seasonal", CalendarChristmas: "seasonal", CalendarTree: "seasonal", CandyAlt: "seasonal", CandyCaneAlt: "seasonal", CandyCaneLoop: "seasonal", CandyCaneTwist: "seasonal", CandyCane: "seasonal", CandyRound: "seasonal", CandyTwist: "seasonal", Candy: "seasonal", ChristmasBell: "seasonal", ChristmasBow: "seasonal", ChristmasCard: "seasonal", ChristmasHouse: "seasonal", ChristmasShoes: "seasonal", ChristmasSweater: "seasonal", ChristmasTree: "seasonal", ChristmasWreath: "seasonal", Decor: "seasonal", EmailSnow: "seasonal", Ghost: "seasonal", Gift3: "seasonal", Gift5: "seasonal", GiftAlt: "seasonal", GiftBow: "seasonal", GiftBox: "seasonal", GiftCircle: "seasonal", GiftCupcake: "seasonal", GiftFancy: "seasonal", GiftHeart: "seasonal", GiftLid: "seasonal", GiftOpen: "seasonal", GiftRibbon: "seasonal", GiftRound: "seasonal", GiftSquare: "seasonal", GiftStack: "seasonal", GiftStar: "seasonal", GiftTag: "seasonal", GiftWrap: "seasonal", Gift: "seasonal", HangingOrnament: "seasonal", Hat3: "seasonal", HatAlt: "seasonal", Hat: "seasonal", HoHoHo: "seasonal", HolidayIcons: "seasonal", Horseshoe: "seasonal", LampChristmas: "seasonal", LanternStar: "seasonal", Lollipop: "seasonal", Mistletoe: "seasonal", Mitten: "seasonal", PartyHat: "seasonal", PartyPopper: "seasonal", ReindeerAntlers: "seasonal", ReindeerArch: "seasonal", ReindeerFace: "seasonal", SantaAlt: "seasonal", SantaFace: "seasonal", SantaHat: "seasonal", SantaMouth: "seasonal", Santa: "seasonal", ShopSnow: "seasonal", Ski: "seasonal", SleighAlt: "seasonal", Sleigh: "seasonal", SnowmanHat: "seasonal", SnowmanScarf: "seasonal", SnowmanSmile: "seasonal", SnowmanTall: "seasonal", SnowmanWave: "seasonal", Snowman: "seasonal", Socks2: "seasonal", SocksPair: "seasonal", Socks: "seasonal", Sparkler: "seasonal", StarGarland: "seasonal", StickCross: "seasonal", StickWave: "seasonal", Stick: "seasonal", ToyAlt: "seasonal", ToyCar: "seasonal", ToyDrum: "seasonal", ToyPlane: "seasonal", ToyRobot: "seasonal", Toy: "seasonal", WinterBoots: "seasonal", WinterMitten: "seasonal", WinterPattern: "seasonal",
  FingerCircle: "security", FingerScan: "security", KeySquare: "security", Key: "security", KeyboardOpen: "security", Keyboard: "security", LockCircle: "security", LockSlash: "security", Lock: "security", Padlock: "security", PasswordCheck: "security", SafeHome: "security", SecurityCard: "security", SecuritySafe: "security", SecurityTime: "security", SecurityUser: "security", Security: "security", ShieldCross: "security", ShieldSearch: "security", ShieldSecurity: "security", ShieldSlash: "security", ShieldTick: "security", Shield: "security", SmartLockAi: "security", Strongbox2: "security", Strongbox: "security", Unlock: "security",
  BagAlt: "shopping", BagCrossAlt: "shopping", BagCross: "shopping", BagHappy: "shopping", BagTickAlt: "shopping", BagTick: "shopping", BagTimer: "shopping", Bag: "shopping", GiftBag: "shopping", ShopAdd: "shopping", ShopGift: "shopping", ShopRemove: "shopping", Shop: "shopping", ShoppingBag: "shopping", ShoppingCart: "shopping", SmartBag: "shopping", TicketAlt: "shopping", TicketDiscount: "shopping", TicketExpired: "shopping", TicketStar: "shopping", Ticket: "shopping",
  Android: "social", Apple: "social", Behance: "social", Blogger: "social", Bootstrap: "social", Chrome: "social", Dribbble: "social", Facebook: "social", GoogleDrive: "social", GooglePlay: "social", Google: "social", Html3: "social", Html5: "social", Instagram: "social", Javascript: "social", Js: "social", Python: "social", Shutterstock: "social", Slack: "social", Snapchat: "social", Trello: "social", Ui8: "social", Vuesax: "social", Youtube: "social", Zipline: "social",
  Alarm: "time", CalendarAdd: "time", CalendarAlt: "time", CalendarCircle: "time", CalendarDate: "time", CalendarEdit: "time", CalendarGrid: "time", CalendarList: "time", CalendarMonth: "time", CalendarRemove: "time", CalendarSearch: "time", CalendarTick: "time", Calendar: "time", ClockAlt: "time", Clock: "time", Hourglass: "time", TimerPause: "time", TimerStart: "time", Timer: "time", WatchStatus: "time", Watch: "time",
  AirplaneSquare: "travel", Airplane: "travel", Bus: "travel", Car: "travel", CardAdd: "travel", CardCoin: "travel", CardEdit: "travel", CardPos: "travel", CardReceive: "travel", CardRemoveAlt: "travel", CardRemove: "travel", CardSend: "travel", CardSlash: "travel", CardTickAlt: "travel", CardTick: "travel", Card: "travel", Driving: "travel", GasStation: "travel", Ship: "travel", SmartCar: "travel", TruckFast: "travel", TruckRemove: "travel", TruckTick: "travel", TruckTime: "travel", Truck: "travel", WingWingFlyFlightAircraftAerodynamicsWingspan: "travel", WingWing: "travel",
};

// PascalCase → kebab-case for display name
function toKebab(pascal: string) {
  return pascal.replace(/([A-Z])/g, (_m, c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Types ────────────────────────────────────────────────────────────────────

type IconComponent = ComponentType<QeetrixIconProps>;

// All runtime exports that are actual components (functions, not type-only)
const ALL_ICONS = Object.keys(Icons).filter(
  (k) => typeof (Icons as Record<string, unknown>)[k] === "function",
) as Array<keyof typeof Icons>;

// ── Story meta ───────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Icons/All Icons",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The complete Qeetrix icon library — 1 166 icons across 20 categories, in `outline` (default) and `solid` variants. Props spread onto the root `<svg>` last so you can override anything: `width`, `height`, `className`, `fill`, etc. Import: `import { Add } from '@qeetrix/icons'`. Click a tile to copy the import statement.",
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

// ── useCopy ──────────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1400);
    });
  };
  return { copied, copy };
}

// ── IconTile ─────────────────────────────────────────────────────────────────

function IconTile({
  name,
  px,
  variant,
  onCopy,
  isCopied,
}: {
  name: string;
  px: number;
  variant: IconVariant;
  onCopy: (text: string, key: string) => void;
  isCopied: boolean;
}) {
  const Comp = (Icons as Record<string, IconComponent>)[name];
  if (!Comp) return null;

  const kebab = toKebab(name);
  const importLine = `import { ${name} } from '@qeetrix/icons';`;

  return (
    <button
      type="button"
      title={`${name}\nClick to copy import`}
      aria-label={`Copy import for ${name}`}
      onClick={() => onCopy(importLine, name)}
      className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-neutral-900 p-3 text-center transition-all duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/25 hover:bg-neutral-800 active:scale-[0.96]"
    >
      {isCopied && (
        <span className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      <span className="flex h-10 w-10 items-center justify-center">
        <Comp width={px} height={px} variant={variant} />
      </span>
      <span className="w-full truncate text-[10px] leading-tight text-neutral-400">
        {kebab}
      </span>
    </button>
  );
}

// ── AllIconsPage ─────────────────────────────────────────────────────────────

function AllIconsPage() {
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<IconVariant>("outline");
  const [px, setPx] = useState(24);
  const { copied, copy } = useCopy();

  const q = query.trim().toLowerCase();

  const filtered = q
    ? ALL_ICONS.filter((name) => {
        const kebab = toKebab(name);
        const cat = ICON_CATEGORIES[name] ?? "";
        return (
          kebab.includes(q) ||
          name.toLowerCase().includes(q) ||
          cat.includes(q)
        );
      })
    : ALL_ICONS;

  // Group by category
  const grouped = new Map<string, string[]>();
  for (const name of filtered) {
    const cat = ICON_CATEGORIES[name] ?? "other";
    const list = grouped.get(cat) ?? [];
    list.push(name);
    grouped.set(cat, list);
  }
  const categories = [...grouped.keys()].sort();

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      {/* toolbar */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3 px-6 py-3">
          {/* search */}
          <div className="relative min-w-50 flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search icons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* variant */}
          <div className="flex overflow-hidden rounded-lg border border-border text-sm">
            {(["outline", "solid"] as IconVariant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`px-3 py-1 capitalize transition-colors ${variant === v ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* size */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Size</span>
            <select
              value={px}
              onChange={(e) => setPx(Number(e.target.value))}
              className="h-8 rounded-lg border border-border bg-muted px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[16, 20, 24, 32, 40, 48].map((s) => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </div>

          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {filtered.length} of {ALL_ICONS.length}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col gap-10 px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-40">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.4" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <p className="text-sm">No icons match &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          categories.map((cat) => {
            const items = grouped.get(cat)!;
            return (
              <section key={cat} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {capitalize(cat)}
                  </h3>
                  <span className="text-xs text-muted-foreground tabular-nums">{items.length}</span>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
                  {items.map((name) => (
                    <IconTile
                      key={name}
                      name={name}
                      px={px}
                      variant={variant}
                      onCopy={copy}
                      isCopied={copied === name}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

export const AllIcons: Story = {
  name: "All Icons",
  render: () => <AllIconsPage />,
};
