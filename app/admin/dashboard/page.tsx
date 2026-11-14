import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin-dashboard'
import type { Admission } from '@/lib/types'

export default async function AdminPage() { const supabase = await createClient(); const { data } = await supabase.from('admissions').select('*').order('created_at', { ascending: false }); return <AdminDashboard initialAdmissions={(data || []) as Admission[]} /> }
