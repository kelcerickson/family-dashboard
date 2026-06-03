import React from 'react'

export function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--ink-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      {hint && <p style={{ fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '6px', fontStyle: 'italic' }}>{hint}</p>}
      {children}
    </div>
  )
}

export function TextArea({ value, onChange, placeholder, rows = 2, onBlur }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

export function TextInput({ value, onChange, placeholder, onBlur }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  )
}

export function SelectField({ value, onChange, options, onBlur }) {
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} onBlur={onBlur}>
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem 1.5rem',
      boxShadow: 'var(--shadow)',
      ...style
    }}>
      {children}
    </div>
  )
}

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {eyebrow && <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '6px' }}>{eyebrow}</p>}
      {title && <h2 style={{ fontSize: '22px', color: 'var(--ink)' }}>{title}</h2>}
      {subtitle && <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px' }}>{subtitle}</p>}
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', bg: 'var(--blue-light)', color: 'var(--blue)' },
    complete: { label: 'Complete ✓', bg: 'var(--teal-light)', color: 'var(--teal)' },
    incomplete: { label: 'Incomplete', bg: 'var(--amber-light)', color: 'var(--amber)' },
  }
  const s = map[status] || map.active
  return (
    <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', background: s.bg, color: s.color, letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  )
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />
}

export function SaveStatus({ status }) {
  if (!status) return null
  return (
    <span className={`save-indicator ${status}`}>
      {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : ''}
    </span>
  )
}
