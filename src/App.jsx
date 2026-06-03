import React, { useState } from 'react'
import VisionSection from './components/VisionSection'
import AnnualSection from './components/AnnualSection'
import QuarterlySection from './components/QuarterlySection'
import WeeklySection from './components/WeeklySection'
import { getCurrentQuarter, getCurrentYear, getWeekLabel, getMondayOfWeek, formatWeekStart } from './lib/dates'

const NAV = [
  { id: 'vision', label: 'Vision & Roadmap', short: 'Vision' },
  { id: 'annual', label: 'Annual Plan', short: 'Annual' },
  { id: 'quarterly', label: 'Quarterly Priorities', short: 'Quarterly' },
  { id: 'weekly', label: 'Weekly Review', short: 'Weekly' },
]

export default function App() {
  const [active, setActive] = useState('weekly')
  const q = getCurrentQuarter()
  const year = getCurrentYear()
  const weekLabel = getWeekLabel(formatWeekStart(getMondayOfWeek()))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h1 style={{ fontSize: '16px', fontFamily: 'var(--font-serif)', color: 'var(--ink)', fontWeight: 500 }}>Family OS</h1>
            <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>Ryan & Brienne</span>
          </div>

          <nav style={{ display: 'flex', gap: '2px' }}>
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  background: active === n.id ? 'var(--cream)' : 'transparent',
                  color: active === n.id ? 'var(--ink)' : 'var(--ink-faint)',
                  border: active === n.id ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: active === n.id ? 500 : 400,
                  transition: 'all 0.15s',
                }}
              >{n.short}</button>
            ))}
          </nav>

          <div style={{ fontSize: '12px', color: 'var(--ink-faint)', textAlign: 'right' }}>
            <div>Q{q} · {year}</div>
            <div style={{ fontSize: '11px' }}>{weekLabel}</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
        {active === 'vision' && <VisionSection />}
        {active === 'annual' && <AnnualSection />}
        {active === 'quarterly' && <QuarterlySection />}
        {active === 'weekly' && <WeeklySection />}
      </main>

      {/* Footer */}
      <footer style={{ maxWidth: 860, margin: '0 auto', padding: '1rem 2rem 3rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', color: 'var(--ink-faint)', fontStyle: 'italic', textAlign: 'center' }}>
          "One of our biggest risks is accidentally becoming highly successful in something that is not our actual dream."
        </p>
      </footer>
    </div>
  )
}
