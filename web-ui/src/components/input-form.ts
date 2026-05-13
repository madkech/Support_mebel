import type { KitchenProjectInput, FacadeThickness } from '../bridge.ts';

export type FormState = KitchenProjectInput;

const defaults: FormState = {
  layoutType: 'straight',
  wallLengthMm: 3000,
  ceilingHeightMm: 2700,
};

const typeChipLabels: Record<string, string> = {
  sink: '🚰 Мойка',
  cooktop: '🔥 Варочная',
  stove: '🍳 Плита',
  dishwasher: '🍽 ПММ',
  drawers: '🗄 Ящики',
  standard: '📦 Обычный',
};

let currentForm: FormState = { ...defaults };

let currentModuleTypes: string[] = [];

export function getFormState(): FormState {
  return { ...currentForm };
}

export function renderInputForm(container: HTMLElement, onCalculate: () => void): void {
  container.innerHTML = `
    <form id="calc-form" novalidate>
      <!-- Основные параметры -->
      <div class="form-section">
        <h3>📐 Параметры помещения</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="wallLengthMm">Длина стены (мм)</label>
            <input type="number" id="wallLengthMm" min="300" max="12000" step="1" value="${defaults.wallLengthMm}" required>
          </div>
          <div class="form-field">
            <label for="ceilingHeightMm">Высота потолка (мм)</label>
            <input type="number" id="ceilingHeightMm" min="2000" max="5000" step="1" value="${defaults.ceilingHeightMm ?? ''}">
          </div>
          <div class="form-field">
            <label for="autoModuleWidthMm">Ширина модуля (мм)</label>
            <input type="number" id="autoModuleWidthMm" min="200" max="1200" step="10" value="600">
            <span class="form-hint">Стандарт: 600 мм</span>
          </div>
        </div>
      </div>

      <!-- Фартук и столешница -->
      <div class="form-section">
        <h3>🔲 Фартук и столешница</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="backsplashType">Тип фартука</label>
            <select id="backsplashType">
              <option value="">Выберите...</option>
              <option value="client_tile_existing">Плитка клиента (уже есть)</option>
              <option value="client_tile_planned">Плитка клиента (планируется)</option>
              <option value="our_ldsp_backsplash" selected>Наш фартук ЛДСП</option>
              <option value="custom">Своя высота</option>
            </select>
          </div>
          <div class="form-field">
            <label for="backsplashHeightMm">Высота фартука (мм)</label>
            <input type="number" id="backsplashHeightMm" min="0" max="1200" step="1" placeholder="Авто">
            <span class="form-hint">Оставьте пустым для авторасчета</span>
          </div>
          <div class="form-field">
            <label for="countertopDepthMm">Глубина столешницы (мм)</label>
            <input type="number" id="countertopDepthMm" min="300" max="1200" step="10" value="600">
          </div>
        </div>
      </div>

      <!-- Варочная панель -->
      <div class="form-section">
        <h3>🔥 Варочная панель</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="cooktopType">Тип варочной панели</label>
            <select id="cooktopType">
              <option value="none">Нет</option>
              <option value="electric">Электрическая варочная панель</option>
              <option value="gas">Газовая варочная панель</option>
              <option value="stove_electric">Электрическая плита</option>
              <option value="stove_gas">Газовая плита</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Заполнение кухни -->
      <div class="form-section">
        <h3>🏗 Заполнение кухни</h3>
        <div class="form-grid">
          <div class="form-field full-width">
            <label for="fillDirection">С какой стороны начинать заполнение</label>
            <select id="fillDirection">
              <option value="left-to-right">Слева направо</option>
              <option value="right-to-left">Справа налево</option>
              <option value="center-out">От центра</option>
            </select>
          </div>
        </div>
        <div style="margin-top:0.75rem;">
          <label style="font-size:0.8125rem;font-weight:500;display:block;margin-bottom:0.5rem;">Типы нижних модулей (по порядку)</label>
          <div id="module-types-editor" style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.5rem;"></div>
          <div style="display:flex;gap:0.375rem;flex-wrap:wrap;">
            <button type="button" class="btn-chip" data-add-type="sink">🚰 Мойка</button>
            <button type="button" class="btn-chip" data-add-type="cooktop">🔥 Варочная</button>
            <button type="button" class="btn-chip" data-add-type="stove">🍳 Плита</button>
            <button type="button" class="btn-chip" data-add-type="dishwasher">🍽 ПММ</button>
            <button type="button" class="btn-chip" data-add-type="drawers">🗄 Ящики</button>
            <button type="button" class="btn-chip" data-add-type="standard">📦 Обычный</button>
          </div>
          <span class="form-hint" id="module-types-hint">Нажмите на кнопки выше, чтобы добавить модули слева направо</span>
        </div>
      </div>

      <!-- Опции -->
      <div class="form-section">
        <h3>⚙️ Опции</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="hasGolaProfile">Gola-профиль</label>
            <select id="hasGolaProfile">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
          <div class="form-field">
            <label for="hasDishDryerCabinet">Сушка для посуды</label>
            <select id="hasDishDryerCabinet">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
          <div class="form-field">
            <label for="hasBuiltInMicrowave">Встроенная микроволновка</label>
            <select id="hasBuiltInMicrowave">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
          <div class="form-field">
            <label for="hasRecessedLighting">Врезная подсветка</label>
            <select id="hasRecessedLighting">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Фасады -->
      <div class="form-section">
        <h3>🚪 Фасады</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="facadeMaterial">Материал фасадов</label>
            <select id="facadeMaterial">
              <option value="ldsp">ЛДСП</option>
              <option value="mdf_plastic">МДФ пластик</option>
              <option value="mdf_film">МДФ плёнка</option>
              <option value="mdf_agt_film">МДФ AGT (плёнка под пластик)</option>
              <option value="mdf_enamel">МДФ эмаль (крашеный)</option>
            </select>
          </div>
          <div class="form-field">
            <label for="facadeThicknessMm">Толщина фасадов</label>
            <select id="facadeThicknessMm">
              <option value="16">16 мм</option>
              <option value="18">18 мм</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Витрина (остекление) -->
      <div class="form-section">
        <h3>🪟 Витрина</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="vitrineHasGlass">Остекление</label>
            <select id="vitrineHasGlass">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
          <div class="form-field">
            <label for="vitrineGlassType">Тип стекла</label>
            <select id="vitrineGlassType">
              <option value="transparent">Прозрачное</option>
              <option value="tinted">Затемнённое</option>
              <option value="opaque">Глухое</option>
            </select>
          </div>
          <div class="form-field">
            <label for="vitrineProfileType">Профиль</label>
            <select id="vitrineProfileType">
              <option value="20x20">20×20 мм</option>
              <option value="50x20">50×20 мм</option>
            </select>
          </div>
          <div class="form-field">
            <label for="vitrineGlassColor">Цвет стекла</label>
            <select id="vitrineGlassColor">
              <option value="black">Чёрное</option>
              <option value="graphite">Графитовое</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Потолок -->
      <div class="form-section">
        <h3>⬆️ Потолок</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="roomHeightIncludesStretchCeiling">Высота с учётом натяжного потолка</label>
            <select id="roomHeightIncludesStretchCeiling">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
          <div class="form-field">
            <label for="stretchCeilingPlanned">Планируется натяжной потолок</label>
            <select id="stretchCeilingPlanned">
              <option value="">Нет</option>
              <option value="true">Да</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Остаток стены -->
      <div class="form-section">
        <h3>📏 Остаток стены</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="remainderMode">Режим обработки остатка</label>
            <select id="remainderMode">
              <option value="auto">Авто (умное распределение)</option>
              <option value="distribute">Распределить по модулям</option>
              <option value="extra_module">Создать доп. модуль</option>
              <option value="filler">Добор (не заполнять)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">📊 Рассчитать</button>
        <button type="button" class="btn-secondary" id="reset-btn">Сбросить</button>
      </div>
    </form>
  `;

  const form = container.querySelector('#calc-form') as HTMLFormElement;
  const resetBtn = container.querySelector('#reset-btn') as HTMLButtonElement;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    collectFormState();
    onCalculate();
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    currentForm = { ...defaults };
    (document.getElementById('wallLengthMm') as HTMLInputElement).value = String(defaults.wallLengthMm);
    (document.getElementById('ceilingHeightMm') as HTMLInputElement).value = String(defaults.ceilingHeightMm ?? '');
    (document.getElementById('autoModuleWidthMm') as HTMLInputElement).value = '600';
    (document.getElementById('countertopDepthMm') as HTMLInputElement).value = '600';
    (document.getElementById('backsplashHeightMm') as HTMLInputElement).value = '';
    renderModuleTypesEditor([]);
    onCalculate();
  });

  // --- Редактор типов модулей (чипы) ---
  function renderModuleTypesEditor(types: string[]): void {
    currentModuleTypes = types;
    const editor = document.getElementById('module-types-editor');
    if (!editor) return;
    editor.innerHTML = types.map((t, i) => {
      const label = typeChipLabels[t] || t;
      return `<span class="chip" data-chip-idx="${i}" data-chip-type="${t}" title="Нажмите, чтобы удалить">${label} ✕</span>`;
    }).join('');
    document.getElementById('module-types-hint')!.textContent =
      types.length > 0 ? `Задано модулей: ${types.length}. Нажмите на чип, чтобы удалить.` : 'Нажмите на кнопки выше, чтобы добавить модули слева направо';
  }

  // Добавление типа
  container.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-add-type]') as HTMLElement | null;
    if (btn) {
      const type = btn.dataset.addType!;
      const types = [...currentModuleTypes];
      types.push(type);
      renderModuleTypesEditor(types);
    }
    // Удаление чипа
    const chip = (e.target as HTMLElement).closest('.chip') as HTMLElement | null;
    if (chip) {
      const idx = parseInt(chip.dataset.chipIdx || '', 10);
      const types = [...currentModuleTypes];
      types.splice(idx, 1);
      renderModuleTypesEditor(types);
    }
  });

  function getCurrentModuleTypes(): string[] {
    return currentModuleTypes;
  }

  renderModuleTypesEditor([]);

  collectFormState();
}

function getValue(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)?.value ?? '';
}

function getNum(id: string): number | undefined {
  const v = getValue(id);
  if (v === '' || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function getBool(id: string): boolean | undefined {
  const v = getValue(id);
  if (v === '') return undefined;
  return v === 'true';
}

function collectFormState(): void {
  const types = currentModuleTypes;
  currentForm = {
    layoutType: 'straight',
    wallLengthMm: getNum('wallLengthMm') ?? 3000,
    ceilingHeightMm: getNum('ceilingHeightMm'),
    autoModuleWidthMm: getNum('autoModuleWidthMm'),
    backsplashType: (getValue('backsplashType') || undefined) as any,
    backsplashHeightMm: getNum('backsplashHeightMm'),
    countertopDepthMm: getNum('countertopDepthMm'),
    cooktopType: (getValue('cooktopType') || 'none') as any,
    fillDirection: (getValue('fillDirection') || 'left-to-right') as any,
    moduleTypes: types.length > 0 ? types as any : undefined,
    hasGolaProfile: getBool('hasGolaProfile'),
    hasDishDryerCabinet: getBool('hasDishDryerCabinet'),
    hasBuiltInMicrowave: getBool('hasBuiltInMicrowave'),
    hasRecessedLighting: getBool('hasRecessedLighting'),
    roomHeightIncludesStretchCeiling: getBool('roomHeightIncludesStretchCeiling'),
    stretchCeilingPlanned: getBool('stretchCeilingPlanned'),
    facadeMaterial: (getValue('facadeMaterial') || undefined) as any,
    facadeThicknessMm: (getNum('facadeThicknessMm') || 16) as FacadeThickness | undefined,
    remainderMode: (getValue('remainderMode') || 'auto') as 'auto' | 'distribute' | 'extra_module' | 'filler',
    // Старые поля — ставим по модулям из moduleTypes
    hasSinkCabinet: types.includes('sink') || types.length === 0 ? true : undefined,
    hasDishwasher: types.includes('dishwasher') || undefined,
    hasDrawersCabinet: types.includes('drawers') || undefined,
  };
}
