import type {
  BacksplashType,
  CooktopType,
  BaseCabinetType,
  WallCabinetType,
  CabinetPartKind,
  CabinetMaterial,
  DrawerSystem,
  FacadeMaterial,
  VitrineGlassType,
  VitrineProfileType,
  VitrineGlassColor,
} from '../../../src/types/kitchen.ts';

export const layoutLabels: Record<string, string> = {
  straight: 'Прямая кухня',
};

export const backsplashLabels: Record<BacksplashType, string> = {
  client_tile_existing: 'Плитка клиента (уже есть)',
  client_tile_planned: 'Плитка клиента (планируется)',
  our_ldsp_backsplash: 'Наш фартук ЛДСП',
  custom: 'Своя высота',
};

export const cooktopLabels: Record<CooktopType, string> = {
  none: 'Нет',
  electric: 'Электрическая',
  gas: 'Газовая',
  stove_electric: 'Электрическая плита',
  stove_gas: 'Газовая плита',
};

export const facadeMaterialLabels: Record<FacadeMaterial, string> = {
  ldsp: 'ЛДСП',
  mdf_plastic: 'МДФ пластик',
  mdf_film: 'МДФ плёнка',
  mdf_agt_film: 'МДФ AGT (плёнка под пластик)',
  mdf_enamel: 'МДФ эмаль (крашеный)',
};

export const facadeMaterialOptions: { value: string; label: string }[] = [
  { value: 'ldsp', label: 'ЛДСП' },
  { value: 'mdf_plastic', label: 'МДФ пластик' },
  { value: 'mdf_film', label: 'МДФ плёнка' },
  { value: 'mdf_agt_film', label: 'МДФ AGT (плёнка под пластик)' },
  { value: 'mdf_enamel', label: 'МДФ эмаль (крашеный)' },
];

export const facadeThicknessOptions: { value: string; label: string }[] = [
  { value: '16', label: '16 мм' },
  { value: '18', label: '18 мм' },
];

export const vitrineGlassLabels: Record<VitrineGlassType, string> = {
  transparent: 'Прозрачное',
  tinted: 'Затемнённое',
  opaque: 'Глухое (непрозрачное)',
};

export const vitrineProfileLabels: Record<VitrineProfileType, string> = {
  '20x20': 'Алюминий 20×20 мм',
  '50x20': 'Алюминий 50×20 мм',
};

export const vitrineGlassColorLabels: Record<VitrineGlassColor, string> = {
  black: 'Чёрное стекло',
  graphite: 'Графитовое стекло',
};

export const cabinetTypeLabels: Record<WallCabinetType, string> = {
  standard: 'Обычный',
  dish_dryer: 'С сушкой',
  hood: 'Под вытяжку',
  built_in_microwave: 'Под встроенную микроволновку',
  vitrine: 'Витрина (остекление)',
};

export const baseCabinetTypeLabels: Record<BaseCabinetType, string> = {
  standard: 'Обычный',
  sink: 'Под мойку',
  cooktop: 'Под варочную панель',
  stove: 'Под плиту',
  dishwasher: 'Под посудомоечную машину',
  drawers: 'С выкатными ящиками',
};

export const partKindLabels: Record<CabinetPartKind, string> = {
  side: 'Боковина',
  top: 'Крышка',
  bottom: 'Дно',
  shelf: 'Полка',
  front_rail: 'Планка передняя',
  back_rail: 'Планка задняя',
  facade: 'Фасад',
  drawer_side: 'Боковина ящика',
  drawer_front: 'Передняя стенка ящика',
  drawer_back: 'Задняя стенка ящика',
  drawer_bottom: 'Дно ящика',
};

export const materialLabels: Record<CabinetMaterial, string> = {
  ldsp: 'ЛДСП',
  mdf: 'МДФ',
  hdf: 'ХДФ',
};

export const drawerSystemLabels: Record<DrawerSystem, string> = {
  ball_bearing_guides: 'Шариковые направляющие',
  undermount_guides: 'Направляющие скрытого монтажа',
  tandembox: 'Tandembox',
};

export const backsplashOptions: { value: string; label: string }[] = [
  { value: '', label: 'Выберите тип фартука' },
  { value: 'client_tile_existing', label: 'Плитка клиента (уже есть)' },
  { value: 'client_tile_planned', label: 'Плитка клиента (планируется)' },
  { value: 'our_ldsp_backsplash', label: 'Наш фартук ЛДСП' },
  { value: 'custom', label: 'Своя высота' },
];

export const cooktopOptions: { value: string; label: string }[] = [
  { value: 'none', label: 'Нет' },
  { value: 'electric', label: 'Электрическая' },
  { value: 'gas', label: 'Газовая' },
];

export const booleanOptions: { value: string; label: string }[] = [
  { value: '', label: '—' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' },
];
