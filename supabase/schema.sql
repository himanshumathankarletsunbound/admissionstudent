-- Run this in Supabase SQL Editor before deploying.
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(student_name) >= 2),
  country text not null,
  university text not null,
  program text,
  admission_year integer not null default extract(year from now()),
  created_at timestamptz not null default now()
);
alter table public.admissions enable row level security;
create policy "Public can view admissions" on public.admissions for select using (true);
create policy "Authenticated admins can insert admissions" on public.admissions for insert to authenticated with check (true);
create policy "Authenticated admins can delete admissions" on public.admissions for delete to authenticated using (true);
-- Do not enable public sign-ups. Create admins in Supabase Authentication > Users.
