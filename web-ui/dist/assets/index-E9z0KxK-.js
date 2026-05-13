var ve=Object.defineProperty;var be=(e,t,i)=>t in e?ve(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var N=(e,t,i)=>be(e,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const Y={layoutType:"straight",wallLengthMm:3e3,ceilingHeightMm:2700},ye={sink:"🚰 Мойка",cooktop:"🔥 Варочная",stove:"🍳 Плита",dishwasher:"🍽 ПММ",drawers:"🗄 Ящики",standard:"📦 Обычный"};let se={...Y},j=[];function we(){return{...se}}function Ce(e,t){e.innerHTML=`
    <form id="calc-form" novalidate>
      <!-- Основные параметры -->
      <div class="form-section">
        <h3>📐 Параметры помещения</h3>
        <div class="form-grid">
          <div class="form-field">
            <label for="wallLengthMm">Длина стены (мм)</label>
            <input type="number" id="wallLengthMm" min="300" max="12000" step="1" value="${Y.wallLengthMm}" required>
          </div>
          <div class="form-field">
            <label for="ceilingHeightMm">Высота потолка (мм)</label>
            <input type="number" id="ceilingHeightMm" min="2000" max="5000" step="1" value="${Y.ceilingHeightMm}">
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
  `;const i=e.querySelector("#calc-form"),s=e.querySelector("#reset-btn");i.addEventListener("submit",n=>{n.preventDefault(),oe(),t()}),s.addEventListener("click",()=>{i.reset(),se={...Y},document.getElementById("wallLengthMm").value=String(Y.wallLengthMm),document.getElementById("ceilingHeightMm").value=String(Y.ceilingHeightMm),document.getElementById("autoModuleWidthMm").value="600",document.getElementById("countertopDepthMm").value="600",document.getElementById("backsplashHeightMm").value="",l([]),t()});function l(n){j=n;const r=document.getElementById("module-types-editor");r&&(r.innerHTML=n.map((d,o)=>{const a=ye[d]||d;return`<span class="chip" data-chip-idx="${o}" data-chip-type="${d}" title="Нажмите, чтобы удалить">${a} ✕</span>`}).join(""),document.getElementById("module-types-hint").textContent=n.length>0?`Задано модулей: ${n.length}. Нажмите на чип, чтобы удалить.`:"Нажмите на кнопки выше, чтобы добавить модули слева направо")}e.addEventListener("click",n=>{const r=n.target.closest("[data-add-type]");if(r){const o=r.dataset.addType,a=[...j];a.push(o),l(a)}const d=n.target.closest(".chip");if(d){const o=parseInt(d.dataset.chipIdx||"",10),a=[...j];a.splice(o,1),l(a)}}),l([]),oe()}function q(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function U(e){const t=q(e);if(t===""||t===null)return;const i=Number(t);return Number.isFinite(i)?i:void 0}function V(e){const t=q(e);if(t!=="")return t==="true"}function oe(){const e=j;se={layoutType:"straight",wallLengthMm:U("wallLengthMm")??3e3,ceilingHeightMm:U("ceilingHeightMm"),autoModuleWidthMm:U("autoModuleWidthMm"),backsplashType:q("backsplashType")||void 0,backsplashHeightMm:U("backsplashHeightMm"),countertopDepthMm:U("countertopDepthMm"),cooktopType:q("cooktopType")||"none",fillDirection:q("fillDirection")||"left-to-right",moduleTypes:e.length>0?e:void 0,hasGolaProfile:V("hasGolaProfile"),hasDishDryerCabinet:V("hasDishDryerCabinet"),hasBuiltInMicrowave:V("hasBuiltInMicrowave"),hasRecessedLighting:V("hasRecessedLighting"),roomHeightIncludesStretchCeiling:V("roomHeightIncludesStretchCeiling"),stretchCeilingPlanned:V("stretchCeilingPlanned"),facadeMaterial:q("facadeMaterial")||void 0,facadeThicknessMm:U("facadeThicknessMm")||16,remainderMode:q("remainderMode")||"auto",hasSinkCabinet:e.includes("sink")||e.length===0?!0:void 0,hasDishwasher:e.includes("dishwasher")||void 0,hasDrawersCabinet:e.includes("drawers")||void 0}}const m={wallCabinetHeightMm:720,wallCabinetDepthMm:300,wallCabinetDepthWithBuiltInMicrowaveMm:330,ldspThicknessMm:16,baseTotalHeightMm:860,baseTotalHeightWithGolaMm:900,baseTotalHeightWithGolaAndDishwasherMm:920,baseLegHeightMm:100,countertopThicknessMm:38,baseCabinetDepthMm:510,sinkBaseCabinetDepthMm:500,countertopDepthMm:600,baseRailHeightMm:100,baseShelfCount:1,drawerGuideGapPerSideMm:13,ballBearingDrawerDepthMm:500,ballBearingDrawerGuideLengthMm:500,drawerBottomInsetMm:3,drawerHeightFacadeInsetMm:54,drawerDefaultFacadeHeightMm:180,drawerDefaultCount:1,facadeGapMm:3,ceilingFillerMm:50,stretchCeilingReserveMm:80,ceilingGapMm:40,tallWallCabinetThresholdMm:850,clientTileBacksplashHeightMm:600,ourLdspBacksplashHeightMm:580,gasCooktopHoodDistanceMm:750,autoModuleWidthMm:600,minRemainderForExtraModuleMm:200,shelfCount:0,defaultFacadeMaterial:"ldsp",defaultFacadeThicknessMm:16};function ke(e){return e.userBacksplashHeightMm!==void 0?e.userBacksplashHeightMm:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?m.clientTileBacksplashHeightMm:e.backsplashType==="our_ldsp_backsplash"?m.ourLdspBacksplashHeightMm:m.clientTileBacksplashHeightMm}function _e(e){return e.userBaseTotalHeightMm!==void 0?e.userBaseTotalHeightMm:e.hasGolaProfile&&e.hasDishwasher?m.baseTotalHeightWithGolaAndDishwasherMm:e.hasGolaProfile?m.baseTotalHeightWithGolaMm:m.baseTotalHeightMm}function He(e){return e.userHeightMm!==void 0?e.userHeightMm:(e.baseTotalHeightMm??m.baseTotalHeightMm)-(e.legHeightMm??m.baseLegHeightMm)-(e.countertopThicknessMm??m.countertopThicknessMm)}function $e(e){return typeof e.userCountertopUpstand=="boolean"?e.userCountertopUpstand:e.backsplashType==="client_tile_existing"||e.backsplashType==="client_tile_planned"?!1:e.backsplashType==="our_ldsp_backsplash"}const ae={side:"front",thicknessMm:1,material:"PVC"},re={side:"back",thicknessMm:.4,material:"PVC"},De={side:"left",thicknessMm:.4,material:"PVC"},Te={side:"right",thicknessMm:.4,material:"PVC"},Le=[{side:"front",thicknessMm:1,material:"PVC"},{side:"back",thicknessMm:1,material:"PVC"},{side:"left",thicknessMm:1,material:"PVC"},{side:"right",thicknessMm:1,material:"PVC"}];function Be(e){return e.userDepthMm!==void 0?e.userDepthMm:e.hasBuiltInMicrowave?m.wallCabinetDepthWithBuiltInMicrowaveMm:e.defaultDepthMm??m.wallCabinetDepthMm}function Ee(e){if(e.manualWallCabinetHeightMm!==void 0)return e.manualWallCabinetHeightMm;if(e.roomHeightMm===void 0)return m.wallCabinetHeightMm;const t=e.ceilingFillerMm??m.ceilingFillerMm,i=e.stretchCeilingReserveMm??m.stretchCeilingReserveMm,s=e.ceilingGapMm??m.ceilingGapMm;return e.roomHeightIncludesStretchCeiling?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-t:e.stretchCeilingPlanned?e.roomHeightMm-i-e.baseTotalHeightMm-e.apronHeightMm-t:e.roomHeightIncludesStretchCeiling===!1?e.roomHeightMm-e.baseTotalHeightMm-e.apronHeightMm-s:m.wallCabinetHeightMm}function Se(e){return{topFullWidth:e.heightMm>m.tallWallCabinetThresholdMm,bottomFullWidth:!!e.hasRecessedLighting}}function ne(e){return e==="facade"?Le:e==="shelf"?[ae,re,De,Te]:[ae,re]}function le(e){return e==="facade"||e==="side"?"vertical":"none"}function Ie(e){const t=e.material??"ldsp",i=e.materialThicknessMm??m.ldspThicknessMm,s=e.facadeHeightMm??m.drawerDefaultFacadeHeightMm;if(e.system!=="ball_bearing_guides")return{id:e.id,system:e.system,facadeHeightMm:s,parts:[],hardware:[],warnings:[`Система ящиков ${e.system} сохранена, точный расчет для нее будет добавлен позже.`]};const l=m.drawerGuideGapPerSideMm*2,n=e.tableWidthMm-2*i-l,r=n-2*i,d=e.tableDepthMm===m.baseCabinetDepthMm?m.ballBearingDrawerDepthMm:Math.min(m.ballBearingDrawerDepthMm,e.tableDepthMm),o=s-m.drawerHeightFacadeInsetMm,a=Math.floor(o/10)*10,c=[Q("drawer_side","Drawer side panel",2,d,a,t,i),Q("drawer_front","Drawer front panel",1,r,a,t,i),Q("drawer_back","Drawer back panel",1,r,a,t,i),Q("drawer_bottom","Drawer bottom",1,n-m.drawerBottomInsetMm,d-m.drawerBottomInsetMm,"hdf",3)],h=[{name:"Шариковые направляющие",quantity:1,lengthMm:m.ballBearingDrawerGuideLengthMm}];return{id:e.id,system:e.system,facadeHeightMm:s,widthMm:n,depthMm:d,heightMm:a,parts:c,hardware:h,warnings:[]}}function Q(e,t,i,s,l,n,r){return{name:t,kind:e,quantity:i,widthMm:s,depthMm:l,material:n,thicknessMm:r,edgeBanding:[],textureDirection:"none"}}function Me(e){if(e.isDrawers)return[];const t=e.facadeGapMm??m.facadeGapMm;return e.widthMm<=600?[{count:1,widthMm:e.widthMm-t}]:[{count:2,widthMm:(e.widthMm-t*2)/2}]}function xe(e){var u,M;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=e.input.type??"standard",l=s==="drawers"||e.input.drawerSystem!==void 0,n=We({type:s,hasDrawers:l,inputShelfCount:e.input.shelfCount,defaultShelfCount:e.defaultShelfCount}),r=((u=e.input.overrides)==null?void 0:u.heightMm)??e.defaultHeightMm,d=((M=e.input.overrides)==null?void 0:M.depthMm)??(s==="sink"?m.sinkBaseCabinetDepthMm:e.defaultDepthMm),o=e.input.facadeSide??"none",a=e.input.drawerSystem??(s==="drawers"?"ball_bearing_guides":void 0),c=a===void 0?0:e.input.drawerCount??m.drawerDefaultCount,h=Array.from({length:c},(p,f)=>{var T;return Ie({id:`${e.id}-drawer-${f+1}`,system:a??"ball_bearing_guides",tableWidthMm:e.input.widthMm,tableDepthMm:d,material:t,materialThicknessMm:i,facadeHeightMm:((T=e.input.drawerFacadeHeightsMm)==null?void 0:T[f])??e.input.drawerFacadeHeightMm??m.drawerDefaultFacadeHeightMm})});return{id:e.id,type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:o,parts:Pe({type:s,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:n,facadeSide:o}),drawers:h,hardware:h.flatMap(p=>p.hardware)}}function We(e){return e.type!=="standard"||e.hasDrawers?0:e.inputShelfCount??e.defaultShelfCount??m.baseShelfCount}function Pe(e){if(e.type==="dishwasher")return[P(e,"facade","Фасад посудомойки",1,e.widthMm-m.facadeGapMm,e.heightMm-m.facadeGapMm)];const t=e.type==="drawers",i=e.widthMm-2*e.thicknessMm,s=e.facadeSide==="left"||e.facadeSide==="both",l=e.facadeSide==="right"||e.facadeSide==="both",n=s?e.heightMm:e.heightMm-e.thicknessMm,r=l?e.heightMm:e.heightMm-e.thicknessMm,d=Number(s)+Number(l),o=e.widthMm-d*e.thicknessMm,a=[...Re(e,n,r),P(e,"bottom","Bottom panel",1,o,e.depthMm),P(e,"front_rail","Front plank",1,i,m.baseRailHeightMm),P(e,"back_rail","Back plank",1,i,m.baseRailHeightMm)];if(e.shelfCount>0&&a.push(P(e,"shelf","Shelf",e.shelfCount,i,e.depthMm)),!t){const c=Me({widthMm:e.widthMm,isDrawers:!1});for(const h of c)for(let u=0;u<h.count;u++){const M=h.count===2?` ${u===0?"левый":"правый"}`:"";a.push(P(e,"facade",`Фасад${M}`,1,h.widthMm,e.heightMm-m.facadeGapMm))}}return a}function Re(e,t,i){return t===i?[P(e,"side","Side panel",2,t,e.depthMm)]:[P(e,"side","Left side panel",1,t,e.depthMm),P(e,"side","Right side panel",1,i,e.depthMm)]}function P(e,t,i,s,l,n){return{name:i,kind:t,quantity:s,widthMm:l,depthMm:n,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:ne(t),textureDirection:le(t)}}function Fe(e){return e.userHoodCabinetHeightMm!==void 0?e.userHoodCabinetHeightMm:e.isHoodCabinet&&e.cooktopType==="gas"?e.wallCabinetHeightMm+e.backsplashHeightMm-m.gasCooktopHoodDistanceMm:e.wallCabinetHeightMm}function Ge(e){var h,u,M,p;const t=e.material??"ldsp",i=e.thicknessMm??m.ldspThicknessMm,s=!!e.input.hasBuiltInMicrowave,l=!!e.input.isHoodCabinet,n=Ne(e.input.type,l,s),r=Fe({userHoodCabinetHeightMm:(h=e.input.overrides)==null?void 0:h.heightMm,isHoodCabinet:l,cooktopType:e.cooktopType,wallCabinetHeightMm:e.defaultHeightMm,backsplashHeightMm:e.backsplashHeightMm}),d=Be({userDepthMm:(u=e.input.overrides)==null?void 0:u.depthMm,hasBuiltInMicrowave:s,defaultDepthMm:e.defaultDepthMm}),o=!!e.input.hasRecessedLighting,a=Se({heightMm:r,hasRecessedLighting:o}),c=e.input.shelfCount??e.defaultShelfCount??m.shelfCount;return{id:e.id,type:n,widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,hasRecessedLighting:o,hasBuiltInMicrowave:s,isHoodCabinet:l,vitrine:e.input.vitrine,construction:a,parts:Ae({widthMm:e.input.widthMm,heightMm:r,depthMm:d,material:t,thicknessMm:i,shelfCount:c,construction:a,edgeBandingOverrides:(M=e.input.overrides)==null?void 0:M.edgeBanding,textureDirectionOverrides:(p=e.input.overrides)==null?void 0:p.textureDirection})}}function Ne(e,t,i){return e||(t?"hood":i?"built_in_microwave":"standard")}function Ae(e){var n,r;const t=e.heightMm-(e.construction.topFullWidth?e.thicknessMm:0)-(e.construction.bottomFullWidth?e.thicknessMm:0),i=e.widthMm-2*e.thicknessMm,s=[Z(e,"side","Side panel",2,t),Z(e,"top","Top panel",1,e.construction.topFullWidth?e.widthMm:i),Z(e,"bottom","Bottom panel",1,e.construction.bottomFullWidth?e.widthMm:i)];e.shelfCount>0&&s.push(Z(e,"shelf","Shelf",e.shelfCount,i));const l=Me({widthMm:e.widthMm});for(const d of l)for(let o=0;o<d.count;o++){const a=d.count===2?` ${o===0?"левый":"правый"}`:"";s.push({name:`Фасад${a}`,kind:"facade",quantity:1,widthMm:d.widthMm,depthMm:e.heightMm-m.facadeGapMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n.facade)??ne("facade"),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r.facade)??le("facade")})}return s}function Z(e,t,i,s,l){var n,r;return{name:i,kind:t,quantity:s,widthMm:l,depthMm:e.depthMm,material:e.material,thicknessMm:e.thicknessMm,edgeBanding:((n=e.edgeBandingOverrides)==null?void 0:n[t])??ne(t),textureDirection:((r=e.textureDirectionOverrides)==null?void 0:r[t])??le(t)}}const qe=["backsplashHeightMm","countertopUpstand","baseTotalHeightMm","baseLegHeightMm","countertopThicknessMm","baseCabinetDefaultHeightMm","baseCabinetDefaultDepthMm","countertop.depthMm","wallCabinetDefaultHeightMm","wallCabinetDefaultDepthMm","baseCabinets[].heightMm","baseCabinets[].depthMm","wallCabinets[].heightMm","wallCabinets[].depthMm","wallCabinets[].edgeBanding","wallCabinets[].textureDirection","manualBaseCabinets","manualWallCabinets"];function de(e){var w;if(e.layoutType!=="straight")throw new Error("Only straight kitchen layout is supported in this MVP.");const t=[],i=[],s=ke({userBacksplashHeightMm:e.backsplashHeightMm,backsplashType:e.backsplashType});t.push({code:"backsplash-height",message:`Высота фартука определена как ${s} мм.`});const l=$e({userCountertopUpstand:e.countertopUpstand,backsplashType:e.backsplashType});t.push({code:"countertop-upstand",message:`Бортик у столешницы: ${l?"да":"нет"}.`});const n=_e({userBaseTotalHeightMm:e.baseTotalHeightMm,hasGolaProfile:e.hasGolaProfile,hasDishwasher:e.hasDishwasher}),r=e.baseLegHeightMm??m.baseLegHeightMm,d=e.countertopThicknessMm??m.countertopThicknessMm,o=He({baseTotalHeightMm:n,legHeightMm:r,countertopThicknessMm:d}),a=e.baseCabinetDepthMm??m.baseCabinetDepthMm,c={lengthMm:e.wallLengthMm,depthMm:e.countertopDepthMm??m.countertopDepthMm,thicknessMm:d};t.push({code:"lower-module-height",message:`Высота корпуса нижнего модуля: ${o} мм.`}),t.push({code:"countertop",message:`Столешница: ${c.lengthMm}x${c.depthMm}x${c.thicknessMm} мм.`});const h=Ee({manualWallCabinetHeightMm:e.wallCabinetDefaultHeightMm,roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,apronHeightMm:s,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm}),u=Ue({roomHeightMm:e.ceilingHeightMm,baseTotalHeightMm:n,backsplashHeightMm:s,wallCabinetHeightMm:h,hasManualWallCabinetHeight:e.wallCabinetDefaultHeightMm!==void 0,roomHeightIncludesStretchCeiling:e.roomHeightIncludesStretchCeiling,stretchCeilingPlanned:e.stretchCeilingPlanned,ceilingFillerMm:e.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingReserveMm,ceilingGapMm:e.ceilingGapMm});u.type==="filler"?t.push({code:"ceiling-filler",message:`Добор до потолка: ${u.sizeMm} мм.`}):u.type==="gap"&&t.push({code:"ceiling-gap",message:`Зазор до потолка: ${u.sizeMm} мм.`});const M=!!e.hasBuiltInMicrowave||!!((w=e.manualWallCabinets)!=null&&w.some(v=>v.hasBuiltInMicrowave)),p=e.wallCabinetDefaultDepthMm??(M?m.wallCabinetDepthWithBuiltInMicrowaveMm:m.wallCabinetDepthMm),f=ze(e,i,t),_=(e.manualBaseCabinets??f.baseCabinets).map((v,S)=>xe({id:`lower-${S+1}`,input:v,defaultHeightMm:o,defaultDepthMm:a,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount})),L=e.manualWallCabinets??f.wallCabinets,x=e.cooktopType??"none",$=L.map((v,S)=>Ge({id:`upper-${S+1}`,input:v,defaultHeightMm:h,defaultDepthMm:p,backsplashHeightMm:s,cooktopType:x,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,defaultShelfCount:e.shelfCount??m.shelfCount}));for(const v of _)v.heightMm<=0&&i.push(`Lower module ${v.id} has non-positive height ${v.heightMm} mm.`),v.widthMm<=2*v.thicknessMm&&i.push(`Lower module ${v.id} width must be greater than twice material thickness.`);for(const v of $)v.heightMm<=0&&i.push(`Upper cabinet ${v.id} has non-positive height ${v.heightMm} mm.`),v.widthMm<=2*v.thicknessMm&&i.push(`Upper cabinet ${v.id} width must be greater than twice material thickness.`);return{layoutType:"straight",wallLengthMm:e.wallLengthMm,ceilingHeightMm:e.ceilingHeightMm,backsplashType:e.backsplashType,backsplashHeightMm:s,countertopUpstand:l,cooktopType:x,baseTotalHeightMm:n,baseLegHeightMm:r,countertopThicknessMm:d,baseCabinetDefaultHeightMm:o,baseCabinetDefaultDepthMm:a,countertop:c,wallCabinetDefaultHeightMm:h,wallCabinetDefaultDepthMm:p,ceilingFillerMm:u.type==="filler"?u.sizeMm:void 0,stretchCeilingReserveMm:u.stretchCeilingReserveMm,ceilingGapMm:u.type==="gap"?u.sizeMm:void 0,ceilingCompletionType:u.type,ceilingCompletionMm:u.sizeMm,material:e.material??"ldsp",thicknessMm:e.thicknessMm??m.ldspThicknessMm,facadeMaterial:e.facadeMaterial??m.defaultFacadeMaterial,facadeThicknessMm:e.facadeThicknessMm??m.defaultFacadeThicknessMm,shelfCount:e.shelfCount??m.shelfCount,baseCabinets:_,wallCabinets:$,appliedRules:t,warnings:i,unresolvedWidthMm:f.unresolvedWidthMm,remainderResolution:f.remainderResolution,fillerWidthMm:f.fillerWidthMm,editableParameters:qe}}function ze(e,t,i){const s=e.autoModuleWidthMm??m.autoModuleWidthMm,l=Math.floor(e.wallLengthMm/s),n=e.wallLengthMm-l*s,r=e.hasSinkCabinet??!0,d=e.hasDishDryerCabinet??r,o=e.cooktopType??"none",a=o!=="none"&&o!=="stove_gas"&&o!=="stove_electric",c=o==="stove_gas"||o==="stove_electric",h=e.hasDishwasher??!1,u=e.hasDrawersCabinet??!1;let M=l,p,f,T;const _=e.remainderMode??"auto";if(n===0)p=Array.from({length:l},()=>s),f="none";else if(_==="filler")p=Array.from({length:l},()=>s),f="none",T=n,i.push({code:"smart-remainder-filler",message:`Остаток стены ${n} мм оставлен как добор (пользовательский выбор).`});else if(_==="distribute"||_==="auto"&&n<m.minRemainderForExtraModuleMm){const b=Math.floor(n/l),g=n-b*l;p=Array.from({length:l},(W,B)=>s+b+(B<g?1:0)),f="distribute",new Set(p).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${p[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${p.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${p.join(", ")} мм.`))}else if(_==="extra_module"||_==="auto"&&n>=m.minRemainderForExtraModuleMm)M=l+1,p=Array.from({length:l},()=>s),p.push(n),f="extra_module",i.push({code:"smart-remainder-extra-module",message:`Остаток стены ${n} мм ≥ ${m.minRemainderForExtraModuleMm} мм: создан дополнительный модуль шириной ${n} мм. Всего модулей: ${M}.`}),n<s*.5&&t.push(`Дополнительный модуль узкий (${n} мм). При необходимости настройте ширину модуля вручную.`);else{const b=Math.floor(n/l),g=n-b*l;p=Array.from({length:l},(W,B)=>s+b+(B<g?1:0)),f="distribute",new Set(p).size<=1?i.push({code:"smart-remainder-distribute-equal",message:`Остаток стены ${n} мм равномерно распределён: все ${l} модулей расширены до ${p[0]} мм.`}):(i.push({code:"smart-remainder-distribute-uneven",message:`Остаток стены ${n} мм распределён: ширина модулей (мм): ${p.join(", ")}.`}),t.push(`Остаток ${n} мм распределён. Модули имеют разную ширину: ${p.join(", ")} мм.`))}let L;e.moduleTypes&&e.moduleTypes.length===M?(L=[...e.moduleTypes],i.push({code:"module-types-custom",message:`Типы модулей заданы пользователем: ${e.moduleTypes.join(" → ")}.`})):L=Array.from({length:M},(b,g)=>Oe(g,{hasSinkCabinet:r,hasCooktopCabinet:a,hasStoveCabinet:c,hasDishwasherCabinet:h,hasDrawersCabinet:u}));const x=e.fillDirection??"left-to-right";if(x==="right-to-left")L.reverse();else if(x==="center-out"){const b=Math.floor(M/2),g=[];for(let D=0;D<M;D++){const W=D%2===0?Math.ceil(D/2):-Math.ceil(D/2),B=b+W;B>=0&&B<M&&g.push(L[B])}L=g}const $=L.findIndex(b=>b==="cooktop"||b==="stove"),w=$>=0?$:2,v=Array.from({length:M},(b,g)=>({widthMm:p[g],shelfCount:e.shelfCount,type:L[g]})),S=Array.from({length:M},(b,g)=>({widthMm:p[g],shelfCount:e.shelfCount,hasRecessedLighting:e.hasRecessedLighting,isHoodCabinet:e.hasHoodCabinet&&g===w,hasBuiltInMicrowave:e.hasBuiltInMicrowave&&g===3,type:d&&g===0?"dish_dryer":void 0}));return e.hasHoodCabinet&&w>=M&&t.push("Запрошен шкаф под вытяжку, но модуль с варочной панелью/плитой не найден."),e.hasBuiltInMicrowave&&M<4&&t.push("Запрошена встроенная микроволновка, но в автоматическом плане нет четвёртого модуля."),i.push({code:"auto-module-plan",message:`Созданы автоматические модули кухни: нижних ${M} шт., навесных ${M} шт.`}),{baseCabinets:v,wallCabinets:S,unresolvedWidthMm:n,remainderResolution:f,fillerWidthMm:T}}function Oe(e,t){return t.hasSinkCabinet&&e===0?"sink":t.hasDishwasherCabinet&&e===1?"dishwasher":(t.hasCooktopCabinet||t.hasStoveCabinet)&&e===2?t.hasStoveCabinet?"stove":"cooktop":t.hasDrawersCabinet&&e===3?"drawers":"standard"}function Ue(e){if(e.roomHeightMm===void 0)return{};const t=e.stretchCeilingPlanned?e.stretchCeilingReserveMm??m.stretchCeilingReserveMm:0,s=e.roomHeightMm-t-e.baseTotalHeightMm-e.backsplashHeightMm-e.wallCabinetHeightMm;return e.hasManualWallCabinetHeight?{type:e.roomHeightIncludesStretchCeiling===!1&&!e.stretchCeilingPlanned?"gap":"filler",sizeMm:Math.max(0,s),stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling||e.stretchCeilingPlanned?{type:"filler",sizeMm:e.ceilingFillerMm??m.ceilingFillerMm,stretchCeilingReserveMm:e.stretchCeilingPlanned?t:void 0}:e.roomHeightIncludesStretchCeiling===!1?{type:"gap",sizeMm:e.ceilingGapMm??m.ceilingGapMm}:{}}const Ve={client_tile_existing:"Плитка клиента (уже есть)",client_tile_planned:"Плитка клиента (планируется)",our_ldsp_backsplash:"Наш фартук ЛДСП",custom:"Своя высота"},Ye={none:"Нет",electric:"Электрическая",gas:"Газовая",stove_electric:"Электрическая плита",stove_gas:"Газовая плита"},Xe={ldsp:"ЛДСП",mdf_plastic:"МДФ пластик",mdf_film:"МДФ плёнка",mdf_agt_film:"МДФ AGT (плёнка под пластик)",mdf_enamel:"МДФ эмаль (крашеный)"},ce={side:"Боковина",top:"Крышка",bottom:"Дно",shelf:"Полка",front_rail:"Планка передняя",back_rail:"Планка задняя",facade:"Фасад",drawer_side:"Боковина ящика",drawer_front:"Передняя стенка ящика",drawer_back:"Задняя стенка ящика",drawer_bottom:"Дно ящика"},he={ldsp:"ЛДСП",mdf:"МДФ",hdf:"ХДФ"},Ke={ball_bearing_guides:"Шариковые направляющие",undermount_guides:"Направляющие скрытого монтажа",tandembox:"Tandembox"};function Je(e){return e?"Да":"Нет"}function Qe(e){const t=e.lengthMm!==void 0?` ${e.lengthMm} мм`:"";return`${e.name}${t}: ${e.quantity} компл.`}function ie(e){return{sink:"Мойка",dishwasher:"ПММ",cooktop:"Вароч.",drawers:"Ящики",standard:"Станд.",dish_dryer:"Сушка",hood:"Вытяжка",built_in_microwave:"СВЧ"}[e]??e}function Ze(e,t,i,s){e.innerHTML="";let l={};try{l=JSON.parse(localStorage.getItem("kitchen-module-overrides")||"{}")}catch{}if(t.length>0){const n=me("🪑 Нижние модули",t.length),r=n.querySelector(".cabinets-list");t.forEach((d,o)=>{const a=l[d.id],c=ue((a==null?void 0:a.customName)||`Нижний модуль ${o+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,d.drawers,"lower",o,s,a==null?void 0:a.customName);r.appendChild(c)}),e.appendChild(n)}if(i.length>0){const n=me("🗄 Навесные шкафы",i.length),r=n.querySelector(".cabinets-list");i.forEach((d,o)=>{const a=l[d.id];r.appendChild(ue((a==null?void 0:a.customName)||`Навесной шкаф ${o+1}`,d.type,d.widthMm,d.heightMm,d.depthMm,d.parts,[],"upper",o,s,a==null?void 0:a.customName))}),e.appendChild(n)}}function me(e,t){const i=document.createElement("div");return i.className="module-section",i.innerHTML=`<h3>${e} (${t})</h3><div class="cabinets-list"></div>`,i}function ue(e,t,i,s,l,n,r,d,o,a,c){const h=document.createElement("div");h.className="cabinet-card";const u=c||et(t),M=`cabinet-${d}-${o}`;h.id=M;function p(){return""}let f=null;function T(w){return w&&f?`
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
            ${a?'<button class="btn-edit btn-edit--inline" title="Изменить размеры" data-edit-btn>✏️</button>':""}
          </div>
          <div class="cabinet-card__dimensions">
            ${i}×${s}×${l} мм
            ${a?'<span class="edit-hint">нажмите ✏️ для правки</span>':""}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.375rem;">
          ${p()}
          <span class="cabinet-card__toggle">▼</span>
        </div>
      </div>
    `}h.innerHTML=T(!1);const _=document.createElement("div");_.className="cabinet-card__body",_.innerHTML=je(n,r),h.appendChild(_);const L=h.querySelector(".cabinet-card__header"),x=h.querySelector(".cabinet-card__toggle");L.addEventListener("click",w=>{const v=w.target;v.closest(".btn-edit")||v.closest(".edit-dim")||v.closest(".cabinet-edit-fields")||v.closest(".btn-move")||(_.classList.toggle("open"),x.classList.toggle("open",_.classList.contains("open")))}),L.addEventListener("click",w=>{const v=w.target.closest(".btn-move");if(!v||!(a!=null&&a.onReorder))return;const S=v.dataset.moveLevel,b=parseInt(v.dataset.moveIdx||"",10),g=parseInt(v.dataset.moveDir||"0",10),D=b+g;a.onReorder(S,b,D)});const $=h.querySelector("[data-edit-btn]");return $&&a&&$.addEventListener("click",w=>{w.stopPropagation(),f={w:i,h:s,d:l},h.innerHTML=T(!0),h.appendChild(_);const v=h.querySelector(".btn-edit--save"),S=h.querySelector(".btn-edit--cancel"),b=()=>{const g=h.querySelectorAll(".edit-dim"),D={};return g.forEach(W=>{D[W.dataset.dim||""]=Number(W.value)}),{w:D.w||i,h:D.h||s,d:D.d||l}};v.addEventListener("click",()=>{const g=b();d==="lower"?a.onEditLower(o,{widthMm:g.w!==i?g.w:void 0,heightMm:g.h!==s?g.h:void 0,depthMm:g.d!==l?g.d:void 0}):a.onEditUpper(o,{widthMm:g.w!==i?g.w:void 0,heightMm:g.h!==s?g.h:void 0,depthMm:g.d!==l?g.d:void 0})}),S.addEventListener("click",()=>{f=null,h.innerHTML=T(!1),h.appendChild(_)})}),h}function je(e,t){let i="";return e.length>0?i+=`
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
          ${e.map(s=>{const l=ce[s.kind]||s.name||s.kind,n=he[s.material]||s.material.toUpperCase();return`
            <tr>
              <td>${l}</td>
              <td>${s.quantity}</td>
              <td class="dim-cell">${s.widthMm}×${s.depthMm}</td>
              <td>${n} ${s.thicknessMm} мм</td>
            </tr>`}).join("")}
        </tbody>
      </table>
    `:i+='<p style="color:var(--color-text-secondary);font-size:0.875rem;">Нет деталей</p>',t.length>0&&(i+='<div class="sub-section-title">Ящики</div>',t.forEach((s,l)=>{const n=Ke[s.system]??s.system;i+=`
        <div style="padding:0.5rem;background:var(--color-bg);border-radius:6px;margin-bottom:0.5rem;">
          <div style="font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;">
            Ящик ${l+1} — ${n}
            (фасад ${s.facadeHeightMm} мм)
          </div>
          ${s.warnings.map(r=>`<div style="font-size:0.75rem;color:var(--color-warning);">⚠ ${r}</div>`).join("")}
          <table class="parts-table">
            <thead><tr><th>Деталь</th><th>Кол-во</th><th>Размер (мм)</th><th>Материал</th></tr></thead>
            <tbody>
              ${s.parts.map(r=>{const d=ce[r.kind]||r.kind,o=he[r.material]||r.material.toUpperCase();return`
                <tr>
                  <td>${d}</td>
                  <td>${r.quantity}</td>
                  <td class="dim-cell">${r.widthMm}×${r.depthMm}</td>
                  <td>${o} ${r.thicknessMm} мм</td>
                </tr>`}).join("")}
            </tbody>
          </table>
          ${s.hardware.length>0?`
            <div style="font-size:0.75rem;color:var(--color-text-secondary);margin-top:0.375rem;">
              ${s.hardware.map(r=>Qe(r)).join("; ")}
            </div>
          `:""}
        </div>
      `})),i}function et(e){return{standard:"Обычный",sink:"Под мойку",cooktop:"Под варочную панель",stove:"Под плиту",dishwasher:"Под посудомоечную машину",drawers:"С выкатными ящиками",dish_dryer:"С сушкой",hood:"Под вытяжку",built_in_microwave:"Под встроенную микроволновку"}[e]??e}const pe="kitchen-module-overrides";function tt(){try{return JSON.parse(localStorage.getItem(pe)||"{}")}catch{return{}}}function it(e){localStorage.setItem(pe,JSON.stringify(e))}function ge(e,t,i,s){const l=t.baseCabinets,n=t.wallCabinets,r=Math.max(l.length,n.length),d=tt();let o="",a="";for(let y=0;y<r;y++){const C=n[y],k=l[y],R=(C==null?void 0:C.type)??"standard",A=(k==null?void 0:k.type)??"standard",H=(C==null?void 0:C.id)??"",F=(k==null?void 0:k.id)??"",E=d[H],I=d[F],X=(E==null?void 0:E.customName)||ie(R),K=(I==null?void 0:I.customName)||ie(A),G=E==null?void 0:E.customColor,z=I==null?void 0:I.customColor;o+=fe(H,R,"upper",X,C==null?void 0:C.widthMm,G,E==null?void 0:E.customName,y),a+=fe(F,A,"lower",K,k==null?void 0:k.widthMm,z,I==null?void 0:I.customName,y)}e.innerHTML=`
    <div class="layout-scheme">
      <h3>📋 Схема планировки</h3>
      <div class="scheme-container">
        <div class="scheme-row">
          <span class="scheme-row__label">Верх</span>
          ${o}
          ${t.fillerWidthMm?`<div class="scheme-cell scheme-cell--filler scheme-cell--upper" title="Добор ${t.fillerWidthMm} мм">
            <span class="scheme-cell__type">Добор</span>
            <span class="scheme-cell__width">${t.fillerWidthMm}</span>
          </div>`:""}
        </div>
        <div class="scheme-row">
          <span class="scheme-row__label">Низ</span>
          ${a}
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
    `,document.body.appendChild(c));const h=document.getElementById("modal-title"),u=document.getElementById("modal-name"),M=document.getElementById("modal-width"),p=document.getElementById("modal-height"),f=document.getElementById("modal-depth"),T=document.getElementById("modal-color"),_=document.getElementById("modal-save"),L=document.getElementById("modal-cancel"),x=e.__schemeMouseHandler;x&&x.destroy();let $=null,w=null,v=0,S=0,b=!1,g=!1;function D(){e.querySelectorAll(".scheme-cell-clickable").forEach(y=>{y.style.outline="",y.style.opacity=""}),$=null,w=null,b=!1,g=!1}function W(y,C){const k=document.elementFromPoint(y,C);return k?k.closest(".scheme-cell-clickable"):null}const B={mousedown(y){const C=y.target.closest(".scheme-cell-clickable");C&&y.button===0&&(y.preventDefault(),$=parseInt(C.dataset.index||"",10),w=C.dataset.level,v=y.clientX,S=y.clientY,b=!0,g=!1)},mousemove(y){if(!b||$===null||!w)return;const C=y.clientX-v,k=y.clientY-S,R=Math.sqrt(C*C+k*k);if(R<5)return;g=!0,console.log("🟢 DnD active! dist:",Math.round(R),"from:",w,$);const A=W(y.clientX,y.clientY);e.querySelectorAll(".scheme-cell-clickable").forEach(H=>{H.style.outline=""}),A&&A.dataset.level===w&&(A.style.outline="2px dashed var(--color-primary)"),e.querySelectorAll(".scheme-cell-clickable").forEach(H=>{const F=parseInt(H.dataset.index||"",10),E=H.dataset.level;F===$&&E===w&&(H.style.opacity="0.4")})},mouseup(y){var X,K;if(console.log("🟡 mouseup:","wasDragged:",g,"dragging:",b,"idx:",$,"level:",w),!b||$===null||!w){b=!1;return}if(g){const G=W(y.clientX,y.clientY);if(G&&s){const z=G.dataset.level,O=parseInt(G.dataset.index||"",10);z===w&&O!==$&&s(w,$,O)}D();return}D();const C=y.target.closest(".scheme-cell-clickable");if(!C)return;const k=C.dataset.id||"",R=parseInt(C.dataset.index||"0",10),H=C.dataset.level==="upper"?n[R]:l[R];if(!H)return;const F=d[k]||{};h.textContent=`Редактирование: ${F.customName||ie(H.type)}`,u.value=F.customName||"",M.value=String(H.widthMm),p.value=String(H.heightMm),f.value=String(H.depthMm),T.value=F.customColor||"#6366f1",c.style.display="flex";const E=_.cloneNode(!0),I=L.cloneNode(!0);(X=_.parentNode)==null||X.replaceChild(E,_),(K=L.parentNode)==null||K.replaceChild(I,L),E.addEventListener("click",()=>{const G=u.value.trim(),z=T.value,O=parseInt(M.value,10),ee=parseInt(p.value,10),te=parseInt(f.value,10),J={};G&&(J.customName=G),z&&(J.customColor=z),Object.keys(J).length>0?d[k]={...d[k]||{},...J}:delete d[k],it(d),(O!==H.widthMm||ee!==H.heightMm||te!==H.depthMm)&&i?i(k,{widthMm:O!==H.widthMm?O:void 0,heightMm:ee!==H.heightMm?ee:void 0,depthMm:te!==H.depthMm?te:void 0}):ge(e,t,i,s),c.style.display="none"}),I.addEventListener("click",()=>{c.style.display="none"})}};e.addEventListener("mousedown",B.mousedown),e.addEventListener("mousemove",B.mousemove),e.addEventListener("mouseup",B.mouseup),e.addEventListener("mouseleave",()=>{b&&D()}),e.__schemeMouseHandler={destroy:()=>{e.removeEventListener("mousedown",B.mousedown),e.removeEventListener("mousemove",B.mousemove),e.removeEventListener("mouseup",B.mouseup)}}}function fe(e,t,i,s,l,n,r,d){const o=n?`background:${n};`:"";return`
    <div class="scheme-cell scheme-cell--${t} scheme-cell--${i} ${e?"scheme-cell-clickable":""}"
         style="${o}"
         data-id="${e}"
         data-level="${i}"
         data-type="${t}"
         data-index="${d??""}"
         title="${s} ${l??""} мм${e?" — клик: редактировать, зажать и перетащить: поменять местами":""}">
      <span class="scheme-cell__type">${s}</span>
      ${l!==void 0?`<span class="scheme-cell__width">${l}</span>`:""}
    </div>
  `}function st(e,t,i){const s=t.length>0,l=i.length>0;if(!s&&!l){e.innerHTML="";return}let n='<div class="rules-log">';s&&(n+='<h3>✓ Применённые правила</h3><div class="rules-log__list">',n+=t.map(r=>`
      <div class="rule-item rule-item--applied">
        <span class="rule-item__icon">✓</span>
        <span>${r.message}</span>
      </div>
    `).join(""),n+="</div>"),l&&(n+='<h3 style="margin-top:1rem;">⚠ Предупреждения</h3><div class="rules-log__list">',n+=i.map(r=>`
      <div class="rule-item rule-item--warning">
        <span class="rule-item__icon">⚠</span>
        <span>${r}</span>
      </div>
    `).join(""),n+="</div>"),n+="</div>",e.innerHTML=n}function nt(e,t,i){if(e.innerHTML="",i){const o=document.createElement("div");o.style.cssText="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;padding:0.5rem 0.75rem;background:var(--color-primary-light);border-radius:var(--radius-md);border:1px solid var(--color-primary);",o.innerHTML=`
      <span style="font-size:0.8125rem;">
        💡 Нажмите <strong>✏️</strong> на модуле, чтобы изменить его размеры вручную
      </span>
      <button class="btn-secondary" id="reset-manual-btn" style="font-size:0.8125rem;padding:0.375rem 0.75rem;">
        ↻ Сбросить ручные правки
      </button>
    `,e.appendChild(o),o.querySelector("#reset-manual-btn").addEventListener("click",()=>{i.onResetManual()})}const s=document.createElement("div");s.className="summary-bar",s.innerHTML=`
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
      <span class="summary-item__value">${lt(t.backsplashType)}</span>
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
      <span class="summary-item__value">${Je(t.countertopUpstand)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Фасады</span>
      <span class="summary-item__value">${Xe[t.facadeMaterial]??t.facadeMaterial} ${t.facadeThicknessMm} мм</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Варочная панель</span>
      <span class="summary-item__value">${Ye[t.cooktopType]??t.cooktopType}</span>
    </div>
    <div class="summary-item">
      <span class="summary-item__label">Модулей (низ/верх)</span>
      <span class="summary-item__value ${t.warnings.length>0?"summary-item__value--warning":""}">
        ${t.baseCabinets.length} / ${t.wallCabinets.length}
      </span>
    </div>
  `,e.appendChild(s);const l=document.createElement("div");e.appendChild(l);const n=i;ge(l,t,(o,a)=>{if(!n)return;const c=o.match(/^(lower|upper)-(\d+)$/);if(!c)return;const h=c[1],u=parseInt(c[2],10)-1;h==="lower"?n.onEditLower(u,a):n.onEditUpper(u,a)},n!=null&&n.onReorder?(o,a,c)=>n.onReorder(o,a,c):void 0);const r=document.createElement("div");e.appendChild(r),Ze(r,t.baseCabinets,t.wallCabinets,i);const d=document.createElement("div");e.appendChild(d),st(d,t.appliedRules,t.warnings)}function lt(e){return e?Ve[e]??e:"—"}class ot{constructor(t,i){N(this,"formContainer");N(this,"resultsContainer");N(this,"lowerEdits",{});N(this,"upperEdits",{});N(this,"lastAutoInput",null);N(this,"lastAutoProject",null);N(this,"currentProject",null);this.formContainer=t,this.resultsContainer=i}run(){this.calculate()}calculate(){try{const t=we();this.lastAutoInput=t;const i=t.wallLengthMm??3e3,s=de({...t,manualBaseCabinets:void 0,manualWallCabinets:void 0});this.lastAutoProject=s;const l=s.baseCabinets.length,n=s.wallCabinets.length,r=this.buildManualBasePlan(s,l,i),d=this.buildManualWallPlan(s,n,i);(Object.keys(this.lowerEdits).length>0||Object.keys(this.upperEdits).length>0)&&(t.manualBaseCabinets=r,t.manualWallCabinets=d);const o=de(t);this.currentProject=o;const a={onEditLower:(c,h)=>this.applyLowerEdit(c,h),onEditUpper:(c,h)=>this.applyUpperEdit(c,h),onResetManual:()=>this.resetManual(),onReorder:(c,h,u)=>this.reorderModules(c,h,u)};nt(this.resultsContainer,o,a)}catch(t){this.resultsContainer.innerHTML=`
        <div class="rules-log">
          <h3>❌ Ошибка расчёта</h3>
          <div class="rule-item rule-item--error">
            <span class="rule-item__icon">✕</span>
            <span>${t instanceof Error?t.message:String(t)}</span>
          </div>
        </div>
      `}}buildManualBasePlan(t,i,s){const l=[],n=Object.values(this.lowerEdits).some(o=>o.widthMm!==void 0);for(let o=0;o<i;o++){const a=this.lowerEdits[o];(a==null?void 0:a.widthMm)!==void 0?l[o]=a.widthMm:l[o]=null}let r;if(n){const o=l.reduce((f,T)=>f+(T??0),0),a=l.filter(f=>f!==null).length,c=i-a,h=Math.max(0,s-o),u=c>0?Math.floor(h/c):0,M=h-u*c;r=[];let p=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(p<M?1:0),p++)}else r=t.baseCabinets.map(o=>o.widthMm);const d=[];for(let o=0;o<i;o++){const a=t.baseCabinets[o],c=this.lowerEdits[o],h={type:a.type,widthMm:r[o],shelfCount:a.shelfCount,facadeSide:a.facadeSide},u=a.drawers[0];u&&(h.drawerSystem=u.system,h.drawerCount=a.drawers.length,h.drawerFacadeHeightMm=u.facadeHeightMm);const M=(c==null?void 0:c.heightMm)!==void 0,p=(c==null?void 0:c.depthMm)!==void 0;(M||p)&&(h.overrides={},M&&(h.overrides.heightMm=c.heightMm),p&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}buildManualWallPlan(t,i,s){const l=[],n=Object.values(this.upperEdits).some(o=>o.widthMm!==void 0);for(let o=0;o<i;o++){const a=this.upperEdits[o];l[o]=(a==null?void 0:a.widthMm)??null}let r;if(n){const o=l.reduce((f,T)=>f+(T??0),0),a=l.filter(f=>f!==null).length,c=i-a,h=Math.max(0,s-o),u=c>0?Math.floor(h/c):0,M=h-u*c;r=[];let p=0;for(let f=0;f<i;f++)l[f]!==null?r[f]=l[f]:(r[f]=u+(p<M?1:0),p++)}else r=t.wallCabinets.map(o=>o.widthMm);const d=[];for(let o=0;o<i;o++){const a=t.wallCabinets[o],c=this.upperEdits[o],h={type:a.type,widthMm:r[o],shelfCount:a.shelfCount,hasRecessedLighting:a.hasRecessedLighting,hasBuiltInMicrowave:a.hasBuiltInMicrowave,isHoodCabinet:a.isHoodCabinet,vitrine:a.vitrine},u=(c==null?void 0:c.heightMm)!==void 0,M=(c==null?void 0:c.depthMm)!==void 0;(u||M)&&(h.overrides={},u&&(h.overrides.heightMm=c.heightMm),M&&(h.overrides.depthMm=c.depthMm)),d.push(h)}return d}applyLowerEdit(t,i){if(!this.lastAutoProject)return;const s={...this.lowerEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.lowerEdits[t]=s,this.calculate()}applyUpperEdit(t,i){if(!this.lastAutoProject)return;const s={...this.upperEdits[t]??{}};i.widthMm!==void 0&&(s.widthMm=i.widthMm),i.heightMm!==void 0&&(s.heightMm=i.heightMm),i.depthMm!==void 0&&(s.depthMm=i.depthMm),this.upperEdits[t]=s,this.calculate()}resetManual(){this.lowerEdits={},this.upperEdits={},this.calculate()}reorderModules(t,i,s){var c,h;const l=t==="lower"?this.lowerEdits:this.upperEdits,n=t==="lower"?((c=this.lastAutoProject)==null?void 0:c.baseCabinets.length)??0:((h=this.lastAutoProject)==null?void 0:h.wallCabinets.length)??0;Object.keys(l).map(Number).sort((u,M)=>u-M);const r=[];for(let u=0;u<n;u++)r.push({index:u,edit:l[u]??null});const d=r[i],o=r[s];d&&o&&(r[i]=o,r[s]=d);const a={};for(const u of r)u.edit&&(a[u.index]=u.edit);t==="lower"?this.lowerEdits=a:this.upperEdits=a,this.calculate()}}function at(){const e=document.getElementById("form-container"),t=document.getElementById("results-container");if(!e||!t){console.error("Required containers not found");return}const i=new ot(e,t);Ce(e,()=>{i.calculate()}),i.run()}document.addEventListener("DOMContentLoaded",at);
