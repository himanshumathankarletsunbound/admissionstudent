'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Award, LogOut, MailPlus, Pencil, Plus, Trash2, Users, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Admission, AllowedAdmin } from '@/lib/types'
import { countries, countryFlag } from '@/lib/countries'
import { parseUniversityCsv, type UniversityOption } from '@/lib/universities'

const blank = { student_name: '', country: '', university_location: '', university: '', university_logo_url: '', program: '', has_scholarship: false, scholarship_name: '', scholarship_amount: '', admission_year: new Date().getFullYear() }

export function AdminDashboard({ initialAdmissions, initialAdmins }: { initialAdmissions: Admission[]; initialAdmins: AllowedAdmin[] }) {
  const [items, setItems] = useState(initialAdmissions)
  const [admins, setAdmins] = useState(initialAdmins)
  const [approvedEmail, setApprovedEmail] = useState('')
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [universityOptions, setUniversityOptions] = useState<UniversityOption[]>([])
  const [showUniversityResults, setShowUniversityResults] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { fetch('/universities.csv').then(response => response.text()).then(csv => setUniversityOptions(parseUniversityCsv(csv))).catch(() => setMessage('University list could not be loaded.')) }, [])
  const universityMatches = useMemo(() => { const term = form.university.trim().toLocaleLowerCase(); return term.length < 2 ? [] : universityOptions.filter(option => option.name.toLocaleLowerCase().includes(term)).slice(0, 8) }, [form.university, universityOptions])
  function selectUniversity(option: UniversityOption) { setForm({ ...form, university: option.name, university_location: option.location }); setShowUniversityResults(false) }
  function edit(item: Admission) {
    setEditingId(item.id)
    setForm({ student_name: item.student_name, country: item.country, university_location: item.university_location, university: item.university, university_logo_url: item.university_logo_url || '', program: item.program || '', has_scholarship: item.has_scholarship, scholarship_name: item.scholarship_name || '', scholarship_amount: item.scholarship_amount?.toString() || '', admission_year: item.admission_year })
    setMessage('Editing admission. Save changes when you are ready.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function cancelEdit() { setEditingId(null); setForm(blank); setMessage('') }
  async function add(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('')
    const payload = { ...form, university_country: form.university_location, university_logo_url: form.university_logo_url || null, scholarship_name: form.has_scholarship ? form.scholarship_name.trim() : null, scholarship_amount: form.has_scholarship ? Number(form.scholarship_amount) : null }
    const result = editingId
      ? await supabase.from('admissions').update(payload).eq('id', editingId).select().single()
      : await supabase.from('admissions').insert(payload).select().single()
    const { data, error } = result
    setSaving(false)
    if (error) setMessage(error.message)
    else { const saved = data as Admission; setItems(editingId ? items.map(item => item.id === saved.id ? saved : item) : [saved, ...items]); setEditingId(null); setForm(blank); setMessage(editingId ? 'Admission updated.' : 'Admission published.') }
  }
  async function remove(id: string) { if (!confirm('Remove this admission?')) return; const { error } = await supabase.from('admissions').delete().eq('id', id); if (error) setMessage(error.message); else setItems(items.filter(item => item.id !== id)) }
  async function addAdmin(event: FormEvent) { event.preventDefault(); const email = approvedEmail.trim().toLowerCase(); const { data, error } = await supabase.from('allowed_admin_emails').insert({ email }).select().single(); if (error) setMessage(error.message); else { setAdmins([...admins, data as AllowedAdmin]); setApprovedEmail(''); setMessage(`${email} can now sign in with Google.`) } }
  async function removeAdmin(email: string) { if (!confirm(`Remove ${email}'s admin access?`)) return; const { error } = await supabase.from('allowed_admin_emails').delete().eq('email', email); if (error) setMessage(error.message); else setAdmins(admins.filter(admin => admin.email !== email)) }
  async function logout() { await supabase.auth.signOut(); location.href = '/' }

  return <main className="admin-page">
    <nav><a className="brand" href="/"><span>AL</span> Lets Unbound</a><button className="plain-btn" onClick={logout}><LogOut size={17}/> Sign out</button></nav>
    <div className="admin-content">
      <div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Manage admissions</h1><p className="muted">Add a student record and it will appear on the public dashboard immediately.</p></div>
      <div className="admin-layout">
        <form className="add-card" onSubmit={add}>
          <h2>{editingId ? <Pencil size={20}/> : <Plus size={20}/>} {editingId ? 'Edit admission' : 'Add admission'}</h2>
          <label>Student full name<input required value={form.student_name} onChange={event => setForm({ ...form, student_name: event.target.value })} placeholder="e.g. Aarav Kumar" /></label>
          <div className="two-cols">
            <label>Resident country <small>Search or choose</small><span className="country-input"><span>{countryFlag(form.country)}</span><input list="country-options" required value={form.country} onChange={event => setForm({ ...form, country: event.target.value })} placeholder="Search a country" /></span></label>
            <label>University location <small>Filled from university choice</small><input required value={form.university_location} onChange={event => setForm({ ...form, university_location: event.target.value })} placeholder="e.g. United Kingdom" /></label>
          </div>
          <datalist id="country-options">{countries.map(([name, flag]) => <option key={name} value={name}>{flag} {name}</option>)}</datalist>
          <label>Admission year<input type="number" required value={form.admission_year} onChange={event => setForm({ ...form, admission_year: +event.target.value })} /></label>
          <label className="university-picker">University <small>Search the university list</small><input required autoComplete="off" value={form.university} onFocus={() => setShowUniversityResults(true)} onChange={event => { setForm({ ...form, university: event.target.value }); setShowUniversityResults(true) }} placeholder="Start typing a university name" />{showUniversityResults && universityMatches.length > 0 && <div className="university-results">{universityMatches.map(option => <button type="button" key={`${option.name}-${option.location}`} onMouseDown={event => { event.preventDefault(); selectUniversity(option) }}><strong>{option.name}</strong><span>{option.location}</span></button>)}</div>}</label>
          <label>University logo URL <small>(optional)</small><input type="url" value={form.university_logo_url} onChange={event => setForm({ ...form, university_logo_url: event.target.value })} placeholder="https://.../official-logo.png" /></label>
          <label>Program <small>(optional)</small><input value={form.program} onChange={event => setForm({ ...form, program: event.target.value })} placeholder="e.g. Computer Science" /></label>
          <fieldset className="scholarship-field"><legend><Award size={17}/> Scholarship</legend><label className="toggle-control"><span><strong>Got scholarship?</strong><small>Show this achievement on the public dashboard.</small></span><input type="checkbox" checked={form.has_scholarship} onChange={event => setForm({ ...form, has_scholarship: event.target.checked, scholarship_name: event.target.checked ? form.scholarship_name : '', scholarship_amount: event.target.checked ? form.scholarship_amount : '' })}/><i aria-hidden="true" /></label>{form.has_scholarship && <div className="two-cols"><label>Scholarship name<input required value={form.scholarship_name} onChange={event => setForm({ ...form, scholarship_name: event.target.value })} placeholder="e.g. Merit Scholarship" /></label><label>Scholarship amount<input type="number" min="0" step="0.01" required value={form.scholarship_amount} onChange={event => setForm({ ...form, scholarship_amount: event.target.value })} placeholder="e.g. 25000" /></label></div>}</fieldset>
          {message && <p className="status">{message}</p>}<button className="primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish admission'}</button>{editingId && <button className="cancel-edit" type="button" onClick={cancelEdit}><X size={16}/> Cancel editing</button>}
        </form>
        <section className="records"><div className="records-head"><h2>Published records</h2><span>{items.length} total</span></div>{items.map(item => <article className="record" key={item.id}><div><strong>{item.student_name}</strong><p>{item.university} · {item.university_location}{item.has_scholarship ? ` · Scholarship: ${item.scholarship_name} (${item.scholarship_amount})` : ''}</p></div><div className="record-actions"><button onClick={() => edit(item)} aria-label="Edit admission"><Pencil size={17}/> Edit</button><button onClick={() => remove(item.id)} aria-label="Delete admission"><Trash2 size={17}/></button></div></article>)}{!items.length && <p className="empty">No admissions published yet.</p>}</section>
      </div>
      <section className="users-card"><div><p className="eyebrow">ACCESS CONTROL</p><h2><Users size={20}/> Approved Google users</h2><p className="muted">Only these email addresses may access the admin dashboard.</p></div><form className="email-add" onSubmit={addAdmin}><input type="email" required value={approvedEmail} onChange={event => setApprovedEmail(event.target.value)} placeholder="name@company.com"/><button className="primary"><MailPlus size={16}/> Give access</button></form><div className="approved-list">{admins.map(admin => <div className="record" key={admin.email}><strong>{admin.email}</strong><button onClick={() => removeAdmin(admin.email)} aria-label="Remove admin access"><Trash2 size={17}/></button></div>)}</div></section>
    </div>
  </main>
}
