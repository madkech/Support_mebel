var fe=Object.defineProperty;var ge=(e,t,i)=>t in e?fe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var W=(e,t,i)=>ge(e,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const F={layoutType:"straight",wallLengthMm:3e3,ceilingHeightMm:2700},pe={sink:"🚰 Мойка",cooktop:"🔥 Варочная",stove:"🍳 Плита",dishwasher:"🍽 ПММ",drawers:"🗄 Ящики",standard:"📦 Обычный"};let Z={...F},J=[];function Me(){return{...Z}}function ve(e,t){e.innerHTML=`
    <form id="calc-form" novalidate>
      <!-- Основные параметры -->
      <div class="form-section">
        <h3>📐 Параметры помещения</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="wallLengthMm">Длина стены (мм)</label>
            <input type="number" id="wallLengthMm" min="300" max="12000" step="1" value="${F.wallLengthMm}" required>
          </div>
          <div class="form-field">
            <label for="ceilingHeightMm">Высота потолка (мм)</label>
            <input type="number" id="ceilingHeightMm" min="2000" max="5000" step="1" value="${F.ceilingHeightMm}">
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
  `;const i=e.querySelector("#calc-form"),s=e.querySelector("#reset-btn");i.addEventListener("submit",n=>{n.preventDefault(),te(),t()}),s.addEventListener("click",()=>{i.reset(),Z={...F},document.getElementById("wallLengthMm").value=String(F.wallLengthMm),document.getElementById("ceilingHeightMm").value=String(F.ceilingHeightMm),document.getElementById("autoModuleWidthMm").value="600",document.getElementById("countertopDepthMm").value="600",document.getElementById("backsplashHeightMm").value="",l([]),t()});function l(n){J=n;const r=document.getElementById("module-types-editor");r&&(r.innerHTML=n.map((d,a)=>{const o=pe[d]||d;return`<span class="chip" data-chip-idx="${a}" data-chip-type="${d}" title="Нажмите, чтобы удалить">${o} ✕</span>`}).join(""),document.getElementById("module-types-hint").textContent=n.length>0?`Задано модулей: ${n.length}. Нажмите на чип, чтобы удалить.`:"Нажмите на кнопки выше, чтобы добавить модули слева направо")}e.addEventListener("click",n=>{const r=n.target.closest("[data-add-type]");if(r){const a=r.dataset.addType,o=[...J];o.push(a),l(o)}const d=n.target.closest(".chip");if(d){const a=parseInt(d.dataset.chipIdx||"",10),o=[...J];o.splice(a,1),l(o)}}),l([]),te()}function P(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function R(e){const t=P(e);if(t===""||t===null)return;const i=Number(t);return Number.isFinite(i)?i:void 0}function G(e){const t=P(e);if(t!=="")return t==="true"}function te(){const e=J;Z={layoutType:"straight",wallLengthMm:R("wallLengthMm")??3e3,ceilingHeightMm:R("ceilingHeightMm"),autoModuleWidthMm:R("autoModuleWidthMm"),backsplashType:P("backsplashType")||void 0,backsplashHeightMm:R("backsplashHeightMm"),countertopDepthMm:R("countertopDepthMm"),cooktopType:P("cooktopType")||"none",fillDirection:P("fillDirection")||"left-to-right",moduleTypes:e.length>0?e:void 0,hasGolaProfile:G("hasGolaProfile"),hasDishDryerCabinet:G("hasDishDryerCabinet"),hasBuiltInMicrowave:G("hasBuiltInMicrowave"),hasRecessedLighting:G("hasRecessedLighting"),roomHeightIncludesStretchCeiling:G("roomHeightIncludesStretchCeiling"),stretchCeilingPlanned:G("stretchCeilingPlanned"),facadeMaterial:P("facadeMaterial")||void 0,facadeThicknessMm:R("facadeThicknessMm")||16,remainderMode:P("remainderMode")||"auto",hasSinkCabinet:e.includes("sink")||e.length===0?!0:void 0,hasDishwasher:e.includes("dishwasher")||void 0,hasDrawersCabinet:e.includes("drawers")||void 0}}const m={wallCabinetHeightMm:720,wallCabinetDepthMm:300,wallCabinetDepthWithBuiltInMicrowaveMm:330,ldspThicknessMm:16,baseTotalHeightMm:860,baseTotalHeightWithGolaMm:900,baseTotalHeightWithGolaAndDishwasherMm:920,baseLegHeightMm:100,countertopThicknessMm:38,baseCabinetDepthMm:510,sinkBaseCabinetDepthMm:500,countertopDepthMm:600,baseRailHeightMm:100,baseShelfCount:1,drawerGuideGapPerSideMm:13,ballBearingDrawerDepthMm:500,ballBearingDrawerGuideLengthMm:500,drawerBottomInsetMm:3,drawerHeightFacadeInsetMm:54,drawerDefaultFacadeHeightMm:180,drawerDefaultCount:1,facadeGapMm:3,ceilingFillerMm:50,stretchCeilingReserveMm:80,ceilingGapMm:40,tallWallCabinetThresholdMm:850,clientTileBacksplashHeightMm:600,ourLdspBacksplashHeightMm:580,gasCooktopHoodDistanceMm:750,autoModuleWidthMm:600,minRemainderForExtraModuleMm:200,shelfCount:0,defaultFacadeMaterial:"ldsp",defaultFacadeThicknessMm:16};function be(e){return e.userBacksplashHeightMm!==void 0?e.userBacksplashHeightMm:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?m.clientTileBacksplashHeightMm:e.backsplashType==="our_ldsp_backsplash"?m.ourLdspBacksplashHeightMm:m.clientTileBacksplashHeightMm}function ye(e){return e.userBaseTotalHeightMm!==void 0?e.userBaseTotalHeightMm:e.hasGolaProfile&&e.hasDishwasher?m.baseTotalHeightWithGolaAndDishwasherMm:e.hasGolaProfile?m.baseTotalHeightWithGolaMm:m.baseTotalHeightMm}function we(e){return e.userHeightMm!==void 0?e.userHeightMm:(e.baseTotalHeightMm??m.baseTotalHeightMm)-(e.legHeightMm??m.baseLegHeightMm)-(e.countertopThicknessMm??m.countertopThicknessMm)}function Ce(e){return typeof e.userCountertopUpstand=="boolean"?e.userCountertopUpstand:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?!1:e.backsplashType==="our_ldsp_backsplash"}const ie={side:"front",thicknessMm:1,material:"PVC"},se={side:"back",thicknessMm:.4,material:"PVC"},ke={side:"left",thicknessMm:.4,material:"PVC"},_e={side:"right",thicknessMm:.4,material:"PVC"},He=[{side:"front",thicknessMm:1,material:"PVC"},{side:"back",thicknessMm:1,material:"PVC"},{side:"left",thicknessMm:1,material:"PVC"},{side:"right",thicknessMm:1,material:"PVC"}];function $e(e){return e.userDepthMm!==void 0?e.userDepthMm:e.hasBuiltInMicrowave?m.wallCabinetDepthWithBuiltInMicrowaveMm:e.defaultDepthMm??m.wallCabinetDepthMm}function De(e){if(e.manualWallCabinetHeightMm!==void 0)return e.manualWallCabinetHeightMm;if(e.roomHeightMm===void 0)return m.wallCabinetHeightMm;const t=e.ceilingFillerMm??m.ceilingFillerMm,i=e.stretchCeilingReserveMm??m.stretchCeilingReserveMm,s=e.ceilingGapMm??m.ceilingGapMm;return e.roomHeightIncludesStretchCeiling?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-t:e.stretchCeilingPlanned?e.roomHeightMm-i-e.baseTotalHeightMm-e.apronHeightMm-t:e.roomHeightIncludesStretchCeiling===!1?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-s:m.wallCabinetHeightMm}function Te(e){return{topFullWidth:e.heightMm>m.tallWallCabinetThresholdMm,bottomFullWidth:!!e.hasRecessedLighting}}function j(e){return e==="facade"?He:e==="shelf"?[ie,se,ke,_e]:[ie,se]}function ee(e){return e==="facade"||e==="side"?"vertical":"none"}function Le(e){const t=e.material??"ldsp",i=e.materialThicknessMm??m.ldspThicknessMm,s=e.facadeHeightMm??m.drawerDefaultFacadeHeightMm;if(e.system!=="ball_bearing_guides")return{id:e.id,system:e.system,facadeHeightMm:s,parts:[],hardware:[],warnings:[`Система ящиков ${e.system} сохранена, точный расчет для нее будет добавлен позже.`]};const l=m.drawerGuideGapPerSideMm*2,n=e.tableWidthMm-2*i-l,r=n-2*i,d=e.tableDepthMm===m.baseCabinetDepthMm?m.ballBearingDrawerDepthMm:Math.min(m.ballBearingDrawerDepthMm,e.tableDepthMm),a=s-m.drawerHeightFacadeInsetMm,o=Math.floor(a/10)*10,c=[V("drawer_side","Drawer side panel",2,d,o,t,i),V("drawer_front","Drawer front panel",1,r,o,t,i),V("drawer_back","Drawer back panel",1,r,o,t,i),V("drawer_bottom","Drawer bottom",1,n-m.drawerBottomInsetMm,d-m.drawerBottomInsetMm,"hdf",3)],h=[{name:"Шариковые направляющие",quantity:1,lengthMm:m.ballBearingDrawerGuideLengthMm}];return{id:e.id,system:e.system,facadeHeightMm:s,widthMm:n,depthMm:d,heightMm:o,parts:c,hardware:h,warnings:[]}}function V(e,t,i,s,l,n,r){return{name:t,kind:e,quantity:i,widthMm:s,depthMm:l,material:n,thicknessMm:r,edgeBanding:[],textureDirection:"none"}}function he(e){if(e.isDrawers)return[];const t=e.facadeGapMm??m.facadeGapMm;return e.widthMm<=600?[{count:1,widthMm:e.widthMm-t}]:[{count:2,widthMm:(e.widthMm-t*2)/2}]}function Be(e){var u,M;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=e.input.type??"standard",l=s==="drawers"||e.input.drawerSystem!==void 0,n=Ee({type:s,hasDrawers:l,inputShelfCount:e.input.shelfCount,defaultShelfCount:e.defaultShelfCount}),r=((u=e.input.overrides)==null?void 0:u.heightMm)??e.defaultHeightMm,d=((M=e.input.overrides)==null?void 0:M.depthMm)??(s==="sink"?m.sinkBaseCabinetDepthMm:e.defaultDepthMm),a=e.input.facadeSide??"none",o=e.input.drawerSystem??(s==="drawers"?"ball_bearing_guides":void 0),c=o===void 0?0:e.input.drawerCount??m.drawerDefaultCount,h=Array.from({length:c},(v,f)=>{var H;return Le({id:`${e.id}-drawer-${f+1}`,system:o??"ball_bearing_guides",tableWidthMm:e.input.widthMm,tableDepthMm:d,material:t,materialThicknessMm:i,facadeHeightMm:((H=e.input.drawerFacadeHeightsMm)==null?void 0:H[f])??e.input.drawerFacadeHeightMm??m.drawerDefaultFacadeHeightMm})});return{id:e.id,type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:a,parts:Se({type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:a}),drawers:h,hardware:h.flatMap(v=>v.hardware)}}function Ee(e){return e.type!=="standard"||e.hasDrawers?0:e.inputShelfCount??e.defaultShelfCount??m.baseShelfCount}function Se(e){if(e.type==="dishwasher")return[x(e,"facade","Фасад посудомойки",1,e.widthMm-m.facadeGapMm,e.heightMm-m.facadeGapMm)];const t=e.type==="drawers",i=e.widthMm-2*e.thicknessMm,s=e.facadeSide==="left"||e.facadeSide==="both",l=e.facadeSide==="right"||e.facadeSide==="both",n=s?e.heightMm:e.heightMm-e.thicknessMm,r=l?e.heightMm:e.heightMm-e.thicknessMm,d=Number(s)+Number(l),a=e.widthMm-d*e.thicknessMm,o=[...Ie(e,n,r),x(e,"bottom","Bottom panel",1,a,e.depthMm),x(e,"front_rail","Front plank",1,i,m.baseRailHeightMm),x(e,"back_rail","Back plank",1,i,m.baseRailHeightMm)];if(e.shelfCount>0&&o.push(x(e,"shelf","Shelf",e.shelfCount,i,e.depthMm)),!t){const c=he({widthMm:e.widthMm,isDrawers:!1});for(const h of c)for(let u=0;u<h.count;u++){const M=h.count===2?` ${u===0?"левый":"правый"}`:"";o.push(x(e,"facade",`Фасад${M}`,1,h.widthMm,e.heightMm-m.facadeGapMm))}}return o}function Ie(e,t,i){return t===i?[x(e,"side","Side panel",2,t,e.depthMm)]:[x(e,"side","Left side panel",1,t,e.depthMm),x(e,"side","Right side panel",1,i,e.depthMm)]}function x(e,t,i,s,l,n){return{name:i,kind:t,quantity:s,widthMm:l,depthMm:n,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:j(t),textureDirection:ee(t)}}function xe(e){return e.userHoodCabinetHeightMm!==void 0?e.userHoodCabinetHeightMm:e.isHoodCabinet&&e.cooktopType==="gas"?e.wallCabinetHeightMm+e.backsplashHeightMm-m.gasCooktopHoodDistanceMm:e.wallCabinetHeightMm}function We(e){var h,u,M,v;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=!!e.input.hasBuiltInMicrowave,l=!!e.input.isHoodCabinet,n=Pe(e.input.type,l,s),r=xe({userHoodCabinetHeightMm:(h=e.input.overrides)==null?void 0:h.heightMm,isHoodCabinet:l,cooktopType:e.cooktopType,wallCabinetHeightMm:e.defaultHeightMm,backsplashHeightMm:e.backsplashHeightMm}),d=$e({userDepthMm:(u=e.input.overrides)==null?void 0:u.depthMm,hasBuiltInMicrowave:s,defaultDepthMm:e.defaultDepthMm}),a=!!e.input.hasRecessedLighting,o=Te({heightMm:r,hasRecessedLighting:a}),c=e.input.shelfCount??e.defaultShelfCount??m.shelfCount;return{id:e.id,type:n,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,hasRecessedLighting:a,hasBuiltInMicrowave:s,isHoodCabinet:l,vitrine:e.input.vitrine,construction:o,parts:Re({widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,construction:o,edgeBandingOverrides:(M=e.input.overrides)==null?void 0:M.edgeBanding,textureDirectionOverrides:(v=e.input.overrides)==null?void 0:v.textureDirection})}}function Pe(e,t,i){return e||(t?"hood":i?"built_in_microwave":"standard")}function Re(e){var n,r;const t=e.heightMm-(e.construction.topFullWidth?e.thicknessMm:0)-(e.construction.bottomFullWidth?e.thicknessMm:0),i=e.widthMm-2*e.thicknessMm,s=[K(e,"side","Side panel",2,t),K(e,"top","Top panel",1,e.construction.topFullWidth?e.widthMm:i),K(e,"bottom","Bottom panel",1,e.construction.bottomFullWidth?e.widthMm:i)];e.shelfCount>0&&s.push(K(e,"shelf","Shelf",e.shelfCount,i));const l=he({widthMm:e.widthMm});for(const d of l)for(let a=0;a<d.count;a++){const o=d.count===2?` ${a===0?"левый":"правый"}`:"";s.push({name:`Фасад${o}`,kind:"facade",quantity:1,widthMm:d.widthMm,depthMm:e.heightMm-m.facadeGapMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n.facade)??j("facade"),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r.facade)??ee("facade")})}return s}function K(e,t,i,s,l){var n,r;return{name:i,kind:t,quantity:s,widthMm:l,depthMm:e.depthMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n[t])??j(t),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r[t])??ee(t)}}const Ge=["backsplashHeightMm","countertopUpstand","baseTotalHeightMm","baseLegHeightMm","countertopThicknessMm","baseCabinetDefaultHeightMm","baseCabinetDefaultDepthMm","countertop.depthMm","wallCabinetDefaultHeightMm","wallCabinetDefaultDepthMm","baseCabinets[].heightMm","baseCabinets[].depthMm","wallCabinets[].heightMm","wallCabinets[].depthMm","wallCabinets[].edgeBanding","wallCabinets[].textureDirection","manualBaseCabinets","manualWallCabinets"];function ne(e){var $;if(e.layoutType!=="straight")throw new Error("Only straight kitchen layout is supported in this MVP.");const t=[],i=[],s=be({userBacksplashHeightMm:e.backsplashHeightMm,backsplashType:e.backsplashType});t.push({code:"backsplash-height",message:`Высота фартука определена как ${s} мм.`});const l=Ce({userCountertopUpstand:e.countertopUpstand,backsplashType:e.backsplashType});t.push({code:"countertop-upstand",message:`Бортик у столешницы: ${l?"да":"нет"}.`});const n=ye({userBaseTotalHeightMm:e.baseTotalHeightMm,hasGolaProfile:e.hasGolaProfile,hasDishwasher:e.hasDishwasher}),r=e.baseLegHeightMm??m.baseLegHeightMm,d=e.countertopThicknessMm??m.countertopThicknessMm,a=we({baseTotalHeightMm:n,legHeightMm:r,countertopThicknessMm:d}),o=e.baseCabinetDepthMm??m.baseCabinetDepthMm,c={lengthMm:e.wallLengthMm,depthMm:e.countertopDepthMm??m.countertopDepthMm,thicknessMm:d};t.push({code:"lower-module-height",message:`Высота корпуса нижнего модуля: ${a} мм.`}),t.push({code:"countertop",message:`Столешница: ${c.lengthMm}x${c.depthMm}x${c.thicknessMm} мм.`});const h=De({manualWallCabinetHeightMm:e.wallCabinetDefaultHeightMm,roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,apronHeightMm:s,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm}),u=Ne({roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,backsplashHeightMm:s,wallCabinetHeightMm:h,hasManualWallCabinetHeight:e.wallCabinetDefaultHeightMm!==void 0,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm});u.type==="filler"?t.push({code:"ceiling-filler",message:`Добор до потолка: ${u.sizeMm} мм.`}):u.type==="gap"&&t.push({code:"ceiling-gap",message:`Зазор до потолка: ${u.sizeMm} мм.`});const M=!!e.hasBuiltInMicrowave||!!(($=e.manualWallCabinets)!=null&&$.some(p=>p.hasBuiltInMicrowave)),v=e.wallCabinetDefaultDepthMm??(M?m.wallCabinetDepthWithBuiltInMicrowaveMm:m.wallCabinetDepthMm),f=Fe(e,i,t),k=(e.manualBaseCabinets??f.baseCabinets).map((p,D)=>Be({id:`lower-${D+1}`,input:p,defaultHeightMm:a,defaultDepthMm:o,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount})),L=e.manualWallCabinets??f.wallCabinets,T=e.cooktopType??"none",_=L.map((p,D)=>We({id:`upper-${D+1}`,input:p,defaultHeightMm:h,defaultDepthMm:v,backsplashHeightMm:s,cooktopType:T,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount??m.shelfCount}));for(const p of k)p.heightMm<=0&&i.push(`Lower module ${p.id} has non-positive height ${p.heightMm} mm.`),p.widthMm<=2*p.thicknessMm&&i.push(`Lower module ${p.id} width must be greater than twice material thickness.`);for(const p of _)p.heightMm<=0&&i.push(`Upper cabinet ${p.id} has non-positive height ${p.heightMm} mm.`),p.widthMm<=2*p.thicknessMm&&i.push(`Upper cabinet ${p.id} width must be greater than twice material thickness.`);return{layoutType:"straight",wallLengthMm:e.wallLengthMm,ceilingHeightMm:e.ceilingHeightMm,backsplashType:e.backsplashType,backsplashHeightMm:s,countertopUpstand:l,cooktopType:T,baseTotalHeightMm:n,baseLegHeightMm:r,countertopThicknessMm:d,baseCabinetDefaultHeightMm:a,baseCabinetDefaultDepthMm:o,countertop:c,wallCabinetDefaultHeightMm:h,wallCabinetDefaultDepthMm:v,ceilingFillerMm:u.type==="filler"?u.sizeMm:void 0,stretchCeilingReserveMm:u.stretchCeilingReserveMm,ceilingGapMm:u.type==="gap"?u.sizeMm:void 0,ceilingCompletionType:u.type,ceilingCompletionMm:u.sizeMm,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,facadeMaterial:e.facadeMaterial??m.defaultFacadeMaterial,facadeThicknessMm:e.facadeThicknessMm??m.defaultFacadeThicknessMm,shelfCount:e.shelfCount??m.shelfCount,baseCabinets:k,wallCabinets:_,appliedRules:t,warnings:i,unresolvedWidthMm:f.unresolvedWidthMm,remainderResolution:f.remainderResolution,fillerWidthMm:f.fillerWidthMm,editableParameters:Ge}}function Fe(e,t,i){const s=e.autoModuleWidthMm??m.autoModuleWidthMm,l=Math.floor(e.wallLengthMm/s),n=e.wallLengthMm-l*s,r=e.hasSinkCabinet??!0,d=e.hasDishDryerCabinet??r,a=e.cooktopType??"none",o=a!=="none"&&a!=="stove_gas"&&a!=="stove_electric",c=a==="stove_gas"||a==="stove_electric",h=e.hasDishwasher??!1,u=e.hasDrawersCabinet??!1;let M=l,v,f,H;const k=e.remainderMode??"auto";if(n===0)v=Array.from({length:l},()=>s),f="none";else if(k==="filler")v=Array.from({length:l},()=>s),f="none",H=n,i.push({code:"smart-remainder-filler",message:`Остаток стены ${n} мм оставлен как добор (пользовательский выбор).`});else if(k==="distribute"||k==="auto"&&n<m.minRemainderForExtraModuleMm){const C=Math.floor(n/l),y=n-C*l;v=Array.from({length:l},(g,w)=>s+C+(w<y?1:0)),f="distribute",new Set(v).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${v[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${v.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${v.join(", ")} мм.`))}else if(k==="extra_module"||k==="auto"&&n>=m.minRemainderForExtraModuleMm)M=l+1,v=Array.from({length:l},()=>s),v.push(n),f="extra_module",i.push({code:"smart-remainder-extra-module",message:`Остаток стены ${n} мм ≥ ${m.minRemainderForExtraModuleMm} мм: создан дополнительный модуль шириной ${n} мм. Всего модулей: ${M}.`}),n<s*.5&&t.push(`Дополнительный модуль узкий (${n} мм). При необходимости настройте ширину модуля вручную.`);else{const C=Math.floor(n/l),y=n-C*l;v=Array.from({length:l},(g,w)=>s+C+(w<y?1:0)),f="distribute",new Set(v).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${v[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${v.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${v.join(", ")} мм.`))}let L;e.moduleTypes&&e.moduleTypes.length===M?(L=[...e.moduleTypes],i.push({code:"module-types-custom",message:`Типы модулей заданы пользователем: ${e.moduleTypes.join(" → ")}.`})):L=Array.from({length:M},(C,y)=>Ae(y,{hasSinkCabinet:r,hasCooktopCabinet:o,hasStoveCabinet:c,hasDishwasherCabinet:h,hasDrawersCabinet:u}));const T=e.fillDirection??"left-to-right";if(T==="right-to-left")L.reverse();else if(T==="center-out"){const C=Math.floor(M/2),y=[];for(let b=0;b<M;b++){const g=b%2===0?Math.ceil(b/2):-Math.ceil(b/2),w=C+g;w>=0&&w<M&&y.push(L[w])}L=y}const _=L.findIndex(C=>C==="cooktop"||C==="stove"),$=_>=0?_:2,p=Array.from({length:M},(C,y)=>({widthMm:v[y],shelfCount:e.shelfCount,type:L[y]})),D=Array.from({length:M},(C,y)=>({widthMm:v[y],shelfCount:e.shelfCount,hasRecessedLighting:e.hasRecessedLighting,isHoodCabinet:e.hasHoodCabinet&&y===$,hasBuiltInMicrowave:e.hasBuiltInMicrowave&&y===3,type:d&&y===0?"dish_dryer":void 0}));return e.hasHoodCabinet&&$>=M&&t.push("Запрошен шкаф под вытяжку, но модуль с варочной панелью/плитой не найден."),e.hasBuiltInMicrowave&&M<4&&t.push("Запрошена встроенная микроволновка, но в автоматическом плане нет четвёртого модуля."),i.push({code:"auto-module-plan",message:`Созданы автоматические модули кухни: нижних ${M} шт., навесных ${M} шт.`}),{baseCabinets:p,wallCabinets:D,unresolvedWidthMm:n,remainderResolution:f,fillerWidthMm:H}}function Ae(e,t){return t.hasSinkCabinet&&e===0?"sink":t.hasDishwasherCabinet&&e===1?"dishwasher":(t.hasCooktopCabinet||t.hasStoveCabinet)&&e===2?t.hasStoveCabinet?"stove":"cooktop":t.hasDrawersCabinet&&e===3?"drawers":"standard"}function Ne(e){if(e.roomHeightMm===void 0)return{};const t=e.stretchCeilingPlanned?e.stretchCeilingReserveMm??m.stretchCeilingReserveMm:0,s=e.roomHeightMm-t-e.baseTotalHeightMm-e.backsplashHeightMm-e.wallCabinetHeightMm;return e.hasManualWallCabinetHeight?{type:e.roomHeightIncludesStretchCeiling===!1&&!e.stretchCeilingPlanned?"gap":"filler",sizeMm:Math.max(0,s),stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling||e.stretchCeilingPlanned?{type:"filler",sizeMm:e.ceilingFillerMm??m.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling===!1?{type:"gap",sizeMm:e.ceilingGapMm??m.ceilingGapMm}:{}}const qe={client_tile_existing:"Плитка клиента (уже есть)",client_tile_planned:"Плитка клиента (планируется)",our_ldsp_backsplash:"Наш фартук ЛДСП",custom:"Своя высота"},ze={none:"Нет",electric:"Электрическая",gas:"Газовая",stove_electric:"Электрическая плита",stove_gas:"Газовая плита"},Oe={ldsp:"ЛДСП",mdf_plastic:"МДФ пластик",mdf_film:"МДФ плёнка",mdf_agt_film:"МДФ AGT (плёнка под пластик)",mdf_enamel:"МДФ эмаль (крашеный)"},le={side:"Боковина",top:"Крышка",bottom:"Дно",shelf:"Полка",front_rail:"Планка передняя",back_rail:"Планка задняя",facade:"Фасад",drawer_side:"Боковина ящика",drawer_front:"Передняя стенка ящика",drawer_back:"Задняя стенка ящика",drawer_bottom:"Дно ящика"},ae={ldsp:"ЛДСП",mdf:"МДФ",hdf:"ХДФ"},Ue={ball_bearing_guides:"Шариковые направляющие",undermount_guides:"Направляющие скрытого монтажа",tandembox:"Tandembox"};function Ve(e){return e?"Да":"Нет"}function Ke(e){const t=e.lengthMm!==void 0?` ${e.lengthMm} мм`:"";return`${e.name}${t}: ${e.quantity} компл.`}function oe(e){return{sink:"Мойка",dishwasher:"ПММ",cooktop:"Вароч.",drawers:"Ящики",standard:"Станд.",dish_dryer:"Сушка",hood:"Вытяжка",built_in_microwave:"СВЧ"}[e]??e}function Je(e,t,i,s){e.innerHTML="";let l={};try{l=JSON.parse(localStorage.getItem("kitchen-module-overrides")||"{}")}catch{}if(t.length>0){const n=re("🪑 Нижние модули",t.length),r=n.querySelector(".cabinets-list");t.forEach((d,a)=>{const o=l[d.id],c=de((o==null?void 0:o.customName)||`Нижний модуль ${a+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,d.drawers,"lower",a,s,o==null?void 0:o.customName);r.appendChild(c)}),e.appendChild(n)}if(i.length>0){const n=re("🗄 Навесные шкафы",i.length),r=n.querySelector(".cabinets-list");i.forEach((d,a)=>{const o=l[d.id];r.appendChild(de((o==null?void 0:o.customName)||`Навесной шкаф ${a+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,[],"upper",a,s,o==null?void 0:o.customName))}),e.appendChild(n)}}function re(e,t){const i=document.createElement("div");return i.className="module-section",i.innerHTML=`<h3>${e} (${t})</h3><div class="cabinets-list"></div>`,i}function de(e,t,i,s,l,n,r,d,a,o,c){const h=document.createElement("div");h.className="cabinet-card";const u=c||Qe(t),M=`cabinet-${d}-${a}`;h.id=M;function v(){return""}let f=null;function H($){return $&&f?`
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
          ${v()}
          <span class="cabinet-card__toggle">▼</span>
        </div>
      </div>
    `}h.innerHTML=H(!1);const k=document.createElement("div");k.className="cabinet-card__body",k.innerHTML=Ye(n,r),h.appendChild(k);const L=h.querySelector(".cabinet-card__header"),T=h.querySelector(".cabinet-card__toggle");L.addEventListener("click",$=>{const p=$.target;p.closest(".btn-edit")||p.closest(".edit-dim")||p.closest(".cabinet-edit-fields")||p.closest(".btn-move")||(k.classList.toggle("open"),T.classList.toggle("open",k.classList.contains("open")))}),L.addEventListener("click",$=>{const p=$.target.closest(".btn-move");if(!p||!(o!=null&&o.onReorder))return;const D=p.dataset.moveLevel,C=parseInt(p.dataset.moveIdx||"",10),y=parseInt(p.dataset.moveDir||"0",10),b=C+y;o.onReorder(D,C,b)});const _=h.querySelector("[data-edit-btn]");return _&&o&&_.addEventListener("click",$=>{$.stopPropagation(),f={w:i,h:s,d:l},h.innerHTML=H(!0),h.appendChild(k);const p=h.querySelector(".btn-edit--save"),D=h.querySelector(".btn-edit--cancel"),C=()=>{const y=h.querySelectorAll(".edit-dim"),b={};return y.forEach(g=>{b[g.dataset.dim||""]=Number(g.value)}),{w:b.w||i,h:b.h||s,d:b.d||l}};p.addEventListener("click",()=>{const y=C();d==="lower"?o.onEditLower(a,{widthMm:y.w!==i?y.w:void 0,heightMm:y.h!==s?y.h:void 0,depthMm:y.d!==l?y.d:void 0}):o.onEditUpper(a,{widthMm:y.w!==i?y.w:void 0,heightMm:y.h!==s?y.h:void 0,depthMm:y.d!==l?y.d:void 0})}),D.addEventListener("click",()=>{f=null,h.innerHTML=H(!1),h.appendChild(k)})}),h}function Ye(e,t){let i="";return e.length>0?i+=`
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
          ${e.map(s=>{const l=le[s.kind]||s.name||s.kind,n=ae[s.material]||s.material.toUpperCase();return`
            <tr>
              <td>${l}</td>
              <td>${s.quantity}</td>
              <td class="dim-cell">${s.widthMm}×${s.depthMm}</td>
              <td>${n} ${s.thicknessMm} мм</td>
            </tr>`}).join("")}
        </tbody>
      </table>
    `:i+='<p style="color:var(--color-text-secondary);font-size:0.875rem;">Нет деталей</p>',t.length>0&&(i+='<div class="sub-section-title">Ящики</div>',t.forEach((s,l)=>{const n=Ue[s.system]??s.system;i+=`
        <div style="padding:0.5rem;background:var(--color-bg);border-radius:6px;margin-bottom:0.5rem;">
          <div style="font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;">
            Ящик ${l+1} — ${n}
            (фасад ${s.facadeHeightMm} мм)
          </div>
          ${s.warnings.map(r=>`<div style="font-size:0.75rem;color:var(--color-warning);">⚠ ${r}</div>`).join("")}
          <table class="parts-table">
            <thead><tr><th>Деталь</th><th>Кол-во</th><th>Размер (мм)</th><th>Материал</th></tr></thead>
            <tbody>
              ${s.parts.map(r=>{const d=le[r.kind]||r.kind,a=ae[r.material]||r.material.toUpperCase();return`
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
              ${s.hardware.map(r=>Ke(r)).join("; ")}
            </div>
          `:""}
        </div>
      `})),i}function Qe(e){return{standard:"Обычный",sink:"Под мойку",cooktop:"Под варочную панель",stove:"Под плиту",dishwasher:"Под посудомоечную машину",drawers:"С выкатными ящиками",dish_dryer:"С сушкой",hood:"Под вытяжку",built_in_microwave:"Под встроенную микроволновку"}[e]??e}const me="kitchen-module-overrides";function Xe(){try{return JSON.parse(localStorage.getItem(me)||"{}")}catch{return{}}}function Ze(e){localStorage.setItem(me,JSON.stringify(e))}function ue(e,t,i,s){const l=t.baseCabinets,n=t.wallCabinets,r=Math.max(l.length,n.length),d=Xe();let a="",o="";for(let b=0;b<r;b++){const g=n[b],w=l[b],I=(g==null?void 0:g.type)??"standard",Y=(w==null?void 0:w.type)??"standard",S=(g==null?void 0:g.id)??"",A=(w==null?void 0:w.id)??"",B=d[S],E=d[A],q=(B==null?void 0:B.customName)||oe(I),z=(E==null?void 0:E.customName)||oe(Y),O=B==null?void 0:B.customColor,N=E==null?void 0:E.customColor;a+=ce(S,I,"upper",q,g==null?void 0:g.widthMm,O,B==null?void 0:B.customName,b),o+=ce(A,Y,"lower",z,w==null?void 0:w.widthMm,N,E==null?void 0:E.customName,b)}e.innerHTML=`
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
    `,document.body.appendChild(c)),document.getElementById("modal-title");const h=document.getElementById("modal-name"),u=document.getElementById("modal-width"),M=document.getElementById("modal-height"),v=document.getElementById("modal-depth"),f=document.getElementById("modal-color"),H=document.getElementById("modal-save"),k=document.getElementById("modal-cancel"),L=e.__schemeDnDHandler;L&&L.destroy();let T=null,_=null,$=!1;function p(){e.querySelectorAll(".scheme-cell-clickable").forEach(b=>{b.style.outline="",b.style.opacity=""}),T=null,_=null,$=!1}const D={dragstart(b){const g=b.target.closest(".scheme-cell-clickable");if(!g){console.log("🟢 dragstart: no cell");return}console.log("🟢 dragstart:",g.dataset.level,g.dataset.index,"draggable:",g.draggable),$=!0,T=parseInt(g.dataset.index||"",10),_=g.dataset.level,b.dataTransfer.setData("text/plain",`${_}:${T}`),b.dataTransfer.effectAllowed="move",g.style.opacity="0.4"},dragover(b){const g=b.target.closest(".scheme-cell-clickable");if(!g||T===null||!_){console.log("🟡 dragover: skip, no drag context");return}if(g.dataset.level!==_){console.log("🟡 dragover: wrong level",g.dataset.level,"!=",_);return}b.preventDefault(),console.log("🟡 dragover:",g.dataset.level,g.dataset.index),b.dataTransfer.dropEffect="move",e.querySelectorAll(".scheme-cell-clickable").forEach(w=>{w.style.outline=""}),g.style.outline="2px dashed var(--color-primary)"},drop(b){b.preventDefault(),console.log("🔴 drop fired!");const g=b.target.closest(".scheme-cell-clickable");if(!g){console.log("🔴 drop: no target cell"),p();return}if(T===null||!_){console.log("🔴 drop: no drag source"),p();return}if(!s){console.log("🔴 drop: no onReorder callback"),p();return}const w=g.dataset.level,I=parseInt(g.dataset.index||"",10);if(console.log("🔴 drop target:",w,I,"from:",_,T),w!==_||I===T){console.log("🔴 drop: same position"),p();return}s(_,T,I),p()},dragend(){console.log("🔵 dragend"),p()}};e.addEventListener("dragstart",D.dragstart),e.addEventListener("dragover",D.dragover),e.addEventListener("drop",D.drop),e.addEventListener("dragend",D.dragend),e.__schemeDnDHandler={destroy:()=>{e.removeEventListener("dragstart",D.dragstart),e.removeEventListener("dragover",D.dragover),e.removeEventListener("drop",D.drop),e.removeEventListener("dragend",D.dragend)}};const C=e.__schemeClickHandler;C&&e.removeEventListener("click",C);const y=b=>{var E,q;if($){console.log("🟣 click blocked: isDragging = true");return}const g=b.target.closest(".scheme-cell-clickable");if(!g)return;console.log("🟣 click on cell:",g.dataset.level,g.dataset.index,"isDragging:",$);const w=g.dataset.id||"",I=parseInt(g.dataset.index||"0",10),S=g.dataset.level==="upper"?n[I]:l[I];if(!S)return;const A=H.cloneNode(!0),B=k.cloneNode(!0);(E=H.parentNode)==null||E.replaceChild(A,H),(q=k.parentNode)==null||q.replaceChild(B,k),A.addEventListener("click",()=>{const z=h.value.trim(),O=f.value,N=parseInt(u.value,10),Q=parseInt(M.value,10),X=parseInt(v.value,10),U={};z&&(U.customName=z),O&&(U.customColor=O),Object.keys(U).length>0?d[w]={...d[w]||{},...U}:delete d[w],Ze(d),(N!==S.widthMm||Q!==S.heightMm||X!==S.depthMm)&&i?i(w,{widthMm:N!==S.widthMm?N:void 0,heightMm:Q!==S.heightMm?Q:void 0,depthMm:X!==S.depthMm?X:void 0}):ue(e,t,i,s),c.style.display="none"}),B.addEventListener("click",()=>{c.style.display="none"})};e.addEventListener("click",y),e.__schemeClickHandler=y}function ce(e,t,i,s,l,n,r,d){const a=n?`background:${n};`:"";return`
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
  `}function je(e,t,i){const s=t.length>0,l=i.length>0;if(!s&&!l){e.innerHTML="";return}let n='<div class="rules-log">';s&&(n+='<h3>✓ Применённые правила</h3><div class="rules-log__list">',n+=t.map(r=>`
      <div class="rule-item rule-item--applied">
        <span class="rule-item__icon">✓</span>
        <span>${r.message}</span>
      </div>
    `).join(""),n+="</div>"),l&&(n+='<h3 style="margin-top:1rem;">⚠ Предупреждения</h3><div class="rules-log__list">',n+=i.map(r=>`
      <div class="rule-item rule-item--warning">
        <span class="rule-item__icon">⚠</span>
        <span>${r}</span>
      </div>
    `).join(""),n+="</div>"),n+="</div>",e.innerHTML=n}function et(e,t,i){if(e.innerHTML="",i){const a=document.createElement("div");a.style.cssText="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:var(--color-primary-light);border-radius:var(--radius-md);border:1px solid var(--color-primary);",a.innerHTML=`
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
      <span class="summary-item__value">${tt(t.backsplashType)}</span>
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
      <span class="summary-item__value">${Ve(t.countertopUpstand)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Фасады</span>
      <span class="summary-item__value">${Oe[t.facadeMaterial]??t.facadeMaterial} ${t.facadeThicknessMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Варочная панель</span>
      <span class="summary-item__value">${ze[t.cooktopType]??t.cooktopType}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Модулей (низ/верх)</span>
      <span class="summary-item__value ${t.warnings.length>0?"summary-item__value--warning":""}">
        ${t.baseCabinets.length} / ${t.wallCabinets.length}
      </span>
    </div>
  `,e.appendChild(s);const l=document.createElement("div");e.appendChild(l);const n=i;ue(l,t,(a,o)=>{if(!n)return;const c=a.match(/^(lower|upper)-(\d+)$/);if(!c)return;const h=c[1],u=parseInt(c[2],10)-1;h==="lower"?n.onEditLower(u,o):n.onEditUpper(u,o)},n!=null&&n.onReorder?(a,o,c)=>n.onReorder(a,o,c):void 0);const r=document.createElement("div");e.appendChild(r),Je(r,t.baseCabinets,t.wallCabinets,i);const d=document.createElement("div");e.appendChild(d),je(d,t.appliedRules,t.warnings)}function tt(e){return e?qe[e]??e:"—"}class it{constructor(t,i){W(this,"formContainer");W(this,"resultsContainer");W(this,"lowerEdits",{});W(this,"upperEdits",{});W(this,"lastAutoInput",null);W(this,"lastAutoProject",null);W(this,"currentProject",null);this.formContainer=t,this.resultsContainer=i}run(){this.calculate()}calculate(){try{const t=Me();this.lastAutoInput=t;const i=t.wallLengthMm??3e3,s=ne({...t,manualBaseCabinets:void 0,manualWallCabinets:void 0});this.lastAutoProject=s;const l=s.baseCabinets.length,n=s.wallCabinets.length,r=this.buildManualBasePlan(s,l,i),d=this.buildManualWallPlan(s,n,i);(Object.keys(this.lowerEdits).length>0||Object.keys(this.upperEdits).length>0)&&(t.manualBaseCabinets=r,t.manualWallCabinets=d);const a=ne(t);this.currentProject=a;const o={onEditLower:(c,h)=>this.applyLowerEdit(c,h),onEditUpper:(c,h)=>this.applyUpperEdit(c,h),onResetManual:()=>this.resetManual(),onReorder:(c,h,u)=>this.reorderModules(c,h,u)};et(this.resultsContainer,a,o)}catch(t){this.resultsContainer.innerHTML=`
        <div class="rules-log">
          <h3>❌ Ошибка расчёта</h3>
          <div class="rule-item rule-item--error">
            <span class="rule-item__icon">✕</span>
            <span>${t instanceof Error?t.message:String(t)}</span>
          </div>
        </div>
      `}}buildManualBasePlan(t,i,s){const l=[],n=Object.values(this.lowerEdits).some(a=>a.widthMm!==void 0);for(let a=0;a<i;a++){const o=this.lowerEdits[a];(o==null?void 0:o.widthMm)!==void 0?l[a]=o.widthMm:l[a]=null}let r;if(n){const a=l.reduce((f,H)=>f+(H??0),0),o=l.filter(f=>f!==null).length,c=i-o,h=Math.max(0,s-a),u=c>0?Math.floor(h/c):0,M=h-u*c;r=[];let v=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(v<M?1:0),v++)}else r=t.baseCabinets.map(a=>a.widthMm);const d=[];for(let a=0;a<i;a++){const o=t.baseCabinets[a],c=this.lowerEdits[a],h={type:o.type,widthMm:r[a],shelfCount:o.shelfCount,facadeSide:o.facadeSide},u=o.drawers[0];u&&(h.drawerSystem=u.system,h.drawerCount=o.drawers.length,h.drawerFacadeHeightMm=u.facadeHeightMm);const M=(c==null?void 0:c.heightMm)!==void 0,v=(c==null?void 0:c.depthMm)!==void 0;(M||v)&&(h.overrides={},M&&(h.overrides.heightMm=c.heightMm),v&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}buildManualWallPlan(t,i,s){const l=[],n=Object.values(this.upperEdits).some(a=>a.widthMm!==void 0);for(let a=0;a<i;a++){const o=this.upperEdits[a];l[a]=(o==null?void 0:o.widthMm)??null}let r;if(n){const a=l.reduce((f,H)=>f+(H??0),0),o=l.filter(f=>f!==null).length,c=i-o,h=Math.max(0,s-a),u=c>0?Math.floor(h/c):0,M=h-u*c;r=[];let v=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(v<M?1:0),v++)}else r=t.wallCabinets.map(a=>a.widthMm);const d=[];for(let a=0;a<i;a++){const o=t.wallCabinets[a],c=this.upperEdits[a],h={type:o.type,widthMm:r[a],shelfCount:o.shelfCount,hasRecessedLighting:o.hasRecessedLighting,hasBuiltInMicrowave:o.hasBuiltInMicrowave,isHoodCabinet:o.isHoodCabinet,vitrine:o.vitrine},u=(c==null?void 0:c.heightMm)!==void 0,M=(c==null?void 0:c.depthMm)!==void 0;(u||M)&&(h.overrides={},u&&(h.overrides.heightMm=c.heightMm),M&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}applyLowerEdit(t,i){if(!this.lastAutoProject)return;const s={...this.lowerEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.lowerEdits[t]=s,this.calculate()}applyUpperEdit(t,i){if(!this.lastAutoProject)return;const s={...this.upperEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.upperEdits[t]=s,this.calculate()}resetManual(){this.lowerEdits={},this.upperEdits={},this.calculate()}reorderModules(t,i,s){var c,h;const l=t==="lower"?this.lowerEdits:this.upperEdits,n=t==="lower"?((c=this.lastAutoProject)==null?void 0:c.baseCabinets.length)??0:((h=this.lastAutoProject)==null?void 0:h.wallCabinets.length)??0;Object.keys(l).map(Number).sort((u,M)=>u-M);const r=[];for(let u=0;u<n;u++)r.push({index:u,edit:l[u]??null});const d=r[i],a=r[s];d&&a&&(r[i]=a,r[s]=d);const o={};for(const u of r)u.edit&&(o[u.index]=u.edit);t==="lower"?this.lowerEdits=o:this.upperEdits=o,this.calculate()}}function st(){const e=document.getElementById("form-container"),t=document.getElementById("results-container");if(!e||!t){console.error("Required containers not found");return}const i=new it(e,t);ve(e,()=>{i.calculate()}),i.run()}document.addEventListener("DOMContentLoaded",st);
