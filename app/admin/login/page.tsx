'use client'
import { FormEvent, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Chrome } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  useEffect(() => { if (new URLSearchParams(location.search).get('error') === 'not-approved') setError('You do not have access to the admin dashboard.') }, [])
  async function signIn(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); const { error } = await createClient().auth.signInWithPassword({ email, password }); if (error) { setError(error.message); setLoading(false) } else location.href = '/admin/dashboard' }
  async function googleSignIn() { setLoading(true); setError(''); const { error } = await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } }); if (error) { setError(error.message); setLoading(false) } }
  return <main className="auth-page"><a className="brand auth-brand" href="/"><span>AL</span> Admit Ledger</a><form className="auth-card" onSubmit={signIn}><p className="eyebrow">ADMIN ACCESS</p><h1>Welcome back</h1><p>Only email addresses approved by an administrator can enter this dashboard.</p><button type="button" className="google-button" onClick={googleSignIn} disabled={loading}><Chrome size={18}/> Continue with Google</button><div className="auth-divider"><span>or use admin password</span></div><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcompany.com" /></label><label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></label>{error && <p className="form-error">{error}</p>}<button className="primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in to dashboard'}</button></form></main>
}
