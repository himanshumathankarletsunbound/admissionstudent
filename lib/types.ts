export type Admission = {
  id: string
  student_name: string
  country: string
  university: string
  program: string | null
  admission_year: number
  created_at: string
}

export type AllowedAdmin = { email: string; created_at: string }
