"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { tambahGaleri, hapusGaleri } from "@/lib/actions/galeri";

export default function GaleriClient({ initialData }: { initialData: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      toast.error("Silakan pilih gambar terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    try {
      const result = await tambahGaleri(formData);
      if (result.success) {
        toast.success("Gambar berhasil diunggah!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Gagal mengunggah gambar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengunggah");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string, fotoUrl: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;

    setDeletingId(id);
    try {
      const result = await hapusGaleri(id, fotoUrl);
      if (result.success) {
        toast.success("Gambar berhasil dihapus!");
      } else {
        toast.error(result.error || "Gagal menghapus gambar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-white mb-2">
          Kelola Galeri
        </h1>
        <p className="text-sm font-body text-text-secondary">
          Upload dan kelola foto galeri yang akan ditampilkan di halaman utama.
        </p>
      </div>

      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Upload Foto Baru
        </h2>
        <form onSubmit={handleUpload} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              File Gambar
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer transition-all border border-white/10 rounded-xl p-2 bg-surface-darker focus:outline-none focus:border-primary/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Caption (Opsional)
            </label>
            <input
              type="text"
              name="caption"
              placeholder="Masukkan caption gambar..."
              className="w-full bg-surface-darker border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-text-tertiary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover active:bg-primary-active text-white px-4 py-2.5 rounded-xl text-sm font-bold font-body transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload Foto</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Daftar Foto Galeri
        </h2>

        {initialData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialData.map((foto) => (
              <div
                key={foto.id}
                className="group relative bg-surface-darker border border-white/10 rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={foto.foto_url}
                  alt={foto.caption || "Galeri"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(foto.id, foto.foto_url)}
                      disabled={deletingId === foto.id}
                      className="p-2 bg-error/90 hover:bg-error text-white rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === foto.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {foto.caption && (
                    <div className="text-white text-xs font-body font-medium truncate bg-black/40 p-1.5 rounded-lg backdrop-blur-sm">
                      {foto.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-darker rounded-xl border border-white/5">
            <ImageIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary text-sm font-body">
              Belum ada foto yang diunggah
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
