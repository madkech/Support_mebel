import type { BaseCabinet, WallCabinet, CabinetPart, Drawer } from '../bridge.ts';
import { formatHardware } from '../utils/format.ts';
import { partKindLabels, materialLabels, drawerSystemLabels } from '../utils/labels.ts';
import type { EditHandlers } from './results-panel.ts';

export function renderModuleTable(
  container: HTMLElement,
  baseCabinets: BaseCabinet[],
  wallCabinets: WallCabinet[],
  editHandlers?: EditHandlers,
): void {
  container.innerHTML = '';

  // Читаем кастомные названия из localStorage
  let overrides: Record<string, { customName?: string }> = {};
  try {
    overrides = JSON.parse(localStorage.getItem('kitchen-module-overrides') || '{}');
  } catch { /* ignore */ }

  // Нижние модули
  if (baseCabinets.length > 0) {
    const section = createSection('🪑 Нижние модули', baseCabinets.length);
    const list = section.querySelector('.cabinets-list')!;
    baseCabinets.forEach((cabinet, i) => {
      const ov = overrides[cabinet.id];
      const card = createCabinetCard(
        ov?.customName || `Нижний модуль ${i + 1}`,
        cabinet.type,
        cabinet.widthMm,
        cabinet.heightMm,
        cabinet.depthMm,
        cabinet.parts,
        cabinet.drawers,
        'lower',
        i,
        editHandlers,
        ov?.customName,
      );
      list.appendChild(card);
    });
    container.appendChild(section);
  }

  // Навесные шкафы
  if (wallCabinets.length > 0) {
    const section = createSection('🗄 Навесные шкафы', wallCabinets.length);
    const list = section.querySelector('.cabinets-list')!;
    wallCabinets.forEach((cabinet, i) => {
      const ov = overrides[cabinet.id];
      list.appendChild(createCabinetCard(
        ov?.customName || `Навесной шкаф ${i + 1}`,
        cabinet.type,
        cabinet.widthMm,
        cabinet.heightMm,
        cabinet.depthMm,
        cabinet.parts,
        [],
        'upper',
        i,
        editHandlers,
        ov?.customName,
      ));
    });
    container.appendChild(section);
  }
}

function createSection(title: string, count: number): HTMLElement {
  const section = document.createElement('div');
  section.className = 'module-section';
  section.innerHTML = `<h3>${title} (${count})</h3><div class="cabinets-list"></div>`;
  return section;
}

function createCabinetCard(
  title: string,
  type: string,
  widthMm: number,
  heightMm: number,
  depthMm: number,
  parts: CabinetPart[],
  drawers: Drawer[],
  level: 'lower' | 'upper',
  index: number,
  editHandlers?: EditHandlers,
  customName?: string,
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'cabinet-card';
  const typeLabel = customName || getCabinetTypeLabel(type);
  const cardId = `cabinet-${level}-${index}`;
  card.id = cardId;

  // ▲▼ кнопки для перестановки — удалены, перестановка через схему планировки
  function renderMoveBtns(): string {
    return '';
  }

  let editState: { w: number; h: number; d: number } | null = null;

  function renderHeader(isEditing: boolean): string {
    if (isEditing && editState) {
      return `
        <div class="cabinet-card__header" style="flex-wrap:wrap;">
          <div>
            <div class="cabinet-card__title">${title} <span style="font-weight:400;color:var(--color-text-secondary)">— ${typeLabel}</span></div>
            <div class="cabinet-edit-fields">
              <label>Ш: <input type="number" class="edit-dim" data-dim="w" value="${editState.w}" min="100" max="2400" step="1"></label>
              <label>В: <input type="number" class="edit-dim" data-dim="h" value="${editState.h}" min="50" max="2400" step="1"></label>
              <label>Г: <input type="number" class="edit-dim" data-dim="d" value="${editState.d}" min="50" max="1200" step="1"></label>
              <span class="cabinet-edit-actions">
                <button class="btn-edit btn-edit--save">✓ Применить</button>
                <button class="btn-edit btn-edit--cancel">✕ Отмена</button>
              </span>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="cabinet-card__header">
        <div>
          <div class="cabinet-card__title">
            ${title}
            <span style="font-weight:400;color:var(--color-text-secondary)">— ${typeLabel}</span>
            ${editHandlers ? `<button class="btn-edit btn-edit--inline" title="Изменить размеры" data-edit-btn>✏️</button>` : ''}
          </div>
          <div class="cabinet-card__dimensions">
            ${widthMm}×${heightMm}×${depthMm} мм
            ${editHandlers ? `<span class="edit-hint">нажмите ✏️ для правки</span>` : ''}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.375rem;">
          ${renderMoveBtns()}
          <span class="cabinet-card__toggle">▼</span>
        </div>
      </div>
    `;
  }

  card.innerHTML = renderHeader(false);

  // Body
  const body = document.createElement('div');
  body.className = 'cabinet-card__body';
  body.innerHTML = buildPartsHTML(parts, drawers);
  card.appendChild(body);

  // Toggle
  const headerEl = card.querySelector('.cabinet-card__header')!;
  const toggle = card.querySelector('.cabinet-card__toggle')!;
  headerEl.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.btn-edit') || target.closest('.edit-dim') || target.closest('.cabinet-edit-fields') || target.closest('.btn-move')) return;
    body.classList.toggle('open');
    toggle.classList.toggle('open', body.classList.contains('open'));
  });

  // ▲▼ Обработчик кнопок перемещения
  headerEl.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.btn-move') as HTMLElement | null;
    if (!btn || !editHandlers?.onReorder) return;
    const lvl = btn.dataset.moveLevel as 'lower' | 'upper';
    const idx = parseInt(btn.dataset.moveIdx || '', 10);
    const dir = parseInt(btn.dataset.moveDir || '0', 10);
    const targetIdx = idx + dir;
    editHandlers.onReorder(lvl, idx, targetIdx);
  });

  // Edit button handler
  const editBtn = card.querySelector('[data-edit-btn]') as HTMLElement | null;
  if (editBtn && editHandlers) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      editState = { w: widthMm, h: heightMm, d: depthMm };
      card.innerHTML = renderHeader(true);
      // Append body after header
      card.appendChild(body);

      const saveBtn = card.querySelector('.btn-edit--save')!;
      const cancelBtn = card.querySelector('.btn-edit--cancel')!;

      const getDims = (): { w: number; h: number; d: number } => {
        const inputs = card.querySelectorAll('.edit-dim') as NodeListOf<HTMLInputElement>;
        const obj: Record<string, number> = {};
        inputs.forEach(inp => { obj[inp.dataset.dim || ''] = Number(inp.value); });
        return { w: obj.w || widthMm, h: obj.h || heightMm, d: obj.d || depthMm };
      };

      saveBtn.addEventListener('click', () => {
        const dims = getDims();
        if (level === 'lower') {
          editHandlers.onEditLower(index, {
            widthMm: dims.w !== widthMm ? dims.w : undefined,
            heightMm: dims.h !== heightMm ? dims.h : undefined,
            depthMm: dims.d !== depthMm ? dims.d : undefined,
          });
        } else {
          editHandlers.onEditUpper(index, {
            widthMm: dims.w !== widthMm ? dims.w : undefined,
            heightMm: dims.h !== heightMm ? dims.h : undefined,
            depthMm: dims.d !== depthMm ? dims.d : undefined,
          });
        }
      });

      cancelBtn.addEventListener('click', () => {
        editState = null;
        card.innerHTML = renderHeader(false);
        card.appendChild(body);
      });
    });
  }

  return card;
}

function buildPartsHTML(parts: CabinetPart[], drawers: Drawer[]): string {
  let html = '';

  if (parts.length > 0) {
    html += `
      <table class="parts-table">
        <thead>
          <tr>
            <th>Деталь</th>
            <th>Кол-во</th>
            <th>Размер (мм)</th>
            <th>Материал</th>
          </tr>
        </thead>
        <tbody>
          ${parts.map(p => {
            const label = partKindLabels[p.kind] || p.name || p.kind;
            const mat = materialLabels[p.material] || p.material.toUpperCase();
            return `
            <tr>
              <td>${label}</td>
              <td>${p.quantity}</td>
              <td class="dim-cell">${p.widthMm}×${p.depthMm}</td>
              <td>${mat} ${p.thicknessMm} мм</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  } else {
    html += '<p style="color:var(--color-text-secondary);font-size:0.875rem;">Нет деталей</p>';
  }

  if (drawers.length > 0) {
    html += `<div class="sub-section-title">Ящики</div>`;
    drawers.forEach((d, di) => {
      const sysLabel = drawerSystemLabels[d.system] ?? d.system;
      html += `
        <div style="padding:0.5rem;background:var(--color-bg);border-radius:6px;margin-bottom:0.5rem;">
          <div style="font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;">
            Ящик ${di + 1} — ${sysLabel}
            (фасад ${d.facadeHeightMm} мм)
          </div>
          ${d.warnings.map(w => `<div style="font-size:0.75rem;color:var(--color-warning);">⚠ ${w}</div>`).join('')}
          <table class="parts-table">
            <thead><tr><th>Деталь</th><th>Кол-во</th><th>Размер (мм)</th><th>Материал</th></tr></thead>
            <tbody>
              ${d.parts.map(p => {
                const label = partKindLabels[p.kind] || p.kind;
                const mat = materialLabels[p.material] || p.material.toUpperCase();
                return `
                <tr>
                  <td>${label}</td>
                  <td>${p.quantity}</td>
                  <td class="dim-cell">${p.widthMm}×${p.depthMm}</td>
                  <td>${mat} ${p.thicknessMm} мм</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          ${d.hardware.length > 0 ? `
            <div style="font-size:0.75rem;color:var(--color-text-secondary);margin-top:0.375rem;">
              ${d.hardware.map(h => formatHardware(h)).join('; ')}
            </div>
          ` : ''}
        </div>
      `;
    });
  }

  return html;
}

function getCabinetTypeLabel(type: string): string {
  const map: Record<string, string> = {
    standard: 'Обычный',
    sink: 'Под мойку',
    cooktop: 'Под варочную панель',
    stove: 'Под плиту',
    dishwasher: 'Под посудомоечную машину',
    drawers: 'С выкатными ящиками',
    dish_dryer: 'С сушкой',
    hood: 'Под вытяжку',
    built_in_microwave: 'Под встроенную микроволновку',
  };
  return map[type] ?? type;
}


