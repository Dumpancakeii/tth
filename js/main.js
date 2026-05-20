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
  function openMenu() {
    if (mobileNav) mobileNav.classList.add('active');
    if (burger) burger.classList.add('active');
  }
  function closeMenu() {
    if (mobileNav) mobileNav.classList.remove('active');
    if (burger) burger.classList.remove('active');
  }
  function toggleMenu() {
    if (mobileNav && mobileNav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  if (burger) burger.addEventListener('click', toggleMenu);
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

  // Product images data for favorites gallery — all products
  const FAV_IMAGES = {
    'bomber-hjelp1': ['assets/images/Бомбер HJELP1.jpg','assets/images/Бомбер HJELP2.jpg','assets/images/Бомбер HJELP3.jpg','assets/images/Бомбер HJELP4.jpg'],
    'pants-codered': ['assets/images/Брюки CODERED Ultrawide Summer1.jpg','assets/images/Брюки CODERED Ultrawide Summer2.jpg','assets/images/Брюки CODERED Ultrawide Summer3.jpg','assets/images/Брюки CODERED Ultrawide Summer4.jpg','assets/images/Брюки CODERED Ultrawide Summer5.jpg','assets/images/Брюки CODERED Ultrawide Summer6.jpg'],
    'salomon-xt6': ['assets/images/Кроссовки Salomon XT-61.jpg','assets/images/Кроссовки Salomon XT-62.jpg','assets/images/Кроссовки Salomon XT-63.jpg'],
    'cap-cp-adidas': ['assets/images/Кепка C.P. COMPANY x ADIDAS1.jpg','assets/images/Кепка C.P. COMPANY x ADIDAS2.jpg','assets/images/Кепка C.P. COMPANY x ADIDAS3.jpg'],
    'pants-dickies-double-knee': ['assets/images/Брюки Dickies Double Knee Loose Fit1.jpg','assets/images/Брюки Dickies Double Knee Loose Fit2.jpg','assets/images/Брюки Dickies Double Knee Loose Fit3.jpg','assets/images/Брюки Dickies Double Knee Loose Fit4.jpg'],
    'pants-hjelp-baggy': ['assets/images/Брюки HJELP Baggy Fit1.jpg','assets/images/Брюки HJELP Baggy Fit2.jpg'],
    'jeans-carhartt-b13': ['assets/images/Джинсы Carhartt B13 Work Dungaree1.jpg','assets/images/Джинсы Carhartt B13 Work Dungaree2.jpg'],
    'jeans-rassvet': ['assets/images/Джинсы Rassvet1.jpg','assets/images/Джинсы Rassvet2.jpg','assets/images/Джинсы Rassvet3.jpg'],
    'jeans-oktyabr-baggy': ['assets/images/Джинсы Октябрь Baggy Fit1.jpg','assets/images/Джинсы Октябрь Baggy Fit2.jpg'],
    'jacket-hjelp-rain': ['assets/images/Куртка HJELP Rain Jacket1.jpg','assets/images/Куртка HJELP Rain Jacket2.jpg'],
    'rug-bitch': ['assets/images/Коврик ручной работы Bitch1.jpg'],
    'tshirt-codered-dacar': ['assets/images/Футболка CODERED Over T Dacar1.jpg','assets/images/Футболка CODERED Over T Dacar2.jpg'],
    'tshirt-codered-paint-tune': ['assets/images/Футболка CODERED Over T Paint Tune1.jpg','assets/images/Футболка CODERED Over T Paint Tune2.jpg'],
    'tshirt-codered-crumped-box': ['assets/images/Футболка CODERED Regular Crumped Box1.jpg','assets/images/Футболка CODERED Regular Crumped Box2.jpg'],
    'tshirt-codered-kusok-green': ['assets/images/Футболка CODERED Regular Кусок1.1.jpg','assets/images/Футболка CODERED Regular Кусок1.2.jpg'],
    'tshirt-codered-kusok-black': ['assets/images/Футболка CODERED Regular Кусок1.jpg','assets/images/Футболка CODERED Regular Кусок2.jpg'],
    'tshirt-codered-logo20-black': ['assets/images/Футболка CODERED Regular Лого 20 ТМ1.jpg','assets/images/Футболка CODERED Regular Лого 20 ТМ2.jpg'],
    'tshirt-codered-logo20-blue': ['assets/images/Футболка CODERED Regular Лого 20 ТМ1.1.jpg','assets/images/Футболка CODERED Regular Лого 20 ТМ1.2.jpg'],
    'tshirt-codered-paint-tune-2': ['assets/images/Футболка CODERED Over T Paint Tune1.1.jpeg','assets/images/Футболка CODERED Over T Paint Tune1.2.jpeg'],
    'tshirt-codered-logo20-tm-green': ['assets/images/Футболка CODERED Regular Лого 20 TM1.jpeg','assets/images/Футболка CODERED Regular Лого 20 TM2.jpeg'],
    'hoodie-codered-outline-logo-22': ['assets/images/Толстовка-крюнек CODERED Firm Outline Logo 22.1.jpeg','assets/images/Толстовка-крюнек CODERED Firm Outline Logo 22.2.jpeg'],
    'hoodie-codered-rolluppers': ['assets/images/Толстовка-крюнек CODERED Firm Wide Light Rolluppers1.jpeg','assets/images/Толстовка-крюнек CODERED Firm Wide Light Rolluppers2.jpeg'],
    'longsleeve-codered-puzir-black': ['assets/images/Футболка с длинным рукавом CODERED Пузырь1.jpeg','assets/images/Футболка с длинным рукавом CODERED Пузырь2.jpeg'],
    'hoodie-codered-piping-font': ['assets/images/Толстовка-крюнек CODERED Firm Wide Light Piping Font1.jpeg','assets/images/Толстовка-крюнек CODERED Firm Wide Light Piping Font2.jpeg'],
    'longsleeve-codered-puzir-gray': ['assets/images/Футболка с длинным рукавом CODERED Пузырь1.1.jpeg','assets/images/Футболка с длинным рукавом CODERED Пузырь1.2.jpeg'],
    'hoodie-codered-logo30-tm': ['assets/images/Толстовка-крюнек CODERED Firm Wide Лого 30 TM1.jpeg','assets/images/Толстовка-крюнек CODERED Firm Wide Лого 30 TM2.jpeg','assets/images/Толстовка-крюнек CODERED Firm Wide Лого 30 TM3.jpeg'],
    'hoodie-codered-reddy-boy': ['assets/images/Толстовка-крюнек CODERED Firm Wide Light Reddy Boy1.jpeg','assets/images/Толстовка-крюнек CODERED Firm Wide Light Reddy Boy2.jpeg'],
    'hoodie-codered-base-summer-logo-tm': ['assets/images/Толстовка CODERED Base Hoodie Wide Summer Лого TM1.jpeg','assets/images/Толстовка CODERED Base Hoodie Wide Summer Лого TM2.jpeg','assets/images/Толстовка CODERED Base Hoodie Wide Summer Лого TM3.jpeg','assets/images/Толстовка CODERED Base Hoodie Wide Summer Лого TM4.jpeg'],
    'pencil-case-codered-gray': ['assets/images/CODERED Пенал A Can1.jpeg','assets/images/CODERED Пенал A Can2.jpeg'],
    'pencil-case-codered-blue': ['assets/images/CODERED Пенал A Can1.1.jpeg','assets/images/CODERED Пенал A Can1.2.jpeg'],
    'pencil-case-codered-black': ['assets/images/CODERED Пенал A Can2.1.jpeg','assets/images/CODERED Пенал A Can2.2.jpeg'],
    'pencil-case-codered-graphite': ['assets/images/CODERED Пенал A Can3.1.jpeg','assets/images/CODERED Пенал A Can3.2.jpeg'],
    'hat-codered-logo-contour-black': ['assets/images/Шапка CODERED Лого Контур1.jpeg','assets/images/Шапка CODERED Лого Контур2.jpeg'],
    'hat-codered-rib-mix-short-white': ['assets/images/Шапка CODERED Rib Mix Short1.jpeg','assets/images/Шапка CODERED Rib Mix Short2.jpeg','assets/images/Шапка CODERED Rib Mix Short3.jpeg'],
    'hat-codered-logo-contour-gray': ['assets/images/Шапка CODERED Лого Контур2.1.jpeg','assets/images/Шапка CODERED Лого Контур2.2.jpeg'],
    'hat-codered-logo-contour-brown': ['assets/images/Шапка CODERED Лого Контур 3.1.jpeg','assets/images/Шапка CODERED Лого Контур 3.2.jpeg'],
    'hoodie-nb-tnt-gray': ['assets/images/Худи New Balance x Thisisneverthat1.jpeg','assets/images/Худи New Balance x Thisisneverthat2.jpeg'],
    'hoodie-nb-tnt-black': ['assets/images/Худи New Balance x Thisisneverthat2.1.jpeg','assets/images/Худи New Balance x Thisisneverthat2.2.jpeg'],
    'pants-bbc-lining-black': ['assets/images/Спортивные штаны Billionaire Boys Club x Li-Ning1.jpeg','assets/images/Спортивные штаны Billionaire Boys Club x Li-Ning2.jpeg'],
    'hoodie-bbc-lining-white': ['assets/images/Худи Billionaire Boys Club x Li-Ning1.jpeg','assets/images/Худи Billionaire Boys Club x Li-Ning2.jpeg'],
    'zip-hoodie-pleasures': ['assets/images/Зип-Худи Pleasures1.jpeg','assets/images/Зип-Худи Pleasures2.jpeg'],
    'hoodie-bbc-lining-black': ['assets/images/Худи Billionaire Boys Club x Li-Ning2.1.jpeg','assets/images/Худи Billionaire Boys Club x Li-Ning2.2.jpeg'],
    'puffer-carhartt-toronto': ['assets/images/Пуховик Carhartt WIP Toronto1.jpeg','assets/images/Пуховик Carhartt WIP Toronto2.jpeg','assets/images/Пуховик Carhartt WIP Toronto3.jpeg','assets/images/Пуховик Carhartt WIP Toronto4.jpeg','assets/images/Пуховик Carhartt WIP Toronto5.jpeg','assets/images/Пуховик Carhartt WIP Toronto6.jpeg'],
    'puffer-tnf': ['assets/images/Пуховик The North Face1.jpeg','assets/images/Пуховик The North Face2.jpeg'],
    'vest-bbc-lining': ['assets/images/Жилет утепленный Billionaire Boys Club x Li-Ning1.jpeg','assets/images/Жилет утепленный Billionaire Boys Club x Li-Ning2.jpeg','assets/images/Жилет утепленный Billionaire Boys Club x Li-Ning3.jpeg'],
    'pants-postaments-cargos': ['assets/images/Брюки Postaments Cargos1.jpeg','assets/images/Брюки Postaments Cargos2.jpeg','assets/images/Брюки Postaments Cargos3.jpeg'],
    'cap-postaments-dads': ['assets/images/Кепка Postaments Dad\'s Cap1.jpeg','assets/images/Кепка Postaments Dad\'s Cap2.jpeg','assets/images/Кепка Postaments Dad\'s Cap3.jpeg'],
    'hat-postaments-wordz': ['assets/images/Шапка Postaments Wordz.jpeg'],
    'hat-postaments-ollie-green': ['assets/images/Шапка Postaments Ollie.jpeg'],
    'cap-postaments-flat-white': ['assets/images/Кепка Postaments Flat1.jpeg','assets/images/Кепка Postaments Flat2.jpeg','assets/images/Кепка Postaments Flat3.jpeg'],
    'hat-postaments-ollie-gray': ['assets/images/Шапка Postaments Ollie1.jpeg'],
    'cap-postaments-five-pattern': ['assets/images/Кепка Postaments Five1.jpeg','assets/images/Кепка Postaments Five2.jpeg','assets/images/Кепка Postaments Five3.jpeg'],
    'hat-postaments-ollie-brown': ['assets/images/Шапка Postaments Ollie3.jpeg'],
    'cap-postaments-five-black': ['assets/images/Кепка Postaments Five2.1.jpeg','assets/images/Кепка Postaments Five2.2.jpeg','assets/images/Кепка Postaments Five2.3.jpeg'],
    'cap-postaments-flat-black': ['assets/images/Кепка Postaments Flat2.1.jpeg','assets/images/Кепка Postaments Flat2.2.jpeg','assets/images/Кепка Postaments Flat2.3.jpeg'],
    'cap-postaments-flat-pattern': ['assets/images/Кепка Postaments Flat3.1.jpeg','assets/images/Кепка Postaments Flat3.2.jpeg','assets/images/Кепка Postaments Flat3.3.jpeg'],
    'hoodie-postaments-cupids': ['assets/images/Худи Postaments Cupids Black1.jpeg','assets/images/Худи Postaments Cupids Black2.jpeg'],
    'hoodie-postaments-basic-choc': ['assets/images/Худи Postaments Basic SP\'25 Choc1.jpeg','assets/images/Худи Postaments Basic SP\'25 Choc2.jpeg'],
    'hoodie-postaments-dwarf': ['assets/images/Худи Postaments Dwarf Black1.jpeg','assets/images/Худи Postaments Dwarf Black2.jpeg'],
    'tshirt-postaments-shrooms': ['assets/images/Футболка Postaments Shrooms1.jpeg','assets/images/Футболка Postaments Shrooms2.jpeg'],
    'longsleeve-postaments-think': ['assets/images/Лонгслив Postaments Think1.jpeg','assets/images/Лонгслив Postaments Think2.jpeg'],
    'sweatshirt-postaments-p-logo-green': ['assets/images/Свитшот Postaments P Logo1.jpeg','assets/images/Свитшот Postaments P Logo2.jpeg','assets/images/Свитшот Postaments P Logo3.jpeg'],
    'sweatshirt-postaments-p-logo-black': ['assets/images/Свитшот Postaments P Logo2.1.jpeg','assets/images/Свитшот Postaments P Logo2.2.jpeg'],
    'tshirt-obey-white': ['assets/images/Футболка Obey1.jpeg','assets/images/Футболка Obey2.jpeg'],
    'tshirt-hockey': ['assets/images/Футболка Hockey1.jpeg','assets/images/Футболка Hockey2.jpeg'],
    'tshirt-obey-white-2': ['assets/images/Футболка Obey2.1.jpeg','assets/images/Футболка Obey2.2.jpeg'],
    'tshirt-awake-ny': ['assets/images/Футболка Awake NY1.jpeg','assets/images/Футболка Awake NY2.jpeg'],
    'jeans-oktyabr-baggy-blue': ['assets/images/Джинсы Октябрь Baggy2.1.jpeg','assets/images/Джинсы Октябрь Baggy2.2.jpeg'],
    'jeans-oktyabr-baggy-gray': ['assets/images/Джинсы Октябрь Baggy3.1.jpeg','assets/images/Джинсы Октябрь Baggy3.2.jpeg'],
    'jeans-oktyabr-classic': ['assets/images/Джинсы Октябрь Classic1.jpeg','assets/images/Джинсы Октябрь Classic2.jpeg'],
    'bag-hike': ['assets/images/Сумка Hike1.jpeg'],
    'hat-thrasher': ['assets/images/Шапка Thrasher1.jpeg'],
    'hat-obey-blue': ['assets/images/Шапка Obey1.jpeg'],
    'hat-huf-white': ['assets/images/Шапка HUF1.jpeg'],
    'hat-huf-brown': ['assets/images/Шапка HUF2.jpeg'],
    'hat-butter-goods': ['assets/images/Шапка Butter Goods1.jpeg'],
    'hat-stussy': ['assets/images/Шапка Stussy1.jpeg'],
    'hat-obey-black': ['assets/images/Шапка Obey2.jpeg'],
    'hat-fucking-awesome': ['assets/images/Шапка Fucking Awesome1.jpeg'],
  };

  // SKU mapping data-id -> SKU
  const SKU_MAP = {
    'bomber-hjelp1': 'TTH-BMBR-HJLP1',
    'pants-codered': 'TTH-PNTS-CDRED',
    'salomon-xt6': 'TTH-SLMN-XT6',
    'cap-cp-adidas': 'TTH-CAP-CPAD',
    'pants-dickies-double-knee': 'TTH-PNTS-DCKN',
    'pants-hjelp-baggy': 'TTH-PNTS-HJBG',
    'jeans-carhartt-b13': 'TTH-JNS-CHB13',
    'jeans-rassvet': 'TTH-JNS-RSVT',
    'jeans-oktyabr-baggy': 'TTH-JNS-OKBG',
    'jacket-hjelp-rain': 'TTH-JKT-HJRN',
    'rug-bitch': 'TTH-RUG-BTCH',
    'tshirt-codered-dacar': 'TTH-TSR-CRDC',
    'tshirt-codered-paint-tune': 'TTH-TSR-CRPT',
    'tshirt-codered-crumped-box': 'TTH-TSR-CRCB',
    'tshirt-codered-kusok-green': 'TTH-TSR-CRKG',
    'tshirt-codered-kusok-black': 'TTH-TSR-CRKB',
    'tshirt-codered-logo20-black': 'TTH-TSR-CRLB',
    'tshirt-codered-logo20-blue': 'TTH-TSR-CRLU',
    'tshirt-codered-paint-tune-2': 'TTH-TSR-CRPT2',
    'tshirt-codered-logo20-tm-green': 'TTH-TSR-CRLG',
    'hoodie-codered-outline-logo-22': 'TTH-HDC-CROL',
    'hoodie-codered-rolluppers': 'TTH-HDC-CRRP',
    'longsleeve-codered-puzir-black': 'TTH-LSL-CRPB',
    'hoodie-codered-piping-font': 'TTH-HDC-CRPF',
    'longsleeve-codered-puzir-gray': 'TTH-LSL-CRPG',
    'hoodie-codered-logo30-tm': 'TTH-HDC-CRL3',
    'hoodie-codered-reddy-boy': 'TTH-HDC-CRRB',
    'hoodie-codered-base-summer-logo-tm': 'TTH-HDC-CRBS',
    'pencil-case-codered-gray': 'TTH-PNC-CRGR',
    'pencil-case-codered-blue': 'TTH-PNC-CRBU',
    'pencil-case-codered-black': 'TTH-PNC-CRBK',
    'pencil-case-codered-graphite': 'TTH-PNC-CRGP',
    'hat-codered-logo-contour-black': 'TTH-HAT-CRLC',
    'hat-codered-rib-mix-short-white': 'TTH-HAT-CRRM',
    'hat-codered-logo-contour-gray': 'TTH-HAT-CRLCG',
    'hat-codered-logo-contour-brown': 'TTH-HAT-CRLCB',
    'hoodie-nb-tnt-gray': 'TTH-HDH-NBTG',
    'hoodie-nb-tnt-black': 'TTH-HDH-NBTB',
    'pants-bbc-lining-black': 'TTH-PNT-BBCB',
    'hoodie-bbc-lining-white': 'TTH-HDH-BBCW',
    'zip-hoodie-pleasures': 'TTH-ZHP-PLRS',
    'hoodie-bbc-lining-black': 'TTH-HDH-BBCB',
    'puffer-carhartt-toronto': 'TTH-PFR-CHTT',
    'puffer-tnf': 'TTH-PFR-TNF',
    'vest-bbc-lining': 'TTH-VST-BBC',
    'pants-postaments-cargos': 'TTH-PNT-PSCG',
    'cap-postaments-dads': 'TTH-CAP-PSDP',
    'hat-postaments-wordz': 'TTH-HAT-PSWD',
    'hat-postaments-ollie-green': 'TTH-HAT-PSOLG',
    'cap-postaments-flat-white': 'TTH-CAP-PSFLW',
    'hat-postaments-ollie-gray': 'TTH-HAT-PSOLY',
    'cap-postaments-five-pattern': 'TTH-CAP-PSFP',
    'hat-postaments-ollie-brown': 'TTH-HAT-PSOLB',
    'cap-postaments-five-black': 'TTH-CAP-PSFB',
    'cap-postaments-flat-black': 'TTH-CAP-PSFLB',
    'cap-postaments-flat-pattern': 'TTH-CAP-PSFLP',
    'hoodie-postaments-cupids': 'TTH-HDH-PSCP',
    'hoodie-postaments-basic-choc': 'TTH-HDH-PSBC',
    'hoodie-postaments-dwarf': 'TTH-HDH-PSDW',
    'tshirt-postaments-shrooms': 'TTH-TSR-PSSH',
    'longsleeve-postaments-think': 'TTH-LSL-PSTH',
    'sweatshirt-postaments-p-logo-green': 'TTH-SWT-PSPLG',
    'sweatshirt-postaments-p-logo-black': 'TTH-SWT-PSPLB',
    'tshirt-obey-white': 'TTH-TSR-OBYW',
    'tshirt-hockey': 'TTH-TSR-HCKY',
    'tshirt-obey-white-2': 'TTH-TSR-OBYW2',
    'tshirt-awake-ny': 'TTH-TSR-AWKN',
    'jeans-oktyabr-baggy-blue': 'TTH-JNS-OKBB',
    'jeans-oktyabr-baggy-gray': 'TTH-JNS-OKBGY',
    'jeans-oktyabr-classic': 'TTH-JNS-OKCL',
    'bag-hike': 'TTH-BAG-HIKE',
    'hat-thrasher': 'TTH-HAT-THR',
    'hat-obey-blue': 'TTH-HAT-OBYB',
    'hat-huf-white': 'TTH-HAT-HUFW',
    'hat-huf-brown': 'TTH-HAT-HUFB',
    'hat-butter-goods': 'TTH-HAT-BTTR',
    'hat-stussy': 'TTH-HAT-STSY',
    'hat-obey-black': 'TTH-HAT-OBYBK',
    'hat-fucking-awesome': 'TTH-HAT-FKNG',
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
      const sku = SKU_MAP[id] || '';
      favs.push({ id, name, price, color, size: size || '—', images, sku });
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
    // Prevent adding sold-out items to favorites
    if (card && card.classList.contains('sold-out')) {
      showToast('Этот товар продан');
      return;
    }
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
      const sku = item.sku || '';
      return `
      <div class="product-card" data-id="${item.id}">
        <div class="product-image" style="position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;margin-bottom:12px;background:#f5f5f5;">
          ${galleryHtml}
        </div>
        <div class="product-title">${item.name}</div>
        <div class="product-card-details" style="font-size:12px;color:#777;margin-bottom:4px;">Цвет: ${item.color} · Размер: ${item.size || '—'}</div>
        ${sku ? `<div class="product-card-sku" style="font-size:11px;color:#999;margin-bottom:4px;letter-spacing:0.05em;">Артикул: ${sku}</div>` : ''}
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
            img.style.opacity === i === 0 ? '1' : '0';
          });
        });
      }
    });

    // Update SKU list block
    updateSkuList(favs);
    updateOrderLinks(favs);
  }

  // ---------- UPDATE SKU LIST IN FAVORITES ----------
  function updateSkuList(favs) {
    if (!favoritesSkuList) return;
    if (!favs || favs.length === 0) {
      if (favoritesSkuBlock) favoritesSkuBlock.style.display = 'none';
      return;
    }
    const skuLines = favs.map((item, i) => {
      const sku = item.sku || '—';
      return `${sku} — ${item.name}${item.color ? ' (' + item.color + ')' : ''}`;
    });
    favoritesSkuList.innerHTML = skuLines.join('<br>');
    favoritesSkuList.dataset.fullText = skuLines.join('\n');
  }

  // ---------- COPY SKU LIST ----------
  if (favoritesSkuCopyBtn) {
    favoritesSkuCopyBtn.addEventListener('click', function() {
      const text = favoritesSkuList ? favoritesSkuList.dataset.fullText || favoritesSkuList.textContent : '';
      navigator.clipboard.writeText(text).then(() => {
        if (favoritesSkuCopied) {
          favoritesSkuCopied.style.display = 'block';
          setTimeout(() => {
            favoritesSkuCopied.style.display = 'none';
          }, 2500);
        }
      }).catch(() => {
        alert('Не удалось скопировать. Скопируйте вручную.');
      });
    });
  }

  // ---------- GENERATE ORDER MESSAGE ----------
  function generateOrderMessage(favs) {
    if (!favs || favs.length === 0) {
      return 'Здравствуйте! Хочу оформить заказ.';
    }
    let msg = 'Здравствуйте! Хочу заказать:\n';
    favs.forEach((item, i) => {
      const sku = item.sku ? ` [${item.sku}]` : '';
      msg += `${i + 1}. ${item.name}${sku} — ${item.price} — Цвет: ${item.color}, Размер: ${item.size || '—'}\n`;
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

  // Строгая валидация email: требует реальный домен с TLD минимум 2 символа
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  function isValidEmail(email) {
    if (!email || !emailRegex.test(email)) return false;
    // Запрещаем localhost и IP-адреса как домен
    const domain = email.split('@')[1] || '';
    if (domain === 'localhost') return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) return false;
    return true;
  }

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

  // ---------- PRODUCT GALLERY DOTS + TOUCH SWIPE ----------

  // Вспомогательная функция: показать нужный слайд и обновить точки
  function showGallerySlide(imageContainer, index) {
    const images = imageContainer.querySelectorAll('.gallery-img');
    const dots = imageContainer.querySelectorAll('.gallery-dot');
    if (images.length === 0) return;
    const total = images.length;
    const i = ((index % total) + total) % total; // зацикливание
    images.forEach((img, idx) => { img.style.opacity = idx === i ? '1' : '0'; });
    dots.forEach((dot, idx) => {
      dot.style.background = idx === i ? 'rgba(17,17,17,0.8)' : 'rgba(17,17,17,0.3)';
    });
    imageContainer.dataset.currentSlide = i;
  }

  document.querySelectorAll('.gallery-dots').forEach(dotsContainer => {
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    const imageContainer = dotsContainer.closest('.product-image');
    const images = imageContainer ? imageContainer.querySelectorAll('.gallery-img') : [];
    if (images.length === 0) return;

    // Инициализация: показать первый слайд
    showGallerySlide(imageContainer, 0);

    // Десктоп: наведение на точки
    dots.forEach((dot, index) => {
      dot.addEventListener('mouseenter', () => {
        showGallerySlide(imageContainer, index);
      });
    });

    // Десктоп: уход курсора — вернуть первый слайд
    imageContainer.addEventListener('mouseleave', () => {
      showGallerySlide(imageContainer, 0);
    });

    // Мобильный: свайп
    let touchStartX = 0;
    let touchStartY = 0;

    imageContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    imageContainer.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      // Свайп только если горизонтальное движение больше вертикального и > 30px
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        const current = parseInt(imageContainer.dataset.currentSlide || '0', 10);
        if (dx < 0) {
          // Свайп влево → следующая
          showGallerySlide(imageContainer, current + 1);
        } else {
          // Свайп вправо → предыдущая
          showGallerySlide(imageContainer, current - 1);
        }
      }
    }, { passive: true });
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

  // Определяем, находимся ли мы на странице магазина
  const isShopPage = window.location.pathname.endsWith('shop.html');

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // Если мы НЕ на shop.html и есть поисковый запрос — редиректим на магазин
    if (!isShopPage && query !== '') {
      window.location.href = 'shop.html?search=' + encodeURIComponent(query);
      return;
    }

    const category = filterCategory ? filterCategory.value : '';
    const priceVal = filterPrice ? filterPrice.value : '';
    const colorEl = filterColor ? filterColor.querySelector('.filter-color-btn.active') : null;
    const color = colorEl ? colorEl.dataset.color : '';

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      // Text search (name + sku)
      const name = (card.dataset.name || '').toLowerCase();
      const sku = (card.dataset.sku || '').toLowerCase();
      const matchesSearch = query === '' || name.includes(query) || sku.includes(query);

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

  // Поиск по Enter (важно для мобильных устройств)
  function handleSearchSubmit() {
    const query = searchInput ? searchInput.value.trim() : '';
    if (query === '') return;
    if (!isShopPage) {
      window.location.href = 'shop.html?search=' + encodeURIComponent(query);
    } else {
      applyFilters();
    }
  }

  // Attach filter events
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit();
      }
    });
  }
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

  // Если мы на shop.html — читаем параметр ?search= из URL и применяем
  if (isShopPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput) {
      searchInput.value = searchQuery;
      applyFilters();
    }
  }

  // ---------- TOAST NOTIFICATION ----------
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

  // ---------- SAVE EMAIL TO LOCALSTORAGE ----------
  function saveEmailToLocalStorage(email) {
    const EMAILS_KEY = 'trustthehood_emails';
    let emails = [];
    try {
      emails = JSON.parse(localStorage.getItem(EMAILS_KEY)) || [];
    } catch {}
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    }
  }

  // Единственный обработчик кнопки рассылки — со строгой валидацией и сохранением
  function handleNewsletterSubmit() {
    const email = newsletterEmail ? newsletterEmail.value.trim() : '';
    if (!isValidEmail(email)) {
      if (newsletterError) newsletterError.classList.add('show');
      return;
    }
    if (newsletterError) newsletterError.classList.remove('show');
    saveEmailToLocalStorage(email);
    if (newsletterEmail) newsletterEmail.value = '';
    openNewsletterModal();
  }

  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleNewsletterSubmit();
    });
  }
  if (newsletterEmail) {
    newsletterEmail.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNewsletterSubmit();
      }
    });
    newsletterEmail.addEventListener('input', function() {
      if (this.value.trim()) {
        if (newsletterError) newsletterError.classList.remove('show');
      }
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
