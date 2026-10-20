-- Run once in the Supabase SQL Editor.

-- Admin-editable content, one JSON document per section
-- (seats, location, form, ticker, partners).
create table if not exists public.site_content (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz not null default now()
);

-- Reservations submitted from the landing page form.
create table if not exists public.reservations (
    id bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    name text not null,
    phone text not null,
    wedding_month text not null,
    visit_day text not null,
    agree_privacy boolean not null default true,
    agree_marketing boolean not null default false,
    region text not null default 'daegu',
    status text not null default 'new'
        check (status in ('new', 'contacted', 'visited', 'cancelled')),
    memo text not null default ''
);

create index if not exists reservations_created_at_idx
    on public.reservations (created_at desc);

-- For databases created before regions were added.
alter table public.reservations add column if not exists region text not null default 'daegu';

-- RLS on with no policies: the anon key can't read or write these tables.
-- The site accesses them only from the server with the service role key.
alter table public.site_content enable row level security;
alter table public.reservations enable row level security;

-- Public bucket for images uploaded from the admin (partner photos).
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;
