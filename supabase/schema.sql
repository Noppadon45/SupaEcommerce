-- ShopWave database schema for Supabase (PostgreSQL)
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2),
  category text not null references public.categories(name),
  image_url text not null default '',
  rating numeric(2, 1) not null default 0,
  reviews integer not null default 0,
  badge text,
  stock integer not null default 0 check (stock >= 0),
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total numeric(10, 2) not null,
  status text not null default 'processing'
    check (status in ('processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  product_image text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read access to the catalog
drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public"
  on public.categories for select using (true);

drop policy if exists "Products are public" on public.products;
create policy "Products are public"
  on public.products for select using (true);

-- Profiles: users can only see and edit their own profile
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Orders: users can only see and create their own orders
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Users create own orders" on public.orders;
create policy "Users create own orders"
  on public.orders for insert with check (auth.uid() = user_id);

-- Order items: accessible only when the parent order belongs to the user
drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Users create own order items" on public.order_items;
create policy "Users create own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- New user -> profile
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage bucket for product images (optional)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Product images are public" on storage.objects;
create policy "Product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------

insert into public.categories (name, slug) values
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Shoes', 'shoes'),
  ('Accessories', 'accessories')
on conflict (name) do nothing;

insert into public.products
  (id, name, description, price, old_price, category, image_url, rating, reviews, badge, stock, features)
values
  ('aurora-headphones', 'Aurora Wireless Headphones',
   'Immersive over-ear sound with adaptive noise cancellation, 40-hour battery life, and cloud-soft memory foam cushions.',
   129, 159, 'Electronics', '/images/aurora-headphones.svg', 4.8, 214, 'Bestseller', 32,
   '["Active noise cancellation","40h battery life","Bluetooth 5.3","Fast charge"]'),

  ('nova-laptop', 'Nova Laptop 14"',
   'A featherlight aluminum laptop with a stunning 14-inch display, all-day battery, and compute that keeps up with everything.',
   999, null, 'Electronics', '/images/nova-laptop.svg', 4.9, 87, 'New', 12,
   '["14\" 2.8K display","16GB RAM · 512GB SSD","Up to 18h battery","1.2kg weight"]'),

  ('pulse-smartwatch', 'Pulse Smartwatch',
   'Track workouts, sleep, and heart rate on a bright AMOLED display that looks as good at the gym as it does at dinner.',
   199, 229, 'Electronics', '/images/pulse-smartwatch.svg', 4.7, 156, 'Sale', 45,
   '["AMOLED always-on display","7-day battery","5ATM water resistant","GPS built in"]'),

  ('luma-camera', 'Luma Mirrorless Camera',
   'Capture detail-rich photos and cinematic video with a compact body, fast autofocus, and in-body stabilization.',
   649, null, 'Electronics', '/images/luma-camera.svg', 4.8, 64, null, 18,
   '["24MP APS-C sensor","4K 60fps video","5-axis stabilization","Weather sealed"]'),

  ('cotton-tee', 'Essential Cotton Tee',
   'The everyday tee, perfected. Made from breathable organic cotton with a relaxed fit that holds its shape wash after wash.',
   29, 39, 'Clothing', '/images/cotton-tee.svg', 4.6, 389, 'Bestseller', 120,
   '["100% organic cotton","Relaxed unisex fit","Pre-shrunk fabric","Machine washable"]'),

  ('denim-jacket', 'Urban Denim Jacket',
   'A modern take on the classic denim jacket — rigid enough to hold structure, soft enough to wear from day one.',
   89, null, 'Clothing', '/images/denim-jacket.svg', 4.7, 102, null, 40,
   '["12oz selvedge denim","Regular fit","Antique brass buttons","Four pockets"]'),

  ('midi-dress', 'Fluid Midi Dress',
   'An effortlessly elegant midi dress in a breezy recycled fabric, with a flattering waist tie and subtle drape.',
   79, 99, 'Clothing', '/images/midi-dress.svg', 4.5, 73, 'Sale', 27,
   '["Recycled fabric","Adjustable waist tie","Midi length","Wrinkle resistant"]'),

  ('cloudrun-sneakers', 'Cloudrun Sneakers',
   'Featherweight cushioning meets a breathable knit upper — the sneaker you will reach for every single day.',
   119, null, 'Shoes', '/images/cloudrun-sneakers.svg', 4.9, 241, 'Bestseller', 58,
   '["Responsive foam midsole","Breathable knit upper","Grippy rubber outsole","240g per shoe"]'),

  ('trailblazer-boots', 'Trailblazer Boots',
   'Built for the long way around. Waterproof, supportive, and comfortable enough for the first mile and the last.',
   149, 179, 'Shoes', '/images/trailblazer-boots.svg', 4.6, 91, 'Sale', 22,
   '["Waterproof membrane","Vibram-style outsole","Ankle support","Quick-dry lining"]'),

  ('tote-bag', 'Everyday Tote Bag',
   'A structured, spacious tote in thick canvas with an inner pocket — room for your laptop, lunch, and then some.',
   59, null, 'Accessories', '/images/tote-bag.svg', 4.7, 128, null, 75,
   '["Heavyweight canvas","Padded 16\" laptop sleeve","Interior zip pocket","Reinforced straps"]'),

  ('sunglasses', 'Classic Sunglasses',
   'Timeless frames with polarized, UV400 lenses and a lightweight acetate build that only gets better with wear.',
   69, 89, 'Accessories', '/images/sunglasses.svg', 4.5, 56, 'Sale', 64,
   '["Polarized UV400 lenses","Italian acetate frame","Spring hinges","Hard case included"]'),

  ('backpack', 'Minimalist Backpack',
   'A clean, commuter-friendly pack with clever organization, a padded laptop compartment, and a water-resistant shell.',
   89, null, 'Accessories', '/images/backpack.svg', 4.8, 174, 'New', 38,
   '["18L capacity","Fits 16\" laptop","Water-resistant shell","Hidden back pocket"]')
on conflict (id) do nothing;
