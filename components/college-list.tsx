'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Building2, Pencil, Plus, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { University } from '@/lib/types'

type CollegeRow = Pick<University, 'source_name' | 'name' | 'country' | 'logo_url'>
const blank = { name: '', country: '', logo_url: '' }

export function CollegeList({ initialUniversities }: { initialUniversities: University[] }) {
  const [colleges, setColleges] = useState<CollegeRow[]>(initialUniversities)
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All countries')
  const [form, setForm] = useState(blank)
  const [editingSource, setEditingSource] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const sortedColleges = useMemo(() => [...colleges].sort((a, b) => a.name.localeCompare(b.name)), [colleges])

  const countries = useMemo(() => ['All countries', ...Array.from(new Set(sortedColleges.map(item => item.country).filter(Boolean))).sort()], [sortedColleges])
  const filtered = useMemo(() => sortedColleges.filter(item => (country === 'All countries' || item.country === country) && `${item.name} ${item.country}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [sortedColleges, country, query])

  function startEdit(item: CollegeRow) {
    setEditingSource(item.source_name)
    setForm({ name: item.name, country: item.country, logo_url: item.logo_url || '' })
    setMessage('Editing college details. Save changes when ready.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() { setEditingSource(null); setForm(blank); setMessage('') }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const source_name = editingSource || form.name.trim()
    const { data, error } = await supabase.from('universities').upsert({ source_name, name: form.name.trim(), country: form.country.trim(), logo_url: form.logo_url.trim() || null }, { onConflict: 'source_name' }).select().single()
    setSaving(false)
    if (error) { setMessage(error.message); return }
    const saved = data as University
    setColleges(current => [...current.filter(item => item.source_name !== saved.source_name), saved])
    setEditingSource(null)
    setForm(blank)
    setMessage(editingSource ? 'College updated.' : 'College added.')
  }

  return <main className="admin-page">
    <nav><a className="brand" href="/admin/dashboard"><span>AL</span> Lets Unbound</a><a className="plain-btn" href="/admin/dashboard">Admissions</a></nav>
    <div className="admin-content college-admin-content">
      <div><p className="eyebrow">COLLEGE DIRECTORY</p><h1>College list</h1><p className="muted">Your Supabase college directory. Add, search, filter, and maintain the name, country, and logo shown to your team.</p></div>
      <div className="college-admin-layout">
        <form className="add-card college-form" onSubmit={save}>
          <h2>{editingSource ? <Pencil size={20}/> : <Plus size={20}/>} {editingSource ? 'Edit college' : 'Add college'}</h2>
          <label>College name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="e.g. University of Toronto" /></label>
          <label>Country<input required value={form.country} onChange={event => setForm({ ...form, country: event.target.value })} placeholder="e.g. Canada" /></label>
          <label>College logo URL <small>(optional)</small><input type="url" value={form.logo_url} onChange={event => setForm({ ...form, logo_url: event.target.value })} placeholder="https://.../official-logo.png" /></label>
          {message && <p className="status">{message}</p>}
          <button className="primary" disabled={saving}>{saving ? 'Saving…' : editingSource ? 'Save changes' : 'Add college'}</button>
          {editingSource && <button className="cancel-edit" type="button" onClick={cancelEdit}><X size={16}/> Cancel editing</button>}
        </form>
        <section className="records college-directory">
          <div className="records-head"><h2><Building2 size={20}/> Colleges</h2><span>{filtered.length} shown</span></div>
          <div className="college-directory-filters"><label className="search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search colleges" /></label><select value={country} onChange={event => setCountry(event.target.value)}>{countries.map(item => <option key={item}>{item}</option>)}</select></div>
          <div className="college-directory-list">{filtered.map(item => <article className="record college-directory-row" key={item.source_name}><div className="college-directory-info"><img src={item.logo_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=2e3da0`} alt="" /><div><strong>{item.name}</strong><p>{item.country}</p></div></div><button className="edit-college" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`}><Pencil size={16}/> Edit</button></article>)}{!filtered.length && <p className="empty">No colleges match this search.</p>}</div>
        </section>
      </div>
    </div>
  </main>
}
