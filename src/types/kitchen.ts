export type BacksplashType =
  | 'client_tile_existing'
  | 'client_tile_planned'
  | 'our_ldsp_backsplash'
  | 'custom';

export type CooktopType = 'none' | 'electric' | 'gas' | 'stove_electric' | 'stove_gas';

export type WallCabinetType = 'standard' | 'dish_dryer' | 'hood' | 'built_in_microwave' | 'vitrine';

export type BaseCabinetType = 'standard' | 'sink' | 'cooktop' | 'stove' | 'dishwasher' | 'drawers';

export type BaseCabinetFacadeSide = 'none' | 'left' | 'right' | 'both';

export type DrawerSystem = 'ball_bearing_guides' | 'undermount_guides' | 'tandembox';

export type CabinetMaterial = 'ldsp' | 'mdf' | 'hdf';

/** Материал фасада */
export type FacadeMaterial =
  | 'ldsp'
  | 'mdf_plastic'
  | 'mdf_film'
  | 'mdf_agt_film'
  | 'mdf_enamel';

export type FacadeThickness = 16 | 18;

/** Тип витрины (остекление) */
export type VitrineGlassType = 'transparent' | 'tinted' | 'opaque';
export type VitrineProfileType = '20x20' | '50x20';
export type VitrineProfileColor = 'black';
export type VitrineGlassColor = 'black' | 'graphite';

export type VitrineSpec = {
  hasGlass: boolean;
  glassType?: VitrineGlassType;
  profileType?: VitrineProfileType;
  profileColor?: VitrineProfileColor;
  glassColor?: VitrineGlassColor;
};

export type TextureDirection = 'vertical' | 'horizontal' | 'none' | 'custom';

export type EdgeBandingSide = 'front' | 'back' | 'left' | 'right';

export type EdgeBandingRule = {
  side: EdgeBandingSide;
  thicknessMm: 0.4 | 1 | 2;
  material: 'PVC';
};

export type WallCabinetConstruction = {
  topFullWidth: boolean;
  bottomFullWidth: boolean;
};

export type CabinetPartKind =
  | 'side'
  | 'top'
  | 'bottom'
  | 'shelf'
  | 'front_rail'
  | 'back_rail'
  | 'facade'
  | 'drawer_side'
  | 'drawer_front'
  | 'drawer_back'
  | 'drawer_bottom';

export type CabinetPart = {
  name: string;
  kind: CabinetPartKind;
  quantity: number;
  widthMm: number;
  depthMm: number;
  material: CabinetMaterial;
  thicknessMm: number;
  edgeBanding: EdgeBandingRule[];
  textureDirection: TextureDirection;
};

export type HardwareItem = {
  name: string;
  quantity: number;
  lengthMm?: number;
};

export type Drawer = {
  id: string;
  system: DrawerSystem;
  facadeHeightMm: number;
  widthMm?: number;
  depthMm?: number;
  heightMm?: number;
  parts: CabinetPart[];
  hardware: HardwareItem[];
  warnings: string[];
};

export type ManualWallCabinetOverrides = {
  depthMm?: number;
  heightMm?: number;
  edgeBanding?: Partial<Record<CabinetPartKind, EdgeBandingRule[]>>;
  textureDirection?: Partial<Record<CabinetPartKind, TextureDirection>>;
};

export type WallCabinetInput = {
  type?: WallCabinetType;
  widthMm: number;
  shelfCount?: number;
  hasRecessedLighting?: boolean;
  hasBuiltInMicrowave?: boolean;
  isHoodCabinet?: boolean;
  vitrine?: VitrineSpec;
  overrides?: ManualWallCabinetOverrides;
};

export type WallCabinet = {
  id: string;
  type: WallCabinetType;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  material: CabinetMaterial;
  thicknessMm: number;
  shelfCount: number;
  hasRecessedLighting: boolean;
  hasBuiltInMicrowave: boolean;
  isHoodCabinet: boolean;
  construction: WallCabinetConstruction;
  parts: CabinetPart[];
  vitrine?: VitrineSpec;
};

export type BaseCabinetInput = {
  type?: BaseCabinetType;
  widthMm: number;
  shelfCount?: number;
  facadeSide?: BaseCabinetFacadeSide;
  drawerSystem?: DrawerSystem;
  drawerCount?: number;
  drawerFacadeHeightMm?: number;
  drawerFacadeHeightsMm?: number[];
  overrides?: {
    heightMm?: number;
    depthMm?: number;
  };
};

export type BaseCabinet = {
  id: string;
  type: BaseCabinetType;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  material: CabinetMaterial;
  thicknessMm: number;
  shelfCount: number;
  facadeSide: BaseCabinetFacadeSide;
  parts: CabinetPart[];
  drawers: Drawer[];
  hardware: HardwareItem[];
};

export type Countertop = {
  lengthMm: number;
  depthMm: number;
  thicknessMm: number;
};

export type BaseCabinetModuleType =
  | 'sink'
  | 'cooktop'
  | 'stove'
  | 'dishwasher'
  | 'drawers'
  | 'standard';

export type FillDirection = 'left-to-right' | 'right-to-left' | 'center-out';

export type KitchenProjectInput = {
  layoutType: 'straight';
  wallLengthMm: number;
  ceilingHeightMm?: number;
  backsplashType?: BacksplashType;
  backsplashHeightMm?: number;
  countertopUpstand?: boolean;
  cooktopType?: CooktopType;
  baseTotalHeightMm?: number;
  baseLegHeightMm?: number;
  countertopThicknessMm?: number;
  baseCabinetDepthMm?: number;
  countertopDepthMm?: number;
  wallCabinetDefaultHeightMm?: number;
  wallCabinetDefaultDepthMm?: number;
  roomHeightIncludesStretchCeiling?: boolean;
  stretchCeilingPlanned?: boolean;
  ceilingFillerMm?: number;
  stretchCeilingReserveMm?: number;
  ceilingGapMm?: number;
  material?: CabinetMaterial;
  thicknessMm?: number;
  facadeMaterial?: FacadeMaterial;
  facadeThicknessMm?: FacadeThickness;
  shelfCount?: number;
  hasHoodCabinet?: boolean;
  hasSinkCabinet?: boolean;
  hasDishDryerCabinet?: boolean;
  hasGolaProfile?: boolean;
  hasDishwasher?: boolean;
  hasDrawersCabinet?: boolean;
  hasBuiltInMicrowave?: boolean;
  hasRecessedLighting?: boolean;
  autoModuleWidthMm?: number;
  /** Режим обработки остатка стены:
   * - 'auto' — умное распределение (< 200мм → distribute, ≥ 200мм → extra_module)
   * - 'distribute' — всегда распределять по модулям
   * - 'extra_module' — всегда создавать дополнительный модуль
   * - 'filler' — не менять модули, оставить как незаполненное пространство
   */
  remainderMode?: 'auto' | 'distribute' | 'extra_module' | 'filler';
  /** Направление заполнения модулями (слева направо / справа налево / от центра) */
  fillDirection?: FillDirection;
  /** Явный перечень типов нижних модулей по порядку (слева направо) */
  moduleTypes?: BaseCabinetModuleType[];
  manualBaseCabinets?: BaseCabinetInput[];
  manualWallCabinets?: WallCabinetInput[];
};

export type AppliedRule = {
  code: string;
  message: string;
};

export type KitchenProject = {
  layoutType: 'straight';
  wallLengthMm: number;
  ceilingHeightMm?: number;
  backsplashType?: BacksplashType;
  backsplashHeightMm: number;
  countertopUpstand: boolean;
  cooktopType: CooktopType;
  baseTotalHeightMm: number;
  baseLegHeightMm: number;
  countertopThicknessMm: number;
  baseCabinetDefaultHeightMm: number;
  baseCabinetDefaultDepthMm: number;
  countertop: Countertop;
  wallCabinetDefaultHeightMm: number;
  wallCabinetDefaultDepthMm: number;
  ceilingFillerMm?: number;
  stretchCeilingReserveMm?: number;
  ceilingGapMm?: number;
  ceilingCompletionType?: 'filler' | 'gap';
  ceilingCompletionMm?: number;
  material: CabinetMaterial;
  thicknessMm: number;
  facadeMaterial: FacadeMaterial;
  facadeThicknessMm: FacadeThickness;
  shelfCount: number;
  baseCabinets: BaseCabinet[];
  wallCabinets: WallCabinet[];
  appliedRules: AppliedRule[];
  warnings: string[];
  unresolvedWidthMm: number;
  remainderResolution: 'none' | 'distribute' | 'extra_module';
  /** Ширина добора (мм), если выбран режим остатка 'filler' */
  fillerWidthMm?: number;
  editableParameters: string[];
};
