import { AdmissionsDashboard } from '@/components/dashboard'
import { createClient } from '@/lib/supabase/server'
import type { Admission } from '@/lib/types'
import { Trophy } from 'lucide-react'

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  // This database function returns only privacy-safe, already-masked student names.
  const { data } = await supabase.rpc('get_public_admissions')
  const admissions = (data || []) as Admission[]
  return <main>
    <nav className="public-nav"><a className="public-logo" href="/" aria-label="Lets Unbound home"><img src="/lets-unbound-logo.webp" alt="Lets Unbound" /></a></nav>
    <header className="hero"><div className="intake-label" aria-label="Admission results: Fall 2027"><Trophy size={31} strokeWidth={2.25}/><span><small>Admission results</small><strong>Fall 2027</strong></span></div><h1>Every admission is<br/><em>a new beginning.</em></h1><p className="intro">A transparent record of the students we have supported on their path to universities around the world.</p><div className="privacy-note"><span>✦</span> Student names are displayed confidentially to protect their privacy.</div></header>
    <AdmissionsDashboard admissions={admissions} />
    <footer>© {new Date().getFullYear()} Lets Unbound <span>•</span> Celebrating every student’s next chapter.</footer>
  </main>
}
