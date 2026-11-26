'use client'

import { useEffect, useState } from 'react'

export function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return <aside className="live-clock" aria-label={`Current local time: ${time}`}><p>Live local time</p><strong>{time}</strong></aside>
}
