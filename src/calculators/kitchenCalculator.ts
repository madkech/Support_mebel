import { resolveBacksplashHeight } from '../rules/backsplashRules.ts';
import { resolveBaseCabinetHeight, resolveBaseTotalHeight } from '../rules/baseCabinetRules.ts';
import { resolveCountertopUpstand } from '../rules/countertopRules.ts';
import { DEFAULTS } from '../rules/defaults.ts';
import { resolveWallCabinetHeight } from '../rules/wallCabinetRules.ts';
import { calculateBaseCabinet } from './baseCabinetCalculator.ts';
import { calculateWallCabinet } from './wallCabinetCalculator.ts';
import type {
  AppliedRule,
  BaseCabinetInput,
  BaseCabinetModuleType,
  FillDirection,
  KitchenProject,
  KitchenProjectInput,
  WallCabinetInput,
} from '../types/kitchen.ts';

const editableParameters = [
  'backsplashHeightMm',
  'countertopUpstand',
  'baseTotalHeightMm',
  'baseLegHeightMm',
  'countertopThicknessMm',
  'baseCabinetDefaultHeightMm',
  'baseCabinetDefaultDepthMm',
  'countertop.depthMm',
  'wallCabinetDefaultHeightMm',
  'wallCabinetDefaultDepthMm',
  'baseCabinets[].heightMm',
  'baseCabinets[].depthMm',
  'wallCabinets[].heightMm',
  'wallCabinets[].depthMm',
  'wallCabinets[].edgeBanding',
  'wallCabinets[].textureDirection',
  'manualBaseCabinets',
  'manualWallCabinets',
];

export function calculateKitchenProject(input: KitchenProjectInput): KitchenProject {
  if (input.layoutType !== 'straight') {
    throw new Error('Only straight kitchen layout is supported in this MVP.');
  }

  const appliedRules: AppliedRule[] = [];
  const warnings: string[] = [];
  const backsplashHeightMm = resolveBacksplashHeight({
    userBacksplashHeightMm: input.backsplashHeightMm,
    backsplashType: input.backsplashType,
  });
  appliedRules.push({
    code: 'backsplash-height',
    message: `Высота фартука определена как ${backsplashHeightMm} мм.`,
  });

  const countertopUpstand = resolveCountertopUpstand({
    userCountertopUpstand: input.countertopUpstand,
    backsplashType: input.backsplashType,
  });
  appliedRules.push({
    code: 'countertop-upstand',
    message: `Бортик у столешницы: ${countertopUpstand ? 'да' : 'нет'}.`,
  });

  const baseTotalHeightMm = resolveBaseTotalHeight({
    userBaseTotalHeightMm: input.baseTotalHeightMm,
    hasGolaProfile: input.hasGolaProfile,
    hasDishwasher: input.hasDishwasher,
  });
  const baseLegHeightMm = input.baseLegHeightMm ?? DEFAULTS.baseLegHeightMm;
  const countertopThicknessMm =
    input.countertopThicknessMm ?? DEFAULTS.countertopThicknessMm;
  const baseCabinetDefaultHeightMm = resolveBaseCabinetHeight({
    baseTotalHeightMm,
    legHeightMm: baseLegHeightMm,
    countertopThicknessMm,
  });
  const baseCabinetDefaultDepthMm = input.baseCabinetDepthMm ?? DEFAULTS.baseCabinetDepthMm;
  const countertop = {
    lengthMm: input.wallLengthMm,
    depthMm: input.countertopDepthMm ?? DEFAULTS.countertopDepthMm,
    thicknessMm: countertopThicknessMm,
  };
  appliedRules.push({
    code: 'lower-module-height',
    message: `Высота корпуса нижнего модуля: ${baseCabinetDefaultHeightMm} мм.`,
  });
  appliedRules.push({
    code: 'countertop',
    message: `Столешница: ${countertop.lengthMm}x${countertop.depthMm}x${countertop.thicknessMm} мм.`,
  });

  const wallCabinetDefaultHeightMm = resolveWallCabinetHeight({
    manualWallCabinetHeightMm: input.wallCabinetDefaultHeightMm,
    roomHeightMm: input.ceilingHeightMm,
    baseTotalHeightMm,
    apronHeightMm: backsplashHeightMm,
    roomHeightIncludesStretchCeiling: input.roomHeightIncludesStretchCeiling,
    stretchCeilingPlanned: input.stretchCeilingPlanned,
    ceilingFillerMm: input.ceilingFillerMm,
    stretchCeilingReserveMm: input.stretchCeilingReserveMm,
    ceilingGapMm: input.ceilingGapMm,
  });
  const ceilingCompletion = resolveCeilingCompletion({
    roomHeightMm: input.ceilingHeightMm,
    baseTotalHeightMm,
    backsplashHeightMm,
    wallCabinetHeightMm: wallCabinetDefaultHeightMm,
    hasManualWallCabinetHeight: input.wallCabinetDefaultHeightMm !== undefined,
    roomHeightIncludesStretchCeiling: input.roomHeightIncludesStretchCeiling,
    stretchCeilingPlanned: input.stretchCeilingPlanned,
    ceilingFillerMm: input.ceilingFillerMm,
    stretchCeilingReserveMm: input.stretchCeilingReserveMm,
    ceilingGapMm: input.ceilingGapMm,
  });
  if (ceilingCompletion.type === 'filler') {
    appliedRules.push({
      code: 'ceiling-filler',
      message: `Добор до потолка: ${ceilingCompletion.sizeMm} мм.`,
    });
  } else if (ceilingCompletion.type === 'gap') {
    appliedRules.push({
      code: 'ceiling-gap',
      message: `Зазор до потолка: ${ceilingCompletion.sizeMm} мм.`,
    });
  }
  const hasAnyBuiltInMicrowave =
    Boolean(input.hasBuiltInMicrowave) ||
    Boolean(input.manualWallCabinets?.some((cabinet) => cabinet.hasBuiltInMicrowave));
  const wallCabinetDefaultDepthMm =
    input.wallCabinetDefaultDepthMm ??
    (hasAnyBuiltInMicrowave
      ? DEFAULTS.wallCabinetDepthWithBuiltInMicrowaveMm
      : DEFAULTS.wallCabinetDepthMm);
  const modulePlan = createAutomaticModulePlan(input, warnings, appliedRules);

  const baseCabinetInputs = input.manualBaseCabinets ?? modulePlan.baseCabinets;
  const baseCabinets = baseCabinetInputs.map((cabinetInput, index) =>
    calculateBaseCabinet({
      id: `lower-${index + 1}`,
      input: cabinetInput,
      defaultHeightMm: baseCabinetDefaultHeightMm,
      defaultDepthMm: baseCabinetDefaultDepthMm,
      material: input.material ?? 'ldsp',
      thicknessMm: input.thicknessMm ?? DEFAULTS.ldspThicknessMm,
      defaultShelfCount: input.shelfCount,
    }),
  );

  const wallCabinetInputs = input.manualWallCabinets ?? modulePlan.wallCabinets;

  const cooktopType = input.cooktopType ?? 'none';
  const wallCabinets = wallCabinetInputs.map((cabinetInput, index) =>
    calculateWallCabinet({
      id: `upper-${index + 1}`,
      input: cabinetInput,
      defaultHeightMm: wallCabinetDefaultHeightMm,
      defaultDepthMm: wallCabinetDefaultDepthMm,
      backsplashHeightMm,
      cooktopType,
      material: input.material ?? 'ldsp',
      thicknessMm: input.thicknessMm ?? DEFAULTS.ldspThicknessMm,
      defaultShelfCount: input.shelfCount ?? DEFAULTS.shelfCount,
    }),
  );

  for (const cabinet of baseCabinets) {
    if (cabinet.heightMm <= 0) {
      warnings.push(`Lower module ${cabinet.id} has non-positive height ${cabinet.heightMm} mm.`);
    }

    if (cabinet.widthMm <= 2 * cabinet.thicknessMm) {
      warnings.push(
        `Lower module ${cabinet.id} width must be greater than twice material thickness.`,
      );
    }
  }

  for (const cabinet of wallCabinets) {
    if (cabinet.heightMm <= 0) {
      warnings.push(`Upper cabinet ${cabinet.id} has non-positive height ${cabinet.heightMm} mm.`);
    }

    if (cabinet.widthMm <= 2 * cabinet.thicknessMm) {
      warnings.push(
        `Upper cabinet ${cabinet.id} width must be greater than twice material thickness.`,
      );
    }
  }

  return {
    layoutType: 'straight',
    wallLengthMm: input.wallLengthMm,
    ceilingHeightMm: input.ceilingHeightMm,
    backsplashType: input.backsplashType,
    backsplashHeightMm,
    countertopUpstand,
    cooktopType,
    baseTotalHeightMm,
    baseLegHeightMm,
    countertopThicknessMm,
    baseCabinetDefaultHeightMm,
    baseCabinetDefaultDepthMm,
    countertop,
    wallCabinetDefaultHeightMm,
    wallCabinetDefaultDepthMm,
    ceilingFillerMm: ceilingCompletion.type === 'filler' ? ceilingCompletion.sizeMm : undefined,
    stretchCeilingReserveMm: ceilingCompletion.stretchCeilingReserveMm,
    ceilingGapMm: ceilingCompletion.type === 'gap' ? ceilingCompletion.sizeMm : undefined,
    ceilingCompletionType: ceilingCompletion.type,
    ceilingCompletionMm: ceilingCompletion.sizeMm,
    material: input.material ?? 'ldsp',
    thicknessMm: input.thicknessMm ?? DEFAULTS.ldspThicknessMm,
    facadeMaterial: input.facadeMaterial ?? DEFAULTS.defaultFacadeMaterial,
    facadeThicknessMm: input.facadeThicknessMm ?? DEFAULTS.defaultFacadeThicknessMm,
    shelfCount: input.shelfCount ?? DEFAULTS.shelfCount,
    baseCabinets,
    wallCabinets,
    appliedRules,
    warnings,
    unresolvedWidthMm: modulePlan.unresolvedWidthMm,
    remainderResolution: modulePlan.remainderResolution,
    fillerWidthMm: modulePlan.fillerWidthMm,
    editableParameters,
  };
}

function createAutomaticModulePlan(
  input: KitchenProjectInput,
  warnings: string[],
  appliedRules: AppliedRule[],
): { baseCabinets: BaseCabinetInput[]; wallCabinets: WallCabinetInput[]; unresolvedWidthMm: number; remainderResolution: 'none' | 'distribute' | 'extra_module'; fillerWidthMm?: number } {
  const moduleWidthMm = input.autoModuleWidthMm ?? DEFAULTS.autoModuleWidthMm;
  const fullModuleCount = Math.floor(input.wallLengthMm / moduleWidthMm);
  const unresolvedWidthMm = input.wallLengthMm - fullModuleCount * moduleWidthMm;
  const hasSinkCabinet = input.hasSinkCabinet ?? true;
  const hasDishDryerCabinet = input.hasDishDryerCabinet ?? hasSinkCabinet;
  const rawCooktop = input.cooktopType ?? 'none';
  const hasCooktopCabinet = rawCooktop !== 'none' && rawCooktop !== 'stove_gas' && rawCooktop !== 'stove_electric';
  const hasStoveCabinet = rawCooktop === 'stove_gas' || rawCooktop === 'stove_electric';
  const hasDishwasherCabinet = input.hasDishwasher ?? false;
  const hasDrawersCabinet = input.hasDrawersCabinet ?? false;

  // --- Умное распределение остатка стены ---
  let actualModuleCount = fullModuleCount;
  let adjustedWidths: number[];
  let remainderResolution: 'distribute' | 'extra_module' | 'none';
  let fillerWidthMm: number | undefined;
  const remainderMode = input.remainderMode ?? 'auto';

  if (unresolvedWidthMm === 0) {
    // Идеальное совпадение — все модули одинаковой ширины
    adjustedWidths = Array.from({ length: fullModuleCount }, () => moduleWidthMm);
    remainderResolution = 'none';
  } else if (remainderMode === 'filler') {
    // Пользователь выбрал добор — модули не меняются, остаток отображается как добор
    adjustedWidths = Array.from({ length: fullModuleCount }, () => moduleWidthMm);
    remainderResolution = 'none';
    fillerWidthMm = unresolvedWidthMm;
    appliedRules.push({
      code: 'smart-remainder-filler',
      message:
        `Остаток стены ${unresolvedWidthMm} мм оставлен как добор (пользовательский выбор).`,
    });
  } else if (remainderMode === 'distribute' || (remainderMode === 'auto' && unresolvedWidthMm < DEFAULTS.minRemainderForExtraModuleMm)) {
    // Распределяем остаток между существующими модулями
    const extraPerModule = Math.floor(unresolvedWidthMm / fullModuleCount);
    const leftOverMm = unresolvedWidthMm - extraPerModule * fullModuleCount;
    adjustedWidths = Array.from({ length: fullModuleCount }, (_, i) =>
      moduleWidthMm + extraPerModule + (i < leftOverMm ? 1 : 0),
    );
    remainderResolution = 'distribute';

    const uniqueWidths = new Set(adjustedWidths);
    if (uniqueWidths.size <= 1) {
      // Все модули стали одинаковой ширины
      appliedRules.push({
        code: 'smart-remainder-distribute-equal',
        message:
          `Остаток стены ${unresolvedWidthMm} мм равномерно распределён: все ${fullModuleCount} модулей расширены до ${adjustedWidths[0]} мм.`,
      });
    } else {
      // Модули разной ширины
      appliedRules.push({
        code: 'smart-remainder-distribute-uneven',
        message:
          `Остаток стены ${unresolvedWidthMm} мм распределён: ширина модулей (мм): ${adjustedWidths.join(', ')}.`,
      });
      warnings.push(
        `Остаток ${unresolvedWidthMm} мм распределён. Модули имеют разную ширину: ${adjustedWidths.join(', ')} мм.`,
      );
    }
  } else if (remainderMode === 'extra_module' || (remainderMode === 'auto' && unresolvedWidthMm >= DEFAULTS.minRemainderForExtraModuleMm)) {
    // Создаём дополнительный модуль
    actualModuleCount = fullModuleCount + 1;
    adjustedWidths = Array.from({ length: fullModuleCount }, () => moduleWidthMm);
    adjustedWidths.push(unresolvedWidthMm);
    remainderResolution = 'extra_module';

    appliedRules.push({
      code: 'smart-remainder-extra-module',
      message:
        `Остаток стены ${unresolvedWidthMm} мм ≥ ${DEFAULTS.minRemainderForExtraModuleMm} мм: создан дополнительный модуль шириной ${unresolvedWidthMm} мм. Всего модулей: ${actualModuleCount}.`,
    });

    if (unresolvedWidthMm < moduleWidthMm * 0.5) {
      warnings.push(
        `Дополнительный модуль узкий (${unresolvedWidthMm} мм). При необходимости настройте ширину модуля вручную.`,
      );
    }
  } else {
    // Остаток мал — распределяем между существующими модулями
    const extraPerModule = Math.floor(unresolvedWidthMm / fullModuleCount);
    const leftOverMm = unresolvedWidthMm - extraPerModule * fullModuleCount;
    adjustedWidths = Array.from({ length: fullModuleCount }, (_, i) =>
      moduleWidthMm + extraPerModule + (i < leftOverMm ? 1 : 0),
    );
    remainderResolution = 'distribute';

    const uniqueWidths = new Set(adjustedWidths);
    if (uniqueWidths.size <= 1) {
      // Все модули стали одинаковой ширины
      appliedRules.push({
        code: 'smart-remainder-distribute-equal',
        message:
          `Остаток стены ${unresolvedWidthMm} мм равномерно распределён: все ${fullModuleCount} модулей расширены до ${adjustedWidths[0]} мм.`,
      });
    } else {
      // Модули разной ширины
      appliedRules.push({
        code: 'smart-remainder-distribute-uneven',
        message:
          `Остаток стены ${unresolvedWidthMm} мм распределён: ширина модулей (мм): ${adjustedWidths.join(', ')}.`,
      });
      warnings.push(
        `Остаток ${unresolvedWidthMm} мм распределён. Модули имеют разную ширину: ${adjustedWidths.join(', ')} мм.`,
      );
    }
  }

  // --- Определение типов нижних модулей ---
  let baseModuleTypes: BaseCabinetModuleType[];

  if (input.moduleTypes && input.moduleTypes.length === actualModuleCount) {
    // Пользователь явно указал типы — используем их
    baseModuleTypes = [...input.moduleTypes];
    appliedRules.push({
      code: 'module-types-custom',
      message: `Типы модулей заданы пользователем: ${input.moduleTypes.join(' → ')}.`,
    });
  } else {
    // Автоматическое назначение типов
    baseModuleTypes = Array.from({ length: actualModuleCount }, (_, index) =>
      resolveAutomaticBaseCabinetType(index, {
        hasSinkCabinet,
        hasCooktopCabinet,
        hasStoveCabinet,
        hasDishwasherCabinet,
        hasDrawersCabinet,
      }),
    );
  }

  // --- Применение направления заполнения ---
  const fillDir: FillDirection = input.fillDirection ?? 'left-to-right';
  if (fillDir === 'right-to-left') {
    // Обратный порядок для wall cabinets (зеркалим)
    baseModuleTypes.reverse();
  } else if (fillDir === 'center-out') {
    // Начинаем с центра, чередуем вправо/влево
    const half = Math.floor(actualModuleCount / 2);
    const reordered: BaseCabinetModuleType[] = [];
    for (let i = 0; i < actualModuleCount; i++) {
      const offset = i % 2 === 0 ? Math.ceil(i / 2) : -Math.ceil(i / 2);
      const srcIdx = half + offset;
      if (srcIdx >= 0 && srcIdx < actualModuleCount) {
        reordered.push(baseModuleTypes[srcIdx]);
      }
    }
    baseModuleTypes = reordered;
  }

  // --- Определяем индекс модуля с варочной/плитой для навесных шкафов ---
  const cooktopModuleIdx = baseModuleTypes.findIndex(
    t => t === 'cooktop' || t === 'stove',
  );
  const hoodIndex = cooktopModuleIdx >= 0 ? cooktopModuleIdx : 2;

  const baseCabinets = Array.from({ length: actualModuleCount }, (_, index): BaseCabinetInput => ({
    widthMm: adjustedWidths[index],
    shelfCount: input.shelfCount,
    type: baseModuleTypes[index],
  }));

  const wallCabinets = Array.from({ length: actualModuleCount }, (_, index): WallCabinetInput => ({
    widthMm: adjustedWidths[index],
    shelfCount: input.shelfCount,
    hasRecessedLighting: input.hasRecessedLighting,
    isHoodCabinet: input.hasHoodCabinet && index === hoodIndex,
    hasBuiltInMicrowave: input.hasBuiltInMicrowave && index === 3,
    type: hasDishDryerCabinet && index === 0 ? 'dish_dryer' : undefined,
  }));

  if (input.hasHoodCabinet && hoodIndex >= actualModuleCount) {
    warnings.push('Запрошен шкаф под вытяжку, но модуль с варочной панелью/плитой не найден.');
  }

  if (input.hasBuiltInMicrowave && actualModuleCount < 4) {
    warnings.push('Запрошена встроенная микроволновка, но в автоматическом плане нет четвёртого модуля.');
  }

  appliedRules.push({
    code: 'auto-module-plan',
    message: `Созданы автоматические модули кухни: нижних ${actualModuleCount} шт., навесных ${actualModuleCount} шт.`,
  });

  return { baseCabinets, wallCabinets, unresolvedWidthMm, remainderResolution, fillerWidthMm };
}

function resolveAutomaticBaseCabinetType(
  index: number,
  params: {
    hasSinkCabinet: boolean;
    hasCooktopCabinet: boolean;
    hasStoveCabinet: boolean;
    hasDishwasherCabinet: boolean;
    hasDrawersCabinet: boolean;
  },
): BaseCabinetModuleType {
  if (params.hasSinkCabinet && index === 0) return 'sink';
  if (params.hasDishwasherCabinet && index === 1) return 'dishwasher';
  if ((params.hasCooktopCabinet || params.hasStoveCabinet) && index === 2) {
    return params.hasStoveCabinet ? 'stove' : 'cooktop';
  }
  if (params.hasDrawersCabinet && index === 3) return 'drawers';
  return 'standard';
}

function resolveCeilingCompletion(params: {
  roomHeightMm?: number;
  baseTotalHeightMm: number;
  backsplashHeightMm: number;
  wallCabinetHeightMm: number;
  hasManualWallCabinetHeight: boolean;
  roomHeightIncludesStretchCeiling?: boolean;
  stretchCeilingPlanned?: boolean;
  ceilingFillerMm?: number;
  stretchCeilingReserveMm?: number;
  ceilingGapMm?: number;
}): {
  type?: 'filler' | 'gap';
  sizeMm?: number;
  stretchCeilingReserveMm?: number;
} {
  if (params.roomHeightMm === undefined) return {};

  const reserveMm =
    params.stretchCeilingPlanned ? params.stretchCeilingReserveMm ?? DEFAULTS.stretchCeilingReserveMm : 0;
  const effectiveRoomHeightMm = params.roomHeightMm - reserveMm;
  const remainingMm =
    effectiveRoomHeightMm -
    params.baseTotalHeightMm -
    params.backsplashHeightMm -
    params.wallCabinetHeightMm;

  if (params.hasManualWallCabinetHeight) {
    const type =
      params.roomHeightIncludesStretchCeiling === false && !params.stretchCeilingPlanned
        ? 'gap'
        : 'filler';
    return {
      type,
      sizeMm: Math.max(0, remainingMm),
      stretchCeilingReserveMm: params.stretchCeilingPlanned ? reserveMm : undefined,
    };
  }

  if (params.roomHeightIncludesStretchCeiling || params.stretchCeilingPlanned) {
    return {
      type: 'filler',
      sizeMm: params.ceilingFillerMm ?? DEFAULTS.ceilingFillerMm,
      stretchCeilingReserveMm: params.stretchCeilingPlanned ? reserveMm : undefined,
    };
  }

  if (params.roomHeightIncludesStretchCeiling === false) {
    return {
      type: 'gap',
      sizeMm: params.ceilingGapMm ?? DEFAULTS.ceilingGapMm,
    };
  }

  return {};
}
