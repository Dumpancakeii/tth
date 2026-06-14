// Admin panel — TrustTheHood
document.addEventListener('DOMContentLoaded', () => {
  const PRODS_KEY = 'trustthehood_admin_products';
  const EMAILS_KEY = 'trustthehood_emails';

  let products = [];
  let editingId = null;

  // DOM refs
  const productsGrid = document.getElementById('productsGrid');
  const productsEmpty = document.getElementById('productsEmpty');
  const emailsList = document.getElementById('emailsList');
  const productModal = document.getElementById('productModal');
  const productModalTitle = document.getElementById('productModalTitle');
  const editName = document.getElementById('editName');
  const editPrice = document.getElementById('editPrice');
  const editColor = document.getElementById('editColor');
  const editCategory = document.getElementById('editCategory');
  const editSoldOut = document.getElementById('editSoldOut');
  const editSku = document.getElementById('editSku');
  const editDataId = document.getElementById('editDataId');

  // Load products from localStorage
  function loadProducts() {
    try {
      products = JSON.parse(localStorage.getItem(PRODS_KEY)) || [];
    } catch {
      products = [];
    }
  }

  // Save products to localStorage
  function saveProducts() {
    localStorage.setItem(PRODS_KEY, JSON.stringify(products));
  }

  // Render product grid
  function renderProducts() {
    if (!productsGrid) return;
    if (products.length === 0) {
      productsGrid.innerHTML = '';
      if (productsEmpty) productsEmpty.style.display = 'block';
      return;
    }
    if (productsEmpty) productsEmpty.style.display = 'none';

    productsGrid.innerHTML = products.map((p, i) => `
      <div class="admin-card">
        <h3>${p.name || 'Без названия'}</h3>
        <p>Цена: ${p.price || '—'} ₽</p>
        <p>Цвет: ${p.color || '—'}</p>
        <p>Категория: ${p.category || '—'}</p>
        <p>Артикул: ${p.sku || '—'}</p>
        <p>Статус: ${p.soldOut ? 'Продано' : 'В наличии'}</p>
        <p style="font-size:10px;color:#999;">ID: ${p.dataId || '—'}</p>
        <div class="admin-card-actions">
          <button class="admin-btn" data-edit="${i}">Редактировать</button>
          <button class="admin-btn danger" data-delete="${i}">Удалить</button>
        </div>
      </div>
    `).join('');

    // Edit buttons
    productsGrid.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.edit)));
    });

    // Delete buttons
    productsGrid.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.delete);
        if (confirm(`Удалить "${products[idx].name}"?`)) {
          products.splice(idx, 1);
          saveProducts();
          renderProducts();
        }
      });
    });
  }

  // Open modal for editing
  function openEditModal(index) {
    const p = products[index];
    editingId = index;
    productModalTitle.textContent = 'Редактировать товар';
    editName.value = p.name || '';
    editPrice.value = p.price || '';
    editColor.value = p.color || '';
    editCategory.value = p.category || 'верх';
    editSoldOut.value = p.soldOut ? 'true' : 'false';
    editSku.value = p.sku || '';
    editDataId.value = p.dataId || '';
    productModal.classList.add('active');
  }

  // Open modal for new product
  function openNewModal() {
    editingId = null;
    productModalTitle.textContent = 'Новый товар';
    editName.value = '';
    editPrice.value = '';
    editColor.value = '';
    editCategory.value = 'верх';
    editSoldOut.value = 'false';
    editSku.value = '';
    editDataId.value = '';
    productModal.classList.add('active');
  }

  // Save from modal
  function saveFromModal() {
    const data = {
      name: editName.value.trim(),
      price: editPrice.value.trim(),
      color: editColor.value.trim(),
      category: editCategory.value,
      soldOut: editSoldOut.value === 'true',
      sku: editSku.value.trim(),
      dataId: editDataId.value.trim(),
    };

    if (!data.name || !data.price) {
      alert('Название и цена обязательны');
      return;
    }

    if (editingId !== null) {
      products[editingId] = data;
    } else {
      products.push(data);
    }

    saveProducts();
    renderProducts();
    productModal.classList.remove('active');
  }

  // Parse shop.html and load into admin
  function loadFromShopHtml() {
    fetch('../shop.html')
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const cards = doc.querySelectorAll('.product-card');
        products = [];

        cards.forEach(card => {
          const dataId = card.querySelector('.favorite-btn')?.dataset?.id || '';
          const sku = card.dataset.sku || '';
          products.push({
            name: card.dataset.name || '',
            price: card.dataset.price || '',
            color: card.dataset.color || '',
            category: card.dataset.category || '',
            soldOut: card.classList.contains('sold-out'),
            sku: sku,
            dataId: dataId,
          });
        });

        saveProducts();
        renderProducts();
        alert(`Загружено ${products.length} товаров`);
      })
      .catch(err => {
        alert('Ошибка загрузки shop.html: ' + err.message);
      });
  }

  // Нормализация записи email (поддержка старого формата — строка, и нового — объект)
  function normalizeEmailEntry(entry) {
    if (typeof entry === 'string') {
      return { email: entry, date: '—', time: '—', timestamp: '', page: '—' };
    }
    return entry;
  }

  // Получить все email-записи
  function getEmails() {
    try {
      return (JSON.parse(localStorage.getItem(EMAILS_KEY)) || []).map(normalizeEmailEntry);
    } catch {
      return [];
    }
  }

  // Render emails — таблица с датой, временем, страницей
  function renderEmails() {
    if (!emailsList) return;
    const emails = getEmails();

    // Обновить счётчик
    const counter = document.getElementById('emailsCounter');
    if (counter) counter.textContent = emails.length;

    if (emails.length === 0) {
      emailsList.innerHTML = '<div class="admin-empty">Нет подписчиков</div>';
      return;
    }

    emailsList.innerHTML = `
      <table class="emails-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Email</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Страница</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${emails.map((entry, i) => `
            <tr>
              <td>${i + 1}</td>
              <td class="email-cell">${entry.email}</td>
              <td>${entry.date}</td>
              <td>${entry.time}</td>
              <td>${entry.page}</td>
              <td><button class="admin-btn danger btn-sm" data-remove-email="${i}">✕</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Кнопки удаления отдельных записей
    emailsList.querySelectorAll('[data-remove-email]').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.dataset.removeEmail);
        let raw = [];
        try { raw = JSON.parse(localStorage.getItem(EMAILS_KEY)) || []; } catch {}
        raw.splice(idx, 1);
        localStorage.setItem(EMAILS_KEY, JSON.stringify(raw));
        renderEmails();
      });
    });
  }

  // Copy emails (только адреса, по одному на строку)
  function copyEmails() {
    const emails = getEmails();
    const text = emails.map(e => e.email).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Email скопированы (' + emails.length + ' шт.)');
    }).catch(() => {
      alert('Не удалось скопировать');
    });
  }

  // Скачать CSV
  function downloadCSV() {
    const emails = getEmails();
    if (emails.length === 0) { alert('Нет подписчиков для экспорта'); return; }
    const BOM = '\uFEFF'; // для корректного отображения кириллицы в Excel
    const header = 'Email,Дата,Время,Страница';
    const rows = emails.map(e =>
      `"${e.email}","${e.date}","${e.time}","${e.page}"`
    );
    const csv = BOM + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trustthehood_emails_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Скачать JSON
  function downloadJSON() {
    const emails = getEmails();
    if (emails.length === 0) { alert('Нет подписчиков для экспорта'); return; }
    const json = JSON.stringify(emails, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trustthehood_emails_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Очистить все email
  function clearEmails() {
    const emails = getEmails();
    if (emails.length === 0) { alert('Список уже пуст'); return; }
    if (confirm('Удалить всех ' + emails.length + ' подписчиков? Это действие нельзя отменить.')) {
      localStorage.removeItem(EMAILS_KEY);
      renderEmails();
    }
  }

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'emails') renderEmails();
    });
  });

  // Button handlers
  document.getElementById('addProductBtn')?.addEventListener('click', openNewModal);
  document.getElementById('reloadFromFileBtn')?.addEventListener('click', loadFromShopHtml);
  document.getElementById('saveProductBtn')?.addEventListener('click', saveFromModal);
  document.getElementById('cancelProductBtn')?.addEventListener('click', () => productModal.classList.remove('active'));
  document.getElementById('productModalClose')?.addEventListener('click', () => productModal.classList.remove('active'));
  document.getElementById('copyEmailsBtn')?.addEventListener('click', copyEmails);
  document.getElementById('downloadCsvBtn')?.addEventListener('click', downloadCSV);
  document.getElementById('downloadJsonBtn')?.addEventListener('click', downloadJSON);
  document.getElementById('clearEmailsBtn')?.addEventListener('click', clearEmails);

  // Init
  loadProducts();
  renderProducts();
});
