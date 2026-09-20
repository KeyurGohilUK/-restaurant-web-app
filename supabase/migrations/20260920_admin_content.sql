create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  price text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opening_hours (
  day_of_week smallint primary key check (day_of_week between 1 and 7),
  day_name text not null,
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  restaurant_name text not null,
  short_name text not null,
  tagline text not null default '',
  address text not null,
  phone_display text not null,
  phone_href text not null,
  map_href text not null,
  hero_eyebrow text not null default '',
  hero_heading text not null default '',
  hero_intro text not null default '',
  hero_image_url text,
  catering_heading text not null default '',
  catering_image_url text,
  temporary_notice text,
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('restaurant', 'catering', 'events', 'large-orders')),
  quote text not null,
  customer_name text not null,
  source text not null,
  source_href text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.opening_hours enable row level security;
alter table public.site_settings enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Public read active menu categories" on public.menu_categories;
create policy "Public read active menu categories" on public.menu_categories for select to anon using (is_active);
drop policy if exists "Authenticated manage menu categories" on public.menu_categories;
create policy "Authenticated manage menu categories" on public.menu_categories for all to authenticated using (true) with check (true);

drop policy if exists "Public read active menu items" on public.menu_items;
create policy "Public read active menu items" on public.menu_items for select to anon using (is_active);
drop policy if exists "Authenticated manage menu items" on public.menu_items;
create policy "Authenticated manage menu items" on public.menu_items for all to authenticated using (true) with check (true);

drop policy if exists "Public read opening hours" on public.opening_hours;
create policy "Public read opening hours" on public.opening_hours for select to anon using (true);
drop policy if exists "Authenticated manage opening hours" on public.opening_hours;
create policy "Authenticated manage opening hours" on public.opening_hours for all to authenticated using (true) with check (true);

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings for select to anon using (true);
drop policy if exists "Authenticated manage site settings" on public.site_settings;
create policy "Authenticated manage site settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "Public read active reviews" on public.reviews;
create policy "Public read active reviews" on public.reviews for select to anon using (is_active);
drop policy if exists "Authenticated manage reviews" on public.reviews;
create policy "Authenticated manage reviews" on public.reviews for all to authenticated using (true) with check (true);

insert into public.site_settings (
  id, restaurant_name, short_name, tagline, address, phone_display, phone_href, map_href,
  hero_eyebrow, hero_heading, hero_intro, catering_heading
) values (
  true,
  'Masala Munch by Shreeji Food',
  'Masala Munch',
  'Indian street food, chaat and comfort classics in Bristol.',
  '664 Fishponds Rd, Bristol BS16 3HJ',
  '07733 849772',
  'tel:+447733849772',
  'https://www.google.com/maps/search/?api=1&query=664+Fishponds+Rd+Bristol+BS16+3HJ',
  'Bristol · Indian street food',
  'Masala Munch',
  'Indian street food. Made in Bristol.',
  'Food worth gathering for.'
) on conflict (id) do nothing;

insert into public.opening_hours (day_of_week, day_name, opens_at, closes_at, is_closed) values
  (1, 'Monday', '17:00', '22:00', false),
  (2, 'Tuesday', null, null, true),
  (3, 'Wednesday', '17:00', '22:00', false),
  (4, 'Thursday', '17:00', '22:00', false),
  (5, 'Friday', '17:00', '22:00', false),
  (6, 'Saturday', '14:00', '22:00', false),
  (7, 'Sunday', '17:00', '22:00', false)
on conflict (day_of_week) do nothing;
