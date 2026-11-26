'use client'

import { useEffect, useState } from 'react'

export function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])

  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours() % 12
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return <aside className="live-clock" aria-label={`Current local time: ${time}`}>
    <div className="clock-face">
      <i className="clock-hand hour-hand" style={{ transform: `rotate(${hours * 30 + minutes / 2}deg)` }} />
      <i className="clock-hand minute-hand" style={{ transform: `rotate(${minutes * 6 + seconds / 10}deg)` }} />
      <i className="clock-hand second-hand" style={{ transform: `rotate(${seconds * 6}deg)` }} />
      <b className="clock-center" />
      <span className="clock-twelve">12</span><span className="clock-three">3</span><span className="clock-six">6</span><span className="clock-nine">9</span>
    </div>
    <p>Live local time</p><strong>{time}</strong>
  </aside>
}
