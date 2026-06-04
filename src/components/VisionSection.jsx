import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Field, TextArea, TextInput, Card, SectionHeader, Divider, SaveStatus } from './ui'

const DEFAULT_VISION = {
  family_vision: 'We live on our dream property, spending significant time together as a family. Our children are involved in meaningful real-world projects. We homeschool with an emphasis on practical life skills — entrepreneurship, investing, work ethic, faith, and stewardship. Ideally, each child owns a home by the time they marry because of what we taught them.',
  faith_vision: 'Faith remains central to every decision. We put our plans before God and ask for His support. Church service and discipleship are sustained priorities.',
  financial_vision: '$300k–$500k+ annual income. Net worth increased by $1M+ over five years. Multiple income streams. Reduced employer dependence. Long-term financial freedom.',
  real_estate_vision: 'Build and sell spec homes. Develop our dream property. Own assets that can be passed down. Teach our children real estate skills from a young age.',
  entrepreneurship_vision: 'PickleIntel is our current focus. Entrepreneurship provides ownership, creativity, flexibility, and models courage for our children. It is our freedom engine.',
  target_year: 2031,
  income_goal: '$300k–$500k+',
  net_worth_goal: '+$1,000,000',
  milestone_property: 'Identify and acquire the property\nBegin development plan\nBuild or relocate to the land\nCreate a family homestead',
  milestone_real_estate: 'Complete first spec home\nReinvest profits into next project\nBegin development pipeline\nBuild generational assets',
  milestone_entrepreneurship: 'Scale PickleIntel to revenue\nValidate product-market fit\nExplore additional ventures\nCreate income independence',
  milestone_family: 'Consistent family projects\nChildren involved in real work\nHomeschool established\nRegular family experiences',
}

export default function VisionSection() {
  const [data, setData] = useState(DEFAULT_VISION)
  const [saveStatus, setSaveStatus] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    supabase.from('vision').select('*').eq('id', 1).single().then(({ data: row }) => {
      if (row) setData({ ...DEFAULT_VISION, ...row })
    })
  }, [])

  const save = useCallback(async (updated) => {
    setSaveStatus('saving')
    await supabase.from('vision').upsert({ id: 1, ...updated, updated_at: new Date().toISOString() })
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }, [])

  const update = (key, val) => {
    const updated = { ...data, [key]: val }
    setData(updated)
    save(updated)
  }

  const buckets = [
    { color: 'var(--teal-mid)', bg: 'var(--teal-light)', label: 'Family & Faith', role: 'The mission', items: 'Marriage · Kids · Homeschool · Church · Health · Experiences' },
    { color: 'var(--blue-mid)', bg: 'var(--blue-light)', label: 'Income engine', role: 'Funds today', items: 'Employment · Sales leadership · Current role' },
    { color: 'var(--amber-mid)', bg: 'var(--amber-light)', label: 'Wealth engine', role: 'Builds freedom', items: 'Spec homes · Development · Dream property' },
    { color: 'var(--purple-mid)', bg: 'var(--purple-light)', label: 'Ownership engine', role: 'Creates optionality', items: 'PickleIntel · Future ventures · Entrepreneurship' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <SectionHeader eyebrow="The framework" title="Our Family Operating System" subtitle="Kelsey & Brienne · Built to last" />
        <SaveStatus status={saveStatus} />
      </div>

      {/* Four Buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '2rem' }}>
        {buckets.map(b => (
          <div key={b.label} style={{ background: b.bg, border: `1px solid ${b.color}22`, borderRadius: 'var(--radius)', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: b.color, marginBottom: '2px' }}>{b.label}</div>
            <div style={{ fontSize: '11px', color: b.color, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>{b.role}</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{b.items}</div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Vision Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--ink)' }}>Our five-year vision</h3>
        <button className="btn-ghost" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => setEditing(!editing)}>
          {editing ? 'Done editing' : 'Edit vision'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {[
          { key: 'family_vision', label: 'Family' },
          { key: 'faith_vision', label: 'Faith' },
          { key: 'financial_vision', label: 'Financial' },
          { key: 'real_estate_vision', label: 'Real estate' },
          { key: 'entrepreneurship_vision', label: 'Entrepreneurship' },
        ].map(({ key, label }) => (
          <Card key={key} style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '6px' }}>{label}</div>
            {editing ? (
              <TextArea value={data[key]} onChange={val => update(key, val)} rows={3} />
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.7 }}>{data[key]}</p>
            )}
          </Card>
        ))}
      </div>

      <Divider />

      {/* Five-Year Plan */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--ink)' }}>Five-year roadmap</h3>
        <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>2026 → {data.target_year}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
        {[
          { label: 'Target year', key: 'target_year', type: 'text' },
          { label: 'Income goal', key: 'income_goal', type: 'text' },
          { label: 'Net worth goal', key: 'net_worth_goal', type: 'text' },
        ].map(f => (
          <div key={f.key} style={{ background: 'var(--cream-dark)', borderRadius: 'var(--radius-sm)', padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '4px' }}>{f.label}</div>
            {editing
              ? <TextInput value={String(data[f.key] || '')} onChange={val => update(f.key, val)} />
              : <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{data[f.key]}</div>
            }
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {[
          { key: 'milestone_property', label: 'Dream property' },
          { key: 'milestone_real_estate', label: 'Real estate' },
          { key: 'milestone_entrepreneurship', label: 'Entrepreneurship' },
          { key: 'milestone_family', label: 'Family culture' },
        ].map(({ key, label }) => (
          <Card key={key} style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '8px' }}>{label}</div>
            {editing ? (
              <TextArea value={data[key]} onChange={val => update(key, val)} rows={4} placeholder="One milestone per line…" />
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {(data[key] || '').split('\n').filter(Boolean).map((item, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.7, paddingLeft: '14px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--ink-faint)' }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
