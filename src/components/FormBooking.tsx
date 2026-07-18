import { useState } from 'react';
import { createBooking } from '@/lib/actions/booking';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FormBookingProps {
  lapanganId: string;
  selectedDate: string;
  selectedSlots: string[];
  hargaPerJam: number;
}

export default function FormBooking({ lapanganId, selectedDate, selectedSlots, hargaPerJam }: FormBookingProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_pemesan: '',
    no_hp: '',
    catatan: ''
  });

  const isFormValid = formData.nama_pemesan.trim() !== '' && formData.no_hp.trim().length >= 9 && selectedSlots.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    const sortedSlots = [...selectedSlots].sort();
    const jamMulai = sortedSlots[0];
    const lastSlotHour = parseInt(sortedSlots[sortedSlots.length - 1].split(':')[0]);
    const jamSelesai = `${(lastSlotHour + 1).toString().padStart(2, '0')}:00`;

    setLoading(true);
    
    try {
      const result = await createBooking({
        lapangan_id: lapanganId,
        tanggal_main: selectedDate,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        nama_pemesan: formData.nama_pemesan,
        no_hp: formData.no_hp,
        catatan: formData.catatan || undefined
      });

      if (result.success && result.bookingId) {
        toast.success('Booking berhasil tersimpan!');
        router.push(`/booking/${result.bookingId}/sukses?new=true`);
      } else {
        toast.error(result.error || 'Terjadi kesalahan saat memproses booking.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          disabled={!isFormValid || loading}
          className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold font-body transition-all h-[48px]
            ${(!isFormValid || loading) 
              ? 'bg-disabled text-white/50 cursor-not-allowed opacity-50' 
              : 'bg-primary text-white hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active'
            }
          `}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Konfirmasi & Pesan (${selectedSlots.length} Jam)`
          )}
        </button>
      </div>
    </form>
  );
}
