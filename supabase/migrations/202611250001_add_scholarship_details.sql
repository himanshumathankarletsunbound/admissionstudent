-- Scholarship details are optional, but a named scholarship is required when enabled.
alter table public.admissions
  add column if not exists has_scholarship boolean not null default false,
  add column if not exists scholarship_name text;

update public.admissions
set has_scholarship = true
where nullif(trim(scholarship_name), '') is not null;

alter table public.admissions
  drop constraint if exists admissions_scholarship_name_required;
alter table public.admissions
  add constraint admissions_scholarship_name_required
  check (not has_scholarship or nullif(trim(scholarship_name), '') is not null);

drop function if exists public.get_public_admissions();
create function public.get_public_admissions()
returns table (id uuid, student_name text, country text, university_location text, university text, university_logo_url text, program text, has_scholarship boolean, scholarship_name text, admission_year integer, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select a.id,
    (select string_agg(upper(left(word, 1)) || repeat('*', greatest(char_length(word) - 1, 3)), ' ' order by position)
       from regexp_split_to_table(trim(a.student_name), '\s+') with ordinality as w(word, position)) as student_name,
    a.country, a.university_location, a.university, a.university_logo_url, a.program,
    a.has_scholarship, a.scholarship_name, a.admission_year, a.created_at
  from public.admissions a
  order by a.created_at desc;
$$;
grant execute on function public.get_public_admissions() to anon, authenticated;
