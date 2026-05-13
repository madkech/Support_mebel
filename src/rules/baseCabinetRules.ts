import { DEFAULTS } from './defaults.ts';

export function resolveBaseTotalHeight(params: {
  userBaseTotalHeightMm?: number;
  hasGolaProfile?: boolean;
  hasDishwasher?: boolean;
}): number {
  if (params.userBaseTotalHeightMm !== undefined) return params.userBaseTotalHeightMm;

  if (params.hasGolaProfile && params.hasDishwasher) {
    return DEFAULTS.baseTotalHeightWithGolaAndDishwasherMm;
  }

  if (params.hasGolaProfile) return DEFAULTS.baseTotalHeightWithGolaMm;

  return DEFAULTS.baseTotalHeightMm;
}

export function resolveBaseCabinetHeight(params: {
  userHeightMm?: number;
  baseTotalHeightMm?: number;
  legHeightMm?: number;
  countertopThicknessMm?: number;
}): number {
  if (params.userHeightMm !== undefined) return params.userHeightMm;

  return (
    (params.baseTotalHeightMm ?? DEFAULTS.baseTotalHeightMm) -
    (params.legHeightMm ?? DEFAULTS.baseLegHeightMm) -
    (params.countertopThicknessMm ?? DEFAULTS.countertopThicknessMm)
  );
}
