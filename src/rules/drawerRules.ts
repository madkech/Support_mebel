import { DEFAULTS } from './defaults.ts';
import type { CabinetMaterial, CabinetPart, Drawer, DrawerSystem, HardwareItem } from '../types/kitchen.ts';

export function calculateDrawer(params: {
  id: string;
  system: DrawerSystem;
  tableWidthMm: number;
  tableDepthMm: number;
  material?: CabinetMaterial;
  materialThicknessMm?: number;
  facadeHeightMm?: number;
}): Drawer {
  const material = params.material ?? 'ldsp';
  const materialThicknessMm = params.materialThicknessMm ?? DEFAULTS.ldspThicknessMm;
  const facadeHeightMm = params.facadeHeightMm ?? DEFAULTS.drawerDefaultFacadeHeightMm;

  if (params.system !== 'ball_bearing_guides') {
    return {
      id: params.id,
      system: params.system,
      facadeHeightMm,
      parts: [],
      hardware: [],
      warnings: [`Система ящиков ${params.system} сохранена, точный расчет для нее будет добавлен позже.`],
    };
  }

  const totalGuideGapMm = DEFAULTS.drawerGuideGapPerSideMm * 2;
  const widthMm = params.tableWidthMm - 2 * materialThicknessMm - totalGuideGapMm;
  const frontBackWidthMm = widthMm - 2 * materialThicknessMm;
  const depthMm =
    params.tableDepthMm === DEFAULTS.baseCabinetDepthMm
      ? DEFAULTS.ballBearingDrawerDepthMm
      : Math.min(DEFAULTS.ballBearingDrawerDepthMm, params.tableDepthMm);
  const heightRawMm = facadeHeightMm - DEFAULTS.drawerHeightFacadeInsetMm;
  const heightMm = Math.floor(heightRawMm / 10) * 10;

  const parts: CabinetPart[] = [
    createDrawerPart('drawer_side', 'Drawer side panel', 2, depthMm, heightMm, material, materialThicknessMm),
    createDrawerPart('drawer_front', 'Drawer front panel', 1, frontBackWidthMm, heightMm, material, materialThicknessMm),
    createDrawerPart('drawer_back', 'Drawer back panel', 1, frontBackWidthMm, heightMm, material, materialThicknessMm),
    createDrawerPart(
      'drawer_bottom',
      'Drawer bottom',
      1,
      widthMm - DEFAULTS.drawerBottomInsetMm,
      depthMm - DEFAULTS.drawerBottomInsetMm,
      'hdf',
      3,
    ),
  ];
  const hardware: HardwareItem[] = [
    {
      name: 'Шариковые направляющие',
      quantity: 1,
      lengthMm: DEFAULTS.ballBearingDrawerGuideLengthMm,
    },
  ];

  return {
    id: params.id,
    system: params.system,
    facadeHeightMm,
    widthMm,
    depthMm,
    heightMm,
    parts,
    hardware,
    warnings: [],
  };
}

function createDrawerPart(
  kind: CabinetPart['kind'],
  name: string,
  quantity: number,
  widthMm: number,
  depthMm: number,
  material: CabinetMaterial,
  thicknessMm: number,
): CabinetPart {
  return {
    name,
    kind,
    quantity,
    widthMm,
    depthMm,
    material,
    thicknessMm,
    edgeBanding: [],
    textureDirection: 'none',
  };
}
