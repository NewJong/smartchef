# SmartChef

Мобільний застосунок-помічник для кухні: каталог страв з інгредієнтами, улюблені рецепти, кошик продуктів, статистика харчування та AI-генератор рецептів з того, що є під рукою.

## Можливості

- **Каталог страв** — перегляд за категоріями, пошук за назвою, склад і нутрієнти кожної страви
- **Улюблені** — збереження страв у профілі
- **Кошик інгредієнтів** — додавання продуктів зі страв, зміна кількості
- **AI-рецепти** — генерація рецепту з інгредієнтів кошика (Groq, Llama 3); відповідає мовою запиту
- **Статистика** — облік з’їдених страв за обраний період, графіки
- **Акаунт** — реєстрація та вхід (JWT), фото профілю

## Стек

| Частина | Технології |
|---|---|
| `frontend/` | React Native, Expo (Expo Router), TypeScript, Jest |
| `backend/` | Go, Fiber, GORM, SQLite, JWT, Swagger |

## Запуск

### Backend

```bash
cd backend
cp .env.example .env
go run .
```

API стартує на `http://localhost:8888`, документація — `http://localhost:8888/swagger/`. База SQLite (`foodapp.db`) створюється автоматично.

### Frontend

```bash
cd frontend
cp .env.example .env   # вкажіть свій ключ Groq
npm install
npx expo start
```

## API (основне)

| Метод | Шлях | Опис |
|---|---|---|
| POST | `/users/register`, `/users/login` | Реєстрація, вхід |
| GET | `/users/profile` | Профіль користувача |
| GET | `/dishes`, `/dishes/category?q=`, `/dishes/search?q=` | Страви |
| GET | `/dishes-ingredients/:dish_id` | Інгредієнти страви |
| POST/GET/DELETE | `/favorites-dishes/*` | Улюблені |
| POST/GET/PUT/DELETE | `/cart/*` | Кошик |
| GET/POST/DELETE | `/statistics/*` | Статистика харчування |
