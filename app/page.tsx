import { AdmissionsDashboard } from '@/components/dashboard'
import { createClient } from '@/lib/supabase/server'
import type { Admission } from '@/lib/types'

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  // This database function returns only privacy-safe, already-masked student names.
  const { data } = await supabase.rpc('get_public_admissions')
  const admissions = (data || []) as Admission[]
  return <main>
    <nav><a className="brand" href="/"><span>AL</span> Admit Ledger</a><a className="admin-link" href="/admin/login">Admin portal →</a></nav>
    <header className="hero"><p className="eyebrow">STUDENT SUCCESS, VERIFIED</p><h1>Every admission is<br/><em>a new beginning.</em></h1><p className="intro">A transparent record of the students we have supported on their path to universities around the world.</p><div className="privacy-note"><span>✦</span> Student names are displayed confidentially to protect their privacy.</div></header>
    <AdmissionsDashboard admissions={admissions} />
    <footer>© {new Date().getFullYear()} Admit Ledger <span>•</span> Celebrating every student’s next chapter.</footer>
  </main>
}
