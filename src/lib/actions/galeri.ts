"use server";

import { createClient } from "../supabase-server";
import { revalidatePath } from "next/cache";

export async function getSemuaGaleri() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch (error) {
    return [];
  }
}

export async function tambahGaleri(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string | null;
    if (!file || file.size === 0)
      return { success: false, error: "File gambar tidak ditemukan." };

    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("galeri")
      .upload(fileName, file);
    if (uploadError)
      return { success: false, error: "Gagal mengunggah gambar." };

    const {
      data: { publicUrl },
    } = supabase.storage.from("galeri").getPublicUrl(fileName);
    const { error: dbError } = await supabase
      .from("galeri")
      .insert({ foto_url: publicUrl, caption: caption || null });

    if (dbError) return { success: false, error: "Gagal menyimpan data." };

    revalidatePath("/admin/galeri");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Terjadi kesalahan internal.",
    };
  }
}

export async function hapusGaleri(id: string, fotoUrl: string) {
  try {
    const supabase = await createClient();
    const urlParts = fotoUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    if (fileName) await supabase.storage.from("galeri").remove([fileName]);

    const { error: dbError } = await supabase
      .from("galeri")
      .delete()
      .eq("id", id);
    if (dbError) return { success: false, error: "Gagal menghapus data." };

    revalidatePath("/admin/galeri");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Terjadi kesalahan internal.",
    };
  }
}
