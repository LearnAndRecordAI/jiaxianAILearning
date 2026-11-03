export function sign(state, day) {
  if (!state.days.includes(day)) state.days.push(day)
}
export function monthCount(days, month) {
  return new Set(days.filter(d => d.startsWith(month + '-'))).size
}
export function streak(days, today) {
  const set = new Set(days)
  const date = new Date(today + 'T00:00:00Z')
  if (!set.has(today)) date.setUTCDate(date.getUTCDate() - 1)
  let count = 0
  while (set.has(date.toISOString().slice(0,10))) {
    count++
    date.setUTCDate(date.getUTCDate() - 1)
  }
  return count
}
export function claim(state, month, tier) {
  const key = month + ':' + tier
  if (![12,21].includes(tier) || monthCount(state.days, month) < tier || state.claims.includes(key)) return false
  state.claims.push(key)
  return true
}
