"use server";

import { createClient } from "../supabase-server";
import { Booking } from "@/types";
import { z } from "zod";

const bookingSchema = z.object({
  lapangan_id: z.string().uuid(),
  tanggal_main: z.string(),
  jam_mulai: z.string(),
  jam_selesai: z.string(),
  nama_pemesan: z.string().min(1, "Nama wajib diisi"),
  no_hp: z.string().min(9, "Nomor HP tidak valid"),
  catatan: z.string().max(200).optional(),
  bukti_pembayaran_url: z.string().optional(),
});

export async function createBooking(formData: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid",
      detail: parsed.error.format(),
    };
  }

  const supabase = await createClient();

  // Proteksi Waktu Nyata (Real-time auto-expired protection)
  // Jangan izinkan pembuatan booking untuk slot yang sudah lewat jika harinya adalah hari ini
  const now = new Date();
  const localDateStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const currentHour = now.getHours();
  const startHour = parseInt(parsed.data.jam_mulai.split(":")[0]);
  
  if (parsed.data.tanggal_main === localDateStr && startHour <= currentHour) {
    return {
      success: false,
      error: "Slot waktu ini sudah kedaluwarsa atau sedang berlangsung.",
    };
  }

  // Verify availability again before insert to prevent race conditions
  const newStart = `${parsed.data.jam_mulai}:00`;
  const newEnd = `${parsed.data.jam_selesai}:00`;

  const { data: existingBooking, error: checkError } = await supabase
    .from("booking")
    .select("id")
    .eq("lapangan_id", parsed.data.lapangan_id)
    .eq("tanggal_main", parsed.data.tanggal_main)
    .lt("jam_mulai", newEnd)
    .gt("jam_selesai", newStart)
    .neq("status", "batal")
    .limit(1);

  if (existingBooking && existingBooking.length > 0) {
    return {
      success: false,
      error: "Maaf, slot ini baru saja dibooking oleh orang lain.",
    };
  }

  const { data, error } = await supabase
    .from("booking")
    .insert([
      {
        ...parsed.data,
        jam_mulai: `${parsed.data.jam_mulai}:00`,
        jam_selesai: `${parsed.data.jam_selesai}:00`,
        status: "pending",
        bukti_pembayaran_url: parsed.data.bukti_pembayaran_url,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error insert booking:", error);
    return { success: false, error: "Gagal membuat booking" };
  }

  // Kembalikan short ID (8 karakter pertama UUID) untuk ditampilkan ke user
  const shortId = data.id.substring(0, 8);
  return { success: true, bookingId: shortId };
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking")
    .select(
      `
      *,
      lapangan:lapangan_id (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Booking;
}

export async function checkBookingStatus(query: string): Promise<Booking[]> {
  const supabase = await createClient();

  const cleanQuery = query.trim().toLowerCase();

  // Jika input kosong, langsung kembalikan array kosong
  if (!cleanQuery) return [];

  // Cek apakah input adalah ID pendek (8 karakter hexadecimal)
  const isShortId = /^[0-9a-f]{8}$/i.test(cleanQuery);

  if (isShortId) {
    // Jika user mencari dengan ID pendek, kita ambil data booking terbaru
    // lalu kita filter secara akurat di sisi server Next.js
    const { data, error } = await supabase
      .from("booking")
      .select(
        `
        *,
        lapangan:lapangan_id (*)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(100); // Ambil 100 booking terbaru untuk dicocokkan

    if (error) {
      console.error("Error checkBookingStatus (shortId):", error);
      return [];
    }

    // Filter data yang id aslinya berawalan sesuai dengan cleanQuery pendek tadi
    const filteredData = data.filter((b) =>
      b.id.toLowerCase().startsWith(cleanQuery),
    );
    return filteredData as Booking[];
  } else {
    // Jika bukan ID pendek, asumsikan mencari berdasarkan Nomor HP
    const { data, error } = await supabase
      .from("booking")
      .select(
        `
        *,
        lapangan:lapangan_id (*)
      `,
      )
      .eq("no_hp", cleanQuery)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error checkBookingStatus (no_hp):", error);
      return [];
    }
    return data as Booking[];
  }
}

export async function getAdminBookings(): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("booking")
    .select(
      `
      *,
      lapangan:lapangan_id (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Booking[];
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("booking")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getDashboardStats() {
  const supabase = await createClient();

  // Today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Get today's bookings
  const { count: countToday } = await supabase
    .from("booking")
    .select("*", { count: "exact", head: true })
    .eq("tanggal_main", today);

  // Get pending bookings
  const { count: countPending } = await supabase
    .from("booking")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get lunas bookings
  const { count: countLunas } = await supabase
    .from("booking")
    .select("*", { count: "exact", head: true })
    .eq("status", "lunas");

  return {
    today: countToday || 0,
    pending: countPending || 0,
    lunas: countLunas || 0,
  };
}
