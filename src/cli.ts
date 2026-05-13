import { readFile } from 'node:fs/promises';
import { stdin as inputStream, stdout as outputStream } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { calculateKitchenProject } from './index.ts';
import type {
  AppliedRule,
  BaseCabinetType,
  BacksplashType,
  CabinetMaterial,
  CabinetPartKind,
  CooktopType,
  DrawerSystem,
  KitchenProjectInput,
  WallCabinetType,
} from './index.ts';

const layoutLabels = {
  straight: 'прямая кухня',
} satisfies Record<KitchenProjectInput['layoutType'], string>;

const backsplashLabels = {
  client_tile_existing: 'плитка клиента уже есть',
  client_tile_planned: 'плитка клиента планируется',
  our_ldsp_backsplash: 'наш фартук ЛДСП',
  custom: 'ручное значение',
} satisfies Record<BacksplashType, string>;

const cooktopLabels = {
  none: 'нет',
  electric: 'электрическая',
  gas: 'газовая',
  stove_electric: 'электрическая плита',
  stove_gas: 'газовая плита',
} satisfies Record<CooktopType, string>;

const cabinetTypeLabels = {
  standard: 'обычный',
  dish_dryer: 'с сушкой',
  hood: 'под вытяжку',
  built_in_microwave: 'под встроенную микроволновку',
} satisfies Record<WallCabinetType, string>;

const baseCabinetTypeLabels = {
  standard: 'обычный',
  sink: 'под мойку',
  cooktop: 'под варочную панель',
  dishwasher: 'под посудомоечную машину',
  drawers: 'с выкатными ящиками',
} satisfies Record<BaseCabinetType, string>;

const partKindLabels = {
  side: 'боковина',
  top: 'крышка',
  bottom: 'дно',
  shelf: 'полка',
  front_rail: 'планка передняя',
  back_rail: 'планка задняя',
  facade: 'фасад',
  drawer_side: 'боковина ящика',
  drawer_front: 'передняя стенка ящика',
  drawer_back: 'задняя стенка ящика',
  drawer_bottom: 'дно ящика',
} satisfies Record<CabinetPartKind, string>;

const materialLabels = {
  ldsp: 'ЛДСП',
  mdf: 'МДФ',
  hdf: 'ХДФ',
} satisfies Record<CabinetMaterial, string>;

const drawerSystemLabels = {
  ball_bearing_guides: 'шариковые направляющие',
  undermount_guides: 'направляющие скрытого монтажа',
  tandembox: 'Tandembox',
} satisfies Record<DrawerSystem, string>;

const editableParameterLabels: Record<string, string> = {
  backsplashHeightMm: 'высота фартука',
  countertopUpstand: 'бортик у столешницы',
  baseTotalHeightMm: 'общая высота нижней базы со столешницей',
  baseLegHeightMm: 'высота ножек',
  countertopThicknessMm: 'толщина столешницы',
  baseCabinetDefaultHeightMm: 'стандартная высота корпуса нижних модулей',
  baseCabinetDefaultDepthMm: 'стандартная глубина нижних модулей',
  'countertop.depthMm': 'глубина столешницы',
  wallCabinetDefaultHeightMm: 'стандартная высота навесных шкафов',
  wallCabinetDefaultDepthMm: 'стандартная глубина навесных шкафов',
  'baseCabinets[].heightMm': 'высота отдельного нижнего модуля',
  'baseCabinets[].depthMm': 'глубина отдельного нижнего модуля',
  'wallCabinets[].heightMm': 'высота отдельного навесного шкафа',
  'wallCabinets[].depthMm': 'глубина отдельного навесного шкафа',
  'wallCabinets[].edgeBanding': 'кромка деталей навесных шкафов',
  'wallCabinets[].textureDirection': 'направление текстуры деталей',
  manualBaseCabinets: 'ручной план нижних модулей',
  manualWallCabinets: 'ручной план навесных шкафов',
};

const input = await resolveInput();
const project = calculateKitchenProject(input);

console.log('Расчет кухни');
console.log('');
console.log('Общее');
console.log(`- планировка: ${layoutLabels[project.layoutType]}`);
console.log(`- длина стены: ${project.wallLengthMm} мм`);
console.log(`- высота потолка: ${formatOptionalMm(project.ceilingHeightMm)}`);
console.log(`- высота нижней базы со столешницей: ${project.baseTotalHeightMm} мм`);
console.log(`- высота корпуса нижних модулей: ${project.baseCabinetDefaultHeightMm} мм`);
console.log(`- глубина нижних модулей: ${project.baseCabinetDefaultDepthMm} мм`);
console.log(
  `- столешница: ${project.countertop.lengthMm}x${project.countertop.depthMm}x${project.countertop.thicknessMm} мм`,
);
console.log(`- высота навесных шкафов: ${project.wallCabinetDefaultHeightMm} мм`);
console.log(`- глубина навесных шкафов: ${project.wallCabinetDefaultDepthMm} мм`);
if (project.ceilingCompletionType === 'filler' && project.ceilingCompletionMm !== undefined) {
  console.log(`- добор до потолка: ${project.ceilingCompletionMm} мм`);
}
if (project.ceilingCompletionType === 'gap' && project.ceilingCompletionMm !== undefined) {
  console.log(`- зазор до потолка: ${project.ceilingCompletionMm} мм`);
}
if (project.stretchCeilingReserveMm !== undefined) {
  console.log(`- запас под натяжной потолок: ${project.stretchCeilingReserveMm} мм`);
}
console.log(`- тип фартука: ${formatBacksplash(project.backsplashType)}`);
console.log(`- высота фартука: ${project.backsplashHeightMm} мм`);
console.log(`- бортик у столешницы: ${formatBoolean(project.countertopUpstand)}`);
console.log(`- варочная панель: ${cooktopLabels[project.cooktopType]}`);
if (project.remainderResolution !== 'none') {
  console.log(`- распределение остатка стены: ${remainderResolutionLabel(project.remainderResolution)}`);
}
console.log('');

console.log('Нижние модули');
for (const [index, cabinet] of project.baseCabinets.entries()) {
  const baseTitle =
    cabinet.type === 'dishwasher'
      ? 'место под посудомоечную машину'
      : baseCabinetTypeLabels[cabinet.type];
  console.log(
    `Нижний модуль ${index + 1}. ${baseTitle}: ${cabinet.widthMm}x${cabinet.heightMm}x${cabinet.depthMm} мм`,
  );

  for (const part of cabinet.parts) {
    console.log(
      `   - ${partKindLabels[part.kind]}: ${part.quantity} шт., ${part.widthMm}x${part.depthMm} мм, ${materialLabels[part.material]} ${part.thicknessMm} мм`,
    );
  }

  for (const [drawerIndex, drawer] of cabinet.drawers.entries()) {
    console.log(
      `   ящик ${drawerIndex + 1}: ${drawerSystemLabels[drawer.system]}, высота фасада ${drawer.facadeHeightMm} мм`,
    );

    for (const part of drawer.parts) {
      console.log(
        `      - ${partKindLabels[part.kind]}: ${part.quantity} шт., ${part.widthMm}x${part.depthMm} мм, ${materialLabels[part.material]} ${part.thicknessMm} мм`,
      );
    }

    for (const item of drawer.hardware) {
      const length = item.lengthMm === undefined ? '' : ` ${item.lengthMm} мм`;
      console.log(`      - ${item.name}${length}: ${item.quantity} комплект`);
    }
  }
}

console.log('');
console.log('Навесные шкафы');
for (const [index, cabinet] of project.wallCabinets.entries()) {
  console.log(
    `Навесной шкаф ${index + 1}. ${cabinetTypeLabels[cabinet.type]}: ${cabinet.widthMm}x${cabinet.heightMm}x${cabinet.depthMm} мм`,
  );

  for (const part of cabinet.parts) {
    console.log(
      `   - ${partKindLabels[part.kind]}: ${part.quantity} шт., ${part.widthMm}x${part.depthMm} мм, ${materialLabels[part.material]} ${part.thicknessMm} мм`,
    );
  }
}

if (project.appliedRules.length > 0) {
  console.log('');
  console.log('Примененные правила');
  for (const rule of project.appliedRules) {
    console.log(`- ${formatAppliedRule(rule)}`);
  }
}

if (project.warnings.length > 0) {
  console.log('');
  console.log('Предупреждения');
  for (const warning of project.warnings) {
    console.log(`- ${formatWarning(warning)}`);
  }
}

console.log('');
console.log('Параметры, которые можно изменить вручную');
for (const parameter of project.editableParameters) {
  console.log(`- ${editableParameterLabels[parameter] ?? parameter}`);
}

async function resolveInput(): Promise<KitchenProjectInput> {
  const inputPath = process.argv[2];

  if (inputPath !== undefined) {
    const rawInput = await readFile(inputPath, 'utf8');
    return JSON.parse(rawInput) as KitchenProjectInput;
  }

  return askKitchenInput();
}

async function askKitchenInput(): Promise<KitchenProjectInput> {
  const { question, close } = await createQuestionReader();

  try {
    console.log('Введите данные кухни. Пустой ответ оставляет значение по умолчанию.');
    console.log('');

    const wallLengthMm = await askNumber(question, 'Длина стены, мм', { required: true });
    const ceilingHeightMm = await askNumber(question, 'Высота помещения, мм', { required: true });
    const roomHeightIncludesStretchCeiling = await askBoolean(
      question,
      'Высота помещения указана с учетом готового натяжного потолка',
      true,
    );
    const stretchCeilingPlanned = roomHeightIncludesStretchCeiling
      ? false
      : await askBoolean(question, 'Планируется натяжной потолок', false);
    const autoModuleWidthMm = await askNumber(question, 'Ширина модуля для авторазбивки, мм', {
      defaultValue: 600,
    });
    const countertopDepthMm = await askNumber(question, 'Глубина столешницы, мм', {
      defaultValue: 600,
    });
    const backsplashType = await askChoice<BacksplashType>(
      question,
      'Фартук',
      [
        ['client_tile_existing', 'плитка клиента уже есть'],
        ['client_tile_planned', 'плитка клиента планируется'],
        ['our_ldsp_backsplash', 'наш фартук ЛДСП'],
        ['custom', 'своя высота'],
      ],
      'client_tile_existing',
    );
    const backsplashHeightMm =
      backsplashType === 'custom'
        ? await askNumber(question, 'Своя высота фартука, мм', { required: true })
        : undefined;
    const cooktopType = await askChoice<CooktopType>(
      question,
      'Варочная панель',
      [
        ['none', 'нет'],
        ['electric', 'электрическая'],
        ['gas', 'газовая'],
      ],
      'none',
    );

    return removeUndefined({
      layoutType: 'straight',
      wallLengthMm,
      ceilingHeightMm,
      roomHeightIncludesStretchCeiling,
      stretchCeilingPlanned,
      autoModuleWidthMm,
      countertopDepthMm,
      backsplashType,
      backsplashHeightMm,
      cooktopType,
      hasGolaProfile: await askBoolean(question, 'Планируется Gola-профиль', false),
      hasDishwasher: await askBoolean(question, 'Есть посудомоечная машина', false),
      hasDrawersCabinet: await askBoolean(question, 'Нужен нижний модуль с выкатными ящиками', false),
      hasSinkCabinet: await askBoolean(question, 'Нужен нижний модуль под мойку', true),
      hasDishDryerCabinet: await askBoolean(question, 'Нужен навесной шкаф с сушкой', true),
      hasHoodCabinet: await askBoolean(question, 'Нужен шкаф под вытяжку', cooktopType !== 'none'),
      hasBuiltInMicrowave: await askBoolean(question, 'Есть встроенная микроволновка', false),
      hasRecessedLighting: await askBoolean(
        question,
        'Есть врезная подсветка в навесных шкафах',
        false,
      ),
    });
  } finally {
    close();
  }
}

type QuestionReader = {
  question: (prompt: string) => Promise<string>;
  close: () => void;
};

async function createQuestionReader(): Promise<QuestionReader> {
  if (!inputStream.isTTY) {
    inputStream.setEncoding('utf8');
    let rawInput = '';
    for await (const chunk of inputStream) {
      rawInput += chunk;
    }

    const answers = rawInput.split(/\r?\n/);
    let answerIndex = 0;

    return {
      question: async (prompt: string): Promise<string> => {
        const answer = answers[answerIndex++] ?? '';
        outputStream.write(prompt);
        outputStream.write(`${answer}\n`);
        return answer;
      },
      close: () => undefined,
    };
  }

  const rl = createInterface({
    input: inputStream,
    output: outputStream,
  });

  return {
    question: (prompt: string): Promise<string> => rl.question(prompt),
    close: () => rl.close(),
  };
}

async function askNumber(
  question: QuestionReader['question'],
  label: string,
  options: {
    defaultValue?: number;
    required?: boolean;
  } = {},
): Promise<number | undefined> {
  while (true) {
    const suffix = options.defaultValue === undefined ? '' : ` [${options.defaultValue}]`;
    const answer = (await question(`${label}${suffix}: `)).trim().replace(',', '.');

    if (answer === '') {
      if (options.defaultValue !== undefined) return options.defaultValue;
      if (!options.required) return undefined;
    }

    const value = Number(answer);
    if (Number.isFinite(value) && value > 0) return value;

    console.log('Введите число больше 0.');
  }
}

async function askBoolean(
  question: QuestionReader['question'],
  label: string,
  defaultValue: boolean,
): Promise<boolean> {
  const defaultLabel = defaultValue ? 'да' : 'нет';

  while (true) {
    const answer = (await question(`${label}? [${defaultLabel}]: `)).trim().toLowerCase();
    if (answer === '') return defaultValue;
    if (['y', 'yes', 'д', 'да'].includes(answer)) return true;
    if (['n', 'no', 'н', 'нет'].includes(answer)) return false;

    console.log('Ответьте да или нет.');
  }
}

async function askChoice<T extends string>(
  question: QuestionReader['question'],
  label: string,
  choices: Array<[T, string]>,
  defaultValue: T,
): Promise<T> {
  const defaultIndex = choices.findIndex(([value]) => value === defaultValue) + 1;

  console.log(label);
  choices.forEach(([, choiceLabel], index) => {
    console.log(`${index + 1}. ${choiceLabel}`);
  });

  while (true) {
    const answer = (await question(`Выберите номер [${defaultIndex}]: `)).trim();
    if (answer === '') return defaultValue;

    const index = Number(answer) - 1;
    if (Number.isInteger(index) && choices[index] !== undefined) return choices[index][0];

    console.log('Выберите номер из списка.');
  }
}

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}

function formatBoolean(value: boolean): string {
  return value ? 'да' : 'нет';
}

function formatOptionalMm(value: number | undefined): string {
  return value === undefined ? 'не указана' : `${value} мм`;
}

function formatBacksplash(value: BacksplashType | undefined): string {
  return value === undefined ? 'не указан' : backsplashLabels[value];
}

function formatAppliedRule(rule: AppliedRule): string {
  if (rule.code === 'backsplash-height') {
    return `высота фартука определена как ${project.backsplashHeightMm} мм.`;
  }

  if (rule.code === 'countertop-upstand') {
    return `бортик у столешницы: ${formatBoolean(project.countertopUpstand)}.`;
  }

  if (rule.code === 'auto-module-plan') {
    return `созданы автоматические модули кухни: нижних ${project.baseCabinets.length} шт., навесных ${project.wallCabinets.length} шт.`;
  }

  if (rule.code === 'lower-module-height') {
    return `высота корпуса нижнего модуля: ${project.baseCabinetDefaultHeightMm} мм.`;
  }

  if (rule.code === 'countertop') {
    return `столешница: ${project.countertop.lengthMm}x${project.countertop.depthMm}x${project.countertop.thicknessMm} мм.`;
  }

  if (rule.code === 'ceiling-filler') {
    return `добор до потолка: ${project.ceilingCompletionMm} мм.`;
  }

  if (rule.code === 'ceiling-gap') {
    return `зазор до потолка: ${project.ceilingCompletionMm} мм.`;
  }

  return rule.message;
}

function formatWarning(warning: string): string {
  const unresolvedWallRemainderMatch = warning.match(/Unresolved wall remainder (\d+) mm/);
  if (unresolvedWallRemainderMatch) {
    return `остаток стены ${unresolvedWallRemainderMatch[1]} мм не распределен. Измените ширину модулей вручную или добавьте добор.`;
  }

  if (warning.includes('Hood cabinet was requested')) {
    return 'запрошен шкаф под вытяжку, но в автоматическом плане нет третьего модуля.';
  }

  if (warning.includes('Built-in microwave cabinet was requested')) {
    return 'запрошен шкаф под встроенную микроволновку, но в автоматическом плане нет четвертого модуля.';
  }

  const nonPositiveHeightMatch = warning.match(/(?:Lower module|Upper cabinet|Cabinet) (.+) has non-positive height (-?\d+) mm/);
  if (nonPositiveHeightMatch) {
    return `шкаф ${nonPositiveHeightMatch[1]} имеет некорректную высоту ${nonPositiveHeightMatch[2]} мм.`;
  }

  if (warning.includes('width must be greater than twice material thickness')) {
    return warning.replace(
      /Cabinet (.+) width must be greater than twice material thickness\./,
      'ширина шкафа $1 должна быть больше двойной толщины материала.',
    ).replace(
      /(?:Lower module|Upper cabinet) (.+) width must be greater than twice material thickness\./,
      'ширина модуля $1 должна быть больше двойной толщины материала.',
    );
  }

  return warning;
}
