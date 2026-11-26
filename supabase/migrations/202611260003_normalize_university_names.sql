-- Standardize variants of Pennsylvania State and remove campus suffixes from
-- university names so public records group under the same institution.

update public.admissions
set university = 'Pennsylvania State'
where lower(trim(university)) in (
  'pennsylvania state university world campus',
  'penn state university park'
);

update public.admissions
set university = trim(
  regexp_replace(
    trim(university),
    '(?:,\s*|\s+)(?:worldwide campus|world campus|park)\s*$',
    '',
    'i'
  )
)
where trim(university) ~* '(?:,\s*|\s+)(?:worldwide campus|world campus|park)\s*$';
