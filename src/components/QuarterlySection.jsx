import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Field, TextArea, TextInput, SelectField, Card, SectionHeader, Divider, StatusBadge, SaveStatus } from './ui'
import { getCurrentQuarter, getCurrentYear, getQuarterLabel, quarterDateRange } from '../lib/dates'

const BUCKETS = ['Family & Faith', 'Income engine', 'Wealth engine', 'Ownership engine']
const BUCKET_COLORS = {
  'Family & Faith': { color: 'var(--teal-mid)', bg: 'var(--teal-light)' },
  'Income engine': { color: 'var(--blue-mid)', bg: 'var(--blue-light)' },
  'Wealth engine': { color: 'var(--amber-mid)', bg: 'var(--amber-light)' },
  'Ownership engine': { color: 'var(--purple-mid)', bg: 'var(--purple-light)' },
}

const STATUS_OPTIONS = ['active', 'complete', 'dropped']

const EMPTY = {
  priority_1_title: '', priority_1_why: '', priority_1_bucket: '', priority_1_milestone: '', priority_1_date: '', priority_1_status: 'active',
  priority_2_title: '', priority_2_why: '', priority_2_bucket: '', priority_2_milestone: '', priority_2_date: '', priority_2_status: 'active',
  priority_3_title: '', priority_3_why: '', priority_3_bucket: '', priority_3_milestone: '', priority_3_date: '', priority_3_status: 'active',
  intentional_nos: '', notes: '', status: 'active', completion_reflection: '',
}

export default function QuarterlySection() {
  const currentQ = getCurrentQuarter()
  const currentYear = getCurrentYear()
  const [q, setQ] = useState(currentQ)
  const [year] = useState(currentYear)
  const [data, setData] = useState({ ...EMPTY, year, quarter: q })
  const [saveStatus, setSaveStatus] = useState(null)

  const loadQuarter = useCallback(async (quarter) => {
    const { data: row } = await supabase.from('quarterly_plans').select('*').eq('year', year).eq('quarter', quarter).single()
    if (row) setData(row)
    else setData({ ...EMPTY, year, quarter })
  }, [year])

  useEffect(() => { loadQuarter(q) }, [q, loadQuarter])

  const save = useCallback(async (updated) => {
    setSaveStatus('saving')
    const { data: existing } = await supabase.from('quarterly_plans').select('id').eq('year', year).eq('quarter', q).single()
    if (existing) {
      await supabase.from('quarterly_plans').update({ ...updated, updated_at: new Date().toISOString() }).eq('year', year).eq('quarter', q)
    } else {
      await supabase.from('quarterly_plans').insert({ ...updated, year, quarter: q })
    }
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }, [year, q])

  const update = (key, val) => {
    const updated = { ...data, [key]: val }
    setData(updated)
    save(updated)
  }

  const range = quarterDateRange(q, year)

  const priorities = [1, 2, 3]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <SectionHeader eyebrow="Section 4" title="Quarterly priorities" subtitle="Three priorities. No more." />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SaveStatus status={saveStatus} />
          <StatusBadge status={data.status} />
        </div>
      </div>

      {/* Quarter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.5rem' }}>
        {[1,2,3,4].map(n => (
          <button
            key={n}
            onClick={() => setQ(n)}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              background: q === n ? 'var(--ink)' : 'var(--white)',
              color: q === n ? 'var(--white)' : 'var(--ink-muted)',
              border: `1px solid ${q === n ? 'var(--ink)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: q === n ? 500 : 400,
              transition: 'all 0.15s',
            }}
          >
            {n === currentQ ? `Q${n} ·` : `Q${n}`} {n === currentQ ? <span style={{ fontSize: '11px' }}>current</span> : ''}
            Q{n}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '1.25rem' }}>
        {getQuarterLabel(q, year)} · through {range.end}
      </div>

      {/* Three Priorities */}
      <div style={{ display: 'grid', gap: '12px', marginBottom: '1.25rem' }}>
        {priorities.map(n => {
          const pre = `priority_${n}_`
          const bucket = data[`${pre}bucket`]
          const bc = BUCKET_COLORS[bucket] || {}
          const pStatus = data[`${pre}status`]
          return (
            <Card key={n} style={{ borderLeft: bc.color ? `3px solid ${bc.color}` : '3px solid var(--border)', borderRadius: '0 var(--radius) var(--radius) 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500, color: 'var(--ink-muted)', flexShrink: 0 }}>{n}</div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>Priority {n}</span>
                  {bucket && <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', background: bc.bg, color: bc.color }}>{bucket}</span>}
                </div>
                <select
                  value={pStatus}
                  onChange={e => update(`${pre}status`, e.target.value)}
                  style={{ width: 'auto', fontSize: '12px', padding: '4px 28px 4px 10px' }}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <Field label="Priority">
                <TextInput value={data[`${pre}title`]} onChange={val => update(`${pre}title`, val)} placeholder="What is this priority?" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Why it matters">
                  <TextArea value={data[`${pre}why`]} onChange={val => update(`${pre}why`, val)} rows={2} placeholder="…" />
                </Field>
                <Field label="Supports">
                  <SelectField value={data[`${pre}bucket`]} onChange={val => update(`${pre}bucket`, val)} options={BUCKETS} />
                </Field>
                <Field label="Key milestone">
                  <TextArea value={data[`${pre}milestone`]} onChange={val => update(`${pre}milestone`, val)} rows={2} placeholder="…" />
                </Field>
                <Field label="Target date">
                  <TextInput value={data[`${pre}date`]} onChange={val => update(`${pre}date`, val)} placeholder={`e.g. ${range.end}`} />
                </Field>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Intentional No's */}
      <Card style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
        <Field label="🚫 Intentional no's this quarter" hint="What opportunities are you deliberately saying no to?">
          <TextArea value={data.intentional_nos} onChange={val => update('intentional_nos', val)} rows={2} placeholder="What are you protecting your focus from?" />
        </Field>
        <Field label="Quarter notes">
          <TextArea value={data.notes} onChange={val => update('notes', val)} rows={2} placeholder="Themes, context, decisions…" />
        </Field>
      </Card>

      {/* Quarter Close */}
      {data.status === 'active' && (
        <>
          <Divider />
          <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Close this quarter</p>
            <Field label="Final reflection">
              <TextArea value={data.completion_reflection} onChange={val => update('completion_reflection', val)} rows={2} placeholder="How did the quarter go? What changed?" />
            </Field>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" onClick={() => update('status', 'complete')}>Mark quarter complete ✓</button>
              <button className="btn-ghost" onClick={() => update('status', 'incomplete')}>Mark incomplete</button>
            </div>
          </div>
        </>
      )}

      {data.status !== 'active' && (
        <>
          <Divider />
          <div style={{ background: data.status === 'complete' ? 'var(--teal-light)' : 'var(--amber-light)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: data.status === 'complete' ? 'var(--teal)' : 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Quarter marked {data.status}
            </p>
            {data.completion_reflection && <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>{data.completion_reflection}</p>}
            <button className="btn-ghost" style={{ marginTop: '10px', fontSize: '12px' }} onClick={() => update('status', 'active')}>Reopen</button>
          </div>
        </>
      )}
    </div>
  )
}
