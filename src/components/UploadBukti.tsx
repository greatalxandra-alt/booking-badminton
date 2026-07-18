"use client";

import { useState, useRef } from "react";
import { uploadBuktiBayar } from "@/lib/actions/upload";
import { Upload, Loader2, CheckCircle, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadBukti({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Basic validation
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("File harus berupa gambar (JPG/PNG)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bookingId", bookingId);

    try {
      const result = await uploadBuktiBayar(bookingId, formData);
      if (result.success) {
        setSuccess(true);
        setIsUploadSuccessOpen(true);
        toast.success("Bukti transfer berhasil diunggah!");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal mengunggah bukti transfer");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        {isUploadSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsUploadSuccessOpen(false)}
            />
            <div className="bg-surface-dark rounded-2xl p-6 md:p-8 max-w-md w-full relative z-10 border border-white/10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">
                  Bukti Pembayaran Berhasil Diunggah!
                </h3>
                <p className="text-text-secondary font-body text-sm mb-6 leading-relaxed">
                  Terima kasih, tim kami akan segera memverifikasi pembayaran Anda. Anda dapat mengecek status pesanan secara berkala.
                </p>
                <button
                  onClick={() => setIsUploadSuccessOpen(false)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold font-body hover:bg-primary-hover active:bg-primary-active transition-all"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-success/10 border border-success/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold font-display text-white mb-2">
            Bukti Terunggah!
          </h3>
          <p className="text-text-secondary font-body text-sm mb-6">
            Terima kasih. Kami akan segera memverifikasi pembayaran Anda. Status
            booking akan diperbarui setelah verifikasi selesai.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/"
              className="flex-1 bg-surface-darker text-text-secondary border border-white/10 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl text-sm font-bold font-body transition-all text-center"
            >
              Kembali ke Dashboard
            </Link>
            <Link
              href={`/cek-booking?id=${bookingId}`}
              className="flex-1 bg-primary text-white hover:bg-primary-hover active:bg-primary-active py-3 px-4 rounded-xl text-sm font-bold font-body transition-all text-center shadow-[0px_4px_12px_rgba(249,115,22,0.3)]"
            >
              Langsung Cek Status Booking
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <h3 className="text-xl font-bold font-display text-white mb-2">
        Upload Bukti Transfer
      </h3>
      <p className="text-sm font-body text-text-secondary mb-6">
        Format yang didukung: JPG, PNG. Maksimal ukuran file 5MB.
      </p>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all mb-6 min-h-[200px]
          ${
            previewUrl
              ? "border-white/10 bg-surface-darker overflow-hidden"
              : "border-white/20 hover:border-primary hover:bg-surface-darker bg-surface-dark"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain bg-black"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-bold font-body bg-black/70 px-4 py-2 rounded-lg">
                Ganti Foto
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-surface-darker rounded-full flex items-center justify-center mb-4 border border-white/10 text-primary">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-base font-bold font-body text-white mb-1">
              Klik untuk memilih file gambar
            </p>
            <p className="text-xs font-body text-text-secondary">
              Atau drag and drop file Anda ke area ini
            </p>
          </>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold font-body transition-all h-[48px]
          ${
            !file || loading
              ? "bg-disabled text-white/50 cursor-not-allowed opacity-50"
              : "bg-primary text-white hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active"
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Mengunggah...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Upload Sekarang
          </>
        )}
      </button>
    </div>
  );
}
