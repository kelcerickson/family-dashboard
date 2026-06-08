import React, { useState, useEffect, useCallback } from 'react'
import { supabase, dbQuery } from '../lib/supabase'
import { Field, TextArea, Card, SectionHeader, Divider, StatusBadge, SaveStatus } from './ui'
import { getCurrentYear } from '../lib/dates'

const SEASONS = ['Dream property', 'Spec home', 'Entrepreneurship', 'Career transition', 'Family investment', 'Custom…']

const EMPTY = { season: '', primary_objective: '', objective_reason: '', success_criteria: '', notes: '', status: 'active', completion_reflection: '' }

export default function AnnualSection() {
  const year = getCurrentYear()
  const [data, setData] = useState({ ...EMPTY, year })
  const [saveStatus, setSaveStatus] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    dbQuery(
      () => supabase.from('annual_plans').select('*').eq('year', year).maybeSingle(),
      'annual load'
    ).then(({ data: row }) => {
      if (row) setData(row)
    })
  }, [year])

  const save = useCallback(async (updated) => {
    setSaveStatus('saving')
    setSaveError(null)
    const { error } = await dbQuery(
      () => supabase.from('annual_plans').upsert(
        { ...updated, year, updated_at: new Date().toISOString() },
        { onConflict: 'year' }
      ),
      'annual save'
    )
    if (error) {
      setSaveError(error.message)
      setSaveStatus(null)
    } else {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 2000)
    }
  }, [year])

  const update = (key, val) => {
    const updated = { ...data, [key]: val }
    setData(updated)
    save(updated)
  }

  const isCustomSeason = data.season && !SEASONS.slice(0, -1).includes(data.season)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <SectionHeader eyebrow="Section 3" title={`Annual plan · ${year}`} subtitle="One objective. One year. Be specific." />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SaveStatus status={saveStatus} />
          {saveError && <span style={{ fontSize: '12px', color: '#E24B4A' }}>Error: {saveError}</span>}
          <StatusBadge status={data.status} />
        </div>
      </div>

      <Card>
        <Field label="What season are we in?">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
            {SEASONS.map(s => {
              const active = s === 'Custom…' ? isCustomSeason : data.season === s
              return (
                <button key={s} onClick={() => {
                  if (s === 'Custom…') { setShowCustom(true); update('season', '') }
                  else { setShowCustom(false); update('season', s) }
                }} style={{ background: active ? 'var(--ink)' : 'var(--cream)', color: active ? 'var(--white)' : 'var(--ink-muted)', border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '8px 10px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {s}
                </button>
              )
            })}
          </div>
          {(showCustom || isCustomSeason) && (
            <input type="text" placeholder="Describe your season…" value={isCustomSeason ? data.season : ''} onChange={e => update('season', e.target.value)} />
          )}
        </Field>

        <Divider />

        <Field label="Our ONE primary objective this year" hint="One only. The thing that, if achieved, makes this year a success.">
          <TextArea value={data.primary_objective} onChange={val => update('primary_objective', val)} rows={2} placeholder="Be specific and concrete…" />
        </Field>

        <Field label="Why is this the most important objective?">
          <TextArea value={data.objective_reason} onChange={val => update('objective_reason', val)} rows={2} placeholder="The reason this rises above everything else…" />
        </Field>

        <Field label={`What must be true by December 31, ${year} for this year to be a success?`}>
          <TextArea value={data.success_criteria} onChange={val => update('success_criteria', val)} rows={3} placeholder="Define success clearly so you'll know it when you see it…" />
        </Field>

        <Field label="Annual notes & reflections">
          <TextArea value={data.notes} onChange={val => update('notes', val)} rows={3} placeholder="Themes, decisions, lessons, gratitude…" />
        </Field>

        {data.status === 'active' && (
          <>
            <Divider />
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Close this year</p>
              <Field label="Final reflection">
                <TextArea value={data.completion_reflection} onChange={val => update('completion_reflection', val)} rows={2} placeholder="How did the year go? What did you learn?" />
              </Field>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" onClick={() => update('status', 'complete')}>Mark complete ✓</button>
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
                Year marked {data.status}
              </p>
              {data.completion_reflection && <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>{data.completion_reflection}</p>}
              <button className="btn-ghost" style={{ marginTop: '10px', fontSize: '12px' }} onClick={() => update('status', 'active')}>Reopen</button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
