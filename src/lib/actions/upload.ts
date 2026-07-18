'use server'

import { createClient } from '../supabase-server'

export async function uploadBuktiBayar(bookingId: string, formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file) return { success: false, error: 'Tidak ada file' }

  const supabase = await createClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${bookingId}-${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('bukti-bayar')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    return { success: false, error: 'Gagal upload bukti bayar' }
  }

  const path = uploadData.path;

  const { error: updateError } = await supabase
    .from('booking')
    .update({ bukti_pembayaran_url: path })
    .eq('id', bookingId)

  if (updateError) {
    return { success: false, error: 'Gagal menyimpan URL bukti' }
  }

  return { success: true }
}
