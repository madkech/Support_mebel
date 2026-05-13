var pe=Object.defineProperty;var Me=(e,t,i)=>t in e?pe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var P=(e,t,i)=>Me(e,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const A={layoutType:"straight",wallLengthMm:3e3,ceilingHeightMm:2700},ve={sink:"🚰 Мойка",cooktop:"🔥 Варочная",stove:"🍳 Плита",dishwasher:"🍽 ПММ",drawers:"🗄 Ящики",standard:"📦 Обычный"};let te={...A},Y=[];function be(){return{...te}}function ye(e,t){e.innerHTML=`
    <form id="calc-form" novalidate>
      <!-- Основные параметры -->
      <div class="form-section">
        <h3>📐 Параметры помещения</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="wallLengthMm">Длина стены (мм)</label>
            <input type="number" id="wallLengthMm" min="300" max="12000" step="1" value="${A.wallLengthMm}" required>
          </div>
          <div class="form-field">
            <label for="ceilingHeightMm">Высота потолка (мм)</label>
            <input type="number" id="ceilingHeightMm" min="2000" max="5000" step="1" value="${A.ceilingHeightMm}">
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
  `;const i=e.querySelector("#calc-form"),s=e.querySelector("#reset-btn");i.addEventListener("submit",n=>{n.preventDefault(),ne(),t()}),s.addEventListener("click",()=>{i.reset(),te={...A},document.getElementById("wallLengthMm").value=String(A.wallLengthMm),document.getElementById("ceilingHeightMm").value=String(A.ceilingHeightMm),document.getElementById("autoModuleWidthMm").value="600",document.getElementById("countertopDepthMm").value="600",document.getElementById("backsplashHeightMm").value="",l([]),t()});function l(n){Y=n;const r=document.getElementById("module-types-editor");r&&(r.innerHTML=n.map((d,a)=>{const o=ve[d]||d;return`<span class="chip" data-chip-idx="${a}" data-chip-type="${d}" title="Нажмите, чтобы удалить">${o} ✕</span>`}).join(""),document.getElementById("module-types-hint").textContent=n.length>0?`Задано модулей: ${n.length}. Нажмите на чип, чтобы удалить.`:"Нажмите на кнопки выше, чтобы добавить модули слева направо")}e.addEventListener("click",n=>{const r=n.target.closest("[data-add-type]");if(r){const a=r.dataset.addType,o=[...Y];o.push(a),l(o)}const d=n.target.closest(".chip");if(d){const a=parseInt(d.dataset.chipIdx||"",10),o=[...Y];o.splice(a,1),l(o)}}),l([]),ne()}function R(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function G(e){const t=R(e);if(t===""||t===null)return;const i=Number(t);return Number.isFinite(i)?i:void 0}function N(e){const t=R(e);if(t!=="")return t==="true"}function ne(){const e=Y;te={layoutType:"straight",wallLengthMm:G("wallLengthMm")??3e3,ceilingHeightMm:G("ceilingHeightMm"),autoModuleWidthMm:G("autoModuleWidthMm"),backsplashType:R("backsplashType")||void 0,backsplashHeightMm:G("backsplashHeightMm"),countertopDepthMm:G("countertopDepthMm"),cooktopType:R("cooktopType")||"none",fillDirection:R("fillDirection")||"left-to-right",moduleTypes:e.length>0?e:void 0,hasGolaProfile:N("hasGolaProfile"),hasDishDryerCabinet:N("hasDishDryerCabinet"),hasBuiltInMicrowave:N("hasBuiltInMicrowave"),hasRecessedLighting:N("hasRecessedLighting"),roomHeightIncludesStretchCeiling:N("roomHeightIncludesStretchCeiling"),stretchCeilingPlanned:N("stretchCeilingPlanned"),facadeMaterial:R("facadeMaterial")||void 0,facadeThicknessMm:G("facadeThicknessMm")||16,remainderMode:R("remainderMode")||"auto",hasSinkCabinet:e.includes("sink")||e.length===0?!0:void 0,hasDishwasher:e.includes("dishwasher")||void 0,hasDrawersCabinet:e.includes("drawers")||void 0}}const m={wallCabinetHeightMm:720,wallCabinetDepthMm:300,wallCabinetDepthWithBuiltInMicrowaveMm:330,ldspThicknessMm:16,baseTotalHeightMm:860,baseTotalHeightWithGolaMm:900,baseTotalHeightWithGolaAndDishwasherMm:920,baseLegHeightMm:100,countertopThicknessMm:38,baseCabinetDepthMm:510,sinkBaseCabinetDepthMm:500,countertopDepthMm:600,baseRailHeightMm:100,baseShelfCount:1,drawerGuideGapPerSideMm:13,ballBearingDrawerDepthMm:500,ballBearingDrawerGuideLengthMm:500,drawerBottomInsetMm:3,drawerHeightFacadeInsetMm:54,drawerDefaultFacadeHeightMm:180,drawerDefaultCount:1,facadeGapMm:3,ceilingFillerMm:50,stretchCeilingReserveMm:80,ceilingGapMm:40,tallWallCabinetThresholdMm:850,clientTileBacksplashHeightMm:600,ourLdspBacksplashHeightMm:580,gasCooktopHoodDistanceMm:750,autoModuleWidthMm:600,minRemainderForExtraModuleMm:200,shelfCount:0,defaultFacadeMaterial:"ldsp",defaultFacadeThicknessMm:16};function we(e){return e.userBacksplashHeightMm!==void 0?e.userBacksplashHeightMm:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?m.clientTileBacksplashHeightMm:e.backsplashType==="our_ldsp_backsplash"?m.ourLdspBacksplashHeightMm:m.clientTileBacksplashHeightMm}function Ce(e){return e.userBaseTotalHeightMm!==void 0?e.userBaseTotalHeightMm:e.hasGolaProfile&&e.hasDishwasher?m.baseTotalHeightWithGolaAndDishwasherMm:e.hasGolaProfile?m.baseTotalHeightWithGolaMm:m.baseTotalHeightMm}function ke(e){return e.userHeightMm!==void 0?e.userHeightMm:(e.baseTotalHeightMm??m.baseTotalHeightMm)-(e.legHeightMm??m.baseLegHeightMm)-(e.countertopThicknessMm??m.countertopThicknessMm)}function _e(e){return typeof e.userCountertopUpstand=="boolean"?e.userCountertopUpstand:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?!1:e.backsplashType==="our_ldsp_backsplash"}const le={side:"front",thicknessMm:1,material:"PVC"},ae={side:"back",thicknessMm:.4,material:"PVC"},He={side:"left",thicknessMm:.4,material:"PVC"},$e={side:"right",thicknessMm:.4,material:"PVC"},De=[{side:"front",thicknessMm:1,material:"PVC"},{side:"back",thicknessMm:1,material:"PVC"},{side:"left",thicknessMm:1,material:"PVC"},{side:"right",thicknessMm:1,material:"PVC"}];function Te(e){return e.userDepthMm!==void 0?e.userDepthMm:e.hasBuiltInMicrowave?m.wallCabinetDepthWithBuiltInMicrowaveMm:e.defaultDepthMm??m.wallCabinetDepthMm}function Le(e){if(e.manualWallCabinetHeightMm!==void 0)return e.manualWallCabinetHeightMm;if(e.roomHeightMm===void 0)return m.wallCabinetHeightMm;const t=e.ceilingFillerMm??m.ceilingFillerMm,i=e.stretchCeilingReserveMm??m.stretchCeilingReserveMm,s=e.ceilingGapMm??m.ceilingGapMm;return e.roomHeightIncludesStretchCeiling?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-t:e.stretchCeilingPlanned?e.roomHeightMm-i-e.baseTotalHeightMm-e.apronHeightMm-t:e.roomHeightIncludesStretchCeiling===!1?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-s:m.wallCabinetHeightMm}function Be(e){return{topFullWidth:e.heightMm>m.tallWallCabinetThresholdMm,bottomFullWidth:!!e.hasRecessedLighting}}function ie(e){return e==="facade"?De:e==="shelf"?[le,ae,He,$e]:[le,ae]}function se(e){return e==="facade"||e==="side"?"vertical":"none"}function Ee(e){const t=e.material??"ldsp",i=e.materialThicknessMm??m.ldspThicknessMm,s=e.facadeHeightMm??m.drawerDefaultFacadeHeightMm;if(e.system!=="ball_bearing_guides")return{id:e.id,system:e.system,facadeHeightMm:s,parts:[],hardware:[],warnings:[`Система ящиков ${e.system} сохранена, точный расчет для нее будет добавлен позже.`]};const l=m.drawerGuideGapPerSideMm*2,n=e.tableWidthMm-2*i-l,r=n-2*i,d=e.tableDepthMm===m.baseCabinetDepthMm?m.ballBearingDrawerDepthMm:Math.min(m.ballBearingDrawerDepthMm,e.tableDepthMm),a=s-m.drawerHeightFacadeInsetMm,o=Math.floor(a/10)*10,c=[K("drawer_side","Drawer side panel",2,d,o,t,i),K("drawer_front","Drawer front panel",1,r,o,t,i),K("drawer_back","Drawer back panel",1,r,o,t,i),K("drawer_bottom","Drawer bottom",1,n-m.drawerBottomInsetMm,d-m.drawerBottomInsetMm,"hdf",3)],h=[{name:"Шариковые направляющие",quantity:1,lengthMm:m.ballBearingDrawerGuideLengthMm}];return{id:e.id,system:e.system,facadeHeightMm:s,widthMm:n,depthMm:d,heightMm:o,parts:c,hardware:h,warnings:[]}}function K(e,t,i,s,l,n,r){return{name:t,kind:e,quantity:i,widthMm:s,depthMm:l,material:n,thicknessMm:r,edgeBanding:[],textureDirection:"none"}}function ue(e){if(e.isDrawers)return[];const t=e.facadeGapMm??m.facadeGapMm;return e.widthMm<=600?[{count:1,widthMm:e.widthMm-t}]:[{count:2,widthMm:(e.widthMm-t*2)/2}]}function Se(e){var u,g;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=e.input.type??"standard",l=s==="drawers"||e.input.drawerSystem!==void 0,n=Ie({type:s,hasDrawers:l,inputShelfCount:e.input.shelfCount,defaultShelfCount:e.defaultShelfCount}),r=((u=e.input.overrides)==null?void 0:u.heightMm)??e.defaultHeightMm,d=((g=e.input.overrides)==null?void 0:g.depthMm)??(s==="sink"?m.sinkBaseCabinetDepthMm:e.defaultDepthMm),a=e.input.facadeSide??"none",o=e.input.drawerSystem??(s==="drawers"?"ball_bearing_guides":void 0),c=o===void 0?0:e.input.drawerCount??m.drawerDefaultCount,h=Array.from({length:c},(p,f)=>{var H;return Ee({id:`${e.id}-drawer-${f+1}`,system:o??"ball_bearing_guides",tableWidthMm:e.input.widthMm,tableDepthMm:d,material:t,materialThicknessMm:i,facadeHeightMm:((H=e.input.drawerFacadeHeightsMm)==null?void 0:H[f])??e.input.drawerFacadeHeightMm??m.drawerDefaultFacadeHeightMm})});return{id:e.id,type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:a,parts:xe({type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:a}),drawers:h,hardware:h.flatMap(p=>p.hardware)}}function Ie(e){return e.type!=="standard"||e.hasDrawers?0:e.inputShelfCount??e.defaultShelfCount??m.baseShelfCount}function xe(e){if(e.type==="dishwasher")return[x(e,"facade","Фасад посудомойки",1,e.widthMm-m.facadeGapMm,e.heightMm-m.facadeGapMm)];const t=e.type==="drawers",i=e.widthMm-2*e.thicknessMm,s=e.facadeSide==="left"||e.facadeSide==="both",l=e.facadeSide==="right"||e.facadeSide==="both",n=s?e.heightMm:e.heightMm-e.thicknessMm,r=l?e.heightMm:e.heightMm-e.thicknessMm,d=Number(s)+Number(l),a=e.widthMm-d*e.thicknessMm,o=[...We(e,n,r),x(e,"bottom","Bottom panel",1,a,e.depthMm),x(e,"front_rail","Front plank",1,i,m.baseRailHeightMm),x(e,"back_rail","Back plank",1,i,m.baseRailHeightMm)];if(e.shelfCount>0&&o.push(x(e,"shelf","Shelf",e.shelfCount,i,e.depthMm)),!t){const c=ue({widthMm:e.widthMm,isDrawers:!1});for(const h of c)for(let u=0;u<h.count;u++){const g=h.count===2?` ${u===0?"левый":"правый"}`:"";o.push(x(e,"facade",`Фасад${g}`,1,h.widthMm,e.heightMm-m.facadeGapMm))}}return o}function We(e,t,i){return t===i?[x(e,"side","Side panel",2,t,e.depthMm)]:[x(e,"side","Left side panel",1,t,e.depthMm),x(e,"side","Right side panel",1,i,e.depthMm)]}function x(e,t,i,s,l,n){return{name:i,kind:t,quantity:s,widthMm:l,depthMm:n,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:ie(t),textureDirection:se(t)}}function Pe(e){return e.userHoodCabinetHeightMm!==void 0?e.userHoodCabinetHeightMm:e.isHoodCabinet&&e.cooktopType==="gas"?e.wallCabinetHeightMm+e.backsplashHeightMm-m.gasCooktopHoodDistanceMm:e.wallCabinetHeightMm}function Re(e){var h,u,g,p;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=!!e.input.hasBuiltInMicrowave,l=!!e.input.isHoodCabinet,n=Fe(e.input.type,l,s),r=Pe({userHoodCabinetHeightMm:(h=e.input.overrides)==null?void 0:h.heightMm,isHoodCabinet:l,cooktopType:e.cooktopType,wallCabinetHeightMm:e.defaultHeightMm,backsplashHeightMm:e.backsplashHeightMm}),d=Te({userDepthMm:(u=e.input.overrides)==null?void 0:u.depthMm,hasBuiltInMicrowave:s,defaultDepthMm:e.defaultDepthMm}),a=!!e.input.hasRecessedLighting,o=Be({heightMm:r,hasRecessedLighting:a}),c=e.input.shelfCount??e.defaultShelfCount??m.shelfCount;return{id:e.id,type:n,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,hasRecessedLighting:a,hasBuiltInMicrowave:s,isHoodCabinet:l,construction:o,parts:Ge({widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,construction:o,edgeBandingOverrides:(g=e.input.overrides)==null?void 0:g.edgeBanding,textureDirectionOverrides:(p=e.input.overrides)==null?void 0:p.textureDirection})}}function Fe(e,t,i){return e||(t?"hood":i?"built_in_microwave":"standard")}function Ge(e){var n,r;const t=e.heightMm-(e.construction.topFullWidth?e.thicknessMm:0)-(e.construction.bottomFullWidth?e.thicknessMm:0),i=e.widthMm-2*e.thicknessMm,s=[J(e,"side","Side panel",2,t),J(e,"top","Top panel",1,e.construction.topFullWidth?e.widthMm:i),J(e,"bottom","Bottom panel",1,e.construction.bottomFullWidth?e.widthMm:i)];e.shelfCount>0&&s.push(J(e,"shelf","Shelf",e.shelfCount,i));const l=ue({widthMm:e.widthMm});for(const d of l)for(let a=0;a<d.count;a++){const o=d.count===2?` ${a===0?"левый":"правый"}`:"";s.push({name:`Фасад${o}`,kind:"facade",quantity:1,widthMm:d.widthMm,depthMm:e.heightMm-m.facadeGapMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n.facade)??ie("facade"),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r.facade)??se("facade")})}return s}function J(e,t,i,s,l){var n,r;return{name:i,kind:t,quantity:s,widthMm:l,depthMm:e.depthMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n[t])??ie(t),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r[t])??se(t)}}const Ne=["backsplashHeightMm","countertopUpstand","baseTotalHeightMm","baseLegHeightMm","countertopThicknessMm","baseCabinetDefaultHeightMm","baseCabinetDefaultDepthMm","countertop.depthMm","wallCabinetDefaultHeightMm","wallCabinetDefaultDepthMm","baseCabinets[].heightMm","baseCabinets[].depthMm","wallCabinets[].heightMm","wallCabinets[].depthMm","wallCabinets[].edgeBanding","wallCabinets[].textureDirection","manualBaseCabinets","manualWallCabinets"];function oe(e){var C;if(e.layoutType!=="straight")throw new Error("Only straight kitchen layout is supported in this MVP.");const t=[],i=[],s=we({userBacksplashHeightMm:e.backsplashHeightMm,backsplashType:e.backsplashType});t.push({code:"backsplash-height",message:`Высота фартука определена как ${s} мм.`});const l=_e({userCountertopUpstand:e.countertopUpstand,backsplashType:e.backsplashType});t.push({code:"countertop-upstand",message:`Бортик у столешницы: ${l?"да":"нет"}.`});const n=Ce({userBaseTotalHeightMm:e.baseTotalHeightMm,hasGolaProfile:e.hasGolaProfile,hasDishwasher:e.hasDishwasher}),r=e.baseLegHeightMm??m.baseLegHeightMm,d=e.countertopThicknessMm??m.countertopThicknessMm,a=ke({baseTotalHeightMm:n,legHeightMm:r,countertopThicknessMm:d}),o=e.baseCabinetDepthMm??m.baseCabinetDepthMm,c={lengthMm:e.wallLengthMm,depthMm:e.countertopDepthMm??m.countertopDepthMm,thicknessMm:d};t.push({code:"lower-module-height",message:`Высота корпуса нижнего модуля: ${a} мм.`}),t.push({code:"countertop",message:`Столешница: ${c.lengthMm}x${c.depthMm}x${c.thicknessMm} мм.`});const h=Le({manualWallCabinetHeightMm:e.wallCabinetDefaultHeightMm,roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,apronHeightMm:s,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm}),u=ze({roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,backsplashHeightMm:s,wallCabinetHeightMm:h,hasManualWallCabinetHeight:e.wallCabinetDefaultHeightMm!==void 0,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm});u.type==="filler"?t.push({code:"ceiling-filler",message:`Добор до потолка: ${u.sizeMm} мм.`}):u.type==="gap"&&t.push({code:"ceiling-gap",message:`Зазор до потолка: ${u.sizeMm} мм.`});const g=!!e.hasBuiltInMicrowave||!!((C=e.manualWallCabinets)!=null&&C.some(M=>M.hasBuiltInMicrowave)),p=e.wallCabinetDefaultDepthMm??(g?m.wallCabinetDepthWithBuiltInMicrowaveMm:m.wallCabinetDepthMm),f=Ae(e,i,t),k=(e.manualBaseCabinets??f.baseCabinets).map((M,L)=>Se({id:`lower-${L+1}`,input:M,defaultHeightMm:a,defaultDepthMm:o,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount})),D=e.manualWallCabinets??f.wallCabinets,I=e.cooktopType??"none",T=D.map((M,L)=>Re({id:`upper-${L+1}`,input:M,defaultHeightMm:h,defaultDepthMm:p,backsplashHeightMm:s,cooktopType:I,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount??m.shelfCount}));for(const M of k)M.heightMm<=0&&i.push(`Lower module ${M.id} has non-positive height ${M.heightMm} mm.`),M.widthMm<=2*M.thicknessMm&&i.push(`Lower module ${M.id} width must be greater than twice material thickness.`);for(const M of T)M.heightMm<=0&&i.push(`Upper cabinet ${M.id} has non-positive height ${M.heightMm} mm.`),M.widthMm<=2*M.thicknessMm&&i.push(`Upper cabinet ${M.id} width must be greater than twice material thickness.`);return{layoutType:"straight",wallLengthMm:e.wallLengthMm,ceilingHeightMm:e.ceilingHeightMm,backsplashType:e.backsplashType,backsplashHeightMm:s,countertopUpstand:l,cooktopType:I,baseTotalHeightMm:n,baseLegHeightMm:r,countertopThicknessMm:d,baseCabinetDefaultHeightMm:a,baseCabinetDefaultDepthMm:o,countertop:c,wallCabinetDefaultHeightMm:h,wallCabinetDefaultDepthMm:p,ceilingFillerMm:u.type==="filler"?u.sizeMm:void 0,stretchCeilingReserveMm:u.stretchCeilingReserveMm,ceilingGapMm:u.type==="gap"?u.sizeMm:void 0,ceilingCompletionType:u.type,ceilingCompletionMm:u.sizeMm,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,facadeMaterial:e.facadeMaterial??m.defaultFacadeMaterial,facadeThicknessMm:e.facadeThicknessMm??m.defaultFacadeThicknessMm,shelfCount:e.shelfCount??m.shelfCount,baseCabinets:k,wallCabinets:T,appliedRules:t,warnings:i,unresolvedWidthMm:f.unresolvedWidthMm,remainderResolution:f.remainderResolution,fillerWidthMm:f.fillerWidthMm,editableParameters:Ne}}function Ae(e,t,i){const s=e.autoModuleWidthMm??m.autoModuleWidthMm,l=Math.floor(e.wallLengthMm/s),n=e.wallLengthMm-l*s,r=e.hasSinkCabinet??!0,d=e.hasDishDryerCabinet??r,a=e.cooktopType??"none",o=a!=="none"&&a!=="stove_gas"&&a!=="stove_electric",c=a==="stove_gas"||a==="stove_electric",h=e.hasDishwasher??!1,u=e.hasDrawersCabinet??!1;let g=l,p,f,H;const k=e.remainderMode??"auto";if(n===0)p=Array.from({length:l},()=>s),f="none";else if(k==="filler")p=Array.from({length:l},()=>s),f="none",H=n,i.push({code:"smart-remainder-filler",message:`Остаток стены ${n} мм оставлен как добор (пользовательский выбор).`});else if(k==="distribute"||k==="auto"&&n<m.minRemainderForExtraModuleMm){const w=Math.floor(n/l),v=n-w*l;p=Array.from({length:l},(y,b)=>s+w+(b<v?1:0)),f="distribute",new Set(p).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${p[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${p.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${p.join(", ")} мм.`))}else if(k==="extra_module"||k==="auto"&&n>=m.minRemainderForExtraModuleMm)g=l+1,p=Array.from({length:l},()=>s),p.push(n),f="extra_module",i.push({code:"smart-remainder-extra-module",message:`Остаток стены ${n} мм ≥ ${m.minRemainderForExtraModuleMm} мм: создан дополнительный модуль шириной ${n} мм. Всего модулей: ${g}.`}),n<s*.5&&t.push(`Дополнительный модуль узкий (${n} мм). При необходимости настройте ширину модуля вручную.`);else{const w=Math.floor(n/l),v=n-w*l;p=Array.from({length:l},(y,b)=>s+w+(b<v?1:0)),f="distribute",new Set(p).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${p[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${p.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${p.join(", ")} мм.`))}let D;e.moduleTypes&&e.moduleTypes.length===g?(D=[...e.moduleTypes],i.push({code:"module-types-custom",message:`Типы модулей заданы пользователем: ${e.moduleTypes.join(" → ")}.`})):D=Array.from({length:g},(w,v)=>qe(v,{hasSinkCabinet:r,hasCooktopCabinet:o,hasStoveCabinet:c,hasDishwasherCabinet:h,hasDrawersCabinet:u}));const I=e.fillDirection??"left-to-right";if(I==="right-to-left")D.reverse();else if(I==="center-out"){const w=Math.floor(g/2),v=[];for(let $=0;$<g;$++){const y=$%2===0?Math.ceil($/2):-Math.ceil($/2),b=w+y;b>=0&&b<g&&v.push(D[b])}D=v}const T=D.findIndex(w=>w==="cooktop"||w==="stove"),C=T>=0?T:2,M=Array.from({length:g},(w,v)=>({widthMm:p[v],shelfCount:e.shelfCount,type:D[v]})),L=Array.from({length:g},(w,v)=>({widthMm:p[v],shelfCount:e.shelfCount,hasRecessedLighting:e.hasRecessedLighting,isHoodCabinet:e.hasHoodCabinet&&v===C,hasBuiltInMicrowave:e.hasBuiltInMicrowave&&v===3,type:d&&v===0?"dish_dryer":void 0}));return e.hasHoodCabinet&&C>=g&&t.push("Запрошен шкаф под вытяжку, но модуль с варочной панелью/плитой не найден."),e.hasBuiltInMicrowave&&g<4&&t.push("Запрошена встроенная микроволновка, но в автоматическом плане нет четвёртого модуля."),i.push({code:"auto-module-plan",message:`Созданы автоматические модули кухни: нижних ${g} шт., навесных ${g} шт.`}),{baseCabinets:M,wallCabinets:L,unresolvedWidthMm:n,remainderResolution:f,fillerWidthMm:H}}function qe(e,t){return t.hasSinkCabinet&&e===0?"sink":t.hasDishwasherCabinet&&e===1?"dishwasher":(t.hasCooktopCabinet||t.hasStoveCabinet)&&e===2?t.hasStoveCabinet?"stove":"cooktop":t.hasDrawersCabinet&&e===3?"drawers":"standard"}function ze(e){if(e.roomHeightMm===void 0)return{};const t=e.stretchCeilingPlanned?e.stretchCeilingReserveMm??m.stretchCeilingReserveMm:0,s=e.roomHeightMm-t-e.baseTotalHeightMm-e.backsplashHeightMm-e.wallCabinetHeightMm;return e.hasManualWallCabinetHeight?{type:e.roomHeightIncludesStretchCeiling===!1&&!e.stretchCeilingPlanned?"gap":"filler",sizeMm:Math.max(0,s),stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling||e.stretchCeilingPlanned?{type:"filler",sizeMm:e.ceilingFillerMm??m.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling===!1?{type:"gap",sizeMm:e.ceilingGapMm??m.ceilingGapMm}:{}}const Oe={client_tile_existing:"Плитка клиента (уже есть)",client_tile_planned:"Плитка клиента (планируется)",our_ldsp_backsplash:"Наш фартук ЛДСП",custom:"Своя высота"},Ue={none:"Нет",electric:"Электрическая",gas:"Газовая",stove_electric:"Электрическая плита",stove_gas:"Газовая плита"},re={side:"Боковина",top:"Крышка",bottom:"Дно",shelf:"Полка",front_rail:"Планка передняя",back_rail:"Планка задняя",facade:"Фасад",drawer_side:"Боковина ящика",drawer_front:"Передняя стенка ящика",drawer_back:"Задняя стенка ящика",drawer_bottom:"Дно ящика"},de={ldsp:"ЛДСП",mdf:"МДФ",hdf:"ХДФ"},Ve={ball_bearing_guides:"Шариковые направляющие",undermount_guides:"Направляющие скрытого монтажа",tandembox:"Tandembox"};function Ke(e){return e?"Да":"Нет"}function Je(e){const t=e.lengthMm!==void 0?` ${e.lengthMm} мм`:"";return`${e.name}${t}: ${e.quantity} компл.`}function ee(e){return{sink:"Мойка",dishwasher:"ПММ",cooktop:"Вароч.",drawers:"Ящики",standard:"Станд.",dish_dryer:"Сушка",hood:"Вытяжка",built_in_microwave:"СВЧ"}[e]??e}function Ye(e,t,i,s){e.innerHTML="";let l={};try{l=JSON.parse(localStorage.getItem("kitchen-module-overrides")||"{}")}catch{}if(t.length>0){const n=ce("🪑 Нижние модули",t.length),r=n.querySelector(".cabinets-list");t.forEach((d,a)=>{const o=l[d.id],c=he((o==null?void 0:o.customName)||`Нижний модуль ${a+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,d.drawers,"lower",a,s,o==null?void 0:o.customName);r.appendChild(c)}),e.appendChild(n)}if(i.length>0){const n=ce("🗄 Навесные шкафы",i.length),r=n.querySelector(".cabinets-list");i.forEach((d,a)=>{const o=l[d.id];r.appendChild(he((o==null?void 0:o.customName)||`Навесной шкаф ${a+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,[],"upper",a,s,o==null?void 0:o.customName))}),e.appendChild(n)}}function ce(e,t){const i=document.createElement("div");return i.className="module-section",i.innerHTML=`<h3>${e} (${t})</h3><div class="cabinets-list"></div>`,i}function he(e,t,i,s,l,n,r,d,a,o,c){const h=document.createElement("div");h.className="cabinet-card";const u=c||Xe(t),g=`cabinet-${d}-${a}`;h.id=g;function p(){return""}let f=null;function H(C){return C&&f?`
        <div class="cabinet-card__header" style="flex-wrap:wrap;">
          <div>
            <div class="cabinet-card__title">${e} <span style="font-weight:400;color:var(--color-text-secondary)">— ${u}</span></div>
            <div class="cabinet-edit-fields">
              <label>Ш: <input type="number" class="edit-dim" data-dim="w" value="${f.w}" min="100" max="2400" step="1"></label>
              <label>В: <input type="number" class="edit-dim" data-dim="h" value="${f.h}" min="50" max="2400" step="1"></label>
              <label>Г: <input type="number" class="edit-dim" data-dim="d" value="${f.d}" min="50" max="1200" step="1"></label>
              <span class="cabinet-edit-actions">
                <button class="btn-edit btn-edit--save">✓ Применить</button>
                <button class="btn-edit btn-edit--cancel">✕ Отмена</button>
              </span>
            </div>
          </div>
        </div>
      `:`
      <div class="cabinet-card__header">
        <div>
          <div class="cabinet-card__title">
            ${e}
            <span style="font-weight:400;color:var(--color-text-secondary)">— ${u}</span>
            ${o?'<button class="btn-edit btn-edit--inline" title="Изменить размеры" data-edit-btn>✏️</button>':""}
          </div>
          <div class="cabinet-card__dimensions">
            ${i}×${s}×${l} мм
            ${o?'<span class="edit-hint">нажмите ✏️ для правки</span>':""}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.375rem;">
          ${p()}
          <span class="cabinet-card__toggle">▼</span>
        </div>
      </div>
    `}h.innerHTML=H(!1);const k=document.createElement("div");k.className="cabinet-card__body",k.innerHTML=Qe(n,r),h.appendChild(k);const D=h.querySelector(".cabinet-card__header"),I=h.querySelector(".cabinet-card__toggle");D.addEventListener("click",C=>{const M=C.target;M.closest(".btn-edit")||M.closest(".edit-dim")||M.closest(".cabinet-edit-fields")||M.closest(".btn-move")||(k.classList.toggle("open"),I.classList.toggle("open",k.classList.contains("open")))}),D.addEventListener("click",C=>{const M=C.target.closest(".btn-move");if(!M||!(o!=null&&o.onReorder))return;const L=M.dataset.moveLevel,w=parseInt(M.dataset.moveIdx||"",10),v=parseInt(M.dataset.moveDir||"0",10),$=w+v;o.onReorder(L,w,$)});const T=h.querySelector("[data-edit-btn]");return T&&o&&T.addEventListener("click",C=>{C.stopPropagation(),f={w:i,h:s,d:l},h.innerHTML=H(!0),h.appendChild(k);const M=h.querySelector(".btn-edit--save"),L=h.querySelector(".btn-edit--cancel"),w=()=>{const v=h.querySelectorAll(".edit-dim"),$={};return v.forEach(y=>{$[y.dataset.dim||""]=Number(y.value)}),{w:$.w||i,h:$.h||s,d:$.d||l}};M.addEventListener("click",()=>{const v=w();d==="lower"?o.onEditLower(a,{widthMm:v.w!==i?v.w:void 0,heightMm:v.h!==s?v.h:void 0,depthMm:v.d!==l?v.d:void 0}):o.onEditUpper(a,{widthMm:v.w!==i?v.w:void 0,heightMm:v.h!==s?v.h:void 0,depthMm:v.d!==l?v.d:void 0})}),L.addEventListener("click",()=>{f=null,h.innerHTML=H(!1),h.appendChild(k)})}),h}function Qe(e,t){let i="";return e.length>0?i+=`
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
          ${e.map(s=>{const l=re[s.kind]||s.name||s.kind,n=de[s.material]||s.material.toUpperCase();return`
            <tr>
              <td>${l}</td>
              <td>${s.quantity}</td>
              <td class="dim-cell">${s.widthMm}×${s.depthMm}</td>
              <td>${n} ${s.thicknessMm} мм</td>
            </tr>`}).join("")}
        </tbody>
      </table>
    `:i+='<p style="color:var(--color-text-secondary);font-size:0.875rem;">Нет деталей</p>',t.length>0&&(i+='<div class="sub-section-title">Ящики</div>',t.forEach((s,l)=>{const n=Ve[s.system]??s.system;i+=`
        <div style="padding:0.5rem;background:var(--color-bg);border-radius:6px;margin-bottom:0.5rem;">
          <div style="font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;">
            Ящик ${l+1} — ${n}
            (фасад ${s.facadeHeightMm} мм)
          </div>
          ${s.warnings.map(r=>`<div style="font-size:0.75rem;color:var(--color-warning);">⚠ ${r}</div>`).join("")}
          <table class="parts-table">
            <thead><tr><th>Деталь</th><th>Кол-во</th><th>Размер (мм)</th><th>Материал</th></tr></thead>
            <tbody>
              ${s.parts.map(r=>{const d=re[r.kind]||r.kind,a=de[r.material]||r.material.toUpperCase();return`
                <tr>
                  <td>${d}</td>
                  <td>${r.quantity}</td>
                  <td class="dim-cell">${r.widthMm}×${r.depthMm}</td>
                  <td>${a} ${r.thicknessMm} мм</td>
                </tr>`}).join("")}
            </tbody>
          </table>
          ${s.hardware.length>0?`
            <div style="font-size:0.75rem;color:var(--color-text-secondary);margin-top:0.375rem;">
              ${s.hardware.map(r=>Je(r)).join("; ")}
            </div>
          `:""}
        </div>
      `})),i}function Xe(e){return{standard:"Обычный",sink:"Под мойку",cooktop:"Под варочную панель",stove:"Под плиту",dishwasher:"Под посудомоечную машину",drawers:"С выкатными ящиками",dish_dryer:"С сушкой",hood:"Под вытяжку",built_in_microwave:"Под встроенную микроволновку"}[e]??e}const fe="kitchen-module-overrides";function Ze(){try{return JSON.parse(localStorage.getItem(fe)||"{}")}catch{return{}}}function je(e){localStorage.setItem(fe,JSON.stringify(e))}function ge(e,t,i,s){const l=t.baseCabinets,n=t.wallCabinets,r=Math.max(l.length,n.length),d=Ze();let a="",o="";for(let y=0;y<r;y++){const b=n[y],_=l[y],W=(b==null?void 0:b.type)??"standard",Q=(_==null?void 0:_.type)??"standard",B=(b==null?void 0:b.id)??"",F=(_==null?void 0:_.id)??"",E=d[B],S=d[F],q=(E==null?void 0:E.customName)||ee(W),z=(S==null?void 0:S.customName)||ee(Q),O=E==null?void 0:E.customColor,U=S==null?void 0:S.customColor;a+=me(B,W,"upper",q,b==null?void 0:b.widthMm,O,E==null?void 0:E.customName,y),o+=me(F,Q,"lower",z,_==null?void 0:_.widthMm,U,S==null?void 0:S.customName,y)}e.innerHTML=`
    <div class="layout-scheme">
      <h3>📋 Схема планировки</h3>
      <div class="scheme-container">
        <div class="scheme-row">
          <span class="scheme-row__label">Верх</span>
          ${a}
          ${t.fillerWidthMm?`<div class="scheme-cell scheme-cell--filler scheme-cell--upper" title="Добор ${t.fillerWidthMm} мм">
            <span class="scheme-cell__type">Добор</span>
            <span class="scheme-cell__width">${t.fillerWidthMm}</span>
          </div>`:""}
        </div>
        <div class="scheme-row">
          <span class="scheme-row__label">Низ</span>
          ${o}
          ${t.fillerWidthMm?`<div class="scheme-cell scheme-cell--filler scheme-cell--lower" title="Добор ${t.fillerWidthMm} мм">
            <span class="scheme-cell__type">Добор</span>
            <span class="scheme-cell__width">${t.fillerWidthMm}</span>
          </div>`:""}
        </div>
        <div class="scheme-dimensions">
          <span>${t.wallLengthMm} мм</span>
          ${t.remainderResolution!=="none"?`<span>Остаток: ${t.unresolvedWidthMm} мм (${t.remainderResolution==="distribute"?"распределён":"доп. модуль"})</span>`:""}
          ${t.fillerWidthMm?`<span>Добор: ${t.fillerWidthMm} мм</span>`:""}
        </div>
      </div>
    </div>
  `;let c=document.getElementById("scheme-modal");c||(c=document.createElement("div"),c.className="modal-overlay",c.id="scheme-modal",c.style.display="none",c.innerHTML=`
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
    `,document.body.appendChild(c));const h=document.getElementById("modal-title"),u=document.getElementById("modal-name"),g=document.getElementById("modal-width"),p=document.getElementById("modal-height"),f=document.getElementById("modal-depth"),H=document.getElementById("modal-color"),k=document.getElementById("modal-save"),D=document.getElementById("modal-cancel"),I=e.__schemeDnDHandler;I&&I.destroy();let T=null,C=null,M=!1;function L(){e.querySelectorAll(".scheme-cell-clickable").forEach(y=>{y.style.outline="",y.style.opacity=""}),T=null,C=null,M=!1}const w={dragstart(y){const b=y.target.closest(".scheme-cell-clickable");b&&(M=!0,T=parseInt(b.dataset.index||"",10),C=b.dataset.level,y.dataTransfer.setData("text/plain",`${C}:${T}`),y.dataTransfer.effectAllowed="move",b.style.opacity="0.4")},dragover(y){const b=y.target.closest(".scheme-cell-clickable");!b||T===null||!C||b.dataset.level===C&&(y.preventDefault(),y.dataTransfer.dropEffect="move",e.querySelectorAll(".scheme-cell-clickable").forEach(_=>{_.style.outline=""}),b.style.outline="2px dashed var(--color-primary)")},drop(y){y.preventDefault();const b=y.target.closest(".scheme-cell-clickable");if(!b||T===null||!C||!s){L();return}const _=b.dataset.level,W=parseInt(b.dataset.index||"",10);if(_!==C||W===T){L();return}s(C,T,W),L()},dragend(){L()}};e.addEventListener("dragstart",w.dragstart),e.addEventListener("dragover",w.dragover),e.addEventListener("drop",w.drop),e.addEventListener("dragend",w.dragend),e.__schemeDnDHandler={destroy:()=>{e.removeEventListener("dragstart",w.dragstart),e.removeEventListener("dragover",w.dragover),e.removeEventListener("drop",w.drop),e.removeEventListener("dragend",w.dragend)}};const v=e.__schemeClickHandler;v&&e.removeEventListener("click",v);const $=y=>{var q,z;if(M)return;const b=y.target.closest(".scheme-cell-clickable");if(!b)return;const _=b.dataset.id||"",W=parseInt(b.dataset.index||"0",10),B=b.dataset.level==="upper"?n[W]:l[W];if(!B)return;const F=d[_]||{};h.textContent=`Редактирование: ${F.customName||ee(B.type)}`,u.value=F.customName||"",g.value=String(B.widthMm),p.value=String(B.heightMm),f.value=String(B.depthMm),H.value=F.customColor||"#6366f1",c.style.display="flex";const E=k.cloneNode(!0),S=D.cloneNode(!0);(q=k.parentNode)==null||q.replaceChild(E,k),(z=D.parentNode)==null||z.replaceChild(S,D),E.addEventListener("click",()=>{const O=u.value.trim(),U=H.value,X=parseInt(g.value,10),Z=parseInt(p.value,10),j=parseInt(f.value,10),V={};O&&(V.customName=O),U&&(V.customColor=U),Object.keys(V).length>0?d[_]={...d[_]||{},...V}:delete d[_],je(d),(X!==B.widthMm||Z!==B.heightMm||j!==B.depthMm)&&i?i(_,{widthMm:X!==B.widthMm?X:void 0,heightMm:Z!==B.heightMm?Z:void 0,depthMm:j!==B.depthMm?j:void 0}):ge(e,t,i,s),c.style.display="none"}),S.addEventListener("click",()=>{c.style.display="none"})};e.addEventListener("click",$),e.__schemeClickHandler=$}function me(e,t,i,s,l,n,r,d){const a=n?`background:${n};`:"";return`
    <div class="scheme-cell scheme-cell--${t} scheme-cell--${i} ${e?"scheme-cell-clickable":""}"
         style="${a}"
         data-id="${e}"
         data-level="${i}"
         data-type="${t}"
         data-index="${d??""}"
         draggable="${e?"true":"false"}"
         title="${s} ${l??""} мм${e?" — нажмите для редактирования, перетащите для перемещения":""}">
      <span class="scheme-cell__type">${s}</span>
      ${l!==void 0?`<span class="scheme-cell__width">${l}</span>`:""}
    </div>
  `}function et(e,t,i){const s=t.length>0,l=i.length>0;if(!s&&!l){e.innerHTML="";return}let n='<div class="rules-log">';s&&(n+='<h3>✓ Применённые правила</h3><div class="rules-log__list">',n+=t.map(r=>`
      <div class="rule-item rule-item--applied">
        <span class="rule-item__icon">✓</span>
        <span>${r.message}</span>
      </div>
    `).join(""),n+="</div>"),l&&(n+='<h3 style="margin-top:1rem;">⚠ Предупреждения</h3><div class="rules-log__list">',n+=i.map(r=>`
      <div class="rule-item rule-item--warning">
        <span class="rule-item__icon">⚠</span>
        <span>${r}</span>
      </div>
    `).join(""),n+="</div>"),n+="</div>",e.innerHTML=n}function tt(e,t,i){if(e.innerHTML="",i){const a=document.createElement("div");a.style.cssText="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:var(--color-primary-light);border-radius:var(--radius-md);border:1px solid var(--color-primary);",a.innerHTML=`
      <span style="font-size:0.8125rem;">
        💡 Нажмите <strong>✏️</strong> на модуле, чтобы изменить его размеры вручную
      </span>
      <button class="btn-secondary" id="reset-manual-btn" style="font-size:0.8125rem;padding:0.375rem 0.75rem;">
        ↻ Сбросить ручные правки
      </button>
    `,e.appendChild(a),a.querySelector("#reset-manual-btn").addEventListener("click",()=>{i.onResetManual()})}const s=document.createElement("div");s.className="summary-bar",s.innerHTML=`
    <div class="summary-item">
      <span class="summary-item__label">Стена</span>
      <span class="summary-item__value">${t.wallLengthMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Высота потолка</span>
      <span class="summary-item__value">${t.ceilingHeightMm??"—"} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Нижняя база</span>
      <span class="summary-item__value">${t.baseTotalHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Корпус низа</span>
      <span class="summary-item__value">${t.baseCabinetDefaultHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Навесные шкафы</span>
      <span class="summary-item__value">${t.wallCabinetDefaultHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Фартук</span>
      <span class="summary-item__value">${it(t.backsplashType)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Высота фартука</span>
      <span class="summary-item__value">${t.backsplashHeightMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Столешница</span>
      <span class="summary-item__value">${t.countertop.lengthMm}×${t.countertop.depthMm}×${t.countertop.thicknessMm}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Бортик</span>
      <span class="summary-item__value">${Ke(t.countertopUpstand)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Варочная панель</span>
      <span class="summary-item__value">${Ue[t.cooktopType]??t.cooktopType}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Модулей (низ/верх)</span>
      <span class="summary-item__value ${t.warnings.length>0?"summary-item__value--warning":""}">
        ${t.baseCabinets.length} / ${t.wallCabinets.length}
      </span>
    </div>
  `,e.appendChild(s);const l=document.createElement("div");e.appendChild(l);const n=i;ge(l,t,(a,o)=>{if(!n)return;const c=a.match(/^(lower|upper)-(\d+)$/);if(!c)return;const h=c[1],u=parseInt(c[2],10)-1;h==="lower"?n.onEditLower(u,o):n.onEditUpper(u,o)},n!=null&&n.onReorder?(a,o,c)=>n.onReorder(a,o,c):void 0);const r=document.createElement("div");e.appendChild(r),Ye(r,t.baseCabinets,t.wallCabinets,i);const d=document.createElement("div");e.appendChild(d),et(d,t.appliedRules,t.warnings)}function it(e){return e?Oe[e]??e:"—"}class st{constructor(t,i){P(this,"formContainer");P(this,"resultsContainer");P(this,"lowerEdits",{});P(this,"upperEdits",{});P(this,"lastAutoInput",null);P(this,"lastAutoProject",null);P(this,"currentProject",null);this.formContainer=t,this.resultsContainer=i}run(){this.calculate()}calculate(){try{const t=be();this.lastAutoInput=t;const i=t.wallLengthMm??3e3,s=oe({...t,manualBaseCabinets:void 0,manualWallCabinets:void 0});this.lastAutoProject=s;const l=s.baseCabinets.length,n=s.wallCabinets.length,r=this.buildManualBasePlan(s,l,i),d=this.buildManualWallPlan(s,n,i);(Object.keys(this.lowerEdits).length>0||Object.keys(this.upperEdits).length>0)&&(t.manualBaseCabinets=r,t.manualWallCabinets=d);const a=oe(t);this.currentProject=a;const o={onEditLower:(c,h)=>this.applyLowerEdit(c,h),onEditUpper:(c,h)=>this.applyUpperEdit(c,h),onResetManual:()=>this.resetManual(),onReorder:(c,h,u)=>this.reorderModules(c,h,u)};tt(this.resultsContainer,a,o)}catch(t){this.resultsContainer.innerHTML=`
        <div class="rules-log">
          <h3>❌ Ошибка расчёта</h3>
          <div class="rule-item rule-item--error">
            <span class="rule-item__icon">✕</span>
            <span>${t instanceof Error?t.message:String(t)}</span>
          </div>
        </div>
      `}}buildManualBasePlan(t,i,s){const l=[],n=Object.values(this.lowerEdits).some(a=>a.widthMm!==void 0);for(let a=0;a<i;a++){const o=this.lowerEdits[a];(o==null?void 0:o.widthMm)!==void 0?l[a]=o.widthMm:l[a]=null}let r;if(n){const a=l.reduce((f,H)=>f+(H??0),0),o=l.filter(f=>f!==null).length,c=i-o,h=Math.max(0,s-a),u=c>0?Math.floor(h/c):0,g=h-u*c;r=[];let p=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(p<g?1:0),p++)}else r=t.baseCabinets.map(a=>a.widthMm);const d=[];for(let a=0;a<i;a++){const o=t.baseCabinets[a],c=this.lowerEdits[a],h={type:o.type,widthMm:r[a],shelfCount:o.shelfCount,facadeSide:o.facadeSide},u=o.drawers[0];u&&(h.drawerSystem=u.system,h.drawerCount=o.drawers.length,h.drawerFacadeHeightMm=u.facadeHeightMm);const g=(c==null?void 0:c.heightMm)!==void 0,p=(c==null?void 0:c.depthMm)!==void 0;(g||p)&&(h.overrides={},g&&(h.overrides.heightMm=c.heightMm),p&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}buildManualWallPlan(t,i,s){const l=[],n=Object.values(this.upperEdits).some(a=>a.widthMm!==void 0);for(let a=0;a<i;a++){const o=this.upperEdits[a];l[a]=(o==null?void 0:o.widthMm)??null}let r;if(n){const a=l.reduce((f,H)=>f+(H??0),0),o=l.filter(f=>f!==null).length,c=i-o,h=Math.max(0,s-a),u=c>0?Math.floor(h/c):0,g=h-u*c;r=[];let p=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(p<g?1:0),p++)}else r=t.wallCabinets.map(a=>a.widthMm);const d=[];for(let a=0;a<i;a++){const o=t.wallCabinets[a],c=this.upperEdits[a],h={type:o.type,widthMm:r[a],shelfCount:o.shelfCount,hasRecessedLighting:o.hasRecessedLighting,hasBuiltInMicrowave:o.hasBuiltInMicrowave,isHoodCabinet:o.isHoodCabinet,vitrine:o.vitrine},u=(c==null?void 0:c.heightMm)!==void 0,g=(c==null?void 0:c.depthMm)!==void 0;(u||g)&&(h.overrides={},u&&(h.overrides.heightMm=c.heightMm),g&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}applyLowerEdit(t,i){if(!this.lastAutoProject)return;const s={...this.lowerEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.lowerEdits[t]=s,this.calculate()}applyUpperEdit(t,i){if(!this.lastAutoProject)return;const s={...this.upperEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.upperEdits[t]=s,this.calculate()}resetManual(){this.lowerEdits={},this.upperEdits={},this.calculate()}reorderModules(t,i,s){var c,h;const l=t==="lower"?this.lowerEdits:this.upperEdits,n=t==="lower"?((c=this.lastAutoProject)==null?void 0:c.baseCabinets.length)??0:((h=this.lastAutoProject)==null?void 0:h.wallCabinets.length)??0;Object.keys(l).map(Number).sort((u,g)=>u-g);const r=[];for(let u=0;u<n;u++)r.push({index:u,edit:l[u]??null});const d=r[i],a=r[s];d&&a&&(r[i]=a,r[s]=d);const o={};for(const u of r)u.edit&&(o[u.index]=u.edit);t==="lower"?this.lowerEdits=o:this.upperEdits=o,this.calculate()}}function nt(){const e=document.getElementById("form-container"),t=document.getElementById("results-container");if(!e||!t){console.error("Required containers not found");return}const i=new st(e,t);ye(e,()=>{i.calculate()}),i.run()}document.addEventListener("DOMContentLoaded",nt);
