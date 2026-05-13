import { DEFAULTS } from '../rules/defaults.ts';
import { calculateDrawer } from '../rules/drawerRules.ts';
import { resolveFacades } from '../rules/facadeRules.ts';
import {
  resolveDefaultEdgeBanding,
  resolveDefaultTextureDirection,
} from '../rules/wallCabinetRules.ts';
import type {
  BaseCabinet,
  BaseCabinetInput,
  BaseCabinetType,
  CabinetMaterial,
  CabinetPart,
  CabinetPartKind,
} from '../types/kitchen.ts';

export function calculateBaseCabinet(params: {
  id: string;
  input: BaseCabinetInput;
  defaultHeightMm: number;
  defaultDepthMm: number;
  material?: CabinetMaterial;
  thicknessMm?: number;
  defaultShelfCount?: number;
}): BaseCabinet {
  const material = params.material ?? 'ldsp';
  const thicknessMm = params.thicknessMm ?? DEFAULTS.ldspThicknessMm;
  const type = params.input.type ?? 'standard';
  const hasDrawers = type === 'drawers' || params.input.drawerSystem !== undefined;
  const shelfCount = resolveBaseShelfCount({
    type,
    hasDrawers,
    inputShelfCount: params.input.shelfCount,
    defaultShelfCount: params.defaultShelfCount,
  });
  const heightMm = params.input.overrides?.heightMm ?? params.defaultHeightMm;
  const depthMm =
    params.input.overrides?.depthMm ??
    (type === 'sink' ? DEFAULTS.sinkBaseCabinetDepthMm : params.defaultDepthMm);
  const facadeSide = params.input.facadeSide ?? 'none';
  const drawerSystem = params.input.drawerSystem ?? (type === 'drawers' ? 'ball_bearing_guides' : undefined);
  const drawerCount =
    drawerSystem === undefined ? 0 : params.input.drawerCount ?? DEFAULTS.drawerDefaultCount;
  const drawers = Array.from({ length: drawerCount }, (_, index) =>
    calculateDrawer({
      id: `${params.id}-drawer-${index + 1}`,
      system: drawerSystem ?? 'ball_bearing_guides',
      tableWidthMm: params.input.widthMm,
      tableDepthMm: depthMm,
      material,
      materialThicknessMm: thicknessMm,
      facadeHeightMm:
        params.input.drawerFacadeHeightsMm?.[index] ??
        params.input.drawerFacadeHeightMm ??
        DEFAULTS.drawerDefaultFacadeHeightMm,
    }),
  );

  return {
    id: params.id,
    type,
    widthMm: params.input.widthMm,
    heightMm,
    depthMm,
    material,
    thicknessMm,
    shelfCount,
    facadeSide,
    parts: calculateBaseCabinetParts({
      type,
      widthMm: params.input.widthMm,
      heightMm,
      depthMm,
      material,
      thicknessMm,
      shelfCount,
      facadeSide,
    }),
    drawers,
    hardware: drawers.flatMap((drawer) => drawer.hardware),
  };
}

function resolveBaseShelfCount(params: {
  type: BaseCabinetType;
  hasDrawers: boolean;
  inputShelfCount?: number;
  defaultShelfCount?: number;
}): number {
  if (params.type !== 'standard' || params.hasDrawers) return 0;
  return params.inputShelfCount ?? params.defaultShelfCount ?? DEFAULTS.baseShelfCount;
}

function calculateBaseCabinetParts(params: {
  type: BaseCabinetType;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  material: CabinetMaterial;
  thicknessMm: number;
  shelfCount: number;
  facadeSide: 'none' | 'left' | 'right' | 'both';
}): CabinetPart[] {
  // Специальная обработка для посудомойки — свой фасад
  if (params.type === 'dishwasher') {
    return [
      createPart(
        params,
        'facade',
        'Фасад посудомойки',
        1,
        params.widthMm - DEFAULTS.facadeGapMm,
        params.heightMm - DEFAULTS.facadeGapMm,
      ),
    ];
  }

  const isDrawerCabinet = params.type === 'drawers';
  const innerWidthMm = params.widthMm - 2 * params.thicknessMm;
  const hasLeftFacadeSide = params.facadeSide === 'left' || params.facadeSide === 'both';
  const hasRightFacadeSide = params.facadeSide === 'right' || params.facadeSide === 'both';
  const leftSideHeightMm = hasLeftFacadeSide ? params.heightMm : params.heightMm - params.thicknessMm;
  const rightSideHeightMm = hasRightFacadeSide ? params.heightMm : params.heightMm - params.thicknessMm;
  const facadeSideCount = Number(hasLeftFacadeSide) + Number(hasRightFacadeSide);
  const bottomWidthMm = params.widthMm - facadeSideCount * params.thicknessMm;
  const parts: CabinetPart[] = [
    ...createSideParts(params, leftSideHeightMm, rightSideHeightMm),
    createPart(params, 'bottom', 'Bottom panel', 1, bottomWidthMm, params.depthMm),
    createPart(params, 'front_rail', 'Front plank', 1, innerWidthMm, DEFAULTS.baseRailHeightMm),
    createPart(params, 'back_rail', 'Back plank', 1, innerWidthMm, DEFAULTS.baseRailHeightMm),
  ];

  if (params.shelfCount > 0) {
    parts.push(createPart(params, 'shelf', 'Shelf', params.shelfCount, innerWidthMm, params.depthMm));
  }

  // Распашные фасады для шкафов (кроме выдвижных ящиков)
  if (!isDrawerCabinet) {
    const facadeInfos = resolveFacades({
      widthMm: params.widthMm,
      isDrawers: false,
    });

    for (const info of facadeInfos) {
      for (let i = 0; i < info.count; i++) {
        const suffix = info.count === 2 ? ` ${i === 0 ? 'левый' : 'правый'}` : '';
        parts.push(
          createPart(
            params,
            'facade',
            `Фасад${suffix}`,
            1,
            info.widthMm,
            params.heightMm - DEFAULTS.facadeGapMm,
          ),
        );
      }
    }
  }

  return parts;
}

function createSideParts(
  params: {
    material: CabinetMaterial;
    thicknessMm: number;
    depthMm: number;
  },
  leftSideHeightMm: number,
  rightSideHeightMm: number,
): CabinetPart[] {
  if (leftSideHeightMm === rightSideHeightMm) {
    return [createPart(params, 'side', 'Side panel', 2, leftSideHeightMm, params.depthMm)];
  }

  return [
    createPart(params, 'side', 'Left side panel', 1, leftSideHeightMm, params.depthMm),
    createPart(params, 'side', 'Right side panel', 1, rightSideHeightMm, params.depthMm),
  ];
}

function createPart(
  params: {
    material: CabinetMaterial;
    thicknessMm: number;
  },
  kind: CabinetPartKind,
  name: string,
  quantity: number,
  widthMm: number,
  depthMm: number,
): CabinetPart {
  return {
    name,
    kind,
    quantity,
    widthMm,
    depthMm,
    material: params.material,
    thicknessMm: params.thicknessMm,
    edgeBanding: resolveDefaultEdgeBanding(kind),
    textureDirection: resolveDefaultTextureDirection(kind),
  };
}
