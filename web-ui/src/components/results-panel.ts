import type { KitchenProject } from '../bridge.ts';
import { backsplashLabels, cooktopLabels } from '../utils/labels.ts';
import { formatBoolean } from '../utils/format.ts';
import { renderModuleTable } from './module-table.ts';
import { renderLayoutScheme } from './layout-scheme.ts';
import { renderRulesLog } from './rules-log.ts';

export type EditHandlers = {
  onEditLower: (index: number, updates: { widthMm?: number; heightMm?: number; depthMm?: number }) => void;
  onEditUpper: (index: number, updates: { widthMm?: number; heightMm?: number; depthMm?: number }) => void;
  onResetManual: () => void;
  onReorder?: (level: 'lower' | 'upper', fromIndex: number, toIndex: number) => void;
};

export function renderResults(
  container: HTMLElement,
  project: KitchenProject,
  editHandlers?: EditHandlers,
): void {
  container.innerHTML = '';

  // --- Панель ручного редактирования ---
  if (editHandlers) {
    const editBar = document.createElement('div');
    editBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:var(--color-primary-light);border-radius:var(--radius-md);border:1px solid var(--color-primary);';
    editBar.innerHTML = `
      <span style="font-size:0.8125rem;">
        💡 Нажмите <strong>✏️</strong> на модуле, чтобы изменить его размеры вручную
      </span>
      <button class="btn-secondary" id="reset-manual-btn" style="font-size:0.8125rem;padding:0.375rem 0.75rem;">
        ↻ Сбросить ручные правки
      </button>
    `;
    container.appendChild(editBar);

    editBar.querySelector('#reset-manual-btn')!.addEventListener('click', () => {
      editHandlers.onResetManual();
    });
  }

  // Сводка
  const summary = document.createElement('div');
  summary.className = 'summary-bar';
  summary.innerHTML = `
    <div class="summary-item">
      <span class="summary-item__label">Стена</span>
      <span class="summary-item__value">${project.wallLengthMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Высота потолка</span>
      <span class="summary-item__value">${project.ceilingHeightMm ?? '—'} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Нижняя база</span>
      <span class="summary-item__value">${project.baseTotalHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Корпус низа</span>
      <span class="summary-item__value">${project.baseCabinetDefaultHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Навесные шкафы</span>
      <span class="summary-item__value">${project.wallCabinetDefaultHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Фартук</span>
      <span class="summary-item__value">${formatBacksplash(project.backsplashType)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Высота фартука</span>
      <span class="summary-item__value">${project.backsplashHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Столешница</span>
      <span class="summary-item__value">${project.countertop.lengthMm}×${project.countertop.depthMm}×${project.countertop.thicknessMm}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Бортик</span>
      <span class="summary-item__value">${formatBoolean(project.countertopUpstand)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Варочная панель</span>
      <span class="summary-item__value">${cooktopLabels[project.cooktopType] ?? project.cooktopType}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Модулей (низ/верх)</span>
      <span class="summary-item__value ${project.warnings.length > 0 ? 'summary-item__value--warning' : ''}">
        ${project.baseCabinets.length} / ${project.wallCabinets.length}
      </span>
    </div>
  `;
  container.appendChild(summary);

  // Схема планировки
  const schemeContainer = document.createElement('div');
  container.appendChild(schemeContainer);
  const handlers = editHandlers;
  renderLayoutScheme(
    schemeContainer,
    project,
    (cabinetId, updates) => {
      if (!handlers) return;
      const match = cabinetId.match(/^(lower|upper)-(\d+)$/);
      if (!match) return;
      const level = match[1] as 'lower' | 'upper';
      const index = parseInt(match[2], 10) - 1;
      if (level === 'lower') {
        handlers.onEditLower(index, updates);
      } else {
        handlers.onEditUpper(index, updates);
      }
    },
    handlers?.onReorder ? (level, fromIdx, toIdx) => handlers.onReorder!(level, fromIdx, toIdx) : undefined,
  );

  // Таблицы модулей
  const tablesContainer = document.createElement('div');
  container.appendChild(tablesContainer);
  renderModuleTable(tablesContainer, project.baseCabinets, project.wallCabinets, editHandlers);

  // Правила и предупреждения
  const rulesContainer = document.createElement('div');
  container.appendChild(rulesContainer);
  renderRulesLog(rulesContainer, project.appliedRules, project.warnings);

}

function formatBacksplash(type: string | undefined): string {
  if (!type) return '—';
  return backsplashLabels[type as keyof typeof backsplashLabels] ?? type;
}
