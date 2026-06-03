export function getMondayOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatWeekStart(date) {
  // Returns YYYY-MM-DD string for storage
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function getWeekLabel(weekStart) {
  const mon = new Date(weekStart + 'T00:00:00')
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const opts = { month: 'short', day: 'numeric' }
  return `${mon.toLocaleDateString('en-US', opts)} – ${sun.toLocaleDateString('en-US', opts)}, ${sun.getFullYear()}`
}

export function getCurrentQuarter() {
  const now = new Date()
  return Math.ceil((now.getMonth() + 1) / 3)
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function getQuarterLabel(q, year) {
  return `Q${q} · ${year}`
}

export function getPrevWeekStart(weekStart) {
  const d = new Date(weekStart + 'T00:00:00')
  d.setDate(d.getDate() - 7)
  return formatWeekStart(d)
}

export function quarterDateRange(q, year) {
  const starts = [null, '01-01', '04-01', '07-01', '10-01']
  const ends = [null, 'Mar 31', 'Jun 30', 'Sep 30', 'Dec 31']
  return { start: `${year}-${starts[q]}`, end: ends[q] }
}
