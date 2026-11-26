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
    <header className="hero"><div className="hero-results"><img className="hero-logo" src="/lets-unbound-logo.webp" alt="Lets Unbound" /><h1>An Admissions Report You Can Hold Us Accountable To</h1><div className="privacy-note"><span>✦</span> Student names are displayed confidentially to protect their privacy.</div></div></header>
    <AdmissionsDashboard admissions={admissions} />
    <footer>© {new Date().getFullYear()} Lets Unbound <span>•</span> Celebrating every student’s next chapter.</footer>
  </main>
}
