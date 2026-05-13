import { calculate } from './bridge.ts';
import type { KitchenProjectInput, KitchenProject, BaseCabinetInput, WallCabinetInput } from './bridge.ts';
import { getFormState } from './components/input-form.ts';
import { renderResults, type EditHandlers } from './components/results-panel.ts';

type FixedEdit = {
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
  customName?: string;
  customColor?: string;
};

export class App {
  private formContainer: HTMLElement;
  private resultsContainer: HTMLElement;
  /** Зафиксированные правки: ключ = номер модуля (0..N), null/undefined = авто */
  private lowerEdits: Record<number, FixedEdit> = {};
  private upperEdits: Record<number, FixedEdit> = {};
  /** Последний авто-проект — храним типы и дефолтные размеры */
  private lastAutoInput: KitchenProjectInput | null = null;
  private lastAutoProject: KitchenProject | null = null;
  private currentProject: KitchenProject | null = null;

  constructor(formContainer: HTMLElement, resultsContainer: HTMLElement) {
    this.formContainer = formContainer;
    this.resultsContainer = resultsContainer;
  }

  run(): void {
    this.calculate();
  }

  calculate(): void {
    try {
      const input = getFormState();
      this.lastAutoInput = input;
      const wallLength = input.wallLengthMm ?? 3000;

      // Сначала делаем авто-расчёт, чтобы узнать количество и типы модулей
      const autoProject = calculate({ ...input, manualBaseCabinets: undefined, manualWallCabinets: undefined });
      this.lastAutoProject = autoProject;
      const baseCount = autoProject.baseCabinets.length;
      const wallCount = autoProject.wallCabinets.length;

      // Строим manual-план нижних модулей с перераспределением ширины
      const manualBase = this.buildManualBasePlan(autoProject, baseCount, wallLength);
      // Строим manual-план верхних модулей с перераспределением ширины
      const manualWall = this.buildManualWallPlan(autoProject, wallCount, wallLength);

      // Если хоть одна правка есть — передаём manual-планы
      if (Object.keys(this.lowerEdits).length > 0 || Object.keys(this.upperEdits).length > 0) {
        input.manualBaseCabinets = manualBase;
        input.manualWallCabinets = manualWall;
      }

      const project = calculate(input);
      this.currentProject = project;

      const editHandlers: EditHandlers = {
        onEditLower: (index, updates) => this.applyLowerEdit(index, updates),
        onEditUpper: (index, updates) => this.applyUpperEdit(index, updates),
        onResetManual: () => this.resetManual(),
        onReorder: (level, fromIndex, toIndex) => this.reorderModules(level, fromIndex, toIndex),
      };

      renderResults(this.resultsContainer, project, editHandlers);
    } catch (err) {
      this.resultsContainer.innerHTML = `
        <div class="rules-log">
          <h3>❌ Ошибка расчёта</h3>
          <div class="rule-item rule-item--error">
            <span class="rule-item__icon">✕</span>
            <span>${err instanceof Error ? err.message : String(err)}</span>
          </div>
        </div>
      `;
    }
  }

  // ---------- Построение manual-плана нижних модулей ----------

  private buildManualBasePlan(
    autoProject: KitchenProject,
    count: number,
    wallLength: number,
  ): BaseCabinetInput[] {
    // 1) Собираем все зафиксированные ширины
    const fixedWidths: (number | null)[] = [];
    const hasAnyWidthEdit = Object.values(this.lowerEdits).some(e => e.widthMm !== undefined);

    for (let i = 0; i < count; i++) {
      const edit = this.lowerEdits[i];
      if (edit?.widthMm !== undefined) {
        fixedWidths[i] = edit.widthMm;
      } else {
        fixedWidths[i] = null; // авто
      }
    }

    // 2) Если есть правки ширины — перераспределяем остаток
    let newWidths: number[];
    if (hasAnyWidthEdit) {
      const fixedTotal = fixedWidths.reduce<number>((sum, w) => sum + (w ?? 0), 0);
      const fixedCount = fixedWidths.filter(w => w !== null).length;
      const autoCount = count - fixedCount;
      const remainingSpace = Math.max(0, wallLength - fixedTotal);
      const eachAutoWidth = autoCount > 0 ? Math.floor(remainingSpace / autoCount) : 0;
      const autoRemainder = remainingSpace - eachAutoWidth * autoCount;

      newWidths = [];
      let autoIdx = 0;
      for (let i = 0; i < count; i++) {
        if (fixedWidths[i] !== null) {
          newWidths[i] = fixedWidths[i]!;
        } else {
          newWidths[i] = eachAutoWidth + (autoIdx < autoRemainder ? 1 : 0);
          autoIdx++;
        }
      }
    } else {
      // Нет правок ширины — берём авто-ширины
      newWidths = autoProject.baseCabinets.map(c => c.widthMm);
    }

    // 3) Строим массив BaseCabinetInput для всех модулей
    const result: BaseCabinetInput[] = [];
    for (let i = 0; i < count; i++) {
      const autoCab = autoProject.baseCabinets[i];
      const edit = this.lowerEdits[i];

      // Переносим все поля из авто-модуля, чтобы не потерять ящики и тип
      const input: BaseCabinetInput = {
        type: autoCab.type as any,
        widthMm: newWidths[i],
        shelfCount: autoCab.shelfCount,
        facadeSide: autoCab.facadeSide,
      };

      // Переносим настройки ящиков
      const firstDrawer = autoCab.drawers[0];
      if (firstDrawer) {
        input.drawerSystem = firstDrawer.system;
        input.drawerCount = autoCab.drawers.length;
        input.drawerFacadeHeightMm = firstDrawer.facadeHeightMm;
      }

      // Высота и глубина — через overrides (если изменены)
      const hasHeight = edit?.heightMm !== undefined;
      const hasDepth = edit?.depthMm !== undefined;
      if (hasHeight || hasDepth) {
        input.overrides = {};
        if (hasHeight) input.overrides.heightMm = edit!.heightMm;
        if (hasDepth) input.overrides.depthMm = edit!.depthMm;
      }

      result.push(input);
    }
    return result;
  }

  // ---------- Построение manual-плана верхних модулей ----------

  private buildManualWallPlan(
    autoProject: KitchenProject,
    count: number,
    wallLength: number,
  ): WallCabinetInput[] {
    const fixedWidths: (number | null)[] = [];
    const hasAnyWidthEdit = Object.values(this.upperEdits).some(e => e.widthMm !== undefined);

    for (let i = 0; i < count; i++) {
      const edit = this.upperEdits[i];
      fixedWidths[i] = edit?.widthMm ?? null;
    }

    let newWidths: number[];
    if (hasAnyWidthEdit) {
      const fixedTotal = fixedWidths.reduce<number>((sum, w) => sum + (w ?? 0), 0);
      const fixedCount = fixedWidths.filter(w => w !== null).length;
      const autoCount = count - fixedCount;
      const remainingSpace = Math.max(0, wallLength - fixedTotal);
      const eachAutoWidth = autoCount > 0 ? Math.floor(remainingSpace / autoCount) : 0;
      const autoRemainder = remainingSpace - eachAutoWidth * autoCount;

      newWidths = [];
      let autoIdx = 0;
      for (let i = 0; i < count; i++) {
        if (fixedWidths[i] !== null) {
          newWidths[i] = fixedWidths[i]!;
        } else {
          newWidths[i] = eachAutoWidth + (autoIdx < autoRemainder ? 1 : 0);
          autoIdx++;
        }
      }
    } else {
      newWidths = autoProject.wallCabinets.map(c => c.widthMm);
    }

    const result: WallCabinetInput[] = [];
    for (let i = 0; i < count; i++) {
      const autoCab = autoProject.wallCabinets[i];
      const edit = this.upperEdits[i];
      const input: WallCabinetInput = {
        type: autoCab.type as any,
        widthMm: newWidths[i],
        shelfCount: autoCab.shelfCount,
        hasRecessedLighting: autoCab.hasRecessedLighting,
        hasBuiltInMicrowave: autoCab.hasBuiltInMicrowave,
        isHoodCabinet: autoCab.isHoodCabinet,
        vitrine: autoCab.vitrine,
      };

      const hasHeight = edit?.heightMm !== undefined;
      const hasDepth = edit?.depthMm !== undefined;
      if (hasHeight || hasDepth) {
        input.overrides = {};
        if (hasHeight) input.overrides.heightMm = edit!.heightMm;
        if (hasDepth) input.overrides.depthMm = edit!.depthMm;
      }

      result.push(input);
    }
    return result;
  }

  // ---------- Обработчики правок ----------

  private applyLowerEdit(index: number, updates: { widthMm?: number; heightMm?: number; depthMm?: number }): void {
    if (!this.lastAutoProject) return;

    const edit: FixedEdit = { ...(this.lowerEdits[index] ?? {}) };
    if (updates.widthMm !== undefined) edit.widthMm = updates.widthMm;
    if (updates.heightMm !== undefined) edit.heightMm = updates.heightMm;
    if (updates.depthMm !== undefined) edit.depthMm = updates.depthMm;
    this.lowerEdits[index] = edit;

    this.calculate();
  }

  private applyUpperEdit(index: number, updates: { widthMm?: number; heightMm?: number; depthMm?: number }): void {
    if (!this.lastAutoProject) return;

    const edit: FixedEdit = { ...(this.upperEdits[index] ?? {}) };
    if (updates.widthMm !== undefined) edit.widthMm = updates.widthMm;
    if (updates.heightMm !== undefined) edit.heightMm = updates.heightMm;
    if (updates.depthMm !== undefined) edit.depthMm = updates.depthMm;
    this.upperEdits[index] = edit;

    this.calculate();
  }

  private resetManual(): void {
    this.lowerEdits = {};
    this.upperEdits = {};
    this.calculate();
  }

  // ---------- Перестановка модулей (drag & drop) ----------

  private reorderModules(level: 'lower' | 'upper', fromIndex: number, toIndex: number): void {
    const edits = level === 'lower' ? this.lowerEdits : this.upperEdits;
    const count = level === 'lower'
      ? this.lastAutoProject?.baseCabinets.length ?? 0
      : this.lastAutoProject?.wallCabinets.length ?? 0;

    // Меняем местами правки (сохраняя типы модулей)
    const editKeys = Object.keys(edits).map(Number).sort((a, b) => a - b);
    const allEdits: { index: number; edit: FixedEdit | null }[] = [];

    for (let i = 0; i < count; i++) {
      allEdits.push({ index: i, edit: edits[i] ?? null });
    }

    // Меняем местами
    const fromItem = allEdits[fromIndex];
    const toItem = allEdits[toIndex];
    if (fromItem && toItem) {
      allEdits[fromIndex] = toItem;
      allEdits[toIndex] = fromItem;
    }

    // Перестраиваем edits
    const newEdits: Record<number, FixedEdit> = {};
    for (const item of allEdits) {
      if (item.edit) {
        newEdits[item.index] = item.edit;
      }
    }

    if (level === 'lower') {
      this.lowerEdits = newEdits;
    } else {
      this.upperEdits = newEdits;
    }

    this.calculate();
  }
}
