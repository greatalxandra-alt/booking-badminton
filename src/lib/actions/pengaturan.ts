'use server'

import { createClient } from '../supabase-server'

export async function getSemuaPengaturan(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pengaturan')
    .select('*')

  if (error || !data) return {}

  const result: Record<string, string> = {}
  data.forEach(item => {
    result[item.key] = item.value
  })

  return result
}

export async function updatePengaturan(data: Record<string, string>) {
  const supabase = await createClient()
  
  // Convert object into array of { key, value } for bulk upsert
  const payload = Object.entries(data).map(([key, value]) => ({ key, value }))

  const { error } = await supabase
    .from('pengaturan')
    .upsert(payload)

  if (error) {
    console.error("Detail Error Pengaturan:", error)
    return { success: false, error: error.message }
  }
  return { success: true }
}
