-- Run once in Supabase → SQL Editor. Creates the tables and storage buckets.
-- The backend uses the service-role key, so RLS stays enabled with no public policies:
-- nobody can read or write these tables directly from the browser.

create extension if not exists pgcrypto;

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  parent_id   uuid references categories(id) on delete restrict,
  sort        int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'book' check (type in ('book', 'poem')),
  title        text not null,
  description  text not null default '',
  content      text not null default '',
  price        numeric(10, 2) not null default 0 check (price >= 0),
  category_id  uuid references categories(id) on delete set null,
  cover_url    text,
  pdf_path     text,
  pdf_name     text,
  pages        int,
  age          text not null default '',
  featured     boolean not null default false,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists banners (
  id           uuid primary key default gen_random_uuid(),
  title        text not null default '',
  subtitle     text not null default '',
  button_text  text not null default '',
  link         text not null default '',
  image_url    text,
  active       boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now()
);

alter table categories enable row level security;
alter table products   enable row level security;
alter table banners    enable row level security;

-- images: public (covers, banners). pdfs: private, served via signed URLs from the API.
insert into storage.buckets (id, name, public) values ('images', 'images', true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('pdfs',   'pdfs',   false) on conflict (id) do nothing;
