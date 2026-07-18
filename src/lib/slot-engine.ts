import { createClient } from "@supabase/supabase-js";
import { SlotKosong } from "@/types";

// Membuat koneksi Supabase publik yang aman untuk Browser/Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabasePublic = createClient(supabaseUrl, supabaseKey);

export async function getSlotKosong(
  lapanganId: string,
  tanggal: string,
): Promise<SlotKosong[]> {
  // 1. Get Lapangan Jam Buka & Tutup menggunakan client publik
  const { data: lapangan, error: lapErr } = await supabasePublic
    .from("lapangan")
    .select("jam_buka, jam_tutup")
    .eq("id", lapanganId)
    .single();

  if (lapErr || !lapangan) throw new Error("Lapangan tidak ditemukan");

  // 2. Get active bookings for that date
  const { data: bookings, error: bookErr } = await supabasePublic
    .from("booking")
    .select("jam_mulai, jam_selesai")
    .eq("lapangan_id", lapanganId)
    .eq("tanggal_main", tanggal)
    .neq("status", "batal");

  if (bookErr) throw new Error("Gagal mengambil data booking");

  // 3. Generate slots
  const startHour = parseInt(lapangan.jam_buka.split(":")[0], 10);
  const endHour = parseInt(lapangan.jam_tutup.split(":")[0], 10);

  const slots: SlotKosong[] = [];
  
  // Deteksi waktu saat ini untuk memblokir slot yang sudah lewat (Auto-Expired)
  const now = new Date();
  
  // Gunakan method lokal Date untuk mendapatkan YYYY-MM-DD agar presisi sesuai timezone user (WIB/WITA)
  const localYear = now.getFullYear();
  const localMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const localDay = now.getDate().toString().padStart(2, '0');
  const localDateStr = `${localYear}-${localMonth}-${localDay}`;
  const isToday = tanggal === localDateStr;

  // Format jam saat ini menjadi HH:MM untuk perbandingan presisi
  const currentHourStr = now.getHours().toString().padStart(2, '0');
  const currentMinuteStr = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHourStr}:${currentMinuteStr}`;

  for (let h = startHour; h < endHour; h++) {
    const jamFormat = `${h.toString().padStart(2, "0")}:00`;
    const jamFormatSql = `${jamFormat}:00`;

    // Jika hari ini, dan waktu sekarang sudah mencapai atau lewat dari jam slot, blokir slot tersebut
    if (isToday && currentTimeStr >= jamFormat) {
      slots.push({
        jam: jamFormat,
        tersedia: false, // Expired / Past time
      });
      continue;
    }

    let isBooked = false;
    if (bookings) {
      for (const b of bookings) {
        if (b.jam_mulai <= jamFormatSql && b.jam_selesai > jamFormatSql) {
          isBooked = true;
          break;
        }
      }
    }

    slots.push({
      jam: jamFormat,
      tersedia: !isBooked,
    });
  }

  return slots;
}
