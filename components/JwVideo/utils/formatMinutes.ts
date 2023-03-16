export default function formatMinutes(duration: string): string | null {
  const sec = Number.parseFloat(duration)
  if (Number.isNaN(sec) || !Number.isFinite(sec)) {
    return null
  }

  const s = sec % 60
  const m = (sec - s) / 60
  const separator = s > 9 ? ':' : ':0'

  return m + separator + Math.round(s)
}
