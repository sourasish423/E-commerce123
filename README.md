# FieldNote — MERN E-Commerce

A full-stack e-commerce store built with **MongoDB, Express, React, Node.js**, and **Tailwind CSS**, with JWT-based authentication (httpOnly cookies).

## Features

**Storefront**
- Product catalog with search, category filter, sort, and pagination
- Product detail pages with reviews and ratings
- Cart persisted in localStorage
- Checkout flow (address + payment method → order)
- Order history and order detail pages

**Auth**
- Register / login / logout with JWT stored in an httpOnly cookie
- Password hashing with bcrypt
- Protected routes (must be signed in) and admin-only routes

**Admin**
- Dashboard, product CRUD, order list with status updates

**AI Shopping Assistant**
- Chat-based assistant (Google Gemini) reachable from the navbar, a button on the homepage hero, and a floating widget on every page
- Answers natural-language questions ("find me a backpack under $80", "which product would you recommend?", "compare these products") using **only real products from MongoDB** — Gemini is given a candidate list fetched from the database and its response is re-validated server-side against that same list, so it can't invent products, prices, IDs, or stock
- Recommended products render as real product cards (image, price, stock) with working "add to cart" and "view details"
- Gracefully degrades: clear error message if the API key isn't set or Gemini is unreachable, "no strong match" handling, loading state

**Backend**
- REST API (Express + Mongoose)
- Centralized error handling, async wrapper, server-side price recalculation on order placement (never trusts client-sent prices)
- Seed script with a demo admin account and a generated catalog of **55+ products per category** (275+ products total) across Bags, Apparel, Home, Footwear, and Stationery — enough volume to exercise search, filtering, sorting, and pagination

## Project structure

```
mern-ecommerce/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, product, order, user
│   ├── middleware/         # auth (protect/admin), error handling
│   ├── models/             # User, Product, Order
│   ├── routes/
│   ├── utils/generateToken.js
│   ├── seeder.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/         # AuthContext, CartContext
    │   ├── components/
    │   ├── pages/
    │   │   └── admin/
    │   ├── App.jsx
    │   └── index.css        # Tailwind + design tokens
    └── tailwind.config.js
```

## Setup

### 1. Prerequisites
- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, CLIENT_URL

npm run seed   # loads a demo admin + sample products
npm run dev    # starts the API on http://localhost:5000
```

Demo login after seeding: `admin@example.com` / `admin123`

**To enable the AI Shopping Assistant:** get a free key from [Google AI Studio](https://aistudio.google.com/apikey) and set it in `backend/.env`:

```
GEMINI_API_KEY=your_key_here
```

That's the only manual step — the SDK (`@google/genai`) is already installed and the integration is fully wired up. Without a key set, the assistant UI still works but replies with a clear "not configured" message instead of erroring out.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=/api (proxied to the backend in dev)
npm run dev             # starts the app on http://localhost:5173
```

Vite's dev server proxies `/api` requests to `http://localhost:5000`, and the app sends the JWT as an httpOnly cookie (`withCredentials: true`), so both servers need to be running together in development.

### 4. Production build

```bash
cd frontend
npm run build     # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (or add `express.static` to `server.js`), and deploy the `backend/` folder to a Node host with `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` set to your deployed frontend origin.

## API overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Private |
| GET/PUT | `/api/auth/profile` | Private |
| GET | `/api/products` | Public (search/filter/sort/paginate via query params) |
| GET | `/api/products/:id` | Public (id or slug) |
| GET | `/api/products/categories` | Public |
| POST | `/api/products` | Admin |
| PUT/DELETE | `/api/products/:id` | Admin |
| POST | `/api/products/:id/reviews` | Private |
| POST | `/api/orders` | Private |
| GET | `/api/orders/mine` | Private |
| GET | `/api/orders/:id` | Private (owner or admin) |
| PUT | `/api/orders/:id/pay` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| GET | `/api/users` | Admin |
| DELETE | `/api/users/:id` | Admin |
| POST | `/api/ai/assistant` | Public — `{ message, history?, contextProductIds? }` → `{ reply, products }` |

### How the AI assistant works

```
React chat UI  →  POST /api/ai/assistant  →  MongoDB product search (candidates)
                                           →  Gemini (picks/responds from those candidates only)
                                           →  IDs re-validated against the same candidate set
                                           →  { reply, products } sent back to React
```

`backend/services/productSearchService.js` turns the natural-language message into a candidate pool (MongoDB text search, category/price filtering, regex fallback, and a "top rated" fallback for open-ended asks). `backend/services/geminiClient.js` sends only that candidate list to Gemini and requires a strict JSON reply. `backend/controllers/aiController.js` then discards any product ID Gemini returns that wasn't in the original candidate set and re-fetches the surviving ones fresh from MongoDB — so the response the frontend renders is always backed by real, current database records, never model output.

## Notes

- Checkout uses "Cash on Delivery" / "Card on Delivery" as placeholder payment methods — no real payment processor is wired up. To take real payments, integrate Stripe or a similar provider inside `orderController.js` and add a payment webhook.
- The cart lives in `localStorage` via `CartContext`, not the database — it survives refreshes but not device switches.
- Order totals (items, shipping, tax) are always recalculated server-side from the current product prices, never trusted from the client.
