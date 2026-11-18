# ShopWave — React + Supabase Ecommerce Storefront

A modern, responsive ecommerce website built with **React (Vite)**, **Tailwind CSS**, **React Router**, and **Supabase**.

## Features

- Product catalog with search, category filters, and sorting
- Product detail pages with highlights, ratings, and related products
- Persistent shopping cart (add, remove, change quantity)
- Checkout with shipping details and order placement
- Email/password authentication with protected routes
- Order history and order confirmation pages
- Responsive design with a polished Tailwind UI
- Toast notifications, loading states, empty states, and a 404 page

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

The app works **out of the box in local demo mode** — products, accounts, and orders are stored in your browser's `localStorage`. No Supabase account is required to explore the UI.

Build for production with `npm run build`.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables, RLS policies, storage bucket, and seed products.
3. Copy `.env.example` to `.env` and fill in your project URL and anon key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server. The app will now read products, handle auth, and save orders through Supabase.

> Product images in the seed data point to the app's own `/images/*.svg` files. To use Supabase Storage instead, upload images to the `product-images` bucket and replace `image_url` values with the public URLs.

## How the pieces fit together

| Concern | Implementation |
|---|---|
| UI | React components + Tailwind utility classes |
| Routing | React Router (`/` , `/shop`, `/product/:id`, `/cart`, `/checkout`, `/orders`, …) |
| Data access | `src/lib/api.js` — one function per operation, using Supabase when configured and localStorage otherwise |
| Auth | `src/context/AuthContext.jsx` — Supabase Auth (or demo auth); session state shared via context |
| Cart | `src/context/CartContext.jsx` — client-side cart persisted to localStorage |
| Notifications | `src/context/ToastContext.jsx` |
| Security | Row Level Security policies in `supabase/schema.sql` enforce that users only access their own orders |

### RLS in a nutshell

- `products` and `categories` are public (`USING (true)`).
- `orders` allow `SELECT`/`INSERT` only when `auth.uid() = user_id`.
- `order_items` are allowed only when the parent order belongs to the signed-in user.
- Rules live in the database, so they apply even if someone calls the API directly.

### Auth flow

1. `signIn` / `signUp` calls Supabase Auth.
2. Supabase returns a session with a JWT and stores it in the browser.
3. `onAuthStateChange` updates `AuthContext`, so the whole UI reacts.
4. Every Supabase request carries the JWT automatically; RLS uses it to identify the user.
5. Protected routes redirect guests to `/login`.

### Data fetching

Components call helpers from `src/lib/api.js` inside `useEffect`, store results in state, and render loading/error/empty states. Supabase queries are built with `supabase.from('table').select(...).eq(...)`.

## Project structure

```
src/
├── components/     Reusable UI (Navbar, Footer, ProductCard, ...)
├── context/        Auth, Cart, and Toast providers
├── lib/            API layer, mock data, formatting helpers
├── pages/          Route pages
├── App.jsx         Routes
├── main.jsx        Providers + entry point
└── index.css       Tailwind entry
supabase/
└── schema.sql      Tables, RLS policies, seed data
```

## Notes

- Payments are **not** processed. Checkout records the order; integrate Stripe for real payments.
- Demo-mode passwords are stored in localStorage for convenience — never do this in production.
