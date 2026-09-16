'use strict';

/* ---------- data ---------- */

const RECIPES = [
  { id: 'r1', name: 'Lattifere in produzione', sp: 'cow', species: 'Bovine da latte',
    base: [['Mais macinato',42],['Orzo',18],['Farina di soia 44',15],['Crusca di frumento',10],['Polpe di bietola',8],['Carbonato di calcio',4],['Sale',1.5],['Bicarbonato di sodio',1.5]],
    fixed: [['Nucleo vitaminico-minerale',5],['Lievito vivo',1.5]] },
  { id: 'r2', name: 'Finissaggio vitelloni', sp: 'beef', species: 'Bovini da carne',
    base: [['Mais farina',48],['Orzo',20],['Farina di girasole',12],['Crusca di frumento',9],['Melasso',5],['Carbonato di calcio',4],['Sale',2]],
    fixed: [['Nucleo minerale bovini',6]] },
  { id: 'r3', name: 'Ingrasso fase 2', sp: 'pig', species: 'Suini',
    base: [['Mais macinato',55],['Farina di soia 44',17],['Orzo',14],['Crusca di frumento',8],['Olio di soia',2],['Carbonato di calcio',2],['Fosfato bicalcico',1.4],['Sale',0.6]],
    fixed: [['Nucleo suini',4],['Lisina',2.5]] },
  { id: 'r4', name: 'Deposizione ovaiole', sp: 'hen', species: 'Avicoli',
    base: [['Mais macinato',52],['Farina di soia 44',22],['Carbonato di calcio grosso',9],['Crusca di frumento',7],['Orzo',6],['Olio vegetale',2],['Fosfato bicalcico',1.4],['Sale',0.6]],
    fixed: [['Nucleo ovaiole',3.5]] },
  { id: 'r5', name: 'Asciutta pecore', sp: 'sheep', species: 'Ovini',
    base: [['Orzo',40],['Mais macinato',25],['Crusca di frumento',18],['Favino',10],['Carbonato di calcio',4],['Sale',3]],
    fixed: [['Nucleo ovini',4]] },
  { id: 'r6', name: 'Svezzamento suinetti', sp: 'pig', species: 'Suini',
    base: [['Mais fioccato',38],['Orzo fioccato',20],['Farina di soia 44',14],['Siero di latte in polvere',12],['Farina di pesce',6],['Olio di soia',3],['Carbonato di calcio',2.5],['Fosfato bicalcico',2],['Sale',0.5]],
    fixed: [['Nucleo svezzamento',5],['Acidificante',3]] },
];

const SPECIES = [
  { key: 'cow', label: 'Bovine da latte', code: 'BL' },
  { key: 'beef', label: 'Bovini da carne', code: 'BC' },
  { key: 'pig', label: 'Suini', code: 'SU' },
  { key: 'hen', label: 'Avicoli', code: 'AV' },
  { key: 'sheep', label: 'Ovini', code: 'OV' },
];
const codeOf = k => (SPECIES.find(s => s.key === k) || { code: '—' }).code;

const SPECIES_ICON_FILE = { cow: 'cow.png', beef: 'cow.png', pig: 'pig.png', hen: 'hen.png', sheep: 'sheep.png' };
function speciesIcon(key, size) {
  const file = SPECIES_ICON_FILE[key];
  if (!file) return '';
  const s = size || 16;
  const url = `icons/species/${file}`;
  const style = [
    'display:block', 'flex:none', `width:${s}px`, `height:${s}px`, 'background-color:currentColor',
    `-webkit-mask-image:url(${url})`, `mask-image:url(${url})`,
    '-webkit-mask-repeat:no-repeat', 'mask-repeat:no-repeat',
    '-webkit-mask-position:center', 'mask-position:center',
    '-webkit-mask-size:contain', 'mask-size:contain',
  ].join(';');
  return `<span role="img" aria-label="${escapeHtml(key)}" style="${style}"></span>`;
}

const FILE_ICON_PATHS = {
  export: '<path d="M12 3v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M5 16.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.5"/>',
  import: '<path d="M12 15V4"/><path d="M7.5 7.5 12 3l4.5 4.5"/><path d="M5 16.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2.5"/>',
};
function fileIcon(kind, size) {
  const inner = FILE_ICON_PATHS[kind];
  if (!inner) return '';
  const s = size || 16;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none" aria-hidden="true">${inner}</svg>`;
}

function editIcon(size) {
  const s = size || 16;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none" aria-hidden="true"><path d="M4 20l4.6-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z"/><path d="M12.5 6.5l3 3"/></svg>`;
}

function warnTriangle(size) {
  const s = size || 12;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1.5px" aria-hidden="true"><path d="M10.5 3.9 2 19h20L13.5 3.9a2 2 0 0 0-3 0Z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/></svg>`;
}

const THEME_ICON_PATHS = {
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
};
function themeIcon(name, size) {
  const inner = THEME_ICON_PATHS[name];
  const s = size || 18;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const TAB_ICON_PATHS = {
  razioni: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  produzione: '<path d="M4.5 15.5a7.5 7.5 0 0 1 15 0"/><path d="M12 15.5l4-5.2"/><circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none"/>',
};
function tabIcon(name, size) {
  const inner = TAB_ICON_PATHS[name];
  if (!inner) return '';
  const s = size || 22;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const SETTINGS = { showCumulative: true, showPercent: true, roundTo: 1, defaultUnit: 'kg' };
const STORAGE_KEY = 'miscele-pwa:recipes:v1';

function num(v) { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }
function fmt(n, d) {
  const dd = d === undefined ? 0 : d;
  return n.toLocaleString('it-IT', { minimumFractionDigits: dd, maximumFractionDigits: dd });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function defaultRecipes() {
  return RECIPES.map(r => ({
    id: r.id, name: r.name, sp: r.sp, species: r.species,
    base: r.base.map(b => ({ name: b[0], pct: String(b[1]).replace('.', ',') })),
    fixed: r.fixed.map(f => ({ name: f[0], qty: String(f[1]).replace('.', ',') })),
  }));
}

function readStoredRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || !arr.length) return null;
    return arr;
  } catch (e) { return null; }
}

/* ---------- theme ---------- */

const THEME_KEY = 'miscele-pwa:theme';
function readTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#F3F5F0' : '#0E100E');
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

/* ---------- state ---------- */

let state = {
  tab: 'razioni', // 'razioni' | 'produzione'
  filter: 'Tutte',
  recipes: readStoredRecipes() || defaultRecipes(),
  theme: readTheme(),

  razioniId: null,      // set => showing the read-only view (or editor) for this recipe
  razioniMode: 'view',  // 'view' | 'edit'
  confirmingDelete: false,

  prodId: null,          // set => showing an active production/weighing session for this recipe
  mode: 'total',
  amountTotal: '2000',
  amountLimit: '600',
  limitIdx: 0,
  unit: null,
};

let deleteConfirmTimer = null;

function setState(patch) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = Object.assign({}, state, p);
  if (p.recipes) persistLocal(state.recipes);
  render();
}

function curRazioni() {
  return state.recipes.find(r => r.id === state.razioniId) || state.recipes[0];
}
function curProd() {
  return state.recipes.find(r => r.id === state.prodId) || state.recipes[0];
}
function updateRazioni(fn) {
  setState(s => ({ recipes: s.recipes.map(x => x.id !== s.razioniId ? x : fn(x)) }));
}

/* ---------- persistence ---------- */

function persistLocal(recipes) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes)); } catch (e) {}
}

function isValidRecipeShape(r) {
  return !!r && typeof r === 'object' && typeof r.id === 'string' &&
    Array.isArray(r.base) && Array.isArray(r.fixed);
}

function exportData() {
  try {
    const payload = { app: 'miscele-pwa', version: 1, exportedAt: new Date().toISOString(), recipes: state.recipes };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `miscele-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('File esportato ✓');
  } catch (e) {
    showToast('Errore nell’esportazione');
  }
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.style.display = 'none';
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) { input.remove(); return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const arr = Array.isArray(data) ? data : (data && Array.isArray(data.recipes) ? data.recipes : null);
        if (!arr || !arr.length || !arr.every(isValidRecipeShape)) throw new Error('bad shape');
        setState({ recipes: arr, razioniId: null, razioniMode: 'view', prodId: null, filter: 'Tutte' });
        showToast('File importato ✓');
      } catch (e) {
        showToast('File non valido o danneggiato');
      }
      input.remove();
    };
    reader.onerror = () => { showToast('Impossibile leggere il file'); input.remove(); };
    reader.readAsText(file);
  });
  document.body.appendChild(input);
  input.click();
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---------- derived views ---------- */

function computeGallery(filter) {
  const speciesList = ['Tutte'].concat(
    state.recipes.map(x => x.species).filter(s => !!s).filter((s, i, a) => a.indexOf(s) === i)
  );
  const cards = state.recipes.filter(x => filter === 'Tutte' || x.species === filter).map(x => {
    const tot = x.base.reduce((s, b) => s + num(b.pct), 0) || 100;
    return {
      id: x.id, sp: x.sp,
      name: x.name || 'Senza nome', species: x.species || 'Specie da definire',
      count: x.base.length + '+' + x.fixed.length,
      bars: x.base.map(b => ({ w: (num(b.pct) / tot * 100).toFixed(2) + '%' })),
      code: codeOf(x.sp),
    };
  });
  return { speciesList, cards };
}

function computeComposition(r) {
  const sum = r.base.reduce((s, b) => s + num(b.pct), 0);
  const sumOk = Math.abs(sum - 100) < 0.05;
  return { sum, sumOk };
}

function computeSession(r) {
  const st = state, p = SETTINGS;
  const showCum = p.showCumulative !== false;
  const showPct = p.showPercent !== false;
  const roundTo = p.roundTo ? num(p.roundTo) : 1;
  const unit = st.unit || (p.defaultUnit === 'q' ? 'q' : 'kg');
  const div = unit === 'q' ? 100 : 1;
  const dec = unit === 'q' ? 2 : 0;

  const sum = r.base.reduce((s, b) => s + num(b.pct), 0);
  const sumOk = Math.abs(sum - 100) < 0.05;
  const lIdx = Math.min(st.limitIdx, r.base.length - 1);

  let totalKg;
  if (st.mode === 'total') {
    totalKg = num(st.amountTotal) * div;
  } else {
    const pct = num(r.base[lIdx] ? r.base[lIdx].pct : 0);
    totalKg = pct > 0 ? (num(st.amountLimit) * div) / (pct / 100) : 0;
  }
  const round = v => roundTo > 1 ? Math.round(v / roundTo) * roundTo : v;

  let cum = 0;
  const calcRows = [];
  r.base.forEach((b, i) => {
    const kg = round(totalKg * num(b.pct) / 100);
    cum += kg;
    calcRows.push({
      name: b.name, pct: fmt(num(b.pct), num(b.pct) % 1 ? 1 : 0),
      qty: fmt(kg / div, dec), cum: fmt(cum / div, dec),
      hot: st.mode === 'limit' && i === lIdx, fixed: false,
    });
  });
  r.fixed.forEach(f => {
    const kg = totalKg / 1000 * num(f.qty);
    cum += kg;
    calcRows.push({
      name: f.name, pct: '—',
      qty: fmt(kg / div, kg < 10 && unit === 'kg' ? 1 : dec), cum: fmt(cum / div, dec),
      hot: false, fixed: true,
    });
  });

  const batchNote = (st.mode === 'total' ? 'Base ' + fmt(totalKg) + ' kg + aggiunte' : 'Miscela risultante ' + fmt(totalKg) + ' kg')
    + (roundTo > 1 ? ' · arrot. ' + fmt(roundTo) + ' kg' : '');

  return { unit, showCum, showPct, sum, sumOk, lIdx, calcRows, grandTotal: fmt(cum / div, dec), batchNote };
}

/* ---------- rendering ---------- */

const app = document.getElementById('app');

function render() {
  let screenHtml;
  if (state.tab === 'razioni') {
    screenHtml = state.razioniId
      ? (state.razioniMode === 'edit' ? renderRazioniEdit() : renderRazioniView())
      : renderRazioniList();
  } else {
    screenHtml = state.prodId ? renderProdSession() : renderProdList();
  }
  app.innerHTML = `<div class="app-frame"><div class="screen-area">${screenHtml}</div></div>`;
}

function renderTabPills() {
  return `
  <div class="tab-pills">
    <button class="tab-pill ${state.tab === 'produzione' ? 'active' : ''}" data-action="switch-tab" data-value="produzione">
      ${tabIcon('produzione', 16)}<span>Produzione</span>
    </button>
    <button class="tab-pill ${state.tab === 'razioni' ? 'active' : ''}" data-action="switch-tab" data-value="razioni">
      ${tabIcon('razioni', 16)}<span>Razioni</span>
    </button>
  </div>`;
}

function renderFilters(g) {
  return `
  <div class="filters">
    ${g.speciesList.map(s => {
      const spec = SPECIES.find(x => x.label === s);
      return `<button class="chip ${state.filter === s ? 'active' : ''}" data-action="filter" data-value="${escapeHtml(s)}">${spec ? speciesIcon(spec.key, 13) : ''}<span>${escapeHtml(s)}</span></button>`;
    }).join('')}
  </div>`;
}

function renderCards(g, openAction) {
  if (!g.cards.length) return `<div class="empty-state">Nessuna ricetta in questo filtro.</div>`;
  return g.cards.map(c => `
    <button class="card" data-action="${openAction}" data-id="${escapeHtml(c.id)}">
      <div class="card-head">
        <span class="card-code" title="${escapeHtml(c.species)}">${speciesIcon(c.sp, 26) || escapeHtml(c.code)}</span>
        <span class="card-count">${escapeHtml(c.count)}</span>
      </div>
      <div class="card-body">
        <div class="card-species">${escapeHtml(c.species)}</div>
        <div class="card-name">${escapeHtml(c.name)}</div>
      </div>
      <div class="card-bars">
        ${c.bars.map((b, i) => `<span class="card-bar" style="width:${b.w};background:${i % 2 === 0 ? 'var(--accent)' : 'var(--accent-bright)'}"></span>`).join('')}
      </div>
    </button>
  `).join('');
}

function renderRazioniList() {
  const g = computeGallery(state.filter);
  return `
  <div class="screen">
    <div class="list-top">
      ${renderTabPills()}
      <div class="header-actions">
        <button class="icon-btn" data-action="toggle-theme" title="Cambia tema" aria-label="Cambia tema">${themeIcon(state.theme === 'dark' ? 'sun' : 'moon', 18)}</button>
        <button class="icon-btn" data-action="export-data" title="Esporta un file di backup" aria-label="Esporta">${fileIcon('export', 18)}</button>
        <button class="icon-btn" data-action="import-data" title="Importa un file di backup" aria-label="Importa">${fileIcon('import', 18)}</button>
        <button class="btn-square-add" data-action="new-recipe" title="Nuova ricetta" aria-label="Nuova ricetta">+</button>
      </div>
    </div>
    ${renderFilters(g)}
    <div class="cards-wrap"><div class="cards-grid">${renderCards(g, 'open-razioni')}</div></div>
  </div>`;
}

function renderRazioniView() {
  const r = curRazioni();
  const c = computeComposition(r);

  return `
  <div class="screen">
    <div class="op-header">
      <button class="back-btn" data-action="razioni-to-list">‹</button>
      <div class="op-title-wrap">
        <div class="op-species">${speciesIcon(r.sp, 12)}<span>${escapeHtml(r.species || 'Specie da definire')}</span></div>
        <div class="op-name">${escapeHtml(r.name || 'Senza nome')}</div>
      </div>
      <button class="edit-btn" data-action="edit-razioni" title="Modifica ricetta" aria-label="Modifica ricetta">${editIcon(15)}<span>Modifica</span></button>
    </div>
    <div class="panel">
      <div class="sum-row">
        <span>Base · percentuali</span>
        <span class="sum-val ${c.sumOk ? 'ok' : 'warn'}">Σ ${fmt(c.sum, c.sum % 1 ? 1 : 0)} % ${c.sumOk ? '' : warnTriangle(12)}</span>
      </div>
      ${r.base.map(b => `
        <div class="view-row">
          <span class="view-name">${escapeHtml(b.name || 'Ingrediente')}</span>
          <span class="view-val">${escapeHtml(b.pct || '0')} %</span>
        </div>`).join('')}
      <div class="section-label">Aggiunte fisse · kg per tonnellata</div>
      ${r.fixed.map(f => `
        <div class="view-row">
          <span class="view-name">${escapeHtml(f.name || 'Aggiunta')}</span>
          <span class="view-val">${escapeHtml(f.qty || '0')} kg/t</span>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderRazioniEdit() {
  const r = curRazioni();
  const c = computeComposition(r);

  return `
  <div class="screen">
    <div class="op-header">
      <button class="back-btn" data-action="razioni-to-view">‹</button>
      <div class="op-title-wrap">
        <div class="op-species">${speciesIcon(r.sp, 12)}<span>${escapeHtml(r.species || 'Specie da definire')}</span></div>
        <div class="op-name">${escapeHtml(r.name || 'Nuova ricetta')}</div>
      </div>
    </div>
    <div class="panel">
      <div class="comp-top">
        <input class="name-input" data-action="name" data-focus-id="name" value="${escapeHtml(r.name)}" placeholder="Nome della ricetta" />
        <div class="species-chips">
          ${SPECIES.map(s => `<button class="species-chip ${r.sp === s.key ? 'active' : ''}" data-action="pick-species" data-value="${s.key}">${speciesIcon(s.key, 13)}<span>${escapeHtml(s.label)}</span></button>`).join('')}
        </div>
      </div>
      <div class="sum-row">
        <span>Base · percentuali</span>
        <span class="sum-val ${c.sumOk ? 'ok' : 'warn'}">Σ ${fmt(c.sum, c.sum % 1 ? 1 : 0)} % ${c.sumOk ? '' : warnTriangle(12)}</span>
      </div>
      ${r.base.map((b, i) => `
        <div class="comp-row">
          <input class="comp-name-input" data-action="base-name" data-index="${i}" data-focus-id="base-name-${i}" value="${escapeHtml(b.name)}" placeholder="Nome ingrediente" />
          <input class="comp-input" inputmode="decimal" data-action="base-pct" data-index="${i}" data-focus-id="base-pct-${i}" value="${escapeHtml(b.pct)}" />
          <span class="comp-unit pct">%</span>
          <button class="row-remove" data-action="remove-base" data-index="${i}" title="Rimuovi ingrediente" ${r.base.length <= 1 ? 'disabled style="opacity:.3;cursor:default"' : ''}>×</button>
        </div>`).join('')}
      <button class="add-row-btn" data-action="add-base">+ Aggiungi ingrediente</button>

      <div class="section-label">Aggiunte fisse · kg per tonnellata</div>
      ${r.fixed.map((f, i) => `
        <div class="comp-row">
          <input class="comp-name-input" data-action="fixed-name" data-index="${i}" data-focus-id="fixed-name-${i}" value="${escapeHtml(f.name)}" placeholder="Nome aggiunta" />
          <input class="comp-input" inputmode="decimal" data-action="fixed-qty" data-index="${i}" data-focus-id="fixed-qty-${i}" value="${escapeHtml(f.qty)}" />
          <span class="comp-unit kgt">kg/t</span>
          <button class="row-remove" data-action="remove-fixed" data-index="${i}" title="Rimuovi aggiunta">×</button>
        </div>`).join('')}
      <button class="add-row-btn" data-action="add-fixed">+ Aggiungi aggiunta fissa</button>

      <button class="delete-recipe-btn ${state.confirmingDelete ? 'confirm' : ''}" data-action="delete-recipe">${state.confirmingDelete ? '⚠ Tocca di nuovo per confermare' : '🗑 Elimina ricetta'}</button>
    </div>
  </div>`;
}

function renderProdList() {
  const g = computeGallery(state.filter);
  return `
  <div class="screen">
    <div class="list-top">
      ${renderTabPills()}
    </div>
    ${renderFilters(g)}
    <div class="cards-wrap"><div class="cards-grid">${renderCards(g, 'open-produzione')}</div></div>
  </div>`;
}

function renderProdSession() {
  const r = curProd();
  const v = computeSession(r);

  const limitRow = state.mode === 'limit' ? `
    <div class="session-limit-row">
      ${r.base.map((b, i) => `<button class="limit-chip ${i === v.lIdx ? 'active' : ''}" data-action="pick-limit" data-index="${i}">${escapeHtml(b.name)}</button>`).join('')}
    </div>` : '';

  return `
  <div class="screen">
    <div class="op-header">
      <button class="back-btn" data-action="back-produzione">‹</button>
      <div class="op-title-wrap">
        <div class="op-species">${speciesIcon(r.sp, 12)}<span>${escapeHtml(r.species || 'Specie da definire')}</span></div>
        <div class="op-name">${escapeHtml(r.name || 'Ricetta')}</div>
      </div>
    </div>

    <div class="session-card">
      <div class="session-head">
        <span class="session-icon">${speciesIcon(r.sp, 22)}</span>
        <div class="session-title">
          <div class="session-eyebrow">In produzione</div>
          <div class="session-name">${escapeHtml(r.name || 'Ricetta')}</div>
        </div>
        <div class="session-mode-toggle">
          <button class="session-mode-btn ${state.mode === 'total' ? 'active' : ''}" data-action="mode-total">Totale</button>
          <button class="session-mode-btn ${state.mode === 'limit' ? 'active' : ''}" data-action="mode-limit">Vincolo</button>
        </div>
      </div>
      <div class="session-divider"></div>
      <div class="session-amount-row">
        <input class="session-amount-input" inputmode="decimal" data-action="amount" data-focus-id="amount"
          value="${escapeHtml(state.mode === 'total' ? state.amountTotal : state.amountLimit)}" />
        <div class="session-unit-group">
          <button class="session-unit-btn ${v.unit === 'kg' ? 'active' : ''}" data-action="unit-kg">kg</button>
          <button class="session-unit-btn ${v.unit === 'q' ? 'active' : ''}" data-action="unit-q">q</button>
        </div>
      </div>
      ${limitRow}
    </div>

    <div class="panel">
      <div class="calc-head">
        <span class="col-name">Ingrediente</span>
        ${v.showPct ? '<span class="col-pct">%</span>' : ''}
        <span class="col-qty">${escapeHtml(v.unit)}</span>
        ${v.showCum ? '<span class="col-cum">progr.</span>' : ''}
      </div>
      ${v.calcRows.map(row => `
        <div class="calc-row ${row.hot ? 'hot' : ''} ${row.fixed ? 'fixed' : ''}">
          <span class="col-name">${escapeHtml(row.name)}</span>
          ${v.showPct ? `<span class="col-pct">${escapeHtml(row.pct)}</span>` : ''}
          <span class="col-qty">${escapeHtml(row.qty)}</span>
          ${v.showCum ? `<span class="col-cum">${escapeHtml(row.cum)}</span>` : ''}
        </div>`).join('')}
    </div>

    <div class="footer">
      <div class="footer-info">
        <div class="footer-label">Totale caricato</div>
        <div class="footer-note">${escapeHtml(v.batchNote)}${v.sumOk ? '' : ` · <span class="footer-warn">Σ ${fmt(v.sum, v.sum % 1 ? 1 : 0)} % ${warnTriangle(11)}</span>`}</div>
      </div>
      <div class="footer-total">
        <span class="val">${escapeHtml(v.grandTotal)}</span>
        <span class="unit">${escapeHtml(v.unit)}</span>
      </div>
    </div>
  </div>`;
}

/* ---------- focus-preserving re-render ---------- */

function withFocusPreserved(fn) {
  const active = document.activeElement;
  let focusId = null, selStart = null, selEnd = null;
  if (active && active.dataset && active.dataset.focusId) {
    focusId = active.dataset.focusId;
    if (typeof active.selectionStart === 'number') {
      selStart = active.selectionStart;
      selEnd = active.selectionEnd;
    }
  }
  fn();
  if (focusId) {
    const el = app.querySelector(`[data-focus-id="${CSS.escape(focusId)}"]`);
    if (el) {
      el.focus();
      if (selStart != null && el.setSelectionRange) {
        try { el.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }
  }
}

/* ---------- event delegation ---------- */

app.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const idx = btn.dataset.index !== undefined ? Number(btn.dataset.index) : null;
  const value = btn.dataset.value;

  switch (action) {
    case 'switch-tab': setState({ tab: value, confirmingDelete: false }); break;
    case 'toggle-theme': {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setState({ theme: next });
      break;
    }
    case 'filter': setState({ filter: value }); break;

    case 'new-recipe': {
      const nid = 'n' + Date.now();
      const blank = {
        id: nid, name: '', sp: '', species: '',
        base: [1,2,3].map(() => ({ name: '', pct: '' })),
        fixed: [{ name: '', qty: '' }],
      };
      setState(s => ({ recipes: s.recipes.concat([blank]), razioniId: nid, razioniMode: 'edit', filter: 'Tutte' }));
      break;
    }
    case 'open-razioni': setState({ razioniId: id, razioniMode: 'view', confirmingDelete: false }); break;
    case 'edit-razioni': setState({ razioniMode: 'edit' }); break;
    case 'razioni-to-view': setState({ razioniMode: 'view', confirmingDelete: false }); break;
    case 'razioni-to-list': setState({ razioniId: null, confirmingDelete: false }); break;
    case 'export-data': exportData(); break;
    case 'import-data': importData(); break;

    case 'open-produzione': {
      if (id === state.prodId) { setState({ prodId: id }); break; }
      setState({ prodId: id, mode: 'total', amountTotal: '2000', amountLimit: '600', limitIdx: 0, unit: null });
      break;
    }
    case 'back-produzione': setState({ prodId: null }); break;
    case 'mode-total': setState({ mode: 'total' }); break;
    case 'mode-limit': setState({ mode: 'limit' }); break;
    case 'unit-kg': setState({ unit: 'kg' }); break;
    case 'unit-q': setState({ unit: 'q' }); break;
    case 'pick-limit': setState({ limitIdx: idx }); break;

    case 'pick-species': {
      const sp = SPECIES.find(s => s.key === value);
      updateRazioni(x => Object.assign({}, x, { sp: sp.key, species: sp.label }));
      break;
    }
    case 'add-base': {
      updateRazioni(x => Object.assign({}, x, { base: x.base.concat([{ name: '', pct: '' }]) }));
      break;
    }
    case 'remove-base': {
      setState(s => {
        const r0 = s.recipes.find(x => x.id === s.razioniId);
        if (!r0 || r0.base.length <= 1) return {};
        const newBase = r0.base.filter((_, i) => i !== idx);
        const recipes = s.recipes.map(x => x.id !== r0.id ? x : Object.assign({}, x, { base: newBase }));
        return { recipes, limitIdx: Math.max(0, Math.min(s.limitIdx, newBase.length - 1)) };
      });
      break;
    }
    case 'add-fixed': {
      updateRazioni(x => Object.assign({}, x, { fixed: x.fixed.concat([{ name: '', qty: '' }]) }));
      break;
    }
    case 'remove-fixed': {
      updateRazioni(x => Object.assign({}, x, { fixed: x.fixed.filter((_, i) => i !== idx) }));
      break;
    }
    case 'delete-recipe': {
      if (!state.confirmingDelete) {
        clearTimeout(deleteConfirmTimer);
        setState({ confirmingDelete: true });
        deleteConfirmTimer = setTimeout(() => setState({ confirmingDelete: false }), 3500);
        break;
      }
      clearTimeout(deleteConfirmTimer);
      const r = curRazioni();
      setState(s => {
        const recipes = s.recipes.filter(x => x.id !== r.id);
        return {
          recipes, razioniId: null, razioniMode: 'view', confirmingDelete: false,
          prodId: s.prodId === r.id ? null : s.prodId,
        };
      });
      showToast('Ricetta eliminata');
      break;
    }
  }
});

app.addEventListener('input', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const idx = el.dataset.index !== undefined ? Number(el.dataset.index) : null;
  const val = el.value;

  withFocusPreserved(() => {
    switch (action) {
      case 'amount':
        setState(state.mode === 'total' ? { amountTotal: val } : { amountLimit: val });
        break;
      case 'name':
        updateRazioni(x => Object.assign({}, x, { name: val }));
        break;
      case 'base-name':
        updateRazioni(x => Object.assign({}, x, { base: x.base.map((b, i) => i === idx ? { name: val, pct: b.pct } : b) }));
        break;
      case 'base-pct':
        updateRazioni(x => Object.assign({}, x, { base: x.base.map((b, i) => i === idx ? { name: b.name, pct: val } : b) }));
        break;
      case 'fixed-name':
        updateRazioni(x => Object.assign({}, x, { fixed: x.fixed.map((f, i) => i === idx ? { name: val, qty: f.qty } : f) }));
        break;
      case 'fixed-qty':
        updateRazioni(x => Object.assign({}, x, { fixed: x.fixed.map((f, i) => i === idx ? { name: f.name, qty: val } : f) }));
        break;
    }
  });
});

/* ---------- boot ---------- */

applyTheme(state.theme);
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
