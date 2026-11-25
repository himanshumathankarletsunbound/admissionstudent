-- Run this in Supabase SQL Editor before deploying.
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(student_name) >= 2),
  country text not null,
  university_location text not null,
  university text not null,
  university_logo_url text,
  program text,
  has_scholarship boolean not null default false,
  scholarship_name text,
  constraint admissions_scholarship_name_required check (not has_scholarship or nullif(trim(scholarship_name), '') is not null),
  admission_year integer not null default extract(year from now()),
  created_at timestamptz not null default now()
);
alter table public.admissions add column if not exists university_logo_url text;
alter table public.admissions add column if not exists university_location text;
update public.admissions set university_location = country where university_location is null;
alter table public.admissions alter column university_location set not null;
create table if not exists public.allowed_admin_emails (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

alter table public.admissions enable row level security;
alter table public.allowed_admin_emails enable row level security;

create or replace function public.is_approved_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.allowed_admin_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Raw names never leave the database for public visitors.
drop policy if exists "Public can view admissions" on public.admissions;
drop policy if exists "Authenticated admins can insert admissions" on public.admissions;
drop policy if exists "Authenticated admins can delete admissions" on public.admissions;
drop policy if exists "Approved admins can view admissions" on public.admissions;
drop policy if exists "Approved admins can insert admissions" on public.admissions;
drop policy if exists "Approved admins can delete admissions" on public.admissions;
drop policy if exists "Approved admins can view allowed emails" on public.allowed_admin_emails;
drop policy if exists "Approved admins can add allowed emails" on public.allowed_admin_emails;
drop policy if exists "Approved admins can remove allowed emails" on public.allowed_admin_emails;
create policy "Approved admins can view admissions" on public.admissions for select to authenticated using (
  public.is_approved_admin()
);
create policy "Approved admins can insert admissions" on public.admissions for insert to authenticated with check (
  public.is_approved_admin()
);
create policy "Approved admins can delete admissions" on public.admissions for delete to authenticated using (
  public.is_approved_admin()
);
create policy "Approved admins can view allowed emails" on public.allowed_admin_emails for select to authenticated using (public.is_approved_admin());
create policy "Approved admins can add allowed emails" on public.allowed_admin_emails for insert to authenticated with check (public.is_approved_admin());
create policy "Approved admins can remove allowed emails" on public.allowed_admin_emails for delete to authenticated using (public.is_approved_admin());

-- The public dashboard can call this function but cannot select from admissions directly.
drop function if exists public.get_public_admissions();
create function public.get_public_admissions()
returns table (id uuid, student_name text, country text, university_location text, university text, university_logo_url text, program text, has_scholarship boolean, scholarship_name text, admission_year integer, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select a.id,
    (select string_agg(upper(left(word, 1)) || repeat('*', greatest(char_length(word) - 1, 3)), ' ' order by position)
       from regexp_split_to_table(trim(a.student_name), '\s+') with ordinality as w(word, position)) as student_name,
    a.country, a.university_location, a.university, a.university_logo_url, a.program, a.has_scholarship, a.scholarship_name, a.admission_year, a.created_at
  from public.admissions a
  order by a.created_at desc;
$$;
revoke all on public.admissions from anon;
grant execute on function public.get_public_admissions() to anon, authenticated;
grant execute on function public.is_approved_admin() to authenticated;

-- Bootstrap the initial administrator. This email may sign in using Google or its email/password account.
insert into public.allowed_admin_emails (email) values ('himanshu.m@letsunbound.com') on conflict do nothing;
-- In Authentication > Providers, enable Google and configure its OAuth credentials.
