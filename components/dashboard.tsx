'use client'

import { useMemo, useState } from 'react'
import { Building2, GraduationCap, Search, UsersRound } from 'lucide-react'
import type { Admission } from '@/lib/types'
import { maskName } from '@/lib/mask-name'

type Props = { admissions: Admission[] }

export function AdmissionsDashboard({ admissions }: Props) {
  const [view, setView] = useState<'students' | 'colleges'>('students')
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('All countries')
  const countries = useMemo(() => ['All countries', ...Array.from(new Set(admissions.map(x => x.country))).sort()], [admissions])
  const filtered = useMemo(() => admissions.filter(x => (country === 'All countries' || x.country === country) && `${x.university} ${x.country} ${x.program || ''}`.toLowerCase().includes(query.toLowerCase())), [admissions, country, query])
  const collegeGroups = useMemo(() => Object.values(filtered.reduce<Record<string, { university: string; country: string; total: number; programs: Set<string> }>>((a, x) => {
    const key = `${x.university}-${x.country}`
    a[key] ??= { university: x.university, country: x.country, total: 0, programs: new Set() }
    a[key].total++; if (x.program) a[key].programs.add(x.program); return a
  }, {})).sort((a,b) => b.total-a.total), [filtered])

  return <section className="dashboard-shell">
    <div className="stats">
      <Stat icon={<GraduationCap />} label="Student admissions" value={admissions.length} />
      <Stat icon={<Building2 />} label="University partners" value={new Set(admissions.map(x => x.university)).size} />
      <Stat icon={<UsersRound />} label="Countries reached" value={new Set(admissions.map(x => x.country)).size} />
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

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="stat"><span>{icon}</span><div><strong>{value.toLocaleString()}</strong><p>{label}</p></div></div> }
function Flag({ country }: { country: string }) { const flags: Record<string,string> = { USA:'🇺🇸', UK:'🇬🇧', Canada:'🇨🇦', Australia:'🇦🇺', Germany:'🇩🇪', Ireland:'🇮🇪' }; return <span className="flag">{flags[country] || '🌍'}</span> }
function StudentTable({ rows }: { rows: Admission[] }) { return <div className="table-wrap"><table><thead><tr><th>S. No.</th><th>Student</th><th>Country</th><th>Admitted university</th><th>Program</th></tr></thead><tbody>{rows.map((x, index) => <tr key={x.id}><td>{String(index + 1).padStart(2, '0')}</td><td><span className="avatar">{x.student_name[0]}</span>{maskName(x.student_name)}</td><td><Flag country={x.country}/>{x.country}</td><td className="university">{x.university}</td><td>{x.program || '—'}</td></tr>)}</tbody></table>{!rows.length && <p className="empty">No admissions match your search.</p>}</div> }
function CollegeGrid({ groups }: { groups: { university:string; country:string; total:number; programs:Set<string> }[] }) { return <div className="college-grid">{groups.map(x => <article className="college" key={`${x.university}-${x.country}`}><div className="college-top"><span className="college-icon"><Building2 size={20}/></span><b>{x.total}</b><small>admissions</small></div><h3>{x.university}</h3><p><Flag country={x.country}/>{x.country}</p><div className="chips">{[...x.programs].slice(0,3).map(p => <span key={p}>{p}</span>)}</div></article>)}{!groups.length && <p className="empty">No universities match your search.</p>}</div> }
