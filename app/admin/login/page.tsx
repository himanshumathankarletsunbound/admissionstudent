'use client'
import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function signIn(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); const { error } = await createClient().auth.signInWithPassword({ email, password }); if (error) { setError(error.message); setLoading(false) } else location.href = '/admin/dashboard' }
  return <main className="auth-page"><a className="brand auth-brand" href="/"><span>AL</span> Admit Ledger</a><form className="auth-card" onSubmit={signIn}><p className="eyebrow">ADMIN ACCESS</p><h1>Welcome back</h1><p>Sign in to publish student admissions.</p><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@yourcompany.com" /></label><label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></label>{error && <p className="form-error">{error}</p>}<button className="primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in to dashboard'}</button></form></main>
}
