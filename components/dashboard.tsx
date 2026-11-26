'use client'

import { useMemo, useState } from 'react'
import { Award, Building2, GraduationCap, Search } from 'lucide-react'
import type { Admission } from '@/lib/types'
import { maskName } from '@/lib/mask-name'
import { countryFlag } from '@/lib/countries'

type Props = { admissions: Admission[] }

export function AdmissionsDashboard({ admissions }: Props) {
  const [view, setView] = useState<'students' | 'colleges'>('students')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All countries')
  const countries = useMemo(() => ['All countries', ...Array.from(new Set(admissions.map(x => x.country))).sort()], [admissions])
  const filtered = useMemo(() => admissions.filter(x => (country === 'All countries' || x.country === country) && `${x.university} ${x.country} ${x.university_location} ${x.program || ''}`.toLowerCase().includes(query.toLowerCase())), [admissions, country, query])
  const collegeGroups = useMemo(() => Object.values(filtered.reduce<Record<string, { university: string; country: string; university_logo_url: string | null; total: number; programs: Set<string> }>>((a, x) => {
    const key = `${x.university}-${x.university_location}`
    a[key] ??= { university: x.university, country: x.university_location, university_logo_url: x.university_logo_url, total: 0, programs: new Set() }
    a[key].total++; if (x.program) a[key].programs.add(x.program); return a
  }, {})).sort((a,b) => b.total-a.total), [filtered])

  return <section className="dashboard-shell">
    <div className="stats">
      <Stat icon={<GraduationCap />} value={admissions.length} label="Admits"  />
      <Stat icon={<Building2 />}  value={new Set(admissions.map(admission => admission.university)).size}label="University"  />
      <Stat icon={<Award />}  value={admissions.reduce((total, admission) => total + (admission.has_scholarship ? admission.scholarship_amount || 0 : 0), 0)} prefix="$" label="Total scholarship amount" />
    </div>
    <div className="panel">
      <div className="panel-head">
        <div className="tabs" role="tablist"><button className={view === 'students' ? 'active' : ''} onClick={() => setView('students')}>Student-wise</button><button className={view === 'colleges' ? 'active' : ''} onClick={() => setView('colleges')}>College-wise</button></div>
        <div className="filters"><label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search university or program" /></label><select value={country} onChange={e => setCountry(e.target.value)}>{countries.map(x => <option key={x}>{x}</option>)}</select></div>
      </div>
      {view === 'students' ? <StudentTable rows={filtered} /> : <CollegeGrid groups={collegeGroups} />}
    </div>
  </section>
}

function Stat({ icon, label, value, prefix = '' }: { icon: React.ReactNode; label: string; value: number; prefix?: string }) { return <div className="stat"><span>{icon}</span><div className="stat-copy"><p>{label}</p><strong>{prefix}{value.toLocaleString()}</strong></div></div> }
function Flag({ country }: { country: string }) { return <span className="flag">{countryFlag(country)}</span> }
function StudentTable({ rows }: { rows: Admission[] }) { return <div className="table-wrap"><table><thead><tr><th>S. No.</th><th>Student</th><th>Resident country</th><th>Admitted university</th><th>country</th><th>Program</th><th>Scholarship / aid</th></tr></thead><tbody>{rows.map((x, index) => <tr key={x.id}><td>{String(index + 1).padStart(2, '0')}</td><td className="student-name"><img className="avatar-photo" src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(x.student_name)}`} alt="" />{maskName(x.student_name)}</td><td><Flag country={x.country}/>{x.country}</td><td className="university"><UniversityLogo admission={x}/><span className="university-name">{x.university}</span></td><td>{x.university_location}</td><td>{x.program || '—'}</td><td>{x.has_scholarship ? <span className="scholarship-pills"><span className="scholarship-amount"><Award size={14}/>{formatAmount(x.scholarship_amount)}</span><span className="scholarship-name">{x.scholarship_name}</span></span> : '—'}</td></tr>)}</tbody></table>{!rows.length && <p className="empty">No admissions match your search.</p>}</div> }
function formatAmount(amount: number | null) { return amount === null ? '' : `$${new Intl.NumberFormat().format(amount)}` }
function UniversityLogo({ admission }: { admission: Admission }) { const source = admission.university_logo_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(admission.university)}&backgroundColor=164b3d`; return <img className="university-logo" src={source} alt="" /> }
function CollegeGrid({ groups }: { groups: { university:string; country:string; total:number; programs:Set<string>; university_logo_url?:string|null }[] }) { return <div className="college-grid">{groups.map(x => <article className="college" key={`${x.university}-${x.country}`}><div className="college-top"><img className="college-logo" src={x.university_logo_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(x.university)}&backgroundColor=164b3d`} alt=""/><b>{x.total}</b><small>admissions</small></div><h3>{x.university}</h3><p><Flag country={x.country}/>{x.country}</p><div className="chips">{[...x.programs].slice(0,3).map(p => <span key={p}>{p}</span>)}</div></article>)}{!groups.length && <p className="empty">No universities match your search.</p>}</div> }
