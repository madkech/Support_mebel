import { DEFAULTS } from './defaults.ts';
import type {
  CabinetPartKind,
  EdgeBandingRule,
  TextureDirection,
  WallCabinetConstruction,
} from '../types/kitchen.ts';

const frontOneMm: EdgeBandingRule = { side: 'front', thicknessMm: 1, material: 'PVC' };
const backPointFourMm: EdgeBandingRule = { side: 'back', thicknessMm: 0.4, material: 'PVC' };
const leftPointFourMm: EdgeBandingRule = { side: 'left', thicknessMm: 0.4, material: 'PVC' };
const rightPointFourMm: EdgeBandingRule = { side: 'right', thicknessMm: 0.4, material: 'PVC' };
const facadeEdgeBanding: EdgeBandingRule[] = [
  { side: 'front', thicknessMm: 1, material: 'PVC' },
  { side: 'back', thicknessMm: 1, material: 'PVC' },
  { side: 'left', thicknessMm: 1, material: 'PVC' },
  { side: 'right', thicknessMm: 1, material: 'PVC' },
];

export function resolveWallCabinetDepth(params: {
  userDepthMm?: number;
  hasBuiltInMicrowave?: boolean;
  defaultDepthMm?: number;
}): number {
  if (params.userDepthMm !== undefined) return params.userDepthMm;
  if (params.hasBuiltInMicrowave) return DEFAULTS.wallCabinetDepthWithBuiltInMicrowaveMm;
  return params.defaultDepthMm ?? DEFAULTS.wallCabinetDepthMm;
}

export function resolveWallCabinetHeight(params: {
  manualWallCabinetHeightMm?: number;
  roomHeightMm?: number;
  baseTotalHeightMm: number;
  apronHeightMm: number;
  roomHeightIncludesStretchCeiling?: boolean;
  stretchCeilingPlanned?: boolean;
  ceilingFillerMm?: number;
  stretchCeilingReserveMm?: number;
  ceilingGapMm?: number;
}): number {
  if (params.manualWallCabinetHeightMm !== undefined) return params.manualWallCabinetHeightMm;
  if (params.roomHeightMm === undefined) return DEFAULTS.wallCabinetHeightMm;

  const fillerMm = params.ceilingFillerMm ?? DEFAULTS.ceilingFillerMm;
  const stretchReserveMm =
    params.stretchCeilingReserveMm ?? DEFAULTS.stretchCeilingReserveMm;
  const ceilingGapMm = params.ceilingGapMm ?? DEFAULTS.ceilingGapMm;

  if (params.roomHeightIncludesStretchCeiling) {
    return params.roomHeightMm - params.baseTotalHeightMm - params.apronHeightMm - fillerMm;
  }

  if (params.stretchCeilingPlanned) {
    return (
      params.roomHeightMm -
      stretchReserveMm -
      params.baseTotalHeightMm -
      params.apronHeightMm -
      fillerMm
    );
  }

  if (params.roomHeightIncludesStretchCeiling === false) {
    return params.roomHeightMm - params.baseTotalHeightMm - params.apronHeightMm - ceilingGapMm;
  }

  return DEFAULTS.wallCabinetHeightMm;
}

export function resolveWallCabinetConstruction(params: {
  heightMm: number;
  hasRecessedLighting?: boolean;
}): WallCabinetConstruction {
  return {
    topFullWidth: params.heightMm > DEFAULTS.tallWallCabinetThresholdMm,
    bottomFullWidth: Boolean(params.hasRecessedLighting),
  };
}

export function resolveDefaultEdgeBanding(kind: CabinetPartKind): EdgeBandingRule[] {
  if (kind === 'facade') return facadeEdgeBanding;
  if (kind === 'shelf') return [frontOneMm, backPointFourMm, leftPointFourMm, rightPointFourMm];
  return [frontOneMm, backPointFourMm];
}

export function resolveDefaultTextureDirection(kind: CabinetPartKind): TextureDirection {
  if (kind === 'facade') return 'vertical';
  if (kind === 'side') return 'vertical';
  return 'none';
}
