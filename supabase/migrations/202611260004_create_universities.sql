create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  source_name text not null unique,
  name text not null,
  country text not null,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists universities_country_idx on public.universities (country);

alter table public.universities enable row level security;

create policy "Approved admins can view universities"
on public.universities for select to authenticated
using (public.is_approved_admin());

create policy "Approved admins can add universities"
on public.universities for insert to authenticated
with check (public.is_approved_admin());

create policy "Approved admins can update universities"
on public.universities for update to authenticated
using (public.is_approved_admin())
with check (public.is_approved_admin());
