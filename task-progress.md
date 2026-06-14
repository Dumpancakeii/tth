# План работ по trustthehood-next ✅

**Этап 1: Критические баги** ✅
- [x] Проанализировать проект
- [x] Исправить `collections.ts` — productCount (использовать totalCount)
- [x] Исправить `queries.ts` — COLLECTIONS_QUERY (добавить totalCount)
- [x] Исправить `globals.css` — убрать grayscale/multiply для img
- [x] Исправить `useCart.ts` — использовать formatPrice вместо жёсткого €
- [x] Исправить `formatPrice.ts` — унифицировать валюту (EUR)
- [x] Исправить `useWindowSize.ts` — hydration mismatch (SSR-safe initial values)
- [x] Удалить дублирующийся роут `/product/[slug]`

**Этап 2: Корзина (Cart)** ✅
- [x] Добавить `CartDrawer` в корневой layout с CartProvider
- [x] Исправить `CartItem.tsx` — добавить обработчики +/-/×
- [x] Исправить `CartSummary.tsx` — живые цены, активный checkout
- [x] Добавить localStorage персистентность в `useCart.ts`

**Этап 3: Недостающие страницы** ✅
- [x] Создать `error.tsx` (500)
- [x] Создать `not-found.tsx` (404)
- [x] Создать `loading.tsx` (спиннер)

**Этап 4: CMS и данные** ✅
- [x] Реализовать `lib/cms/index.ts` с типами и fallback данными
- [x] Удалить дублирующиеся старые файлы (ProductCard, ProductGrid, роут /product)
- [x] Заменить `lucide-react` на встроенные SVG-иконки

**Этап 5: Финальная проверка** ✅
- [x] Проверить сборку `npm run build` — успешно
- [x] Все 10 роутов скомпилированы без ошибок