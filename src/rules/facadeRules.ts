import { DEFAULTS } from './defaults.ts';

export type FacadeInfo = {
  count: 1 | 2;
  widthMm: number; // ширина одного фасада
};

/**
 * Определяет количество и ширину распашных фасадов для модуля.
 *
 * Правило:
 * - Если ширина модуля ≤ 600 мм → 1 фасад (на всю ширину за вычетом зазора).
 * - Если ширина модуля > 600 мм → 2 равных фасада.
 * - Если isDrawers === true → правило не применяется (ящики обрабатываются отдельно).
 *
 * @param params.widthMm - ширина корпуса модуля
 * @param params.facadeGapMm - зазор между фасадами (по умолчанию DEFAULTS.facadeGapMm)
 * @param params.isDrawers - модуль с выкатными ящиками (исключение из правила)
 */
export function resolveFacades(params: {
  widthMm: number;
  facadeGapMm?: number;
  isDrawers?: boolean;
}): FacadeInfo[] {
  if (params.isDrawers) {
    // Для выкатных ящиков правило не применяется — фасады рассчитываются в drawerRules
    return [];
  }

  const gapMm = params.facadeGapMm ?? DEFAULTS.facadeGapMm;

  if (params.widthMm <= 600) {
    // Один фасад на всю ширину
    return [
      {
        count: 1,
        widthMm: params.widthMm - gapMm,
      },
    ];
  }

  // Два равных фасада
  return [
    {
      count: 2,
      widthMm: (params.widthMm - gapMm * 2) / 2,
    },
  ];
}
