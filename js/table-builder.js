/* ============ منشئ الجدول ============ */
const TableBuilder = (() => {
  let currentTable = null; // { id, name, columns[], rows[][] }

  const DEFAULT_COLUMNS = ['المهمة', 'الحالة', 'النسبة', 'ملاحظات'];
  const DEFAULT_ROWS = [
    ['مهمة 1', 'مكتمل', '100', ''],
    ['مهمة 2', 'قيد التنفيذ', '50', ''],
  ];

  function newEmptyTable() {
    return {
      id: Storage.generateId(),
      name: 'مهام الأسبوع',
      columns: [...DEFAULT_COLUMNS],
      rows: DEFAULT_ROWS.map(r => [...r]),
      createdAt: Date.now(),
    };
  }

  /* الرسم */
  function render() {
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    if (!head || !body || !currentTable) return;

    // رأس الجدول
    head.innerHTML = '';
    currentTable.columns.forEach((col, ci) => {
      const th = document.createElement('th');
      th.innerHTML = `
        <div class="col-header">
          <input value="${escapeAttr(col)}" data-col="${ci}" class="col-input" placeholder="عنوان العمود">
          <button class="del-btn" data-del-col="${ci}" title="حذف العمود">✕</button>
        </div>
      `;
      head.appendChild(th);
    });
    // عمود إجراءات
    const thAct = document.createElement('th');
    thAct.textContent = 'إجراءات';
    thAct.style.minWidth = '80px';
    head.appendChild(thAct);

    // جسم الجدول
    body.innerHTML = '';
    currentTable.rows.forEach((row, ri) => {
      const tr = document.createElement('tr');
      currentTable.columns.forEach((_, ci) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.value = row[ci] != null ? row[ci] : '';
        input.dataset.row = ri;
        input.dataset.col = ci;
        input.className = 'cell-input';
        td.appendChild(input);
        tr.appendChild(td);
      });
      const tdAct = document.createElement('td');
      tdAct.innerHTML = `<button class="del-btn" data-del-row="${ri}" title="حذف الصف">🗑️</button>`;
      tr.appendChild(tdAct);
      body.appendChild(tr);
    });

    // اسم الجدول
    const nameInput = document.getElementById('tableName');
    if (nameInput) nameInput.value = currentTable.name;

    // ربط الأحداث
    head.querySelectorAll('.col-input').forEach(inp => {
      inp.addEventListener('input', e => {
        currentTable.columns[+e.target.dataset.col] = e.target.value;
      });
    });
    head.querySelectorAll('[data-del-col]').forEach(btn => {
      btn.addEventListener('click', () => deleteColumn(+btn.dataset.delCol));
    });
    body.querySelectorAll('.cell-input').forEach(inp => {
      inp.addEventListener('input', e => {
        const r = +e.target.dataset.row, c = +e.target.dataset.col;
        currentTable.rows[r][c] = e.target.value;
        // تحديث فوري للمخططات والعدادات
        if (typeof updateLiveViews === 'function') updateLiveViews();
      });
    });
    body.querySelectorAll('[data-del-row]').forEach(btn => {
      btn.addEventListener('click', () => deleteRow(+btn.dataset.delRow));
    });
  }

  function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

  /* العمليات */
  function addColumn() {
    currentTable.columns.push('عمود ' + (currentTable.columns.length + 1));
    currentTable.rows.forEach(r => r.push(''));
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
  }

  function deleteColumn(ci) {
    if (currentTable.columns.length <= 1) {
      showToast('يجب الاحتفاظ بعمود واحد على الأقل', 'error'); return;
    }
    currentTable.columns.splice(ci, 1);
    currentTable.rows.forEach(r => r.splice(ci, 1));
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
  }

  function addRow() {
    currentTable.rows.push(currentTable.columns.map(() => ''));
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
  }

  function deleteRow(ri) {
    currentTable.rows.splice(ri, 1);
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
  }

  /* التحميل والحفظ */
  function loadTable(table) {
    currentTable = JSON.parse(JSON.stringify(table));
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
  }

  function save() {
    const nameInput = document.getElementById('tableName');
    currentTable.name = nameInput.value.trim() || 'جدول بدون اسم';
    Storage.saveTable(currentTable);
    renderSavedSelect();
    showToast('تم حفظ الجدول ✅');
  }

  function clearNew() {
    currentTable = newEmptyTable();
    render();
    if (typeof updateLiveViews === 'function') updateLiveViews();
    showToast('تم إنشاء جدول جديد');
  }

  function deleteSaved() {
    if (!currentTable) return;
    if (!confirm('حذف هذا الجدول نهائيًا؟')) return;
    Storage.deleteTable(currentTable.id);
    renderSavedSelect();
    clearNew();
    showToast('تم حذف الجدول');
  }

  function renderSavedSelect() {
    const sel = document.getElementById('savedTablesSelect');
    if (!sel) return;
    const tables = Storage.getTables();
    sel.innerHTML = '<option value="">— تحميل جدول محفوظ —</option>' +
      tables.map(t => `<option value="${t.id}">${escapeAttr(t.name)}</option>`).join('');
  }

  /* التهيئة */
  function init() {
    currentTable = newEmptyTable();

    // إن وُجد جدول محفوظ، حمّله كبداية
    const saved = Storage.getTables();
    if (saved.length > 0) currentTable = JSON.parse(JSON.stringify(saved[saved.length - 1]));

    render();
    renderSavedSelect();

    document.getElementById('addColumnBtn')?.addEventListener('click', addColumn);
    document.getElementById('addRowBtn')?.addEventListener('click', addRow);
    document.getElementById('saveTableBtn')?.addEventListener('click', save);
    document.getElementById('deleteTableBtn')?.addEventListener('click', deleteSaved);
    document.getElementById('newTableBtn')?.addEventListener('click', clearNew);

    document.getElementById('savedTablesSelect')?.addEventListener('change', e => {
      const id = e.target.value;
      if (!id) return;
      const t = Storage.getTable(id);
      if (t) loadTable(t);
    });
  }

  return {
    init,
    getCurrent: () => currentTable,
    render,
  };
})();