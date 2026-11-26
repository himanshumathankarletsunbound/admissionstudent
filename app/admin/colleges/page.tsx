import { CollegeList } from '@/components/college-list'
import { createClient } from '@/lib/supabase/server'
import type { University } from '@/lib/types'

export default async function CollegesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('universities').select('*').order('name')
  return <CollegeList initialUniversities={(data || []) as University[]} />
}
