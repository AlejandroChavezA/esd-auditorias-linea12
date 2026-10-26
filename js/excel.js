const ExcelIO = (() => {
  const STATUS_VALUES = ['PENDIENTE', 'AUDITADO', 'OBSERVACION', 'NO CONFORME'];

  const HEADER_MAP = [
    ['id', ['id']],
    ['status', ['estado de auditoría', 'estado de auditoria', 'estado']],
    ['date', ['fecha de auditoría', 'fecha de auditoria', 'fecha']],
    ['auditor', ['auditor responsable', 'auditor']],
    ['supervisor', ['supervisor']],
    ['engineer', ['ingeniero responsible', 'ingeniero responsable', 'ingeniero']],
    ['coordinator', ['coordinador esd', 'coordinador']],
    ['notes', ['notas', 'observaciones']]
  ];

  const pad = (n) => String(n).padStart(2, '0');

  const toISO = (value) => {
    if (!value && value !== 0) return '';
    if (value instanceof Date && !isNaN(value)) {
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
    }
    if (typeof value === 'number' && typeof XLSX !== 'undefined' && XLSX.SSF) {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) return `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}`;
    }
    const text = String(value).trim();
    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
    const dmy = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (dmy) return `${dmy[3]}-${pad(dmy[2])}-${pad(dmy[1])}`;
    return '';
  };

  const toDisplay = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return y && m && d ? `${d}/${m}/${y}` : iso;
  };

  const norm = (value) => String(value || '').trim();
  const keyOf = (value) => norm(value).toLowerCase().replace(/\s+/g, ' ');
  const statusOf = (value) => {
    const raw = keyOf(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!raw) return 'PENDIENTE';
    if (raw.includes('no conforme') || raw.includes('fuera')) return 'NO CONFORME';
    if (raw.includes('observ')) return 'OBSERVACION';
    if (raw.includes('audit')) return 'AUDITADO';
    if (raw.includes('pend')) return 'PENDIENTE';
    return STATUS_VALUES.includes(value.toUpperCase()) ? value.toUpperCase() : 'PENDIENTE';
  };

  const mapRow = (row) => {
    const bag = {};
    Object.keys(row || {}).forEach((header) => { bag[keyOf(header)] = row[header]; });
    const out = {};
    HEADER_MAP.forEach(([field, aliases]) => {
      const header = aliases.find((alias) => bag[alias] !== undefined);
      out[field] = header !== undefined ? bag[header] : '';
    });
    const id = norm(out.id);
    if (!id || keyOf(id) === 'id') return null;
    return {
      id,
      status: statusOf(out.status),
      date: toISO(out.date),
      auditor: norm(out.auditor),
      supervisor: norm(out.supervisor),
      engineer: norm(out.engineer),
      coordinator: norm(out.coordinator),
      notes: norm(out.notes)
    };
  };

  const parseBuffer = (buffer) => {
    if (typeof XLSX === 'undefined') throw new Error('No se pudo leer Excel.');
    const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
    const names = wb.SheetNames || [];
    const catalogName = names.find((n) => /linea|cat[aá]logo|equipo/i.test(n)) || names[0];
    const historyName = names.find((n) => /historial|bit[aá]cora/i.test(n));
    const catalogRows = XLSX.utils.sheet_to_json(wb.Sheets[catalogName], { defval: '', raw: false });
    const equipos = catalogRows.map(mapRow).filter(Boolean);
    let historial = [];
    if (historyName) {
      historial = XLSX.utils.sheet_to_json(wb.Sheets[historyName], { defval: '', raw: false })
        .map(mapRow)
        .filter(Boolean)
        .map((row) => ({ ...row, savedAt: row.date }));
    }
    if (!equipos.length) throw new Error('No se encontraron equipos. Usa una hoja con la columna ID.');
    return { equipos, historial };
  };

  const colWidths = (rows, headers) => headers.map((header, i) => ({
    wch: Math.min(36, Math.max(header.length + 2, ...rows.map((r) => String(r[i] ?? '').length + 1)))
  }));

  const build = (equipos, historial) => {
    if (typeof XLSX === 'undefined') throw new Error('No se pudo generar Excel.');
    const wb = XLSX.utils.book_new();
    const now = new Date();
    const stamp = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const audited = equipos.filter((e) => e.status === 'AUDITADO').length;
    const pending = equipos.filter((e) => e.status === 'PENDIENTE').length;
    const other = equipos.length - audited - pending;

    const catalogHeader = ['#', 'ID', 'Estado de Auditoría', 'Fecha de Auditoría', 'Auditor Responsable', 'Supervisor', 'Ingeniero Responsable', 'Coordinador ESD'];
    const catalogRows = [
      ['Línea 12', 'Auditorías ESD'],
      ['Actualizado', stamp],
      ['Equipos', equipos.length, 'Auditados', audited, 'Pendientes', pending],
      [],
      catalogHeader,
      ...equipos.map((e, i) => [i + 1, e.id, e.status, toDisplay(e.date), e.auditor, e.supervisor, e.engineer, e.coordinator])
    ];
    const catalogSheet = XLSX.utils.aoa_to_sheet(catalogRows);
    catalogSheet['!cols'] = colWidths(catalogRows.slice(5), catalogHeader);
    catalogSheet['!autofilter'] = { ref: 'A5:H' + (5 + equipos.length) };
    XLSX.utils.book_append_sheet(wb, catalogSheet, 'Linea 12');

    const histHeader = ['#', 'ID', 'Estado de Auditoría', 'Fecha de Auditoría', 'Auditor Responsable', 'Supervisor', 'Ingeniero Responsable', 'Coordinador ESD', 'Notas'];
    const histData = (historial || []).map((h, i) => [i + 1, h.id, h.status, toDisplay(h.date), h.auditor, h.supervisor, h.engineer, h.coordinator, h.notes || '']);
    const histRows = [histHeader, ...histData];
    const histSheet = XLSX.utils.aoa_to_sheet(histRows.length > 1 ? histRows : [histHeader, ['Sin capturas posteriores al archivo original']]);
    histSheet['!cols'] = colWidths(histRows, histHeader);
    histSheet['!autofilter'] = { ref: 'A1:I' + Math.max(2, histRows.length) };
    XLSX.utils.book_append_sheet(wb, histSheet, 'Historial');

    const resumen = [
      ['Resumen Línea 12'],
      ['Generado', stamp],
      [],
      ['Indicador', 'Valor'],
      ['Total de equipos', equipos.length],
      ['Auditados', audited],
      ['Pendientes', pending],
      ['Con observación / no conforme', other],
      ['Avance', equipos.length ? Math.round((audited / equipos.length) * 100) + '%' : '0%']
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumen), 'Resumen');

    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  };

  const download = (equipos, historial) => {
    const bytes = build(equipos, historial);
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Linea12-auditorias-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };

  return { parseBuffer, download, toISO, toDisplay, statusOf, STATUS_VALUES };
})();
