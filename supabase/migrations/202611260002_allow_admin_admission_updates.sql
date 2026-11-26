drop policy if exists "Approved admins can update admissions" on public.admissions;
create policy "Approved admins can update admissions"
on public.admissions for update to authenticated
using (public.is_approved_admin())
with check (public.is_approved_admin());
