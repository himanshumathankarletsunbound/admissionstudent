import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin-dashboard'
import type { Admission, AllowedAdmin } from '@/lib/types'

export default async function AdminPage() { const supabase = await createClient(); const [{ data: admissions }, { data: admins }] = await Promise.all([supabase.from('admissions').select('*').order('created_at', { ascending: false }), supabase.from('allowed_admin_emails').select('*').order('created_at')]); return <AdminDashboard initialAdmissions={(admissions || []) as Admission[]} initialAdmins={(admins || []) as AllowedAdmin[]} /> }
