import type { BacksplashType } from '../types/kitchen.ts';

export function resolveCountertopUpstand(params: {
  userCountertopUpstand?: boolean;
  backsplashType?: BacksplashType;
}): boolean {
  if (typeof params.userCountertopUpstand === 'boolean') {
    return params.userCountertopUpstand;
  }

  if (
    params.backsplashType === 'client_tile_existing' ||
    params.backsplashType === 'client_tile_planned'
  ) {
    return false;
  }

  if (params.backsplashType === 'our_ldsp_backsplash') {
    return true;
  }

  return false;
}
