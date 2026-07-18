"use server";

import { createClient } from "../supabase-server";
import { Lapangan } from "@/types";

export async function getLapanganAktif(): Promise<Lapangan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lapangan")
    .select("*")
    .eq("status_aktif", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getLapanganAktif:", error);
    return [];
  }

  return data as Lapangan[];
}

export async function getLapanganById(id: string): Promise<Lapangan | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lapangan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Lapangan;
}

export async function getAllLapangan(): Promise<Lapangan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lapangan")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Lapangan[];
}

export async function createLapangan(formData: FormData) {
  try {
    const supabase = await createClient();

    // Tarik nilai mentahnya dulu untuk dicek
    const hargaValue = formData.get("harga_per_jam");
    const statusAktifValue = formData.get("status_aktif");

    const payload = {
      nama: formData.get("nama") as string,
      deskripsi: formData.get("deskripsi") as string,
      // Tambahkan "|| 0" untuk mencegah hasil NaN (Not a Number)
      harga_per_jam: parseInt(hargaValue as string) || 0,
      jam_buka: formData.get("jam_buka") as string,
      jam_tutup: formData.get("jam_tutup") as string,
      // Handle checkbox standar HTML yang biasanya mengirim nilai "on" atau "true"
      status_aktif: statusAktifValue === "true" || statusAktifValue === "on",
      foto_url: (formData.get("foto_url") as string) || null,
    };

    // Ini akan memunculkan data di terminal VS Code kamu,
    // jadi kita tahu apakah datanya sudah benar sebelum masuk database
    console.log("📝 Payload yang akan dikirim:", payload);

    const { data, error } = await supabase
      .from("lapangan")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    // Tangkap error internal Next.js/Server biar tidak crash ("unexpected response")
    console.error("🔥 System Error di Server Action:", error);
    return {
      success: false,
      error: error?.message || "Gagal menghubungi server",
    };
  }
}

export async function updateLapangan(id: string, updateData: any) {
  const supabase = await createClient();

  if (!updateData || Object.keys(updateData).length === 0) {
    return { success: false, error: "Data update tidak boleh kosong" };
  }

  const { data, error } = await supabase
    .from("lapangan")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) return { success: false, error: "Tidak ada data yang diperbarui" };
  
  return { success: true, data: data[0] };
}

export async function toggleStatusLapangan(id: string, status_aktif: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("lapangan")
    .update({ status_aktif })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
