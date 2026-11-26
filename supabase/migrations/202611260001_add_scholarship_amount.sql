alter table public.admissions
  add column if not exists scholarship_amount numeric(12, 2);

drop function if exists public.get_public_admissions();
create function public.get_public_admissions()
returns table (id uuid, student_name text, country text, university_location text, university text, university_logo_url text, program text, has_scholarship boolean, scholarship_name text, scholarship_amount numeric, admission_year integer, created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select a.id,
    (select string_agg(upper(left(word, 1)) || repeat('*', greatest(char_length(word) - 1, 3)), ' ' order by position)
       from regexp_split_to_table(trim(a.student_name), '\s+') with ordinality as w(word, position)) as student_name,
    a.country, a.university_location, a.university, a.university_logo_url, a.program,
    a.has_scholarship, a.scholarship_name, a.scholarship_amount, a.admission_year, a.created_at
  from public.admissions a
  order by a.created_at desc;
$$;
grant execute on function public.get_public_admissions() to anon, authenticated;
