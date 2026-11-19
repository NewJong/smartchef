# SmartChef

A mobile cooking assistant: a catalog of dishes with ingredients, favorite recipes, a grocery cart, nutrition statistics and an AI recipe generator that cooks up something from what you already have.

## Features

- **Dish catalog** — browse by category, search by name, see ingredients and nutrients of every dish
- **Favorites** — save dishes to your profile
- **Ingredient cart** — add products from dishes, change quantities
- **AI recipes** — generate a recipe from the ingredients in your cart (Groq, Llama 3); replies in the language of your request
- **Statistics** — track eaten dishes over a selected period, with charts
- **Account** — sign up and log in (JWT), profile photo

## Tech stack

| Part | Technologies |
|---|---|
| `frontend/` | React Native, Expo (Expo Router), TypeScript, Jest |
| `backend/` | Go, Fiber, GORM, SQLite, JWT, Swagger |

## Getting started

### Backend

```bash
cd backend
cp .env.example .env
go run .
```

The API starts on `http://localhost:8888`, docs at `http://localhost:8888/swagger/`. The SQLite database (`foodapp.db`) is created automatically.

### Frontend

```bash
cd frontend
cp .env.example .env   # put your Groq API key here
npm install
npx expo start
```

## API overview

| Method | Path | Description |
|---|---|---|
| POST | `/users/register`, `/users/login` | Sign up, log in |
| GET | `/users/profile` | Current user profile |
| GET | `/dishes`, `/dishes/category?q=`, `/dishes/search?q=` | Dishes |
| GET | `/dishes-ingredients/:dish_id` | Ingredients of a dish |
| POST/GET/DELETE | `/favorites-dishes/*` | Favorites |
| POST/GET/PUT/DELETE | `/cart/*` | Cart |
| GET/POST/DELETE | `/statistics/*` | Nutrition statistics |
