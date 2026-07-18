import { useState, useRef } from 'react';
import { createBooking } from '@/lib/actions/booking';
import { uploadBuktiFile } from '@/lib/actions/upload';
import { Loader2, Upload, CheckCircle, Image as ImageIcon, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface FormBookingProps {
  lapanganId: string;
  selectedDate: string;
  selectedSlots: string[];
  hargaPerJam: number;
}

export default function FormBooking({ lapanganId, selectedDate, selectedSlots, hargaPerJam }: FormBookingProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Tahap 1: Data Diri
  const [formData, setFormData] = useState({
    nama_pemesan: '',
    no_hp: '',
    catatan: ''
  });

  const isFormValid = formData.nama_pemesan.trim() !== '' && formData.no_hp.trim().length >= 9 && selectedSlots.length > 0;
  const totalPrice = selectedSlots.length * hargaPerJam;

  // Tahap 2: Upload File
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanjutPembayaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!selectedFile.type.startsWith("image/")) {
        toast.error("File harus berupa gambar (JPG/PNG)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFinalSubmit = async () => {
    if (!file) {
      toast.error("Silakan unggah bukti transfer terlebih dahulu.");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Upload file dulu
      const fileData = new FormData();
      fileData.append("file", file);
      const uploadResult = await uploadBuktiFile(fileData);

      if (!uploadResult.success || !uploadResult.url) {
        toast.error(uploadResult.error || "Gagal mengunggah bukti transfer");
        setLoading(false);
        return;
      }

      // 2. Jika sukses upload, kirim payload lengkap ke database
      const sortedSlots = [...selectedSlots].sort();
      const jamMulai = sortedSlots[0];
      const lastSlotHour = parseInt(sortedSlots[sortedSlots.length - 1].split(':')[0]);
      const jamSelesai = `${(lastSlotHour + 1).toString().padStart(2, '0')}:00`;

      const result = await createBooking({
        lapangan_id: lapanganId,
        tanggal_main: selectedDate,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        nama_pemesan: formData.nama_pemesan,
        no_hp: formData.no_hp,
        catatan: formData.catatan || undefined,
        bukti_pembayaran_url: uploadResult.url
      });

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        setStep(3); // Tampilkan modal sukses
      } else {
        toast.error(result.error || 'Terjadi kesalahan saat memproses pesanan.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const copyToClipboard = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId);
      toast.success("ID Booking berhasil disalin!");
    }
  };

  return (
    <div className="relative">
      {/* TAHAP 1: Form Data Diri */}
      {step === 1 && (
        <form onSubmit={handleLanjutPembayaran} className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-bold font-body text-white mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama_pemesan"
              value={formData.nama_pemesan}
              onChange={handleChange}
              placeholder="Masukkan nama Anda"
              className="w-full bg-surface-darker text-white font-body text-base px-4 py-3 rounded-xl border border-white/10 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-disabled min-h-[44px]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold font-body text-white mb-2">Nomor WhatsApp</label>
            <input 
              type="tel" 
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              className="w-full bg-surface-darker text-white font-body text-base px-4 py-3 rounded-xl border border-white/10 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-disabled min-h-[44px]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold font-body text-white mb-2">Catatan (Opsional)</label>
            <textarea 
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              placeholder="Tambahkan catatan khusus..."
              rows={3}
              className="w-full bg-surface-darker text-white font-body text-base px-4 py-3 rounded-xl border border-white/10 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-disabled resize-none"
            ></textarea>
          </div>

          <div className="pt-2 mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold font-body transition-all h-[48px]
                ${(!isFormValid) 
                  ? 'bg-disabled text-white/50 cursor-not-allowed opacity-50' 
                  : 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active'
                }
              `}
            >
              Lanjut Pembayaran
            </button>
          </div>
        </form>
      )}

      {/* TAHAP 2: Upload Bukti Transfer */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
          <button 
            onClick={() => setStep(1)}
            className="flex items-center text-sm font-body text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </button>

          <div className="bg-surface-darker rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-bold font-body text-white mb-3">Informasi Pembayaran</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary font-body">Total Tagihan</span>
              <span className="text-lg font-bold font-display text-primary">{formatRupiah(totalPrice)}</span>
            </div>
            <div className="text-sm text-text-secondary font-body bg-primary/10 border border-primary/20 rounded-lg p-3 mt-3">
              Silakan transfer sesuai nominal di atas ke rekening berikut:
              <br/><br/>
              <strong className="text-white">BCA 1234567890</strong> a.n. BadmintonSpace
              <br/>
              <strong className="text-white">Mandiri 0987654321</strong> a.n. BadmintonSpace
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold font-body text-white mb-2">Upload Bukti Transfer</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px]
                ${
                  previewUrl
                    ? "border-white/10 bg-surface-darker overflow-hidden"
                    : "border-white/20 hover:border-primary hover:bg-surface-darker bg-surface-darker"
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
                    <span className="text-white font-bold font-body bg-black/70 px-3 py-1.5 rounded-lg text-sm">
                      Ganti Foto
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-surface-dark rounded-full flex items-center justify-center mb-3 border border-white/10 text-primary">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold font-body text-white mb-1">
                    Pilih File Gambar
                  </p>
                  <p className="text-xs font-body text-text-secondary">
                    JPG, PNG (Maks 5MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={!file || loading}
            className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold font-body transition-all h-[48px]
              ${
                !file || loading
                  ? "bg-disabled text-white/50 cursor-not-allowed opacity-50"
                  : "bg-success text-white hover:bg-success/90 active:bg-success/80 shadow-[0px_4px_12px_rgba(34,197,94,0.3)]"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Memproses Pesanan...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Selesaikan Pemesanan
              </>
            )}
          </button>
        </div>
      )}

      {/* TAHAP 3: Overlay Sukses (ID Booking) */}
      {step === 3 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                Pemesanan Berhasil!
              </h3>
              <p className="text-text-secondary font-body text-sm mb-6">
                Data pemesanan dan bukti pembayaran Anda telah kami terima. Harap simpan ID Booking Anda.
              </p>
              
              <div className="w-full bg-surface-darker border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-xs text-text-tertiary font-body uppercase tracking-wider mb-1">ID Booking Anda</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xl text-primary truncate mr-2">{bookingId}</span>
                  <button onClick={copyToClipboard} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-full gap-3">
                <Link
                  href={`/cek-booking?id=${bookingId}`}
                  className="w-full text-center bg-primary text-white py-3 rounded-xl font-bold font-body text-sm hover:bg-primary-hover active:bg-primary-active transition-all"
                >
                  Cek Status Pesanan
                </Link>
                <Link
                  href="/"
                  className="w-full text-center bg-surface-darker text-text-secondary border border-white/10 py-3 rounded-xl font-bold font-body text-sm hover:text-white hover:bg-white/5 transition-all"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
