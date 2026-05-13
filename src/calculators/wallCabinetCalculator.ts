import { DEFAULTS } from '../rules/defaults.ts';
import { resolveFacades } from '../rules/facadeRules.ts';
import {
  resolveDefaultEdgeBanding,
  resolveDefaultTextureDirection,
  resolveWallCabinetConstruction,
  resolveWallCabinetDepth,
} from '../rules/wallCabinetRules.ts';
import { resolveHoodCabinetHeight } from '../rules/hoodRules.ts';
import type {
  CabinetMaterial,
  CabinetPart,
  CabinetPartKind,
  CooktopType,
  WallCabinet,
  WallCabinetInput,
  WallCabinetType,
} from '../types/kitchen.ts';

export function calculateWallCabinet(params: {
  id: string;
  input: WallCabinetInput;
  defaultHeightMm: number;
  defaultDepthMm: number;
  backsplashHeightMm: number;
  cooktopType: CooktopType;
  material?: CabinetMaterial;
  thicknessMm?: number;
  defaultShelfCount?: number;
}): WallCabinet {
  const material = params.material ?? 'ldsp';
  const thicknessMm = params.thicknessMm ?? DEFAULTS.ldspThicknessMm;
  const hasBuiltInMicrowave = Boolean(params.input.hasBuiltInMicrowave);
  const isHoodCabinet = Boolean(params.input.isHoodCabinet);
  const type = resolveCabinetType(params.input.type, isHoodCabinet, hasBuiltInMicrowave);
  const heightMm = resolveHoodCabinetHeight({
    userHoodCabinetHeightMm: params.input.overrides?.heightMm,
    isHoodCabinet,
    cooktopType: params.cooktopType,
    wallCabinetHeightMm: params.defaultHeightMm,
    backsplashHeightMm: params.backsplashHeightMm,
  });
  const depthMm = resolveWallCabinetDepth({
    userDepthMm: params.input.overrides?.depthMm,
    hasBuiltInMicrowave,
    defaultDepthMm: params.defaultDepthMm,
  });
  const hasRecessedLighting = Boolean(params.input.hasRecessedLighting);
  const construction = resolveWallCabinetConstruction({ heightMm, hasRecessedLighting });
  const shelfCount = params.input.shelfCount ?? params.defaultShelfCount ?? DEFAULTS.shelfCount;

  return {
    id: params.id,
    type,
    widthMm: params.input.widthMm,
    heightMm,
    depthMm,
    material,
    thicknessMm,
    shelfCount,
    hasRecessedLighting,
    hasBuiltInMicrowave,
    isHoodCabinet,
    vitrine: params.input.vitrine,
    construction,
    parts: calculateCabinetParts({
      widthMm: params.input.widthMm,
      heightMm,
      depthMm,
      material,
      thicknessMm,
      shelfCount,
      construction,
      edgeBandingOverrides: params.input.overrides?.edgeBanding,
      textureDirectionOverrides: params.input.overrides?.textureDirection,
    }),
  };
}

function resolveCabinetType(
  type: WallCabinetType | undefined,
  isHoodCabinet: boolean,
  hasBuiltInMicrowave: boolean,
): WallCabinetType {
  if (type) return type;
  if (isHoodCabinet) return 'hood';
  if (hasBuiltInMicrowave) return 'built_in_microwave';
  return 'standard';
}

function calculateCabinetParts(params: {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  material: CabinetMaterial;
  thicknessMm: number;
  shelfCount: number;
  construction: { topFullWidth: boolean; bottomFullWidth: boolean };
  edgeBandingOverrides?: Partial<Record<CabinetPartKind, CabinetPart['edgeBanding']>>;
  textureDirectionOverrides?: Partial<Record<CabinetPartKind, CabinetPart['textureDirection']>>;
}): CabinetPart[] {
  const sideHeightMm =
    params.heightMm -
    (params.construction.topFullWidth ? params.thicknessMm : 0) -
    (params.construction.bottomFullWidth ? params.thicknessMm : 0);
  const innerWidthMm = params.widthMm - 2 * params.thicknessMm;

  const parts: CabinetPart[] = [
    createPart(params, 'side', 'Side panel', 2, sideHeightMm),
    createPart(
      params,
      'top',
      'Top panel',
      1,
      params.construction.topFullWidth ? params.widthMm : innerWidthMm,
    ),
    createPart(
      params,
      'bottom',
      'Bottom panel',
      1,
      params.construction.bottomFullWidth ? params.widthMm : innerWidthMm,
    ),
  ];

  if (params.shelfCount > 0) {
    parts.push(createPart(params, 'shelf', 'Shelf', params.shelfCount, innerWidthMm));
  }

  // Распашные фасады для настенных шкафов
  const facadeInfos = resolveFacades({ widthMm: params.widthMm });
  for (const info of facadeInfos) {
    for (let i = 0; i < info.count; i++) {
      const suffix = info.count === 2 ? ` ${i === 0 ? 'левый' : 'правый'}` : '';
      parts.push({
        name: `Фасад${suffix}`,
        kind: 'facade',
        quantity: 1,
        widthMm: info.widthMm,
        depthMm: params.heightMm - DEFAULTS.facadeGapMm,
        material: params.material,
        thicknessMm: params.thicknessMm,
        edgeBanding: params.edgeBandingOverrides?.facade ?? resolveDefaultEdgeBanding('facade'),
        textureDirection:
          params.textureDirectionOverrides?.facade ?? resolveDefaultTextureDirection('facade'),
      });
    }
  }

  return parts;
}

function createPart(
  params: {
    depthMm: number;
    material: CabinetMaterial;
    thicknessMm: number;
    edgeBandingOverrides?: Partial<Record<CabinetPartKind, CabinetPart['edgeBanding']>>;
    textureDirectionOverrides?: Partial<Record<CabinetPartKind, CabinetPart['textureDirection']>>;
  },
  kind: CabinetPartKind,
  name: string,
  quantity: number,
  widthMm: number,
): CabinetPart {
  return {
    name,
    kind,
    quantity,
    widthMm,
    depthMm: params.depthMm,
    material: params.material,
    thicknessMm: params.thicknessMm,
    edgeBanding: params.edgeBandingOverrides?.[kind] ?? resolveDefaultEdgeBanding(kind),
    textureDirection:
      params.textureDirectionOverrides?.[kind] ?? resolveDefaultTextureDirection(kind),
  };
}
