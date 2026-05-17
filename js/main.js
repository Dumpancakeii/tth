// TrustTheHood — Main JS
document.addEventListener('DOMContentLoaded', () => {

  // ---------- HEADER SCROLL BEHAVIOR ----------
  const header = document.querySelector('header');
  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- BURGER MENU ----------
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  function openMenu() { if (mobileNav) mobileNav.classList.add('active'); }
  function closeMenu() { if (mobileNav) mobileNav.classList.remove('active'); }
  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileLinks) {
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  // ---------- ANNOUNCEMENT BAR BODY CLASS ----------
  const announcementBar = document.querySelector('.announcement-bar');
  if (announcementBar) {
    document.body.classList.add('has-announcement');
  }

  // ---------- SIZE SELECTOR ----------
  const sizeBtns = document.querySelectorAll('.size-btn:not(.sold-out)');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // ---------- FADE IN ON SCROLL ----------
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeElements.forEach(el => observer.observe(el));

  // ========== FAVORITES SYSTEM (localStorage) ==========
  const FAV_KEY = 'trustthehood_favorites';
  const TG_URL = 'https://web.telegram.org/k/#@TTH_Manager';
  const VK_URL = 'https://vk.com/im/convo/-165228918?entrypoint=community_page&tab=all';

  // Product images data for favorites gallery
  const FAV_IMAGES = {
    'bomber-hjelp1': [
      'assets/images/Бомбер HJELP1.jpg',
      'assets/images/Бомбер HJELP2.jpg',
      'assets/images/Бомбер HJELP3.jpg',
      'assets/images/Бомбер HJELP4.jpg'
    ],
    'pants-codered': [
      'assets/images/Брюки CODERED Ultrawide Summer1.jpg',
      'assets/images/Брюки CODERED Ultrawide Summer2.jpg',
      'assets/images/Брюки CODERED Ultrawide Summer3.jpg',
      'assets/images/Брюки CODERED Ultrawide Summer4.jpg',
      'assets/images/Брюки CODERED Ultrawide Summer5.jpg',
      'assets/images/Брюки CODERED Ultrawide Summer6.jpg'
    ],
    'salomon-xt6': [
      'assets/images/Кроссовки Salomon XT-61.jpg',
      'assets/images/Кроссовки Salomon XT-62.jpg',
      'assets/images/Кроссовки Salomon XT-63.jpg'
    ],
    'cap-cp-adidas': [
      'assets/images/Кепка C.P. COMPANY x ADIDAS1.jpg',
      'assets/images/Кепка C.P. COMPANY x ADIDAS2.jpg',
      'assets/images/Кепка C.P. COMPANY x ADIDAS3.jpg'
    ]
  };

  // Get favorites from localStorage
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch {
      return [];
    }
  }

  // Save favorites to localStorage
  function saveFavorites(items) {
    localStorage.setItem(FAV_KEY, JSON.stringify(items));
  }

  // Check if a product is in favorites by ID
  function isFavorite(id) {
    return getFavorites().some(item => item.id === id);
  }

  // Toggle favorite status
  function toggleFavorite(id, name, price, color, size) {
    let favs = getFavorites();
    const idx = favs.findIndex(item => item.id === id);
    if (idx !== -1) {
      favs.splice(idx, 1);
    } else {
      const images = FAV_IMAGES[id] || [];
      favs.push({ id, name, price, color, size: size || '—', images });
    }
    saveFavorites(favs);
    return favs;
  }

  // Update all favorite buttons on the page
  function updateFavoriteButtons() {
    const favs = getFavorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (favs.some(item => item.id === id)) {
        btn.classList.add('active');
        btn.textContent = '♥';
      } else {
        btn.classList.remove('active');
        if (btn.classList.contains('product-fav-btn')) {
          btn.textContent = '♡ Добавить в избранное';
        } else {
          btn.textContent = '♡';
        }
      }
    });
  }

  // Favorite button click handler
  function handleFavoriteClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const btn = this;
    const card = btn.closest('.product-card');
    const id = btn.dataset.id;
    const name = card ? card.dataset.name : 'Товар';
    const price = card ? card.dataset.price : '';
    const color = card ? card.dataset.color : '';
    toggleFavorite(id, name, price, color);
    updateFavoriteButtons();
  }

  // Attach favorite buttons
  document.querySelectorAll('.favorite-btn:not(.product-fav-btn)').forEach(btn => {
    btn.addEventListener('click', handleFavoriteClick);
  });

  // ---------- PRODUCT PAGE FAVORITE BUTTON ----------
  const productFavBtn = document.getElementById('productFavBtn');
  if (productFavBtn) {
    productFavBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const block = this.closest('.product-info-block');
      const id = this.dataset.id;
      const name = block ? block.dataset.name : 'Raw Hoodie — Black';
      const price = block ? block.dataset.price : '7 800 ₽';
      const color = block ? block.dataset.color : 'Black';
      const selectedSize = document.querySelector('.size-btn.selected');
      const size = selectedSize ? selectedSize.textContent : '—';
      toggleFavorite(id, name, price, color, size);
      updateFavoriteButtons();
    });
  }

  // ---------- IZBRANNOE PAGE: render favorites list ----------
  const favoritesList = document.getElementById('favoritesList');
  const favoritesEmpty = document.getElementById('favoritesEmpty');
  const favoritesSocial = document.getElementById('favoritesSocial');

  function renderFavorites() {
    if (!favoritesList) return;
    const favs = getFavorites();

    if (favs.length === 0) {
      favoritesList.style.display = 'none';
      if (favoritesEmpty) favoritesEmpty.style.display = 'flex';
      if (favoritesSocial) favoritesSocial.style.display = 'none';
      return;
    }

    favoritesList.style.display = 'grid';
    if (favoritesEmpty) favoritesEmpty.style.display = 'none';
    if (favoritesSocial) favoritesSocial.style.display = 'block';

    favoritesList.innerHTML = favs.map(item => {
      const images = item.images || [];
      let galleryHtml = '';
      if (images.length > 0) {
        galleryHtml = images.map((src, i) =>
          `<img class="gallery-img" data-index="${i}" src="${src}" alt="${item.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:${i === 0 ? 1 : 0};transition:opacity 0.25s ease;z-index:1;">`
        ).join('');
        galleryHtml += `<div class="gallery-dots" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:5;pointer-events:none;">
          ${images.map((_, i) => `<span class="gallery-dot" data-index="${i}" style="width:24px;height:3px;border-radius:2px;background:rgba(17,17,17,0.3);cursor:pointer;pointer-events:all;transition:background 0.2s;"></span>`).join('')}
        </div>`;
      } else {
        galleryHtml = '<div class="fav-card-image">IMG</div>';
      }
      return `
      <div class="product-card" data-id="${item.id}">
        <div class="product-image" style="position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;margin-bottom:12px;background:#f5f5f5;">
          ${galleryHtml}
        </div>
        <div class="product-title">${item.name}</div>
        <div class="product-card-details" style="font-size:12px;color:#777;margin-bottom:4px;">Цвет: ${item.color} · Размер: ${item.size || '—'}</div>
        <div class="product-price">${item.price} ₽</div>
        <button class="fav-card-remove" data-id="${item.id}" style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;background:none;border:none;border-bottom:1px solid #111;padding:0 0 2px;cursor:pointer;font-family:'Inter',sans-serif;color:#111;margin-top:12px;transition:opacity 0.2s;">Удалить</button>
      </div>`;
    }).join('');

    // Remove buttons
    document.querySelectorAll('.fav-card-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.dataset.id;
        let favs = getFavorites();
        favs = favs.filter(item => item.id !== id);
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
        dot.addEventListener('mouseenter', () => {
          images.forEach((img, i) => {
            img.style.opacity = i === index ? '1' : '0';
          });
        });
      });
      if (imageContainer) {
        imageContainer.addEventListener('mouseleave', () => {
          images.forEach((img, i) => {
            img.style.opacity = i === 0 ? '1' : '0';
          });
        });
      }
    });

    updateOrderLinks(favs);
  }

  // ---------- GENERATE ORDER MESSAGE ----------
  function generateOrderMessage(favs) {
    if (!favs || favs.length === 0) {
      return 'Здравствуйте! Хочу оформить заказ.';
    }
    let msg = 'Здравствуйте! Хочу заказать:\n';
    favs.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} — ${item.price} — Цвет: ${item.color}, Размер: ${item.size || '—'}\n`;
    });
    return encodeURIComponent(msg);
  }

  function updateOrderLinks(favs) {
    const tgLink = document.getElementById('favOrderTg');
    const vkLink = document.getElementById('favOrderVk');
    const msg = generateOrderMessage(favs);
    if (tgLink) tgLink.href = TG_URL;
    if (vkLink) vkLink.href = VK_URL;
  }

  // ---------- ORDER MODAL ON INDEX ----------
  const orderModal = document.getElementById('orderModal');
  const orderModalClose = document.getElementById('orderModalClose');

  function openOrderModal() {
    if (orderModal) {
      orderModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOrderModal() {
    if (orderModal) {
      orderModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  // ---------- INFO PAGE MODALS (Возврат / Доставка) ----------
  const returnBtn = document.getElementById('returnBtn');
  const returnModal = document.getElementById('returnModal');
  const returnModalClose = document.getElementById('returnModalClose');
  const deliveryBtn = document.getElementById('deliveryBtn');
  const deliveryModal = document.getElementById('deliveryModal');
  const deliveryModalClose = document.getElementById('deliveryModalClose');

  function openReturnModal() {
    if (returnModal) { returnModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }
  function closeReturnModal() {
    if (returnModal) { returnModal.classList.remove('active'); document.body.style.overflow = ''; }
  }
  function openDeliveryModal() {
    if (deliveryModal) { deliveryModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }
  function closeDeliveryModal() {
    if (deliveryModal) { deliveryModal.classList.remove('active'); document.body.style.overflow = ''; }
  }

  if (returnBtn) returnBtn.addEventListener('click', function(e) { e.preventDefault(); openReturnModal(); });
  if (returnModalClose) returnModalClose.addEventListener('click', closeReturnModal);
  if (returnModal) returnModal.addEventListener('click', function(e) { if (e.target === returnModal) closeReturnModal(); });
  if (deliveryBtn) deliveryBtn.addEventListener('click', function(e) { e.preventDefault(); openDeliveryModal(); });
  if (deliveryModalClose) deliveryModalClose.addEventListener('click', closeDeliveryModal);
  if (deliveryModal) deliveryModal.addEventListener('click', function(e) { if (e.target === deliveryModal) closeDeliveryModal(); });

  // ---------- TERMS OF USE MODAL ----------
  const termsBtn = document.getElementById('termsBtn');
  const termsModal = document.getElementById('termsModal');
  const termsModalClose = document.getElementById('termsModalClose');

  function openTermsModal() { if (termsModal) { termsModal.classList.add('active'); document.body.style.overflow = 'hidden'; } }
  function closeTermsModal() { if (termsModal) { termsModal.classList.remove('active'); document.body.style.overflow = ''; } }
  if (termsBtn) termsBtn.addEventListener('click', function(e) { e.preventDefault(); openTermsModal(); });
  if (termsModalClose) termsModalClose.addEventListener('click', closeTermsModal);
  if (termsModal) termsModal.addEventListener('click', function(e) { if (e.target === termsModal) closeTermsModal(); });

  // ---------- PRIVACY POLICY MODAL ----------
  const privacyBtn = document.getElementById('privacyBtn');
  const privacyModal = document.getElementById('privacyModal');
  const privacyModalClose = document.getElementById('privacyModalClose');

  function openPrivacyModal() { if (privacyModal) { privacyModal.classList.add('active'); document.body.style.overflow = 'hidden'; } }
  function closePrivacyModal() { if (privacyModal) { privacyModal.classList.remove('active'); document.body.style.overflow = ''; } }
  if (privacyBtn) privacyBtn.addEventListener('click', function(e) { e.preventDefault(); openPrivacyModal(); });
  if (privacyModalClose) privacyModalClose.addEventListener('click', closePrivacyModal);
  if (privacyModal) privacyModal.addEventListener('click', function(e) { if (e.target === privacyModal) closePrivacyModal(); });

  // ---------- NEWSLETTER SUBSCRIPTION ----------
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterError = document.getElementById('newsletterError');
  const newsletterModal = document.getElementById('newsletterModal');
  const newsletterModalClose = document.getElementById('newsletterModalClose');

  function openNewsletterModal() { if (newsletterModal) { newsletterModal.classList.add('active'); document.body.style.overflow = 'hidden'; } }
  function closeNewsletterModal() { if (newsletterModal) { newsletterModal.classList.remove('active'); document.body.style.overflow = ''; } }

  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : '';
      if (!email) { if (newsletterError) newsletterError.classList.add('show'); return; }
      if (newsletterError) newsletterError.classList.remove('show');
      if (newsletterEmail) newsletterEmail.value = '';
      openNewsletterModal();
    });
  }
  if (newsletterEmail) newsletterEmail.addEventListener('input', function() { if (this.value.trim()) { if (newsletterError) newsletterError.classList.remove('show'); } });
  if (newsletterModalClose) newsletterModalClose.addEventListener('click', closeNewsletterModal);
  if (newsletterModal) newsletterModal.addEventListener('click', function(e) { if (e.target === newsletterModal) closeNewsletterModal(); });

  // ---------- SHOP FILTER (Скидки / Новое) ----------
  const shopTitle = document.getElementById('shopTitle');
  const productGrid = document.getElementById('productGrid');
  const shopSectionLabel = document.querySelector('#shopHeader .section-label');

  function applyShopFilter() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (!shopTitle || !productGrid) return;
    if (filter === 'sale') {
      shopTitle.textContent = 'Товары со скидкой';
      if (shopSectionLabel) shopSectionLabel.textContent = '— Скидки';
      document.title = 'TrustTheHood — Скидки';
      productGrid.querySelectorAll('.product-card').forEach(card => {
        card.style.display = card.dataset.tag === 'sale' ? '' : 'none';
      });
    } else if (filter === 'new') {
      shopTitle.textContent = 'Новинки';
      if (shopSectionLabel) shopSectionLabel.textContent = '— Новое';
      document.title = 'TrustTheHood — Новинки';
      productGrid.querySelectorAll('.product-card').forEach(card => {
        card.style.display = card.dataset.tag === 'new' ? '' : 'none';
      });
    } else {
      shopTitle.textContent = 'Все товары';
      if (shopSectionLabel) shopSectionLabel.textContent = '— Коллекция';
      document.title = 'TrustTheHood — Магазин';
      productGrid.querySelectorAll('.product-card').forEach(card => { card.style.display = ''; });
    }
  }
  applyShopFilter();

  // ---------- PRODUCT GALLERY DOTS ----------
  document.querySelectorAll('.gallery-dots').forEach(dotsContainer => {
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    const imageContainer = dotsContainer.closest('.product-image');
    const images = imageContainer ? imageContainer.querySelectorAll('.gallery-img') : [];
    if (images.length === 0) return;

    images.forEach((img, i) => { img.style.opacity = i === 0 ? '1' : '0'; });

    dots.forEach((dot, index) => {
      dot.addEventListener('mouseenter', () => {
        images.forEach((img, i) => { img.style.opacity = i === index ? '1' : '0'; });
      });
    });

    if (imageContainer) {
      imageContainer.addEventListener('mouseleave', () => {
        images.forEach((img, i) => { img.style.opacity = i === 0 ? '1' : '0'; });
      });
    }
  });

  // ---------- STORAGE SYNC (cross-tab) ----------
  window.addEventListener('storage', (e) => {
    if (e.key === FAV_KEY) {
      updateFavoriteButtons();
      renderFavorites();
    }
  });

  // ---------- FILTER TOGGLE ----------
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', function () {
      filterPanel.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // ---------- COMBINED FILTER (search + category + color + price) ----------
  const searchInput = document.getElementById('searchInput');
  const filterCategory = document.getElementById('filterCategory');
  const filterColor = document.getElementById('filterColor');
  const filterPrice = document.getElementById('filterPrice');

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = filterCategory ? filterCategory.value : '';
    const priceVal = filterPrice ? filterPrice.value : '';
    const colorEl = filterColor ? filterColor.querySelector('.filter-color-btn.active') : null;
    const color = colorEl ? colorEl.dataset.color : '';

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      // Text search
      const name = (card.dataset.name || '').toLowerCase();
      const matchesSearch = query === '' || name.includes(query);

      // Category
      const cardCategory = (card.dataset.category || '').toLowerCase();
      const matchesCategory = category === '' || cardCategory === category;

      // Color
      const cardColor = (card.dataset.color || '').toLowerCase();
      const matchesColor = color === '' || cardColor === color.toLowerCase();

      // Price
      let matchesPrice = true;
      if (priceVal !== '') {
        const rawPrice = (card.dataset.price || '').replace(/\s/g, '').replace('₽', '').trim();
        const numPrice = parseInt(rawPrice, 10);
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

  // Attach filter events
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterCategory) filterCategory.addEventListener('change', applyFilters);
  if (filterPrice) filterPrice.addEventListener('change', applyFilters);
  if (filterColor) {
    filterColor.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-color-btn');
      if (!btn) return;
      this.querySelectorAll('.filter-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  }

  // ---------- INIT ----------
  updateFavoriteButtons();
  renderFavorites();

  if (orderModal && !sessionStorage.getItem('orderModalShown')) {
    setTimeout(() => {
      openOrderModal();
      sessionStorage.setItem('orderModalShown', 'true');
    }, 1500);
  }

});