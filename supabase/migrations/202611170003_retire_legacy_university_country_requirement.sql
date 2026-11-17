-- `university_location` is the canonical field. Keep the legacy column only
-- for backwards compatibility with older records and clients.
alter table public.admissions
  alter column university_country drop not null;

update public.admissions
set university_country = university_location
where university_country is null;
