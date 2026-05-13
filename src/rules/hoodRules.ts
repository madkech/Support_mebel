import { DEFAULTS } from './defaults.ts';
import type { CooktopType } from '../types/kitchen.ts';

export function resolveHoodCabinetHeight(params: {
  userHoodCabinetHeightMm?: number;
  isHoodCabinet: boolean;
  cooktopType: CooktopType;
  wallCabinetHeightMm: number;
  backsplashHeightMm: number;
}): number {
  if (params.userHoodCabinetHeightMm !== undefined) return params.userHoodCabinetHeightMm;

  if (params.isHoodCabinet && params.cooktopType === 'gas') {
    return (
      params.wallCabinetHeightMm +
      params.backsplashHeightMm -
      DEFAULTS.gasCooktopHoodDistanceMm
    );
  }

  return params.wallCabinetHeightMm;
}
