import type { KitchenProject } from '../bridge.ts';
import { cabinetMiniLabel } from '../utils/format.ts';

export type ModuleOverride = {
  customName?: string;
  customColor?: string;
};

const OVERRIDES_KEY = 'kitchen-module-overrides';

function loadOverrides(): Record<string, ModuleOverride> {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}');
  } catch { return {}; }
}

function saveOverrides(overrides: Record<string, ModuleOverride>): void {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export function renderLayoutScheme(
  container: HTMLElement,
  project: KitchenProject,
  onEdit?: (cabinetId: string, overrides: { widthMm?: number; heightMm?: number; depthMm?: number; customName?: string; customColor?: string }) => void,
  onReorder?: (level: 'lower' | 'upper', fromIndex: number, toIndex: number) => void,
): void {
  const baseCabinets = project.baseCabinets;
  const wallCabinets = project.wallCabinets;
  const maxCount = Math.max(baseCabinets.length, wallCabinets.length);
  const overrides = loadOverrides();

  let upperCells = '';
  let lowerCells = '';

  for (let i = 0; i < maxCount; i++) {
    const wallCab = wallCabinets[i];
    const baseCab = baseCabinets[i];

    const wallType = wallCab?.type ?? 'standard';
    const baseType = baseCab?.type ?? 'standard';
    const wallId = wallCab?.id ?? '';
    const baseId = baseCab?.id ?? '';
    const wallOv = overrides[wallId];
    const baseOv = overrides[baseId];

    const wallLabel = wallOv?.customName || cabinetMiniLabel(wallType);
    const baseLabel = baseOv?.customName || cabinetMiniLabel(baseType);
    const wallColor = wallOv?.customColor;
    const baseColor = baseOv?.customColor;

  upperCells += createCell(wallId, wallType, 'upper', wallLabel, wallCab?.widthMm, wallColor, wallOv?.customName, i);
    lowerCells += createCell(baseId, baseType, 'lower', baseLabel, baseCab?.widthMm, baseColor, baseOv?.customName, i);
  }

  container.innerHTML = `
    <div class="layout-scheme">
      <h3>📋 Схема планировки</h3>
      <div class="scheme-container">
        <div class="scheme-row">
          <span class="scheme-row__label">Верх</span>
          ${upperCells}
          ${project.fillerWidthMm ? `<div class="scheme-cell scheme-cell--filler scheme-cell--upper" title="Добор ${project.fillerWidthMm} мм">
            <span class="scheme-cell__type">Добор</span>
            <span class="scheme-cell__width">${project.fillerWidthMm}</span>
          </div>` : ''}
        </div>
        <div class="scheme-row">
          <span class="scheme-row__label">Низ</span>
          ${lowerCells}
          ${project.fillerWidthMm ? `<div class="scheme-cell scheme-cell--filler scheme-cell--lower" title="Добор ${project.fillerWidthMm} мм">
            <span class="scheme-cell__type">Добор</span>
            <span class="scheme-cell__width">${project.fillerWidthMm}</span>
          </div>` : ''}
        </div>
        <div class="scheme-dimensions">
          <span>${project.wallLengthMm} мм</span>
          ${project.remainderResolution !== 'none' ? `<span>Остаток: ${project.unresolvedWidthMm} мм (${project.remainderResolution === 'distribute' ? 'распределён' : 'доп. модуль'})</span>` : ''}
          ${project.fillerWidthMm ? `<span>Добор: ${project.fillerWidthMm} мм</span>` : ''}
        </div>
      </div>
    </div>
  `;

  // --- Создаём модалку один раз, если её ещё нет ---
  let modal = document.getElementById('scheme-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'scheme-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-box">
        <h3 id="modal-title">Редактирование модуля</h3>
        <div class="modal-fields">
          <label>Название: <input type="text" id="modal-name" class="modal-input" /></label>
          <label>Ширина (мм): <input type="number" id="modal-width" class="modal-input" min="100" max="2400" /></label>
          <label>Высота (мм): <input type="number" id="modal-height" class="modal-input" min="50" max="2400" /></label>
          <label>Глубина (мм): <input type="number" id="modal-depth" class="modal-input" min="50" max="1200" /></label>
          <label>Цвет: <input type="color" id="modal-color" class="modal-input" /></label>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" id="modal-save">Сохранить</button>
          <button class="btn-secondary" id="modal-cancel">Отмена</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // --- Сохраняем ссылки на элементы модалки ---
  const modalTitle = document.getElementById('modal-title')!;
  const modalName = document.getElementById('modal-name') as HTMLInputElement;
  const modalWidth = document.getElementById('modal-width') as HTMLInputElement;
  const modalHeight = document.getElementById('modal-height') as HTMLInputElement;
  const modalDepth = document.getElementById('modal-depth') as HTMLInputElement;
  const modalColor = document.getElementById('modal-color') as HTMLInputElement;
  const saveBtn = document.getElementById('modal-save')!;
  const cancelBtn = document.getElementById('modal-cancel')!;

  // --- Mouse-based Drag & Drop (надёжнее HTML5 DnD) + Клик для модалки ---
  const oldHandler = (container as any).__schemeMouseHandler as { destroy: () => void } | undefined;
  if (oldHandler) oldHandler.destroy();

  let mouseDragIdx: number | null = null;
  let mouseDragLevel: 'upper' | 'lower' | null = null;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let mouseIsDragging = false;
  let mouseWasDragged = false; // был ли реально сдвиг мыши

  function clearMouseDrag() {
    container.querySelectorAll('.scheme-cell-clickable').forEach(c => {
      (c as HTMLElement).style.outline = '';
      (c as HTMLElement).style.opacity = '';
    });
    mouseDragIdx = null;
    mouseDragLevel = null;
    mouseIsDragging = false;
    mouseWasDragged = false;
  }

  function getHoveredCell(px: number, py: number): HTMLElement | null {
    // Ищем элемент под координатами мыши
    const el = document.elementFromPoint(px, py);
    if (!el) return null;
    return (el as HTMLElement).closest('.scheme-cell-clickable') as HTMLElement | null;
  }

  const mouseHandler = {
    // mousedown — начало перетаскивания
    mousedown(e: MouseEvent) {
      const cell = (e.target as HTMLElement).closest('.scheme-cell-clickable') as HTMLElement | null;
      if (!cell) return;
      if (e.button !== 0) return; // только левая кнопка
      e.preventDefault();

      mouseDragIdx = parseInt(cell.dataset.index || '', 10);
      mouseDragLevel = cell.dataset.level as 'upper' | 'lower';
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;
      mouseIsDragging = true;
      mouseWasDragged = false;
    },

    // mousemove — перемещение
    mousemove(e: MouseEvent) {
      if (!mouseIsDragging || mouseDragIdx === null || !mouseDragLevel) return;

      // Считаем дистанцию от точки нажатия
      const dx = e.clientX - mouseDownX;
      const dy = e.clientY - mouseDownY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 5) return; // порог 5px — игнорируем дрожание мыши

      mouseWasDragged = true;
      console.log('🟢 DnD active! dist:', Math.round(dist), 'from:', mouseDragLevel, mouseDragIdx);

      // Подсвечиваем ячейку под курсором
      const hovered = getHoveredCell(e.clientX, e.clientY);
      container.querySelectorAll('.scheme-cell-clickable').forEach(c => {
        (c as HTMLElement).style.outline = '';
      });
      if (hovered && hovered.dataset.level === mouseDragLevel) {
        hovered.style.outline = '2px dashed var(--color-primary)';
      }

      // Делаем исходную ячейку полупрозрачной
      container.querySelectorAll('.scheme-cell-clickable').forEach(c => {
        const idx = parseInt((c as HTMLElement).dataset.index || '', 10);
        const lvl = (c as HTMLElement).dataset.level;
        if (idx === mouseDragIdx && lvl === mouseDragLevel) {
          (c as HTMLElement).style.opacity = '0.4';
        }
      });
    },

    // mouseup — завершение перетаскивания (drop)
    mouseup(e: MouseEvent) {
      console.log('🟡 mouseup:', 'wasDragged:', mouseWasDragged, 'dragging:', mouseIsDragging, 'idx:', mouseDragIdx, 'level:', mouseDragLevel);
      if (!mouseIsDragging || mouseDragIdx === null || !mouseDragLevel) {
        mouseIsDragging = false;
        return;
      }

      if (mouseWasDragged) {
        // Было перетаскивание — выполняем reorder
        const hovered = getHoveredCell(e.clientX, e.clientY);
        if (hovered && onReorder) {
          const targetLevel = hovered.dataset.level as 'upper' | 'lower';
          const targetIdx = parseInt(hovered.dataset.index || '', 10);
          if (targetLevel === mouseDragLevel && targetIdx !== mouseDragIdx) {
            onReorder(mouseDragLevel, mouseDragIdx, targetIdx);
          }
        }
        clearMouseDrag();
        return; // НЕ открываем модалку
      }

      // Не было перетаскивания — это обычный клик, открываем модалку
      clearMouseDrag();

      const cell = (e.target as HTMLElement).closest('.scheme-cell-clickable') as HTMLElement | null;
      if (!cell) return;
      const id = cell.dataset.id || '';
      const idx = parseInt(cell.dataset.index || '0', 10);
      const level = cell.dataset.level as 'upper' | 'lower';
      const cabinet = level === 'upper' ? wallCabinets[idx] : baseCabinets[idx];
      if (!cabinet) return;

      const ov = overrides[id] || {};
      modalTitle.textContent = `Редактирование: ${ov.customName || cabinetMiniLabel(cabinet.type)}`;
      modalName.value = ov.customName || '';
      modalWidth.value = String(cabinet.widthMm);
      modalHeight.value = String(cabinet.heightMm);
      modalDepth.value = String(cabinet.depthMm);
      modalColor.value = ov.customColor || '#6366f1';
      modal!.style.display = 'flex';

      // Убираем старые обработчики с кнопок
      const newSave = saveBtn.cloneNode(true) as HTMLElement;
      const newCancel = cancelBtn.cloneNode(true) as HTMLElement;
      saveBtn.parentNode?.replaceChild(newSave, saveBtn);
      cancelBtn.parentNode?.replaceChild(newCancel, cancelBtn);

      newSave.addEventListener('click', () => {
        const newName = modalName.value.trim();
        const newColor = modalColor.value;
        const newWidth = parseInt(modalWidth.value, 10);
        const newHeight = parseInt(modalHeight.value, 10);
        const newDepth = parseInt(modalDepth.value, 10);

        const update: ModuleOverride = {};
        if (newName) update.customName = newName;
        if (newColor) update.customColor = newColor;
        if (Object.keys(update).length > 0) {
          overrides[id] = { ...(overrides[id] || {}), ...update };
        } else {
          delete overrides[id];
        }
        saveOverrides(overrides);

        const hasSizeChanges =
          newWidth !== cabinet.widthMm ||
          newHeight !== cabinet.heightMm ||
          newDepth !== cabinet.depthMm;

        if (hasSizeChanges && onEdit) {
          onEdit(id, {
            widthMm: newWidth !== cabinet.widthMm ? newWidth : undefined,
            heightMm: newHeight !== cabinet.heightMm ? newHeight : undefined,
            depthMm: newDepth !== cabinet.depthMm ? newDepth : undefined,
          });
        } else {
          renderLayoutScheme(container, project, onEdit, onReorder);
        }
        modal!.style.display = 'none';
      });

      newCancel.addEventListener('click', () => {
        modal!.style.display = 'none';
      });
    },
  };

  container.addEventListener('mousedown', mouseHandler.mousedown);
  container.addEventListener('mousemove', mouseHandler.mousemove);
  container.addEventListener('mouseup', mouseHandler.mouseup);

  // Отмена при уходе мыши за пределы контейнера
  container.addEventListener('mouseleave', () => {
    if (mouseIsDragging) {
      clearMouseDrag();
    }
  });

  (container as any).__schemeMouseHandler = {
    destroy: () => {
      container.removeEventListener('mousedown', mouseHandler.mousedown);
      container.removeEventListener('mousemove', mouseHandler.mousemove);
      container.removeEventListener('mouseup', mouseHandler.mouseup);
    },
  };
}

function createCell(
  id: string,
  type: string,
  level: string,
  label: string,
  widthMm: number | undefined,
  customColor?: string,
  hasCustomName?: string,
  index?: number,
): string {
  const colorStyle = customColor ? `background:${customColor};` : '';
  const clickableClass = id ? 'scheme-cell-clickable' : '';
  return `
    <div class="scheme-cell scheme-cell--${type} scheme-cell--${level} ${clickableClass}"
         style="${colorStyle}"
         data-id="${id}"
         data-level="${level}"
         data-type="${type}"
         data-index="${index ?? ''}"
         title="${label} ${widthMm ?? ''} мм${id ? ' — клик: редактировать, зажать и перетащить: поменять местами' : ''}">
      <span class="scheme-cell__type">${label}</span>
      ${widthMm !== undefined ? `<span class="scheme-cell__width">${widthMm}</span>` : ''}
    </div>
  `;
}
