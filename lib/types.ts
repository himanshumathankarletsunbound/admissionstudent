export type Admission = {
  id: string
  student_name: string
  country: string
  university_location: string
  university: string
  university_logo_url: string | null
  program: string | null
  has_scholarship: boolean
  scholarship_name: string | null
  admission_year: number
  created_at: string
}

export type AllowedAdmin = { email: string; created_at: string }
