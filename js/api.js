// TrustTheHood — API Client Module with localStorage fallback
const API = {
  baseUrl: '',
  CACHE_KEY: 'tth_products_cache',
  CACHE_TTL: 1000 * 60 * 60, // 1 hour

  // ─── Cache helpers ───────────────────────────────────────────────
  _saveCache(products) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        ts: Date.now(),
        data: products
      }));
    } catch (e) { /* quota exceeded — ignore */ }
  },

  _loadCache() {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return null;
      const cache = JSON.parse(raw);
      // Return cache even if stale (fallback mode)
      return cache.data || null;
    } catch { return null; }
  },

  _isCacheFresh() {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return false;
      const cache = JSON.parse(raw);
      return cache.ts && (Date.now() - cache.ts < this.CACHE_TTL);
    } catch { return false; }
  },

  // ─── Products ────────────────────────────────────────────────────
  async getProducts() {
    try {
      const res = await fetch(this.baseUrl + '/api/products');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const products = await res.json();
      // Save to cache on success
      this._saveCache(products);
      return products;
    } catch (err) {
      console.warn('API недоступен, пробуем кэш:', err.message);
      const cached = this._loadCache();
      if (cached && cached.length > 0) {
        console.log('Загружено из кэша:', cached.length, 'товаров');
        return cached;
      }
      throw new Error('Сервер недоступен и нет кэшированных данных');
    }
  },

  async getProduct(id) {
    try {
      const res = await fetch(this.baseUrl + '/api/products/' + encodeURIComponent(id));
      if (!res.ok) throw new Error('Товар не найден');
      return res.json();
    } catch (err) {
      // Try to find in cache
      const cached = this._loadCache();
      if (cached) {
        const found = cached.find(p => p.id == id || p.data_id === id);
        if (found) return found;
      }
      throw err;
    }
  },

  // ─── Subscribe ───────────────────────────────────────────────────
  async subscribe(email, page) {
    try {
      const res = await fetch(this.baseUrl + '/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, page })
      });
      return res.json();
    } catch (err) {
      // Save locally if server is down
      console.warn('Подписка сохранена локально (сервер недоступен)');
      const PENDING_KEY = 'tth_pending_subs';
      let pending = [];
      try { pending = JSON.parse(localStorage.getItem(PENDING_KEY)) || []; } catch {}
      pending.push({ email, page, ts: Date.now() });
      localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      return { message: 'Подписка сохранена (будет отправлена при подключении к серверу)' };
    }
  },

  // ─── Render product card HTML ────────────────────────────────────
  renderProductCard(product) {
    const soldOutClass = product.sold_out ? ' sold-out' : '';
    const images = product.images || [];
    const dataId = product.data_id || '';
    const tag = product.tag || '';

    let galleryHtml = images.map((src, i) =>
      `<img class="gallery-img" data-index="${i}" src="${src}" alt="${product.name}">`
    ).join('');

    let dotsHtml = images.map((_, i) =>
      `<span class="gallery-dot" data-index="${i}"></span>`
    ).join('');

    let priceHtml = '';
    if (product.old_price && product.sold_out) {
      priceHtml = `<span class="old-price">${product.old_price} ₽</span><span class="sale-price">${product.price} ₽</span> <span class="sold-out-label">продано</span>`;
    } else if (product.old_price) {
      priceHtml = `<span class="old-price">${product.old_price} ₽</span><span class="sale-price">${product.price} ₽</span>`;
    } else if (product.sold_out) {
      priceHtml = `${product.price} ₽`;
    } else {
      priceHtml = `${product.price} ₽`;
    }

    const tagAttr = tag ? ` data-tag="${tag}"` : '';

    return `
      <div class="product-card${soldOutClass}" data-name="${product.name}" data-price="${product.price}" data-color="${product.color}" data-category="${product.category}" data-sku="${product.sku || ''}"${tagAttr} data-id="${product.id}">
        <div class="product-image">
          ${galleryHtml}
          <button class="favorite-btn" data-id="${dataId}">♡</button>
          ${product.sold_out ? '<div class="product-overlay"></div>' : ''}
          <div class="gallery-dots">
            ${dotsHtml}
          </div>
        </div>
        <div class="product-title">${product.name}</div>
        <div class="product-price">${priceHtml}</div>
      </div>`;
  },

  // ─── Render product grid ─────────────────────────────────────────
  async renderProductGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const products = await this.getProducts();
      container.innerHTML = products.map(p => this.renderProductCard(p)).join('');
      return products;
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      container.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">Ошибка загрузки товаров. Запустите сервер: node server.js</div>';
      return [];
    }
  }
};
