export type UniversityOption = { name: string; location: string }

/** Parses the two-column University List CSV, including quoted names and locations. */
export function parseUniversityCsv(csv: string): UniversityOption[] {
  const rows: string[][] = []
  let field = '', row: string[] = [], quoted = false
  for (let index = 0; index < csv.length; index++) {
    const character = csv[index]
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') { field += '"'; index++ } else quoted = !quoted
    } else if (character === ',' && !quoted) { row.push(field.trim()); field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && csv[index + 1] === '\n') index++
      row.push(field.trim()); if (row.length >= 2 && row[0]) rows.push(row); field = ''; row = []
    } else field += character
  }
  row.push(field.trim()); if (row.length >= 2 && row[0]) rows.push(row)
  return rows.slice(1).map(([name, location]) => ({ name, location }))
}
