/** Turns "Aarav Kumar Sharma" into "A*** K**** S*****" to protect student privacy. */
export function maskName(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0].toUpperCase() + '*'.repeat(Math.max(part.length - 1, 3))).join(' ')
}
