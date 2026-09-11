export function getCountdown(target, now = new Date()) {
  const totalMs = Math.max(0, target.getTime() - now.getTime())
  const complete = totalMs === 0
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds, complete }
}

export function padCountdownValue(value) {
  return String(value).padStart(2, '0')
}
