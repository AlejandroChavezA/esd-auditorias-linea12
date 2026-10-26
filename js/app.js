const ICONS = {
  logo: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V5h4l3 5 3-5h4v14"/><path d="M8 15h8"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg>',
  machines: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h3M8 15h8M8 18h8"/></svg>',
  audits: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><rect x="8" y="2" width="8" height="4" rx="1.5"/><path d="m7 12 2 2 4-4M7 17h10"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  scan: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10M9 9v6M12 9v6M15 9v6"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  alert: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 4.3 2.9 17.1A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  export: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  qr: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v2M18 20h3M14 20v-1"/></svg>',
  file: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>'
};

const STORE_KEY = 'cst-linea12-v1';
const navConfig = [
  { page: 'equipos', label: 'Equipos', icon: 'machines' },
  { page: 'auditar', label: 'Auditar', icon: 'plus' },
  { page: 'historial', label: 'Historial', icon: 'audits' }
];

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { equipos: LINEA12.map((e) => ({ ...e })), historial: [], lastAuditor: 'Geovanni Lopez' };
    const parsed = JSON.parse(raw);
    return {
      equipos: Array.isArray(parsed.equipos) && parsed.equipos.length ? parsed.equipos : LINEA12.map((e) => ({ ...e })),
      historial: Array.isArray(parsed.historial) ? parsed.historial : [],
      lastAuditor: parsed.lastAuditor || 'Geovanni Lopez'
    };
  } catch {
    return { equipos: LINEA12.map((e) => ({ ...e })), historial: [], lastAuditor: 'Geovanni Lopez' };
  }
};

let state = loadState();
let currentPage = 'equipos';
let selectedId = null;
let query = '';
let statusFilter = 'all';
let toastTimer;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const icon = (name) => ICONS[name] || '';
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sameId = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
const byId = (id) => state.equipos.find((e) => sameId(e.id, id));
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const persist = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));
const statusClass = (s) => ({ AUDITADO: 'ok', PENDIENTE: 'pending', OBSERVACION: 'review', 'NO CONFORME': 'alert' }[s] || 'pending');
const defaultsFrom = (equipo) => ({
  auditor: state.lastAuditor || equipo?.auditor || 'Geovanni Lopez',
  supervisor: equipo?.supervisor || 'Victor Espinoza',
  engineer: equipo?.engineer || 'Viviana Ortega',
  coordinator: equipo?.coordinator || 'Zaza Alvarado'
});

function toast(message, type = 'ok') {
  clearTimeout(toastTimer);
  $('#toastHost').innerHTML = `<div class="toast">${type === 'error' ? icon('alert') : icon('check')}<span>${esc(message)}</span></div>`;
  toastTimer = setTimeout(() => { $('#toastHost').innerHTML = ''; }, 3200);
}

function setPage(page, options = {}) {
  currentPage = page;
  if (!options.keep) selectedId = null;
  $('#breadcrumb').textContent = ({ equipos: 'Línea 12', auditar: 'Nueva auditoría', historial: 'Historial' })[page];
  $$('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.page === page));
  $$('.mobile-nav button').forEach((b) => b.classList.toggle('active', b.dataset.page === page));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function counts() {
  return {
    total: state.equipos.length,
    ok: state.equipos.filter((e) => e.status === 'AUDITADO').length,
    pending: state.equipos.filter((e) => e.status === 'PENDIENTE').length,
    other: state.equipos.filter((e) => e.status !== 'AUDITADO' && e.status !== 'PENDIENTE').length
  };
}

function filteredEquipos() {
  const q = query.trim().toLowerCase();
  return state.equipos.filter((e) => {
    const hit = !q || [e.id, e.auditor, e.supervisor].join(' ').toLowerCase().includes(q);
    return hit && (statusFilter === 'all' || e.status === statusFilter);
  });
}

function heading(title, subtitle, actions) {
  return `<div class="page-heading"><div><div class="eyebrow">Línea 12</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div><div class="actions">${actions}</div></div>`;
}

function metric(label, value, ic, foot, variant = '') {
  return `<div class="metric"><div class="metric-top"><span class="metric-label">${label}</span><span class="metric-icon ${variant}">${icon(ic)}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></div>`;
}

function equiposPage() {
  const c = counts();
  const list = filteredEquipos();
  const rows = list.length ? list.map((e) => `<tr>
    <td><span class="machine-id">${esc(e.id)}</span></td>
    <td><span class="status ${statusClass(e.status)}">${esc(e.status)}</span></td>
    <td>${esc(ExcelIO.toDisplay(e.date) || 'Sin fecha')}</td>
    <td>${esc(e.auditor || '—')}</td>
    <td>${esc(e.supervisor || '—')}</td>
    <td class="action-cell">
      <button aria-label="QR ${esc(e.id)}" onclick="openQRLabel(${JSON.stringify(e.id)})">${icon('qr')}</button>
      <button class="btn btn-quiet btn-sm" onclick="startAudit(${JSON.stringify(e.id)})">Auditar</button>
    </td>
  </tr>`).join('') : `<tr><td colspan="6"><div class="table-empty">No hay equipos con ese filtro.</div></td></tr>`;

  return `${heading('Equipos de Línea 12', 'Catálogo real del Excel. Escanea, audita y vuelve a descargar el archivo actualizado.',
    `<button class="btn btn-secondary" onclick="openScanner()">${icon('scan')} Escanear</button>
     <button class="btn btn-secondary" onclick="document.getElementById('excelFile').click()">${icon('file')} Actualizar Excel</button>
     <button class="btn btn-primary" onclick="downloadWorkbook()">${icon('export')} Descargar Excel</button>`)}
    <div class="metric-grid">
      ${metric('Equipos', c.total, 'machines', 'Línea 12')}
      ${metric('Auditados', c.ok, 'check', `${c.total ? Math.round(c.ok / c.total * 100) : 0}% del catálogo`, 'blue')}
      ${metric('Pendientes', c.pending, 'clock', 'Sin captura en esta ronda', 'amber')}
      ${metric('Observados', c.other, 'alert', 'No conforme u observación', 'red')}
    </div>
    <section class="panel">
      <div class="filter-bar">
        <input class="filter-input" id="equipoSearch" type="search" placeholder="Buscar ID, auditor o supervisor…" value="${esc(query)}">
        <select class="filter-select" id="equipoStatus">
          <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Todos</option>
          ${ExcelIO.STATUS_VALUES.map((s) => `<option value="${s}" ${statusFilter === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm" onclick="openMachineForm()">${icon('plus')} Agregar ID</button>
        <button class="btn btn-quiet btn-sm" onclick="openQRSheet()">${icon('qr')} Etiquetas QR</button>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Estado</th><th>Fecha</th><th>Auditor</th><th>Supervisor</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="table-count">Mostrando ${list.length} de ${state.equipos.length} equipos</div>
    </section>
    <p class="page-note">Al auditar se actualiza el equipo y queda en el historial. El Excel descargado trae tres hojas: catálogo, historial y resumen.</p>`;
}

function auditPage() {
  const equipo = byId(selectedId);
  const d = defaultsFrom(equipo);
  const options = state.equipos.map((e) => `<option value="${esc(e.id)}" ${sameId(e.id, selectedId) ? 'selected' : ''}>${esc(e.id)} · ${esc(e.status)}</option>`).join('');
  return `${heading('Registrar auditoría', 'Los campos son los mismos del Excel de Línea 12.',
    `<button class="btn btn-secondary" onclick="openScanner()">${icon('scan')} Elegir por QR</button>`)}
    <form id="auditForm"><div class="form-layout">
      <section class="panel form-panel">
        <div class="form-section">
          <h3>Equipo y resultado</h3>
          <div class="form-grid">
            <div class="field full" id="idField">
              <label for="auditId">ID del equipo *</label>
              <select id="auditId" required><option value="">Selecciona un ID…</option>${options}</select>
              <div class="field-error">Selecciona un equipo del catálogo.</div>
            </div>
            <div class="field">
              <label for="auditStatus">Estado de auditoría *</label>
              <select id="auditStatus">${ExcelIO.STATUS_VALUES.map((s) => `<option value="${s}" ${s === 'AUDITADO' ? 'selected' : ''}>${s}</option>`).join('')}</select>
            </div>
            <div class="field">
              <label for="auditDate">Fecha de auditoría *</label>
              <input id="auditDate" type="date" required value="${todayISO()}">
            </div>
            <div class="field">
              <label for="auditAuditor">Auditor responsable *</label>
              <input id="auditAuditor" required value="${esc(d.auditor)}">
            </div>
            <div class="field">
              <label for="auditSupervisor">Supervisor</label>
              <input id="auditSupervisor" value="${esc(d.supervisor)}">
            </div>
            <div class="field">
              <label for="auditEngineer">Ingeniero responsable</label>
              <input id="auditEngineer" value="${esc(d.engineer)}">
            </div>
            <div class="field">
              <label for="auditCoordinator">Coordinador ESD</label>
              <input id="auditCoordinator" value="${esc(d.coordinator)}">
            </div>
            <div class="field full">
              <label for="auditNotes">Notas <span>(van al historial)</span></label>
              <textarea id="auditNotes" placeholder="Hallazgos o seguimiento…"></textarea>
            </div>
          </div>
        </div>
        <div class="form-footer">
          <small>Se guarda en este navegador y queda listo para descargar en Excel.</small>
          <div class="actions">
            <button type="button" class="btn btn-secondary" onclick="setPage('equipos')">Cancelar</button>
            <button type="submit" class="btn btn-primary">${icon('check')} Guardar auditoría</button>
          </div>
        </div>
      </section>
      <aside class="panel machine-summary" id="machineSummary">${summaryCard(selectedId)}</aside>
    </div></form>`;
}

function historyPage() {
  const rows = [...state.historial].reverse();
  const body = rows.length ? rows.map((h) => `<tr>
    <td><span class="machine-id">${esc(h.id)}</span></td>
    <td><span class="status ${statusClass(h.status)}">${esc(h.status)}</span></td>
    <td>${esc(ExcelIO.toDisplay(h.date) || '—')}</td>
    <td>${esc(h.auditor || '—')}</td>
    <td>${esc(h.notes || '—')}</td>
  </tr>`).join('') : `<tr><td colspan="5"><div class="table-empty">Aún no hay capturas nuevas. Las del Excel original ya están en el catálogo.</div></td></tr>`;
  return `${heading('Historial', 'Cada auditoría queda como registro, además de actualizar el catálogo.',
    `<button class="btn btn-primary" onclick="downloadWorkbook()">${icon('export')} Descargar Excel</button>`)}
    <section class="panel"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Estado</th><th>Fecha</th><th>Auditor</th><th>Notas</th></tr></thead>
      <tbody>${body}</tbody>
    </table></div>
    <div class="table-count">${rows.length} capturas en esta sesión / este navegador</div></section>`;
}

function summaryCard(id) {
  const e = byId(id);
  if (!e) return `<div class="summary-title">Selecciona un equipo</div><div class="summary-sub">Al elegir un ID verás su estado actual y su QR.</div>`;
  return `<div class="summary-title">${esc(e.id)}</div>
    <div style="margin-top:10px"><span class="status ${statusClass(e.status)}">${esc(e.status)}</span></div>
    <div class="summary-divider"></div>
    <div class="summary-row"><span>Fecha</span><strong>${esc(ExcelIO.toDisplay(e.date) || '—')}</strong></div>
    <div class="summary-row"><span>Auditor</span><strong>${esc(e.auditor || '—')}</strong></div>
    <div class="summary-row"><span>Supervisor</span><strong>${esc(e.supervisor || '—')}</strong></div>
    <div class="summary-row"><span>Ingeniero</span><strong>${esc(e.engineer || '—')}</strong></div>
    <div class="summary-row"><span>Coordinador ESD</span><strong>${esc(e.coordinator || '—')}</strong></div>
    <div class="qr-layout">
      <div class="qr-canvas-wrap"><canvas data-qr="${esc(e.id)}" data-size="180" width="180" height="180"></canvas></div>
      <div class="qr-copy"><strong>Etiqueta QR</strong><p>El código contiene el ID del equipo.</p><code>${esc(e.id)}</code>
        <div class="qr-actions"><button type="button" class="btn btn-quiet btn-sm" onclick="downloadQR(${JSON.stringify(e.id)})">Descargar PNG</button></div>
      </div>
    </div>`;
}

function render() {
  $('#content').innerHTML = currentPage === 'auditar' ? auditPage() : currentPage === 'historial' ? historyPage() : equiposPage();
  bindPage();
  QR.paintAll($('#content'));
}

function bindPage() {
  if (currentPage === 'equipos') {
    $('#equipoSearch')?.addEventListener('input', (e) => { query = e.target.value; $('#globalSearch').value = query; renderEquiposList(); });
    $('#equipoStatus')?.addEventListener('change', (e) => { statusFilter = e.target.value; renderEquiposList(); });
  }
  if (currentPage === 'auditar') {
    $('#auditId')?.addEventListener('change', (e) => {
      selectedId = e.target.value || null;
      $('#machineSummary').innerHTML = summaryCard(selectedId);
      QR.paintAll($('#machineSummary'));
    });
    $('#auditForm')?.addEventListener('submit', saveAudit);
  }
}

function renderEquiposList() {
  const list = filteredEquipos();
  const tbody = $('#content tbody');
  const count = $('#content .table-count');
  if (!tbody) return;
  tbody.innerHTML = list.length ? list.map((e) => `<tr>
    <td><span class="machine-id">${esc(e.id)}</span></td>
    <td><span class="status ${statusClass(e.status)}">${esc(e.status)}</span></td>
    <td>${esc(ExcelIO.toDisplay(e.date) || 'Sin fecha')}</td>
    <td>${esc(e.auditor || '—')}</td>
    <td>${esc(e.supervisor || '—')}</td>
    <td class="action-cell">
      <button aria-label="QR ${esc(e.id)}" onclick="openQRLabel(${JSON.stringify(e.id)})">${icon('qr')}</button>
      <button class="btn btn-quiet btn-sm" onclick="startAudit(${JSON.stringify(e.id)})">Auditar</button>
    </td>
  </tr>`).join('') : `<tr><td colspan="6"><div class="table-empty">No hay equipos con ese filtro.</div></td></tr>`;
  if (count) count.textContent = `Mostrando ${list.length} de ${state.equipos.length} equipos`;
}

function saveAudit(event) {
  event.preventDefault();
  const id = $('#auditId').value;
  const auditor = $('#auditAuditor').value.trim();
  if (!id || !auditor) {
    if (!id) $('#idField').classList.add('invalid');
    toast('Completa ID y auditor.', 'error');
    return;
  }
  const equipo = byId(id);
  if (!equipo) { toast('Ese ID no está en el catálogo.', 'error'); return; }
  const record = {
    id: equipo.id,
    status: $('#auditStatus').value,
    date: $('#auditDate').value,
    auditor,
    supervisor: $('#auditSupervisor').value.trim(),
    engineer: $('#auditEngineer').value.trim(),
    coordinator: $('#auditCoordinator').value.trim(),
    notes: $('#auditNotes').value.trim(),
    savedAt: new Date().toISOString()
  };
  Object.assign(equipo, {
    status: record.status,
    date: record.date,
    auditor: record.auditor,
    supervisor: record.supervisor,
    engineer: record.engineer,
    coordinator: record.coordinator
  });
  state.historial.push(record);
  state.lastAuditor = auditor;
  persist();
  toast(`${equipo.id} quedó ${record.status}.`);
  setPage('equipos');
}

function startAudit(id) {
  selectedId = id;
  setPage('auditar', { keep: true });
}

function downloadWorkbook() {
  try {
    ExcelIO.download(state.equipos, state.historial);
    toast('Excel listo: catálogo, historial y resumen.');
  } catch (err) {
    toast(err.message || 'No se pudo generar el Excel.', 'error');
  }
}

async function importExcel(file) {
  try {
    const buffer = await file.arrayBuffer();
    const parsed = ExcelIO.parseBuffer(buffer);
    state.equipos = parsed.equipos;
    if (parsed.historial.length) state.historial = parsed.historial;
    persist();
    render();
    toast(`Catálogo actualizado: ${parsed.equipos.length} equipos.`);
  } catch (err) {
    toast(err.message || 'No se pudo leer el archivo.', 'error');
  }
}

function openModal(title, subtitle, body, footer = '', wide = false) {
  QR.stopCamera();
  $('#overlay').innerHTML = `<div class="modal-backdrop" id="modalBackdrop"><section class="modal${wide ? ' wide' : ''}" role="dialog" aria-modal="true">
    <header class="modal-header"><div><h2>${title}</h2><p>${subtitle || ''}</p></div>
    <button class="icon-button" aria-label="Cerrar" onclick="closeModal()">${icon('close')}</button></header>
    <div class="modal-body">${body}</div>${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}</section></div>`;
  $('#modalBackdrop').addEventListener('click', (e) => { if (e.target.id === 'modalBackdrop') closeModal(); });
  QR.paintAll($('#overlay'));
}

function closeModal() {
  QR.stopCamera();
  $('#overlay').innerHTML = '';
}

function handleScannedId(raw) {
  const text = QR.parsePayload(raw);
  const equipo = byId(text) || state.equipos.find((e) => e.id.toLowerCase().includes(String(text).toLowerCase()));
  if (!equipo) {
    toast(`No está en Línea 12: ${text}`, 'error');
    const status = $('#scanStatus');
    if (status) status.textContent = `Leído: ${text}. No coincide con el catálogo.`;
    return;
  }
  QR.stopCamera();
  toast(`Equipo: ${equipo.id}`);
  closeModal();
  startAudit(equipo.id);
}

function handleDeepLink() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  history.replaceState(null, '', location.pathname);
  handleScannedId(id);
}

function openScanner() {
  openModal('Escanear QR', 'Cámara, foto o el ID escrito.',
    `<div class="scan-frame">
      <video id="scanVideo" class="scan-video" playsinline muted></video>
      <canvas id="scanCanvas" class="hidden"></canvas>
      <div class="scan-overlay"><div class="scan-target">${icon('qr')}</div></div>
    </div>
    <p class="scan-status" id="scanStatus">Solicitando cámara…</p>
    <div class="scan-tools">
      <button type="button" class="btn btn-primary" onclick="startScanCamera()">${icon('scan')} Activar cámara</button>
      <button type="button" class="btn btn-secondary" onclick="document.getElementById('qrFile').click()">${icon('file')} Subir foto</button>
      <input id="qrFile" class="scan-file" type="file" accept="image/*" capture="environment">
      <div class="field"><label for="manualCode">ID del equipo</label><input id="manualCode" placeholder="YCB016C o MESA 1"></div>
      <button type="button" class="btn btn-quiet" onclick="submitManualCode()">Buscar</button>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>`);
  $('#qrFile')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { handleScannedId(await QR.fromFile(file)); }
    catch (err) { toast(err.message || 'No se leyó el QR.', 'error'); }
  });
  startScanCamera();
}

async function startScanCamera() {
  try { await QR.startCamera(handleScannedId); }
  catch {
    const status = $('#scanStatus');
    if (status) status.textContent = 'Sin cámara. Sube una foto o escribe el ID.';
  }
}

function submitManualCode() {
  const raw = $('#manualCode')?.value || '';
  if (!raw.trim()) { toast('Escribe un ID.', 'error'); return; }
  handleScannedId(raw);
}

function openMachineForm() {
  openModal('Agregar equipo', 'Se suma al catálogo de Línea 12.',
    `<form id="machineForm" class="form-grid">
      <div class="field full"><label for="newId">ID *</label><input id="newId" placeholder="YCA000C o MESA 3" required></div>
    </form>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="saveMachine()">Guardar</button>`);
}

function saveMachine() {
  const id = $('#newId').value.trim();
  if (!id) { toast('Escribe el ID.', 'error'); return; }
  if (byId(id)) { toast('Ese ID ya existe.', 'error'); return; }
  const d = defaultsFrom();
  state.equipos.push({ id, status: 'PENDIENTE', date: '', auditor: '', supervisor: d.supervisor, engineer: d.engineer, coordinator: d.coordinator });
  persist();
  closeModal();
  render();
  toast(`${id} se agregó al catálogo.`);
}

async function downloadQR(id) {
  try { await QR.download(id, id); toast('QR descargado.'); }
  catch { toast('No se pudo generar el QR.', 'error'); }
}

function openQRLabel(id) {
  const e = byId(id);
  if (!e) return;
  openModal(`QR · ${esc(e.id)}`, 'Descarga o imprime la etiqueta.',
    `<div class="qr-label"><canvas data-qr="${esc(e.id)}" data-size="240" width="240" height="240"></canvas>
      <strong>${esc(e.id)}</strong><small>${esc(e.status)} · ${esc(ExcelIO.toDisplay(e.date) || 'Sin fecha')}</small>
      <div class="qr-actions" style="justify-content:center;margin-top:10px">
        <button class="btn btn-quiet btn-sm" onclick="downloadQR(${JSON.stringify(e.id)})">Descargar PNG</button>
      </div>
    </div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
     <button class="btn btn-primary" onclick="window.print()">Imprimir</button>`);
}

function openQRSheet() {
  openModal('Etiquetas QR', 'Una etiqueta por ID de Línea 12.',
    `<div class="qr-sheet">${state.equipos.map((e) => `<article class="qr-label">
      <canvas data-qr="${esc(e.id)}" data-size="160" width="160" height="160"></canvas>
      <strong>${esc(e.id)}</strong>
      <button class="btn btn-quiet btn-sm" onclick="downloadQR(${JSON.stringify(e.id)})">PNG</button>
    </article>`).join('')}</div>`,
    `<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
     <button class="btn btn-primary" onclick="window.print()">Imprimir hoja</button>`,
    true);
}

$('#brandMark').innerHTML = icon('logo');
$('#searchIcon').innerHTML = icon('search');
$$('.nav-btn').forEach((b) => {
  const cfg = navConfig.find((n) => n.page === b.dataset.page);
  b.innerHTML = `${icon(cfg?.icon || 'machines')}<span>${cfg?.label || ''}</span>`;
  b.addEventListener('click', () => setPage(b.dataset.page));
});
$$('.mobile-nav button').forEach((b) => {
  const page = b.dataset.page;
  const ic = page === 'equipos' ? 'machines' : page === 'historial' ? 'audits' : page === 'escanear' ? 'scan' : 'plus';
  b.querySelector('.mobile-icon,.mobile-plus').innerHTML = icon(ic);
  b.addEventListener('click', () => {
    if (page === 'escanear') openScanner();
    else setPage(page);
  });
});
$('#globalSearch').addEventListener('input', (e) => {
  query = e.target.value;
  const local = $('#equipoSearch');
  if (local) local.value = query;
  if (currentPage === 'equipos') renderEquiposList();
});
$('#excelFile').addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (file) importExcel(file);
});

Object.assign(window, {
  setPage, openScanner, startScanCamera, submitManualCode, startAudit, closeModal,
  openMachineForm, saveMachine, downloadWorkbook, downloadQR, openQRLabel, openQRSheet
});

render();
handleDeepLink();
