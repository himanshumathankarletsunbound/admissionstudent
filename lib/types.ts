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
  scholarship_amount: number | null
  admission_screenshot_url: string | null
  admission_year: number
  created_at: string
}

export type AllowedAdmin = { email: string; created_at: string }

export type University = {
  id: string
  source_name: string
  name: string
  country: string
  logo_url: string | null
  created_at: string
  updated_at: string
}
