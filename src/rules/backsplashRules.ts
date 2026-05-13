import { DEFAULTS } from './defaults.ts';
import type { BacksplashType } from '../types/kitchen.ts';

export function resolveBacksplashHeight(params: {
  userBacksplashHeightMm?: number;
  backsplashType?: BacksplashType;
}): number {
  if (params.userBacksplashHeightMm !== undefined) return params.userBacksplashHeightMm;

  if (
    params.backsplashType === 'client_tile_existing' ||
    params.backsplashType === 'client_tile_planned'
  ) {
    return DEFAULTS.clientTileBacksplashHeightMm;
  }

  if (params.backsplashType === 'our_ldsp_backsplash') {
    return DEFAULTS.ourLdspBacksplashHeightMm;
  }

  return DEFAULTS.clientTileBacksplashHeightMm;
}
