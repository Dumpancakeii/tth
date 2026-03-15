 🛍️ TrustTheHood Streetwear Store

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

TrustTheHood — это современный интернет-магазин уличной одежды, разработанный в минималистичном стиле с акцентом на типографику и пользовательский опыт. Проект представляет собой полнофункциональный прототип с корзиной, каталогом, личным кабинетом и системой заказов.


📋 Содержание

- [О проекте](#о-проекте)
- [Функциональность](#функциональность)
- [Технологический стек](#технологический-стек)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [API Документация](#api-документация)
- [База данных](#база-данных)
- [Админ-панель](#админ-панель)
- [Тестирование](#тестирование)
- [Развертывание](#развертывание)
- [Команда](#команда)
- [Лицензия](#лицензия)

🎯 О проекте

TrustTheHood создан как дипломный проект, демонстрирующий современные подходы к веб-разработке. Магазин специализируется на уличной одежде и аксессуарах, предлагая пользователям интуитивно понятный интерфейс и полный цикл покупки — от выбора товара до отслеживания заказа.

Цели проекта
- Разработать адаптивный интернет-магазин с уникальным дизайном
- Реализовать полный пользовательский путь (регистрация → выбор → покупка → отслеживание)
- Создать гибкую архитектуру для легкого масштабирования
- Обеспечить синхронизацию корзины между всеми страницами


✨ Функциональность

Для покупателей
- 🔐 Регистрация и авторизация — создание аккаунта, вход по email
- 🛍️ Каталог товаров — просмотр, фильтрация по категориям, сортировка
- 🔍 Поиск — быстрый поиск по названию и описанию
- 🛒 Корзина — добавление товаров, изменение количества, удаление
- 💳 Оформление заказа — выбор адреса, способа оплаты, применение промокодов
- 📦 Отслеживание заказов — просмотр статуса, трек-номера, истории
- ❤️ Избранное — сохранение понравившихся товаров
- 👤 Личный кабинет — управление профилем, адресами, просмотр статистики

Для администраторов
- 📊 Панель управления — аналитика продаж, графики, отчеты
- 📦 Управление товарами — добавление, редактирование, удаление, варианты (размеры/цвета)
- 🏷️ Управление категориями — создание иерархии категорий
- 📋 Управление заказами — изменение статуса, добавление трек-номера
- 👥 Управление пользователями — просмотр, блокировка, смена ролей
- 🎫 Управление промокодами — создание скидок, ограничения по использованию
- ⚙️ Настройки магазина — курсы валют, доставка, уведомления


🛠️ Технологический стек

Фронтенд

├── HTML5 # Семантическая верстка
├── CSS3
│ ├── Flexbox/Grid # Адаптивная верстка
│ ├── CSS Variables # Динамические темы
│ └── Animations # Плавные переходы
├── JavaScript (ES6+)
│ ├── LocalStorage # Хранение данных корзины
│ ├── SessionStorage # Временные данные
│ └── Custom Events # Синхронизация компонентов
└── Google Fonts # Шрифты Inter и др.


Бэкенд (несколько вариантов)
<details>
<summary><b>FastAPI (Python)</b></summary>
├── Python 3.10+
├── FastAPI # Веб-фреймворк
├── SQLAlchemy # ORM
├── Pydantic # Валидация данных
├── Alembic # Миграции
├── JWT # Аутентификация
└── PostgreSQL # База данных

</details>

<details>
<summary><b>Gin (Go)</b></summary>
├── Go 1.20+
├── Gin # Веб-фреймворк
├── GORM # ORM
├── JWT-Go # Аутентификация
└── PostgreSQL # База данных

</details>

<details>
<summary><b>Laravel (PHP)</b></summary>
├── PHP 8.1+
├── Laravel 10.x # Веб-фреймворк
├── Eloquent # ORM
├── Sanctum # Аутентификация
├── Cashier # Платежи
└── MySQL/PostgreSQL # База данных

</details>

<details>
<summary><b>Fastify (Node.js)</b></summary>
├── Node.js 18+
├── Fastify # Веб-фреймворк
├── Prisma # ORM (SQL)
├── Mongoose # ODM (MongoDB)
├── JWT # Аутентификация
└── PostgreSQL/MongoDB # База данных

</details>

Инструменты разработки
├── Git # Контроль версий
├── npm/yarn # Менеджеры пакетов
├── ESLint # Линтер JavaScript
├── Prettier # Форматирование кода
├── Postman # Тестирование API
└── Swagger/OpenAPI # Документация API


🚀 Установка и запуск

 Предварительные требования
- Node.js 18+ / Python 3.10+ / Go 1.20+ / PHP 8.1+
- PostgreSQL 14+ / MongoDB 6+
- Git

 Клонирование репозитория
```bash
git clone https://github.com/frontend-sandbox/tth-style-prototype.git
cd tth-style-prototype


Вариант 1: Фронтенд прототип (статический):
# Просто открыть в браузере
open index.html

# Или запустить локальный сервер
npx serve .

Вариант 2: Полный стек (FastAPI):
# Перейти в директорию бэкенда
cd backend-fastapi

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить базу данных
cp .env.example .env
# Отредактировать .env с вашими данными

# Применить миграции
alembic upgrade head

# Загрузить тестовые данные
python seed.py

# Запустить сервер
uvicorn main:app --reload

Вариант 3: Полный стек (Fastify):
# Перейти в директорию бэкенда
cd backend-fastify

# Установить зависимости
npm install

# Настроить базу данных
cp .env.example .env
# Отредактировать .env с вашими данными

# Применить миграции Prisma
npx prisma migrate dev

# Загрузить тестовые данные
npm run seed

# Запустить сервер
npm run dev

Структура проекта:
bronze56k-style-prototype/
│
├── 📂 frontend/                    # Статические файлы
│   ├── index.html                  # Главная страница
│   ├── catalog.html                 # Каталог товаров
│   ├── product.html                 # Страница товара
│   ├── cart.html                    # Корзина
│   ├── login.html                   # Вход/регистрация
│   ├── profile.html                 # Профиль пользователя
│   ├── orders.html                  # Заказы
│   ├── style.css                    # Основные стили
│   ├── script.js                    # Основной JavaScript
│   ├── cart-sync.js                  # Синхронизация корзины
│   └── 📂 images/                    # Изображения
│
├── 📂 backend-fastapi/              # Бэкенд на FastAPI
│   ├── main.py                       # Точка входа
│   ├── 📂 models/                     # Модели SQLAlchemy
│   ├── 📂 schemas/                    # Схемы Pydantic
│   ├── 📂 api/                        # API эндпоинты
│   ├── 📂 core/                       # Конфигурация
│   ├── 📂 alembic/                    # Миграции
│   └── requirements.txt               # Зависимости
│
├── 📂 backend-gin/                  # Бэкенд на Gin
│   ├── main.go                        # Точка входа
│   ├── 📂 models/                      # Модели GORM
│   ├── 📂 handlers/                    # Обработчики
│   ├── 📂 middleware/                  # Middleware
│   ├── 📂 config/                      # Конфигурация
│   └── go.mod                          # Зависимости
│
├── 📂 backend-laravel/               # Бэкенд на Laravel
│   ├── 📂 app/
│   ├── 📂 database/
│   ├── 📂 routes/
│   └── composer.json
│
├── 📂 backend-fastify/               # Бэкенд на Fastify
│   ├── server.js                      # Точка входа
│   ├── 📂 routes/                      # Маршруты
│   ├── 📂 controllers/                 # Контроллеры
│   ├── 📂 models/                      # Модели Mongoose/Prisma
│   ├── 📂 middleware/                  # Middleware
│   ├── 📂 prisma/                      # Схема Prisma
│   └── package.json                    # Зависимости
│
├── 📂 database/                      # Скрипты для БД
│   ├── schema.sql                     # SQL схема
│   ├── seed.sql                       # Тестовые данные
│   └── mongodb-schema.js              # MongoDB схема
│
├── 📂 docs/                          # Документация
│   ├── api.md                         # API документация
│   ├── deployment.md                   # Инструкции по развертыванию
│   └── report.md                      # Отчет по практике
│
├── 📂 tests/                         # Тесты
│   ├── unit/                          # Модульные тесты
│   └── integration/                   # Интеграционные тесты
│
├── .env.example                      # Пример переменных окружения
├── .gitignore                        # Исключения Git
├── docker-compose.yml                 # Docker Compose
├── Dockerfile                         # Docker образ
├── README.md                          # Этот файл
└── LICENSE                           # Лицензия MIT




Примеры запросов:
Получение товаров с фильтрацией:
curl -X GET "http://localhost:8000/api/products?category=hoodies&min_price=1000&max_price=5000&sort=price_asc"

Добавление в корзину:
curl -X POST "http://localhost:8000/api/cart/add" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2, "size": "M"}'

Создание заказа:
curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": 1,
    "payment_method": "card",
    "promo_code": "WELCOME50"
  }'

База данных:
Основные таблицы:

users — пользователи

addresses — адреса доставки

categories — категории товаров

products — товары

product_variants — варианты товаров (размеры, цвета)

product_images — изображения

cart — корзина

orders — заказы

order_items — товары в заказе

reviews — отзывы

promotions — промокоды

wishlist — избранное

settings — настройки магазина

Админ-панель:
Учетные данные для демо:
Email: admin@tth.com
Пароль: admin123

Разделы админки
📊 Дашборд
График продаж за период

Ключевые показатели (заказы, выручка, средний чек)

Популярные товары

Последние заказы

📦 Товары
Список товаров с фильтрацией

Добавление/редактирование товара

Управление вариантами (размеры, цвета)

Загрузка изображений

Управление тегами и категориями

📋 Заказы
Список заказов с фильтрацией по статусу

Редактирование заказа

Изменение статуса

Добавление трек-номера

Печать счета

👥 Пользователи
Список пользователей

Редактирование профиля

Блокировка/разблокировка

Смена роли (customer/admin/manager)

🎫 Промокоды
Создание промокодов

Настройка скидок (%, фикс, беспл. доставка)

Ограничения по сумме и времени

⚙️ Настройки
Основная информация магазина

Настройки доставки

Настройки оплаты

Email уведомления

SEO настройки

Unit-тесты:
# FastAPI
pytest tests/unit -v

# Fastify
npm run test:unit

# Laravel
php artisan test --testsuite=Unit

Интеграционные тесты:
# FastAPI
pytest tests/integration -v

# Fastify
npm run test:integration

# Laravel
php artisan test --testsuite=Feature

E2E тесты:
# Cypress
npm run test:e2e

# Playwright
npx playwright test

Нагрузочное тестирование:
# Artillery
npm run test:load

# k6
k6 run tests/load/spike.js