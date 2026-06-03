import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Field, TextArea, Card, SectionHeader, Divider, SaveStatus } from './ui'
import { getMondayOfWeek, formatWeekStart, getWeekLabel, getPrevWeekStart } from '../lib/dates'

const BUCKETS = [
  { key: 'family_action', label: 'Family & Faith', role: 'The mission', color: 'var(--teal-mid)', bg: 'var(--teal-light)', placeholder: 'What one thing will most strengthen your family or faith this week?' },
  { key: 'income_action', label: 'Income engine', role: 'Funds today', color: 'var(--blue-mid)', bg: 'var(--blue-light)', placeholder: 'What one career action most protects or grows income?' },
  { key: 'wealth_action', label: 'Wealth engine', role: 'Builds freedom', color: 'var(--amber-mid)', bg: 'var(--amber-light)', placeholder: 'What one real estate action moves us forward?' },
  { key: 'freedom_action', label: 'Ownership engine', role: 'Creates optionality', color: 'var(--purple-mid)', bg: 'var(--purple-light)', placeholder: 'What one PickleIntel or entrepreneurship action matters most?' },
]

const ALIGNMENT_OPTIONS = [
  { val: 'yes', label: 'Yes, aligned', color: 'var(--teal)' },
  { val: 'partial', label: 'Partially', color: 'var(--amber)' },
  { val: 'no', label: 'No, drifted', color: '#E24B4A' },
]

const EMPTY_WEEK = { family_action: '', income_action: '', wealth_action: '', freedom_action: '', calendar_aligned: '', drift_causes: '', next_week_changes: '', end_of_week_notes: '', status: 'active' }

function WeekCard({ weekStart, readOnly }) {
  const [data, setData] = useState({ ...EMPTY_WEEK })
  const [saveStatus, setSaveStatus] = useState(null)
  const label = getWeekLabel(weekStart)

  useEffect(() => {
    supabase.from('weekly_plans').select('*').eq('week_start', weekStart).single().then(({ data: row }) => {
      if (row) setData(row)
      else setData({ ...EMPTY_WEEK })
    })
  }, [weekStart])

  const save = useCallback(async (updated) => {
    setSaveStatus('saving')
    const { data: existing } = await supabase.from('weekly_plans').select('id').eq('week_start', weekStart).single()
    if (existing) {
      await supabase.from('weekly_plans').update({ ...updated, updated_at: new Date().toISOString() }).eq('week_start', weekStart)
    } else {
      await supabase.from('weekly_plans').insert({ ...updated, week_start: weekStart })
    }
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }, [weekStart])

  const update = (key, val) => {
    const updated = { ...data, [key]: val }
    setData(updated)
    save(updated)
  }

  const isComplete = data.status === 'complete'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '2px' }}>
            {readOnly ? 'Last week' : 'This week'}
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--ink)' }}>{label}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!readOnly && <SaveStatus status={saveStatus} />}
          {isComplete && (
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: 'var(--teal-light)', color: 'var(--teal)', fontWeight: 500 }}>
              Week complete ✓
            </span>
          )}
          {!readOnly && !isComplete && (
            <button className="btn-ghost" style={{ fontSize: '12px' }} onClick={() => update('status', 'complete')}>
              Mark week complete
            </button>
          )}
          {!readOnly && isComplete && (
            <button className="btn-ghost" style={{ fontSize: '12px' }} onClick={() => update('status', 'active')}>
              Reopen
            </button>
          )}
        </div>
      </div>

      {/* Weekly actions */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '1.25rem' }}>
        {BUCKETS.map(b => (
          <div
            key={b.key}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${b.color}`,
              borderRadius: '0 var(--radius) var(--radius) 0',
              padding: '1rem 1.25rem',
              opacity: readOnly && !data[b.key] ? 0.5 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{b.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{b.role}</div>
              </div>
            </div>
            {readOnly ? (
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6, fontStyle: data[b.key] ? 'normal' : 'italic' }}>
                {data[b.key] || 'Nothing recorded'}
              </p>
            ) : (
              <TextArea value={data[b.key]} onChange={val => update(b.key, val)} rows={2} placeholder={b.placeholder} />
            )}
          </div>
        ))}
      </div>

      {/* End-of-week reflection */}
      <Card style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
          {readOnly ? 'Week-end reflection' : 'End-of-week reflection'}
        </p>

        <Field label="Did our calendar reflect our stated priorities?">
          {readOnly ? (
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
              {ALIGNMENT_OPTIONS.find(o => o.val === data.calendar_aligned)?.label || 'Not recorded'}
            </p>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              {ALIGNMENT_OPTIONS.map(o => (
                <button
                  key={o.val}
                  onClick={() => update('calendar_aligned', o.val)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    fontSize: '12px',
                    background: data.calendar_aligned === o.val ? 'var(--ink)' : 'var(--white)',
                    color: data.calendar_aligned === o.val ? 'var(--white)' : 'var(--ink-muted)',
                    border: `1px solid ${data.calendar_aligned === o.val ? 'var(--ink)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >{o.label}</button>
              ))}
            </div>
          )}
        </Field>

        <Field label="What created drift?">
          {readOnly
            ? <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: data.drift_causes ? 'normal' : 'italic' }}>{data.drift_causes || 'Not recorded'}</p>
            : <TextArea value={data.drift_causes} onChange={val => update('drift_causes', val)} rows={2} placeholder="Be honest. What pulled you off course?" />
          }
        </Field>

        <Field label="What should change next week?">
          {readOnly
            ? <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: data.next_week_changes ? 'normal' : 'italic' }}>{data.next_week_changes || 'Not recorded'}</p>
            : <TextArea value={data.next_week_changes} onChange={val => update('next_week_changes', val)} rows={2} placeholder="One or two specific adjustments…" />
          }
        </Field>
      </Card>
    </div>
  )
}

export default function WeeklySection() {
  const thisWeekStart = formatWeekStart(getMondayOfWeek())
  const lastWeekStart = getPrevWeekStart(thisWeekStart)

  return (
    <div>
      <SectionHeader eyebrow="Section 5" title="Weekly review" subtitle="Simple. Focused. Every week." />

      <WeekCard weekStart={thisWeekStart} readOnly={false} />

      <Divider />

      <WeekCard weekStart={lastWeekStart} readOnly={true} />
    </div>
  )
}
