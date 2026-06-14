// TrustTheHood — Main JS (with API backend)
document.addEventListener('DOMContentLoaded', async () => {

  // ---------- HEADER SCROLL BEHAVIOR ----------
  const header = document.querySelector('header');
  function handleScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- BURGER MENU ----------
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  function closeMenu() { if (mobileNav) mobileNav.classList.remove('active'); if (burger) burger.classList.remove('active'); }
  function toggleMenu() { if (mobileNav && mobileNav.classList.contains('active')) closeMenu(); else { if (mobileNav) mobileNav.classList.add('active'); if (burger) burger.classList.add('active'); } }
  if (burger) burger.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileLinks) mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ---------- ANNOUNCEMENT BAR BODY CLASS ----------
  if (document.querySelector('.announcement-bar')) document.body.classList.add('has-announcement');

  // ---------- SIZE SELECTOR ----------
  document.querySelectorAll('.size-btn:not(.sold-out)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn:not(.sold-out)').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // ---------- FADE IN ON SCROLL ----------
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.15 });
  fadeElements.forEach(el => observer.observe(el));

  // ========== LOAD PRODUCTS FROM API ==========
  const productGrid = document.getElementById('productGrid');
  const isShopPage = window.location.pathname.endsWith('shop.html') || window.location.pathname === '/shop';

  if (isShopPage && productGrid && typeof API !== 'undefined') {
    let products = [];
    try {
      products = await API.getProducts();
      productGrid.innerHTML = products.map(p => API.renderProductCard(p)).join('');
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      productGrid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#999;grid-column:1/-1;">Ошибка загрузки товаров. Убедитесь что сервер запущен.</div>';
    }

    // Инициализация отдельно — ошибка здесь не затирает уже загруженные товары
    if (products.length > 0) {
      try { initGalleryDots(); } catch(e) { console.error('initGalleryDots error:', e); }
      try { initFavoriteButtons(); } catch(e) { console.error('initFavoriteButtons error:', e); }
      try { applyShopFilter(); } catch(e) { console.error('applyShopFilter error:', e); }
      try { applyFilters(); } catch(e) { console.error('applyFilters error:', e); }
    }
  }

  // ========== FAVORITES SYSTEM (localStorage) ==========
  const FAV_KEY = 'trustthehood_favorites';
  const TG_URL = 'https://web.telegram.org/k/#@TTH_Manager';
  const VK_URL = 'https://vk.com/im/convo/-165228918?entrypoint=community_page&tab=all';

  function getFavorites() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } }
  function saveFavorites(items) { localStorage.setItem(FAV_KEY, JSON.stringify(items)); }
  function isFavorite(id) { return getFavorites().some(item => item.id === id); }

  function toggleFavorite(id, name, price, color, size) {
    let favs = getFavorites();
    const idx = favs.findIndex(item => item.id === id);
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      // Get images from the card in DOM
      const card = document.querySelector(`.favorite-btn[data-id="${id}"]`)?.closest('.product-card');
      const images = [];
      if (card) {
        card.querySelectorAll('.gallery-img').forEach(img => images.push(img.getAttribute('src')));
      }
      const sku = card ? (card.dataset.sku || '') : '';
      favs.push({ id, name, price, color, size: size || '—', images, sku });
    }
    saveFavorites(favs);
    return favs;
  }

  function updateFavoriteButtons() {
    const favs = getFavorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (favs.some(item => item.id === id)) {
        btn.classList.add('active');
        btn.textContent = '♥';
      } else {
        btn.classList.remove('active');
        btn.textContent = btn.classList.contains('product-fav-btn') ? '♡ Добавить в избранное' : '♡';
      }
    });
  }

  function handleFavoriteClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const btn = this;
    const card = btn.closest('.product-card');
    if (card && card.classList.contains('sold-out')) { showToast('Этот товар продан'); return; }
    const id = btn.dataset.id;
    const name = card ? card.dataset.name : 'Товар';
    const price = card ? card.dataset.price : '';
    const color = card ? card.dataset.color : '';
    toggleFavorite(id, name, price, color);
    updateFavoriteButtons();
  }

  function initFavoriteButtons() {
    document.querySelectorAll('.favorite-btn:not(.product-fav-btn)').forEach(btn => {
      btn.removeEventListener('click', handleFavoriteClick);
      btn.addEventListener('click', handleFavoriteClick);
    });
    updateFavoriteButtons();
  }

  initFavoriteButtons();

  // ---------- PRODUCT PAGE FAVORITE BUTTON ----------
  const productFavBtn = document.getElementById('productFavBtn');
  if (productFavBtn) {
    productFavBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const block = this.closest('.product-info-block');
      const id = this.dataset.id;
      const name = block ? block.dataset.name : '';
      const price = block ? block.dataset.price : '';
      const color = block ? block.dataset.color : '';
      const selectedSize = document.querySelector('.size-btn.selected');
      const size = selectedSize ? selectedSize.textContent : '—';
      toggleFavorite(id, name, price, color, size);
      updateFavoriteButtons();
    });
  }

  // ---------- IZBRANNOE PAGE ----------
  const favoritesList = document.getElementById('favoritesList');
  const favoritesEmpty = document.getElementById('favoritesEmpty');
  const favoritesSocial = document.getElementById('favoritesSocial');
  const favoritesSkuBlock = document.getElementById('favoritesSkuBlock');
  const favoritesSkuList = document.getElementById('favoritesSkuList');
  const favoritesSkuCopyBtn = document.getElementById('favoritesSkuCopyBtn');
  const favoritesSkuCopied = document.getElementById('favoritesSkuCopied');

  function renderFavorites() {
    if (!favoritesList) return;
    const favs = getFavorites();
    if (favs.length === 0) {
      favoritesList.style.display = 'none';
      if (favoritesEmpty) favoritesEmpty.style.display = 'flex';
      if (favoritesSocial) favoritesSocial.style.display = 'none';
      if (favoritesSkuBlock) favoritesSkuBlock.style.display = 'none';
      return;
    }
    favoritesList.style.display = 'grid';
    if (favoritesEmpty) favoritesEmpty.style.display = 'none';
    if (favoritesSocial) favoritesSocial.style.display = 'block';
    if (favoritesSkuBlock) favoritesSkuBlock.style.display = 'block';

    favoritesList.innerHTML = favs.map(item => {
      const images = item.images || [];
      let galleryHtml = images.length > 0
        ? images.map((src, i) => `<img class="gallery-img" data-index="${i}" src="${src}" alt="${item.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${i === 0 ? 1 : 0};transition:opacity 0.25s ease;z-index:1;">`).join('') +
          `<div class="gallery-dots" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:5;pointer-events:none;">${images.map((_, i) => `<span class="gallery-dot" data-index="${i}" style="width:24px;height:3px;border-radius:2px;background:rgba(17,17,17,0.3);cursor:pointer;pointer-events:all;transition:background 0.2s;"></span>`).join('')}</div>`
        : '<div class="fav-card-image">IMG</div>';
      const sku = item.sku || '';
      return `<div class="product-card" data-id="${item.id}">
        <div class="product-image" style="position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;margin-bottom:12px;background:#f5f5f5;">${galleryHtml}</div>
        <div class="product-title">${item.name}</div>
        <div class="product-card-details" style="font-size:12px;color:#777;margin-bottom:4px;">Цвет: ${item.color} · Размер: ${item.size || '—'}</div>
        ${sku ? `<div class="product-card-sku" style="font-size:11px;color:#999;margin-bottom:4px;letter-spacing:0.05em;">Артикул: ${sku}</div>` : ''}
        <div class="product-price">${item.price} ₽</div>
        <button class="fav-card-remove" data-id="${item.id}" style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;background:none;border:none;border-bottom:1px solid #111;padding:0 0 2px;cursor:pointer;font-family:'Inter',sans-serif;color:#111;margin-top:12px;transition:opacity 0.2s;">Удалить</button>
      </div>`;
    }).join('');

    document.querySelectorAll('.fav-card-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        let favs = getFavorites().filter(item => item.id !== this.dataset.id);
        saveFavorites(favs);
        renderFavorites();
        updateFavoriteButtons();
      });
    });

    // Gallery dots for favorites
    document.querySelectorAll('#favoritesList .gallery-dots').forEach(dotsContainer => {
      const dots = dotsContainer.querySelectorAll('.gallery-dot');
      const imageContainer = dotsContainer.closest('.product-image');
      const images = imageContainer ? imageContainer.querySelectorAll('.gallery-img') : [];
      if (images.length === 0) return;
      dots.forEach((dot, index) => {
        dot.addEventListener('mouseenter', () => { images.forEach((img, i) => { img.style.opacity = i === index ? '1' : '0'; }); });
      });
    });

    updateSkuList(favs);
    updateOrderLinks(favs);
  }

  function updateSkuList(favs) {
    if (!favoritesSkuList) return;
    if (!favs || favs.length === 0) { if (favoritesSkuBlock) favoritesSkuBlock.style.display = 'none'; return; }
    const skuLines = favs.map(item => `${item.sku || '—'} — ${item.name}${item.color ? ' (' + item.color + ')' : ''}`);
    favoritesSkuList.innerHTML = skuLines.join('<br>');
    favoritesSkuList.dataset.fullText = skuLines.join('\n');
  }

  if (favoritesSkuCopyBtn) {
    favoritesSkuCopyBtn.addEventListener('click', function() {
      const text = favoritesSkuList ? favoritesSkuList.dataset.fullText || favoritesSkuList.textContent : '';
      navigator.clipboard.writeText(text).then(() => {
        if (favoritesSkuCopied) { favoritesSkuCopied.style.display = 'block'; setTimeout(() => { favoritesSkuCopied.style.display = 'none'; }, 2500); }
      }).catch(() => alert('Не удалось скопировать'));
    });
  }

  function generateOrderMessage(favs) {
    if (!favs || favs.length === 0) return 'Здравствуйте! Хочу оформить заказ.';
    let msg = 'Здравствуйте! Хочу заказать:\n';
    favs.forEach((item, i) => { msg += `${i + 1}. ${item.name}${item.sku ? ' [' + item.sku + ']' : ''} — ${item.price} — Цвет: ${item.color}, Размер: ${item.size || '—'}\n`; });
    return encodeURIComponent(msg);
  }

  function updateOrderLinks(favs) {
    const tgLink = document.getElementById('favOrderTg');
    const vkLink = document.getElementById('favOrderVk');
    if (tgLink) tgLink.href = TG_URL;
    if (vkLink) vkLink.href = VK_URL;
  }

  // ---------- MODALS ----------
  function setupModal(btnId, modalId, closeId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if (!modal) return;
    function open() { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function shut() { modal.classList.remove('active'); document.body.style.overflow = ''; }
    if (btn) btn.addEventListener('click', function(e) { e.preventDefault(); open(); });
    if (close) close.addEventListener('click', shut);
    modal.addEventListener('click', function(e) { if (e.target === modal) shut(); });
    return { open, shut };
  }

  const orderModalCtrl = setupModal(null, 'orderModal', 'orderModalClose');
  setupModal('returnBtn', 'returnModal', 'returnModalClose');
  setupModal('deliveryBtn', 'deliveryModal', 'deliveryModalClose');
  setupModal('termsBtn', 'termsModal', 'termsModalClose');
  setupModal('privacyBtn', 'privacyModal', 'privacyModalClose');
  const newsletterModalCtrl = setupModal(null, 'newsletterModal', 'newsletterModalClose');

  // ---------- NEWSLETTER SUBSCRIPTION (API) ----------
  const newsletterEmail = document.querySelector('footer #newsletterEmail') || document.getElementById('newsletterEmail');
  const newsletterBtn = document.querySelector('footer #newsletterBtn') || document.getElementById('newsletterBtn');
  const newsletterError = document.querySelector('footer #newsletterError') || document.getElementById('newsletterError');
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  function isValidEmail(email) {
    if (!email || !emailRegex.test(email)) return false;
    const domain = email.split('@')[1] || '';
    if (domain === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) return false;
    return true;
  }

  async function handleNewsletterSubmit() {
    const email = newsletterEmail ? newsletterEmail.value.trim() : '';
    if (!isValidEmail(email)) { if (newsletterError) newsletterError.classList.add('show'); return; }
    if (newsletterError) newsletterError.classList.remove('show');

    // Send to API
    try {
      if (typeof API !== 'undefined') {
        await API.subscribe(email, window.location.pathname.split('/').pop() || 'index.html');
      }
    } catch (err) {
      console.error('Ошибка подписки:', err);
    }

    // Also save to localStorage as backup
    const EMAILS_KEY = 'trustthehood_emails';
    let emails = [];
    try { emails = JSON.parse(localStorage.getItem(EMAILS_KEY)) || []; } catch {}
    const alreadyExists = emails.some(entry => (typeof entry === 'string' ? entry : entry.email) === email);
    if (!alreadyExists) {
      const now = new Date();
      emails.push({ email, date: now.toLocaleDateString('ru-RU'), time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), timestamp: now.toISOString(), page: window.location.pathname.split('/').pop() || 'index.html' });
      localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    }

    if (newsletterEmail) newsletterEmail.value = '';
    if (newsletterModalCtrl) newsletterModalCtrl.open();
  }

  if (newsletterBtn) newsletterBtn.addEventListener('click', function(e) { e.preventDefault(); handleNewsletterSubmit(); });
  if (newsletterEmail) {
    newsletterEmail.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleNewsletterSubmit(); } });
    newsletterEmail.addEventListener('input', function() { if (this.value.trim() && newsletterError) newsletterError.classList.remove('show'); });
  }

  // ---------- SHOP FILTER (sale / new) ----------
  const shopTitle = document.getElementById('shopTitle');
  const shopSectionLabel = document.querySelector('#shopHeader .section-label');

  function applyShopFilter() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (!shopTitle || !productGrid) return;
    if (filter === 'sale') {
      shopTitle.textContent = 'Товары со скидкой';
      if (shopSectionLabel) shopSectionLabel.textContent = '— Скидки';
      document.title = 'TrustTheHood — Скидки';
      productGrid.querySelectorAll('.product-card').forEach(card => { card.style.display = card.dataset.tag === 'sale' ? '' : 'none'; });
    } else if (filter === 'new') {
      shopTitle.textContent = 'Новинки';
      if (shopSectionLabel) shopSectionLabel.textContent = '— Новое';
      document.title = 'TrustTheHood — Новинки';
      productGrid.querySelectorAll('.product-card').forEach(card => { card.style.display = card.dataset.tag === 'new' ? '' : 'none'; });
    }
  }

  // ---------- GALLERY DOTS + TOUCH SWIPE ----------
  function showGallerySlide(imageContainer, index) {
    const images = imageContainer.querySelectorAll('.gallery-img');
    const dots = imageContainer.querySelectorAll('.gallery-dot');
    if (images.length === 0) return;
    const total = images.length;
    const i = ((index % total) + total) % total;
    images.forEach((img, idx) => { img.style.opacity = idx === i ? '1' : '0'; });
    dots.forEach((dot, idx) => { dot.style.background = idx === i ? 'rgba(17,17,17,0.8)' : 'rgba(17,17,17,0.3)'; });
    imageContainer.dataset.currentSlide = i;
  }

  function initGalleryDots() {
    document.querySelectorAll('.gallery-dots').forEach(dotsContainer => {
      const dots = dotsContainer.querySelectorAll('.gallery-dot');
      const imageContainer = dotsContainer.closest('.product-image');
      const images = imageContainer ? imageContainer.querySelectorAll('.gallery-img') : [];
      if (images.length === 0) return;

      showGallerySlide(imageContainer, 0);

      dots.forEach((dot, index) => {
        dot.addEventListener('mouseenter', () => showGallerySlide(imageContainer, index));
      });

      imageContainer.addEventListener('mouseleave', () => showGallerySlide(imageContainer, 0));

      let touchStartX = 0, touchStartY = 0;
      imageContainer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
      imageContainer.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
          const current = parseInt(imageContainer.dataset.currentSlide || '0', 10);
          showGallerySlide(imageContainer, dx < 0 ? current + 1 : current - 1);
        }
      }, { passive: true });
    });
  }

  // Init gallery dots for non-dynamic pages
  if (!isShopPage) initGalleryDots();

  // ---------- FILTER TOGGLE ----------
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', function() { filterPanel.classList.toggle('active'); this.classList.toggle('active'); });
  }

  // ---------- COMBINED FILTER ----------
  const searchInput = document.getElementById('searchInput');
  const filterCategory = document.getElementById('filterCategory');
  const filterColor = document.getElementById('filterColor');
  const filterPrice = document.getElementById('filterPrice');

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (!isShopPage && query !== '') { window.location.href = 'shop.html?search=' + encodeURIComponent(query); return; }
    const category = filterCategory ? filterCategory.value : '';
    const priceVal = filterPrice ? filterPrice.value : '';
    const colorEl = filterColor ? filterColor.querySelector('.filter-color-btn.active') : null;
    const color = colorEl ? colorEl.dataset.color : '';

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const sku = (card.dataset.sku || '').toLowerCase();
      const matchesSearch = query === '' || name.includes(query) || sku.includes(query);
      const matchesCategory = category === '' || (card.dataset.category || '').toLowerCase() === category;
      const matchesColor = color === '' || (card.dataset.color || '').toLowerCase() === color.toLowerCase();
      let matchesPrice = true;
      if (priceVal !== '') {
        const numPrice = parseInt((card.dataset.price || '').replace(/\s/g, '').replace('₽', ''), 10);
        if (!isNaN(numPrice)) {
          if (priceVal === '0-5000') matchesPrice = numPrice <= 5000;
          else if (priceVal === '5000-10000') matchesPrice = numPrice > 5000 && numPrice <= 10000;
          else if (priceVal === '10000-20000') matchesPrice = numPrice > 10000 && numPrice <= 20000;
          else if (priceVal === '20000+') matchesPrice = numPrice > 20000;
        }
      }
      card.style.display = (matchesSearch && matchesCategory && matchesColor && matchesPrice) ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); applyFilters(); } });
  }
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterPrice) filterPrice.addEventListener('change', applyFilters);
  if (filterColor) {
    filterColor.addEventListener('click', function(e) {
      const btn = e.target.closest('.filter-color-btn');
      if (!btn) return;
      this.querySelectorAll('.filter-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  }

  if (isShopPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput) { searchInput.value = searchQuery; applyFilters(); }
  }

  // ---------- TOAST ----------
  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:9999;background:#111;color:#fff;padding:12px 24px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-family:"Inter",sans-serif;border-radius:0;opacity:0;transition:opacity 0.3s ease;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
  }

  // ---------- STORAGE SYNC ----------
  window.addEventListener('storage', (e) => { if (e.key === FAV_KEY) { updateFavoriteButtons(); renderFavorites(); } });

  // ---------- INIT ----------
  updateFavoriteButtons();
  renderFavorites();

  const orderModal = document.getElementById('orderModal');
  if (orderModal && orderModalCtrl && !sessionStorage.getItem('orderModalShown')) {
    setTimeout(() => { orderModalCtrl.open(); sessionStorage.setItem('orderModalShown', 'true'); }, 1500);
  }
});
