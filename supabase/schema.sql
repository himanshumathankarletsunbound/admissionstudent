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
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admissions enable row level security;
alter table public.admin_users enable row level security;

-- Raw names never leave the database for public visitors.
drop policy if exists "Public can view admissions" on public.admissions;
drop policy if exists "Authenticated admins can insert admissions" on public.admissions;
drop policy if exists "Authenticated admins can delete admissions" on public.admissions;
create policy "Approved admins can view admissions" on public.admissions for select to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);
create policy "Approved admins can insert admissions" on public.admissions for insert to authenticated with check (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);
create policy "Approved admins can delete admissions" on public.admissions for delete to authenticated using (
  exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- The public dashboard can call this function but cannot select from admissions directly.
create or replace function public.get_public_admissions()
returns table (id uuid, student_name text, country text, university text, program text, admission_year integer, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select a.id,
    (select string_agg(upper(left(word, 1)) || repeat('*', greatest(char_length(word) - 1, 3)), ' ' order by position)
       from regexp_split_to_table(trim(a.student_name), '\s+') with ordinality as w(word, position)) as student_name,
    a.country, a.university, a.program, a.admission_year, a.created_at
  from public.admissions a
  order by a.created_at desc;
$$;
revoke all on public.admissions from anon;
grant execute on function public.get_public_admissions() to anon, authenticated;

-- After creating your first Auth user, insert their UUID here in the SQL Editor:
-- insert into public.admin_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
-- Keep "Enable sign ups" disabled in Authentication > Providers > Email.
